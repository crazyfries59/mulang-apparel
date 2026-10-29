import type { Access, FieldAccess } from "payload";

/* Two roles: admins manage accounts and may delete records; sales colleagues can read and
   edit every CRM record but cannot remove data or change who has access. */
export const ROLES = [
  { value: "admin", label: "管理员" },
  { value: "sales", label: "业务员" },
] as const;

type RoleUser = { role?: string | null } | null | undefined;

export const isAdminUser = (user: RoleUser) => user?.role === "admin";

export const signedIn: Access = ({ req }) => Boolean(req.user);
export const adminOnly: Access = ({ req }) => isAdminUser(req.user);
export const adminOnlyField: FieldAccess = ({ req }) => isAdminUser(req.user);

export const adminOrSelf: Access = ({ req }) => {
  if (!req.user) return false;
  if (isAdminUser(req.user)) return true;
  return { id: { equals: req.user.id } };
};

/* Every CRM collection shares this: signed-in staff work on records, only admins delete. */
export const crmAccess = {
  read: signedIn,
  create: signedIn,
  update: signedIn,
  delete: adminOnly,
};
