/* Imports customers from a reviewed JSON list through the admin REST API, so it works the same
   against the local SQLite preview and a deployed site and obeys normal login + access rules.
   Usage: CRM_BASE_URL=http://localhost:3100 CRM_EMAIL=... CRM_PASSWORD=... \
          node scripts/import-crm-customers.mjs data/crm-customers.json
   Customers whose name already exists are skipped, so the import can be re-run safely. */
import { readFile } from 'node:fs/promises'

const [file] = process.argv.slice(2)
const { CRM_BASE_URL: base, CRM_EMAIL: email, CRM_PASSWORD: password } = process.env
if (!file || !base || !email || !password) {
  throw new Error('Usage: CRM_BASE_URL=... CRM_EMAIL=... CRM_PASSWORD=... node scripts/import-crm-customers.mjs <list.json>')
}

const rows = JSON.parse(await readFile(file, 'utf8'))
if (!Array.isArray(rows) || rows.some((row) => typeof row?.name !== 'string' || !row.name.trim())) {
  throw new Error('The list must be an array of objects that each have a name.')
}

const login = await fetch(new URL('/api/users/login', base), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
if (!login.ok) throw new Error(`Login failed (${login.status}).`)
const { token } = await login.json()
const headers = { 'Content-Type': 'application/json', Authorization: `JWT ${token}` }

let created = 0
let skipped = 0
for (const row of rows) {
  const query = new URLSearchParams({ 'where[name][equals]': row.name.trim(), limit: '1', depth: '0' })
  const existing = await fetch(new URL(`/api/customers?${query}`, base), { headers }).then((res) => res.json())
  if (existing.totalDocs > 0) {
    skipped += 1
    continue
  }
  const res = await fetch(new URL('/api/customers', base), {
    method: 'POST',
    headers,
    body: JSON.stringify({ stage: 'contacted', ...row, name: row.name.trim() }),
  })
  if (!res.ok) throw new Error(`Could not create "${row.name}" (${res.status}): ${await res.text()}`)
  created += 1
}
console.log(`Customers created: ${created}, skipped (already present): ${skipped}`)
