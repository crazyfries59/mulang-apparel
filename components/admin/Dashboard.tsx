import Link from "next/link";
import type { Payload, Where } from "payload";
import { CUSTOMER_STAGES, INQUIRY_STATUSES, ORDER_STAGES, ORDER_TYPES, labelOf } from "@/lib/crm/options";

const ADMIN = "/admin/collections";
const day = 24 * 60 * 60 * 1000;

const fmtDate = (value?: string | null, withTime = false) => {
  if (!value) return "—";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  const ymd = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
  return withTime ? `${ymd} ${pad(date.getHours())}:${pad(date.getMinutes())}` : ymd;
};

const nameOf = (value: unknown) =>
  value && typeof value === "object" && "name" in value ? String((value as { name: unknown }).name) : "—";

/* Overview page that replaces Payload's default collection cards. Counts run one after another
   on purpose: the production pool only has two connections. */
export async function Dashboard({ payload }: { payload: Payload }) {
  const count = async (collection: Parameters<Payload["count"]>[0]["collection"], where?: Where) =>
    (await payload.count({ collection, where })).totalDocs;

  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  const inquiryTotal = await count("inquiries");
  const inquiryWeek = await count("inquiries", { receivedAt: { greater_than: new Date(now.getTime() - 7 * day).toISOString() } });
  const inquiryNew = await count("inquiries", { status: { equals: "new" } });
  const customerTotal = await count("customers");
  const productTotal = await count("products", { _status: { equals: "published" } });
  const postTotal = await count("posts", { _status: { equals: "published" } });

  const stageCounts: { value: string; label: string; total: number }[] = [];
  for (const stage of CUSTOMER_STAGES) {
    stageCounts.push({ ...stage, total: await count("customers", { stage: { equals: stage.value } }) });
  }

  const latestInquiries = await payload.find({ collection: "inquiries", sort: "-receivedAt", limit: 6, depth: 0 });
  const dueCustomers = await payload.find({
    collection: "customers",
    where: { and: [{ nextFollowUpAt: { less_than: endOfToday } }, { stage: { not_in: ["won", "lost"] } }] },
    sort: "nextFollowUpAt",
    limit: 8,
    depth: 0,
  });
  const activeOrders = await payload.find({
    collection: "orders",
    where: { stage: { not_in: ["done", "cancelled"] } },
    sort: "dueDate",
    limit: 6,
    depth: 1,
  });

  const stats = [
    { label: "询盘总数", value: inquiryTotal, href: `${ADMIN}/inquiries` },
    { label: "近 7 天新增", value: inquiryWeek, href: `${ADMIN}/inquiries` },
    { label: "待处理（新询盘）", value: inquiryNew, href: `${ADMIN}/inquiries?where[status][equals]=new` },
    { label: "客户数", value: customerTotal, href: `${ADMIN}/customers` },
    { label: "已发布产品", value: productTotal, href: `${ADMIN}/products` },
    { label: "已发布文章", value: postTotal, href: `${ADMIN}/posts` },
  ];
  const maxStage = Math.max(1, ...stageCounts.map((stage) => stage.total));

  return (
    <div className="mx-dash">
      <header className="mx-dash__head">
        <div>
          <h1>概览</h1>
          <p>Mulang Apparel 网站与销售一览</p>
        </div>
        <div className="mx-dash__actions">
          <Link className="mx-btn" href={`${ADMIN}/inquiries/create`}>登记询盘</Link>
          <Link className="mx-btn" href={`${ADMIN}/follow-ups/create`}>记一条跟进</Link>
          <Link className="mx-btn mx-btn--primary" href={`${ADMIN}/customers/create`}>新建客户</Link>
        </div>
      </header>

      <section className="mx-stats">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="mx-card mx-stat">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </Link>
        ))}
      </section>

      <section className="mx-grid">
        <div className="mx-card">
          <div className="mx-card__title">
            <h2>最新询盘</h2>
            <Link href={`${ADMIN}/inquiries`}>全部</Link>
          </div>
          {latestInquiries.docs.length === 0 && <p className="mx-empty">还没有询盘。官网联系表单提交后会自动出现在这里。</p>}
          {latestInquiries.docs.map((inquiry) => (
            <Link key={inquiry.id} href={`${ADMIN}/inquiries/${inquiry.id}`} className="mx-row">
              <div>
                <strong>{inquiry.name}</strong>
                <span>{[inquiry.country, inquiry.company, inquiry.productType].filter(Boolean).join(" · ") || "—"}</span>
              </div>
              <div className="mx-row__meta">
                <em className={`mx-pill mx-pill--${inquiry.status}`}>{labelOf(INQUIRY_STATUSES, inquiry.status)}</em>
                <span>{fmtDate(inquiry.receivedAt, true)}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mx-card">
          <div className="mx-card__title">
            <h2>销售阶段分布</h2>
            <Link href="/admin/crm-board">看板</Link>
          </div>
          {stageCounts.map((stage) => (
            <div key={stage.value} className="mx-stage">
              <em className={`mx-pill mx-pill--${stage.value}`}>{stage.label}</em>
              <div className="mx-stage__bar"><i style={{ width: `${(stage.total / maxStage) * 100}%` }} /></div>
              <b>{stage.total}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-grid mx-grid--even">
        <div className="mx-card">
          <div className="mx-card__title">
            <h2>今天该跟进</h2>
            <Link href={`${ADMIN}/customers?sort=nextFollowUpAt`}>全部客户</Link>
          </div>
          {dueCustomers.docs.length === 0 && <p className="mx-empty">没有到期的跟进。</p>}
          {dueCustomers.docs.map((customer) => {
            const overdue = customer.nextFollowUpAt && new Date(customer.nextFollowUpAt).getTime() < now.getTime() - day;
            return (
              <Link key={customer.id} href={`${ADMIN}/customers/${customer.id}`} className="mx-row">
                <div>
                  <strong>{customer.name}</strong>
                  <span>{[customer.country, labelOf(CUSTOMER_STAGES, customer.stage)].filter(Boolean).join(" · ")}</span>
                </div>
                <div className="mx-row__meta">
                  <span className={overdue ? "mx-overdue" : undefined}>{overdue ? "已逾期 " : ""}{fmtDate(customer.nextFollowUpAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mx-card">
          <div className="mx-card__title">
            <h2>进行中的样品 / 大货</h2>
            <Link href={`${ADMIN}/orders`}>全部</Link>
          </div>
          {activeOrders.docs.length === 0 && <p className="mx-empty">没有进行中的订单。</p>}
          {activeOrders.docs.map((order) => (
            <Link key={order.id} href={`${ADMIN}/orders/${order.id}`} className="mx-row">
              <div>
                <strong>{order.title}</strong>
                <span>{[nameOf(order.customer), labelOf(ORDER_TYPES, order.type), order.quantity ? `${order.quantity} 件` : ""].filter(Boolean).join(" · ")}</span>
              </div>
              <div className="mx-row__meta">
                <em className="mx-pill">{labelOf(ORDER_STAGES, order.stage)}</em>
                <span>交期 {fmtDate(order.dueDate)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
