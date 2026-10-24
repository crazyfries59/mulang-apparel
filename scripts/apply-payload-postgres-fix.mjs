import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Backport only the connectivity probe's result.release() from official Payload:
// https://github.com/payloadcms/payload/blob/main/packages/db-postgres/src/connect.ts
// https://raw.githubusercontent.com/payloadcms/payload/main/packages/db-postgres/src/connect.ts
// v3.91.0 retains its probe checkout, leaving max:2 unable to serve a transaction
// plus the document-lock query. This patch never changes transaction clients,
// pool capacity, TLS, schema, RLS, or document locking. Remove after upgrading to
// an upstream release that contains the fix, with an explicit version review.
export const expectedVersion = '3.91.0'
export const originalSHA256 = '696a0071e054d5771c457d3962622995a0c694af96e7e9f268ac21accd7a84e9'
export const patchedSHA256 = '682ae790ac8a58a662fc7781983f1b467107cf8e31afca403d0338b4fe539658'
const originalFragment = '    });\n};\nexport const connect'
const patchedFragment = '    });\n    result.release();\n};\nexport const connect'
const sha256 = source => createHash('sha256').update(source).digest('hex')
const reject = message => { throw Object.assign(new Error(message), { code: 'PAYLOAD_POSTGRES_PATCH' }) }

export function patchConnectSource(version, source) {
  if (version !== expectedVersion) reject('Unsupported @payloadcms/db-postgres version; review the probe fix before upgrading from 3.91.0.')
  const hash = sha256(source)
  if (hash === patchedSHA256) return { changed: false, source }
  if (hash !== originalSHA256) reject('Unrecognized @payloadcms/db-postgres connect.js SHA256; refusing to change dependency code.')
  if (source.split(originalFragment).length !== 2) reject('Expected exactly one Payload probe boundary; refusing an ambiguous patch.')
  const patched = source.replace(originalFragment, patchedFragment)
  if (sha256(patched) !== patchedSHA256) reject('Payload probe patch did not produce the reviewed SHA256.')
  return { changed: true, source: patched }
}

export async function applyPayloadPostgresFix() {
  // Resolve the installed package without importing or initializing Payload/pg.
  const entry = fileURLToPath(import.meta.resolve('@payloadcms/db-postgres'))
  const packageDirectory = path.resolve(path.dirname(entry), '..')
  const metadata = JSON.parse(await readFile(path.join(packageDirectory, 'package.json'), 'utf8'))
  const filename = path.join(packageDirectory, 'dist', 'connect.js')
  const original = await readFile(filename, 'utf8')
  const result = patchConnectSource(metadata.version, original)
  if (result.changed) await writeFile(filename, result.source, 'utf8')
  if (sha256(await readFile(filename)) !== patchedSHA256) reject('Installed Payload probe fix failed verification.')
  return result.changed
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const changed = await applyPayloadPostgresFix()
    console.log(changed ? 'Applied reviewed Payload 3.91.0 Postgres probe release fix.' : 'Verified Payload 3.91.0 Postgres probe release fix (already applied).')
  } catch (error) {
    console.error(error?.code === 'PAYLOAD_POSTGRES_PATCH' ? error.message : 'Unable to inspect or write the expected Payload Postgres package; installation stopped.')
    process.exitCode = 1
  }
}
