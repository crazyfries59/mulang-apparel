import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { crmAccess } from "../lib/crm/access.ts";
import { CUSTOMER_SOURCES, INQUIRY_STATUSES, toOptions } from "../lib/crm/options.ts";

/* Marking an inquiry "已转客户" without picking a customer creates one from the inquiry,
   so a website lead becomes a customer record in one click. */
const convertToCustomer: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (data.status !== "converted" || data.customer) return data;
  const customer = await req.payload.create({
    collection: "customers",
    req,
    data: {
      name: data.company || data.name,
      contactName: data.name,
      email: data.email || undefined,
      whatsapp: data.whatsapp,
      country: data.country,
      productFocus: data.productType,
      source: data.source,
      stage: "contacted",
      owner: data.owner ?? req.user?.id,
    },
  });
  return { ...data, customer: customer.id };
};

export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  labels: { singular: "询盘", plural: "询盘" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "company", "country", "productType", "status", "receivedAt"],
    group: "客户与销售",
    listSearchableFields: ["name", "company", "email", "message"],
    description: "官网联系表单提交会自动出现在这里，也可以手动登记邮件或 WhatsApp 来的询盘。状态改为「已转客户」会自动建客户。",
  },
  defaultSort: "-receivedAt",
  access: crmAccess,
  hooks: { beforeChange: [convertToCustomer] },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: "姓名", required: true },
        { name: "company", type: "text", label: "公司 / 品牌" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "email", type: "email", label: "邮箱" },
        { name: "whatsapp", type: "text", label: "WhatsApp" },
        { name: "country", type: "text", label: "国家 / 地区" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "productType", type: "text", label: "产品类型" },
        { name: "quantity", type: "text", label: "数量" },
      ],
    },
    { name: "message", type: "textarea", label: "询盘内容", required: true },
    { name: "reply", type: "textarea", label: "回复要点 / 内部备注" },
    {
      name: "status",
      type: "select",
      label: "处理状态",
      required: true,
      defaultValue: "new",
      index: true,
      options: toOptions(INQUIRY_STATUSES),
      admin: { position: "sidebar" },
    },
    {
      name: "source",
      type: "select",
      label: "来源",
      defaultValue: "website",
      options: toOptions(CUSTOMER_SOURCES),
      admin: { position: "sidebar" },
    },
    {
      name: "receivedAt",
      type: "date",
      label: "收到时间",
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      label: "关联客户",
      admin: { position: "sidebar" },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      label: "负责人",
      admin: { position: "sidebar" },
    },
  ],
};
