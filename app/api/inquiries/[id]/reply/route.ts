import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getPayload } from "payload";
import config from "@payload-config";
import { buildFollowUpSummary } from "@/lib/crm/reply-draft";

export const dynamic = "force-dynamic";
/* nodemailer 要 Node 运行时，不能跑在 Edge 上。 */
export const runtime = "nodejs";

/* 在后台直接把回信发出去，不用跳 Gmail。
   发信走和官网通知同一套 Gmail SMTP（GMAIL_USER / GMAIL_APP_PASSWORD），
   发完把这封的发件内容记进询盘和跟进记录。
   Gmail 会自己把这封信存进「已发送」，客户回信仍落在 Gmail 收件箱。 */

const MAX_SUBJECT = 200;
const MAX_BODY = 20000;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/* 自定义路由没有 Payload 的 CSRF 检查，用同源校验替代：浏览器带 Origin 时必须与本站一致。 */
const sameOrigin = (request: NextRequest) => {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
};

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "来源不合法" }, { status: 403 });

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求内容读不出来" }, { status: 400 });
  }

  const { subject, body: mailBody } = (body ?? {}) as { subject?: unknown; body?: unknown };
  const cleanSubject = text(subject).slice(0, MAX_SUBJECT);
  const cleanBody = text(mailBody).slice(0, MAX_BODY);
  if (!cleanSubject || !cleanBody) {
    return NextResponse.json({ error: "主题和正文都不能为空" }, { status: 400 });
  }

  let inquiry;
  try {
    inquiry = await payload.findByID({ collection: "inquiries", id, depth: 0, overrideAccess: false, user });
  } catch {
    return NextResponse.json({ error: "询盘不存在，或你没有权限看这一条" }, { status: 404 });
  }

  const to = text(inquiry.email);
  if (!to) return NextResponse.json({ error: "这条询盘没有邮箱" }, { status: 400 });

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const dryRun = process.env.MAIL_DRY_RUN === "1";
  if (!dryRun && (!gmailUser || !gmailPass)) {
    return NextResponse.json({ error: "邮件服务没有配置（GMAIL_USER / GMAIL_APP_PASSWORD）" }, { status: 500 });
  }

  /* 发送失败就什么都不改，用户可以重试；发送成功但后续记录失败，返回 ok 加提示，避免重复发信。 */
  try {
    if (dryRun) {
      console.log(`[inquiry-reply] dry run → ${to} | ${cleanSubject}`);
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });
      await transporter.sendMail({
        from: `Mulang Apparel <${gmailUser}>`,
        to,
        replyTo: `${gmailUser}`,
        subject: cleanSubject,
        text: cleanBody,
      });
    }
  } catch (err) {
    console.error("[inquiry-reply] 发送失败:", err);
    return NextResponse.json({ error: "邮件没发出去，检查一下 Gmail 应用专用密码，或稍后重试" }, { status: 502 });
  }

  const warnings: string[] = [];

  const keptReply = text(inquiry.reply) === "";
  try {
    await payload.update({
      collection: "inquiries",
      id,
      depth: 0,
      overrideAccess: false,
      user,
      data: { status: "replied", ...(keptReply ? { reply: cleanBody } : {}) },
    });
  } catch (err) {
    console.error("[inquiry-reply] 状态没更新:", err);
    warnings.push("询盘状态没更新，请手动改一下");
  }

  const customerId = typeof inquiry.customer === "object" ? inquiry.customer?.id : inquiry.customer;
  if (customerId) {
    try {
      await payload.create({
        collection: "follow-ups",
        depth: 0,
        overrideAccess: false,
        user,
        data: {
          customer: customerId,
          summary: buildFollowUpSummary(cleanSubject),
          content: cleanBody,
          channel: "email",
          date: new Date().toISOString(),
          author: user.id,
        },
      });
    } catch (err) {
      console.error("[inquiry-reply] 跟进记录没写成:", err);
      warnings.push("跟进记录没写成，请手动补一条");
    }
  } else {
    warnings.push("这条询盘还没关联客户，所以没写跟进记录");
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    keptReply,
    warning: warnings.length > 0 ? warnings.join("；") : null,
  });
}
