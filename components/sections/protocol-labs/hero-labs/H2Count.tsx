"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// H2 · Count — prueba DENTRO, con movimiento sobre las cifras.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// El titular ya está cuando la página abre; lo que llega son los números,
// contando. Es la variante que pone el movimiento sobre el ARGUMENTO en vez de
// sobre la decoración: en esta página el argumento son las seis cifras, y un
// número que sube retiene la mirada más que el mismo número quieto.
//
// La banda va a sangre en el borde inferior, con separadores verticales y sin
// reglas horizontales: un marcador, no una tabla. Es la lectura opuesta a la de
// H1 (registro en columna) sobre exactamente los mismos seis datos — comparar
// las dos es comparar dos maneras de decir "esto está probado".
//
// ── Por qué el count-up no es un cliché acá ────────────────────────────────
//
// Lo es cuando se aplica a cualquier número. Acá se aplica UNA vez, a los seis
// datos que la página existe para sostener, y con dos límites: dura menos de un
// segundo y medio, y con `prefers-reduced-motion` los números salen directamente
// en su valor final — no hay una versión "suave", hay valor final.
//
// El detalle que lo hace legible y no un borrón: cada cifra conserva su prefijo,
// su sufijo y su número de decimales durante toda la animación, así que el ancho
// del texto no salta. Un contador que cambia de largo mientras corre arrastra a
// sus vecinos y es lo que hace que el recurso se vea barato.

/** Parte un valor en prefijo, número y sufijo: `"<$0.002"` → `["<$", 0.002, ""]`. */
const parseStat = (value: string): [string, number, string, number] | null => {
  const m = value.match(/^(\D*)([\d.]+)(.*)$/);
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return [prefix, Number(digits), suffix, decimals];
};

export default function H2Count() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      tl.from(q("[data-hero-item]"), { autoAlpha: 0, y: 22, duration: 0.9, stagger: 0.1 }, 0);

      q("[data-count]").forEach((el, i) => {
        const parsed = parseStat(el.dataset.count ?? "");
        if (!parsed) return;
        const [prefix, target, suffix, decimals] = parsed;
        const counter = { n: 0 };
        tl.to(
          counter,
          {
            n: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
            },
          },
          // Escalonadas pero solapadas: en secuencia estricta la última
          // arrancaría casi un segundo después de la primera y la banda se leería
          // como seis animaciones en vez de una.
          0.35 + i * 0.08
        );
      });

      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh flex-col justify-between bg-cream pt-[var(--site-header-block)] text-foreground"
    >
      <Container className="flex flex-1 flex-col justify-center gap-8 py-16">
        <p data-hero-item className="uppercase text-eyebrow-mono text-gray-intermediate">
          {HERO.eyebrow}
        </p>
        <h1 data-hero-item className="max-w-[16ch] text-display text-balance">
          {HERO.lead} <Accent display>{HERO.accent}</Accent>
        </h1>
        <div data-hero-item className="flex flex-col gap-7">
          <p className="max-w-[44ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>

      {/* El marcador. Separadores verticales y una sola regla superior: lo que
          agrupa a las seis es la línea de arriba, y lo que las separa entre sí es
          el filete. Seis cajas con borde completo serían seis cards. */}
      <div className="border-t border-ink">
        <Container>
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {PROOF.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col gap-1 border-l border-rule py-7 pl-5 first:border-l-0 first:pl-0"
              >
                {/* El valor de partida es el FINAL, escrito en el HTML: sin JS o
                    con reduced-motion la cifra ya está bien. El contador lo pisa
                    en el primer frame si va a correr. */}
                <dd data-count={stat.value} className="text-h2 tabular-nums">
                  {stat.value}
                </dd>
                <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
                {stat.note && (
                  <dd className="text-micro-mono text-gray-intermediate">{stat.note}</dd>
                )}
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
