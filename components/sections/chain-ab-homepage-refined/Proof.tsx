"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import Container from "@/components/primitives/Container";
import {
  PROOF_HEADLINE,
  PROOF_STATS,
  GROWTH,
} from "@/components/sections/chain-abstraction-proposals/content";

// Mismos 6 nombres que `ECOSYSTEM.names` en `content.ts`, repetidos acá en
// vez de importados porque este strip los renderiza como pills sueltas
// (`ECOSYSTEM.lead`/`.names` en el módulo compartido asume otro layout).
const ECOSYSTEM_NAMES = [
  "Ledger",
  "HOT Wallet",
  "Infinex",
  "SWEAT",
  "Rhea Finance",
  "Every major NEAR wallet",
] as const;

// ── Los contadores ──────────────────────────────────────────────────────────
// `chain/ProofBand.tsx` (la página real) rechaza a propósito el conteo
// numérico ahí — lo explica en su propio comentario: "<$0.01" no puede
// contar hacia un umbral "menor que", así que un tratamiento de conteo
// cubre 3 de 4 cifras y tiene que hacer una excepción con la cuarta. Acá el
// pedido es explícito ("los contadores no hacen la animación de contar"),
// así que se cuenta lo que SÍ tiene un número limpio al que llegar, y la
// cifra con umbral se queda con un fade simple — la misma excepción que
// hace la página real, aplicada en dirección contraria.
type ParsedStat = { prefix: string; target: number; decimals: number; suffix: string };

function parseStat(value: string): ParsedStat | null {
  const m = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  return {
    prefix,
    target: parseFloat(num),
    decimals: num.includes(".") ? num.split(".")[1].length : 0,
    suffix,
  };
}

// Pedido explícito: "<$0.01" también cuenta — pero al revés, de 1 bajando
// hasta ese número (arrancar en 0 y "subir" a un valor con un "<" delante
// no tendría sentido; arrancar en 1 y bajar sí lo tiene, como una comisión
// que se va achicando). `reverse` marca cuáles arrancan altos y bajan en
// vez de arrancar en 0 y subir.
const STAT_META = PROOF_STATS.map((s) => ({
  ...s,
  reverse: s.value.startsWith("<"),
  parsed: parseStat(s.value),
}));

// ── El gráfico de growth trajectory ──────────────────────────────────────
// Barras verticales de punta redondeada en vez de una línea de 3 puntos —
// mismo espíritu "waveform ascendente" que un gráfico de audio. Las 3
// etiquetas de milestone se ubican sobre su barra más cercana; `POINTS`
// sigue siendo la altura "limpia" (sin la ondulación de las barras) para
// que la etiqueta lea el valor real del milestone, no el ruido decorativo.
const W = 520;
const H = 160;
const PAD_X = 24;
const PAD_Y = 20;

const parseValue = (v: string) => parseFloat(v.replace(/[^0-9.]/g, "")) || 0;
const MAX = Math.max(...GROWTH.milestones.map((m) => parseValue(m.value)));
const MILESTONE_VALUES = GROWTH.milestones.map((m) => parseValue(m.value));
const POINTS = GROWTH.milestones.map((m, i) => ({
  ...m,
  x: PAD_X + (i / (GROWTH.milestones.length - 1)) * (W - PAD_X * 2),
  y: H - PAD_Y - (parseValue(m.value) / MAX) * (H - PAD_Y * 2),
}));

// Interpolación lineal entre los 3 milestones (dos tramos: 0→0.5, 0.5→1) —
// el mismo trazado que ya hace `POINTS`, evaluado en cualquier `t` en vez de
// solo en los 3 puntos fijos.
function valueAt(t: number) {
  const [v0, v1, v2] = MILESTONE_VALUES;
  return t <= 0.5 ? v0 + (v1 - v0) * (t / 0.5) : v1 + (v2 - v1) * ((t - 0.5) / 0.5);
}

