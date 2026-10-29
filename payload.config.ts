import path from "node:path";
import { fileURLToPath } from "node:url";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { zh } from "@payloadcms/translations/languages/zh";
import { buildConfig } from "payload";
import { Customers } from "./collections/Customers.ts";
import { FollowUps } from "./collections/FollowUps.ts";
import { Inquiries } from "./collections/Inquiries.ts";
import { Knowledge } from "./collections/Knowledge.ts";
import { Orders } from "./collections/Orders.ts";
import { Posts } from "./collections/Posts.ts";
import { Products } from "./collections/Products.ts";
import { SalesScripts } from "./collections/SalesScripts.ts";
import { Users } from "./collections/Users.ts";
import { postgresOptions } from "./lib/database/postgres-options.mjs";
import { payloadPg } from "./lib/database/payload-pg.mjs";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const sqliteUrl = process.env.DATABASE_URL ?? `file:${path.resolve(dirname, "data/payload.db").replaceAll("\\", "/")}`;
const isPostgres = /^postgres(?:ql)?:\/\//.test(sqliteUrl);
const secret = process.env.PAYLOAD_SECRET;
const deploymentOrigins = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
  .filter((host): host is string => Boolean(host))
  .map((host) => `https://${host}`);
const allowedOrigins = [...new Set([
  "http://localhost:3000",
  "https://www.lin6666.top",
  ...deploymentOrigins,
  ...(process.env.CMS_LOCAL_ORIGIN && ["localhost", "127.0.0.1"].includes(new URL(process.env.CMS_LOCAL_ORIGIN).hostname)
    ? [process.env.CMS_LOCAL_ORIGIN] : []),
])];

if (process.env.VERCEL && !isPostgres) {
  throw new Error("Vercel requires a persistent Postgres DATABASE_URL for Payload.");
}
if (process.env.NODE_ENV === "production" && !secret) {
  throw new Error("Set PAYLOAD_SECRET before building or starting production.");
}

export default buildConfig({
  i18n: {
    fallbackLanguage: "zh",
    supportedLanguages: { zh },
  },
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: " - Mulang 后台" },
    components: {
      beforeNavLinks: ["/components/admin/NavLinks#NavLinks"],
      views: {
        dashboard: { Component: "/components/admin/Dashboard#Dashboard", meta: { title: "概览" } },
        crmBoard: {
          Component: "/components/admin/SalesBoardView#SalesBoardView",
          path: "/crm-board",
          meta: { title: "CRM 销售看板" },
        },
      },
    },
  },
  // Nav groups follow this order: 内容与产品 → 客户与销售 → 系统.
  collections: [Products, Posts, SalesScripts, Knowledge, Customers, Inquiries, Orders, FollowUps, Users],
  editor: lexicalEditor({}),
  db: isPostgres ? postgresAdapter({
    pg: payloadPg,
    pool: postgresOptions(sqliteUrl),
    schemaName: "payload",
    push: false,
    migrationDir: path.resolve(dirname, "migrations/postgres"),
  }) : sqliteAdapter({
    client: {
      url: sqliteUrl,
    },
    wal: true,
  }),
  secret: secret ?? "mulang-local-payload-prototype-secret",
  cors: allowedOrigins,
  csrf: allowedOrigins,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
