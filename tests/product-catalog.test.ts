import assert from "node:assert/strict";
import test from "node:test";
import { mapCmsProduct } from "../lib/content/product-mapping.ts";
import { publishedProductWhere, withPublicationDate } from "../lib/content/publication.ts";

const now = new Date("2026-10-24T12:00:00.000Z");

test("CMS product mapping preserves the fields used by listing and detail pages", () => {
  const product = mapCmsProduct({
    productCode: "#TS-01",
    name: "Heavy Cotton Tee",
    slug: "heavy-cotton-tee",
    category: "t-shirts",
    subcategory: "oversized-t-shirt",
    gsm: "260GSM",
    price: "$6.99",
    moq: "50 pcs",
    leadTime: "14 days",
    fabric: "Cotton",
    badge: "New",
    coverImage: "/products/t-shirts/heavy-cotton-tee/img-1.jpg",
    description: "A heavyweight cotton tee.",
    sizes: "S, M, L, XL",
    gallery: [
      { image: "/products/t-shirts/heavy-cotton-tee/img-1.jpg" },
      { image: "/products/t-shirts/heavy-cotton-tee/img-2.jpg" },
    ],
    details: [{ image: "/products/t-shirts/heavy-cotton-tee/detail-1.jpg" }],
    intro: {
      feature: "Relaxed fit",
      material: "100% cotton",
      logoCustomization: "Custom labels available",
    },
    seo: { title: "Heavy Cotton Tee | Mulang", description: "Custom cotton tee manufacturing." },
  });

  assert.equal(product.slug, "heavy-cotton-tee");
  assert.equal(product.id, "#TS-01");
  assert.equal(product.cat, "t-shirts");
  assert.equal(product.img, "/products/t-shirts/heavy-cotton-tee/img-1.jpg");
  assert.equal(product.intro.Feature, "Relaxed fit");
  assert.equal(product.intro["Logo customization"], "Custom labels available");
  assert.deepEqual(product.gallery, [
    "/products/t-shirts/heavy-cotton-tee/img-1.jpg",
    "/products/t-shirts/heavy-cotton-tee/img-2.jpg",
  ]);
  assert.equal(product.seoTitle, "Heavy Cotton Tee | Mulang");
});

test("a missing cover image falls back to the first gallery image", () => {
  const product = mapCmsProduct({
    name: "Hoodie",
    slug: "hoodie",
    gallery: [{ image: "/products/hoodie/front.jpg" }],
  });

  assert.equal(product.img, "/products/hoodie/front.jpg");
  assert.deepEqual(product.gallery, ["/products/hoodie/front.jpg"]);
});

test("products receive a date on first publish and preserve scheduled dates", () => {
  assert.equal(withPublicationDate({ _status: "published" }, undefined, now).publishedAt, now.toISOString());
  assert.equal(withPublicationDate({ _status: "draft" }, undefined, now).publishedAt, undefined);

  const scheduled = { _status: "published" as const, publishedAt: "2027-01-01T00:00:00.000Z" };
  assert.deepEqual(withPublicationDate(scheduled, undefined, now), scheduled);
});

test("public product query requires published status and a release date", () => {
  assert.deepEqual(publishedProductWhere(now), {
    and: [
      { _status: { equals: "published" } },
      { publishedAt: { less_than_equal: now.toISOString() } },
    ],
  });
});
