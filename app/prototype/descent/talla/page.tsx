import type { Metadata } from "next";
import DescentTalla from "@/components/sections/lab/DescentTalla";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Approach B · el que puede eliminar la banda del todo. El gris no crece: la reja está
// completa desde el primer frame y el hero, apilado encima, va retirando su imagen con
// un recorte escalonado. Ver el docblock de `LabHeroCarve`.
//
// Tres perillas, y conviene saber cuál mover:
//
//   `?ease=`  — la GRATIS, y la que decide qué tan pronunciado se ve el escalonado.
//               Defecto `power4.out`; `expo.out` es un paso más. Solo eases sin
//               sobrepaso (ver la nota de CARVE_EASE en LabHeroCarve).
//   `?lag=`   — retarda el centro respecto a los extremos. Empuja el zócalo a cero, a
//               cambio de curvar la silueta intermedia. Defecto 0.
//   `?drop=`  — cuánto cuelga la columna central, en unidades de `--u`. Defecto 0.5, y
//               es la CARA: reencuadra el hero, porque el vídeo tiene que crecer igual.
export default async function DescentTallaPage({
  searchParams,
}: {
  searchParams: Promise<{ debug?: string; drop?: string; ease?: string; lag?: string }>;
}) {
  const { debug, drop, ease, lag } = await searchParams;
  const dropUnits = Number(drop);
  const lagValue = Number(lag);
  return (
    <DescentTalla
      debug={debug !== undefined}
      {...(Number.isFinite(dropUnits) && dropUnits > 0 ? { drop: dropUnits } : {})}
      {...(ease ? { carveEase: ease } : {})}
      {...(Number.isFinite(lagValue) && lagValue > 0 ? { lag: lagValue } : {})}
    />
  );
}
