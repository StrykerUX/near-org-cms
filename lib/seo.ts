import type { Metadata } from "next";
import type { PageMeta } from "@/lib/page-meta";
import { SITE_URL, BRAND_TITLE_SUFFIX, BRAND_NAME } from "@/lib/site-config";

// Deriva el `export const metadata` de Next.js a partir de un `page.meta.ts`.
// Antes de esta fase, solo /blog declaraba `openGraph` — el resto de páginas
// no tenía OG en absoluto. Con esto todas las páginas del manifiesto quedan
// consistentes, sin que nadie tenga que repetir el boilerplate a mano.
export function toMetadata(meta: PageMeta): Metadata {
  const title = `${meta.title}${BRAND_TITLE_SUFFIX}`;
  const url = `${SITE_URL}${meta.route}`;

  const metadata: Metadata = {
    title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type: meta.og?.type ?? "website",
      url,
      siteName: BRAND_NAME,
      title,
      description: meta.description,
      ...(meta.og?.image && { images: [{ url: meta.og.image }] }),
    },
  };

  if (meta.robots === "noindex") {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}
