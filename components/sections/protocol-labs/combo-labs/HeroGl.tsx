"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import GlSurface from "@/components/sections/protocol-labs/opening-labs/GlSurface";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// El hero de C con la superficie inyectada.
//
// ── Por qué existe además de `HeroSpectrum` ───────────────────────────────
//
// `HeroSpectrum` trae su shader soldado: es el hero DE Spectrum, y las rutas de
// `/prototype/protocol-opening/c` y `/prototype/protocol-combo/c` dependen de
// que siga siendo exactamente eso. Este toma la misma composición —titular
// abajo a la izquierda, cuerpo y salida a la derecha, la superficie corriendo
// entera detrás— y deja el shader como parámetro.
//
// La alternativa era meterle a `HeroSpectrum` una prop de fragmento y otra de
// uniformes, y ahí deja de ser el hero de Spectrum para pasar a ser un hero
// genérico con un nombre que miente. Un componente que se llama por su
// superficie no puede recibir la superficie desde afuera.
//
// ── El layout es el de Spectrum y no otro ─────────────────────────────────
//
// A propósito: lo que estas variantes ponen a prueba es la SUPERFICIE, y para
// eso el resto tiene que ser idéntico. El titular baja al tercio inferior y se
// alinea a la izquierda; la mitad superior queda entera para el fondo. Un
// titular centrado parte cualquier superficie por la mitad; abajo, la deja
// correr y el texto se apoya sobre ella como sobre un pie.
//
// ── El slot `footer` y el asomo ───────────────────────────────────────────
//
// Igual que en `HeroSpectrum`: un hueco al pie, dentro de la superficie, para
// las seis cifras cortadas por el borde de la pantalla (`ProofPeek`). `peek` es
// cuánto queda por debajo del fold, y el hero pasa a medir `100svh + peek`. Sin
// footer no hay nodo ni altura extra.

export type HeroGlProps = {
  fragment: string;
  uniforms: Record<string, number | number[]>;
  /** Etiqueta para los mensajes de compilación del shader. Una por superficie. */
  tag: string;
  /** Color sólido si no hay WebGL2 utilizable. Nunca un agujero transparente. */
  fallback: string;
  tone?: "dark" | "light";
  /** Velo de legibilidad sobre la superficie. CSS de `background`. */
  veil?: string;
  footer?: React.ReactNode;
  peek?: string;
};

const TONES = {
  dark: {
    text: "text-cream",
    eyebrow: "text-cream/50",
    body: "text-cream/70",
    cta: "solid" as const,
  },
  light: {
    text: "text-foreground",
    eyebrow: "text-gray-intermediate",
    body: "text-ink-soft",
    // `filled` y no `solid`: la píldora blanca de las versiones oscuras
    // desaparece sobre crema.
    cta: "filled" as const,
  },
};

export default function HeroGl({
  fragment,
  uniforms,
  tag,
  fallback,
  tone = "light",
  veil,
  footer,
  peek,
}: HeroGlProps) {
  const cfg = TONES[tone];

  return (
    <section
      data-nav-dark={tone === "dark" || undefined}
      style={footer && peek ? { minHeight: `calc(100svh + ${peek})` } : undefined}
      className={`relative isolate flex min-h-svh flex-col justify-end overflow-hidden pt-[var(--site-header-block)] ${cfg.text}`}
    >
      <GlSurface
        fragment={fragment}
        uniforms={uniforms}
        tag={tag}
        fallback={fallback}
        className="absolute inset-0 z-0 h-full w-full"
      />

      {/* Velo de LEGIBILIDAD, no de transición. No termina en el color de la
          sección de abajo: un degradé así disuelve el borde entre dos secciones,
          y la regla del laboratorio es que el corte se vea. Es opcional porque
          una superficie suficientemente apagada no lo necesita, y un velo que no
          hace falta sólo apaga el fondo dos veces. */}
      {veil && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: veil }}
        />
      )}

      <Container
        className={`relative z-20 grid-ds items-end gap-y-8 ${footer ? "pb-10" : "pb-16"}`}
      >
        <div className="col-span-full flex flex-col gap-6 lg:col-span-7">
          <p className={`uppercase text-eyebrow-mono ${cfg.eyebrow}`}>{HERO.eyebrow}</p>
          <h1 className="text-h1 text-balance">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
        </div>
        <div className="col-span-full flex flex-col gap-6 lg:col-start-9 lg:col-span-4">
          <p className={`max-w-[36ch] text-body-lg ${cfg.body} text-pretty`}>{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone={cfg.cta} external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>

      {footer}
    </section>
  );
}
