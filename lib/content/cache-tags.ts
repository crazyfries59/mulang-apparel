export const PRODUCTS_CACHE_TAG = "cms-products";

/* Clears the cached public product list after an admin edit, so the next visitor gets fresh data.
   next/cache is loaded lazily: the Payload CLI (migrations, type generation, imports) loads the
   collection config in plain Node, where that module cannot be resolved, and writes made from the
   CLI have no Next.js cache to clear anyway. */
export async function revalidateProducts() {
  try {
    const { revalidateTag } = await import("next/cache");
    revalidateTag(PRODUCTS_CACHE_TAG, { expire: 0 });
  } catch {
    // Not inside a Next.js request: nothing to invalidate.
  }
}
