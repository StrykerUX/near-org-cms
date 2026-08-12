import type { Metadata } from "next";
import DescentStage from "@/components/sections/lab/DescentStage";
import { CURVES, DEFAULT_CURVE, type CurveKey } from "@/components/sections/lab/descentCurves";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Laboratorio del descenso del hero. Las cuatro rutas montan la misma maqueta y solo
// cambian el approach. Ver components/sections/lab/.
//
// La query se resuelve acá, en el server component, y baja como props: `?debug`
// enciende el HUD que mide el hueco de la juntura y `?curve=a..f` cambia la curva sin
// recompilar. Leerla en el cliente costaba o un Suspense obligatorio, o un mismatch de
// hidratación, o un setState en efecto (renders en cascada).
export default async function DescentAPage({
  searchParams,
}: {
  searchParams: Promise<{ debug?: string; curve?: string }>;
}) {
  const { debug, curve } = await searchParams;
  const key = curve && curve in CURVES ? (curve as CurveKey) : DEFAULT_CURVE;

  return <DescentStage approach="hold" debug={debug !== undefined} curve={key} />;
}
