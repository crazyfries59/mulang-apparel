import type { CollectionConfig, PayloadRequest } from "payload";
import { invoiceAccess, isAdminUser } from "../lib/crm/access.ts";
import {
  CURRENCIES,
  FX_TARGETS,
  INVOICE_DOC_TYPES,
  INVOICE_KINDS,
  INVOICE_STATUSES,
  PAY_METHODS,
  SIZE_KEYS,
  toOptions,
} from "../lib/crm/options.ts";

const num = (value: unknown): number => (typeof value === "number" && Number.isFinite(value) ? value : 0);
const r2 = (value: number): number => Math.round(value * 100) / 100;
const pad = (value: number): string => String(value).padStart(2, "0");

/* 数据库列名不能用 3XL 这种以数字开头的写法，字段名加前缀，label 仍显示尺码。 */
const SIZE_FIELD_NAMES: Record<(typeof SIZE_KEYS)[number], string> = {
  XS: "sizeXs",
  S: "sizeS",
  M: "sizeM",
  L: "sizeL",
  XL: "sizeXl",
  XXL: "sizeXxl",
  "3XL": "size3xl",
};

const relId = (value: unknown): number | string | null => {
  if (typeof value === "number" || typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    if (typeof id === "number" || typeof id === "string") return id;
  }
  return null;
};

type SizeMap = Record<string, number | null | undefined>;

type LineItem = {
  product?: string | null;
  colorSize?: string | null;
  description?: string | null;
  fabric?: string | null;
  image?: string | null;
  unitPrice?: number | null;
  qty?: number | null;
  rowAmount?: number | null;
  sizes?: SizeMap | null;
};

type AmountRow = { amount?: number | null };

/* 编号：MLA-年月日-序号。按当天已有编号取最大值 +1，不依赖字符串排序（跨过 99 也不会错）。 */
const nextInvoiceNumber = async (req: PayloadRequest, date?: string | null): Promise<string> => {
  const when = date ? new Date(date) : new Date();
  const stamp = `${when.getFullYear()}${pad(when.getMonth() + 1)}${pad(when.getDate())}`;
  const prefix = `MLA-${stamp}-`;
  const found = await req.payload.find({
    collection: "invoices",
    where: { number: { like: prefix } },
    limit: 200,
    depth: 0,
  });
  const max = found.docs.reduce((top, doc) => {
    const seq = Number.parseInt(String(doc.number ?? "").slice(prefix.length), 10);
    return Number.isFinite(seq) && seq > top ? seq : top;
  }, 0);
  return `${prefix}${pad(max + 1)}`;
};

