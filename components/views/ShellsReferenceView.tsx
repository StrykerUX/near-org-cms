import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import ActRail from "@/components/sections/shells/instrument/ActRail";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Surface from "@/components/sections/shells/stage/Surface";
import StageCard from "@/components/sections/shells/stage/Card";
import StageSection from "@/components/sections/shells/stage/Section";

// La referencia de los dos armazones, con las piezas sueltas.
//
// No es una página de diseño ni una propuesta: es el banco de pruebas. Cuando
// una de las ocho variantes B/C se ve rara, acá se mira la pieza sola y se sabe
// enseguida si el problema es del armazón o de cómo esa página lo montó — que es
// una pregunta cara de contestar mirando ocho páginas terminadas.
//
// Vive por el mismo motivo que `/prototype/components`, y se borra el día que
// los armazones dejen de moverse.

const ACTS = [
  { id: "one", label: "Primer acto" },
  { id: "two", label: "Segundo acto" },
  { id: "three", label: "Tercer acto" },
  { id: "four", label: "Cuarto acto" },
] as const;

/** Un dibujo cualquiera, solo para que las cajas tengan algo adentro. */
function SampleArt({ tone = "light" }: { tone?: "light" | "dark" }) {
  const stroke = tone === "dark" ? "rgba(245,244,241,0.55)" : "currentColor";
  return (
    <svg viewBox="0 0 200 120" className="w-full" fill="none" aria-hidden="true">
      <path d="M10 92 L60 40 L100 70 L140 26 L190 60" stroke={stroke} strokeWidth="1" />
      <circle cx="60" cy="40" r="3" fill={stroke} />
      <circle cx="140" cy="26" r="3" fill={stroke} />
      <path d="M10 108 H190" stroke={stroke} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export default function ShellsReferenceView() {
  return (
    <main className="flex flex-col">
      {/* ── el suelo con shader, a pantalla ─────────────────────────────── */}
      <Surface
        palette={{ bg: "#eceae4", high: "#bfe7cf", line: "#5f7f6d" }}
        bands={9}
        scale={2.1}
        tilt={0.5}
        className="flex min-h-svh items-end pb-[10svh] pt-[calc(var(--site-header-block)+6svh)]"
      >
        <Container>
          <Eyebrow className="text-ink-soft">Shells</Eyebrow>
          <h1 className="mt-6 max-w-[14ch] text-display text-ink text-balance">
            Instrumento y escenario
          </h1>
          <p className="mt-8 max-w-[46ch] text-body-lg text-ink-soft text-pretty">
            Las piezas que comparten las variantes B y C de las cuatro páginas. El
            arte de cada página es propio; esto es lo que las hace parecer del
            mismo sitio.
          </p>
        </Container>
      </Surface>

      {/* ── escenario ───────────────────────────────────────────────────── */}
      <StageSection
        eyebrow="Escenario"
        title="Card"
        intro="Una caja de arte sobre una caja de texto. La de afuera agrupa; la de adentro es el papel del dibujo."
        tone="tint"
      >
        <div className="grid-ds gap-y-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="col-span-12 md:col-span-6 lg:col-span-4">
              <StageCard
                art={<SampleArt />}
                title={`Unidad ${i + 1}`}
                body="El cuerpo de la card, en la medida en que va a caer en una retícula de tres columnas."
                href={i === 0 ? "/prototype/shells" : undefined}
                linkLabel={i === 0 ? "Un enlace" : undefined}
                accent={i === 2}
              />
            </div>
          ))}
        </div>
      </StageSection>

      {/* ── instrumento ─────────────────────────────────────────────────── */}
      <InstrumentSection
        eyebrow="Instrumento"
        title="Panel"
        intro="El escenario oscuro con borde: lo que convierte al contenido en un objeto que se mira, en vez de una superficie que se atraviesa leyendo."
      >
        <Panel
          label="Panel · referencia"
          meta="Estado: en línea"
          grid
          footer={<ActRail acts={ACTS} active={1} />}
        >
          <div className="grid-ds items-center gap-y-10 px-5 pb-10 pt-20 lg:px-7 lg:pb-14 lg:pt-24">
            <div className="col-span-12 lg:col-span-6">
              <div className="mx-auto max-w-md">
                <SampleArt tone="dark" />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5 lg:col-start-8">
              <Readout value="1M+" label="Una lectura encendida" accent size="lg" />
              <div className="mt-10 grid grid-cols-2 gap-8">
                <Readout value="0.2s" label="Finalidad" note="Contexto, no argumento" />
                <Readout value="100%" label="Uptime" />
              </div>
            </div>
          </div>
        </Panel>
      </InstrumentSection>
    </main>
  );
}
