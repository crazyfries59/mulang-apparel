import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const TO_EMAIL = "maxlinzhe@gmail.com";
const MAX_LEN = 5000;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: NextRequest) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, company, email, whatsapp, productType, quantity, message } = data;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
  }
  if (!isValidEmail(email.trim())) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (message.length > MAX_LEN || name.length > 200) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    console.error("[contact] GMAIL_USER / GMAIL_APP_PASSWORD not set — inquiry lost:", { name, email });
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
