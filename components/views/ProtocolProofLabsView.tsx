import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import P1Hierarchy from "@/components/sections/protocol-labs/proof-labs/P1Hierarchy";
import P2Benchmark from "@/components/sections/protocol-labs/proof-labs/P2Benchmark";
import P3Grouped from "@/components/sections/protocol-labs/proof-labs/P3Grouped";
import P4Ticker from "@/components/sections/protocol-labs/proof-labs/P4Ticker";
import P5Sentence from "@/components/sections/protocol-labs/proof-labs/P5Sentence";
import P6Live from "@/components/sections/protocol-labs/proof-labs/P6Live";
import P7Axis from "@/components/sections/protocol-labs/proof-labs/P7Axis";
import P8Figures from "@/components/sections/protocol-labs/proof-labs/P8Figures";

// Ocho dividers para la juntura hero → contenido — /prototype/protocol-proof
//
// ── Qué contesta esta página y qué no ─────────────────────────────────────
//
// Las ocho apiladas contestan una sola pregunta, y la contestan bien: **qué hace
// cada una con los seis datos**. En dos scrolls se ven las ocho lecturas del
// mismo contenido, sin tener que recordar la anterior.
//
// Lo que NO puede contestar es lo que decide: si el divider cierra el hero y abre
// lo que sigue. Eso sólo se ve entre sus dos vecinos, y para eso está la ruta de
// cada variante — `/prototype/protocol-proof/p1` … `p8`, con el hero real arriba
// y la sección real abajo.
//
// Apiladas, además, cada banda tiene otra banda de vecina, que es lo único que
// nunca va a tener en la página.
//
// ── Las ocho, y qué pregunta hace cada una ────────────────────────────────
//
//   P1 Hierarchy  ¿las seis pesan lo mismo? (no: el uptime gana la discusión)
//   P2 Benchmark  ¿el lector no técnico entiende "1M+ TPS"? (le damos un ancla)
//   P3 Grouped    ¿son seis cosas o tres? (tiempo, tamaño, historial)
//   P4 Ticker     ¿la prueba tiene que leerse, o alcanza con que se vea viva?
//   P5 Sentence   ¿y si en vez de escanearse se leyera?
//   P6 Live       ¿por qué son estáticas si tres se pueden consultar al RPC?
//   P7 Axis       la homepage ya resolvió esto. ¿lo repetimos?
//   P8 Figures    ¿por qué es lo único de la página que no habla en cubos?
//
// El razonamiento largo de cada una está en su archivo, incluida la parte que
// importa: qué arriesga.

const LABELS = [
  ["p1", "Hierarchy", "El uptime manda; las otras cinco lo acompañan en una línea"],
  ["p2", "Benchmark", "Una línea que traduce cada cifra para quien no es de infra"],
  ["p3", "Grouped", "Tres pares con rótulo: Speed, Scale, Record"],
  ["p4", "Ticker", "Una cinta de un renglón, a sangre, desplazándose"],
  ["p5", "Sentence", "Las seis cifras dentro de una oración"],
  ["p6", "Live", "Barra de estado oscura — requiere conectar el RPC"],
  ["p7", "Axis", "Un eje con las seis alternadas: la forma que ya usa la homepage"],
  ["p8", "Figures", "Un micro-diagrama isométrico junto a cada cifra"],
] as const;

const SECTIONS = [
  P1Hierarchy,
  P2Benchmark,
  P3Grouped,
  P4Ticker,
  P5Sentence,
  P6Live,
  P7Axis,
  P8Figures,
];

export default function ProtocolProofLabsView() {
  return (
    <main className="bg-cream">
      <Container className="flex max-w-[70ch] flex-col gap-6 pb-16 pt-[calc(var(--site-header-block)+4rem)] text-foreground">
        <p className="uppercase text-eyebrow-mono text-gray-intermediate">
          Protocol · proof strip
        </p>
        <h1 className="text-h1 text-balance">
          Ocho maneras de <Accent display>probarlo</Accent>
        </h1>
        <p className="text-body-lg text-ink-soft text-pretty">
          Las mismas seis cifras, ocho tratamientos. Cuatro cambian sólo la forma; cuatro cambian
          también qué se dice — agregan una traducción, las agrupan, las meten en una frase o las
          proponen en vivo. Esa copy es una propuesta y no está aprobada: vive aparte, en{" "}
          <code className="text-caption-mono">proofLabsContent.ts</code>, para no mezclarse con la
          transcripción del doc.
        </p>
        <p className="text-body-lg text-ink-soft text-pretty">
          Las ocho cuentan al entrar en viewport. El contador conserva el formato de cada cifra y
          reserva su ancho antes de empezar, así que nada se re-acomoda mientras corre; con{" "}
          <code className="text-caption-mono">prefers-reduced-motion</code> no se crea ninguno y los
          valores salen directos.
        </p>
        <p className="text-body text-gray-intermediate text-pretty">
          Las ocho son <strong>dividers</strong>: van entre el hero y el resto de la página, así que
          miden lo que mide su contenido y llevan una regla arriba y otra abajo — la de arriba
          cierra el hero, la de abajo abre lo que sigue. Ninguna tiene titular; un divider con
          título es una sección.
        </p>
        <p className="text-body text-gray-intermediate text-pretty">
          Acá se ven apiladas para comparar qué hace cada una con los seis datos. Para decidir hay
          que verlas entre sus dos vecinos: cada rótulo de abajo enlaza a su variante con el hero
          real arriba y la sección real debajo.
        </p>
      </Container>

      {SECTIONS.map((Section, i) => {
        const [code, name, note] = LABELS[i];
        return (
          <div key={code}>
            {/* El rótulo va FUERA de la sección y sobre crema: si viviera adentro
                cambiaría el bloque que se está evaluando, y si compartiera fondo
                con él, se leería como parte de su composición. */}
            <Container className="pb-3 pt-16 text-foreground">
              <Link
                href={`/prototype/protocol-proof/${code}`}
                className="flex flex-wrap items-baseline gap-x-5 gap-y-1 underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-green-ink"
              >
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  {code.toUpperCase()}
                </span>
                <span className="text-h4">{name}</span>
                <span className="text-body-sm text-gray-intermediate">{note}</span>
                <span className="uppercase text-micro-mono text-green-ink">ver en contexto →</span>
              </Link>
            </Container>
            <Section />
          </div>
        );
      })}

      <div className="h-24" />
    </main>
  );
}
