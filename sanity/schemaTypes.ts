import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "category", title: "Category", type: "string", initialValue: "Manufacturing" }),
    defineField({ name: "readMinutes", title: "Reading time (minutes)", type: "number", initialValue: 5, validation: (rule) => rule.min(1).max(60) }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "body",
      title: "Article body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3 }),
    defineField({ name: "publishedAt", title: "Publish date", type: "datetime" }),
    defineField({ name: "featured", title: "Featured article", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});

export const schemaTypes = [post];
