// Shape del manifiesto de rutas basado en archivos. Un `page.meta.ts` hermano
// de cada `page.tsx` exporta un objeto `satisfies PageMeta` — ver
// scripts/gen-routes.mjs para cómo se descubre y lib/routes.ts para cómo se
// consume (nav, sitemap, robots).
//
// Solo puede importarse `import type { PageMeta } from "@/lib/page-meta"` —
// nada más — desde un `page.meta.ts`. El manifiesto lo consume
// SiteHeader.tsx ("use client"); un import de servidor colado en un meta
// reventaría el bundle de cliente con un error confuso.
export type PageMeta = {
  route: `/${string}`;
  title: string; // sin sufijo de marca — lib/seo.ts lo añade
  description: string;
  // `false` explícito (no omitido) fuerza la decisión al crear la página.
  nav?:
    | false
    | {
        header?: boolean;
        footer?: boolean;
        label?: string;
        order?: number;
      };
  sitemap?:
    | false
    | {
        changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
        priority?: number;
      };
  robots?: "index" | "noindex";
  og?: {
    image?: string;
    type?: "website" | "article";
  };
};

// Lo que emite scripts/gen-routes.mjs por cada page.meta.ts encontrado.
export type RouteEntry = PageMeta & { file: string };
