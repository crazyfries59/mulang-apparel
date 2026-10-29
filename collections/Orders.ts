import type { CollectionConfig } from "payload";
import { crmAccess } from "../lib/crm/access.ts";
import { CURRENCIES, ORDER_STAGES, ORDER_TYPES, toOptions } from "../lib/crm/options.ts";

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: { singular: "订单 / 样品", plural: "订单与样品" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "customer", "type", "stage", "quantity", "dueDate", "trackingNumber"],
    group: "客户与销售",
    listSearchableFields: ["title", "trackingNumber", "notes"],
    description: "样品和大货进度：阶段、数量、交期和快递单号。金额与数量按实际确认填写。",
  },
  defaultSort: "-updatedAt",
  access: crmAccess,
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", type: "text", label: "款式 / 订单名称", required: true },
        { name: "customer", type: "relationship", relationTo: "customers", label: "客户", required: true, index: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "quantity", type: "number", label: "数量（件）", min: 0 },
        { name: "amount", type: "number", label: "金额", min: 0 },
        { name: "currency", type: "select", label: "币种", defaultValue: "USD", options: toOptions(CURRENCIES) },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "carrier", type: "text", label: "物流 / 快递" },
        { name: "trackingNumber", type: "text", label: "快递单号" },
      ],
    },
    { name: "notes", type: "textarea", label: "工艺 / 进度备注" },
    {
      name: "type",
      type: "select",
      label: "类型",
      required: true,
      defaultValue: "sample",
      options: toOptions(ORDER_TYPES),
      admin: { position: "sidebar" },
    },
    {
      name: "stage",
      type: "select",
      label: "进度",
      required: true,
      defaultValue: "quoting",
      index: true,
      options: toOptions(ORDER_STAGES),
      admin: { position: "sidebar" },
    },
    {
      name: "dueDate",
      type: "date",
      label: "交期",
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" } },
    },
    {
      name: "shippedAt",
      type: "date",
      label: "发货日期",
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" } },
    },
  ],
};
