import type { Product } from "@/app/(site)/products/data";

/**
 * Google truncates titles around 60 characters and descriptions around 155.
 * Product pages are generated from the CMS, so every string here has to cope with
 * missing fields rather than relying on a human filling each record in by hand.
 */
const TITLE_MAX = 60;
const DESC_MAX = 155;
const BRAND = "Mulang Apparel";

/** The CMS mapping layer turns missing values into an em dash, which must read as "no data". */
const isBlank = (value?: string) => {
  if (!value) return true;
  const trimmed = value.trim();
  return trimmed === "" || trimmed === "—" || trimmed === "–" || trimmed === "-";
};

const squash = (value: string) => value.replace(/\s+/g, " ").trim();

/** Cut on a word boundary, never mid-word, and drop a trailing punctuation mark. */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return safe.replace(/[\s,;:.·–-]+$/, "");
}

/**
 * Keeps the brand suffix only when the whole title still fits a SERP result.
 * Keyword-first matters more than the brand here: 46% of the catalogue was
 * losing the tail of its name to truncation because of the suffix.
 */
export function buildProductTitle(product: Product): string {
  const base = squash(product.seoTitle?.trim() || product.name);
  const branded = `${base} | ${BRAND}`;
  if (branded.length <= TITLE_MAX) return branded;
  return base.length <= TITLE_MAX ? base : clamp(base, TITLE_MAX);
}

/** Noun used in the manufacturing clause, so 241 descriptions do not read identically. */
const PRODUCT_NOUN: Record<string, string> = {
  "t-shirts": "t-shirt",
  hoodies: "hoodie",
  pants: "pants",
  denim: "denim",
  shirt: "shirt",
  dresses: "dress",
  sweater: "knitwear",
  sleepwear: "sleepwear",
  swimwear: "swimwear",
  jersey: "teamwear",
  "outdoor-clothing": "performance apparel",
  "kids-wear": "kidswear",
  accessories: "accessory",
  "y2k-fashion": "streetwear",
};

const SUBCATEGORY_NOUN: Record<string, string> = {
  "oversized-t-shirt": "oversized t-shirt",
  "vintage-wash-t-shirt": "vintage wash t-shirt",
  "basic-fit-t-shirt": "basic fit t-shirt",
  "long-sleeve": "long sleeve t-shirt",
  polo: "polo shirt",
  vest: "vest",
  "fleece-hoodie": "fleece hoodie",
  "terry-hoodie": "French terry hoodie",
  sweatshirt: "crewneck sweatshirt",
  "zip-up-hoodie": "zip-up hoodie",
  shorts: "shorts",
};

/**
 * Builds a meta description from whatever the record actually contains.
 * Only details the product name does not already carry are repeated, so a page
 * never spends its snippet saying "190GSM" twice. Blank fields are skipped
 * entirely, so nothing renders "... , —." to a searcher.
 */
export function buildProductDescription(product: Product): string {
  if (!isBlank(product.seoDescription)) return clamp(squash(product.seoDescription!), DESC_MAX);

  const name = squash(product.name);
  const nameLower = name.toLowerCase();
  const fabric = isBlank(product.fabric) ? "" : squash(product.fabric);
  const gsm = isBlank(product.gsm) ? "" : squash(product.gsm);
  const moq = isBlank(product.moq) ? "" : squash(product.moq);
  const lead = isBlank(product.lead) ? "" : squash(product.lead);

  const noun =
    SUBCATEGORY_NOUN[product.sub] ||
    PRODUCT_NOUN[product.cat] ||
    "apparel";
  const capability = `Custom ${noun} manufacturing`;
  const order = moq
    ? `${capability} from ${moq}${lead ? `, ${lead} lead time` : ""}.`
    : `${capability}.`;

  // Keep only the specification values the product name has not already stated.
  const specParts: string[] = [];
  if (fabric && !nameLower.includes(fabric.toLowerCase())) specParts.push(fabric);
  if (gsm && !nameLower.includes(gsm.toLowerCase().replace(/\s+/g, "")) && !nameLower.includes(gsm.toLowerCase())) {
    specParts.push(gsm);
  }
  const specFull = specParts.join(", ");

  const candidates = [
    `${name}. ${specFull ? `${specFull}. ` : ""}${order}`,
    `${name}. ${order}`,
  ];

  return (
    candidates.find((candidate) => candidate.length <= DESC_MAX) ??
    clamp(candidates[candidates.length - 1], DESC_MAX)
  );
}

/** Short factual line for structured data, with blanks and em dashes removed. */
export function buildProductSpecLine(product: Product): string {
  const parts = [
    isBlank(product.fabric) ? "" : squash(product.fabric!),
    isBlank(product.gsm) ? "" : squash(product.gsm!),
    isBlank(product.moq) ? "" : `MOQ ${squash(product.moq!)}`,
    isBlank(product.lead) ? "" : `${squash(product.lead!)} lead time`,
  ].filter(Boolean);
  return parts.length ? `${parts.join(", ")}.` : "";
}
