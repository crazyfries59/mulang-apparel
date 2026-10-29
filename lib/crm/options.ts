/* Shared CRM option lists. Collections, the dashboard and the sales board all read from here
   so a stage renamed in one place shows the same label everywhere. */

export type Option = { value: string; label: string };

export const CUSTOMER_STAGES = [
  { value: "new", label: "新询盘" },
  { value: "contacted", label: "已联系" },
  { value: "interested", label: "有意向" },
  { value: "quoted", label: "已报价" },
  { value: "sampling", label: "打样中" },
  { value: "won", label: "已成交" },
  { value: "lost", label: "已流失" },
] as const satisfies readonly Option[];

export type CustomerStage = (typeof CUSTOMER_STAGES)[number]["value"];

export const CUSTOMER_SOURCES = [
  { value: "website", label: "官网表单" },
  { value: "email", label: "邮件" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "referral", label: "老客户介绍" },
  { value: "platform", label: "平台 / 社媒" },
  { value: "other", label: "其他" },
] as const satisfies readonly Option[];

export const COOPERATION_MODES = [
  { value: "blank", label: "空白成衣批发" },
  { value: "logo", label: "空白款加 Logo" },
  { value: "cut-sew", label: "版型定制 cut & sew" },
] as const satisfies readonly Option[];

export const INQUIRY_STATUSES = [
  { value: "new", label: "新询盘" },
  { value: "replied", label: "已回复" },
  { value: "converted", label: "已转客户" },
  { value: "invalid", label: "无效 / 垃圾" },
] as const satisfies readonly Option[];

export const ORDER_TYPES = [
  { value: "sample", label: "样品" },
  { value: "bulk", label: "大货" },
] as const satisfies readonly Option[];

export const ORDER_STAGES = [
  { value: "quoting", label: "报价中" },
  { value: "sampling", label: "打样中" },
  { value: "confirmed", label: "已确认" },
  { value: "production", label: "生产中" },
  { value: "shipped", label: "已发货" },
  { value: "done", label: "已完成" },
  { value: "cancelled", label: "已取消" },
] as const satisfies readonly Option[];

export const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "AUD", label: "AUD" },
  { value: "CAD", label: "CAD" },
  { value: "CHF", label: "CHF" },
  { value: "CNY", label: "CNY" },
] as const satisfies readonly Option[];

export const FOLLOW_UP_CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "邮件" },
  { value: "wechat", label: "微信" },
  { value: "call", label: "电话 / 语音" },
  { value: "meeting", label: "见面" },
  { value: "other", label: "其他" },
] as const satisfies readonly Option[];

export const SCRIPT_CATEGORIES = [
  { value: "outreach", label: "开发信" },
  { value: "inquiry-reply", label: "询盘回复" },
  { value: "quote", label: "报价说明" },
  { value: "no-reply", label: "未读未回跟进" },
  { value: "sample", label: "样品跟进" },
  { value: "bulk", label: "转化大货" },
  { value: "review", label: "好评 / 视频邀请" },
  { value: "other", label: "其他" },
] as const satisfies readonly Option[];

export const KNOWLEDGE_CATEGORIES = [
  { value: "fabric", label: "面料" },
  { value: "craft", label: "工艺 / Logo" },
  { value: "size", label: "尺码 / 版型" },
  { value: "trims", label: "辅料 / 标签包装" },
  { value: "shipping", label: "物流运输" },
  { value: "pricing", label: "报价规则" },
  { value: "process", label: "流程规范" },
  { value: "other", label: "其他" },
] as const satisfies readonly Option[];

export const LANGUAGES = [
  { value: "en", label: "英文" },
  { value: "zh", label: "中文" },
] as const satisfies readonly Option[];

export const labelOf = (options: readonly Option[], value: unknown) =>
  options.find((option) => option.value === value)?.label ?? (typeof value === "string" ? value : "—");

export const toOptions = (options: readonly Option[]) => options.map(({ value, label }) => ({ value, label }));
