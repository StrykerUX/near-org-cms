import { GridOverlay } from "@/components/primitives/Grid";
import DatasheetHero from "@/components/sections/protocol-labs/a/DatasheetHero";
import Properties from "@/components/sections/protocol-labs/a/Properties";
import SpecTable from "@/components/sections/protocol-labs/a/SpecTable";
import DeveloperSpec from "@/components/sections/protocol-labs/a/DeveloperSpec";
import Deployment from "@/components/sections/protocol-labs/a/Deployment";
import Appendix from "@/components/sections/protocol-labs/a/Appendix";
import ClosingSpec from "@/components/sections/protocol-labs/a/ClosingSpec";

// Alternativa A · "Datasheet" — /prototype/protocol-a
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// El contenido de esta página ES una hoja de datos: seis cifras, seis
// capacidades, tres propiedades, tres ventajas para el desarrollador. A no lo
// disfraza de narrativa — lo compone como el documento que es, y busca que eso
// se lea como rigor y no como frialdad.
//
// La jerarquía que se desprende: **la evidencia primero**. Las seis cifras
// comparten pantalla con el titular, y todo lo que viene después explica cómo se
// sostienen. Es la lectura del que ya sabe qué es una blockchain y vino a
// verificar si esta aguanta.
//
// ── El ritmo ────────────────────────────────────────────────────────────────
//
//   hero + prueba   crema     el titular y sus seis cifras, juntos
//   propiedades     blanco    tres puntos, sin figura — el aire antes de la tabla
//   tabla           blanco    seis filas abiertas, una figura por fila
//   developers      crema     el editor oscuro contra la sección clara
//   ecosistema      blanco    tres columnas cortas
//   apéndice        crema     cinco referencias numeradas
//   cierre          INK       el único bloque oscuro; repite las seis cifras
//
// Casi toda la página es clara, y eso es deliberado: el contraste no lo lleva el
// fondo sino la densidad. La única inversión llega al final, donde además cierra
// el bucle con el hero.
export default function ProtocolLabAView() {
  return (
    <>
      <main>
        <DatasheetHero />
        <Properties />
        <SpecTable />
        <DeveloperSpec />
        <Deployment />
        <Appendix />
        <ClosingSpec />
      </main>
      <GridOverlay />
    </>
  );
}
