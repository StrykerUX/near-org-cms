import { GridOverlay } from "@/components/primitives/Grid";
import DatasheetHero from "@/components/sections/protocol-labs/a/DatasheetHero";
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
// **Afirmar con datos, después demostrar.** El hero no separa la afirmación de
// su prueba: el titular comparte pantalla con las seis cifras. Lo que sigue no
// las repite — las explica, con un acto pegado donde una sola pieza isométrica
// cambia de estado seis veces, una por capacidad del protocolo, y cada beat
// muestra la cifra que sostiene.
//
// La lectura que ofrece: primero por qué creerle, después cómo funciona.
//
// ── El ritmo ────────────────────────────────────────────────────────────────
//
//   hero            crema     titular + las seis cifras, retícula de 12 columnas
//   propiedades     blanco    tres puntos con viñeta de cubo (banda apagada)
//   ACTO            INK       seis pantallas, panel pegado, un objeto que muta
//   developers      crema     centrado — el corte contra el compás del acto
//   ecosistema      blanco    tres columnas cortas, numeradas 11 / 12 / 13
//   apéndice        crema     cinco referencias con su host
//   cierre          INK       el objeto completo, centrado
//
// Claro · claro · OSCURO · claro · claro · claro · OSCURO. Nada fuerte sigue a
// nada fuerte, que es la regla de ritmo que traen quantum y la página viva.
//
// ── `ScaleClaim` va con `proof={false}` ────────────────────────────────────
//
// Su banda de seis cifras queda apagada porque el hero ya las presenta y el acto
// las reparte como telemetría: encendida, las mismas seis saldrían tres veces y
// a la tercera dejarían de leerse como prueba. La prop existe por eso.
//
// ── Lo que sigue abierto ───────────────────────────────────────────────────
//
// 1. **El hero está en revisión.** Ocho variantes en `/prototype/protocol-heroes`
//    ponen a prueba justamente esta composición, incluidas las que sacan las
//    cifras del hero. Si gana otra, es la sección que cambia.
// 2. **Dos ejes de composición conviven.** El hero, el ecosistema y el apéndice
//    alinean a la izquierda; developers y el cierre centran, y el cambio de eje
//    cae justo después del acto. Puede leerse como el corte que el acto pedía o
//    como dos plantillas pegadas.
// 3. **La retícula aparece una sola vez.** `ColumnRule` firma el hero y no vuelve
//    en el cierre.
export default function ProtocolLabAView() {
  return (
    <>
      <main>
        <DatasheetHero />
        <ScaleClaim proof={false} />
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
