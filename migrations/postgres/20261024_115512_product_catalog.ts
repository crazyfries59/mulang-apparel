import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_products_category" AS ENUM('kids-wear', 'shirt', 't-shirts', 'outdoor-clothing', 'pants', 'hoodies', 'denim', 'y2k-fashion', 'sleepwear', 'sweater', 'jersey', 'dresses', 'swimwear', 'accessories');
  CREATE TYPE "payload"."enum_products_subcategory" AS ENUM('', 'oversized-t-shirt', 'vintage-wash-t-shirt', 'polo', 'vest', 'long-sleeve', 'basic-fit-t-shirt', 'shorts', 'fleece-hoodie', 'terry-hoodie', 'sweatshirt', 'zip-up-hoodie');
  CREATE TYPE "payload"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__products_v_version_category" AS ENUM('kids-wear', 'shirt', 't-shirts', 'outdoor-clothing', 'pants', 'hoodies', 'denim', 'y2k-fashion', 'sleepwear', 'sweater', 'jersey', 'dresses', 'swimwear', 'accessories');
  CREATE TYPE "payload"."enum__products_v_version_subcategory" AS ENUM('', 'oversized-t-shirt', 'vintage-wash-t-shirt', 'polo', 'vest', 'long-sleeve', 'basic-fit-t-shirt', 'shorts', 'fleece-hoodie', 'terry-hoodie', 'sweatshirt', 'zip-up-hoodie');
  CREATE TYPE "payload"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."products_gallery" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"image" varchar
  );

  CREATE TABLE "payload"."products_details" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"image" varchar
  );

  CREATE TABLE "payload"."products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"slug" varchar,
	"product_code" varchar,
	"category" "payload"."enum_products_category",
	"subcategory" "payload"."enum_products_subcategory",
	"cover_image" varchar,
	"description" varchar,
	"fabric" varchar,
	"gsm" varchar,
	"price" varchar,
	"moq" varchar,
	"lead_time" varchar,
	"badge" varchar,
	"sizes" varchar,
	"intro_feature" varchar,
	"intro_size_info" varchar,
	"intro_material" varchar,
	"intro_weight" varchar,
	"intro_blank" varchar,
	"intro_logo_customization" varchar,
	"intro_clothing_customization" varchar,
	"seo_title" varchar,
	"seo_description" varchar,
	"sort_order" numeric DEFAULT 9999,
	"published_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "payload"."enum_products_status" DEFAULT 'draft'
  );

  CREATE TABLE "payload"."_products_v_version_gallery" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"image" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "payload"."_products_v_version_details" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"image" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "payload"."_products_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_name" varchar,
	"version_slug" varchar,
	"version_product_code" varchar,
	"version_category" "payload"."enum__products_v_version_category",
	"version_subcategory" "payload"."enum__products_v_version_subcategory",
	"version_cover_image" varchar,
	"version_description" varchar,
	"version_fabric" varchar,
	"version_gsm" varchar,
	"version_price" varchar,
	"version_moq" varchar,
	"version_lead_time" varchar,
	"version_badge" varchar,
	"version_sizes" varchar,
	"version_intro_feature" varchar,
	"version_intro_size_info" varchar,
	"version_intro_material" varchar,
	"version_intro_weight" varchar,
	"version_intro_blank" varchar,
	"version_intro_logo_customization" varchar,
	"version_intro_clothing_customization" varchar,
	"version_seo_title" varchar,
	"version_seo_description" varchar,
	"version_sort_order" numeric DEFAULT 9999,
	"version_published_at" timestamp(3) with time zone,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "payload"."enum__products_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "payload"."products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."products_details" ADD CONSTRAINT "products_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_products_v_version_details" ADD CONSTRAINT "_products_v_version_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."products"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_gallery_order_idx" ON "payload"."products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "payload"."products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_details_order_idx" ON "payload"."products_details" USING btree ("_order");
  CREATE INDEX "products_details_parent_id_idx" ON "payload"."products_details" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "payload"."products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "payload"."products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "payload"."products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "payload"."products" USING btree ("_status");
  CREATE INDEX "_products_v_version_gallery_order_idx" ON "payload"."_products_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_products_v_version_gallery_parent_id_idx" ON "payload"."_products_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_details_order_idx" ON "payload"."_products_v_version_details" USING btree ("_order");
  CREATE INDEX "_products_v_version_details_parent_id_idx" ON "payload"."_products_v_version_details" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "payload"."_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "payload"."_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "payload"."_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "payload"."_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "payload"."_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "payload"."_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "payload"."_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "payload"."_products_v" USING btree ("latest");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "payload"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("products_id");`)

  await db.execute(sql`
    DO $product_access$
    DECLARE
      table_name text;
      role_name text;
      sequence_name text;
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_roles WHERE rolname = 'mulang_cms_server'
          AND NOT rolcanlogin AND NOT rolsuper AND NOT rolcreatedb
          AND NOT rolcreaterole AND NOT rolreplication AND NOT rolbypassrls
      ) THEN
        RAISE EXCEPTION 'Expected restricted mulang_cms_server role is missing or has unexpected privileges';
      END IF;

      FOREACH table_name IN ARRAY ARRAY[
        'products',
        'products_gallery',
        'products_details',
        '_products_v',
        '_products_v_version_gallery',
        '_products_v_version_details'
      ] LOOP
        EXECUTE format('ALTER TABLE payload.%I ENABLE ROW LEVEL SECURITY', table_name);
        EXECUTE format('REVOKE ALL ON TABLE payload.%I FROM PUBLIC', table_name);
        FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
          IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
            EXECUTE format('REVOKE ALL ON TABLE payload.%I FROM %I', table_name, role_name);
          END IF;
        END LOOP;
        EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE payload.%I TO mulang_cms_server', table_name);

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE schemaname = 'payload'
            AND tablename = table_name
            AND policyname = 'mulang_server_access'
        ) THEN
          EXECUTE format(
            'CREATE POLICY mulang_server_access ON payload.%I FOR ALL TO mulang_cms_server USING (true) WITH CHECK (true)',
            table_name
          );
        END IF;
      END LOOP;

      FOREACH sequence_name IN ARRAY ARRAY[
        'products_id_seq',
        '_products_v_id_seq',
        '_products_v_version_gallery_id_seq',
        '_products_v_version_details_id_seq'
      ] LOOP
        IF EXISTS (
          SELECT 1 FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE n.nspname = 'payload' AND c.relname = sequence_name AND c.relkind = 'S'
        ) THEN
          EXECUTE format('REVOKE ALL ON SEQUENCE payload.%I FROM PUBLIC', sequence_name);
          FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
            IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = role_name) THEN
              EXECUTE format('REVOKE ALL ON SEQUENCE payload.%I FROM %I', sequence_name, role_name);
            END IF;
          END LOOP;
          EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE payload.%I TO mulang_cms_server', sequence_name);
        END IF;
      END LOOP;
    END
    $product_access$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."products_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."products_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_products_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_products_v_version_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_products_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."products_gallery" CASCADE;
  DROP TABLE "payload"."products_details" CASCADE;
  DROP TABLE "payload"."products" CASCADE;
  DROP TABLE "payload"."_products_v_version_gallery" CASCADE;
  DROP TABLE "payload"."_products_v_version_details" CASCADE;
  DROP TABLE "payload"."_products_v" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";

  DROP INDEX "payload"."payload_locked_documents_rels_products_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "products_id";
  DROP TYPE "payload"."enum_products_category";
  DROP TYPE "payload"."enum_products_subcategory";
  DROP TYPE "payload"."enum_products_status";
  DROP TYPE "payload"."enum__products_v_version_category";
  DROP TYPE "payload"."enum__products_v_version_subcategory";
  DROP TYPE "payload"."enum__products_v_version_status";`)
}
