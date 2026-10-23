import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $privacy$
    DECLARE entry record;
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mulang_cms_server') THEN
        CREATE ROLE mulang_cms_server NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
      ELSIF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'mulang_cms_server'
        AND (rolcanlogin OR rolsuper OR rolcreatedb OR rolcreaterole OR rolreplication OR rolbypassrls)) THEN
        RAISE EXCEPTION 'Unexpected privileges on CMS group role';
      END IF;

      REVOKE ALL ON SCHEMA payload FROM PUBLIC;
      REVOKE ALL ON ALL TABLES IN SCHEMA payload FROM PUBLIC;
      REVOKE ALL ON ALL SEQUENCES IN SCHEMA payload FROM PUBLIC;
      FOR entry IN SELECT rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated') LOOP
        EXECUTE format('REVOKE ALL ON SCHEMA payload FROM %I', entry.rolname);
        EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA payload FROM %I', entry.rolname);
        EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA payload FROM %I', entry.rolname);
      END LOOP;

      GRANT USAGE ON SCHEMA payload TO mulang_cms_server;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA payload TO mulang_cms_server;
      FOR entry IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'payload'
      LOOP
        EXECUTE format('ALTER TABLE payload.%I ENABLE ROW LEVEL SECURITY', entry.tablename);
        IF entry.tablename <> 'payload_migrations' THEN
          EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON payload.%I TO mulang_cms_server', entry.tablename);
          EXECUTE format('CREATE POLICY mulang_server_access ON payload.%I FOR ALL TO mulang_cms_server USING (true) WITH CHECK (true)', entry.tablename);
        END IF;
      END LOOP;
    END
    $privacy$;
  `)
}

export async function down(): Promise<void> {
  throw new Error('Removing CMS access isolation requires an explicit administrator migration.')
}
