import { GridOverlay } from "@/components/primitives/Grid";
import MachineHero from "@/components/sections/protocol-labs/b/MachineHero";
import ScaleClaim from "@/components/sections/protocol-labs/b/ScaleClaim";
import Assembly from "@/components/sections/protocol-labs/b/Assembly";
import DevRuntime from "@/components/sections/protocol-labs/b/DevRuntime";
import Operators from "@/components/sections/protocol-labs/b/Operators";
import Coverage from "@/components/sections/protocol-labs/b/Coverage";
import MachineClose from "@/components/sections/protocol-labs/b/MachineClose";

// Alternativa B · "The Machine" — /prototype/protocol-b
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// Las seis capacidades del protocolo no son seis features: son seis vistas del
// mismo objeto. B lo dice con una sola pieza isométrica que abre la página en
// reposo, atraviesa el acto central cambiando de estado, y cierra con todas sus
// capas encendidas a la vez.
//
// La jerarquía que se desprende: **la mecánica primero**. Lo que se ofrece es
// entender cómo funciona; las cifras aparecen como telemetría de lo que se está
// mostrando, no como una franja de credenciales. Es la lectura del que necesita
// creer que esto es un sistema y no una lista de afirmaciones.
//
// ── El ritmo ────────────────────────────────────────────────────────────────
//
//   hero          crema     el objeto en reposo, en diagonal con el titular
//   propiedades   blanco    tres puntos + las seis cifras como nota al pie
//   ACTO          INK       seis pantallas, panel pegado, un objeto que muta
//   developers    crema     centrado — el corte contra el compás del acto
//   ecosistema    blanco    dos bloques + una banda de participación
//   coverage      crema     cinco filas anchas
//   cierre        INK       el objeto completo, una sola vez
//
// El acto es el bloque más largo de las tres alternativas y por lejos el más
// caro: sostiene el 40% de la página con una sola pieza. Ese es el riesgo que se
// está poniendo a prueba, y hay que mirarlo con esa pregunta — no si "se ve
// bien", sino si sigue sosteniendo en el beat cinco.
export default function ProtocolLabBView() {
  return (
    <>
      <main>
        <MachineHero />
        <ScaleClaim />
        <Assembly />
        <DevRuntime />
        <Operators />
        <Coverage />
        <MachineClose />
      </main>
      <GridOverlay />
    </>
  );
}
