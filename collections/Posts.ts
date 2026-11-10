import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { publishedPostWhere, withPublicationDate } from "../lib/content/publication.ts";
import { revalidatePosts } from "../lib/content/cache-tags.ts";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "文章", plural: "文章" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    group: "内容与产品",
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
    afterChange: [async ({ doc }) => { await revalidatePosts(); return doc; }],
    afterDelete: [async ({ doc }) => { await revalidatePosts(); return doc; }],
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
      admin: { description: "列表页摘要和默认 SEO 描述。建议 140–155 字符，一句话说清这篇解决什么问题。" },
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
      admin: {
        description:
          "填站内图片路径（以 /products/ 开头）或外部 http 图片地址。选用与文章主题一致的实拍图：写工艺的用看得见工艺的图，不要用无关成品图，同一张图不要在站内重复当封面。",
      },
    },
    {
      name: "body",
      type: "richText",
      label: "正文",
      required: true,
      editor: lexicalEditor({}),
      admin: {
        description:
          "排版已由网站统一控制：H2 标题最大、H3 次之、正文偏小、段落之间自动留白。写的时候只用「标题 H2／H3 + 段落 + 项目符号 + 表格」，不要再手动调字号或插空行；每段控制在 2–4 句。",
      },
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
