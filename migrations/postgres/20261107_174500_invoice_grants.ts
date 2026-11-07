import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * 发票表授权。
 *
 * 背景：payload schema 里新建的表不会自动继承已有表的授权，用 postgres 跑完建表迁移后，
 * 应用运行角色（mulang_cms_server / mulang_cms_preview）对 invoices* 没有 SELECT 权限，
 * 后台点「发票」直接白屏（接口 403/500），线上踩过一次。
 * 这里补授权，可重复执行。
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  DECLARE
    r text;
    t text;
    ty text;
  BEGIN
    FOREACH r IN ARRAY ARRAY['mulang_cms_server', 'mulang_cms_preview'] LOOP
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
        FOREACH t IN ARRAY ARRAY['invoices', 'invoices_items', 'invoices_shipping', 'invoices_payments'] LOOP
          IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'payload' AND table_name = t
          ) THEN
            EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON payload.%I TO %I', t, r);
          END IF;
        END LOOP;

        FOR ty IN
          SELECT p.typname FROM pg_type p
          JOIN pg_namespace n ON n.oid = p.typnamespace
          WHERE n.nspname = 'payload' AND p.typtype = 'e' AND p.typname LIKE 'enum_invoices%'
        LOOP
          EXECUTE format('GRANT USAGE ON TYPE payload.%I TO %I', ty, r);
        END LOOP;

        EXECUTE format(
          'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA payload TO %I', r
        );

        -- 以后由 postgres 在 payload schema 新建的表/序列，默认就把权限给运行角色
        EXECUTE format(
          'ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA payload GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO %I', r
        );
        EXECUTE format(
          'ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA payload GRANT USAGE, SELECT ON SEQUENCES TO %I', r
        );
      END IF;
    END LOOP;
  END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // 授权不回滚：撤掉会让后台再次不可用，收益为零。
  await db.execute(sql`SELECT 1`)
}
