import type { Metadata } from "next";
import AboutAView from "@/components/views/AboutAView";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Monta la variante A. Las tres propuestas viven en
// `/prototype/about-a|b|c` y comparten su copy; elegir otra es cambiar
// el import de esta línea, igual que hace la home con `homepage-a`.
export default function AboutAPage() {
  return <AboutAView />;
}
