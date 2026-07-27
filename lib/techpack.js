// Core EN->ZH tech-pack PDF translation pipeline, shared by:
//   - the Claude Code skill at .claude/skills/techpack-translate (interactive, judgment-assisted)
//   - the /tools/techpack-translate web page + API route (self-serve, glossary-only)
//
// Given the design-tool origin of these PDFs (Canva/Figma/Illustrator exports),
// there is no "extract text, translate, reinsert" shortcut -- this renders each
// page to a raster image, reads the exact position of every line of text, and
// for every line that has a glossary match, erases just that line and draws
// the Chinese translation in its place (same spot, matching color/size).
// Everything else (diagrams, tables, photos, brand/label artwork) is left as
// pixels from the original render, so it's guaranteed to look identical.

const fs = require('fs');
const { createCanvas, registerFont } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { PDFDocument } = require('pdf-lib');

// No CJK font ships in this repo (Windows system fonts are proprietary and
// can't be redistributed; a properly-licensed font like Noto Sans SC would
// need to be added separately -- see app/tools/techpack-translate/page.tsx
// for the user-facing note). Instead this looks for one already installed on
// whatever machine actually runs the code, in priority order. Set
// TECHPACK_FONT to override if none of these match your deployment target.
const DEFAULT_FONT_CANDIDATES = [
  'C:\\Windows\\Fonts\\msyh.ttc',
  'C:\\Windows\\Fonts\\simhei.ttf',
  '/usr/share/fonts/opentype/noto/NotoSansCJKsc-Regular.otf',
  '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc',
  '/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc',
  '/System/Library/Fonts/PingFang.ttc',
];

function resolveFontPath(explicit) {
  const candidates = [explicit, process.env.TECHPACK_FONT, ...DEFAULT_FONT_CANDIDATES].filter(Boolean);
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (e) {
      // ignore and try next candidate
    }
  }
  throw new Error(
    'No Chinese font found on this machine. Set the TECHPACK_FONT env var to a properly-licensed ' +
    '.ttf/.otf CJK font path (e.g. a self-hosted Noto Sans SC), since none of the default candidates exist here.'
  );
}

const SCALE = 2; // render resolution multiplier; keeps text crisp without huge output files

// A line's erase/redraw box reserves ASCENT_FACTOR * lineHeight above the
// baseline and DESCENT_FACTOR * lineHeight below it. These MUST add up to
// less than the real line-to-line spacing, or one line's erase rectangle
// clips the bottom of the line above it -- which can silently turn a CJK
// character into a different-looking (but wrong) one, e.g. "包含" -> "句全".
// If a translated character ever looks subtly wrong, check these constants
// before suspecting the font.
const ASCENT_FACTOR = 0.85;
const DESCENT_FACTOR = 0.22;

let fontRegistered = false;
function ensureFont(fontPath, fontFamily) {
  if (fontRegistered) return;
  registerFont(fontPath, { family: fontFamily });
  fontRegistered = true;
}

// Merges raw pdfjs text-content items into full visual lines/phrases. pdfjs
// sometimes splits a single word across items (ligatures like "fi" in "fit",
// or arbitrary font-change boundaries) -- items on the same baseline with
// little/no horizontal gap between them are really one run.
const Y_TOL = 0.5;
const GAP_MAX = 3.0;
const GAP_MIN = -3.0;

function mergeRuns(items) {
  const filtered = items.filter((it) => it.str !== '');
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
        cur.width = rec.x + rec.width - cur.x;
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

// Finds the darkest ("ink") pixel color in a region of the canvas, so
// replacement text matches the original's color (tech packs often color-code
// callouts, e.g. cyan annotation text, not just plain black body text).
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
  let best = null;
  let bestLum = 999;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 100) continue;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < bestLum) {
      bestLum = lum;
      best = [r, g, b];
    }
  }
  if (!best || bestLum > 230) return '#000000';
  return `rgb(${best[0]},${best[1]},${best[2]})`;
}

/**
 * Translates the lines of `pdfBytes` that match a key in `translations`
 * (an exact-match { "English line": "中文翻译" } map), leaving everything
 * else in the document untouched.
 *
 * @param {Uint8Array|Buffer} pdfBytes
 * @param {Record<string,string>} translations
 * @param {{ fontPath?: string, fontFamily?: string }} [opts]
 * @returns {Promise<{ pdfBytes: Uint8Array, report: Array<{page:number, translated:number, total:number, unmatched:string[]}> }>}
 */
