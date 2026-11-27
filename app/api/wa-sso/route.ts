import crypto from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* 从 CRM 后台跳到 WhatsApp 分流系统，并且不需要再输一次密码。
   做法：用当前登录用户签一张 2 分钟有效的票，让分流系统验签后直接建会话。
   密钥 WA_SSO_SECRET 必须和分流系统那边的环境变量一模一样，两边各存一份，不进前端。

   没有配密钥时直接报错说明，而不是跳过去让业务员卡在登录页。 */

const TTL_MS = 2 * 60 * 1000;

const waBase = () =>
  (process.env.WA_ROUTER_URL ||
    process.env.NEXT_PUBLIC_WA_ROUTER_URL ||
    "https://wa.mulangapparel.com").replace(/\/+$/, "");

export async function GET(request: NextRequest) {
  const secret = process.env.WA_SSO_SECRET ?? "";
  if (secret.length < 16) {
    return new NextResponse(
      "单点登录还没配置：在 Vercel 里加上环境变量 WA_SSO_SECRET（和分流系统用同一个值）后重新部署即可。",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user?.email) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const phone = (request.nextUrl.searchParams.get("phone") ?? "").replace(/\D/g, "");

  const body = Buffer.from(
    JSON.stringify({
      email: String(user.email).toLowerCase(),
      name: typeof user.name === "string" ? user.name : "",
      phone,
      exp: Date.now() + TTL_MS,
    })
  ).toString("base64url");

  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");

  return NextResponse.redirect(`${waBase()}/api/sso?t=${body}.${sig}`);
}
