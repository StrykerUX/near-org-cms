"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// La frase del hero se compone renglón por renglón acá y no sale entera de
// `HERO.lead`/`HERO.accent`: dónde corta cada renglón es una decisión de esta
// composición —depende del ancho del token que lo pinta— y no un dato del
// contenido. Las otras dos alternativas usan el corte del módulo, que es el del
// doc.

// Alternativa C · sección 1.
//
// ── La tesis, en el hero ───────────────────────────────────────────────────
//
// Ni retícula ni objeto: la frase. El titular ocupa el ancho de la página en dos
// renglones porque acá el titular ES el layout, y esa es la única condición bajo
// la cual la escala de cartel está justificada — la nota de `--text-poster` en
// globals.css dice exactamente eso.
//
// ── Por qué TRES renglones y por qué cada uno con su token ───────────────
//
// La frase entera son 41 caracteres. A la escala de `--text-kicker-xl` (que
// topa en 13rem) un renglón llena el ancho del Container con unos 15
// caracteres, así que partirla en dos deja renglones de 20 que hacen wrap solos
// — y un renglón que se parte por su cuenta rompe justo lo que esta composición
// busca, que es que cada uno cruce la página completa.
//
// El reparto es 14 / 13 / 13:
//
//   "The settlement"   kicker-xl
//   "layer for the"    kicker-xl
//   "agent economy"    serif-poster
//
// El tercero lleva `serif-poster` —el token de cartel más grande— y no es una
// jerarquía distinta sino una compensación de ancho: Kepler itálica avanza
// bastante menos que Montreal, así que a igual cuerpo el mismo número de
// caracteres mide menos. Es el mismo criterio con el que globals.css declara los
// dos tokens: uno para el renglón largo y otro para el corto, porque un solo
// cuerpo no puede llenar el mismo ancho con dos recuentos distintos.
//
// Los dos valores salen del avance medio de cada familia y son una ESTIMACIÓN,
// no una medición: hay que mirarlos en pantalla a 1440 y a 1920 antes de darlos
// por buenos. Si alguno se queda corto o desborda, lo que se ajusta es el
// reparto de la frase, no el token.
//
// ── Por qué no hay campo generativo ────────────────────────────────────────
//
// Las tres alternativas se preguntan qué sostiene el hero. A responde "la
// evidencia", B "el objeto" y C "la frase". Ponerle un campo detrás sería
// responder las tres a la vez, que es como se llega a un hero que se parece al
// de cualquier otro protocolo.
export default function ArgumentHero() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      // Los dos renglones entran por separado y con el segundo más tarde: la
      // frase se termina de decir, no aparece. Sin SplitText — a escala de
      // cartel el enmascarado por líneas cizalla los descendentes ("agent
      // economy" tiene g e y), y arreglarlo requiere `allowDescenders` y un
      // ajuste por renglón que a dos renglones no paga.
      tl.from(q("[data-line]"), { yPercent: 24, autoAlpha: 0, duration: 1.1, stagger: 0.16 }, 0);
      tl.from(q("[data-hero-item]"), { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.1 }, 0.55);
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
        <p
          data-hero-item
          className="uppercase text-eyebrow-mono text-gray-intermediate"
        >
          {HERO.eyebrow}
        </p>

        {/* Cada renglón dentro de su propia caja con `overflow-hidden`: el
            desplazamiento de entrada tiene que asomar desde abajo del renglón y
            no desde el aire. A esta escala, un texto que entra sin máscara se ve
            flotar sobre la página. */}
        {/* Cada renglón dentro de su propia caja con `overflow-hidden`: el
            desplazamiento de entrada tiene que asomar desde abajo del renglón y
            no desde el aire. A esta escala, un texto que entra sin máscara se ve
            flotar sobre la página.

            El `pb` de la caja serif es para el descendente de la "g": la
            máscara recorta al borde de la caja y sin ese aire la letra queda
            cortada al terminar la animación, no solo durante. */}
        <h1 className="flex flex-col">
          <span className="block overflow-hidden">
            <span data-line className="block text-kicker-xl">
              The settlement
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-line className="block text-kicker-xl">
              layer for the
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-line className="block serif-poster italic text-ink-deep">
              agent economy
            </span>
          </span>
        </h1>
      </Container>

      {/* El pie del hero: el cuerpo y la acción, abajo y a la derecha, con el
          ancho de la mitad de la página. La frase se queda con el centro óptico;
          lo que la explica se subordina en posición y no solo en tamaño. */}
      <Container className="flex flex-col gap-8 pb-16 lg:flex-row lg:items-end lg:justify-between">
        <span aria-hidden="true" className="hidden h-px flex-1 bg-ink/20 lg:block" />
        <div data-hero-item className="flex flex-col gap-6 lg:max-w-[38ch] lg:pl-16">
          <p className="text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