async function translatePdf(pdfBytes, translations, opts = {}) {
  const fontPath = resolveFontPath(opts.fontPath);
  const fontFamily = opts.fontFamily || 'TechPackZH';
  ensureFont(fontPath, fontFamily);

  const measureCanvas = createCanvas(10, 10);
  const measureCtx = measureCanvas.getContext('2d');
  const TEXT_CANVAS_W = 2400;
  const TEXT_CANVAS_H = 160;
  const textCanvas = createCanvas(TEXT_CANVAS_W, TEXT_CANVAS_H);
  const textCtx = textCanvas.getContext('2d');

  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) }).promise;
  const pageBuffers = [];
  const pageSizes = [];
  const report = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const baseViewport = page.getViewport({ scale: 1 });
    const pageWidthPt = baseViewport.width;
    const pageHeightPt = baseViewport.height;
    pageSizes.push([pageWidthPt, pageHeightPt]);

    const viewport = page.getViewport({ scale: SCALE });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;

    const content = await page.getTextContent();
    const runs = mergeRuns(content.items);

    const toCanvasX = (xPt) => xPt * SCALE;
    const toCanvasY = (yPt) => (pageHeightPt - yPt) * SCALE;

    let translatedCount = 0;
    const unmatched = [];
    for (const run of runs) {
      const key = run.str.trim();
      if (!key) continue;
      const zh = translations[key];
      if (!zh) {
        unmatched.push(key);
        continue;
      }
      translatedCount++;

      const left = run.x;
      const right = run.x + run.width;
      const bottom = run.y;
      const top = run.y + run.height * ASCENT_FACTOR;

      const canvasLeft = toCanvasX(left);
      const canvasRight = toCanvasX(right);
      const canvasTop = toCanvasY(top);
      const canvasBottom = toCanvasY(bottom);
      const boxH = canvasBottom - canvasTop;

      const color = sampleColor(ctx, canvasLeft, canvasTop, Math.max(canvasRight, canvasLeft + 4), canvasBottom);

      let fontSizePx = Math.max(6, run.height * SCALE * 0.95);
      const maxAllowedWidth = Math.min(viewport.width - canvasLeft - 10, Math.max((canvasRight - canvasLeft) * 2.6, 90));
      let textWidth = 0;
      const floorSize = run.height * SCALE * 0.45;
      while (fontSizePx > floorSize) {
        measureCtx.font = `${fontSizePx}px ${fontFamily}`;
        textWidth = measureCtx.measureText(zh).width;
        if (textWidth <= maxAllowedWidth) break;
        fontSizePx -= 0.5;
      }

      const descenderPad = run.height * SCALE * DESCENT_FACTOR;
      const eraseLeft = canvasLeft - 2;
      const eraseWidth = Math.max(canvasRight - canvasLeft, textWidth) + 6;
      const eraseTop = canvasTop - 2;
      const eraseHeight = boxH + 4 + descenderPad;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(eraseLeft, eraseTop, eraseWidth, eraseHeight);

      const tempW = Math.min(TEXT_CANVAS_W, Math.max(1, Math.ceil(eraseWidth)));
      const tempH = Math.min(TEXT_CANVAS_H, Math.max(1, Math.ceil(eraseHeight)));
      textCtx.clearRect(0, 0, TEXT_CANVAS_W, TEXT_CANVAS_H);
      textCtx.font = `${fontSizePx}px ${fontFamily}`;
      textCtx.textBaseline = 'alphabetic';
      textCtx.fillStyle = color;
      textCtx.fillText(zh, canvasLeft - eraseLeft, canvasBottom - eraseTop);
      ctx.drawImage(textCanvas, 0, 0, tempW, tempH, eraseLeft, eraseTop, tempW, tempH);
    }

    report.push({ page: i, translated: translatedCount, total: runs.length, unmatched });
    pageBuffers.push(canvas.toBuffer('image/png'));
  }

  const outDoc = await PDFDocument.create();
  for (let i = 0; i < pageBuffers.length; i++) {
    const [w, h] = pageSizes[i];
    const png = await outDoc.embedPng(pageBuffers[i]);
    const p = outDoc.addPage([w, h]);
    p.drawImage(png, { x: 0, y: 0, width: w, height: h });
  }
  const outBytes = await outDoc.save();

  return { pdfBytes: outBytes, report };
}

module.exports = { translatePdf, mergeRuns, sampleColor };
