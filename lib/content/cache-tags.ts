export const PRODUCTS_CACHE_TAG = "cms-products";

/* Public pages are cached (revalidate = 600) so crawlers get HTML from the CDN
   instead of waiting on a database round-trip. That means an admin edit has to
   invalidate the rendered pages too, not just the data cache — otherwise a
   change could take up to ten minutes to appear.

   next/cache is loaded lazily: the Payload CLI (migrations, type generation,
   imports) loads the collection config in plain Node, where that module cannot
   be resolved, and writes made from the CLI have no Next.js cache to clear
   anyway. */
async function revalidate(work: (mod: typeof import("next/cache")) => void) {
  try {
    const mod = await import("next/cache");
    work(mod);
  } catch {
    // Not inside a Next.js request: nothing to invalidate.
  }
}

export async function revalidateProducts() {
  await revalidate(({ revalidateTag, revalidatePath }) => {
    revalidateTag(PRODUCTS_CACHE_TAG, { expire: 0 });
    // Path invalidation is what refreshes the cached HTML of prerendered pages.
    ["/", "/products", "/t-shirt-manufacturer", "/custom-hoodie-manufacturer"].forEach((path) =>
      revalidatePath(path),
    );
    revalidatePath("/products/[slug]", "page");
  });
}

export async function revalidatePosts() {
  await revalidate(({ revalidatePath }) => {
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/");
  });
}
