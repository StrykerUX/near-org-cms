import type { Metadata } from "next";
import FoundationAView from "@/components/views/FoundationAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Monta la variante A. Las tres propuestas viven en
// `/prototype/foundation-a|b|c` y comparten su copy; elegir otra es cambiar
// el import de esta línea, igual que hace la home con `homepage-a`.
export default function FoundationAPage() {
  return <FoundationAView />;
}
