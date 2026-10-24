import assert from 'node:assert/strict'
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd())

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.ts')
const { PRODUCTS } = await import('../app/(site)/products/data.ts')

const projectRef = 'mqgieansdrkbxfihwlki'
assert.ok(process.env.DATABASE_URL, 'A Postgres runtime DATABASE_URL is required.')
const databaseURL = new URL(process.env.DATABASE_URL)
assert.ok(/^postgres(?:ql)?:$/.test(databaseURL.protocol), 'A Postgres runtime DATABASE_URL is required.')
assert.ok(
  databaseURL.hostname === `db.${projectRef}.supabase.co` ||
  (databaseURL.hostname.endsWith('.pooler.supabase.com') && databaseURL.username.endsWith(`.${projectRef}`)),
  'Refusing to import the catalog into an unexpected database project.',
)
assert.ok(process.env.PAYLOAD_SECRET, 'PAYLOAD_SECRET is required.')

const payload = await getPayload({ config })
const publicProductWhere = (now = new Date()) => ({
  and: [
    { _status: { equals: 'published' } },
    { publishedAt: { less_than_equal: now.toISOString() } },
  ],
})
let imported = 0
let alreadyPresent = 0

try {
  const existing = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0,
    draft: false,
    overrideAccess: true,
    sort: 'sortOrder',
  })
  const knownSlugs = new Set(PRODUCTS.map((product) => product.slug))
  const unknownSlugs = existing.docs.filter((product) => !knownSlugs.has(product.slug)).length
  assert.equal(unknownSlugs, 0, 'The target contains products outside the bundled catalog; review before importing.')

  const existingSlugs = new Set(existing.docs.map((product) => product.slug))
  for (const [sortOrder, product] of PRODUCTS.entries()) {
    if (existingSlugs.has(product.slug)) {
      alreadyPresent += 1
      continue
    }

    await payload.create({
      collection: 'products',
      overrideAccess: true,
      draft: false,
      data: {
        productCode: product.id,
        name: product.name,
        slug: product.slug,
        category: product.cat,
        subcategory: product.sub,
        gsm: product.gsm,
        price: product.price,
        moq: product.moq,
        leadTime: product.lead,
        fabric: product.fabric,
        badge: product.badge,
        coverImage: product.img,
        description: product.desc,
        sizes: product.sizes,
        gallery: product.gallery.map((image) => ({ image })),
        details: product.details.map((image) => ({ image })),
        intro: {
          feature: product.intro.Feature,
          sizeInfo: product.intro.Size,
          material: product.intro.Material,
          weight: product.intro.Weight,
          blank: product.intro.Blank,
          logoCustomization: product.intro['Logo customization'],
          clothingCustomization: product.intro['Clothing Customize'],
        },
        sortOrder,
      _status: 'published',
      publishedAt: new Date().toISOString(),
      },
    })
    imported += 1
  }

  const verified = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0,
    draft: false,
    overrideAccess: true,
    where: publicProductWhere(),
  })
  assert.equal(verified.docs.length, PRODUCTS.length, 'Published catalog count does not match the bundled catalog.')
  console.log(JSON.stringify({ projectRef, sourceCount: PRODUCTS.length, imported, alreadyPresent, publishedCount: verified.docs.length }))
} finally {
  await payload.destroy()
}
