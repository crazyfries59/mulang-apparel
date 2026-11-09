"use client";

import { useFormFields } from "@payloadcms/ui";
import React, { useState } from "react";

/* 商品行里的图片预览：跟着同一行的「图片路径 / URL」走。
   只是看，不改数据——要换图改上面那个文本框，或者在上面选款自动带出主图。 */

const fullSrc = (src: string): string => {
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) return src;
  return src.startsWith("/") ? src : `/${src}`;
};

const boxStyle: React.CSSProperties = {
  width: 92,
  height: 92,
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: 4,
  background: "var(--theme-elevation-50)",
  overflow: "hidden",
};

const hintStyle: React.CSSProperties = {
  color: "var(--theme-elevation-600)",
  fontSize: 12,
  lineHeight: 1.5,
};

export const ImageThumb: React.FC<{ path?: string }> = ({ path }) => {
  const base = path ? path.replace(/\.imageThumb$/, "") : "";
  const value = useFormFields(([fields]) => {
    const raw = fields?.[`${base}.image`]?.value;
    return typeof raw === "string" ? raw.trim() : "";
  });
  const [broken, setBroken] = useState("");

  if (!base) return null;

  const failed = Boolean(value) && broken === value;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0 12px" }}>
      <div style={boxStyle}>
        {value && !failed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={fullSrc(value)}
            alt="产品图预览"
            onError={() => setBroken(value)}
            onLoad={() => setBroken("")}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        ) : (
          <span style={{ ...hintStyle, padding: 6, textAlign: "center" }}>
            {failed ? "图片打不开" : "暂无图片"}
          </span>
        )}
      </div>

      <div style={{ minWidth: 0 }}>
        {value ? (
          <>
            <div style={{ fontSize: 12, wordBreak: "break-all", color: "var(--theme-text)" }}>{value}</div>
            <div style={hintStyle}>
              {failed ? "路径不对或图片已删除，换一个 URL 试试。" : "导出 xlsx 时会把这张图放进 Picture 列。"}
              {" "}
              <a href={fullSrc(value)} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                打开原图
              </a>
            </div>
          </>
        ) : (
          <div style={hintStyle}>
            这一行还没有图片。在上面的「快速填写」里选款会自动带出产品库主图，也可以直接粘一个图片 URL。
          </div>
        )}
      </div>
    </div>
  );
};
