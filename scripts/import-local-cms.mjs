import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import nextEnv from '@next/env'
import pg from 'pg'
import { postgresOptions } from '../lib/database/postgres-options.mjs'

nextEnv.loadEnvConfig(process.cwd())
const raw = process.env.DATABASE_MIGRATION_URL
const target = new URL(raw ?? '')
if (target.username !== 'postgres.mqgieansdrkbxfihwlki' || target.hostname !== 'aws-0-us-east-1.pooler.supabase.com') throw new Error('Unexpected migration target.')
if (!existsSync('data/payload.db')) throw new Error('Original local database is missing.')
const source = new DatabaseSync('data/payload.db', { readOnly: true })
let users, posts, versions
try {
  source.exec('BEGIN')
  // Credentials stay in memory and are parameterized over verified TLS. Never export them.
  users = source.prepare('SELECT id,name,email,salt,hash,created_at,updated_at FROM users').all()
  posts = source.prepare('SELECT * FROM posts').all()
  versions = source.prepare('SELECT * FROM _posts_v').all()
  source.exec('COMMIT')
} finally { source.close() }
assert.ok(users.length, 'An existing administrator is required before Preview is exposed.')
assert.ok(users.every(user => user.salt && user.hash), 'Source credentials are incomplete.')

function convert(row) {
  const result = { ...row }
  for (const key of ['body', 'version_body']) if (typeof result[key] === 'string') result[key] = JSON.parse(result[key])
  for (const key of ['featured', 'version_featured', 'latest']) if (result[key] != null) result[key] = Boolean(result[key])
  // Published-without-date was never public. Import it as a draft, bypassing publication hooks.
  if (result._status === 'published' && !result.published_at) result._status = 'draft'
  if (result.version__status === 'published' && !result.version_published_at) result.version__status = 'draft'
  return result
}
const quote = value => '"' + value.replaceAll('"', '""') + '"'
const client = new pg.Client(postgresOptions(raw))
client.on('error', () => {})
try {
  await client.connect()
  const counts = await client.query('SELECT (SELECT count(*) FROM payload.users)::int AS users, (SELECT count(*) FROM payload.posts)::int AS posts')
  assert.deepEqual(counts.rows[0], { users: 0, posts: 0 }, 'Target is initialized; refusing to overwrite existing content.')
  await client.query('BEGIN')
  for (const [table, rows] of [['users', users], ['posts', posts], ['_posts_v', versions]]) {
    for (const item of rows) {
      const row = convert(item)
      const columns = Object.keys(row)
      await client.query(`INSERT INTO payload.${quote(table)} (${columns.map(quote).join(',')}) VALUES (${columns.map((_, i) => '$' + (i + 1)).join(',')})`, columns.map(key => row[key]))
    }
    await client.query(`SELECT setval(pg_get_serial_sequence('payload.${table}', 'id'), COALESCE((SELECT max(id) FROM payload.${quote(table)}),1), EXISTS(SELECT 1 FROM payload.${quote(table)}))`)
  }
  const imported = await client.query('SELECT id,body,_status,published_at FROM payload.posts ORDER BY id')
  for (const row of imported.rows) {
    const original = convert(posts.find(post => post.id === row.id))
    assert.deepEqual(row.body, original.body)
    assert.equal(row._status, original._status)
    if (!original.published_at) assert.equal(row.published_at, null)
  }
  await client.query('COMMIT')
  console.log(JSON.stringify({ imported: true, users: users.length, posts: posts.length, versions: versions.length, credentialsExported: false, sessionsAndResetTokensCopied: false }))
} catch (error) {
  await client.query('ROLLBACK').catch(() => {})
  console.error(JSON.stringify({ imported: false, code: error.code ?? 'validation_failed' }))
  process.exitCode = 1
} finally { await client.end().catch(() => {}) }
