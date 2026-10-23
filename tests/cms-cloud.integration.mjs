import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nextEnv from '@next/env'

// This is an opt-in integration test against the dedicated Preview runtime role.
// Only this run's clearly marked QA documents may be created or deleted.
// Credentials, login cookies, database exceptions, and document IDs stay in memory.
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const baseIndex = args.indexOf('--base-url')
const baseURL = baseIndex < 0 ? null : new URL(args[baseIndex + 1])
if (args.some((value, index) => value !== '--base-url' && index !== baseIndex + 1) ||
  (baseURL && (baseURL.origin !== 'http://127.0.0.1:3012' || baseURL.pathname !== '/' || baseURL.search || baseURL.hash))) {
  throw new Error('Use only the authorized local Preview origin for HTTP tests.')
}
nextEnv.loadEnvConfig(repository, false, { info() {}, error() {} })
let target
try { target = new URL(process.env.DATABASE_URL ?? '') } catch {}
if (!target || !['postgres:', 'postgresql:'].includes(target.protocol) ||
  decodeURIComponent(target.username) !== 'mulang_cms_preview.mqgieansdrkbxfihwlki' ||
  target.hostname !== 'aws-0-us-east-1.pooler.supabase.com' || target.port !== '6543') {
  throw new Error('Refusing to test any database other than the dedicated Preview runtime.')
}

const run = `qa-cms-${randomUUID()}`
const email = `${run}@example.invalid`
const password = randomBytes(36).toString('base64url')
const slugs = new Set(['draft', 'future', 'published'].map(kind => `${run}-${kind}`))
const postIDs = new Set()
const labels = []
let payload, createLocalReq, userID, authenticatedReq
let stage = 'initialize'
let failed = false
let cleanupFailed = false

