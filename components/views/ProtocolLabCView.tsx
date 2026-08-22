import { GridOverlay } from "@/components/primitives/Grid";
import ArgumentHero from "@/components/sections/protocol-labs/c/ArgumentHero";
import Premise from "@/components/sections/protocol-labs/c/Premise";
import Entries from "@/components/sections/protocol-labs/c/Entries";
import Practice from "@/components/sections/protocol-labs/c/Practice";
import Actors from "@/components/sections/protocol-labs/c/Actors";
import Reading from "@/components/sections/protocol-labs/c/Reading";
import Coda from "@/components/sections/protocol-labs/c/Coda";

// Alternativa C · "The Argument" — /prototype/protocol-c
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// Una página de protocolo que se LEE. Todo el peso lo lleva la tipografía: la
// frase a escala de cartel en el hero, la premisa a escala de manifiesto, y las
// seis capacidades como seis entradas de un ensayo, cada una abierta por su
// palabra cruzando la página.
//
// La jerarquía que se desprende: **la tesis primero**. Qué significa esto y por
// qué importa; la mecánica llega después, como desarrollo, y las cifras van al
// margen como aparato de datos. Es la lectura del que todavía no decidió si le
// interesa.
//
// ── Por qué esta dirección existe ──────────────────────────────────────────
//
// Todos los protocolos publican la misma página: 3D con glow, seis cards, una
// franja de métricas. La forma más rápida de no parecerse a eso no es un efecto
// mejor — es cambiar de género. Esta alternativa apuesta a que el material de
// NEAR (Kepler, la escala mural, el crema) ya alcanza para sostener una página
// de texto, y que una página de texto en esta categoría se lee como confianza.
//
// ── El ritmo ────────────────────────────────────────────────────────────────
//
//   hero          crema     dos renglones a ancho de página, sin fondo
//   premisa       crema     manifiesto + las seis cifras al margen
//   entradas      blanco · crema · blanco · INK · blanco · crema
//   práctica      crema     el código como figura, con pie
//   actores       blanco    tres bloques con la retícula de las entradas
//   lecturas      crema     bibliografía en serif
//   coda          INK       la palabra, otra vez
//
// Hero y premisa son los dos cremas seguidos de la página; se sostienen porque
// el hero no tiene fondo y la premisa sí tiene bloque de texto — la juntura la
// hace la densidad, no el color. Es lo primero a mirar si algo se siente plano
// al principio.
export default function ProtocolLabCView() {
  return (
    <>
      <main>
        <ArgumentHero />
        <Premise />
        <Entries />
        <Practice />
        <Actors />
        <Reading />
        <Coda />
      </main>
      <GridOverlay />
    </>
  );
}
