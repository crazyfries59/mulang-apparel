import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import { access, mkdir, readFile, realpath, readdir, rm, writeFile } from 'node:fs/promises'
import http from 'node:http'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'

// Every password, env file, client, process, and port below belongs to a fixture.
// The production helper is copied unchanged except for its isolated local port.
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const rawErrorMarker = 'DO_NOT_SHOW_FAKE_DB_DETAILS'
const fakePg = [
  "import { EventEmitter } from 'node:events'",
  "import { appendFileSync, existsSync } from 'node:fs'",
  "import path from 'node:path'",
  "import { fileURLToPath } from 'node:url'",
  "import { setTimeout as delay } from 'node:timers/promises'",
  "const root = fileURLToPath(new URL('../../', import.meta.url))",
  "const mark = (type, mode) => appendFileSync(path.join(root, 'events.jsonl'), JSON.stringify({ type, mode }) + '\\n')",
  "class Client extends EventEmitter {",
  "  constructor(options) {",
  "    super()",
  "    if (options.ssl?.rejectUnauthorized !== true || !String(options.ssl.ca).includes('BEGIN CERTIFICATE')) throw new Error('Fixture requires strict TLS with the public CA')",
  "    if (new URL(options.connectionString).searchParams.has('sslmode')) throw new Error('URL must not override explicit TLS options')",
  "    const value = decodeURIComponent(new URL(options.connectionString).password)",
  "    this.mode = ['auth-fail', 'timeout', 'tls-fail', 'cleanup-hang', 'busy', 'idle-error'].includes(value) ? value : 'ok'",
  "    mark('construct', this.mode)",
  "  }",
  "  async connect() {",
  "    mark('connect', this.mode)",
  "    if (this.mode === 'busy') {",
  "      const deadline = Date.now() + 6000",
  "      while (!existsSync(path.join(root, 'release-connect'))) {",
  "        if (Date.now() > deadline) throw new Error('fixture release timed out')",
  "        await delay(20)",
  "      }",
  "    }",
  "    if (['auth-fail', 'busy'].includes(this.mode)) throw Object.assign(new Error('DO_NOT_SHOW_FAKE_DB_DETAILS'), { code: '28P01' })",
  "    if (['timeout', 'cleanup-hang'].includes(this.mode)) throw Object.assign(new Error('DO_NOT_SHOW_FAKE_DB_DETAILS'), { code: 'ETIMEDOUT' })",
  "    if (this.mode === 'tls-fail') throw Object.assign(new Error('DO_NOT_SHOW_FAKE_DB_DETAILS'), { code: 'SELF_SIGNED_CERT_IN_CHAIN' })",
  "  }",
  "  async query(sql) {",
  "    mark('query', this.mode)",
  "    if (sql !== 'select 1 as connection_ok') throw new Error('Fixture rejects every other SQL statement')",
  "    if (this.mode === 'idle-error') queueMicrotask(() => this.emit('error', new Error('DO_NOT_SHOW_FAKE_DB_DETAILS')))",
  "    return { rows: [{ connection_ok: 1 }] }",
  "  }",
  "  end() {",
  "    mark('end', this.mode)",
  "    return this.mode === 'cleanup-hang' ? new Promise(() => {}) : Promise.resolve()",
  "  }",
  "}",
  "export default { Client }",
].join('\n')

async function waitUntil(predicate, timeout = 5000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (await predicate()) return
    await delay(30)
  }
  throw new Error('Fixture condition did not become true before its deadline')
}

async function findPort() {
  for (let port = 3278; port < 3310; port++) {
    const probe = net.createServer()
    try {
      await new Promise((resolve, reject) => {
        probe.once('error', reject)
        probe.listen(port, '127.0.0.1', resolve)
      })
      await new Promise(resolve => probe.close(resolve))
      return port
    } catch (error) {
      if (error.code !== 'EADDRINUSE') throw error
    }
  }
  throw new Error('No isolated fixture port is available')
}

function request(fixture, { method = 'GET', route = '/', body = '', headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1', port: fixture.port, method, path: route,
      headers: { Host: '127.0.0.1:' + fixture.port, Connection: 'close', ...headers },
      agent: false,
    }, res => {
      let text = ''
      res.setEncoding('utf8')
      res.on('data', chunk => { text += chunk })
      res.on('end', () => resolve({ status: res.statusCode, text, headers: res.headers }))
    })
    req.once('error', reject)
    req.setTimeout(8000, () => req.destroy(new Error('Fixture HTTP request timed out')))
    req.end(body)
  })
}

function submit(fixture, password, { nonce = fixture.nonce, extra = [], headers = {} } = {}) {
  const body = new URLSearchParams([['nonce', nonce], ['password', password], ...extra]).toString()
  return request(fixture, {
    method: 'POST', route: '/save', body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
      Origin: 'null', 'Sec-Fetch-Site': 'same-origin', ...headers,
    },
  })
}

