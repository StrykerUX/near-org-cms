import type { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { ROUTES } from "@/lib/routes.generated";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Derivado del manifiesto (Fase 4) — antes era un array a mano que no incluía
// /blog. El propósito de esta página es listar todo lo que existe mientras
// el diseño real no está definido, así que derivarla del filesystem es una
// mejora deliberada, no solo un refactor: agregar una página nueva ahora
// aparece aquí sola, sin editar este archivo.
const PAGES = ROUTES.filter((r) => r.route !== "/").map((r) => ({
  href: r.route,
  label: (r.nav !== false && r.nav?.label) || r.title,
}));

export default function HomePage() {
  return <HomeView pages={PAGES} />;
}
