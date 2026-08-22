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
// ── Por qué los labs no llevan footer ──────────────────────────────────────
//
// `/prototype/hero-alt` monta seis heroes a pantalla completa, uno detrás de
// otro, para compararlos. El footer del sitio es un takeover: wipe negro a
// pantalla completa con el wordmark, conducido por su propio ScrollTrigger.
// Puesto al final de esa página se lee como una SÉPTIMA escena y compite con lo
// que la página existe para mostrar — además de sumar un ScrollTrigger más a
// una ruta que ya tiene seis canvas y cinco tracks pegados.
//
// `/prototype/footer-labs/*` es más terminante: cada una de esas rutas monta
// SU PROPIA propuesta de footer, y tres de ellas se disparan contra el fondo
// del documento igual que este. Montar los dos deja dos footers peleándose por
// el mismo borde inferior — el de producción, que va después en el DOM, gana y
// tapa justo lo que la página existe para mirar.
//
// El header sí se queda en las dos: es lo que las versiones despejan con
// `--site-header-block`, así que sacarlo cambiaría lo que se está evaluando.
//
// ── El match es por PREFIJO ────────────────────────────────────────────────
//
// Con `includes` sobre la ruta exacta, cada versión nueva del lab de footers
// habría que acordarse de agregarla acá — y olvidarse no da un error, da un
// footer de más al final de la página. `startsWith` cubre la carpeta entera.
//
// Las siete rutas del lab de footers hacen que esta lista deje de ser una
// excepción, que es la señal que el comentario de arriba anticipaba. No se
// hicieron los route groups igual porque el lab es temporal por definición:
// cuando el equipo elija una versión, la carpeta se borra y esto vuelve a ser
// una línea. Reestructurar `app/prototype/` para algo que se va no paga.
// Vacía tras la limpieza: sus tres entradas (hero-alt, footer-labs y
// hero-ab9-gl) eran laboratorios archivados — ver docs/labs-archivados.md.
//
// El comentario largo de arriba anticipaba justamente esto ("cuando el equipo
// elija una versión, la carpeta se borra y esto vuelve a ser una línea"), y por
// eso el archivo se queda en vez de borrarse: el mecanismo sigue siendo el que
// hay que usar si una ruta de prototipo vuelve a necesitar el layout sin footer.
const NO_FOOTER: string[] = [];

export default function PrototypeFooterSlot() {
  const pathname = usePathname();
  if (NO_FOOTER.some((base) => pathname === base || pathname.startsWith(`${base}/`))) return null;
  return <SiteFooter />;
}
