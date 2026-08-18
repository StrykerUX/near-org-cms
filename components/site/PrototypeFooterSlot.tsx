"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/site/SiteFooter";

// El footer de `/prototype/*`, con una lista de rutas que NO lo llevan.
//
// ── Por qué existe este archivo y no se resolvió con layouts ────────────────
//
// El footer lo monta `app/prototype/layout.tsx`, que es el layout PADRE de
// todas las rutas de prototipo. Un layout hijo no puede quitar lo que el padre
// pone: los layouts de Next anidan, no se reemplazan. Y un route group tampoco
// escapa — `app/prototype/(bare)/hero-alt/` seguiría pasando por el layout de
// `app/prototype/`.
//
// Las dos alternativas reales eran:
//
//   · reestructurar `app/prototype/` en dos grupos —uno con chrome y otro
//     sin— y mover las diez rutas existentes al primero. Correcto en teoría,
//     pero son diez carpetas movidas y todas sus URLs revisadas para excluir
//     UNA página;
//   · esto: un slot que lee el pathname y decide.
//
// Se eligió el segundo por proporción. Si mañana hay tres o cuatro rutas sin
// chrome, la lista deja de ser una excepción y ahí SÍ conviene hacer los
// grupos — este comentario es el aviso de cuándo.
//
// ── Por qué el lab no lleva footer ──────────────────────────────────────────
//
// `/prototype/hero-alt` monta seis heroes a pantalla completa, uno detrás de
// otro, para compararlos. El footer del sitio es un takeover: wipe negro a
// pantalla completa con el wordmark, conducido por su propio ScrollTrigger.
// Puesto al final de esa página se lee como una SÉPTIMA escena y compite con lo
// que la página existe para mostrar — además de sumar un ScrollTrigger más a
// una ruta que ya tiene seis canvas y cinco tracks pegados.
//
// El header sí se queda: es lo que las seis versiones despejan con
// `--site-header-block`, así que sacarlo cambiaría lo que se está evaluando.
const NO_FOOTER: string[] = ["/prototype/hero-alt"];

export default function PrototypeFooterSlot() {
  const pathname = usePathname();
  if (NO_FOOTER.includes(pathname)) return null;
  return <SiteFooter />;
}
