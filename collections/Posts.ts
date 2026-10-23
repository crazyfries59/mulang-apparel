import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { publishedPostWhere, withPublicationDate } from "../lib/content/publication.ts";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "文章", plural: "文章" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    group: "内容",
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  access: {
    read: ({ req }) => req.user ? true : publishedPostWhere(),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [({ data, originalDoc }) => withPublicationDate(data, originalDoc)],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "标题",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "slug",
      type: "text",
      label: "URL 路径",
      required: true,
      unique: true,
      admin: { position: "sidebar", description: "公开 URL，例如 custom-hoodie-manufacturing" },
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "摘要",
      required: true,
      admin: { description: "列表页摘要和默认 SEO 描述" },
    },
    {
      name: "category",
      type: "select",
      label: "分类",
      required: true,
      defaultValue: "Manufacturing",
      options: [
        { label: "Manufacturing", value: "Manufacturing" },
        { label: "Brand Startup", value: "Brand Startup" },
        { label: "Custom Apparel", value: "Custom Apparel" },
        { label: "OEM & ODM", value: "OEM & ODM" },
        { label: "Industry News", value: "Industry News" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "readMinutes",
      type: "number",
      label: "阅读时长（分钟）",
      required: true,
      defaultValue: 7,
      min: 1,
      max: 60,
      admin: { position: "sidebar", step: 1 },
    },
    {
      name: "coverImage",
      type: "text",
      label: "封面图片路径",
      required: true,
      defaultValue: "/products/y2k-fashion/bx8105-rib-260gsm-stretch-crop-y2k-baby-tee/img-1.jpg",
      admin: { description: "先使用网站图片路径；后续可接入 Media 图片库" },
    },
    {
      name: "body",
      type: "richText",
      label: "正文",
      required: true,
      editor: lexicalEditor({}),
    },
    {
      name: "publishedAt",
      type: "date",
      label: "发布时间",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
        description: "点击发布时留空会自动使用当前时间；未来时间的文章到时才公开。草稿请用“保存草稿”。",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "精选文章",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "seo",
      type: "group",
      label: "搜索引擎优化（SEO）",
      fields: [
        { name: "title", type: "text", label: "SEO 标题" },
        { name: "description", type: "textarea", label: "SEO 描述" },
      ],
    },
  ],
};