async function withFixture(run, initialEnv = 'OTHER_FLAG="keep-virtual"\n') {
  const id = 'cms-setup-qa-' + process.pid + '-' + randomUUID()
  const directory = path.join(repository, 'archive-cms-seo-rollout', id)
  const envFile = path.join(directory, '.env.local')
  assert.notEqual(envFile, path.join(repository, '.env.local'))
  await mkdir(path.join(directory, 'scripts'), { recursive: true })
  await mkdir(path.join(directory, 'node_modules', 'pg'), { recursive: true })
  await mkdir(path.join(directory, 'config', 'supabase'), { recursive: true })
  await writeFile(path.join(directory, 'config', 'supabase', 'prod-ca-2021.crt'),
    await readFile(path.join(repository, 'config', 'supabase', 'prod-ca-2021.crt')))
  await writeFile(path.join(directory, 'fixture-owner'), id)
  await writeFile(envFile, initialEnv)
  await writeFile(path.join(directory, 'node_modules', 'pg', 'package.json'),
    JSON.stringify({ name: 'pg', type: 'module', exports: './index.mjs' }))
  await writeFile(path.join(directory, 'node_modules', 'pg', 'index.mjs'), fakePg)
  const source = await readFile(path.join(repository, 'scripts', 'setup-cms-connection.mjs'), 'utf8')
  assert.match(source, /127\.0\.0\.1:3277/)
  const port = await findPort()
  const script = path.join(directory, 'scripts', 'setup-cms-connection.mjs')
  await writeFile(script, source.replaceAll('3277', String(port)))
  const child = spawn(process.execPath, [script], {
    cwd: directory, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.stdout.on('data', chunk => { output += chunk })
  child.stderr.on('data', chunk => { output += chunk })
  const closed = once(child, 'close')
  const fixture = {
    directory, envFile, port, origin: 'http://127.0.0.1:' + port,
    events: async () => {
      const text = await readFile(path.join(directory, 'events.jsonl'), 'utf8')
        .catch(error => { if (error.code === 'ENOENT') return ''; throw error })
      return text.trim() ? text.trim().split('\n').map(line => JSON.parse(line)) : []
    },
  }
  try {
    await waitUntil(() => {
      if (child.exitCode !== null) throw new Error('Fixture server exited: ' + output)
      return output.includes('Local CMS setup:')
    })
    const page = await request(fixture)
    assert.equal(page.status, 200)
    assert.equal(page.headers['cache-control'], 'no-store')
    assert.match(page.headers['content-security-policy'], /frame-ancestors 'none'/)
    fixture.nonce = page.text.match(/name="nonce" value="([a-f0-9]{64})"/)?.[1]
    assert.ok(fixture.nonce, 'Real helper must provide its random form nonce')
    await run(fixture)
  } finally {
    if (child.exitCode === null && child.signalCode === null) child.kill()
    await Promise.race([closed, delay(3000).then(() => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL')
        throw new Error('Own fixture child did not stop')
      }
    })])
    // Verify the exact absolute deletion target and ownership before recursion.
    const actualRoot = await realpath(repository)
    const actualDirectory = await realpath(directory)
    assert.ok(actualDirectory.startsWith(actualRoot + path.sep))
    assert.equal(path.basename(actualDirectory), id)
    assert.equal(await readFile(path.join(directory, 'fixture-owner'), 'utf8'), id)
    await rm(actualDirectory, { recursive: true, force: true })
    assert.ok(!output.includes(rawErrorMarker), 'Helper must not log raw fake PG errors')
  }
}

