"use client";

import { useFormFields } from "@payloadcms/ui";
import React from "react";

/* 客户卡上的 WhatsApp 直达按钮。
   点击走 /api/wa-sso：服务端用当前登录身份签一张短期票，再跳到分流系统，
   业务员不需要在那儿再登录一次，落地就是这个客户的对话。
   号码没填时给出提示，而不是给一个点不动的死按钮。 */

const wrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  margin: "4px 0 12px",
};

const btnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 14px",
  borderRadius: "4px",
  background: "var(--theme-elevation-800)",
  color: "var(--theme-elevation-0)",
  fontSize: "13px",
  fontWeight: 500,
  textDecoration: "none",
  border: "1px solid var(--theme-elevation-800)",
};

const hintStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "var(--theme-elevation-500)",
};

export function WhatsAppLink() {
  const fields = useFormFields(([all]) => all);
  const raw = fields?.whatsapp?.value;
  const digits = String(typeof raw === "string" ? raw : "").replace(/\D/g, "");

  if (digits.length < 7) {
    return (
      <div style={hintStyle}>
        上面的 WhatsApp 填了号码之后，这里会出现直达对话的按钮。
      </div>
    );
  }

  const url = `/api/wa-sso?phone=${encodeURIComponent(digits)}`;

  return (
    <div style={wrapStyle}>
      <a href={url} target="_blank" rel="noreferrer" style={btnStyle}>
        在 WhatsApp 里打开这个客户
      </a>
      <span style={hintStyle}>自动进入 +{digits} 的会话，不需要再登录</span>
    </div>
  );
}

export default WhatsAppLink;
