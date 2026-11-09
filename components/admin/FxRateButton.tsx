"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import React, { useState } from "react";

/* 「换算币种」里的联网取汇率按钮。
   点一下按选中的币种取欧洲央行中间价，填进汇率 / 汇率时间 / 来源；填完还能手改。
   取不到就提示手填，不拦保存。 */

const buttonStyle: React.CSSProperties = {
  height: 32,
  padding: "0 12px",
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 4,
  background: "var(--theme-elevation-50)",
  color: "var(--theme-text)",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const stamp = (): string => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

export const FxRateButton: React.FC<{ path?: string }> = ({ path }) => {
  const { dispatchFields } = useForm();
  const base = path ? path.replace(/\.fxRate$/, "") : "";

  const currency = useFormFields(([fields]) => {
    const raw = fields?.[`${base}.currency`]?.value;
    return typeof raw === "string" ? raw : "";
  });

  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  if (!base) return null;

  const fetchRate = async () => {
    if (!currency || currency === "USD") {
      setStatus("先在上面选一个币种");
      return;
    }
    setBusy(true);
    setStatus("正在取汇率…");
    try {
      const res = await fetch(`/api/fx/rate?currency=${encodeURIComponent(currency)}`, { credentials: "include" });
      const data = (await res.json()) as { quote?: number; source?: string; error?: string };
      if (!res.ok || typeof data.quote !== "number") {
        setStatus(data.error || "取不到汇率，手填吧");
        return;
      }
      dispatchFields({ type: "UPDATE", path: `${base}.quote`, value: data.quote });
      dispatchFields({ type: "UPDATE", path: `${base}.readAt`, value: stamp() });
      dispatchFields({ type: "UPDATE", path: `${base}.source`, value: data.source ?? "联网" });
      setStatus(`已填入 1 ${currency} = ${data.quote} USD（中间价，可手改）`);
    } catch {
      setStatus("网络不通，手填吧");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
      <button type="button" data-testid="fx-rate" style={buttonStyle} onClick={fetchRate} disabled={busy}>
        {busy ? "取汇率…" : "联网取汇率"}
      </button>
      <span style={{ color: "var(--theme-elevation-600)", fontSize: 12 }}>
        {status || "取欧洲央行中间价填进去；连连的结汇价通常略低，可以按连连手改。"}
      </span>
    </div>
  );
};
