# Blog CMS

The site uses a replaceable content adapter in `lib/content/`. Sanity is the first provider; the blog pages and sitemap consume the normalized adapter rather than Sanity documents directly.

## First-time setup

1. Create a Sanity account and project at https://www.sanity.io/manage.
2. Create a dataset named `production` (or choose another dataset name).
3. Add these public environment variables to the Vercel project and to local `.env.local` when developing:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
4. Redeploy. The Studio is available at `/studio` and uses Sanity sign-in. No Sanity write token is stored in the website.
5. Add `www.lin6666.top` as an allowed origin in the Sanity project's API/CORS settings if the Studio requests it.

## Publishing an article

In Studio, create a Blog post and fill in title, URL slug, excerpt, category, cover image, body, reading time, and SEO fields. Set `Publish date` to the current time to publish immediately, or a future time to schedule. Leave it empty to keep the document out of the public site. Publishing a document makes it appear in the blog index and sitemap; pages revalidate within five minutes.

Existing local articles remain available as fallback until a CMS article with the same slug is published. Keep existing slugs unchanged when migrating so public URLs and search signals are preserved.

## Extending or replacing the CMS

Keep provider-specific queries in `lib/content/sanity.ts`, map provider output to `lib/content/types.ts`, and keep the route components provider-agnostic. A replacement provider should implement the same list/single-post functions. Export or migrate article content before removing a provider.
