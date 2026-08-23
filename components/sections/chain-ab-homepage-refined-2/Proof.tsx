"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { PROOF_STATS } from "@/components/sections/chain-abstraction-proposals/content";

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

// Sin gráfico de growth en esta versión (pedido explícito): la línea de 3
// puntos que vivía acá se sacó entera, con sus constantes de geometría. La
// sección queda en titular + contadores + ecosystem. La gráfica de barras
// sigue viva en la copia 3 y en la 4.

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
        {/* Titular y contadores en una misma fila de dos columnas, no
            apilados: el titular ocupaba el ancho completo con `max-w-2xl`
            y dejaba media sección vacía a su derecha, que es justo donde
            ahora van los contadores. La columna ya limita el ancho, así
            que el `max-w-2xl` sale.

            El salto después de "for" es a mano: la partición natural caía
            por el guión de "cross-chain" ("Already the rails for cross-" /
            "chain value"), que parte la palabra al medio y se lee mal. El
            `<br />` va oculto abajo de `sm` para que en teléfono envuelva
            solo — mismo idiom que `components/views/BlogIndexView.tsx`; el
            `{" "}` no es decorativo, es el separador que queda cuando el
            `<br />` está oculto. El texto vive acá y no en `content.ts`
            por lo que explica `components/sections/README.md`: un titular
            con `<br />` y `<Accent>` no entra en un string plano, y
            `PROOF_HEADLINE` lo comparten las cuatro copias.

            `<Accent>` es el tratamiento del sitio para acentuar un tramo
            de un heading sans — Kepler itálica, con la corrección óptica
            de x-height contra Montreal ya resuelta en sus tokens (no
            compensar a mano acá). Va la variante pelada y no `display`:
            esa es para acentos dentro de `text-display`/`h1`, y este
            titular es `text-h2` — mismo caso que
            `components/sections/protocol/DeveloperBlock.tsx`. */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <h2 data-proof-headline className="text-h2 text-pretty">
            Already the rails for
            <br className="hidden sm:block" />{" "}
            <Accent>cross-chain value</Accent>
          </h2>

          {/* El tratamiento es el que venía de la copia 3 — una LISTA:
              cada stat es un renglón donde el número y el label comparten
              línea de base ("$20B+ — All-time cross-chain volume"),
              apilados los 4, más editorial/documento que panel de
              métricas. Que quede igual que la copia 3 es a propósito
              (pedido explícito): las fichas con marco que estaban acá
              pasaron a la copia 1. `text-h3` (techa en 2.5rem): en un
              renglón de lectura como este, un número grande no calza —
              tiene que pesar como una palabra más de la frase, no como
              un titular. */}
          <div data-stat-block className="flex flex-col divide-y divide-rule border-y border-rule">
            {PROOF_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-5">
                <span data-stat-value className="text-h3 text-pretty">
                  {stat.value}
                </span>
                <span data-stat-label className="text-body text-gray-intermediate text-pretty">
                  — {stat.label}
                </span>
              </div>
            ))}
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
