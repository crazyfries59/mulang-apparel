import { DefaultTemplate } from "@payloadcms/next/templates";
import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import { SalesBoard, type BoardCustomer } from "./SalesBoard";

/* /admin/crm-board — custom root views are not wrapped by Payload, so this adds the admin
   chrome (nav, header) itself and keeps anonymous visitors out. */
export async function SalesBoardView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, locale, permissions, visibleEntities } = initPageResult;
  if (!req.user) redirect("/admin/login?redirect=%2Fadmin%2Fcrm-board");

  const { docs } = await req.payload.find({
    collection: "customers",
    sort: "-updatedAt",
    limit: 500,
    depth: 1,
    select: { name: true, country: true, stage: true, owner: true, nextFollowUpAt: true, productFocus: true },
  });

  const now = new Date();
  const customers: BoardCustomer[] = docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    country: doc.country ?? "",
    productFocus: doc.productFocus ?? "",
    stage: doc.stage,
    owner: doc.owner && typeof doc.owner === "object" ? doc.owner.name || doc.owner.email : "",
    nextFollowUpAt: doc.nextFollowUpAt ?? null,
    overdue: Boolean(doc.nextFollowUpAt && new Date(doc.nextFollowUpAt) < now),
  }));

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <SalesBoard customers={customers} />
    </DefaultTemplate>
  );
}
