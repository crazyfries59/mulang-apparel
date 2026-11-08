"use client";

import { useForm, useFormFields } from "@payloadcms/ui";
import React, { useEffect, useRef } from "react";
import { toEnglishCountry } from "../../lib/crm/country";

/* 选中客户 → 立刻把抬头填进表单，不用等保存。
   规则与后端快照一致：只覆盖"空字段"或"上一秒还是自动填的那个值"，
   手改过的内容不动。保存时服务端还会再兜一次底。 */

type CustomerDoc = {
  company?: string | null;
  name?: string | null;
  contactName?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  country?: string | null;
  billingAddress?: string | null;
  billingPostcode?: string | null;
};

const FIELD_MAP: Array<{ path: string; pick: (c: CustomerDoc) => string | null | undefined }> = [
  { path: "billToCompany", pick: (c) => c.company || c.name },
  { path: "billToContact", pick: (c) => c.contactName },
  { path: "billToTel", pick: (c) => c.phone || c.whatsapp },
  { path: "billToEmail", pick: (c) => c.email },
  { path: "billToAddress", pick: (c) => c.billingAddress },
  { path: "billToCountry", pick: (c) => toEnglishCountry(c.country) },
  { path: "billToPostcode", pick: (c) => c.billingPostcode },
];

const idOf = (value: unknown): string | null => {
  if (typeof value === "number" || typeof value === "string") return String(value);
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    if (typeof id === "number" || typeof id === "string") return String(id);
  }
  return null;
};

export const FillBillTo: React.FC = () => {
  const { dispatchFields } = useForm();
  const fields = useFormFields(([all]) => all);
  const customerValue = fields?.customer?.value;

  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;

  const lastCustomer = useRef<string | null>(null);
  const autoFilled = useRef<Record<string, string>>({});

  const customerId = idOf(customerValue);

  useEffect(() => {
    if (!customerId) {
      lastCustomer.current = null;
      autoFilled.current = {};
      return;
    }
    if (lastCustomer.current === customerId) return;
    lastCustomer.current = customerId;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/customers/${customerId}?depth=0`, { credentials: "include" });
        if (!res.ok) return;
        const doc = (await res.json()) as CustomerDoc;
        if (cancelled) return;

        for (const { path, pick } of FIELD_MAP) {
          const current = fieldsRef.current?.[path]?.value;
          const currentText = typeof current === "string" ? current : "";
          const previousAuto = autoFilled.current[path] ?? "";
          const keepUserValue = currentText !== "" && currentText !== previousAuto;
          if (keepUserValue) continue;

          const next = pick(doc) ?? "";
          if (!next || next === currentText) {
            if (next) autoFilled.current[path] = next;
            continue;
          }
          dispatchFields({ type: "UPDATE", path, value: next });
          autoFilled.current[path] = next;
        }
      } catch {
        /* 客户读不到就算了，保存时服务端还会再填一次 */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [customerId, dispatchFields]);

  return null;
};
