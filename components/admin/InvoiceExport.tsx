"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import React from "react";

/* 发票详情页顶部的导出按钮：直接下 xlsx，版式与本机工具一致。
   只在已保存的单据上出现（新建未保存时没有 id，导出来是空的）。 */
export const InvoiceExport: React.FC = () => {
  const { id } = useDocumentInfo();
  if (!id) return null;

  return (
    <a
      className="btn btn--style-secondary btn--size-small"
      href={`/api/invoices/${id}/xlsx`}
      style={{ marginInlineEnd: "8px", textDecoration: "none" }}
      title="下载这张发票的 xlsx"
    >
      导出 xlsx
    </a>
  );
};
