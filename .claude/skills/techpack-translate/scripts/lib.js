// Shared helpers for the techpack-translate skill scripts.

// Merges raw pdfjs text-content items into full visual lines/phrases.
// pdfjs sometimes splits a single word across items (ligatures like "fi" in
// "fit", or arbitrary font-change boundaries) -- items that sit on the same
// baseline with little/no horizontal gap between them are really one run.
const Y_TOL = 0.5;
const GAP_MAX = 3.0;
const GAP_MIN = -3.0;

function mergeRuns(items) {
  const filtered = items.filter(it => it.str !== '');
  const runs = [];
  let cur = null;
  for (const it of filtered) {
    const [, , , , e, f] = it.transform;
    const rec = { str: it.str, x: e, y: f, width: it.width, height: it.height };
    if (cur) {
      const gap = rec.x - (cur.x + cur.width);
      const sameY = Math.abs(rec.y - cur.y) < Y_TOL;
      if (sameY && gap < GAP_MAX && gap > GAP_MIN) {
        cur.str += rec.str;
        cur.width = (rec.x + rec.width) - cur.x;
        cur.height = Math.max(cur.height, rec.height);
        continue;
      }
    }
    if (cur) runs.push(cur);
    cur = rec;
  }
  if (cur) runs.push(cur);
  return runs;
}

// Finds the darkest (most likely "ink") pixel color in a region of a canvas,
// so replacement text can match the original's color (body text is usually
// black, but tech packs often color-code callouts, e.g. cyan annotation text).
function sampleColor(ctx, cx0, cy0, cx1, cy1) {
  const x0 = Math.max(0, Math.floor(cx0));
  const y0 = Math.max(0, Math.floor(cy0));
  const w = Math.max(1, Math.ceil(cx1 - cx0));
  const h = Math.max(1, Math.ceil(cy1 - cy0));
  let data;
  try {
    data = ctx.getImageData(x0, y0, w, h).data;
  } catch (e) {
    return '#000000';
  }
  let best = null, bestLum = 999;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 100) continue;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < bestLum) { bestLum = lum; best = [r, g, b]; }
  }
  if (!best || bestLum > 230) return '#000000';
  return `rgb(${best[0]},${best[1]},${best[2]})`;
}

module.exports = { mergeRuns, sampleColor };
