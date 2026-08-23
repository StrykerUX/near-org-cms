import { GridOverlay } from "@/components/primitives/Grid";
import Hero from "@/components/sections/protocol-labs/a/Hero";
import ScaleClaim from "@/components/sections/protocol-labs/a/ScaleClaim";
import Assembly from "@/components/sections/protocol-labs/a/Assembly";
import DevRuntime from "@/components/sections/protocol-labs/a/DevRuntime";
import Deployment from "@/components/sections/protocol-labs/a/Deployment";
import Appendix from "@/components/sections/protocol-labs/a/Appendix";
import MachineClose from "@/components/sections/protocol-labs/a/MachineClose";

// La estructura elegida para la página Protocol — /prototype/protocol-a
//
// ── De dónde viene ──────────────────────────────────────────────────────────
//
// Fue la alternativa D del laboratorio: la selección hecha sobre tres
// direcciones completas (A · Datasheet, B · The Machine, C · The Argument). Al
// quedar elegida, sus siete secciones se consolidaron en esta carpeta y las tres
// direcciones se borraron. Están enteras en el commit anterior a la limpieza;
// `../../sections/protocol-labs/README.md` dice cuál era cada una y qué se
// perdió con ellas.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// **Afirmar, probar en el primer movimiento, después demostrar.** El hero
// afirma y no argumenta: una pantalla completa con la frase, el cuerpo y la
// salida, sin una sola cifra. La prueba llega entera al primer scroll, abriendo
// la sección siguiente. Lo que viene después no la repite — la explica, con un
// acto pegado donde una sola pieza isométrica cambia de estado seis veces, una
// por capacidad del protocolo, y cada beat muestra la cifra que sostiene.
//
// La lectura que ofrece: primero por qué creerle, después cómo funciona.
//
// El hero salió de comparar ocho variantes en `/prototype/protocol-heroes` — era
// la H4, "Cut", después llevada a altura completa (ver la nota en `a/Hero.tsx`
// sobre qué se ganó y qué se dejó ir con ese cambio). Está copiado y no
// importado desde el lab: desde que se eligió, deja de moverse con él — y por
// eso su copia del lab se borró. De las ocho sobrevive H2 · Count como
// alternativa; el resto está en el historial de git.
//
// Lo que le falta a esta página es la SUPERFICIE del hero, que hoy no tiene:
// las tres candidatas viven en `/prototype/protocol-opening`.
//
// ── El ritmo ────────────────────────────────────────────────────────────────
//
//   hero            crema     pantalla completa, sin cifras
//   propiedades     blanco    las seis cifras ARRIBA —la prueba primero— y
//                             debajo los tres puntos con viñeta de cubo
//   ACTO            INK       seis pantallas, panel pegado, un objeto que muta
//   developers      crema     centrado — el corte contra el compás del acto
//   ecosistema      blanco    tres columnas cortas, numeradas 11 / 12 / 13
//   apéndice        crema     cinco referencias con su host
//   cierre          INK       el objeto completo, centrado
//
// Claro · claro · OSCURO · claro · claro · claro · OSCURO. Nada fuerte sigue a
// nada fuerte, que es la regla de ritmo que traen quantum y la página viva.
//
// ── Por qué `ScaleClaim` va con `proof="top"` ─────────────────────────────
//
// Porque el hero no prueba nada. Con la franja al pie de esa sección, el lector
// atraviesa una pantalla de afirmación y otra de explicación antes de ver el
// primer dato duro; arriba, la evidencia es lo primero que aparece al moverse.
//
// Es la mitad que le falta al hero, no una decisión de layout suya: si algún día
// el hero vuelve a traer las seis cifras adentro, esto pasa a `false` en el
// mismo cambio.
//
// ── Lo que sigue abierto ───────────────────────────────────────────────────
//
// 1. **La primera pantalla ya no anuncia lo que sigue.** Era lo que hacía el
//    hero recortado de H4, y se cambió por presencia y por consistencia con los
//    heroes de altura completa del resto del sitio. Si el arranque se siente
//    cerrado, es esto. La versión con el corte a 78svh ya no vive en ningún
//    archivo: se borró con el resto del laboratorio de heroes y está en el
//    historial de git.
// 2. **Dos ejes de composición conviven.** El hero, el ecosistema y el apéndice
//    alinean a la izquierda; developers y el cierre centran, y el cambio de eje
//    cae justo después del acto. Puede leerse como el corte que el acto pedía o
//    como dos plantillas pegadas.
// 3. **La página se quedó sin retícula.** `ColumnRule` era la textura del hero
//    anterior; el nuevo no la lleva, así que las doce columnas siguen gobernando
//    el layout pero ya no se ven en ningún lado. O se acepta, o vuelve en alguna
//    otra sección.
export default function ProtocolLabAView() {
  return (
    <>
      <main>
        <Hero />
        <ScaleClaim proof="top" />
        <Assembly />
        <DevRuntime />
        <Deployment />
        <Appendix />
        <MachineClose />
      </main>
      <GridOverlay />
    </>
  );
}
