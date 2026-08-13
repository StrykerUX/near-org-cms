import type { Metadata } from "next";
import DescentStairs from "@/components/sections/lab/DescentStairs";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// El reparto nuevo de la escalera: cada columna sube con su escalón, de los bordes al
// centro, sin que el gris pase nunca por una banda plana. Las dos rutas comparten todo
// eso y difieren solo en qué se ve detrás de los huecos que aún no subieron —
// `sticky` acá. Ver components/sections/lab/DescentStairs.tsx.
export default async function DescentEPage({
  searchParams,
}: {
  searchParams: Promise<{ debug?: string }>;
}) {
  const { debug } = await searchParams;
  return <DescentStairs backdrop="sticky" debug={debug !== undefined} />;
}
