"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import GlSurface, { hexToRgb } from "@/components/sections/protocol-labs/opening-labs/GlSurface";
import { LATTICE_FRAG } from "@/components/sections/protocol-labs/opening-labs/gl/lattice";
import { GreenCube, IsoFrame, isoAt } from "@/components/sections/protocol-labs/isoKit";
import { AI_SCALE, HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// A · Lattice — la página se apoya sobre la red.
//
// ── La tesis del trío ──────────────────────────────────────────────────────
//
// Las tres secciones son un DESCENSO. El hero flota sobre una retícula
// isométrica en perspectiva que se pierde en la profundidad; las cifras bajan a
// apoyarse sobre esa misma retícula, ya casi al ras; y para cuando llega "Built
// for AI scale" la superficie se agotó y queda el papel limpio. El lector
// aterriza desde la red hasta el texto.
//
// Eso es lo que hace que las tres sean una pieza y no tres secciones seguidas:
// comparten una superficie que se consume. Cortarla en cualquier otro punto —o
// repetirla más abajo— rompe el descenso.
//
// ── Por qué el hero es oscuro ──────────────────────────────────────────────
//
// La retícula sólo existe si hay profundidad, y la profundidad se dibuja con
// luz sobre oscuro: una retícula de líneas oscuras sobre crema no se aleja, se
// aplana. Es la primera vez que esta página abre en negro, y el costo está
// medido — el acto central sigue siendo el bloque oscuro largo, y este hero es
// una entrada, no un tercer acto.
//
// ── El layout es el que ya funciona ───────────────────────────────────────
//
// Titular en las siete columnas de la izquierda, cuerpo y salida en las cuatro
// de la derecha apoyados en su base. Es el del hero actual sin tocar: lo que
// esta alternativa prueba es el ACOMPAÑAMIENTO, no otra composición. Las
// variantes que además mueven el layout son C, D y E.

const INK = "#0a0f0d";

const LATTICE_UNIFORMS = {
  u_bg: hexToRgb(INK),
  u_line: hexToRgb("#2f6d52"),
  u_glow: hexToRgb("#8bf29c"),
  u_scale: 2.6,
  // Bajo a propósito: con el plano muy tumbado la retícula se vuelve una
  // carretera en fuga, que es el cliché que esta superficie evita.
  u_tilt: 1.15,
  // 6% de celdas encendidas. Una retícula donde brilla todo es un tablero.
  u_density: 0.06,
  u_drift: 0.035,
};

export default function OpeningA() {
  const heroNumbers = useCountUp<HTMLDListElement>({ immediate: true, stagger: 0.07 });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        data-nav-dark
        className="relative isolate flex min-h-svh flex-col overflow-hidden pt-[var(--site-header-block)] text-cream"
      >
        <GlSurface
          fragment={LATTICE_FRAG}
          uniforms={LATTICE_UNIFORMS}
          tag="opening-lattice"
          fallback={INK}
          className="absolute inset-0 z-0 h-full w-full"
        />
        {/* Velo sobre la banda del texto. El campo tiene que verse en los bordes
            —es ahí donde la profundidad se lee— así que en vez de bajarle el
            brillo entero se apoya tinta sobre la franja que ocupa la copy. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,15,13,0.92) 0%, rgba(10,15,13,0.55) 45%, rgba(10,15,13,0.15) 75%, rgba(10,15,13,0.85) 100%)",
          }}
        />

        <Container className="relative z-20 grid-ds flex-1 items-center gap-y-10 py-14">
          <div className="col-span-full flex flex-col gap-7 lg:col-span-7">
            <p className="uppercase text-eyebrow-mono text-cream/50">{HERO.eyebrow}</p>
            <h1 className="text-h1 text-balance">
              {HERO.lead}
              <br />
              <Accent display>{HERO.accent}</Accent>
            </h1>
          </div>

          <div className="col-span-full flex flex-col gap-7 lg:col-start-9 lg:col-span-4 lg:self-end lg:pb-2">
            <p className="max-w-[36ch] text-body-lg text-cream/70 text-pretty">{HERO.body}</p>
            <a
              href={HERO.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-q-cta
              data-q-cta-fill-white
              className="relative inline-flex w-fit items-center justify-center rounded-full border border-transparent px-7 py-3 text-center text-label-lg"
            >
              <span className="relative">
                {HERO.cta.label}
                <span data-q-cta-top aria-hidden="true">
                  {HERO.cta.label}
                </span>
              </span>
            </a>
          </div>
        </Container>
      </section>

      {/* ── Números ───────────────────────────────────────────────────────── */}
      {/* La misma superficie, ya al ras: aparece sólo en el tercio superior y se
          desvanece contra el papel. Es el tramo donde el descenso toca tierra. */}
      {/* Borde y no fundido. Sin él, esta sección y el hero comparten color y la
          frontera entre las dos desaparece — que es exactamente lo que un
          degradé de transición hace, sólo que sin degradé. El filete es la
          versión honesta: marca dónde termina una cosa y empieza la otra. */}
      <section
        data-nav-dark
        className="relative isolate overflow-hidden border-t border-cream/20 bg-[#0a0f0d] text-cream"
      >
        <GlSurface
          fragment={LATTICE_FRAG}
          uniforms={LATTICE_UNIFORMS}
          tag="opening-lattice-floor"
          fallback={INK}
          className="absolute inset-0 z-0 h-full w-full"
        />
        {/* Velo de LEGIBILIDAD, no de transición.
            
            Es una capa de tinta plana y no un degradé vertical, y esa es una
            regla del laboratorio: **ninguna sección se funde con la siguiente**.
            Un degradé que termina en el color del bloque de abajo disuelve el
            borde entre dos secciones, y lo que se busca acá es lo contrario —
            que la superficie termine donde termina y que el corte se vea.
            
            Plano tiene además una ventaja concreta sobre el degradé: la
            legibilidad del texto es la misma en la primera línea que en la
            última, en vez de depender de a qué altura de la caja cayó. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[rgba(10,15,13,0.78)]"
        />

        <Container className="relative z-20 py-20 lg:py-24">
          <dl
            ref={heroNumbers}
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
          >
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-2 border-t border-cream/25 pt-4">
                <dd data-count={stat.value} className="text-h2 tabular-nums text-cream">
                  {stat.value}
                </dd>
                <dt className="uppercase text-micro-mono text-cream/50">{stat.label}</dt>
                {stat.note && <dd className="text-micro-mono text-cream/35">{stat.note}</dd>}
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <ScaleSection />
    </>
  );
}

// ── Built for AI scale ──────────────────────────────────────────────────────
//
// El papel limpio, sin superficie: es el final del descenso. Lo único que se
// cambió respecto de la versión actual es el peso de la viñeta —el cubo pasa de
// 20px a un plano isométrico de 56px— porque a tamaño de viñeta la pieza que
// gobierna toda la identidad de la página se leía como un bullet de color.
//
// Se exporta aparte porque las seis aperturas la comparten con variaciones
// mínimas; las que la cambian de verdad la redefinen en su propio archivo.
const iso = isoAt(28, 20);

export function ScaleSection({ tone = "light" }: { tone?: "light" | "cream" }) {
  return (
    <section className={tone === "cream" ? "bg-cream text-foreground" : "bg-background text-foreground"}>
      <Container className="flex flex-col gap-16 py-28 lg:py-36">
        <div className="grid-ds gap-y-8">
          <h2 className="col-span-full text-h2 text-pretty lg:col-span-5">
            {AI_SCALE.title.lead}
            <br />
            <Accent>{AI_SCALE.title.accent}</Accent>
          </h2>
          <p className="col-span-full max-w-[40ch] text-body-lg text-ink-soft text-pretty lg:col-start-7 lg:col-span-5 lg:pt-2">
            {AI_SCALE.body}
          </p>
        </div>

        <ul className="grid gap-10 md:grid-cols-3 md:gap-12">
          {AI_SCALE.points.map((p) => (
            <li key={p.title} className="flex flex-col gap-4 border-t border-ink pt-5">
              <IsoFrame viewBox="0 0 56 40" className="h-10 w-14">
                <GreenCube iso={iso} s={11} />
              </IsoFrame>
              <h3 className="text-h4">{p.title}</h3>
              <p className="max-w-[36ch] text-body text-ink-soft text-pretty">{p.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
