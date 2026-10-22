import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { parseContactData } from "@/lib/contact-validation";

const TO_EMAIL = "maxlinzhe@gmail.com";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data = parseContactData(body);
  if (!data) {
    return NextResponse.json({ error: "Please check your name, email, message, and field lengths." }, { status: 400 });
  }
  const { name, company, email, whatsapp, productType, quantity, message } = data;

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    console.error("[contact] Email service is not configured.");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Company", company || "—"],
    ["Email", email],
    ["WhatsApp", whatsapp || "—"],
    ["Product Type", productType || "—"],
    ["Quantity", quantity || "—"],
  ];

  const html = `
    <h2 style="font-family:sans-serif">New inquiry from lin6666.top</h2>
    <table style="font-family:sans-serif; font-size:14px; border-collapse:collapse;">
      ${rows.map(([k, v]) => `
        <tr>
          <td style="padding:4px 12px 4px 0; color:#666; vertical-align:top;">${escapeHtml(k)}</td>
          <td style="padding:4px 0;">${escapeHtml(v)}</td>
        </tr>`).join("")}
    </table>
    <p style="font-family:sans-serif; font-size:14px; color:#666; margin-top:16px;">Message</p>
    <p style="font-family:sans-serif; font-size:14px; white-space:pre-wrap;">${escapeHtml(message)}</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `Mulang Apparel Inquiries <${gmailUser}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}${company ? ` (${company})` : ""}`,
      html,
    });
  } catch (err) {
    console.error("[contact] Failed to send via Gmail:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
