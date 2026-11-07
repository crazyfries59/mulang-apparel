import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "payload"."enum_invoices_kind" AS ENUM('bulk', 'sample');
  CREATE TYPE "payload"."enum_invoices_doc_type" AS ENUM('pi', 'ci');
  CREATE TYPE "payload"."enum_invoices_status" AS ENUM('draft', 'sent', 'settled', 'void');
  CREATE TYPE "payload"."enum_invoices_fx_currency" AS ENUM('EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY');
  CREATE TYPE "payload"."enum_invoices_fx_on" AS ENUM('total', 'balance');
  CREATE TYPE "payload"."enum_invoices_payments_method" AS ENUM('tt');
  CREATE TYPE "payload"."enum_customers_currency" AS ENUM('USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY');

  CREATE TABLE "payload"."invoices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"customer_id" integer NOT NULL,
  	"kind" "payload"."enum_invoices_kind" DEFAULT 'bulk' NOT NULL,
  	"bill_to_company" varchar,
  	"bill_to_contact" varchar,
  	"bill_to_tel" varchar,
  	"bill_to_email" varchar,
  	"bill_to_address" varchar,
  	"bill_to_postcode" varchar,
  	"fx_currency" "payload"."enum_invoices_fx_currency",
  	"fx_quote" numeric,
  	"fx_on" "payload"."enum_invoices_fx_on" DEFAULT 'total',
  	"fx_read_at" varchar,
  	"fx_source" varchar DEFAULT '手填',
  	"fx_amount" numeric,
  	"totals_subtotal" numeric,
  	"totals_shipping" numeric,
  	"totals_total" numeric,
  	"totals_received" numeric,
  	"totals_deposit" numeric,
  	"totals_balance" numeric,
  	"doc_type" "payload"."enum_invoices_doc_type" DEFAULT 'pi' NOT NULL,
  	"status" "payload"."enum_invoices_status" DEFAULT 'draft' NOT NULL,
  	"void_reason" varchar,
  	"issued_by_id" integer,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."invoices_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product" varchar NOT NULL,
  	"color_size" varchar,
  	"unit_price" numeric NOT NULL,
  	"description" varchar,
  	"fabric" varchar,
  	"image" varchar,
  	"sizes_size_xs" numeric,
  	"sizes_size_s" numeric,
  	"sizes_size_m" numeric,
  	"sizes_size_l" numeric,
  	"sizes_size_xl" numeric,
  	"sizes_size_xxl" numeric,
  	"sizes_size3xl" numeric,
  	"qty" numeric,
  	"row_amount" numeric
  );

  CREATE TABLE "payload"."invoices_shipping" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"amount" numeric
  );

  CREATE TABLE "payload"."invoices_payments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"method" "payload"."enum_invoices_payments_method" DEFAULT 'tt',
  	"amount" numeric
  );

  ALTER TABLE "payload"."customers" ADD COLUMN IF NOT EXISTS "billing_address" varchar;
  ALTER TABLE "payload"."customers" ADD COLUMN IF NOT EXISTS "billing_postcode" varchar;
  ALTER TABLE "payload"."customers" ADD COLUMN IF NOT EXISTS "phone" varchar;
  ALTER TABLE "payload"."customers" ADD COLUMN IF NOT EXISTS "currency" "payload"."enum_customers_currency" DEFAULT 'USD';

  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "invoices_id" integer;

  ALTER TABLE "payload"."invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "payload"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."invoices" ADD CONSTRAINT "invoices_issued_by_id_users_id_fk" FOREIGN KEY ("issued_by_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."invoices_items" ADD CONSTRAINT "invoices_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."invoices_shipping" ADD CONSTRAINT "invoices_shipping_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."invoices_payments" ADD CONSTRAINT "invoices_payments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."invoices"("id") ON DELETE cascade ON UPDATE no action;

  CREATE UNIQUE INDEX "invoices_number_idx" ON "payload"."invoices" USING btree ("number");
  CREATE INDEX "invoices_customer_idx" ON "payload"."invoices" USING btree ("customer_id");
  CREATE INDEX "invoices_issued_by_idx" ON "payload"."invoices" USING btree ("issued_by_id");
  CREATE INDEX "invoices_updated_at_idx" ON "payload"."invoices" USING btree ("updated_at");
  CREATE INDEX "invoices_created_at_idx" ON "payload"."invoices" USING btree ("created_at");
  CREATE INDEX "invoices_items_order_idx" ON "payload"."invoices_items" USING btree ("_order");
  CREATE INDEX "invoices_items_parent_id_idx" ON "payload"."invoices_items" USING btree ("_parent_id");
  CREATE INDEX "invoices_shipping_order_idx" ON "payload"."invoices_shipping" USING btree ("_order");
  CREATE INDEX "invoices_shipping_parent_id_idx" ON "payload"."invoices_shipping" USING btree ("_parent_id");
  CREATE INDEX "invoices_payments_order_idx" ON "payload"."invoices_payments" USING btree ("_order");
  CREATE INDEX "invoices_payments_parent_id_idx" ON "payload"."invoices_payments" USING btree ("_parent_id");
  CREATE INDEX "payload_locked_documents_rels_invoices_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("invoices_id");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "payload"."invoices"("id") ON DELETE cascade ON UPDATE no action;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_invoices_fk";
  DROP INDEX IF EXISTS "payload"."payload_locked_documents_rels_invoices_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "invoices_id";

  DROP TABLE IF EXISTS "payload"."invoices_payments" CASCADE;
  DROP TABLE IF EXISTS "payload"."invoices_shipping" CASCADE;
  DROP TABLE IF EXISTS "payload"."invoices_items" CASCADE;
  DROP TABLE IF EXISTS "payload"."invoices" CASCADE;

  ALTER TABLE "payload"."customers" DROP COLUMN IF EXISTS "currency";
  ALTER TABLE "payload"."customers" DROP COLUMN IF EXISTS "billing_postcode";
  ALTER TABLE "payload"."customers" DROP COLUMN IF EXISTS "billing_address";

  DROP TYPE IF EXISTS "payload"."enum_invoices_payments_method";
  DROP TYPE IF EXISTS "payload"."enum_invoices_fx_on";
  DROP TYPE IF EXISTS "payload"."enum_invoices_fx_currency";
  DROP TYPE IF EXISTS "payload"."enum_invoices_status";
  DROP TYPE IF EXISTS "payload"."enum_invoices_doc_type";
  DROP TYPE IF EXISTS "payload"."enum_invoices_kind";
  DROP TYPE IF EXISTS "payload"."enum_customers_currency";`)
}
