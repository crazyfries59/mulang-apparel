import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import test from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'
import pg from 'pg'
import { expectedVersion, originalSHA256, patchedSHA256, patchConnectSource } from '../scripts/apply-payload-postgres-fix.mjs'
import { payloadPg, SafePool } from '../lib/database/payload-pg.mjs'

// No environment loading, sockets, real database clients, or dependency writes.
// Exercise the actual installed probe in an entirely in-memory fake pool.
const entry = fileURLToPath(import.meta.resolve('@payloadcms/db-postgres'))
const installed = await readFile(path.join(path.dirname(entry), 'connect.js'), 'utf8')
const hash = source => createHash('sha256').update(source).digest('hex')
assert.ok([originalSHA256, patchedSHA256].includes(hash(installed)), 'Tests require the reviewed installed adapter source.')
const original = hash(installed) === originalSHA256 ? installed : installed.replace('    result.release();\n};\nexport const connect', '};\nexport const connect')
assert.equal(hash(original), originalSHA256)
const corrected = patchConnectSource(expectedVersion, original).source
const probe = source => {
  const code = source.slice(source.indexOf('const connectWithReconnect'), source.indexOf('export const connect'))
  return new Function('setTimeout', `${code}\nreturn connectWithReconnect;`)(setTimeout)
}
const adapter = { payload: { logger: { info() {} } } }

class FakePool {
  max = 2
  all = []
  idle = []
  checkedOut = new Set()
  async connect() {
    let client = this.idle.shift()
    if (!client && this.all.length < this.max) {
      client = new EventEmitter()
      this.all.push(client)
    }
    if (!client) {
      await delay(10)
      throw Object.assign(new Error('Offline fixture pool checkout timeout.'), { code: 'POOL_TIMEOUT' })
    }
    this.checkedOut.add(client)
    client.release = () => {
      assert.ok(this.checkedOut.delete(client), 'A client must be released exactly once per checkout.')
      this.idle.push(client)
    }
    return client
  }
  async query() {
    const client = await this.connect()
    try { return { rows: [{ ok: true }] } } finally { client.release() }
  }
  async end() {
    while (this.checkedOut.size) await delay(1)
  }
}

test('unpatched probe pins a client, blocks transaction plus lock query, and prevents drain', async () => {
  const pool = new FakePool()
  await probe(original)({ adapter, pool })
  assert.equal(pool.checkedOut.size, 1)
  const transaction = await pool.connect()
  await assert.rejects(() => pool.query(), error => error.code === 'POOL_TIMEOUT')
  transaction.release()
  const end = pool.end()
  assert.equal(await Promise.race([end.then(() => 'drained'), delay(15, 'pinned')]), 'pinned')
  for (const client of [...pool.checkedOut]) client.release()
  await end
})

test('official one-line fix releases init and reconnect probes without releasing transaction clients', async () => {
  const pool = new FakePool()
  const connect = probe(corrected)
  await connect({ adapter, pool })
  assert.equal(pool.checkedOut.size, 0)
  const transaction = await pool.connect()
  await pool.query()
  assert.equal(pool.checkedOut.size, 1)
  assert.ok(pool.checkedOut.has(transaction), 'A transaction keeps its exclusive client until its own release.')
  transaction.release()
  await connect({ adapter, pool, reconnect: true })
  assert.equal(pool.checkedOut.size, 0)
  await pool.end()
})

test('reviewed source patch adds exactly one line and is idempotent by patched SHA256', () => {
  assert.equal(hash(corrected), patchedSHA256)
  assert.equal(corrected.split('\n').length, original.split('\n').length + 1)
  assert.equal(corrected.replace('    result.release();\n};\nexport const connect', '};\nexport const connect'), original)
  assert.deepEqual(patchConnectSource(expectedVersion, corrected), { changed: false, source: corrected })
})

test('unknown versions and modified original or patched bytes fail closed', () => {
  assert.throws(() => patchConnectSource('3.92.0', original), /Unsupported.*version/)
  assert.throws(() => patchConnectSource(expectedVersion, original + '\n'), /Unrecognized.*SHA256/)
  assert.throws(() => patchConnectSource(expectedVersion, corrected + '\n'), /Unrecognized.*SHA256/)
})

class FakeClient extends EventEmitter {
  _queryable = true
  _ending = false
  connect(callback) { queueMicrotask(() => callback()) }
  end(callback) { this._ending = true; this.emit('end'); callback?.() }
  isConnected() { return !this._ending }
  query(_text, values, callback) {
    const done = typeof values === 'function' ? values : callback
    queueMicrotask(() => done(null, { rows: [{ ok: true }] }))
  }
}

test('injected driver preserves pg methods without evaluating the native getter', () => {
  assert.equal(Object.getPrototypeOf(payloadPg), pg)
  assert.deepEqual(Object.getOwnPropertyNames(payloadPg), ['Pool'])
  assert.equal(payloadPg.Pool, SafePool)
  assert.equal(payloadPg.Client, pg.Client)
  assert.equal(SafePool.prototype.connect, pg.Pool.prototype.connect)
  assert.equal(SafePool.prototype.query, pg.Pool.prototype.query)
  assert.equal(SafePool.prototype.end, pg.Pool.prototype.end)
})

test('real pg.Pool with fake Client safely handles idle errors, reconnects, preserves a transaction, and drains', async () => {
  const pool = new payloadPg.Pool({ Client: FakeClient, max: 2, idleTimeoutMillis: 0, connectionTimeoutMillis: 50 })
  const logs = []
  const originalError = console.error
  console.error = (...values) => logs.push(values)
  let transaction
  try {
    await probe(corrected)({ adapter, pool })
    assert.equal(pool.idleCount, 1)
    transaction = await pool.connect()
    await new Promise((resolve, reject) => transaction.query('BEGIN', error => error ? reject(error) : resolve()))
    await pool.query('SELECT 1')
    assert.equal(pool.totalCount - pool.idleCount, 1, 'The active transaction retains its exclusive client.')

    const secret = 'VIRTUAL-CREDENTIAL-AND-SQL-MUST-NOT-APPEAR'
    pool._idle[0].client.emit('error', Object.assign(new Error(secret), { code: '57P01', detail: secret, query: secret }))
    await pool.query('SELECT 1')
    assert.equal(pool.totalCount - pool.idleCount, 1, 'Handling a different idle client must not release the transaction.')
    transaction.release()
    const releasedTransaction = transaction
    transaction = null
    // This client has Payload's probe listener. Exercise its actual ECONNRESET
    // reconnect callback through the real driver, in addition to the pool event.
    releasedTransaction.emit('error', Object.assign(new Error(secret), { code: 'ECONNRESET', detail: secret }))
    for (let retry = 0; retry < 50 && (pool.waitingCount || pool.totalCount !== pool.idleCount); retry++) await delay(1)
    assert.equal(pool.waitingCount, 0)
    assert.equal(pool.totalCount, pool.idleCount)
    assert.equal(pool.totalCount, 1)
    assert.deepEqual(logs, Array.from({ length: 2 }, () => ['[database] An idle Postgres connection was discarded by the pool.']))
    assert.ok(!JSON.stringify(logs).includes(secret), 'No raw error, query, or credential details may be logged.')
  } finally {
    transaction?.release()
    console.error = originalError
    await pool.end()
  }
  assert.equal(pool.ended, true)
})
