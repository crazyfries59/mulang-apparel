import { readFileSync } from 'node:fs'
import path from 'node:path'

/** @param {string} connectionString */
export function postgresOptions(connectionString) {
  const url = new URL(connectionString)
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('Postgres connection required.')
  // pg URL SSL parameters override the explicit CA options, so normalize them.
  for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'ssl']) url.searchParams.delete(key)
  const supabase = url.hostname.endsWith('.supabase.com') || url.hostname.endsWith('.supabase.co')
  return {
    connectionString: url.toString(),
    max: 2,
    connectionTimeoutMillis: 15000,
    ssl: {
      rejectUnauthorized: true,
      ...(supabase ? { ca: readFileSync(path.resolve('config/supabase/prod-ca-2021.crt'), 'utf8') } : {}),
    },
  }
}
