// Downloads every product image from the original hongyuapparel.com source into
// public/products/<category>/<slug>/ so the site no longer depends on a third-party
// server for its own product photos. Resizes/recompresses through sharp on the way
// down — the originals average ~750KB each (2.7GB total across 3894 files), which
// doesn't fit this project's small VPS disk and is bigger than any of these product
// photos need to be for the site's own layout anyway. Idempotent — safe to re-run;
// skips files that already exist, so a killed/interrupted run can just be restarted.
//
// Usage:  node scripts/migrate-product-images.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const UPLOAD = "https://www.hongyuapparel.com/wp-content/uploads/";
const OUT_DIR = path.join(ROOT, "public", "products");
const CONCURRENCY = 6;
const MAX_WIDTH = 1400;
const JPEG_QUALITY = 78;

const raw = JSON.parse(
  fs.readFileSync(path.join(ROOT, "app", "products", "hongyu-products.json"), "utf8")
);

const resolveUrl = (p) => (p.startsWith("http") ? p : UPLOAD + p);

// Always writes .jpg regardless of the source format — these are plain product
// photos (no transparency to preserve), and JPEG is the smallest fit for photos.
async function downloadOne(url, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) return "skip";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const resized = await sharp(buf)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, resized);
  return "ok";
}

// Build a flat queue of {url, destPath} tasks across all products first, so
// concurrency workers can just pull from one shared list.
const tasks = [];
for (const p of raw.products) {
  const dir = path.join(OUT_DIR, p.top, p.slug);
  (p.imgs || []).forEach((rel, i) => {
    tasks.push({ url: resolveUrl(rel), dest: path.join(dir, `img-${i + 1}.jpg`) });
  });
  (p.details || []).forEach((rel, i) => {
    tasks.push({ url: resolveUrl(rel), dest: path.join(dir, `detail-${i + 1}.jpg`) });
  });
}

console.log(`Total files to ensure: ${tasks.length}`);

let done = 0, ok = 0, skipped = 0;
const failed = [];

async function worker(queue) {
  while (queue.length) {
    const task = queue.pop();
    try {
      const result = await downloadOne(task.url, task.dest);
      if (result === "ok") ok++; else skipped++;
    } catch (err) {
      failed.push({ url: task.url, dest: task.dest, error: String(err) });
    }
    done++;
    if (done % 200 === 0 || done === tasks.length) {
      console.log(`  ${done}/${tasks.length}  (ok=${ok} skip=${skipped} fail=${failed.length})`);
    }
  }
}

const queue = [...tasks];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

console.log(`\nDone. downloaded=${ok} skipped(existing)=${skipped} failed=${failed.length}`);
if (failed.length) {
  const reportPath = path.join(ROOT, "migrate-image-failures.json");
  fs.writeFileSync(reportPath, JSON.stringify(failed, null, 2));
  console.log(`Failure details written to ${reportPath} — re-run this script to retry them.`);
}
