import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Expand the product category enums to match the 2026-11 Hongyu catalog sync.
 * Postgres enum values must be added with ALTER TYPE ... ADD VALUE; changing
 * the Payload select options alone does not update the database enum.
 * Old values are kept so historical and unpublished products stay editable.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const value of ['baby', 'fishing-shirt']) {
    await db.execute(sql.raw(`ALTER TYPE "payload"."enum_products_category" ADD VALUE IF NOT EXISTS '${value}'`))
  }
  for (const value of ['short-sleeve', 'sweatpants', 'pullover-hoodie', 'crewneck-sweatshirt', 'tank-top']) {
    await db.execute(sql.raw(`ALTER TYPE "payload"."enum_products_subcategory" ADD VALUE IF NOT EXISTS '${value}'`))
  }
}

/** Postgres cannot remove enum values safely; leaving them is harmless. */
export async function down(_args: MigrateDownArgs): Promise<void> {
  // no-op: enum values are additive and retained for historical products
}
