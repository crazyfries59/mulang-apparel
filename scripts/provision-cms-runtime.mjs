import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { readFile, rename, writeFile } from 'node:fs/promises'
import nextEnv from '@next/env'
import pg from 'pg'
import { postgresOptions } from '../lib/database/postgres-options.mjs'

nextEnv.loadEnvConfig(process.cwd())
const project = 'mqgieansdrkbxfihwlki'
const role = 'mulang_cms_preview'
const adminURL = new URL(process.env.DATABASE_MIGRATION_URL ?? '')
assert.equal(adminURL.username, `postgres.${project}`)
assert.equal(adminURL.hostname, 'aws-0-us-east-1.pooler.supabase.com')
let runtimeURL
if (process.env.DATABASE_URL) {
  runtimeURL = new URL(process.env.DATABASE_URL)
  assert.equal(runtimeURL.username, `${role}.${project}`, 'Existing runtime connection requires review.')
  assert.equal(runtimeURL.hostname, adminURL.hostname)
} else {
  runtimeURL = new URL(adminURL)
  runtimeURL.username = `${role}.${project}`
  runtimeURL.password = randomBytes(48).toString('hex')
  runtimeURL.port = '6543'
  let file = await readFile('.env.local', 'utf8')
  file = `${file.replace(/^[\t ]*(?:export\s+)?DATABASE_URL\s*=.*(?:\r?\n|$)/gm, '').trimEnd()}\nDATABASE_URL="${runtimeURL.toString()}"\n`
  // Save first so a failed provisioning attempt can resume without rotating a role.
  const pending = `.env.local.pending-${randomBytes(8).toString('hex')}`
  await writeFile(pending, file, { flag: 'wx', mode: 0o600 })
  await rename(pending, '.env.local')
}
const admin = new pg.Client(postgresOptions(adminURL.toString()))
const app = new pg.Client(postgresOptions(runtimeURL.toString()))
admin.on('error', () => {})
app.on('error', () => {})
try {
  await admin.connect()
  const existing = await admin.query('SELECT rolname FROM pg_roles WHERE rolname=$1', [role])
  if (!existing.rowCount) {
    await admin.query(`CREATE ROLE ${pg.escapeIdentifier(role)} LOGIN INHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS CONNECTION LIMIT 10 PASSWORD ${pg.escapeLiteral(decodeURIComponent(runtimeURL.password))}`)
  }
  await admin.query(`GRANT mulang_cms_server TO ${pg.escapeIdentifier(role)}`)
  await app.connect()
  const flags = await app.query('SELECT rolsuper,rolcreatedb,rolcreaterole,rolreplication,rolbypassrls FROM pg_roles WHERE rolname=current_user')
  assert.ok(Object.values(flags.rows[0]).every(value => value === false))
  const access = await app.query("SELECT has_schema_privilege(current_user,'payload','CREATE') AS ddl, has_table_privilege(current_user,'payload.posts','TRUNCATE') AS truncate, has_table_privilege(current_user,'payload.payload_migrations','UPDATE') AS migration_write")
  assert.ok(Object.values(access.rows[0]).every(value => value === false))
  const counts = await app.query('SELECT (SELECT count(*) FROM payload.users)::int AS users,(SELECT count(*) FROM payload.posts)::int AS posts')
  assert.ok(counts.rows[0].users > 0)
  const tables = await admin.query("SELECT relname,relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='payload' AND c.relkind='r'")
  assert.ok(tables.rows.every(table => table.relrowsecurity))
  const publicAccess = await admin.query("SELECT has_schema_privilege('anon','payload','USAGE') OR has_schema_privilege('authenticated','payload','USAGE') AS exposed")
  assert.equal(publicAccess.rows[0].exposed, false)
  console.log(JSON.stringify({ runtimeReady: true, tlsAuthorized: app.connection.stream.authorized === true, counts: counts.rows[0], noDDL: true, noTruncate: true, noMigrationWrites: true, rlsTables: tables.rowCount, dataApiRolesDenied: true }))
} catch (error) {
  console.error(JSON.stringify({ runtimeReady: false, code: error.code ?? 'validation_failed' }))
  process.exitCode = 1
} finally { await Promise.all([admin.end().catch(() => {}), app.end().catch(() => {})]) }
