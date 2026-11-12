"use client";

import { useFormFields } from "@payloadcms/ui";
import React, { useState } from "react";
import { SHIPPING_KINDS } from "../../lib/crm/options";
import { useFormUpdater } from "./useFormUpdater";

/* 运费行上方的名称选择：快递 / 空运 / 海运 / 其他费用。
   选了就把发票上要印的英文写进同一行的 label；「其他费用」清空 label 让人自己写。
   名称本身仍是 text 字段，所以想手改也可以直接在下面改。不存新字段、不用迁移。 */

const controlStyle: React.CSSProperties = {
  height: 32,
  padding: "0 8px",
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 4,
  background: "var(--theme-input-bg, #fff)",
  color: "var(--theme-text)",
  fontSize: 13,
  maxWidth: 320,
};

const hintStyle: React.CSSProperties = {
  color: "var(--theme-elevation-600)",
  fontSize: 12,
};

export const ShippingPicker: React.FC<{ path?: string }> = ({ path }) => {
  const update = useFormUpdater();
  const base = path ? path.replace(/\.shippingPicker$/, "") : "";

  const label = useFormFields(([fields]) => {
    const raw = fields?.[`${base}.label`]?.value;
    return typeof raw === "string" ? raw.trim() : "";
  });

  if (!base) return null;

  const known = SHIPPING_KINDS.find((kind) => kind.text && kind.text === label);
  /* 选了「其他费用」时 label 是空的，靠本地记忆让下拉保持在「其他费用」上。 */
  const [picked, setPicked] = useState("");
  const value = known?.value ?? (label ? "custom" : picked);

  const pick = (next: string) => {
    const kind = SHIPPING_KINDS.find((item) => item.value === next);
    if (!kind) return;
    setPicked(next);
    /* 其他费用：名称清空，提示直接写中文/英文都行 */
    update(`${base}.label`, kind.text);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 600 }}>运输方式</span>
      <select
        data-testid="shipping-kind"
        style={controlStyle}
        value={value}
        onChange={(event) => pick(event.target.value)}
      >
        <option value="" disabled>
          — 选一种 —
        </option>
        {SHIPPING_KINDS.map((kind) => (
          <option key={kind.value} value={kind.value}>
            {kind.label}
          </option>
        ))}
        {value === "custom" && <option value="custom">{`自定义：${label}`}</option>}
      </select>
      <span style={hintStyle}>
        {value === "other"
          ? "下面「名称」自己写，比如 辅料费 / Sample fee。"
          : "选完会写进下面「名称」，印在发票的运费行；也能直接手改。"}
      </span>
    </div>
  );
};
