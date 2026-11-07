import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import sharp from "sharp";
import config from "@payload-config";
import { buildInvoiceWorkbook, invoiceFileName, type InvoiceLike, type ResolvedImage } from "@/lib/invoice/build-workbook";

export const dynamic = "force-dynamic";

/* 把 /images/xxx.jpg 这种相对路径补成完整地址，再抓成 PNG。
   用 PNG 是因为 exceljs 按扩展名写 content type，jpg 混进去 Excel 会打不开。 */
const fetchImage = async (src: string, origin: string): Promise<ResolvedImage | null> => {
  try {
    const url = /^https?:\/\//i.test(src) ? src : new URL(src, origin).toString();
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    const png = await sharp(buffer).png().toBuffer();
    const meta = await sharp(png).metadata();
    if (!meta.width || !meta.height) return null;
    return { buffer: png, width: meta.width, height: meta.height };
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response("请先登录", { status: 401 });

  const { id } = await context.params;

  let invoice;
  try {
    invoice = await payload.findByID({ collection: "invoices", id, depth: 0, overrideAccess: false, user });
  } catch {
    return new Response("发票不存在，或你没有权限看这一张", { status: 404 });
  }

  const origin = request.nextUrl.origin;
  const items = invoice.items ?? [];

  /* 图片：行里填了路径就用它；没填就按款号取产品库主图。取不到就留空，不影响导出。 */
  const images = await Promise.all(items.map(async (item): Promise<ResolvedImage | null> => {
    let src = item.image?.trim() ?? "";
    if (!src && item.product) {
      const found = await payload.find({
        collection: "products",
        where: { productCode: { equals: item.product } },
        limit: 1,
        depth: 0,
      });
      const cover = found.docs[0]?.coverImage;
      src = typeof cover === "string" ? cover.trim() : "";
    }
    return src ? fetchImage(src, origin) : null;
  }));

  const workbook = buildInvoiceWorkbook(invoice as unknown as InvoiceLike, images);
  const data = await workbook.xlsx.writeBuffer();
  const name = invoiceFileName(invoice as unknown as InvoiceLike);

  return new Response(data as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "no-store",
    },
  });
}
