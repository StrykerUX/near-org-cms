"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { PROOF_STATS, GROWTH } from "@/components/sections/chain-abstraction-proposals/content";

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
// Traído de la copia 4 (pedido explícito): barras verticales de punta
// redondeada, con el mismo espíritu "waveform ascendente" que un gráfico
// de audio. Reemplaza al stepper de 3 hitos con flechas que vivía acá —
// las etiquetas del gráfico ya marcan esos mismos tres milestones, así
// que tener los dos repetía el dato. `POINTS` es la altura "limpia" del
// milestone, la misma que usan las barras.
const W = 520;
const H = 160;
// Más ancho que el 24 de la copia 4 a propósito: las etiquetas de hito se
// centran sobre su punto (`-translate-x-1/2`), y el primero y el último
// caen justo en `PAD_X` y `W - PAD_X`. Con 24 eso es 4.6% y 95.4%, así que
// media etiqueta quedaba afuera del área dibujada — medido en vivo, el
// "$5B" arrancaba en el píxel 0 de la columna y el "$20B" terminaba en el
// último. Con 56 los extremos pasan a 10.8% y 89.2% y cada etiqueta tiene
// su media caja de aire de los dos lados. La línea base no usa `PAD_X`
// (`x1="0"`/`x2={W}`), así que sigue de borde a borde y ahora enmarca al
// waveform en vez de terminar con él.
const PAD_X = 56;
const PAD_Y = 20;

const parseValue = (v: string) => parseFloat(v.replace(/[^0-9.]/g, "")) || 0;
const MAX = Math.max(...GROWTH.milestones.map((m) => parseValue(m.value)));
const MILESTONE_VALUES = GROWTH.milestones.map((m) => parseValue(m.value));

// SIEMPRE ascendente, sin irregularidades, y con la subida entre
// $5B/$10B/$20B más marcada. `CURVE_EXP > 1` empuja los valores CHICOS más
// abajo todavía sin mover el final (`1^CURVE_EXP` sigue siendo `1`) — el
// mismo truco que un `ease-in`: el tramo de $5B a $10B se ve más chato y
// el de $10B a $20B más empinado, en vez de una recta pareja.
const CURVE_EXP = 1.6;
const emphasize = (frac: number) => Math.pow(frac, CURVE_EXP);

const POINTS = GROWTH.milestones.map((m, i) => {
  const frac = emphasize(parseValue(m.value) / MAX);
  return {
    ...m,
    x: PAD_X + (i / (GROWTH.milestones.length - 1)) * (W - PAD_X * 2),
    y: H - PAD_Y - frac * (H - PAD_Y * 2),
  };
});

// Interpolación lineal entre los 3 milestones (dos tramos: 0→0.5, 0.5→1) —
// el mismo trazado que ya hace `POINTS`, evaluado en cualquier `t` en vez de
// solo en los 3 puntos fijos. Estrictamente creciente (cada milestone es
// mayor que el anterior), así que esto también lo es — ninguna barra puede
// quedar más baja que la anterior.
function valueAt(t: number) {
  const [v0, v1, v2] = MILESTONE_VALUES;
  return t <= 0.5 ? v0 + (v1 - v0) * (t / 0.5) : v1 + (v2 - v1) * ((t - 0.5) / 0.5);
}

