import zlib from "node:zlib";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pg from "pg";

/* 每日把整个 CRM 数据库导出成一份压缩快照，送到不依赖香港服务器的地方。
   跑在 Vercel 的定时任务上：数据源是 Supabase，触发方是 Vercel ——
   服务器只是 WhatsApp 网关，随时可以换掉。

   出口有两条，按配置自动选：
   1. 有 GITHUB_BACKUP_TOKEN → 推到 crazyfries59/mulang-crm-backups 私有仓库
   2. 没有令牌但有 GMAIL 凭据 → 作为附件寄到自己的邮箱

   需要的环境变量：
   - DATABASE_URL        Supabase 连接串（Payload 本来就在用）
   - GITHUB_BACKUP_TOKEN 可选，对备份私有仓库有 contents 写权限的 PAT
   - GMAIL_USER / GMAIL_APP_PASSWORD  可选，没有 GitHub 令牌时的退路
   - CRON_SECRET         （建议）Vercel 会自动以 Bearer 形式带上，防止被外人乱触发
   - GH_BACKUP_REPO      可选，默认 crazyfries59/mulang-crm-backups

   产物：auto/YYYY-MM-DD.json.gz，一个文件装下全部表和行，gzip 后可直接 gunzip 查看。
   保留 90 天，超龄自动删。 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const REPO = process.env.GH_BACKUP_REPO || "crazyfries59/mulang-crm-backups";
const API = `https://api.github.com/repos/${REPO}/contents`;
const SCHEMAS = ["payload", "public"];
const KEEP_DAYS = 90;
/** 单次最多导出多少行，防止某张表突然变大把函数撑爆 */
const ROW_CAP = 50000;

const dbUrl = () =>
  [process.env.DATABASE_URL, process.env.POSTGRES_URL, process.env.POSTGRES_PRISMA_URL].find(
    (v) => typeof v === "string" && v.length > 10
  ) ?? "";

const token = () => process.env.GITHUB_BACKUP_TOKEN ?? "";

/* 没有 GitHub 令牌时的退路：把快照当附件寄到自己的邮箱。
   Gmail 的可靠性和异地程度都比一台服务器高，而且不用再申请任何凭据。 */
const mailUser = () => process.env.GMAIL_USER ?? "";
const mailPass = () => process.env.GMAIL_APP_PASSWORD ?? "";
const canMail = () => Boolean(mailUser() && mailPass());

async function mailSnapshot(gz: Buffer, stamp: string, counts: Record<string, number>) {
  const nodemailer = (await import("nodemailer")).default;
  const rows = Object.values(counts).reduce((a, b) => a + b, 0);
  const top = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([k, n]) => `  ${String(n).padStart(6)}  ${k}`)
    .join("\n");

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: mailUser(), pass: mailPass() },
  });

  await transport.sendMail({
    from: `"Mulang 自动备份" <${mailUser()}>`,
    to: process.env.BACKUP_MAIL_TO || mailUser(),
    subject: `[CRM 备份] ${stamp} · ${Object.keys(counts).length} 表 ${rows} 行`,
    text: [
      `数据库快照：${stamp}`,
      `表数 ${Object.keys(counts).length}，总行数 ${rows}，附件 ${(gz.length / 1024).toFixed(0)} KB`,
      "",
      "行数最多的表：",
      top,
      "",
      "附件是 gzip 压缩的 JSON，改名去掉 .gz 后可用任何 JSON 工具打开。",
      "这条备份由 Vercel 定时任务生成，不依赖香港那台服务器。",
    ].join("\n"),
    attachments: [{ filename: `crm-${stamp}.json.gz`, content: gz }],
  });

  return mailUser();
}

function ghHeaders() {
  return {
    authorization: `Bearer ${token()}`,
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": "mulang-crm-backup",
    "content-type": "application/json",
  };
}

/** 北京时间当天，用于文件名 */
function today() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Shanghai" });
}

