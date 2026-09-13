# Product images

This folder holds every product photo, mirrored locally from the original
scraped source (`hongyuapparel.com`) so the live site no longer depends on a
third-party server for its own product images.

**These image files are gitignored — not committed to the repo** (thousands of
files, several GB). To (re)populate them on a fresh checkout or server, run:

```bash
node scripts/migrate-product-images.mjs
```

It reads `app/products/hongyu-products.json`, downloads every referenced image,
and writes it to `public/products/<category>/<slug>/img-N.jpg` /
`detail-N.jpg` — matching exactly what `app/products/data.ts` expects. It's
idempotent (skips files that already exist), so it's safe to re-run if it gets
interrupted partway through.

If you add new products manually (not via the scraped JSON), just drop the
photo directly at the path `app/products/data.ts` expects for that
product/index, following the same `img-N.jpg` / `detail-N.jpg` naming.
