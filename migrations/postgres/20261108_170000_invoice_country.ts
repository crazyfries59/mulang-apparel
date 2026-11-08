import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * 发票抬头补「国家」列。
 *
 * 抬头原来只有公司/联系人/电话/邮箱/地址/邮编，报关和 PI 上要写清楚国家，
 * 所以单独留一列，选中客户时从客户表的 country 抄快照。
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."invoices" ADD COLUMN IF NOT EXISTS "bill_to_country" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."invoices" DROP COLUMN IF EXISTS "bill_to_country";`)
}
