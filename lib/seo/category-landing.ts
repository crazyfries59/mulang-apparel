/**
 * Categories that own a category landing page (one primary keyword per page, so
 * two pages never compete for the same term). Used by the product detail page,
 * the catalogue listing and the footer to link the product pages back up to the
 * middle layer — the 240+ product pages are otherwise only reachable from
 * /products and the sitemap.
 */
export type CategoryLanding = {
  path: string;
  /** Primary keyword the landing page owns. */
  keyword: string;
  /** Short label for link text. */
  label: string;
};

export const CATEGORY_LANDINGS: Record<string, CategoryLanding> = {
  "t-shirts": { path: "/t-shirt-manufacturer", keyword: "t-shirt manufacturer", label: "T-Shirts" },
  hoodies: { path: "/custom-hoodie-manufacturer", keyword: "custom hoodie manufacturer", label: "Hoodies" },
};

export const landingForCategory = (category: string): CategoryLanding | undefined =>
  CATEGORY_LANDINGS[category];

export const CATEGORY_LANDING_LIST = Object.values(CATEGORY_LANDINGS);
