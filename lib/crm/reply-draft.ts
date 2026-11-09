/* 询盘回复草稿：把询盘里已有的信息拼成一封能直接发的英文回信。
   只做"够发出去"的初稿，具体报价、MOQ、交期留空让业务员填——
   系统不替人承诺数字。纯函数，不碰数据库，方便单独核对输出。 */

export type InquiryDraftSource = {
  name?: string | null;
  company?: string | null;
  email?: string | null;
  country?: string | null;
  productType?: string | null;
  quantity?: string | null;
  message?: string | null;
};

/* 落款。改这里一处即可，全站草稿跟着变。 */
export const SIGNER_NAME = "Max";
export const COMPANY_NAME = "Mulang Apparel";
export const COMPANY_SITE = "www.mulangapparel.com";

const clean = (value?: string | null) => (typeof value === "string" ? value.trim() : "");

const firstNameOf = (name?: string | null) => clean(name).split(/\s+/)[0] || "there";

/* 客户提了产品类型和数量就顺手复述一句，让对方知道我们真读了。 */
const referenceLine = (source: InquiryDraftSource) => {
  const productType = clean(source.productType);
  const quantity = clean(source.quantity).replace(/\s*(pcs|pieces|units)\.?$/i, "");
  if (productType && quantity) return ` — noted, ${quantity} pcs of ${productType}`;
  if (productType) return ` — noted, ${productType}`;
  if (quantity) return ` — noted, ${quantity} pcs`;
  return "";
};

export const buildReplySubject = (source: InquiryDraftSource) => {
  const productType = clean(source.productType);
  return productType ? `Re: ${productType} inquiry — ${COMPANY_NAME}` : `Re: your inquiry — ${COMPANY_NAME}`;
};

export const buildReplyBody = (source: InquiryDraftSource) => {
  const country = clean(source.country);
  const marketLine = country ? ` for brands in ${country}` : " for brands worldwide";

  return [
    `Dear ${firstNameOf(source.name)},`,
    "",
    `Thank you for your message${referenceLine(source)}. This is ${SIGNER_NAME} from ${COMPANY_NAME} — we produce custom apparel${marketLine}: blank garments wholesale, logo printing on our blanks, and cut & sew from your own patterns.`,
    "",
    "To send you an accurate quotation instead of a rough guess, could you confirm:",
    "",
    "1. Style or reference — or shall I send our catalogue and price list first?",
    "2. Quantity per colour and per size",
    "3. Fabric and weight you have in mind",
    "4. Logo / artwork file and the print method you prefer",
    "5. Target price, and the date you need the goods in hand",
    "",
    "Once I have these I will come back with fabric options, unit price, MOQ and lead time — usually within one working day.",
    "",
    "Best regards,",
    SIGNER_NAME,
    COMPANY_NAME,
    COMPANY_SITE,
  ].join("\n");
};

export const buildReplyDraft = (source: InquiryDraftSource) => ({
  subject: buildReplySubject(source),
  body: buildReplyBody(source),
});

/* 标记已回复时写进跟进记录的一句话摘要。去掉 Re: 和品牌后缀，只留询盘主题。 */
export const buildFollowUpSummary = (subject: string) => {
  const trimmed = clean(subject)
    .replace(/^Re:\s*/i, "")
    .replace(new RegExp(`\\s*[—-]\\s*${COMPANY_NAME}$`, "i"), "")
    .trim();
  return trimmed ? `邮件回复询盘：${trimmed}` : "邮件回复询盘";
};

/* Gmail 网页版写信。to / su / body 都必须是编码后的字符串。 */
export const gmailComposeUrl = (to: string, subject: string, body: string) => {
  const params = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
};

/* 本机邮件客户端。mailto 的查询串不能用 URLSearchParams（空格会变 + 号）。 */
export const mailtoUrl = (to: string, subject: string, body: string) =>
  `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