const check = (condition, message) => assert.ok(condition, message)
const pass = label => { labels.push(label); console.log(`PASS ${label}`) }
const lexical = text => ({ root: {
  type: 'root', version: 1, direction: null, format: '', indent: 0,
  children: [{ type: 'paragraph', version: 1, direction: null, format: '', indent: 0,
    children: [{ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' }],
  }],
} })
const dataFor = (kind, status) => ({
  slug: `${run}-${kind}`, title: `${run} ${kind}`, excerpt: `${run} ${kind} excerpt`,
  category: 'Manufacturing', readMinutes: 3,
  coverImage: '/products/y2k-fashion/bx8105-rib-260gsm-stretch-crop-y2k-baby-tee/img-1.jpg',
  body: lexical(`${run} ${kind} body`), _status: status,
  seo: { title: `${run} ${kind} SEO`, description: `${run} ${kind} SEO description` },
})
async function anonymousReq() { return createLocalReq({}, payload) }
async function findSlug(slug, draft = false, req) {
  return payload.find({ collection: 'posts', depth: 0, limit: 2,
    where: { slug: { equals: slug } }, draft, overrideAccess: false,
    req: req ?? await anonymousReq(),
  })
}
async function deniedLocal(label, operation) {
  let denied = false
  try { await operation() } catch (error) { denied = [401, 403].includes(error?.status) }
  check(denied, label)
}
async function createPost(data, draft = false) {
  const doc = await payload.create({ collection: 'posts', data, draft,
    req: authenticatedReq, overrideAccess: false })
  postIDs.add(doc.id)
  return doc
}
async function request(route, { method = 'GET', data, cookie } = {}) {
  const response = await fetch(new URL(route, baseURL), {
    method, redirect: 'manual', signal: AbortSignal.timeout(30000),
    headers: {
      ...(data === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(cookie ? { Cookie: cookie, Origin: baseURL.origin } : {}),
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
  const text = await response.text()
  let json
  try { json = JSON.parse(text) } catch {}
  return { response, text, json }
}
const forbidden = result => [401, 403].includes(result.response.status)

try {
  const [{ getPayload, createLocalReq: makeReq }, { default: configPromise }] = await Promise.all([
    import('payload'), import('../payload.config.ts'),
  ])
  createLocalReq = makeReq
  const config = await configPromise
  config.logger = { options: { level: 'silent' } }
  payload = await getPayload({ config })
  const identity = await payload.db.pool.query(`SELECT current_user = 'mulang_cms_preview' AS correct_role,
    NOT rolsuper AND NOT rolbypassrls AS restricted,
    NOT has_schema_privilege(current_user, 'payload', 'CREATE') AS no_ddl
    FROM pg_roles WHERE rolname = current_user`)
  check(identity.rows.length === 1 && Object.values(identity.rows[0]).every(value => value === true),
    'Runtime must use the restricted Preview role without schema CREATE.')
  pass('restricted runtime identity and strict TLS connection')

  stage = 'QA user bootstrap and actual Local API login'
  const created = await payload.create({ collection: 'users', overrideAccess: true,
    data: { email, password, name: `${run} integration fixture` } })
  userID = created.id
  const login = await payload.login({ collection: 'users', data: { email, password } })
  check(login.user?.id === userID && Boolean(login.token), 'Fixture user must authenticate with its real password.')
  authenticatedReq = await createLocalReq({ user: login.user }, payload)
  pass('fixture user authenticates through real Local API login')

  stage = 'draft, scheduling, and publication Local API'
  const draftData = dataFor('draft', 'draft')
  const draft = await createPost(draftData, true)
  const futureData = { ...dataFor('future', 'published'), publishedAt: '2099-01-01T00:00:00.000Z' }
  const future = await createPost(futureData)
  const publishedData = dataFor('published', 'published')
  publishedData.title = `${run} </script><script>globalThis.qaInjection=1</script>`
  const published = await createPost(publishedData)
  check(Boolean(published.publishedAt) && Number.isFinite(Date.parse(published.publishedAt)) &&
    Math.abs(Date.now() - Date.parse(published.publishedAt)) < 120000,
  'Publishing without a date must set the current publication date.')
  check((await findSlug(draft.slug)).totalDocs === 0 && (await findSlug(future.slug)).totalDocs === 0,
    'Anonymous readers must not see draft or future posts.')
  const original = (await findSlug(published.slug)).docs[0]
  check(original?.title === publishedData.title, 'Anonymous readers must see the newly published CMS post.')
  pass('anonymous draft and future exclusion; automatic publication date')

  const draftMarker = `${run}-UNPUBLISHED-REVISION`
  await payload.update({ collection: 'posts', id: published.id, draft: true, overrideAccess: false,
    req: authenticatedReq, data: { title: draftMarker, excerpt: draftMarker,
      body: lexical(draftMarker), seo: { title: draftMarker, description: draftMarker }, _status: 'draft' },
  })
  const afterDraft = await findSlug(published.slug)
  check(afterDraft.docs[0]?.title === publishedData.title &&
    !JSON.stringify(afterDraft.docs).includes(draftMarker), 'A new draft must preserve the public published snapshot.')
  const anonymousDraft = await findSlug(published.slug, true)
  check(!JSON.stringify(anonymousDraft.docs).includes(draftMarker), 'Anonymous draft=true must not leak unpublished revisions.')
  const ownerDraft = await findSlug(published.slug, true, authenticatedReq)
  check(ownerDraft.docs[0]?.title === draftMarker, 'The logged-in editor must be able to retrieve its latest draft.')
  pass('published snapshot remains public while a later revision stays private')

  stage = 'anonymous Local API write and version restrictions'
  await deniedLocal('Anonymous post creation must be denied.', async () => payload.create({
    collection: 'posts', data: draftData, overrideAccess: false, req: await anonymousReq(),
  }))
  await deniedLocal('Anonymous post update must be denied.', async () => payload.update({
    collection: 'posts', id: draft.id, data: { title: 'Unauthorized' }, overrideAccess: false, req: await anonymousReq(),
  }))
  await deniedLocal('Anonymous version access must be denied.', async () => payload.findVersions({
    collection: 'posts', where: { parent: { equals: published.id } }, overrideAccess: false, req: await anonymousReq(),
  }))
  pass('Local API anonymous writes and version reads denied')

  if (baseURL) {
    stage = 'HTTP login and cookie authentication'
    const loginHTTP = await request('/api/users/login', { method: 'POST', data: { email, password } })
    check(loginHTTP.response.status === 200 && loginHTTP.json?.user?.id === userID,
      'The fixture user must authenticate through the real REST login route.')
    const cookies = loginHTTP.response.headers.getSetCookie()
    const authCookie = cookies.find(cookie => cookie.startsWith(`${config.cookiePrefix}-token=`))
    // Payload 3.91 serializes these presence flags as Secure=true/HttpOnly=true.
    check(authCookie && /;\s*HttpOnly(?:=true)?(?:;|$)/i.test(authCookie) && /;\s*Secure(?:=true)?(?:;|$)/i.test(authCookie),
      'The production authentication cookie must be Secure and HttpOnly.')
    const cookie = authCookie.split(';')[0]
    const me = await request('/api/users/me', { cookie })
    check(me.response.status === 200 && me.json?.user?.id === userID,
      'A real REST-issued cookie must authenticate the fixture user.')
    pass('real REST login and Secure HttpOnly cookie round trip')

    stage = 'HTTP anonymous user CRUD, post writes, and versions'
    const anonymousCases = [
      ['/api/users'], [`/api/users/${userID}`],
      ['/api/users', { method: 'POST', data: {} }],
      [`/api/users/${userID}`, { method: 'PATCH', data: { name: 'Unauthorized' } }],
      [`/api/users/${userID}`, { method: 'DELETE' }],
      ['/api/posts', { method: 'POST', data: draftData }],
      [`/api/posts/${draft.id}`, { method: 'PATCH', data: { title: 'Unauthorized' } }],
      [`/api/posts/${draft.id}`, { method: 'DELETE' }],
      ['/api/posts/versions'],
    ]
    for (const [route, options] of anonymousCases) check(forbidden(await request(route, options)),
      'Anonymous collection or version access must return 401/403.')
    const ownedVersions = await payload.findVersions({ collection: 'posts', overrideAccess: false,
      req: authenticatedReq, where: { parent: { equals: published.id } }, limit: 20 })
    check(ownedVersions.totalDocs >= 2, 'The fixture must have both published and draft version history.')
    check(forbidden(await request(`/api/posts/versions/${ownedVersions.docs[0].id}`)),
      'Anonymous individual version access must be denied.')
    const userCountBefore = await payload.count({ collection: 'users', overrideAccess: false, req: authenticatedReq })
    const register = await request('/api/users/first-register', { method: 'POST', data: {} })
    const userCountAfter = await payload.count({ collection: 'users', overrideAccess: false, req: authenticatedReq })
    check(register.response.status === 403 && userCountAfter.totalDocs === userCountBefore.totalDocs,
      'First registration must be blocked when users already exist, without changing the user count.')
    pass('REST anonymous CRUD and versions denied; first-register cannot add users')

    stage = 'HTTP CMS-only content, sitemap, SEO, and JSON-LD'
    const publicAPI = await request(`/api/posts?where[slug][equals]=${published.slug}&draft=false`)
    check(publicAPI.response.status === 200 && publicAPI.json?.docs?.[0]?.title === publishedData.title &&
      !publicAPI.text.includes(draftMarker), 'REST must serve the published snapshot without draft revision data.')
    for (const hidden of [draft, future]) {
      const detail = await request(`/blog/${hidden.slug}`)
      check(detail.response.status === 404, 'Draft and scheduled CMS-only blog pages must return 404.')
      check(!detail.text.includes(`${run} ${hidden.slug.endsWith('-draft') ? 'draft' : 'future'} SEO`),
        'A hidden blog page must not leak private SEO data.')
      const hiddenAPI = await request(`/api/posts?where[slug][equals]=${hidden.slug}&draft=true`)
      check(hiddenAPI.response.status === 200 && hiddenAPI.json?.totalDocs === 0,
        'Anonymous REST draft=true must exclude hidden posts.')
    }
    const article = await request(`/blog/${published.slug}`)
    check(article.response.status === 200 && article.text.includes(`${run} published body`) &&
      article.text.includes(publishedData.seo.title) && article.text.includes(publishedData.seo.description),
    'The unique CMS-only public page must include its live body and SEO data.')
    check(!article.text.includes(draftMarker), 'Unpublished revision text must not leak in HTML, metadata, or serialized data.')
    const jsonBlocks = [...article.text.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    const articleBlock = jsonBlocks.find(match => {
      try { return JSON.parse(match[1])['@type'] === 'Article' } catch { return false }
    })
    check(Boolean(articleBlock), 'The public page must include valid Article JSON-LD.')
    check(JSON.parse(articleBlock[1]).headline === publishedData.title &&
      articleBlock[1].includes('\\u003c/script>') && !articleBlock[1].includes('<'),
    'JSON-LD must preserve its data while escaping script-closing markup.')
    check(!article.text.includes('</script><script>globalThis.qaInjection=1</script>'),
      'Untrusted JSON-LD text must not become executable script markup.')
    const sitemap = await request('/sitemap.xml')
    check(sitemap.response.status === 200 && sitemap.text.includes(`/blog/${published.slug}`) &&
      !sitemap.text.includes(draft.slug) && !sitemap.text.includes(future.slug),
    'The sitemap must include only the published fixture, with no draft or scheduled URLs.')
    const listing = await request('/blog')
    check(listing.response.status === 200 && listing.text.includes(published.slug) &&
      !listing.text.includes(draft.slug) && !listing.text.includes(future.slug) && !listing.text.includes(draftMarker),
    'The blog listing must show the live fixture without private revisions or hidden slugs.')
    pass('CMS-only public body and SEO; private pages, sitemap, listing, and JSON-LD safety')
  }
} catch (error) {
  failed = true
  // Never stringify an exception: database libraries can include connection details.
  console.error(`FAIL ${stage}; ${error instanceof assert.AssertionError ? error.message : 'exception details withheld to protect credentials.'}`)
} finally {
  stage = 'cleanup'
  if (payload) {
    try {
      // An operation can commit before its response fails. Recover only exact owned slugs.
      const owned = await payload.find({ collection: 'posts', overrideAccess: true, draft: false,
        where: { slug: { in: [...slugs] } }, limit: 10, depth: 0 })
      for (const doc of owned.docs) {
        check(slugs.has(doc.slug), 'Cleanup must only select this run\'s exact QA slugs.')
        postIDs.add(doc.id)
      }
      for (const id of postIDs) {
        const doc = await payload.findByID({ collection: 'posts', id, overrideAccess: true, draft: false, depth: 0 })
        check(slugs.has(doc.slug), 'Refusing to delete a post outside this run\'s exact QA slugs.')
        await payload.delete({ collection: 'posts', id, overrideAccess: true })
      }
      const users = await payload.find({ collection: 'users', overrideAccess: true,
        where: { email: { equals: email } }, limit: 2, depth: 0 })
      for (const user of users.docs) {
        check(user.email === email && user.name === `${run} integration fixture`,
          'Refusing to delete a user outside this run\'s exact QA identity.')
        await payload.delete({ collection: 'users', id: user.id, overrideAccess: true })
      }
      const remaining = await payload.count({ collection: 'posts', overrideAccess: true,
        where: { slug: { in: [...slugs] } } })
      const remainingUsers = await payload.count({ collection: 'users', overrideAccess: true,
        where: { email: { equals: email } } })
      check(remaining.totalDocs === 0 && remainingUsers.totalDocs === 0, 'All of this run\'s QA documents must be removed.')
      pass('exact owned fixture IDs removed; original data untouched')
    } catch {
      cleanupFailed = true
      console.error('FAIL fixture cleanup; inspect only qa-cms markers before proceeding.')
    }
    try { await payload.destroy() } catch { cleanupFailed = true }
  }
}
console.log(`RESULT ${labels.length} groups passed; mode=${baseURL ? 'Local API + HTTP' : 'Local API'}; cleanup=${cleanupFailed ? 'FAILED' : 'complete'}`)
process.exitCode = failed || cleanupFailed ? 1 : 0
// Payload's optional worker/timer integrations can keep this standalone runner alive.
// All awaited cleanup and pool destruction above finish before exiting our own process.
process.exit(process.exitCode)
