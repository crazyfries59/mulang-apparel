"use client";

import { toast, useDocumentInfo, useForm, useFormFields } from "@payloadcms/ui";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  buildFollowUpSummary,
  buildReplyDraft,
  gmailComposeUrl,
} from "../../lib/crm/reply-draft";
import {
  MAX_ATTACHMENTS,
  MAX_TOTAL_BYTES,
  checkFiles,
  formatBytes,
} from "../../lib/crm/attachments";
import { INQUIRY_STATUSES } from "../../lib/crm/options";

/* 在询盘详情页里直接回信：
   拼好英文草稿 → 可以改、可以带小附件 → 一键用后台邮箱发出（服务端 Gmail SMTP）
   → 状态自动变「已回复」、给客户记一条邮件跟进 → 面板顶上直接看到发送记录。
   不在这个页面里收信，所以不需要邮箱授权，也不会因为授权过期而断。 */

type ScriptDoc = { id: string | number; title?: string | null; content?: string | null };
type RecordDoc = { id: string | number; summary?: string | null; date?: string | null };

const textOf = (value: unknown) => (typeof value === "string" ? value : "");

const idOf = (value: unknown): string | null => {
  if (typeof value === "number" || typeof value === "string") return String(value);
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    if (typeof id === "number" || typeof id === "string") return String(id);
  }
  return null;
};

/* 「11-09 18:20」这种短格式，够看出来是什么时候发的就行。 */
const shortDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const statusLabel = (value: string) =>
  INQUIRY_STATUSES.find((item) => item.value === value)?.label ?? value;

