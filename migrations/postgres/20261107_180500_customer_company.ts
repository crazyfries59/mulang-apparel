import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * 客户表补「公司」列。
 *
 * 发票上的 Company 栏原来取客户名（mel / alex 这种），不像正式抬头；
 * 有了这列就能印 Brian. The Label、24Forge 这种真正的公司名，留空仍回落到客户名。
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."customers" ADD COLUMN IF NOT EXISTS "company" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."customers" DROP COLUMN IF EXISTS "company";`)
}