async function exportAll() {
  const pool = new pg.Pool({
    connectionString: dbUrl(),
    ssl: { rejectUnauthorized: false },
    max: 4,
    statement_timeout: 30000,
  });

  const { rows: tables } = await pool.query<{ s: string; t: string }>(
    `select table_schema s, table_name t
       from information_schema.tables
      where table_schema = any($1::text[])
      order by 1, 2`,
    [SCHEMAS]
  );

  const data: Record<string, unknown[]> = {};
  const counts: Record<string, number> = {};
  const truncated: string[] = [];

  // 逐表串行要 10 秒左右，四个连接并发压到 3 秒内，给函数留足余量
  const queue = [...tables];
  const worker = async () => {
    for (let item = queue.shift(); item; item = queue.shift()) {
      const { s, t } = item;
      const key = `${s}.${t}`;
      const r = await pool.query(`select * from "${s}"."${t}" limit ${ROW_CAP + 1}`);
      const rows = r.rows.slice(0, ROW_CAP);
      if (r.rows.length > ROW_CAP) truncated.push(key);
      data[key] = rows;
      counts[key] = rows.length;
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  await pool.end();

  return { data, counts, truncated };
}

async function putFile(path: string, contentB64: string, message: string) {
  // 同一天重跑会覆盖，需要先拿旧文件的 sha
  const head = await fetch(`${API}/${path}`, { headers: ghHeaders(), cache: "no-store" });
  const sha = head.ok ? ((await head.json()) as { sha?: string }).sha : undefined;

  const res = await fetch(`${API}/${path}`, {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify({ message, content: contentB64, sha }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub 写入失败 ${res.status}: ${text.slice(0, 300)}`);
  }
  return (await res.json()) as { commit?: { sha?: string } };
}

async function prune() {
  const res = await fetch(`${API}/auto`, { headers: ghHeaders(), cache: "no-store" });
  if (!res.ok) return 0;

  const list = (await res.json()) as { name: string; sha: string; type: string }[];
  const cutoff = Date.now() - KEEP_DAYS * 86400000;
  let removed = 0;

  for (const f of list) {
    const m = /^(\d{4}-\d{2}-\d{2})\.json\.gz$/.exec(f.name);
    if (!m) continue;
    if (new Date(`${m[1]}T00:00:00+08:00`).getTime() > cutoff) continue;

    const del = await fetch(`${API}/auto/${f.name}`, {
      method: "DELETE",
      headers: ghHeaders(),
      body: JSON.stringify({ message: `prune ${f.name}`, sha: f.sha }),
    });
    if (del.ok) removed++;
  }
  return removed;
}

export async function GET(request: NextRequest) {
  // 先看配置齐不齐：缺东西时直接把缺哪个摆出来，方便在浏览器里自检
  if (!dbUrl()) return NextResponse.json({ error: "缺少 DATABASE_URL" }, { status: 503 });
  if (!token() && !canMail()) {
    return NextResponse.json(
      { error: "缺少 GITHUB_BACKUP_TOKEN，也没有 GMAIL 凭据可以退而发邮件" },
      { status: 503 }
    );
  }

  const secret = process.env.CRON_SECRET ?? "";
  if (secret) {
    const auth = request.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const started = Date.now();
  const stamp = today();

  try {
    const { data, counts, truncated } = await exportAll();

    const payload = JSON.stringify({
      exportedAt: new Date().toISOString(),
      database: "mulang-apparel",
      schemas: SCHEMAS,
      counts,
      truncated,
      tables: data,
    });

    const gz = zlib.gzipSync(Buffer.from(payload, "utf8"), { level: 9 });
    const tables = Object.keys(counts).length;
    const rows = Object.values(counts).reduce((a, b) => a + b, 0);

    let path: string | null = null;
    let commit: string | undefined;
    let mailedTo: string | null = null;

    if (token()) {
      path = `auto/${stamp}.json.gz`;
      const res = await putFile(path, gz.toString("base64"), `backup ${stamp} (${tables} tables)`);
      commit = res.commit?.sha?.slice(0, 7);
    } else {
      mailedTo = await mailSnapshot(gz, stamp, counts);
    }

    let pruned = 0;
    if (token()) {
      try {
        pruned = await prune();
      } catch {
        /* 清理失败不影响当天备份 */
      }
    }

    return NextResponse.json({
      ok: true,
      destination: mailedTo ? `mail:${mailedTo}` : `github:${path}`,
      path,
      tables,
      rows,
      rawBytes: Buffer.byteLength(payload),
      gzBytes: gz.length,
      truncated,
      pruned,
      commit,
      seconds: Math.round((Date.now() - started) / 100) / 10,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
