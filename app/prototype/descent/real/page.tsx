import type { Metadata } from "next";
import DescentReal from "@/components/sections/lab/DescentReal";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// La referencia fiel del laboratorio: HeroVideo + QuantumBars de producción, tal
// cual, con el panel de `?debug` encima. Es el "antes" — los approaches se comparan
// contra esto y no contra la maqueta, que deja fuera el vídeo, los velos, el
// parallax de la copy y la intro del titular.
export default async function DescentRealPage({
  searchParams,
}: {
  searchParams: Promise<{ debug?: string }>;
}) {
  const { debug } = await searchParams;
  return <DescentReal debug={debug !== undefined} />;
}
