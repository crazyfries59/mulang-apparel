import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

/* 取一个「1 外币 = ? USD」的参考汇率，给后台的汇率格子一键填入。
   用欧洲央行中间价（frankfurter，免 key），取不到再退到 open.er-api。
   注意：这是中间价，连连「卖外币买 USD」的实际结汇价通常略低，所以填完仍可手改。 */

const PROVIDERS: { url: string; name: string }[] = [
  { url: "https://api.frankfurter.app/latest?base=USD", name: "ECB 中间价" },
  { url: "https://open.er-api.com/v6/latest/USD", name: "open.er-api 中间价" },
];

export async function GET(request: NextRequest) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });

  const currency = (request.nextUrl.searchParams.get("currency") ?? "").toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency) || currency === "USD") {
    return Response.json({ error: "币种不对" }, { status: 400 });
  }

  for (const provider of PROVIDERS) {
    try {
      const res = await fetch(provider.url, { next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const data = (await res.json()) as { rates?: Record<string, number>; date?: string };
      const perUsd = data.rates?.[currency];
      if (typeof perUsd !== "number" || perUsd <= 0) continue;
      const quote = Math.round((1 / perUsd) * 1e6) / 1e6;
      return Response.json({
        currency,
        quote,
        perUsd,
        source: provider.name,
        date: data.date ?? null,
      });
    } catch {
      /* 换下一个源 */
    }
  }

  return Response.json({ error: "暂时取不到汇率，稍后再试或手填" }, { status: 502 });
}
