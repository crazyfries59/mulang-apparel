import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { crmAccess } from "../lib/crm/access.ts";
import { KNOWLEDGE_CATEGORIES, toOptions } from "../lib/crm/options.ts";

export const Knowledge: CollectionConfig = {
  slug: "knowledge",
  labels: { singular: "知识条目", plural: "知识库" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "updatedAt"],
    group: "内容与产品",
    listSearchableFields: ["title", "summary"],
    description: "面料、工艺、尺码、辅料、物流、报价规则等内部资料，供同事查阅。",
  },
  access: crmAccess,
  fields: [
    { name: "title", type: "text", label: "标题", required: true },
    { name: "summary", type: "textarea", label: "要点摘要" },
    { name: "body", type: "richText", label: "正文", editor: lexicalEditor({}) },
    {
      name: "category",
      type: "select",
      label: "分类",
      required: true,
      options: toOptions(KNOWLEDGE_CATEGORIES),
      admin: { position: "sidebar" },
    },
  ],
};
