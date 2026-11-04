import type { Metadata } from "next";

// Must match the title template in app/(site)/layout.tsx.
const BRAND_SUFFIX = " | Mulang Apparel";
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

/** Keeps the brand suffix only when the full title still fits in a search result. */
export function pageTitle(title: string): NonNullable<Metadata["title"]> {
  return title.length + BRAND_SUFFIX.length <= TITLE_LIMIT ? title : { absolute: title };
}

/** Shortens a meta description at a word boundary so search results don't cut it mid-word. */
export function metaDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= DESCRIPTION_LIMIT) return clean;
  const cut = clean.slice(0, DESCRIPTION_LIMIT - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—–-]+$/, "")}…`;
}

/** Joins product spec values, skipping the "—" placeholder used for missing CMS data. */
export function specList(...values: string[]): string {
  return values.filter((value) => value && value !== "—").join(", ");
}
