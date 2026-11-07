import type { CollectionConfig } from "payload";
import { ownedCustomerAccess } from "../lib/crm/access.ts";
import { COOPERATION_MODES, CURRENCIES, CUSTOMER_SOURCES, CUSTOMER_STAGES, toOptions } from "../lib/crm/options.ts";

export const Customers: CollectionConfig = {
  slug: "customers",
  labels: { singular: "客户", plural: "客户" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "country", "stage", "owner", "nextFollowUpAt", "updatedAt"],
    group: "客户与销售",
    listSearchableFields: ["name", "contactName", "email", "whatsapp", "country"],
    description: "客户台账：联系方式、销售阶段、负责人和下次跟进时间。开票用的地址和币种也在上面，发票会把它们抄成快照。",
  },
  access: ownedCustomerAccess,
  hooks: {
    beforeChange: [({ data, operation, req }) => {
      if (operation === "create" && !data.owner && req.user) return { ...data, owner: req.user.id };
      return data;
    }],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: "客户 / 品牌名称", required: true, index: true },
        { name: "contactName", type: "text", label: "联系人" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "country", type: "text", label: "国家 / 地区", index: true },
        { name: "email", type: "email", label: "邮箱" },
        { name: "whatsapp", type: "text", label: "WhatsApp" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "website", type: "text", label: "网站 / 社媒" },
        { name: "productFocus", type: "text", label: "主要品类", admin: { description: "例如 卫衣、T 恤、腰带" } },
      ],
    },
    {
      type: "collapsible",
      label: "开票信息",
      admin: { description: "开票时自动带到发票抬头。地址写成客户能直接拿去清关的完整英文地址。" },
      fields: [
        { name: "billingAddress", type: "textarea", label: "开票地址 Address" },
        {
          type: "row",
          fields: [
            { name: "billingPostcode", type: "text", label: "邮编 Postcode" },
            { name: "phone", type: "text", label: "电话 Phone" },
            { name: "currency", type: "select", label: "常用币种", defaultValue: "USD", options: toOptions(CURRENCIES) },
          ],
        },
      ],
    },
    {
      name: "cooperation",
      type: "select",
      label: "合作模式",
      hasMany: true,
      options: toOptions(COOPERATION_MODES),
    },
    {
      name: "notes",
      type: "textarea",
      label: "备注",
      admin: { description: "需求要点、付款习惯、注意事项等。报价、MOQ 等以实际确认为准。" },
    },
    {
      name: "localFolder",
      type: "text",
      label: "本地资料文件夹",
      admin: { description: "电脑上存放该客户设计稿、发票、水单的文件夹路径，只作记录，不上传文件。" },
    },
    {
      name: "stage",
      type: "select",
      label: "销售阶段",
      required: true,
      defaultValue: "new",
      index: true,
      options: toOptions(CUSTOMER_STAGES),
      admin: { position: "sidebar" },
    },
    {
      name: "source",
      type: "select",
      label: "客户来源",
      options: toOptions(CUSTOMER_SOURCES),
      admin: { position: "sidebar" },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      label: "负责人",
      admin: { position: "sidebar", description: "新建时默认是创建人。" },
    },
    {
      name: "nextFollowUpAt",
      type: "date",
      label: "下次跟进",
      index: true,
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" } },
    },
    {
      name: "inquiries",
      type: "join",
      collection: "inquiries",
      on: "customer",
      label: "询盘",
      defaultSort: "-receivedAt",
    },
    {
      name: "orders",
      type: "join",
      collection: "orders",
      on: "customer",
      label: "订单与样品",
      defaultSort: "-createdAt",
    },
    {
      name: "followUps",
      type: "join",
      collection: "follow-ups",
      on: "customer",
      label: "跟进记录",
      defaultSort: "-date",
    },
    {
      name: "invoices",
      type: "join",
      collection: "invoices",
      on: "customer",
      label: "发票",
      defaultSort: "-number",
    },
  ],
};
