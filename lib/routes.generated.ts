// AUTO-GENERADO por scripts/gen-routes.mjs — NO EDITAR A MANO.
// Este archivo es un cache committeado, no la fuente de verdad — se
// regenera en cada `predev`/`prebuild`. Para agregar una página, crea su
// `page.meta.ts` y corre `pnpm gen:routes`.
import type { RouteEntry } from "@/lib/page-meta";
import m0 from "@/app/(site)/page.meta";
import m1 from "@/app/(site)/blog/page.meta";
import m2 from "@/app/(site)/brand/page.meta";
import m3 from "@/app/prototype/page.meta";
import m4 from "@/app/prototype/components/page.meta";
import m5 from "@/app/prototype/homepage-v2/page.meta";
import m6 from "@/app/prototype/protocol/page.meta";
import m7 from "@/app/prototype/quantum-security/page.meta";

export const ROUTES: RouteEntry[] = [
  { ...m0, route: "/", file: "app/(site)/page.meta.ts" },
  { ...m1, route: "/blog", file: "app/(site)/blog/page.meta.ts" },
  { ...m2, route: "/brand", file: "app/(site)/brand/page.meta.ts" },
  { ...m3, route: "/prototype", file: "app/prototype/page.meta.ts" },
  { ...m4, route: "/prototype/components", file: "app/prototype/components/page.meta.ts" },
  { ...m5, route: "/prototype/homepage-v2", file: "app/prototype/homepage-v2/page.meta.ts" },
  { ...m6, route: "/prototype/protocol", file: "app/prototype/protocol/page.meta.ts" },
  { ...m7, route: "/prototype/quantum-security", file: "app/prototype/quantum-security/page.meta.ts" },
];
