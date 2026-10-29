import type { CollectionConfig } from "payload";
import { crmAccess } from "../lib/crm/access.ts";
import { LANGUAGES, SCRIPT_CATEGORIES, toOptions } from "../lib/crm/options.ts";

export const SalesScripts: CollectionConfig = {
  slug: "sales-scripts",
  labels: { singular: "话术", plural: "话术库" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "language", "updatedAt"],
    group: "内容与产品",
    listSearchableFields: ["title", "content"],
    description: "开发信、询盘回复、跟进、转化大货等常用话术，同事可直接复制使用。",
  },
  access: crmAccess,
  fields: [
    { name: "title", type: "text", label: "标题", required: true },
    { name: "content", type: "textarea", label: "话术正文", required: true, admin: { rows: 12 } },
    { name: "usage", type: "textarea", label: "使用场景 / 注意事项" },
    {
      name: "category",
      type: "select",
      label: "分类",
      required: true,
      options: toOptions(SCRIPT_CATEGORIES),
      admin: { position: "sidebar" },
    },
    {
      name: "language",
      type: "select",
      label: "语言",
      defaultValue: "en",
      options: toOptions(LANGUAGES),
      admin: { position: "sidebar" },
    },
  ],
};
