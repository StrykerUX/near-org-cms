// Top-level static segments already served at the app root (app/ and app/(site)/).
// A Linktree slug is served at the root too (near.ai/{slug}), so it must never
// collide with one of these.
const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "blog",
  "brand",
  "company",
  "cookie-policy",
  "get-in-touch",
  "no-index",
  "privacy-policy",
  "terms-of-service",
  "acceptable-use-policy",
  "near-ai-agent-market-terms-of-service",
  "near-ai-cloud-terms-of-service",
  "near-ai-data-processing-agreement-for-customers",
  "preview",
  "downloads",
  "feed.xml",
  "sitemap.xml",
  "robots.txt",
  "favicon.ico",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