test('local CMS connection helper regression (offline fake PG)', { timeout: 60000 }, async t => {
  await t.test('host, foreign origins, cross-site and duplicate fields never reach PG', async () => {
    await withFixture(async fixture => {
      assert.equal((await request(fixture, { headers: { Host: 'localhost:' + fixture.port } })).status, 403)
      assert.equal((await submit(fixture, 'virtual', { headers: { Origin: 'https://foreign.invalid' } })).status, 403)
      assert.equal((await submit(fixture, 'virtual', { headers: { Origin: fixture.origin, 'Sec-Fetch-Site': 'cross-site' } })).status, 403)
      assert.equal((await submit(fixture, 'virtual', { nonce: 'invalid' })).status, 400)
      assert.equal((await submit(fixture, 'virtual', { extra: [['nonce', fixture.nonce]] })).status, 400)
      assert.equal((await submit(fixture, 'virtual', { extra: [['password', 'duplicate-virtual']] })).status, 400)
      assert.deepEqual(await fixture.events(), [])
      assert.equal(await readFile(fixture.envFile, 'utf8'), 'OTHER_FLAG="keep-virtual"\n')
    })
  })

  await t.test('null and missing Origin work while PG failures remain sanitized', async () => {
    await withFixture(async fixture => {
      for (const headers of [{}, { Origin: undefined }, { Origin: fixture.origin }]) {
        // Node must omit a missing header rather than serialize undefined.
        const response = headers.Origin === undefined && Object.hasOwn(headers, 'Origin')
          ? await request(fixture, {
            method: 'POST', route: '/save',
            body: new URLSearchParams({ nonce: fixture.nonce, password: 'auth-fail' }).toString(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Sec-Fetch-Site': 'same-origin' },
          })
          : await submit(fixture, 'auth-fail', { headers })
        assert.equal(response.status, 400)
        assert.match(response.text, /数据库没有接受这个密码/)
        assert.ok(!response.text.includes(rawErrorMarker))
      }
      const timeout = await submit(fixture, 'timeout')
      assert.equal(timeout.status, 400)
      assert.match(timeout.text, /连接超时/)
      assert.ok(!timeout.text.includes(rawErrorMarker))
      const tlsFailure = await submit(fixture, 'tls-fail')
      assert.equal(tlsFailure.status, 400)
      assert.match(tlsFailure.text, /证书校验未通过/)
      assert.ok(!tlsFailure.text.includes(rawErrorMarker))
      assert.equal(await readFile(fixture.envFile, 'utf8'), 'OTHER_FLAG="keep-virtual"\n')
    })
  })

  await t.test('invalid concurrency cannot release another submission lock', async () => {
    await withFixture(async fixture => {
      const first = submit(fixture, 'busy')
      await waitUntil(async () => (await fixture.events()).some(event => event.type === 'connect'))
      assert.equal((await submit(fixture, 'virtual', { nonce: 'invalid' })).status, 400)
      assert.equal((await submit(fixture, 'auth-fail')).status, 409)
      assert.equal((await fixture.events()).filter(event => event.type === 'connect').length, 1)
      await writeFile(path.join(fixture.directory, 'release-connect'), 'release only the fake client')
      assert.equal((await first).status, 400)
      assert.equal((await submit(fixture, 'auth-fail')).status, 400)
      assert.equal((await fixture.events()).filter(event => event.type === 'connect').length, 2)
    })
  })

  await t.test('a hung PG cleanup releases busy after the two-second deadline', async () => {
    await withFixture(async fixture => {
      const started = Date.now()
      assert.equal((await submit(fixture, 'cleanup-hang')).status, 400)
      assert.equal((await submit(fixture, 'auth-fail')).status, 409)
      let response
      await waitUntil(async () => {
        response = await submit(fixture, 'auth-fail')
        return response.status !== 409
      }, 5000)
      assert.equal(response.status, 400)
      assert.ok(Date.now() - started >= 1800, 'Cleanup must be bounded by its actual deadline')
    })
  })

  await t.test('null-origin success atomically deduplicates URL and replaces empty secret', async () => {
    const initial = [
      'OTHER_FLAG="keep-virtual"',
      'DATABASE_MIGRATION_URL="postgresql://old-virtual-one"',
      '  export DATABASE_MIGRATION_URL="postgresql://old-virtual-two"',
      'PAYLOAD_SECRET="" # empty virtual fixture',
      '',
    ].join('\n')
    await withFixture(async fixture => {
      const virtualPassword = 'Virtual-only:/?#%&+' + String.fromCharCode(34, 39, 92) + '中文'
      const response = await submit(fixture, virtualPassword)
      assert.equal(response.status, 200)
      assert.match(response.text, /连接验证通过/)
      assert.ok(!response.text.includes(virtualPassword))
      const saved = await readFile(fixture.envFile, 'utf8')
      assert.equal([...saved.matchAll(/^[\t ]*(?:export\s+)?DATABASE_MIGRATION_URL\s*=/gm)].length, 1)
      assert.ok(saved.includes('OTHER_FLAG="keep-virtual"'))
      const value = saved.match(/^DATABASE_MIGRATION_URL="([^"\r\n]+)"$/m)?.[1]
      const url = new URL(value)
      assert.equal(decodeURIComponent(url.password), virtualPassword)
      assert.equal(url.searchParams.get('sslmode'), null, 'Explicit strict TLS options must not be overridden by the saved URL')
      assert.match(saved, /^PAYLOAD_SECRET="[a-f0-9]{96}"$/m)
      assert.ok(!(await readdir(fixture.directory)).some(name => name.startsWith('.env.local.pending-')))
      assert.equal((await fixture.events()).filter(event => event.type === 'query').length, 1)
    }, initial)
  })

  await t.test('idle PG error is handled without leaking or terminating the helper', async () => {
    await withFixture(async fixture => {
      const response = await submit(fixture, 'idle-error')
      assert.equal(response.status, 200)
      await access(fixture.envFile)
      assert.ok((await readFile(fixture.envFile, 'utf8')).includes('DATABASE_MIGRATION_URL='))
    })
  })
})
