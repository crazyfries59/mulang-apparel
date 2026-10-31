import type { CollectionConfig } from "payload";
import { revalidateProducts } from "../lib/content/cache-tags.ts";
import { publishedProductWhere, withPublicationDate } from "../lib/content/publication.ts";

const categories = [
  ["kids-wear", "Kids Wear"],
  ["shirt", "Shirt"],
  ["t-shirts", "T-Shirts"],
  ["outdoor-clothing", "Outdoor Clothing"],
  ["pants", "Pants"],
  ["hoodies", "Hoodies"],
  ["denim", "Denim"],
  ["y2k-fashion", "Y2K Fashion"],
  ["sleepwear", "Sleepwear"],
  ["sweater", "Sweater"],
  ["jersey", "Jersey"],
  ["dresses", "Dresses"],
  ["swimwear", "Swimwear"],
  ["accessories", "Accessories"],
] as const;

const subcategories = [
  ["oversized-t-shirt", "Oversized T-Shirt"],
  ["vintage-wash-t-shirt", "Vintage T-Shirt"],
  ["polo", "Polo"],
  ["vest", "Vest"],
  ["long-sleeve", "Long Sleeve"],
  ["basic-fit-t-shirt", "Basic Fit T-Shirt"],
  ["shorts", "Shorts"],
  ["fleece-hoodie", "Fleece Hoodie"],
  ["terry-hoodie", "Terry Hoodie"],
  ["sweatshirt", "Sweatshirt"],
  ["zip-up-hoodie", "Zip Up Hoodie"],
] as const;

const slugify = (value: string) => value
  .normalize("NFKD")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "产品", plural: "产品" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "productCode", "category", "publishedAt", "_status"],
    group: "内容与产品",
    description: "管理官网产品目录。保存草稿不会改变公开页面；点击发布后网站自动同步。",
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  access: {
    read: ({ req }) => req.user ? true : publishedProductWhere(),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [({ data }) => {
      if (data?.name && !data.slug) return { ...data, slug: slugify(data.name) };
      return data;
    }],
    beforeChange: [({ data, originalDoc }) => withPublicationDate(data, originalDoc)],
    afterChange: [async ({ doc }) => { await revalidateProducts(); return doc; }],
    afterDelete: [async ({ doc }) => { await revalidateProducts(); return doc; }],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "产品名称",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "网址路径（slug）",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "公开网址的一部分；留空时按产品名称生成，例如 oversized-cotton-t-shirt。",
      },
    },
    {
      name: "productCode",
      type: "text",
      label: "产品编号 / SKU",
      admin: { position: "sidebar" },
    },
    {
      name: "category",
      type: "select",
      label: "产品分类",
      required: true,
      options: categories.map(([value, label]) => ({ value, label })),
      admin: { position: "sidebar" },
    },
    {
      name: "subcategory",
      type: "select",
      label: "子分类",
      options: [{ value: "", label: "无" }, ...subcategories.map(([value, label]) => ({ value, label }))],
      admin: { position: "sidebar" },
    },
    {
      name: "coverImage",
      type: "text",
      label: "主图路径 / URL",
      required: true,
      admin: {
        description: "当前使用仓库里的产品图片路径（例如 /products/.../img-1.jpg），或填写可公开访问的图片 URL。此处不是文件上传。",
      },
    },
    {
      name: "gallery",
      type: "array",
      label: "产品图集",
      labels: { singular: "图片", plural: "图片" },
      fields: [{ name: "image", type: "text", label: "图片路径 / URL", required: true }],
    },
    {
      name: "details",
      type: "array",
      label: "产品细节图",
      labels: { singular: "细节图", plural: "细节图" },
      fields: [{ name: "image", type: "text", label: "图片路径 / URL", required: true }],
    },
    {
      name: "description",
      type: "textarea",
      label: "产品简介",
    },
    {
      name: "fabric",
      type: "text",
      label: "面料",
    },
    {
      name: "gsm",
      type: "text",
      label: "克重",
    },
    {
      name: "price",
      type: "text",
      label: "展示价格",
      admin: { description: "沿用当前网站显示格式，例如 $6.99；不代表最终报价。" },
    },
    {
      name: "moq",
      type: "text",
      label: "页面显示 MOQ",
    },
    {
      name: "leadTime",
      type: "text",
      label: "页面显示交期",
    },
    {
      name: "badge",
      type: "text",
      label: "角标",
      admin: { description: "可留空；当前支持 Best Seller、New 等文字。" },
    },
    {
      name: "sizes",
      type: "text",
      label: "尺码",
    },
    {
      name: "intro",
      type: "group",
      label: "产品规格说明",
      fields: [
        { name: "feature", type: "textarea", label: "产品特点" },
        { name: "sizeInfo", type: "text", label: "尺码说明" },
        { name: "material", type: "text", label: "面料成分" },
        { name: "weight", type: "text", label: "重量 / 克重" },
        { name: "blank", type: "textarea", label: "空白款说明" },
        { name: "logoCustomization", type: "textarea", label: "Logo 定制" },
        { name: "clothingCustomization", type: "textarea", label: "服装定制" },
      ],
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
    {
      name: "sortOrder",
      type: "number",
      label: "列表顺序",
      defaultValue: 9999,
      min: 0,
      admin: { position: "sidebar", step: 1 },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "发布时间",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
        description: "点击发布时留空会自动填当前时间；设为未来时间则到时才出现在网站。",
      },
    },
  ],
};