const NUM_BARS = 65; // impar: el índice del medio cae exacto en t=0.5
const BAR_STROKE = 4;
// `strokeLinecap="round"` redondea LAS DOS puntas de la línea — la de abajo
// también, así que sin este ajuste el círculo del extremo inferior asoma por
// debajo de la línea base (`H - PAD_Y`), como si la barra se pasara de la
// regla. Achicando el tramo real de la línea en `BAR_STROKE / 2` en el
// extremo de abajo, el redondeo de esa punta termina justo EN la base en vez
// de sobrepasarla.
const BAR_BASE_Y = H - PAD_Y - BAR_STROKE / 2;
// Sin ondulación: cada barra es `valueAt(t)` puro (más la misma curva de
// énfasis que las etiquetas, para que la altura de la barra y la del
// milestone coincidan) — nada de `Math.sin` sumado encima. `valueAt` es
// monótona creciente, así que la sucesión de barras también.
const BARS = Array.from({ length: NUM_BARS }, (_, i) => {
  const t = i / (NUM_BARS - 1);
  const frac = emphasize(valueAt(t) / MAX);
  const x = PAD_X + t * (W - PAD_X * 2);
  const topY = H - PAD_Y - frac * (H - PAD_Y * 2);
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
      const eco = q("[data-eco]");

      if (!motionOk) {
        gsap.set([headline, values, labels, eco], { clearProps: "all" });
        return;
      }

      gsap.from(headline, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: EASE_OUT,
        scrollTrigger: { trigger: headline[0], start: "top 85%", once: true },
      });

      // La regla se dibuja, el número cuenta hasta su valor real mientras
      // entra, la etiqueta llega al final — mismo ritmo que tenía el
      // mask-reveal que reemplaza, solo que la cifra ahora es un conteo de
      // verdad y no una línea que sube ya completa.
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

      const growth = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: q("[data-growth-block]")[0], start: "top 85%", once: true },
      });
      growth
        .from(q("[data-growth-intro]"), { autoAlpha: 0, y: 10, duration: 0.5 }, 0)
        .from(
          q("[data-growth-bar]"),
          { scaleY: 0, transformOrigin: "50% 100%", duration: 0.8, stagger: { amount: 0.6, from: "start" } },
          0.15
        )
        // Sin `y` acá a propósito: GSAP escribe un `transform` inline al
        // asentarse (incluso en `y:8`→`0`), y ese inline pisa SIEMPRE la
        // clase `-translate-x-1/2 -translate-y-[...]` que posiciona la
        // etiqueta (mayor especificidad que cualquier clase), así que las
        // etiquetas terminaban encima de las barras y subir el `calc(...)`
        // no cambiaba nada. Con la entrada limitada a `autoAlpha`, GSAP
        // nunca toca `transform` acá y la clase manda.
        .from(q("[data-growth-label]"), { autoAlpha: 0, duration: 0.4, stagger: 0.34 }, 0.5);

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
        {/* Mismo tratamiento que la copia 2. El salto después de "for" es
            a mano: la partición natural caía por el guión de "cross-chain"
            ("Already the rails for cross-" / "chain value"), que parte la
            palabra al medio y se lee mal. El `<br />` va oculto abajo de
            `sm` para que en teléfono envuelva solo — mismo idiom que
            `components/views/BlogIndexView.tsx`; el `{" "}` no es
            decorativo, es el separador que queda cuando el `<br />` está
            oculto. El texto vive acá y no en `content.ts` por lo que
            explica `components/sections/README.md`: un titular con
            `<br />` y `<Accent>` no entra en un string plano, y
            `PROOF_HEADLINE` lo comparten las cuatro copias.

            `<Accent>` es el tratamiento del sitio para acentuar un tramo
            de un heading sans — Kepler itálica, con la corrección óptica
            de x-height contra Montreal ya resuelta en sus tokens (no
            compensar a mano acá). Va la variante pelada y no `display`:
            esa es para acentos dentro de `text-display`/`h1`, y este
            titular es `text-h2`. */}
        <h2 data-proof-headline className="max-w-2xl text-h2 text-pretty">
          Already the rails for
          <br className="hidden sm:block" />{" "}
          <Accent>cross-chain value</Accent>
        </h2>

        {/* Contadores a la izquierda y gráfico a la derecha, en una fila
            de dos columnas: la lista ocupaba el ancho completo y dejaba
            media sección vacía a su derecha, que es justo donde ahora
            entra el gráfico. Las columnas NO son iguales: el renglón más
            largo de los contadores ("$20B+ — all-time cross-chain
            volume") no necesita la mitad del ancho, así que esa columna
            cede y el gráfico arranca más a la izquierda.

            `minmax(0,…)` y no `0.85fr` a secas: el mínimo automático de
            una pista de grid es su contenido, y el SVG con
            `overflow-visible` puede empujar la pista más allá de su
            fracción si no se le fija piso en 0. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
          {/* Variante propia de esta copia: en vez de un grid de bloques,
              una LISTA — cada stat es un renglón donde el número y el
              label comparten línea de base ("$20B+ — All-time cross-chain
              volume"), apilados los 4 — más editorial/documento que panel
              de métricas. Sin ninguna regla (pedido explícito): antes
              llevaba `divide-y` entre renglones y `border-y` arriba y
              abajo; ahora la separación la da sola el `gap`, y por eso
              cada renglón tampoco necesita ya su `py-5`. `text-h3` (techa
              en 2.5rem, la más chica de las 4 propuestas): en un renglón
              de lectura como este, un número grande no calza — tiene que
              pesar como una palabra más de la frase, no como un
              titular. */}
          <div data-stat-block className="flex flex-col gap-6">
            {PROOF_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span data-stat-value className="text-h3 text-pretty">
                  {stat.value}
                </span>
                <span data-stat-label className="text-body text-gray-intermediate text-pretty">
                  — {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* El gráfico de barras traído de la copia 4, sin card ni marca
              de agua — solo el label y las barras. `data-growth-intro` va
              ARRIBA del gráfico como bloque normal, no absoluto adentro:
              las etiquetas de milestone ya ocupan el tope del wrapper y
              se le superpondrían. `pt-16` es justo ese aire reservado
              para ellas. */}
          <div className="flex flex-col gap-4">
            <span data-growth-intro className="text-caption-mono uppercase text-gray-intermediate">
              {GROWTH.label}:
            </span>
            <div data-growth-block className="relative w-full pt-16">
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
              {/* Cada etiqueta se ancla a la altura de SU punto (`p.y`) y
                  se traslada hacia arriba lo justo para no tapar la barra
                  — así marca el aumento en vez de quedar todas pegadas
                  arriba del todo sin importar la altura real. Funciona
                  porque `BARS` es estrictamente creciente (ver
                  `emphasize`), así que ninguna barra vecina puede saltar
                  más alto que el punto al que está pegada la etiqueta. */}
              {POINTS.map((p) => (
                <div
                  key={p.date}
                  data-growth-label
                  className="absolute -translate-x-1/2 -translate-y-[calc(100%_+_28px)] text-center"
                  style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
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
