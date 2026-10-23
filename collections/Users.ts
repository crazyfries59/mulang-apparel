import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "用户", plural: "用户" },
  auth: { cookies: { secure: process.env.NODE_ENV === "production" } },
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "姓名",
    },
  ],
};
