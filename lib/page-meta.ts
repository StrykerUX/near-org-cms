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
  // Resumen de ~5 palabras, para el índice de `/`. La `description` es para
  // buscadores y redes (una frase completa, con punto); esto es una etiqueta
  // que se lee de un vistazo en una lista de 33 filas, así que va sin punto
  // final y sin repetir el `title`.
  //
  // Opcional a propósito: una página sin `blurb` no rompe nada, solo aparece
  // sin resumen. Obligarlo haría que crear una página exija redactar dos veces
  // lo mismo antes de poder verla.
  blurb?: string;
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
//
// `stub` NO se declara en el `page.meta.ts`: lo DERIVA el generador mirando si
// el `page.tsx` hermano renderiza `StubView`. Es la diferencia entre un dato
// que la página afirma sobre sí misma (`nav`, `blurb`) y uno que es un hecho
// verificable de su código — y este segundo tipo se pudre si hay que mantenerlo
// a mano: nadie se acuerda de bajar la bandera el día que le escribe contenido.
export type RouteEntry = PageMeta & { file: string; stub: boolean };
