import type { Intro, Product } from "@/app/(site)/products/data";

export type CmsProductDocument = {
  productCode?: string | null;
  name: string;
  slug: string;
  category?: string | null;
  subcategory?: string | null;
  gsm?: string | null;
  price?: string | null;
  moq?: string | null;
  leadTime?: string | null;
  fabric?: string | null;
  badge?: string | null;
  coverImage?: string | null;
  description?: string | null;
  sizes?: string | null;
  gallery?: { image?: string | null }[] | null;
  details?: { image?: string | null }[] | null;
  intro?: {
    feature?: string | null;
    sizeInfo?: string | null;
    material?: string | null;
    weight?: string | null;
    blank?: string | null;
    logoCustomization?: string | null;
    clothingCustomization?: string | null;
  } | null;
  seo?: { title?: string | null; description?: string | null } | null;
};

export function mapCmsProduct(document: CmsProductDocument): Product {
  const intro: Intro = {};
  if (document.intro?.feature) intro.Feature = document.intro.feature;
  if (document.intro?.sizeInfo) intro.Size = document.intro.sizeInfo;
  if (document.intro?.material) intro.Material = document.intro.material;
  if (document.intro?.weight) intro.Weight = document.intro.weight;
  if (document.intro?.blank) intro.Blank = document.intro.blank;
  if (document.intro?.logoCustomization) intro["Logo customization"] = document.intro.logoCustomization;
  if (document.intro?.clothingCustomization) intro["Clothing Customize"] = document.intro.clothingCustomization;

  const gallery = (document.gallery ?? [])
    .map((item) => item.image?.trim() ?? "")
    .filter(Boolean);
  const coverImage = document.coverImage?.trim() || gallery[0] || "";
  if (coverImage && !gallery.includes(coverImage)) gallery.unshift(coverImage);

  return {
    id: document.productCode?.trim() || "—",
    name: document.name,
    cat: document.category || "t-shirts",
    sub: document.subcategory || "",
    gsm: document.gsm?.trim() || "—",
    price: document.price?.trim() || "—",
    moq: document.moq?.trim() || "—",
    lead: document.leadTime?.trim() || "—",
    fabric: document.fabric?.trim() || "—",
    badge: document.badge?.trim() || "",
    img: coverImage,
    desc: document.description?.trim() || "",
    sizes: document.sizes?.trim() || undefined,
    gallery: gallery.length ? gallery : coverImage ? [coverImage] : [],
    slug: document.slug,
    intro,
    details: (document.details ?? [])
      .map((item) => item.image?.trim() ?? "")
      .filter(Boolean),
    seoTitle: document.seo?.title?.trim() || undefined,
    seoDescription: document.seo?.description?.trim() || undefined,
  };
}
