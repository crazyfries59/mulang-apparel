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

/* 客户：业务员只看负责人是自己的。admin 不受限。
   上线前必须把所有 owner 为空的客户补齐，否则业务员登录后看不到自己的客户。 */
const ownerScopedRead: Access = ({ req }) => {
  if (!req.user) return false;
  if (isAdminUser(req.user)) return true;
  return { owner: { equals: req.user.id } };
};

const ownerScopedUpdate: Access = ({ req }) => {
  if (!req.user) return false;
  if (isAdminUser(req.user)) return true;
  return { owner: { equals: req.user.id } };
};

export const ownedCustomerAccess = {
  read: ownerScopedRead,
  create: signedIn,
  update: ownerScopedUpdate,
  delete: adminOnly,
};

/* 发票：业务员只看自己开的票，连价格也看不到别人的。 */
const issuerScopedRead: Access = ({ req }) => {
  if (!req.user) return false;
  if (isAdminUser(req.user)) return true;
  return { issuedBy: { equals: req.user.id } };
};

const issuerScopedUpdate: Access = ({ req }) => {
  if (!req.user) return false;
  if (isAdminUser(req.user)) return true;
  return { issuedBy: { equals: req.user.id } };
};

export const invoiceAccess = {
  read: issuerScopedRead,
  create: signedIn,
  update: issuerScopedUpdate,
  delete: adminOnly,
};
