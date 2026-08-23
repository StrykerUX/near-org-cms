"use client";

import Image from "next/image";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import Container from "@/components/primitives/Container";
import Marquee from "@/components/primitives/Marquee";
import {
  PROOF_HEADLINE,
  PROOF_STATS,
  GROWTH,
} from "@/components/sections/chain-abstraction-proposals/content";

// Mismos 6 nombres que `ECOSYSTEM.names` en `content.ts`, acá con un logo
// al lado porque el copy de referencia pide un strip de logos y no de
// nombres ("Ecosystem strip (logos + one line)"). No se importa el módulo
// compartido: `ECOSYSTEM.names` es una lista de strings pelada y asume
// otro layout.
//
// ⚠️ CUATRO DE LOS CINCO LOGOS SON PLACEHOLDERS DE OTRAS MARCAS. Los
// reales todavía no existen, así que se toman prestados los PNG que ya usa
// la homepage (`homepageUpdateContent.ts`) solo para ver cómo cae el
// tratamiento con iconos. `ledger.png` es el ÚNICO que corresponde de
// verdad; Abound, Brave, Zodl y Venice están haciendo de HOT Wallet,
// Infinex, SWEAT y Rhea Finance. Hay que cambiarlos cuando lleguen los
// buenos — si no, en dos semanas parece que Brave es Infinex.
//
// ⚠️ HAY UNA COPIA GEMELA de este array en la propuesta B, con el mismo
// carrusel. Se decidió duplicar en vez de compartir, así que cambiar los
// logos acá NO arregla la otra: hay que tocar los dos archivos o una de
// las dos propuestas se queda con Brave haciendo de Infinex.
//
// `logo: null` en la última no es un pendiente: "Every major NEAR wallet"
// no es una empresa y no hay logotipo posible. Mismo caso que Gov. of
// Bermuda en `CUSTOMER_STORIES`, que ya resuelve así esa fila.
const ECOSYSTEM_LOGOS = [
  { name: "Ledger", logo: { src: "/logos/ledger.png", width: 117, height: 39 } },
  { name: "HOT Wallet", logo: { src: "/logos/abound.png", width: 111, height: 24 } },
  { name: "Infinex", logo: { src: "/logos/brave.png", width: 86, height: 24 } },
  { name: "SWEAT", logo: { src: "/logos/zodl.png", width: 133, height: 27 } },
  { name: "Rhea Finance", logo: { src: "/logos/venice.png", width: 89, height: 40 } },
  { name: "Every major NEAR wallet", logo: null },
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

// Pedido explícito: SIEMPRE ascendente, sin irregularidades (la ondulación
// que tenía antes bajaba y subía de a ratos — "irregularidad" es
// literalmente lo que pedía sacar) y con la subida entre $5B/$10B/$20B más
// marcada. `CURVE_EXP > 1` empuja los valores CHICOS más abajo todavía sin
// mover el final (`1^CURVE_EXP` sigue siendo `1`) — el mismo truco que un
// `ease-in`: el tramo de $5B a $10B se ve más chato y el de $10B a $20B más
// empinado, en vez de una recta pareja.
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
        // etiqueta (mayor especificidad que cualquier clase) — el gap
        // pedido ("un poco arribita de la gráfica") se probó subiendo el
        // valor del `calc(...)` varias veces sin ningún cambio visible
        // hasta encontrar esto. Con la entrada limitada a `autoAlpha`,
        // GSAP nunca toca `transform` acá y la clase manda.
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
        <h2 data-proof-headline className="max-w-2xl text-h2 text-pretty">
          {PROOF_HEADLINE}
        </h2>

        {/* Vuelta atrás sobre la ronda pasada: esto no es un "divisor"
            aparte (se saca la regla+kicker "At a glance" y la línea de
            copy que la acompañaba), es parte de la misma sección de
            Proof. Variante propia de esta propuesta, la más despojada de
            las que se probaron: en vez de un grid de 4 bloques grandes,
            una fila compacta tipo ficha — valor y label en línea,
            separados por `divide-x` — más angosta y acorde al minimalismo
            ya establecido acá. `text-h3` (techa en 2.5rem, la escala más
            chica que se probó) en vez de `text-display`/`text-statement`:
            ninguna de las dos bajaba lo suficiente, y en un renglón
            compacto como este un número grande desentona más todavía. */}
        <div
          data-stat-block
          className="flex flex-wrap divide-y divide-rule border-y border-rule sm:divide-x sm:divide-y-0"
        >
          {PROOF_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-1 flex-col gap-1 py-6 first:pl-0 sm:px-6">
              <span data-stat-value className="text-h3 text-pretty">
                {stat.value}
              </span>
              <span data-stat-label className="text-caption-mono uppercase text-gray-intermediate">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Minimalista, pedido explícito: sin card ni marca de agua — solo
            el label "Growth trajectory:" y el gráfico. `data-growth-intro`
            es un bloque normal ARRIBA del gráfico, no absoluto adentro —
            las etiquetas de milestone (`data-growth-label`, más abajo) ya
            usan `absolute top-0` dentro del wrapper del gráfico, así que
            meter el label ahí también lo hubiera superpuesto con la
            primera ($5B, casi pegada al borde izquierdo). `pt-16` en el
            wrapper del gráfico sigue haciendo falta: esas etiquetas de
            milestone necesitan ese aire para no quedar cortadas por el
            borde de arriba del viewport del SVG. */}
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
            {/* Pedido explícito: más cerca del gráfico, para que marquen
                bien el aumento — antes estaban todas ancladas arriba del
                todo (`top-0`) sin importar la altura real de su barra, así
                que la de $5B quedaba lejísimos de su propia barra (bien
                abajo) y solo la de $20B caía cerca. Ahora cada una se
                ancla a la altura de SU punto (`p.y`) y se traslada hacia
                arriba lo justo para no tapar la barra — funciona porque
                esta versión no tiene ondulación (`BARS` es estrictamente
                creciente, ver comentario de `emphasize`), así que ninguna
                barra vecina puede saltar más alto que el punto al que está
                pegada la etiqueta. `pt-16` sigue haciendo falta: la
                etiqueta del punto más alto ($20B) necesita ese aire para
                no quedar cortada por el borde de arriba. */}
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

        {/* El strip corre en loop en vez de quedarse quieto en una fila:
            es el mismo carrusel que monta la propuesta B, por pedido. `Marquee` ya hace
            el ciclo sin salto (doble set + `xPercent: -50`) y se pausa
            fuera del viewport y con `prefers-reduced-motion`, donde cae a
            un scroll horizontal a mano.

            `data-eco` va en el label y en el bloque del carrusel, NO en
            cada celda: adentro del marquee las celdas están duplicadas y
            en movimiento, así que un stagger de entrada por celda pelearía
            con el loop. El tween de entrada mueve `y` sobre este wrapper y
            el marquee mueve `xPercent` sobre un div interno, así que no se
            pisan. */}
        <div data-eco className="flex flex-col gap-6">
          <span className="text-caption-mono uppercase text-gray-intermediate">
            Built into:
          </span>
          <Marquee
            speedSeconds={40}
            itemClassName="mr-16 shrink-0"
            items={ECOSYSTEM_LOGOS.map((item) => (
              <span key={item.name} className="flex flex-col items-center gap-3">
                {item.logo ? (
                  <Image
                    src={item.logo.src}
                    // Decorativa: el nombre va justo debajo en texto, así
                    // que un alt acá lo repetiría para el lector de
                    // pantalla. Mismo criterio que `PressCarousel`.
                    alt=""
                    width={item.logo.width}
                    height={item.logo.height}
                    loading="lazy"
                    draggable={false}
                    // La altura manda y el ancho sigue la proporción
                    // (`w-auto`), para que un logo más ancho no se lea más
                    // grande. Venice va a `h-9` y no a 27px porque ese PNG
                    // trae más aire vertical adentro del archivo: a la
                    // misma altura de caja, la marca se ve más chica. La
                    // excepción es la misma que ya hace `PressCarousel`.
                    // `brightness-0` los aplasta a negro sólido: es lo que
                    // hace que un set de marcas de colores distintos se lea
                    // parejo sobre el cream de esta sección.
                    className={`w-auto brightness-0 ${
                      item.logo.src.includes("venice") ? "h-9" : "h-[27px]"
                    }`}
                  />
                ) : (
                  // Hueco de la misma altura que un logo, para que este
                  // nombre no suba por encima de la línea de los otros
                  // cinco. Que se vea vacío es correcto: no hay logo acá y
                  // no va a haberlo.
                  <span aria-hidden="true" className="block h-[27px]" />
                )}
                <span className="text-caption-mono uppercase text-gray-intermediate">
                  {item.name}
                </span>
              </span>
            ))}
          />
        </div>
      </Container>
    </section>
  );
}
