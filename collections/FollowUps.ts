import type { CollectionConfig } from "payload";
import { crmAccess } from "../lib/crm/access.ts";
import { FOLLOW_UP_CHANNELS, toOptions } from "../lib/crm/options.ts";

export const FollowUps: CollectionConfig = {
  slug: "follow-ups",
  labels: { singular: "跟进记录", plural: "跟进记录" },
  admin: {
    useAsTitle: "summary",
    defaultColumns: ["summary", "customer", "channel", "date", "nextFollowUpAt", "author"],
    group: "客户与销售",
    description: "每次和客户沟通记一条。填写「下次跟进」会同步到客户的跟进日期，概览页会提醒。",
  },
  defaultSort: "-date",
  access: crmAccess,
  hooks: {
    beforeChange: [({ data, operation, req }) => {
      if (operation === "create" && !data.author && req.user) return { ...data, author: req.user.id };
      return data;
    }],
    afterChange: [async ({ doc, req }) => {
      const customerId = typeof doc.customer === "object" ? doc.customer?.id : doc.customer;
      if (!customerId || !doc.nextFollowUpAt) return doc;
      await req.payload.update({
        collection: "customers",
        id: customerId,
        req,
        data: { nextFollowUpAt: doc.nextFollowUpAt },
      });
      return doc;
    }],
  },
  fields: [
    { name: "customer", type: "relationship", relationTo: "customers", label: "客户", required: true, index: true },
    { name: "summary", type: "text", label: "摘要", required: true, admin: { description: "一句话，例如「发了第二轮样品报价」" } },
    { name: "content", type: "textarea", label: "详细内容" },
    {
      name: "date",
      type: "date",
      label: "沟通时间",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "channel",
      type: "select",
      label: "沟通渠道",
      defaultValue: "whatsapp",
      options: toOptions(FOLLOW_UP_CHANNELS),
      admin: { position: "sidebar" },
    },
    {
      name: "nextFollowUpAt",
      type: "date",
      label: "下次跟进",
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly", displayFormat: "yyyy-MM-dd" } },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      label: "记录人",
      admin: { position: "sidebar" },
    },
  ],
};