const NUM_BARS = 65; // impar: el índice del medio cae exacto en t=0.5
const BAR_MIN_H = 10;
const BAR_STROKE = 4;
// `strokeLinecap="round"` redondea LAS DOS puntas de la línea — la de abajo
// también, así que sin este ajuste el círculo del extremo inferior asoma por
// debajo de la línea base (`H - PAD_Y`), como si la barra se pasara de la
// regla. Achicando el tramo real de la línea en `BAR_STROKE / 2` en el
// extremo de abajo, el redondeo de esa punta termina justo EN la base en vez
// de sobrepasarla.
const BAR_BASE_Y = H - PAD_Y - BAR_STROKE / 2;
// Ondulación determinística (mismo truco que el jitter de `Hero.tsx`
// `FIELD`: senos de distinta frecuencia sumados, nunca `Math.random()` a
// nivel de módulo — esto se renderiza en el server, así que tiene que dar
// el mismo resultado en cliente o React marca mismatch de hidratación).
const BARS = Array.from({ length: NUM_BARS }, (_, i) => {
  const t = i / (NUM_BARS - 1);
  const clean = valueAt(t) / MAX; // 0..1
  const wobble = (Math.sin(i * 12.9898) * 0.5 + Math.sin(i * 3.7 + 1) * 0.3) * 0.09;
  const frac = Math.min(1, Math.max(0.05, clean + wobble));
  const x = PAD_X + t * (W - PAD_X * 2);
  const topY = Math.min(H - PAD_Y - BAR_MIN_H, H - PAD_Y - frac * (H - PAD_Y * 2));
  return { x, topY };
});

