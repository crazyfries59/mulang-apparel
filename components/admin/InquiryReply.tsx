"use client";

import { toast, useDocumentInfo, useForm, useFormFields } from "@payloadcms/ui";
import React, { useEffect, useMemo, useState } from "react";
import {
  buildFollowUpSummary,
  buildReplyDraft,
  gmailComposeUrl,
  mailtoUrl,
} from "../../lib/crm/reply-draft";

/* 在询盘详情页里直接回信（轻量版）：
   拼好英文草稿 → 可以改 → 一键在 Gmail 或本机邮件 App 里打开写好收件人和正文的信
   → 发完点「标记已回复」，顺手给客户记一条跟进。
   不在这个页面里收信，所以不需要邮箱授权，也不会因为授权过期而断。 */

type ScriptDoc = { id: string | number; title?: string | null; content?: string | null };

const textOf = (value: unknown) => (typeof value === "string" ? value : "");

const idOf = (value: unknown): string | null => {
  if (typeof value === "number" || typeof value === "string") return String(value);
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    if (typeof id === "number" || typeof id === "string") return String(id);
  }
  return null;
};

const panelStyle: React.CSSProperties = {
  border: "1px solid var(--theme-elevation-100)",
  borderRadius: "4px",
  padding: "16px",
  marginBottom: "24px",
  background: "var(--theme-elevation-50)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "var(--theme-elevation-600)",
  marginBottom: "4px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--theme-text)",
  background: "var(--theme-input-bg)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "4px",
  fontFamily: "inherit",
};

type Draft = { subject: string; body: string };

