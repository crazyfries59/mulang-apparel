import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_sales_scripts_category" AS ENUM('outreach', 'inquiry-reply', 'quote', 'no-reply', 'sample', 'bulk', 'review', 'other');
  CREATE TYPE "payload"."enum_sales_scripts_language" AS ENUM('en', 'zh');
  CREATE TYPE "payload"."enum_knowledge_category" AS ENUM('fabric', 'craft', 'size', 'trims', 'shipping', 'pricing', 'process', 'other');
  CREATE TYPE "payload"."enum_customers_cooperation" AS ENUM('blank', 'logo', 'cut-sew');
  CREATE TYPE "payload"."enum_customers_stage" AS ENUM('new', 'contacted', 'interested', 'quoted', 'sampling', 'won', 'lost');
  CREATE TYPE "payload"."enum_customers_source" AS ENUM('website', 'email', 'whatsapp', 'referral', 'platform', 'other');
  CREATE TYPE "payload"."enum_inquiries_status" AS ENUM('new', 'replied', 'converted', 'invalid');
  CREATE TYPE "payload"."enum_inquiries_source" AS ENUM('website', 'email', 'whatsapp', 'referral', 'platform', 'other');
  CREATE TYPE "payload"."enum_orders_currency" AS ENUM('USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY');
  CREATE TYPE "payload"."enum_orders_type" AS ENUM('sample', 'bulk');
  CREATE TYPE "payload"."enum_orders_stage" AS ENUM('quoting', 'sampling', 'confirmed', 'production', 'shipped', 'done', 'cancelled');
  CREATE TYPE "payload"."enum_follow_ups_channel" AS ENUM('whatsapp', 'email', 'wechat', 'call', 'meeting', 'other');
  CREATE TYPE "payload"."enum_users_role" AS ENUM('admin', 'sales');
  CREATE TABLE "payload"."sales_scripts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"usage" varchar,
  	"category" "payload"."enum_sales_scripts_category" NOT NULL,
  	"language" "payload"."enum_sales_scripts_language" DEFAULT 'en',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."knowledge" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"body" jsonb,
  	"category" "payload"."enum_knowledge_category" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."customers_cooperation" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum_customers_cooperation",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"contact_name" varchar,
  	"country" varchar,
  	"email" varchar,
  	"whatsapp" varchar,
  	"website" varchar,
  	"product_focus" varchar,
  	"notes" varchar,
  	"local_folder" varchar,
  	"stage" "payload"."enum_customers_stage" DEFAULT 'new' NOT NULL,
  	"source" "payload"."enum_customers_source",
  	"owner_id" integer,
  	"next_follow_up_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"company" varchar,
  	"email" varchar,
  	"whatsapp" varchar,
  	"country" varchar,
  	"product_type" varchar,
  	"quantity" varchar,
  	"message" varchar NOT NULL,
  	"reply" varchar,
  	"status" "payload"."enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"source" "payload"."enum_inquiries_source" DEFAULT 'website',
  	"received_at" timestamp(3) with time zone NOT NULL,
  	"customer_id" integer,
  	"owner_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"customer_id" integer NOT NULL,
  	"quantity" numeric,
  	"amount" numeric,
  	"currency" "payload"."enum_orders_currency" DEFAULT 'USD',
  	"carrier" varchar,
  	"tracking_number" varchar,
  	"notes" varchar,
  	"type" "payload"."enum_orders_type" DEFAULT 'sample' NOT NULL,
  	"stage" "payload"."enum_orders_stage" DEFAULT 'quoting' NOT NULL,
  	"due_date" timestamp(3) with time zone,
  	"shipped_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."follow_ups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"summary" varchar NOT NULL,
  	"content" varchar,
  	"date" timestamp(3) with time zone NOT NULL,
  	"channel" "payload"."enum_follow_ups_channel" DEFAULT 'whatsapp',
  	"next_follow_up_at" timestamp(3) with time zone,
  	"author_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."users" ADD COLUMN "role" "payload"."enum_users_role" DEFAULT 'sales' NOT NULL;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "sales_scripts_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "knowledge_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "inquiries_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "orders_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "follow_ups_id" integer;
  ALTER TABLE "payload"."customers_cooperation" ADD CONSTRAINT "customers_cooperation_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."customers" ADD CONSTRAINT "customers_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."inquiries" ADD CONSTRAINT "inquiries_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "payload"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."inquiries" ADD CONSTRAINT "inquiries_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "payload"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."follow_ups" ADD CONSTRAINT "follow_ups_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "payload"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."follow_ups" ADD CONSTRAINT "follow_ups_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sales_scripts_updated_at_idx" ON "payload"."sales_scripts" USING btree ("updated_at");
  CREATE INDEX "sales_scripts_created_at_idx" ON "payload"."sales_scripts" USING btree ("created_at");
  CREATE INDEX "knowledge_updated_at_idx" ON "payload"."knowledge" USING btree ("updated_at");
  CREATE INDEX "knowledge_created_at_idx" ON "payload"."knowledge" USING btree ("created_at");
  CREATE INDEX "customers_cooperation_order_idx" ON "payload"."customers_cooperation" USING btree ("order");
  CREATE INDEX "customers_cooperation_parent_idx" ON "payload"."customers_cooperation" USING btree ("parent_id");
  CREATE INDEX "customers_name_idx" ON "payload"."customers" USING btree ("name");
  CREATE INDEX "customers_country_idx" ON "payload"."customers" USING btree ("country");
  CREATE INDEX "customers_stage_idx" ON "payload"."customers" USING btree ("stage");
  CREATE INDEX "customers_owner_idx" ON "payload"."customers" USING btree ("owner_id");
  CREATE INDEX "customers_next_follow_up_at_idx" ON "payload"."customers" USING btree ("next_follow_up_at");
  CREATE INDEX "customers_updated_at_idx" ON "payload"."customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "payload"."customers" USING btree ("created_at");
  CREATE INDEX "inquiries_status_idx" ON "payload"."inquiries" USING btree ("status");
  CREATE INDEX "inquiries_received_at_idx" ON "payload"."inquiries" USING btree ("received_at");
  CREATE INDEX "inquiries_customer_idx" ON "payload"."inquiries" USING btree ("customer_id");
  CREATE INDEX "inquiries_owner_idx" ON "payload"."inquiries" USING btree ("owner_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "payload"."inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "payload"."inquiries" USING btree ("created_at");
  CREATE INDEX "orders_customer_idx" ON "payload"."orders" USING btree ("customer_id");
  CREATE INDEX "orders_stage_idx" ON "payload"."orders" USING btree ("stage");
  CREATE INDEX "orders_updated_at_idx" ON "payload"."orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "payload"."orders" USING btree ("created_at");
  CREATE INDEX "follow_ups_customer_idx" ON "payload"."follow_ups" USING btree ("customer_id");
  CREATE INDEX "follow_ups_author_idx" ON "payload"."follow_ups" USING btree ("author_id");
  CREATE INDEX "follow_ups_updated_at_idx" ON "payload"."follow_ups" USING btree ("updated_at");
  CREATE INDEX "follow_ups_created_at_idx" ON "payload"."follow_ups" USING btree ("created_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sales_scripts_fk" FOREIGN KEY ("sales_scripts_id") REFERENCES "payload"."sales_scripts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_fk" FOREIGN KEY ("knowledge_id") REFERENCES "payload"."knowledge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "payload"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "payload"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "payload"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_follow_ups_fk" FOREIGN KEY ("follow_ups_id") REFERENCES "payload"."follow_ups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_sales_scripts_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("sales_scripts_id");
  CREATE INDEX "payload_locked_documents_rels_knowledge_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("knowledge_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_follow_ups_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("follow_ups_id");`)

  // Accounts that existed before roles were introduced are the owner's; keep them as admins.
  await db.execute(sql`UPDATE "payload"."users" SET "role" = 'admin';`)

  // Same isolation as the earlier CMS tables: RLS on, no PUBLIC/anon/authenticated access,
  // only the restricted mulang_cms_server role may read and write.
  await db.execute(sql`
    DO $crm_access$
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
        'sales_scripts',
        'knowledge',
        'customers',
        'customers_cooperation',
        'inquiries',
        'orders',
        'follow_ups'
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
        'sales_scripts_id_seq',
        'knowledge_id_seq',
        'customers_id_seq',
        'customers_cooperation_id_seq',
        'inquiries_id_seq',
        'orders_id_seq',
        'follow_ups_id_seq'
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
    $crm_access$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."sales_scripts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."knowledge" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."customers_cooperation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."customers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."inquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."orders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."follow_ups" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."sales_scripts" CASCADE;
  DROP TABLE "payload"."knowledge" CASCADE;
  DROP TABLE "payload"."customers_cooperation" CASCADE;
  DROP TABLE "payload"."customers" CASCADE;
  DROP TABLE "payload"."inquiries" CASCADE;
  DROP TABLE "payload"."orders" CASCADE;
  DROP TABLE "payload"."follow_ups" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sales_scripts_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_knowledge_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_customers_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_inquiries_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_orders_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_follow_ups_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_sales_scripts_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_knowledge_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_customers_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_inquiries_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_orders_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_follow_ups_id_idx";
  ALTER TABLE "payload"."users" DROP COLUMN "role";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "sales_scripts_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "knowledge_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "customers_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "inquiries_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "orders_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "follow_ups_id";
  DROP TYPE "payload"."enum_sales_scripts_category";
  DROP TYPE "payload"."enum_sales_scripts_language";
  DROP TYPE "payload"."enum_knowledge_category";
  DROP TYPE "payload"."enum_customers_cooperation";
  DROP TYPE "payload"."enum_customers_stage";
  DROP TYPE "payload"."enum_customers_source";
  DROP TYPE "payload"."enum_inquiries_status";
  DROP TYPE "payload"."enum_inquiries_source";
  DROP TYPE "payload"."enum_orders_currency";
  DROP TYPE "payload"."enum_orders_type";
  DROP TYPE "payload"."enum_orders_stage";
  DROP TYPE "payload"."enum_follow_ups_channel";
  DROP TYPE "payload"."enum_users_role";`)
}
