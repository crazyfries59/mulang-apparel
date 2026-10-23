import { spawnSync } from 'node:child_process'
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd())
if (process.env.DATABASE_MIGRATION_URL) process.env.DATABASE_URL = process.env.DATABASE_MIGRATION_URL
if (!/^postgres(?:ql)?:\/\//.test(process.env.DATABASE_URL ?? '')) {
  throw new Error('CMS migrations require a Postgres DATABASE_URL. SQLite development data will not be migrated by this command.')
}
if (!process.env.PAYLOAD_SECRET) throw new Error('Configure PAYLOAD_SECRET before migrating the CMS.')
const expectedProject = process.env.CMS_EXPECTED_PROJECT_REF ?? 'mqgieansdrkbxfihwlki'
const target = new URL(process.env.DATABASE_URL)
if (!(target.hostname === `db.${expectedProject}.supabase.co` ||
  (target.hostname.endsWith('.pooler.supabase.com') && target.username.endsWith(`.${expectedProject}`)))) {
  throw new Error('Migration target does not match the approved Supabase project.')
}
const result = spawnSync(process.execPath, ['node_modules/payload/bin.js', '--disable-transpile', 'migrate'], {
  stdio: 'inherit', env: process.env,
})
if (result.error) throw result.error
process.exit(result.status ?? 1)
