import assert from 'node:assert/strict'
import path from 'node:path'
import { rm } from 'node:fs/promises'

// Use a new disposable database, never the user's CMS data.
const dbPath = path.resolve('data', `publication-qa-${process.pid}.db`)
process.env.DATABASE_URL = `file:${dbPath.replaceAll('\\', '/')}`
process.env.NODE_ENV = 'development'
delete process.env.VERCEL
const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.ts')
const payload = await getPayload({ config })
const body = { root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children: [
  { type: 'paragraph', version: 1, direction: null, format: '', indent: 0, children: [
    { type: 'text', version: 1, text: 'Temporary publication QA fixture.', format: 0, detail: 0, mode: 'normal', style: '' },
  ] },
] } }
const base = { title: 'Publication QA fixture', excerpt: 'Temporary test only', category: 'Manufacturing', coverImage: '/favicon.ico', body }
let verified = false
try {
  const draft = await payload.create({ collection: 'posts', data: { ...base, slug: 'qa-draft', _status: 'draft' }, draft: true })
  const published = await payload.create({ collection: 'posts', data: { ...base, slug: 'qa-published', _status: 'published' } })
  const future = await payload.create({ collection: 'posts', data: { ...base, slug: 'qa-future', _status: 'published', publishedAt: '2099-01-01T00:00:00.000Z' } })
  assert.ok(published.publishedAt, 'Publishing without a date must assign one')
  const publicPosts = await payload.find({ collection: 'posts', overrideAccess: false, draft: true, limit: 20 })
  assert.deepEqual(publicPosts.docs.map(p => p.id), [published.id], 'Anonymous reads must hide draft and scheduled content, even when draft=true')
  const stillDraft = await payload.findByID({ collection: 'posts', id: draft.id, draft: true })
  assert.equal(stillDraft._status, 'draft')
  const scheduled = await payload.findByID({ collection: 'posts', id: future.id })
  assert.equal(scheduled.publishedAt, '2099-01-01T00:00:00.000Z')
  console.log('PASS: isolated CMS database verifies publication dates and anonymous draft/scheduled visibility.')
  verified = true
} finally {
  await payload.destroy()
  payload.db.client?.close()
  for (const suffix of ['', '-wal', '-shm']) {
    try { await rm(dbPath + suffix, { force: true }) }
    catch (error) {
      // Drizzle's development schema worker may retain a Windows file handle
      // until process exit. The invoking shell can remove these test-only files.
      if (error.code !== 'EBUSY') throw error
    }
  }
}
// Drizzle Kit can keep an idle schema worker alive after SQLite is closed.
if (verified) process.exit(0)
