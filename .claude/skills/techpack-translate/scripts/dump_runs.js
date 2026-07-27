// Renders every page of a tech-pack PDF to a PNG (for visual inspection) and
// dumps the merged per-line text runs to JSON (for drafting translations).
//
// Usage: node dump_runs.js <input.pdf> <outDir> [scale]
//   Writes <outDir>/page-N.png for every page and <outDir>/runs.json.

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { mergeRuns } = require('./lib.js');

async function main() {
  const [, , pdfPath, outDir, scaleArg] = process.argv;
  if (!pdfPath || !outDir) {
    console.error('Usage: node dump_runs.js <input.pdf> <outDir> [scale]');
    process.exit(1);
  }
  const scale = scaleArg ? parseFloat(scaleArg) : 1.5;
  fs.mkdirSync(outDir, { recursive: true });

  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const allPages = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    fs.writeFileSync(path.join(outDir, `page-${i}.png`), canvas.toBuffer('image/png'));

    const baseViewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const runs = mergeRuns(content.items);
    allPages.push({
      page: i,
      width: baseViewport.width,
      height: baseViewport.height,
      runs: runs.map(r => ({ str: r.str.trim(), x: r.x, y: r.y, width: r.width, height: r.height })),
    });
    console.log(`page ${i}: ${runs.length} text runs, rendered page-${i}.png`);
  }

  fs.writeFileSync(path.join(outDir, 'runs.json'), JSON.stringify(allPages, null, 1));
  console.log('wrote', path.join(outDir, 'runs.json'));
  console.log('\nNext: read the runs.json strings + look at the page PNGs, decide what to translate,');
  console.log('then write a translations.json ({"original string": "中文翻译"}) and run build_pdf.js.');
}

main().catch(e => { console.error(e); process.exit(1); });
