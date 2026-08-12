import type { Metadata } from "next";
import DescentZocalo from "@/components/sections/lab/DescentZocalo";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Approach C · la sonda barata. El hero es el de producción; lo único que cambia son
// dos líneas del reloj de la escalera. Ver el docblock de `LabBarsProportional`.
//
// `?span=` tantea cuánto del recorrido ocupan los escalones (defecto 0.5). Más bajo =
// la escalera se define antes.
export default async function DescentZocaloPage({
  searchParams,
}: {
  searchParams: Promise<{ debug?: string; span?: string }>;
}) {
  const { debug, span } = await searchParams;
  const stepSpan = Number(span);
  return (
    <DescentZocalo
      debug={debug !== undefined}
      {...(Number.isFinite(stepSpan) && stepSpan > 0 ? { stepSpan } : {})}
    />
  );
}
