import type { Metadata } from "next";
import EconomicsAView from "@/components/views/EconomicsAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Monta la variante A. Las tres propuestas viven en
// `/prototype/economics-a|b|c` y comparten su copy; elegir otra es cambiar
// el import de esta línea, igual que hace la home con `homepage-a`.
export default function EconomicsAPage() {
  return <EconomicsAView />;
}