export const Invoices: CollectionConfig = {
  slug: "invoices",
  labels: { singular: "发票", plural: "发票" },
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "customer", "kind", "date", "status", "issuedBy"],
    group: "客户与销售",
    listSearchableFields: ["number", "billToCompany", "billToContact"],
    description: "开票：选客户带出抬头，填明细自动算合计、定金和尾款。所有金额由系统计算，不手填。",
    components: {
      edit: {
        beforeDocumentControls: ["/components/admin/InvoiceExport#InvoiceExport"],
      },
    },
  },
  defaultSort: "-number",
  access: invoiceAccess,
  hooks: {
    beforeValidate: [async ({ data, operation, req, originalDoc }) => {
      const next = { ...data };

      if (operation === "create" && !next.number) {
        next.number = await nextInvoiceNumber(req, next.date);
      }
      if (operation === "create" && !next.issuedBy && req.user) {
        next.issuedBy = req.user.id;
      }

      /* 客户抬头：新建时从客户表抄一份快照；之后客户资料再改，这张票不动。 */
      const customerId = relId(next.customer);
      if (customerId !== null) {
        const customer = await req.payload.findByID({
          collection: "customers",
          id: customerId,
          depth: 0,
          req,
          overrideAccess: true,
        });
        if (!isAdminUser(req.user) && relId(customer.owner) !== relId(req.user?.id)) {
          throw new Error("只能给负责人是自己的客户开票");
        }
        const switched = operation === "create" || relId(originalDoc?.customer) !== customerId;
        if (switched) {
          next.billToCompany = next.billToCompany || customer.name;
          next.billToContact = next.billToContact || customer.contactName;
          next.billToTel = next.billToTel || customer.phone || customer.whatsapp;
          next.billToEmail = next.billToEmail || customer.email;
          next.billToAddress = next.billToAddress || customer.billingAddress;
          next.billToPostcode = next.billToPostcode || customer.billingPostcode;
        }
      }

      /* 明细：尺码相加得数量，数量 × 单价得行金额。 */
      const items = ((next.items ?? []) as unknown as LineItem[]).map((item) => {
        const sizes = item.sizes ?? {};
        const sizeQty = SIZE_KEYS.reduce((sum, key) => sum + num(sizes[SIZE_FIELD_NAMES[key]]), 0);
        const qty = sizeQty > 0 ? sizeQty : num(item.qty);
        return { ...item, qty, rowAmount: r2(qty * num(item.unitPrice)) };
      });
      next.items = items as typeof next.items;

      const subtotal = r2(items.reduce((sum, item) => sum + num(item.rowAmount), 0));
      const shipping = r2(((next.shipping ?? []) as unknown as AmountRow[]).reduce((sum, row) => sum + num(row.amount), 0));
      const total = r2(subtotal + shipping);
      const payments = (next.payments ?? []) as unknown as AmountRow[];
      const received = r2(payments.reduce((sum, row) => sum + num(row.amount), 0));

      /* 一分没收到的大货单，按 50% 定金 + 尾款；样品单和已收款的按实际到账算。 */
      const isBulk = next.kind !== "sample";
      const deposit = !received && isBulk ? r2(total * 0.5) : 0;
      const balance = !received && isBulk ? r2(total - deposit) : r2(total - received);

      next.totals = { subtotal, shipping, total, received, deposit, balance };

      /* 换算金额：1 外币 = quote USD，所以 USD 金额 ÷ 汇率 = 外币金额。 */
      if (next.fx?.currency && num(next.fx.quote) > 0) {
        const base = next.fx.on === "balance" ? balance : total;
        next.fx = { ...next.fx, amount: r2(base / num(next.fx.quote)) };
      } else if (next.fx) {
        next.fx = { ...next.fx, amount: null };
      }

      return next;
    }],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "number",
          type: "text",
          label: "发票编号",
          required: true,
          unique: true,
          index: true,
          admin: { readOnly: true, description: "自动生成：MLA-年月日-序号，同一天按顺序往下排。" },
        },
        {
          name: "date",
          type: "date",
          label: "开票日期",
          required: true,
          defaultValue: () => new Date(),
          admin: { date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" } },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "customer", type: "relationship", relationTo: "customers", label: "客户", required: true, index: true },
        { name: "kind", type: "select", label: "发票类型", required: true, defaultValue: "bulk", options: toOptions(INVOICE_KINDS) },
      ],
    },
    {
      type: "collapsible",
      label: "开票抬头",
      admin: { description: "选中客户并保存一次后，这里会自动带出客户表的地址电话；也可以直接手改。存的是快照，客户资料以后改了旧票不会跟着变。" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "billToCompany", type: "text", label: "公司 Company" },
            { name: "billToContact", type: "text", label: "联系人 Contact" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "billToTel", type: "text", label: "电话 Tel" },
            { name: "billToEmail", type: "text", label: "邮箱 Email" },
          ],
        },
        { name: "billToAddress", type: "textarea", label: "地址 Address" },
        { name: "billToPostcode", type: "text", label: "邮编 Postcode" },
      ],
    },
    {
      name: "items",
      type: "array",
      label: "商品明细",
      labels: { singular: "商品行", plural: "商品明细" },
      minRows: 1,
      required: true,
      fields: [
        {
          type: "row",
          fields: [
            { name: "product", type: "text", label: "款号 Style #", required: true },
            { name: "colorSize", type: "text", label: "颜色 Color" },
            { name: "unitPrice", type: "number", label: "单价 USD", min: 0, required: true },
          ],
        },
        {
          name: "description",
          type: "textarea",
          label: "工艺 / 描述",
          admin: { description: "例如 Front: DTF Printing / Back: DTG Printing" },
        },
        {
          type: "row",
          fields: [
            { name: "fabric", type: "text", label: "面料 Fabric", admin: { description: "成分 + 克重，例如 100% Cotton 430gsm" } },
            { name: "image", type: "text", label: "图片路径 / URL", admin: { description: "留空则导出时按款号取产品库主图" } },
          ],
        },
        {
          name: "sizes",
          type: "group",
          label: "尺码数量",
          admin: { description: "按尺码填件数，合计自动算。没有尺码的辅料行只填下面的数量。" },
          fields: SIZE_KEYS.map((size) => ({
            name: SIZE_FIELD_NAMES[size],
            type: "number" as const,
            label: size,
            min: 0,
          })),
        },
        {
          type: "row",
          fields: [
            { name: "qty", type: "number", label: "数量合计", admin: { readOnly: true, description: "尺码相加；只填了数量没有尺码时用这个数" } },
            { name: "rowAmount", type: "number", label: "行金额 USD", admin: { readOnly: true } },
          ],
        },
      ],
    },
    {
      name: "shipping",
      type: "array",
      label: "运费 / 其他费用",
      labels: { singular: "费用行", plural: "运费与其他费用" },
      admin: { description: "快递费、海运、辅料费都可以分行列。金额没定可以先留空，合计按 0 算。" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", label: "名称", defaultValue: "Regular sea freight" },
            { name: "amount", type: "number", label: "金额 USD", min: 0 },
          ],
        },
      ],
    },
    {
      name: "payments",
      type: "array",
      label: "已收款",
      labels: { singular: "收款", plural: "收款记录" },
      admin: { description: "按实际到账填，可以多笔。一分没收时大货单自动按 50% 定金显示。" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "date", type: "date", label: "到账日期", admin: { date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" } } },
            { name: "method", type: "select", label: "方式", defaultValue: "tt", options: toOptions(PAY_METHODS) },
            { name: "amount", type: "number", label: "金额 USD", min: 0 },
          ],
        },
      ],
    },
    {
      name: "fx",
      type: "group",
      label: "换算币种（可选）",
      admin: { description: "发票上只印 USD 合计；选了币种只多一行换算金额，票面不印汇率。" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "currency", type: "select", label: "币种", options: toOptions(CURRENCIES.filter((item) => item.value !== "USD")) },
            { name: "quote", type: "number", label: "汇率", admin: { description: "1 外币 = ? USD，填连连「卖外币买 USD」看到的报价" } },
            { name: "on", type: "select", label: "换算基数", defaultValue: "total", options: toOptions(FX_TARGETS) },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "readAt", type: "text", label: "汇率时间", admin: { description: "例如 2026-11-07 09:20" } },
            { name: "source", type: "text", label: "来源", defaultValue: "手填" },
            { name: "amount", type: "number", label: "换算金额", admin: { readOnly: true } },
          ],
        },
      ],
    },
    {
      name: "totals",
      type: "group",
      label: "金额汇总（自动计算）",
      admin: { description: "全部由系统算，不用填。保存时会按明细重新算一遍。" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "subtotal", type: "number", label: "商品合计 USD", admin: { readOnly: true } },
            { name: "shipping", type: "number", label: "运费 USD", admin: { readOnly: true } },
            { name: "total", type: "number", label: "TOTAL USD", admin: { readOnly: true } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "received", type: "number", label: "已收 USD", admin: { readOnly: true } },
            { name: "deposit", type: "number", label: "50% 定金 USD", admin: { readOnly: true } },
            { name: "balance", type: "number", label: "尾款 USD", admin: { readOnly: true } },
          ],
        },
      ],
    },
    {
      name: "docType",
      type: "select",
      label: "单据类型",
      required: true,
      defaultValue: "pi",
      options: toOptions(INVOICE_DOC_TYPES),
      admin: { position: "sidebar", description: "PI 给客户付款用，CI 报关用。票面标题目前都印 Commercial Invoice。" },
    },
    {
      name: "status",
      type: "select",
      label: "状态",
      required: true,
      defaultValue: "draft",
      options: toOptions(INVOICE_STATUSES),
      admin: { position: "sidebar" },
    },
    {
      name: "voidReason",
      type: "text",
      label: "作废原因",
      admin: { position: "sidebar", condition: (data) => data?.status === "void" },
      validate: (value: unknown, { data }: { data?: Record<string, unknown> }) =>
        data?.status === "void" && !value ? "作废必须写原因，方便以后查为什么废了" : true,
    },
    {
      name: "issuedBy",
      type: "relationship",
      relationTo: "users",
      label: "开票人",
      admin: { position: "sidebar", readOnly: true, description: "自动记录当前登录用户。" },
    },
    {
      name: "note",
      type: "textarea",
      label: "内部备注",
      admin: { position: "sidebar", description: "只给自己看，不上票面。" },
    },
  ],
};