export const InquiryReply: React.FC = () => {
  const { id } = useDocumentInfo();
  const { dispatchFields } = useForm();
  const fields = useFormFields(([all]) => all);

  const name = textOf(fields?.name?.value);
  const company = textOf(fields?.company?.value);
  const email = textOf(fields?.email?.value).trim();
  const country = textOf(fields?.country?.value);
  const productType = textOf(fields?.productType?.value);
  const quantity = textOf(fields?.quantity?.value);
  const status = textOf(fields?.status?.value);
  const existingReply = textOf(fields?.reply?.value);
  const customerId = idOf(fields?.customer?.value);

  /* 草稿跟着询盘字段走：表单值是异步填进来的，填完草稿自动长出来。
     业务员一动手改，就切到 override，不再被覆盖。 */
  const generated = useMemo(
    () => buildReplyDraft({ name, company, email, country, productType, quantity }),
    [name, company, email, country, productType, quantity],
  );
  const [override, setOverride] = useState<Draft | null>(null);
  const subject = override?.subject ?? generated.subject;
  const body = override?.body ?? generated.body;

  const [scripts, setScripts] = useState<ScriptDoc[]>([]);
  const [feedback, setFeedback] = useState("");
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({
      limit: "100",
      depth: "0",
      sort: "title",
      "where[category][equals]": "inquiry-reply",
    });
    fetch(`/api/sales-scripts?${params.toString()}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { docs?: ScriptDoc[] } | null) => {
        if (!cancelled && json?.docs?.length) setScripts(json.docs);
      })
      .catch(() => {
        /* 话术拉不到不影响写信，只是少一个快捷插入 */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const regenerate = () => {
    setOverride(null);
    setFeedback("");
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      toast.success("主题和正文已复制");
    } catch {
      toast.error("复制失败，请手动选中文字复制");
    }
  };

  const openGmail = () => {
    if (!email) return;
    window.open(gmailComposeUrl(email, subject, body), "_blank", "noopener,noreferrer");
  };

  const openMailApp = () => {
    if (!email) return;
    window.location.href = mailtoUrl(email, subject, body);
  };

  const insertScript = (scriptId: string) => {
    const script = scripts.find((item) => String(item.id) === scriptId);
    if (!script?.content) return;
    const base = body === "" || body.endsWith("\n") ? body : `${body}\n`;
    setOverride({ subject, body: `${base}\n${script.content}` });
  };

  const markReplied = async () => {
    if (!id) return;
    setMarking(true);
    setFeedback("");
    try {
      /* 「回复要点」还空着就把发出去的正文存进去，免得没关联客户时这段内容丢掉；
         已经有备注就不动它。 */
      const keptReply = existingReply.trim() === "";
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keptReply ? { status: "replied", reply: body } : { status: "replied" }),
      });
      if (!res.ok) throw new Error("状态没改成功");

      if (keptReply) dispatchFields({ type: "UPDATE", path: "reply", value: body });
      dispatchFields({ type: "UPDATE", path: "status", value: "replied" });

      let followUp = "";
      if (customerId) {
        const followRes = await fetch("/api/follow-ups", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: customerId,
            summary: buildFollowUpSummary(subject),
            content: body,
            channel: "email",
            date: new Date().toISOString(),
          }),
        });
        followUp = followRes.ok ? "，并已写入跟进记录" : "（跟进记录没写成，请手动补一条）";
      } else {
        followUp = "（这条询盘还没关联客户，所以没写跟进记录）";
      }

      const keptNote = keptReply ? "，正文已存到「回复要点」" : "";
      setFeedback(`已标记为「已回复」${followUp}${keptNote}`);
      toast.success("已标记回复");
    } catch (err) {
      const message = err instanceof Error ? err.message : "未知错误";
      setFeedback(`标记失败：${message}`);
      toast.error("标记失败");
    } finally {
      setMarking(false);
    }
  };

  const noEmail = email === "";
  const alreadyReplied = status === "replied" || status === "converted";
  const actionBtn: React.CSSProperties = { marginRight: "8px", marginBottom: "8px" };

  return (
    <div style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", marginBottom: "12px" }}>
        <strong style={{ fontSize: "14px", fontWeight: 600 }}>回复询盘</strong>
        <span style={{ fontSize: "12px", color: "var(--theme-elevation-500)" }}>
          草稿按询盘内容生成，发之前改一遍
        </span>
      </div>

      {noEmail ? (
        <p style={{ fontSize: "12px", color: "var(--theme-warning-500, #854F0B)", margin: "0 0 12px" }}>
          这条询盘没填邮箱，先把上面的邮箱补上，才能直接唤起写信。
        </p>
      ) : null}

      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle} htmlFor="inquiry-reply-subject">主题</label>
        <input
          id="inquiry-reply-subject"
          style={inputStyle}
          value={subject}
          onChange={(e) => setOverride({ subject: e.target.value, body })}
        />
      </div>

      <div style={{ marginBottom: "8px" }}>
        <label style={labelStyle} htmlFor="inquiry-reply-body">正文</label>
        <textarea
          id="inquiry-reply-body"
          rows={16}
          style={{ ...inputStyle, resize: "vertical" }}
          value={body}
          onChange={(e) => setOverride({ subject, body: e.target.value })}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <button type="button" className="btn btn--style-primary btn--size-small" style={actionBtn} onClick={openGmail} disabled={noEmail}>
          用 Gmail 写信
        </button>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={actionBtn} onClick={openMailApp} disabled={noEmail}>
          用本机邮件 App
        </button>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={actionBtn} onClick={copyAll}>
          复制主题和正文
        </button>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={actionBtn} onClick={regenerate}>
          重新生成草稿
        </button>
        {scripts.length > 0 ? (
          <select
            aria-label="插入话术"
            style={{ ...inputStyle, width: "auto", maxWidth: "220px" }}
            defaultValue=""
            onChange={(e) => {
              insertScript(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">插入话术…</option>
            {scripts.map((script) => (
              <option key={String(script.id)} value={String(script.id)}>
                {script.title ?? "未命名话术"}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <button
          type="button"
          className="btn btn--style-secondary btn--size-small"
          onClick={markReplied}
          disabled={!id || marking || alreadyReplied}
          title={alreadyReplied ? "这条已经是已回复 / 已转客户" : "改状态为已回复，并给客户记一条邮件跟进"}
        >
          {marking ? "处理中…" : alreadyReplied ? "已回复" : "标记已回复"}
        </button>
        <span style={{ fontSize: "12px", color: "var(--theme-elevation-500)" }}>
          {feedback || "附件、抄送在 Gmail 里补；发完再点「标记已回复」，进度和跟进记录会自动更新。"}
        </span>
      </div>
    </div>
  );
};
