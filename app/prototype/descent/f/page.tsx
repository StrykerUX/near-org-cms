import type { Metadata } from "next";
import DescentStairs from "@/components/sections/lab/DescentStairs";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// La figura de la escalera nace COMPLETA y nunca se escala ni se recorta: es la única
// forma de que no exista un estado intermedio en el que la columna sea un rectángulo,
// que es de donde salía la banda gris del arranque en todos los approaches anteriores.
// Ver el docblock de `Figure` en components/sections/lab/DescentStairs.tsx.
export default async function DescentFPage({
  searchParams,
}: {
  searchParams: Promise<{ debug?: string }>;
}) {
  const { debug } = await searchParams;
  return <DescentStairs backdrop="extended" figure="static" debug={debug !== undefined} />;
}
