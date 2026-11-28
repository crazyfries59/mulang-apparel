import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Add the multi-dimensional filter attributes field to products (both the
 * live table and the drafts version table). Stored as jsonb rather than a
 * Postgres enum: values come from Hongyu's taxonomy and change over time,
 * and enum ALTER TYPE needs an owner account the runtime role does not have.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "payload"."products" ADD COLUMN IF NOT EXISTS "attributes" jsonb`))
  await db.execute(sql.raw(`ALTER TABLE "payload"."_products_v" ADD COLUMN IF NOT EXISTS "attributes" jsonb`))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "payload"."products" DROP COLUMN IF EXISTS "attributes"`))
  await db.execute(sql.raw(`ALTER TABLE "payload"."_products_v" DROP COLUMN IF EXISTS "attributes"`))
}
