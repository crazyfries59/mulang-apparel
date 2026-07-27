import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { translatePdf } from "@/lib/techpack.js";

// `canvas` needs its native binary at runtime, and pdfjs-dist's legacy build
// does its own dynamic requires -- both must run under real Node.js, not the
// Edge runtime, and must not be bundled/tree-shaken by the server compiler.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GLOSSARY_PATH = path.join(
  process.cwd(),
  ".claude/skills/techpack-translate/glossary.json"
);

export async function POST(request: NextRequest) {
  let glossary: Record<string, string>;
  try {
    glossary = JSON.parse(fs.readFileSync(GLOSSARY_PATH, "utf8"));
  } catch (e) {
    return NextResponse.json(
      { error: "术语库文件缺失或读取失败,请联系管理员。" },
      { status: 500 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "请上传一个 PDF 文件。" }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "只支持 PDF 文件。" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    const { pdfBytes, report } = await translatePdf(bytes, glossary);
    const totalTranslated = report.reduce((s, p) => s + p.translated, 0);
    const totalLines = report.reduce((s, p) => s + p.total, 0);
    const outName = file.name.replace(/\.pdf$/i, "") + "_中文版.pdf";

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(outName)}`,
        "X-Techpack-Translated": String(totalTranslated),
        "X-Techpack-Total": String(totalLines),
      },
    });
  } catch (err) {
    console.error("techpack-translate failed:", err);
    const message = err instanceof Error ? err.message : "翻译失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
