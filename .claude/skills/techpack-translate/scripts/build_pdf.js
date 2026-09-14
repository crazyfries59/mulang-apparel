// Produces a Chinese-overlaid copy of an English tech-pack PDF.
//
// For every line of text that has a matching entry in the glossary and/or
// per-document translations file, this erases the original English text in
// place and draws the Chinese translation in its spot (same position, same
// approximate color, auto-shrunk to fit) -- everything else (diagrams,
// tables, numbers, brand/label artwork, images) is left completely alone.
//
// Usage: node build_pdf.js <input.pdf> <output.pdf> <glossary.json> [translations.json]
//   glossary.json:      shared term library, reused across all documents
//   translations.json:  per-document overrides/additions (optional), takes
//                        priority over glossary.json when the same key exists

const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { PDFDocument } = require('pdf-lib');
const { mergeRuns, sampleColor } = require('./lib.js');

// Same bundled Noto Sans SC the web tool uses (assets/fonts at the repo root,
// SIL Open Font License -- see assets/fonts/OFL.txt) so this works on any
// machine without depending on a specific OS having a CJK font installed.
const BUNDLED_FONT = path.join(__dirname, '..', '..', '..', '..', 'assets', 'fonts', 'NotoSansSC-Variable.ttf');
const FONT_PATH = process.env.TECHPACK_FONT || (fs.existsSync(BUNDLED_FONT) ? BUNDLED_FONT : 'C:\\Windows\\Fonts\\msyh.ttc');
const FONT_FAMILY = 'TechPackZH';
registerFont(FONT_PATH, { family: FONT_FAMILY });

const SCALE = 2; // render resolution multiplier; 2x keeps text crisp without huge files

// --- text-line geometry constants -------------------------------------------------
// A line's erase/redraw box reserves `ASCENT_FACTOR * lineHeight` above the
// baseline and `DESCENT_FACTOR * lineHeight` below it. These MUST add up to
// less than the real line-to-line spacing in the document, or one line's
// erase rectangle clips the bottom of the line above it -- which silently
// turns some CJK glyphs into a different-looking (but wrong) character
// (e.g. "包含" -> "句全"). If you ever see a garbled/wrong-looking character
// in the output, this is the first thing to check -- shrink these further.
const ASCENT_FACTOR = 0.85;
const DESCENT_FACTOR = 0.22;

async function main() {
  const [, , SRC, OUT, glossaryPath, overridesPath] = process.argv;
  if (!SRC || !OUT || !glossaryPath) {
    console.error('Usage: node build_pdf.js <input.pdf> <output.pdf> <glossary.json> [translations.json]');
    process.exit(1);
  }
  const glossary = JSON.parse(fs.readFileSync(glossaryPath, 'utf8'));
  const overrides = overridesPath && fs.existsSync(overridesPath)
    ? JSON.parse(fs.readFileSync(overridesPath, 'utf8'))
    : {};
  const translations = { ...glossary, ...overrides };

  const measureCanvas = createCanvas(10, 10);
  const measureCtx = measureCanvas.getContext('2d');
  const TEXT_CANVAS_W = 2400;
  const TEXT_CANVAS_H = 160;
  const textCanvas = createCanvas(TEXT_CANVAS_W, TEXT_CANVAS_H);
  const textCtx = textCanvas.getContext('2d');

  const data = new Uint8Array(fs.readFileSync(SRC));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const pageBuffers = [];
  const pageSizes = [];
  const unmatchedByPage = [];

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
      if (!zh) { unmatched.push(key); continue; }
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
        measureCtx.font = `${fontSizePx}px ${FONT_FAMILY}`;
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
      textCtx.font = `${fontSizePx}px ${FONT_FAMILY}`;
      textCtx.textBaseline = 'alphabetic';
      textCtx.fillStyle = color;
      textCtx.fillText(zh, canvasLeft - eraseLeft, canvasBottom - eraseTop);
      ctx.drawImage(textCanvas, 0, 0, tempW, tempH, eraseLeft, eraseTop, tempW, tempH);
    }
    console.log(`page ${i}: translated ${translatedCount}/${runs.length} text lines (${unmatched.length} left as-is)`);
    unmatchedByPage.push({ page: i, unmatched });

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
  fs.writeFileSync(OUT, outBytes);
  console.log('wrote', OUT);

  const reportPath = OUT.replace(/\.pdf$/i, '') + '_untranslated.json';
  fs.writeFileSync(reportPath, JSON.stringify(unmatchedByPage, null, 1));
  console.log('wrote', reportPath, '(lines with no glossary match -- left untouched; review if any should have been translated)');
}

main().catch(e => { console.error(e); process.exit(1); });
