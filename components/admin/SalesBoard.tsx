"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CUSTOMER_STAGES } from "@/lib/crm/options";

export type BoardCustomer = {
  id: number | string;
  name: string;
  country: string;
  productFocus: string;
  stage: string;
  owner: string;
  nextFollowUpAt: string | null;
  overdue: boolean;
};

const fmtDay = (value: string) => {
  const date = new Date(value);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/* Kanban of customers by sales stage. Dropping a card on another column saves the new stage
   through the REST API with the signed-in admin cookie; a failed save puts the card back. */
export function SalesBoard({ customers: initial }: { customers: BoardCustomer[] }) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initial);
  const [dragging, setDragging] = useState<BoardCustomer["id"] | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => [c.name, c.country, c.productFocus, c.owner].some((v) => v.toLowerCase().includes(q)));
  }, [customers, query]);

  const moveTo = async (id: BoardCustomer["id"], stage: string) => {
    const previous = customers.find((c) => c.id === id);
    if (!previous || previous.stage === stage) return;
    setError("");
    setCustomers((list) => list.map((c) => (c.id === id ? { ...c, stage } : c)));
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) throw new Error(String(res.status));
      router.refresh();
    } catch {
      setCustomers((list) => list.map((c) => (c.id === id ? { ...c, stage: previous.stage } : c)));
      setError(`「${previous.name}」的阶段没有保存成功，请刷新后重试。`);
    }
  };

  return (
    <div className="mx-board">
      <header className="mx-dash__head">
        <div>
          <h1>CRM 销售看板</h1>
          <p>把客户卡片拖到另一列即可更新销售阶段；点击卡片查看详情。</p>
        </div>
        <div className="mx-dash__actions">
          <input className="mx-search" placeholder="搜索客户、国家、负责人" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Link className="mx-btn mx-btn--primary" href="/admin/collections/customers/create">新建客户</Link>
        </div>
      </header>
      {error && <p className="mx-error" role="alert">{error}</p>}
      <div className="mx-board__cols">
        {CUSTOMER_STAGES.map((stage) => {
          const cards = visible.filter((c) => c.stage === stage.value);
          return (
            <section
              key={stage.value}
              className={`mx-col${over === stage.value ? " mx-col--over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setOver(stage.value); }}
              onDragLeave={() => setOver((current) => (current === stage.value ? null : current))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                if (dragging !== null) void moveTo(dragging, stage.value);
                setDragging(null);
              }}
            >
              <div className="mx-col__head">
                <em className={`mx-pill mx-pill--${stage.value}`}>{stage.label}</em>
                <b>{cards.length}</b>
              </div>
              {cards.map((c) => (
                <div
                  key={c.id}
                  className="mx-kcard"
                  draggable
                  data-customer-id={c.id}
                  onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(c.id)); setDragging(c.id); }}
                  onDragEnd={() => { setDragging(null); setOver(null); }}
                >
                  <Link href={`/admin/collections/customers/${c.id}`} draggable={false}>{c.name}</Link>
                  <span>{[c.country, c.productFocus].filter(Boolean).join(" · ") || "—"}</span>
                  <small>
                    {c.owner && <>负责人 {c.owner}</>}
                    {c.nextFollowUpAt && <i className={c.overdue ? "mx-overdue" : undefined}>跟进 {fmtDay(c.nextFollowUpAt)}</i>}
                  </small>
                  {/* Same action without dragging — works on phones and with a keyboard. */}
                  <select aria-label={`${c.name} 的销售阶段`} value={c.stage} onChange={(e) => void moveTo(c.id, e.target.value)}>
                    {CUSTOMER_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
