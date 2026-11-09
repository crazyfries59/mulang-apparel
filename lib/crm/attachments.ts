/* 附件规则：后台面板和发信接口共用这一份，改一处两边一致。
   Vercel 免费版单次请求体上限 4.5MB，这里按 4MB 收口——multipart 还有边界和
   其它字段的开销，留 0.5MB 余量，免得刚好卡在边缘被平台直接拦掉。 */

export const MAX_ATTACHMENTS = 5;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

/* 客户看到可执行文件会直接当垃圾邮件，Gmail 自己也会拦，干脆不发。 */
const BLOCKED_EXTENSIONS = ["exe", "bat", "cmd", "com", "scr", "msi", "js", "vbs", "sh", "jar"];

export const extensionOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
};

export const isBlockedFile = (name: string) => BLOCKED_EXTENSIONS.includes(extensionOf(name));

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

type SizedFile = { name: string; size: number };

/* 返回一句中文错误；没问题返回 null。 */
export const checkFiles = (files: SizedFile[]): string | null => {
  if (files.length === 0) return null;
  if (files.length > MAX_ATTACHMENTS) return `一封邮件最多带 ${MAX_ATTACHMENTS} 个附件`;

  const blocked = files.find((file) => isBlockedFile(file.name));
  if (blocked) return `${blocked.name} 是可执行文件，Gmail 会拦，换成 PDF 或压缩包吧`;

  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_TOTAL_BYTES) {
    return `附件合计 ${formatBytes(total)}，超过 ${formatBytes(MAX_TOTAL_BYTES)} 上限，先压缩或分两封发`;
  }
  return null;
};

/* 写进跟进记录/返回给界面的一句话：「2 个附件：PI-7616.pdf、size-chart.xlsx」 */
export const describeFiles = (names: string[]) =>
  names.length === 0 ? "" : `${names.length} 个附件：${names.join("、")}`;