export default function Proof() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      const headline = q("[data-proof-headline]");
      const values = q("[data-stat-value]");
      const labels = q("[data-stat-label]");
      const growthIntro = q("[data-growth-intro]");
      const eco = q("[data-eco]");

      if (!motionOk) {
        gsap.set([headline, values, labels, growthIntro, eco], { clearProps: "all" });
        return;
      }

      gsap.from(headline, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: EASE_OUT,
        scrollTrigger: { trigger: headline[0], start: "top 85%", once: true },
      });

      // El número cuenta hasta su valor real mientras entra y la etiqueta
      // llega al final. El tramo de reglas (`[data-stat-rule]`, `scaleX`)
      // se fue junto con el grid de hairlines: las fichas con marco no
      // tienen una línea que dibujar, así que las cifras ya no arrancan
      // con el offset de 0.2 que las esperaba.
      const stats = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: q("[data-stat-block]")[0], start: "top 85%", once: true },
      });

      STAT_META.forEach((meta, i) => {
        const el = values[i];
        const at = i * 0.13;
        stats.from(el, { autoAlpha: 0, y: 20, duration: 0.5 }, at);

        if (meta.parsed) {
          const { prefix, target, decimals, suffix } = meta.parsed;
          // Arranca en 0 (o en 1 si es `reverse`, ej. "<$0.01" bajando
          // desde "<$1.00") DE VERDAD, no solo en el objeto que anima: sin
          // esto el texto se queda en su valor final (el que ya trae el
          // JSX) hasta que el tween arranca, así que el conteo pasaba
          // inadvertido. Este `set` corre apenas monta el efecto (antes de
          // que el ScrollTrigger dispare nada), así que es lo primero que
          // ve el lector si hay JS.
          const counter = { n: meta.reverse ? 1 : 0 };
          el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
          stats.to(
            counter,
            {
              n: target,
              duration: 2.1,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
              },
            },
            at
          );
        }
      });

      stats.from(labels, { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.13 }, 0.55);

      gsap.from(growthIntro, {
        autoAlpha: 0,
        y: 16,
        duration: 0.6,
        ease: EASE_OUT,
        scrollTrigger: { trigger: q("[data-growth-block]")[0], start: "top 85%", once: true },
      });

      const growth = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: q("[data-growth-block]")[0], start: "top 85%", once: true },
      });
      growth
        .from(
          q("[data-growth-bar]"),
          { scaleY: 0, transformOrigin: "50% 100%", duration: 0.8, stagger: { amount: 0.6, from: "start" } },
          0
        )
        .from(q("[data-growth-label]"), { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.34 }, 0.5);

      gsap.from(eco, {
        autoAlpha: 0,
        y: 14,
        duration: 0.5,
        stagger: 0.05,
        scrollTrigger: { trigger: eco[0], start: "top 92%", once: true },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-cream py-20 lg:py-28">
      <Container className="flex flex-col gap-16">
        <h2 data-proof-headline className="max-w-2xl text-h2 text-pretty">
          {PROOF_HEADLINE}
        </h2>

        {/* Esto no es un "divisor" aparte, es parte de la misma sección de
            Proof (headline → stats → growth → ecosystem, tal cual el
            copy): vive adentro del mismo `Container`, sin banda invertida
            de borde a borde. El tratamiento es el que venía de la copia 2
            — 4 FICHAS con marco (`rounded-2xl border`) y contenido
            centrado, en vez del grid de columnas separadas por un hairline
            que tenía antes. `text-h2` (techa en 3.75rem) en vez de
            `text-display`/`text-statement`: ninguna de las dos bajaba lo
            suficiente — se ven grandes hasta con la escala completa de
            por medio. `text-h2` ya se lee como fila de stats, no como un
            segundo hero. */}
        <div data-stat-block className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PROOF_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-rule bg-card-tint/40 p-6 text-center"
            >
              <span data-stat-value className="text-h2 text-pretty">
                {stat.value}
              </span>
              <span data-stat-label className="max-w-[16ch] text-caption-mono uppercase text-gray-intermediate">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* `pt-16` extra en el wrapper de abajo: las etiquetas de los puntos
            se corren hacia arriba con `-translate-y` para no tapar la
            línea, y sin ese aire la del último punto (el más alto) quedaba
            recortada por el `overflow-hidden` de esta card.
            La marca de agua usa `text-display` (techa en 8rem) y no
            `text-kicker-xl` (hasta 13rem, escala con el viewport) — en un
            contenedor ancho esa escala se pasaba del borde derecho de la
            card y el `overflow-hidden` (necesario para el radio) se comía
            la cola de la palabra. `whitespace-nowrap` de más, por las
            dudas. */}
        <div className="relative overflow-hidden rounded-3xl bg-card-tint/50 p-10 lg:p-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-4 select-none whitespace-nowrap text-display text-foreground/[0.06]"
          >
            GROWTH
          </span>
          <div data-growth-block className="relative flex flex-col gap-8">
            <span data-growth-intro className="text-caption-mono uppercase text-gray-intermediate">
              {GROWTH.label}
            </span>
            <div className="relative w-full pt-16">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" aria-hidden="true">
                <defs>
                  {/* `gradientUnits="userSpaceOnUse"` a propósito: cada barra es
                      un `<line>` perfectamente vertical (x1===x2), o sea un
                      bounding box de ancho 0 — con el default
                      (`objectBoundingBox`) el gradiente queda indefinido sobre
                      ESE bbox y no pinta nada. En coordenadas absolutas del
                      viewBox (0..H) sí tiene un alto real del que tirar. */}
                  <linearGradient id="growth-bar-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={H}>
                    <stop offset="0%" stopColor="var(--near-green)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--near-green)" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <line
                  x1="0"
                  y1={H - PAD_Y}
                  x2={W}
                  y2={H - PAD_Y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-rule"
                />
                {BARS.map((b, i) => (
                  <line
                    key={i}
                    data-growth-bar
                    x1={b.x}
                    y1={BAR_BASE_Y}
                    x2={b.x}
                    y2={b.topY}
                    stroke="url(#growth-bar-gradient)"
                    strokeWidth={BAR_STROKE}
                    strokeLinecap="round"
                  />
                ))}
              </svg>
              {/* Ancladas arriba del todo (`top-0` de este wrapper, el
                  `pt-16` de más arriba es justo el aire reservado para esta
                  fila) y NO a la altura de su barra: esa altura es la
                  "limpia" (`POINTS.y`, sin la ondulación de `BARS`), así que
                  una barra vecina más alta por el ruido decorativo podía
                  terminar pasándole por encima al texto. Ancladas arriba,
                  jamás se cruzan con ninguna barra sin importar cuánto suba
                  el ruido. */}
              {POINTS.map((p) => (
                <div
                  key={p.date}
                  data-growth-label
                  className="absolute top-0 -translate-x-1/2 text-center"
                  style={{ left: `${(p.x / W) * 100}%` }}
                >
                  <p className="text-h3">{p.value}</p>
                  <p className="text-caption-mono text-gray-intermediate">{p.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span data-eco className="text-caption-mono uppercase text-gray-intermediate">
            Built into:
          </span>
          {ECOSYSTEM_NAMES.map((name) => (
            <span
              key={name}
              data-eco
              className="rounded-full border border-rule px-4 py-1.5 text-caption-mono text-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
