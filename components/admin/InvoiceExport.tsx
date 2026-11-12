"use client";

import { useDocumentInfo, useForm, useFormModified } from "@payloadcms/ui";
import React, { useState } from "react";

/* 发票详情页顶部的导出按钮：直接下 xlsx，版式与本机工具一致。
   导出读的是数据库里已保存的版本，所以有未保存改动时先提交一次再下载，
   免得「改了没保存就导出」拿到上一版。只在已保存的单据上出现（新建没 id 导出来是空的）。
   用 button 而不是 a：Next 的路由会拦截 <a> 的点击，onClick 根本不触发。 */
export const InvoiceExport: React.FC = () => {
  const { id } = useDocumentInfo();
  const { submit } = useForm();
  const modified = useFormModified();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  if (!id) return null;

  const download = () => {
    const link = document.createElement("a");
    link.href = `/api/invoices/${id}/xlsx`;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const onClick = async () => {
    if (busy) return;

    if (!modified) {
      setNote(null);
      download();
      return;
    }

    setBusy(true);
    setNote("有未保存的改动，正在先保存…");
    try {
      const result = await submit();
      const failed = Boolean(result && "res" in result && result.res && !result.res.ok);
      if (failed) {
        setNote("保存没成功，导出已取消：先解决表单里的红字");
        return;
      }
      setNote("已保存，正在下载最新版…");
      download();
      window.setTimeout(() => setNote(null), 4000);
    } catch {
      setNote("保存出错，导出已取消，请重试");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginInlineEnd: 8 }}>
      <button
        type="button"
        className="btn btn--style-secondary btn--size-small"
        onClick={onClick}
        disabled={busy}
        style={{ opacity: busy ? 0.6 : 1 }}
        title="下载这张发票的 xlsx；有改动会先保存再下载"
      >
        {busy ? "保存并导出中…" : "导出 xlsx"}
      </button>
      {note ? (
        <span style={{ color: "var(--theme-elevation-600)", fontSize: 12 }}>{note}</span>
      ) : modified ? (
        <span style={{ color: "var(--theme-elevation-500)", fontSize: 12 }}>有未保存改动，导出会先保存</span>
      ) : null}
    </span>
  );
};
