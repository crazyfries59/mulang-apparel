"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, Download, Loader2, AlertTriangle } from "lucide-react";

type Status = "idle" | "uploading" | "done" | "error";

export default function TechpackTranslatePage() {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [downloadName, setDownloadName] = useState<string>("");
  const [stats, setStats] = useState<{ translated: number; total: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStatus("idle");
    setError("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl("");
    setStats(null);
  };

  const onFile = async (file: File) => {
    reset();
    setFileName(file.name);
    setStatus("uploading");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/techpack-translate", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `处理失败(${res.status})`);
      }
      const translated = Number(res.headers.get("X-Techpack-Translated") || 0);
      const total = Number(res.headers.get("X-Techpack-Total") || 0);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename\*=UTF-8''([^;]+)/);
      const name = match ? decodeURIComponent(match[1]) : file.name.replace(/\.pdf$/i, "") + "_中文版.pdf";

      setDownloadUrl(url);
      setDownloadName(name);
      setStats({ translated, total });
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "处理失败");
      setStatus("error");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <section className="pt-36 pb-24 px-6 min-h-screen">
      <div className="container max-w-2xl">
        <p className="label mb-4">Internal Tool</p>
        <h1 className="heading-xl mb-4">
          技术包<span className="gradient-text">中文翻译</span>
        </h1>
        <p className="text-white/40 text-sm leading-relaxed mb-10">
          上传英文技术包 PDF,自动翻译已确认的术语并生成中文版,排版、线稿、图片保持不变。
          仅自动套用术语库中已收录的词汇——新出现的、术语库里没有的表达会保留英文原文,不会被翻译。
        </p>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="glass-card p-10 flex flex-col items-center justify-center gap-3 cursor-pointer border-dashed"
          style={{ borderStyle: "dashed" }}
        >
          <UploadCloud className="w-8 h-8 text-white/30" />
          <p className="text-sm text-white/60">点击选择,或将 PDF 文件拖到此处</p>
          <p className="text-xs text-white/30">仅支持 .pdf</p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
            }}
          />
        </div>

        {fileName && (
          <div className="mt-6 glass-card p-5 flex items-center gap-4">
            <FileText className="w-5 h-5 text-white/40 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 truncate">{fileName}</p>

              {status === "uploading" && (
                <p className="text-xs text-white/40 flex items-center gap-2 mt-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> 正在翻译,请稍候……
                </p>
              )}

              {status === "error" && (
                <p className="text-xs text-red-400 flex items-center gap-2 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {error}
                </p>
              )}

              {status === "done" && stats && (
                <p className="text-xs text-white/40 mt-1">
                  已翻译 {stats.translated} / {stats.total} 行文字
                  {stats.total - stats.translated > 0 && (
                    <> ,其余 {stats.total - stats.translated} 行术语库未收录,保留英文原文</>
                  )}
                </p>
              )}
            </div>

            {status === "done" && downloadUrl && (
              <a
                href={downloadUrl}
                download={downloadName}
                className="btn-gradient shrink-0 !py-2 !px-4 text-xs"
              >
                <Download className="w-4 h-4" /> 下载中文版
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
