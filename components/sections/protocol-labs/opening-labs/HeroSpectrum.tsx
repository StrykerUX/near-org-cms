"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import GlSurface, { hexToRgb } from "@/components/sections/protocol-labs/opening-labs/GlSurface";
import { SPECTRUM_FRAG } from "@/components/sections/protocol-labs/opening-labs/gl/spectrum";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// El hero de C · Spectrum, suelto.
//
// Salió de dentro de `OpeningC` cuando `combo-labs/` necesitó montarlo con otras
// secciones 2 y 3. Es la misma pieza, no una copia: `OpeningC` lo importa desde
// acá, así que las dos rutas que lo muestran no pueden divergir.
//
// ── El layout es propio de esta superficie ────────────────────────────────
//
// El titular baja al tercio inferior y se alinea a la izquierda, contra el borde
// del contenedor. La mitad superior queda para el espectro. Un titular centrado
// en medio de bandas verticales las corta por la mitad; abajo, las deja correr
// enteras y el texto se apoya sobre ellas como sobre un pie.

// ── Los dos tonos ──────────────────────────────────────────────────────────
//
// El shader es EL MISMO; lo único que cambia son sus tres colores y el velo.
// Está escrito así desde el principio —`u_bg`, `u_low` y `u_high` son uniformes,
// no constantes del GLSL— justamente para que una versión clara no obligue a
// escribir un segundo shader.
//
// La calibración clara no es la oscura con otros valores, y el motivo es
// perceptivo: en oscuro las columnas se ven porque EMITEN —son más claras que el
// fondo— y en claro tienen que verse porque **restan**: son más oscuras que el
// crema. Invertir sólo los colores sin invertir esa relación deja las columnas
// más claras que un fondo ya claro, o sea invisibles.
//
// El verde también cambia de rol. En oscuro `#8bf29c` funciona en todo el rango.
// Sobre crema ese verde desaparece, así que el nivel alto va a un verde medio
// con suficiente cuerpo para leerse como columna sin competir con el titular.
type ToneCfg = {
  ink: string;
  uniforms: Record<string, number | number[]>;
  veil: string;
  eyebrow: string;
  body: string;
  cta: "solid" | "filled";
  navDark: boolean;
  text: string;
};

// Doce columnas: las mismas que gobiernan la página. Es el número que hace que
// la superficie y la retícula sean lo mismo.
const COLUMNS = 12;


const TONES: Record<"dark" | "light", ToneCfg> = {
  dark: {
    ink: "#070b09",
    uniforms: {
      u_bg: hexToRgb("#070b09"),
      u_low: hexToRgb("#123626"),
      u_high: hexToRgb("#8bf29c"),
      u_columns: COLUMNS,
      u_speed: 0.35,
      u_soft: 0.55,
    },
    // El pie de tinta que sostiene la copy. Sube desde abajo y deja las bandas
    // enteras en los dos tercios superiores, que es donde tienen que verse
    // correr.
    veil:
      "linear-gradient(to bottom, rgba(7,11,9,0.25) 0%, rgba(7,11,9,0.1) 34%, rgba(7,11,9,0.82) 62%, rgba(7,11,9,0.97) 100%)",
    eyebrow: "text-cream/50",
    body: "text-cream/70",
    cta: "solid",
    navDark: true,
    text: "text-cream",
  },
  light: {
    ink: "#f5f4f1",
    uniforms: {
      u_bg: hexToRgb("#f5f4f1"),
      // Apenas por debajo del crema: la columna apagada es una sombra, no un
      // hueco. Si baja más, el campo en reposo se lee como suciedad.
      u_low: hexToRgb("#e6e4dd"),
      // Verde medio. `--near-green-accent` no llega a 3:1 sobre crema y a esta
      // superficie la dejaría lavada; éste tiene cuerpo suficiente para leerse
      // como columna sin pelearle al titular.
      u_high: hexToRgb("#8ecfae"),
      u_columns: COLUMNS,
      u_speed: 0.35,
      // Bordes más blandos que en oscuro: sobre claro el filete entre columnas
      // se marca más de lo que la misma cifra sugiere, y a 0.55 la superficie
      // pasa a leerse como un gráfico de barras.
      u_soft: 0.72,
    },
    veil:
      "linear-gradient(to bottom, rgba(245,244,241,0.2) 0%, rgba(245,244,241,0.08) 34%, rgba(245,244,241,0.8) 62%, rgba(245,244,241,0.96) 100%)",
    eyebrow: "text-gray-intermediate",
    body: "text-ink-soft",
    // `filled` y no `solid`: la píldora blanca de las versiones oscuras
    // desaparece sobre crema.
    cta: "filled",
    navDark: false,
    text: "text-foreground",
  },
};

// ── El slot `footer` ───────────────────────────────────────────────────────
//
// Un hueco al pie del hero, dentro de su superficie. Existe para el asomo de las
// seis cifras (`combo-labs/ProofPeek`), y va como slot en vez de importarse
// directamente por dos motivos:
//
//   · `opening-labs/` no debería depender de `combo-labs/`. La dependencia
//     natural va al revés — los combos consumen los heroes—, y al invertirla
//     aunque sea una vez, borrar un laboratorio rompe el otro. Ya pasó con
//     `ScaleSection` dentro de `OpeningA`.
//   · Las rutas de `/prototype/protocol-opening/c` y `/prototype/protocol-combo/c`
//     montan este mismo hero SIN nada al pie, y tienen que seguir viéndose
//     exactamente igual. Sin la prop no hay nodo, no hay altura extra, no hay
//     costo.
//
// `peek` es cuánto del footer queda por debajo del fold: el hero pasa a medir
// `100svh + peek`. El valor lo decide quien monta el footer, porque depende de
// lo que ese footer mida — `ProofPeek` lo exporta como `PROOF_PEEK`.
export default function HeroSpectrum({
  tone = "dark",
  footer,
  peek,
}: {
  tone?: "dark" | "light";
  footer?: React.ReactNode;
  peek?: string;
} = {}) {
  const cfg = TONES[tone];

  return (
    <section
      data-nav-dark={cfg.navDark || undefined}
      style={footer && peek ? { minHeight: `calc(100svh + ${peek})` } : undefined}
      className={`relative isolate flex min-h-svh flex-col justify-end overflow-hidden pt-[var(--site-header-block)] ${cfg.text}`}
    >
      <GlSurface
        fragment={SPECTRUM_FRAG}
        uniforms={cfg.uniforms}
        tag={`opening-spectrum-${tone}`}
        fallback={cfg.ink}
        className="absolute inset-0 z-0 h-full w-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: cfg.veil }}
      />

      {/* Con footer el `pb` baja: el aire que separaba la copy del borde de la
          pantalla ahora lo ocupa la fila de cifras, y mantenerlo entero empujaría
          el asomo fuera de su medida. */}
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