const statusColor = (value: string) => {
  if (value === "replied") return "var(--theme-success-500, #1F7A4C)";
  if (value === "converted") return "var(--theme-success-600, #14603A)";
  if (value === "invalid") return "var(--theme-elevation-500)";
  return "var(--theme-warning-600, #8A5A00)";
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

const chipStyle = (color: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "10px",
  border: `1px solid ${color}`,
  color,
  fontSize: "11px",
  lineHeight: "16px",
  fontWeight: 600,
});

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
  const [sending, setSending] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  /* 发送记录：就是这位客户的「邮件」类跟进，最近 5 条。
     发送/标记成功后会 +1 触发重拉，以服务端为准，界面自己不用拼。 */
  const [records, setRecords] = useState<RecordDoc[]>([]);
  const [recordsVersion, setRecordsVersion] = useState(0);

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

  useEffect(() => {
    /* 没关联客户就没有邮件记录可看，整块也不渲染，这里直接不请求。 */
    if (!customerId) return;
    let cancelled = false;
    const params = new URLSearchParams({
      limit: "5",
      depth: "0",
      sort: "-date",
      "where[customer][equals]": customerId,
      "where[channel][equals]": "email",
    });
    fetch(`/api/follow-ups?${params.toString()}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { docs?: RecordDoc[] } | null) => {
        if (!cancelled) setRecords(json?.docs ?? []);
      })
      .catch(() => {
        /* 拉不到就只显示「还没有记录」，不影响发信 */
      });
    return () => {
      cancelled = true;
    };
  }, [customerId, recordsVersion]);

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

  const insertScript = (scriptId: string) => {
    const script = scripts.find((item) => String(item.id) === scriptId);
    if (!script?.content) return;
    const base = body === "" || body.endsWith("\n") ? body : `${body}\n`;
    setOverride({ subject, body: `${base}\n${script.content}` });
  };

  const pickFiles = (picked: FileList | null) => {
    if (!picked || picked.length === 0) return;
    setFiles((current) => [...current, ...Array.from(picked)]);
    if (fileInput.current) fileInput.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const fileError = checkFiles(files.map((file) => ({ name: file.name, size: file.size })));
  const remainingBytes = Math.max(MAX_TOTAL_BYTES - totalBytes, 0);

  /* 直接在系统里发：服务端用 Gmail SMTP 发出去，顺手改状态、写跟进。
     发信是不可撤的动作，所以先要一次确认。 */
  const sendNow = async () => {
    if (!id || !email) return;
    if (fileError) {
      toast.error(fileError);
      return;
    }
    const attachNote = files.length > 0 ? `，带 ${files.length} 个附件（${formatBytes(totalBytes)}）` : "";
    if (!window.confirm(`确认把这封回复发给 ${email}${attachNote}？发出后撤不回来。`)) return;

    setSending(true);
    setFeedback("");
    try {
      /* 附件走 multipart，不转 base64，同样的文件体积更小。 */
      const form = new FormData();
      form.append("subject", subject);
      form.append("body", body);
      files.forEach((file) => form.append("attachments", file, file.name));

      const res = await fetch(`/api/inquiries/${id}/reply`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const json = (await res.json().catch(() => null)) as
        | { error?: string; warning?: string | null; keptReply?: boolean; attachments?: string[] }
        | null;
      if (!res.ok) throw new Error(json?.error ?? "发送失败");

      dispatchFields({ type: "UPDATE", path: "status", value: "replied" });
      if (json?.keptReply) dispatchFields({ type: "UPDATE", path: "reply", value: body });

      const sentFiles = json?.attachments?.length ? `（含 ${json.attachments.length} 个附件）` : "";
      setFeedback(
        json?.warning
          ? `已发送给 ${email}${sentFiles}；${json.warning}`
          : `已发送给 ${email}${sentFiles}，状态已改为「已回复」，跟进记录已写入`,
      );
      setFiles([]);
      setRecordsVersion((v) => v + 1);
      toast.success("已发送");
    } catch (err) {
      const message = err instanceof Error ? err.message : "未知错误";
      setFeedback(`没发出去：${message}`);
      toast.error("发送失败");
    } finally {
      setSending(false);
    }
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
        setRecordsVersion((v) => v + 1);
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <strong style={{ fontSize: "14px", fontWeight: 600 }}>回复询盘</strong>
          {status ? (
            <span style={chipStyle(statusColor(status))}>{statusLabel(status)}</span>
          ) : null}
        </div>
        <span style={{ fontSize: "12px", color: "var(--theme-elevation-500)" }}>
          草稿按询盘内容生成，发之前改一遍
        </span>
      </div>

      {customerId ? (
        <div
          style={{
            marginBottom: "14px",
            padding: "8px 10px",
            borderRadius: "4px",
            border: "1px dashed var(--theme-elevation-150)",
            background: "var(--theme-elevation-0)",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--theme-elevation-600)", marginBottom: records.length ? "4px" : 0 }}>
            最近发送记录（这位客户，最近 5 条）
          </div>
          {records.length === 0 ? (
            <span style={{ fontSize: "12px", color: "var(--theme-elevation-500)" }}>还没有邮件记录</span>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", lineHeight: 1.8 }}>
              {records.map((record) => (
                <li key={String(record.id)}>
                  <span style={{ color: "var(--theme-elevation-500)" }}>{shortDate(record.date)}</span>
                  {"  "}
                  {record.summary ?? "（无摘要）"}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {noEmail ? (
        <p style={{ fontSize: "12px", color: "var(--theme-warning-500, #854F0B)", margin: "0 0 12px" }}>
          这条询盘没填邮箱，先把上面的邮箱补上，才能直接发信。
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

      <div style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
          <label style={{ ...labelStyle, marginBottom: 0 }} htmlFor="inquiry-reply-files">
            附件（可选）
          </label>
          <input
            id="inquiry-reply-files"
            ref={fileInput}
            type="file"
            multiple
            onChange={(e) => pickFiles(e.target.files)}
            style={{ fontSize: "12px" }}
          />
          <span style={{ fontSize: "12px", color: fileError ? "var(--theme-error-500, #B42318)" : "var(--theme-elevation-500)" }}>
            {files.length === 0
              ? `最多 ${MAX_ATTACHMENTS} 个，合计不超过 ${formatBytes(MAX_TOTAL_BYTES)}（报价表、PI、图片都行）`
              : `已选 ${files.length} 个，合计 ${formatBytes(totalBytes)}，还能加 ${formatBytes(remainingBytes)}`}
          </span>
        </div>

        {files.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", lineHeight: 1.9 }}>
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                {file.name}
                <span style={{ color: "var(--theme-elevation-500)" }}>（{formatBytes(file.size)}）</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  style={{ marginLeft: "8px", border: "none", background: "none", color: "var(--theme-error-500, #B42318)", cursor: "pointer", fontSize: "12px", padding: 0 }}
                >
                  移除
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {fileError ? (
          <p style={{ fontSize: "12px", color: "var(--theme-error-500, #B42318)", margin: "4px 0 0" }}>{fileError}</p>
        ) : null}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <button
          type="button"
          className="btn btn--style-primary btn--size-small"
          style={actionBtn}
          onClick={sendNow}
          disabled={noEmail || sending || !id || Boolean(fileError)}
          title="用后台配置的邮箱直接发出，并发完自动记录"
        >
          {sending ? "发送中…" : "直接发送"}
        </button>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={actionBtn} onClick={openGmail} disabled={noEmail}>
          在 Gmail 里发
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
          {feedback || "「直接发送」发出后，状态会变「已回复」，并自动写一条邮件跟进记录。"}
        </span>
      </div>
    </div>
  );
};
