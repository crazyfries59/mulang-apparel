---
name: techpack-translate
description: Translates English-language apparel/garment tech-pack PDFs (design and production spec sheets exported from Canva/Figma/Illustrator — sketches, construction diagrams, colorways, size charts, label artwork, instructional notes) into Chinese for a factory/production team, producing a new PDF that keeps the original layout, diagrams, tables, and brand/label artwork pixel-for-pixel untouched. Use this whenever the user hands over a tech pack, spec sheet, "技术包", or garment production PDF and asks for a Chinese version, a translation, or something the factory can read — even if they don't name this skill or use the word "translate" explicitly (e.g. "帮我把这个文件翻译一下" while attaching a tech pack PDF). Reuses a shared glossary.json across every document so terminology stays consistent job after job, and produces a bilingual review list after each run.
---

# Tech pack EN→ZH translation

## Why this needs a real pipeline, not a text extraction

These PDFs are vector/design-tool exports (Canva, Figma, Illustrator), not plain text documents — there is no "extract text, translate, reinsert" shortcut, and `pdftoppm`/poppler is often not installed on this Windows machine so don't rely on it. The approach that works: render each page to a raster image with `pdfjs-dist` + `node-canvas`, read the text layer's exact position/size for every line, white out only the lines being translated, and draw the Chinese replacement in the same spot at a matching color/size — then re-embed the page images into a fresh PDF with `pdf-lib`. Everything not text-replaced (sketches, stitching diagrams, tables, colorway swatches, photos) is just pixels from the original render, so it's guaranteed to look identical.

All scripts live in `scripts/` and already have their own `node_modules` installed (canvas, pdfjs-dist, pdf-lib) — run them with plain `node`, no need to touch the user's actual project's package.json/node_modules.

## Workflow

1. **Inspect first.** Run:
   ```
   node scripts/dump_runs.js "<input.pdf>" "<workdir>" 1.5
   ```
   This writes `<workdir>/page-N.png` for every page (so you can actually look at the layout) and `<workdir>/runs.json` (every line of text on every page, already merged into full phrases with its position). Read a few page PNGs and skim runs.json before writing any translations — tech packs vary a lot in structure.

2. **Decide what to translate vs. leave verbatim.** Only translate the instructional/descriptive layer meant for a human reader (notes, callouts, table row labels, section headers, captions). Leave these untouched:
   - Brand/logo wordmarks and any stylized letter-spaced logo mockup (e.g. embroidery placement previews spelling out the brand name letter by letter).
   - Text that is physically printed, embroidered, or woven onto the actual garment/label — tagline artwork, the label's own printed content (e.g. "Designed in Australia", "Made in China", size letters on the label graphic). Translating these would misrepresent what actually gets manufactured.
   - All numbers, measurements, style/order/article codes, Pantone codes, size codes (XS/S/M/L/XL).
   - Any text baked into an embedded raster image (reference photos, a care-symbol icon graphic, a flattened infographic/spec sheet) — there's no text layer to replace, so this simply can't be done this way. **Say so explicitly to the user** rather than silently skipping a whole page's worth of content — it's easy for a page that's "mostly one big image" to look like it should be translatable when it isn't.

   When genuinely unsure whether something should be translated (as opposed to just being unfamiliar apparel jargon you can look up/infer), ask the user rather than guessing — but don't ask about routine wording.

3. **Reuse `glossary.json` first.** It's a shared `{"English line": "中文翻译"}` map at the skill root that accumulates confirmed terminology across every tech pack this user sends over time (things like "Additional notes:", "Ribbed collar", "NOTE: CYAN NOT TO BE PRINTED", size-chart row labels). Before translating a line yourself, check whether it (or a near-identical variant, watching for spelling variants like "EMBROIDARY" vs "EMBROIDERY") is already in there and reuse that exact translation for consistency. Add any new generically-reusable short phrase you translate to `glossary.json` so the next document benefits too.

4. **Write a per-document overrides file** (e.g. `<workdir>/translations.json`) for anything specific to this document — long sentences, brand-specific phrasing, style-specific numbers embedded in text. This layers on top of `glossary.json` (same-key entries here win), so you never have to touch the shared glossary for one-off wording.

5. **Build the translated PDF:**
   ```
   node scripts/build_pdf.js "<input.pdf>" "<output.pdf>" glossary.json "<workdir>/translations.json"
   ```
   Save the output next to the source file, named `<原文件名>_中文版.pdf`, unless the user says otherwise. The script also writes `<output>_untranslated.json` listing every text line it left alone — skim it for anything that should have matched but didn't (usually a typo/whitespace mismatch between your translations file and the actual PDF text).

6. **Give the user a bilingual review list.** After building, show a short markdown table (original → 中文) of what you translated on this run, grouped by page, so they can quickly flag corrections without having to compare PDFs line by line. Keep it short — link to the page images from step 1 if they want to see it in context.

7. **Applying corrections is cheap.** If the user flags a line, just fix the entry in `glossary.json` or the per-document overrides file and re-run step 5 — no need to redo the extraction step.

## The one rendering pitfall worth knowing about

`build_pdf.js` reserves `ASCENT_FACTOR * lineHeight` above each line's baseline and `DESCENT_FACTOR * lineHeight` below it for the erase/redraw box (see the constants near the top of the file). These must stay comfortably smaller than the document's actual line-to-line spacing. If they don't, a lower line's erase rectangle silently clips the bottom of the line above it, which can turn one CJK character into a completely different-looking one (this happened once: "包含" rendered as "句全" — looked exactly like a font bug but was actually this geometry issue). If you ever see a wrong-looking character in an output, check this first before suspecting the font.

## Working style for this user

Batch tech-pack translation is a recurring job for this user (apparel export/trading business), not a one-off. Work in visible small steps and narrate briefly as you go rather than disappearing for a long silent stretch — check in after inspection, after the first draft build, etc. Good-enough and fast beats a perfect result that takes much longer; fix a flagged issue when they point at it, but don't gold-plate edge cases unprompted.
