import http from 'node:http'
import path from 'node:path'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { readFile, rename, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// Local setup only. Never expose this server or its password field publicly.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envFile = path.join(root, '.env.local')
const caFile = path.join(root, 'config', 'supabase', 'prod-ca-2021.crt')
const project = 'mqgieansdrkbxfihwlki'
const origin = 'http://127.0.0.1:3277'
const nonce = randomBytes(32).toString('hex')
const page = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>木朗数据库连接</title><style>body{font:18px/1.7 "Microsoft YaHei",sans-serif;max-width:620px;margin:60px auto;padding:20px;background:#f5f7f5;color:#172821}main{background:white;padding:32px;border-radius:16px}input,button{box-sizing:border-box;width:100%;font:inherit;padding:12px;margin:12px 0}button{background:#16764c;color:white;border:0;border-radius:8px}small{color:#567}</style><main><h1>连接木朗数据库</h1><p>项目：mulang-apparel-cms<br><small>${project}</small></p><p>输入刚才创建数据库时设置的密码。密码只会发送到这个 Supabase 项目验证，并保存在本机项目的私密配置中，不会写入 Git、笔记或聊天。</p><form method="post" action="/save"><input type="hidden" name="nonce" value="${nonce}"><label for="password">数据库密码</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="1024"><button type="submit">验证并保存到本机</button></form><small>此页面仅在本机开放。验证过程不会修改数据库中的文章或账号。</small></main></html>`

function respond(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  })
  res.end(body)
}

let busy = false
function validBrowserSource(req) {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const requestOrigin = req.headers.origin
  if (requestOrigin === origin) return true
  // Embedded browsers can submit same-origin forms with an opaque Origin.
  return (!requestOrigin || requestOrigin === 'null') &&
    (!req.headers['sec-fetch-site'] || ['same-origin', 'none'].includes(req.headers['sec-fetch-site']))
}
const server = http.createServer(async (req, res) => {
  if (req.headers.host !== '127.0.0.1:3277') return respond(res, 403, '请求来源不符。')
  if (req.method === 'GET' && req.url === '/') return respond(res, 200, page)
  if (req.method !== 'POST' || req.url !== '/save') return respond(res, 404, '未找到页面。')
  if (!validBrowserSource(req)) return respond(res, 403, '<meta charset="utf-8">提交来源不符。请<a href="/">重新打开本机配置页</a>。')
  let ownsBusy = false
  let client
  try {
    let body = ''
    for await (const chunk of req) {
      body += chunk.toString('utf8')
      if (Buffer.byteLength(body) > 8192) throw new Error('invalid-input')
    }
    const fields = new URLSearchParams(body)
    const token = Buffer.from(fields.get('nonce') ?? '')
    if (fields.getAll('nonce').length !== 1 || token.length !== nonce.length || !timingSafeEqual(token, Buffer.from(nonce))) throw new Error('invalid-input')
    const password = fields.get('password')
    if (!password || password.length > 1024 || fields.getAll('password').length !== 1) throw new Error('invalid-input')
    if (busy) return respond(res, 409, '<meta charset="utf-8">上一笔连接正在验证，请稍候再<a href="/">重新打开配置页</a>。')
    busy = true
    ownsBusy = true
    const { default: pg } = await import('pg')
    const ca = await readFile(caFile, 'utf8')
    const adminURL = new URL(`postgresql://postgres.${project}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`)
    client = new pg.Client({
      connectionString: adminURL.toString(),
      ssl: { ca, rejectUnauthorized: true },
      connectionTimeoutMillis: 15000,
      query_timeout: 15000,
    })
    client.on('error', () => {})
    await client.connect()
    const result = await client.query('select 1 as connection_ok')
    if (result.rows[0]?.connection_ok !== 1) throw new Error('connection-failed')
    let existing = await readFile(envFile, 'utf8').catch(error => { if (error.code === 'ENOENT') return ''; throw error })
    const set = (key, value) => {
      const line = `${key}="${value}"`
      const pattern = new RegExp(`^[\\t ]*(?:export\\s+)?${key}\\s*=.*(?:\\r?\\n|$)`, 'gm')
      existing = `${existing.replace(pattern, '').trimEnd()}\n${line}\n`
    }
    // Admin credentials are for migrations only; runtime receives a scoped role later.
    set('DATABASE_MIGRATION_URL', adminURL.toString())
    const lastSecret = [...existing.matchAll(/^[\t ]*(?:export\s+)?PAYLOAD_SECRET\s*=(.*)$/gm)].at(-1)?.[1].trim() ?? ''
    if (/^(?:""|''|)(?:\s*#.*)?$/.test(lastSecret)) set('PAYLOAD_SECRET', randomBytes(48).toString('hex'))
    const pendingFile = `${envFile}.pending-${randomBytes(8).toString('hex')}`
    try {
      await writeFile(pendingFile, existing, { mode: 0o600, flag: 'wx' })
      await rename(pendingFile, envFile)
    } finally {
      await rm(pendingFile, { force: true }).catch(() => {})
    }
    respond(res, 200, '<meta charset="utf-8"><h1>连接验证通过，已保存到本机。</h1><p>可以回到聊天告诉我“保存好了”。密码无需发送。</p>')
    console.log('CMS database connection verified; private local configuration saved. No credentials logged.')
    server.close()
  } catch (error) {
    const code = error?.code
    let message = '暂时无法连接数据库，配置未保存。请回到聊天告知这个提示，不用发送密码。'
    if (error?.message === 'invalid-input') message = '表单已经更新或填写不完整，请重新打开配置页。'
    else if (code === '28P01') message = '数据库没有接受这个密码。配置未保存，请确认使用的是刚才设置的数据库密码。'
    else if (['SELF_SIGNED_CERT_IN_CHAIN', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'CERT_HAS_EXPIRED', 'ERR_TLS_CERT_ALTNAME_INVALID'].includes(code)) message = '数据库连接的证书校验未通过。配置未保存，请回到聊天告诉我“证书校验未通过”。'
    else if (['ENOTFOUND', 'EAI_AGAIN', 'ENETUNREACH', 'ETIMEDOUT', 'ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', '53300', '57P03'].includes(code) || /tim(?:e|ed)[ -]?out|connection timeout/i.test(error?.message ?? '')) message = '数据库网络连接暂时失败或超时。配置未保存，请回到聊天告诉我“连接超时”。'
    // Only classify known error codes; never log raw database errors or credentials.
    respond(res, 400, `<meta charset="utf-8"><h1>尚未保存</h1><p>${message}</p><a href="/">重新打开配置页</a>`)
  } finally {
    let cleanupTimer
    try {
      if (client) await Promise.race([
        client.end().catch(() => {}),
        new Promise(resolve => { cleanupTimer = setTimeout(resolve, 2000) }),
      ])
    } finally {
      clearTimeout(cleanupTimer)
      if (ownsBusy) busy = false
    }
  }
})
server.requestTimeout = 20000
server.headersTimeout = 10000
server.listen(3277, '127.0.0.1', () => console.log(`Local CMS setup: ${origin}`))
