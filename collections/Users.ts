import type { CollectionConfig } from "payload";
import { adminOnly, adminOnlyField, adminOrSelf, ROLES, signedIn } from "../lib/crm/access.ts";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "用户", plural: "用户与权限" },
  auth: { cookies: { secure: process.env.NODE_ENV === "production" } },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
    group: "系统",
    description: "管理员可以新建同事账号、分配角色和删除记录；业务员可以查看和编辑所有客户、询盘与订单。",
  },
  access: {
    read: signedIn,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [async ({ data, operation, req }) => {
      // The very first account (create-first-user) must be able to manage everyone else.
      if (operation !== "create") return data;
      const { totalDocs } = await req.payload.count({ collection: "users", req, overrideAccess: true });
      return totalDocs === 0 ? { ...data, role: "admin" } : data;
    }],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "姓名",
    },
    {
      name: "role",
      type: "select",
      label: "角色",
      required: true,
      defaultValue: "sales",
      saveToJWT: true,
      options: ROLES.map(({ value, label }) => ({ value, label })),
      access: { create: adminOnlyField, update: adminOnlyField },
      admin: { position: "sidebar" },
    },
  ],
};
