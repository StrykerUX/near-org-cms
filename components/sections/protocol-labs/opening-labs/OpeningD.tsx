"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import {
  GreenCube,
  IsoFrame,
  SolidCube,
  WireCube,
  isoAt,
  plane,
  planeGrid,
} from "@/components/sections/protocol-labs/isoKit";
import { ScaleSection } from "@/components/sections/protocol-labs/opening-labs/OpeningA";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// D · Stack — sin WebGL: el material de la marca a escala de superficie.
//
// ── La tesis del trío ──────────────────────────────────────────────────────
//
// Las otras cinco aperturas traen una superficie nueva. Ésta usa lo que la marca
// YA tiene —los planos y cubos isométricos que aparecen en toda la página— pero
// a un tamaño que nunca se les dio: cuatro planos apilados en profundidad,
// ocupando la pantalla, con la copy entre ellos.
//
// La pregunta que hace es concreta: **¿hacía falta inventar una superficie, o
// alcanzaba con dejar de usar el lenguaje propio en miniatura?** En todas las
// versiones anteriores el cubo isométrico aparecía a 20px, como viñeta. Acá el
// mismo dibujo, a 900px, es el fondo.
//
// ── Sin shader, y eso es parte de la propuesta ────────────────────────────
//
// Todo es SVG. Pesa unos pocos KB contra los ~40 de un canvas WebGL con su
// programa, funciona sin GPU, escala sin resolución y se puede editar con las
// mismas herramientas que el resto de los diagramas de la página. Si esta
// alternativa se sostiene visualmente contra las de shader, gana por eso.
//
// ── El movimiento es paralaje de scroll, no una animación ────────────────
//
// Los cuatro planos se desplazan a velocidades distintas mientras el hero sale
// de pantalla: el más cercano rápido, el más lejano casi quieto. Es el gesto
// que da profundidad a una imagen plana, y es también el único movimiento del
// trío — sin bucles, sin nada corriendo cuando el lector se detiene.
//
// `ease: "none"` con scrub: la curva la pone el dedo del lector.

const iso = isoAt(210, 150);

// Los cuatro planos, del más lejano al más cercano. `speed` es cuánto se
// desplaza cada uno respecto del scroll — la escalera de velocidades ES la
// profundidad, así que los valores importan más que las posiciones.
const PLANES = [
  { z: 96, half: 96, grid: 6, opacity: 0.18, speed: 0.06 },
  { z: 48, half: 84, grid: 5, opacity: 0.3, speed: 0.16 },
  { z: 8, half: 72, grid: 4, opacity: 0.45, speed: 0.3 },
  { z: -40, half: 58, grid: 3, opacity: 0.7, speed: 0.5 },
] as const;

export default function OpeningD() {
  const numbers = useCountUp<HTMLDListElement>({ stagger: 0.07 });

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const layers = q("[data-plane]");
      if (layers.length === 0) return;

      const tweens = layers.map((layer, i) =>
        gsap.fromTo(
          layer,
          { yPercent: 0 },
          {
            yPercent: -PLANES[i].speed * 60,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        )
      );

      return () => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        ref={rootRef}
        data-nav-dark
        className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink pt-[var(--site-header-block)] text-cream"
      >
        {/* Cada plano en su propia capa absoluta: el paralaje mueve la CAPA, no
            el path, así que un solo transform por plano en vez de recalcular
            geometría. */}
        {PLANES.map((p) => (
          <div
            key={p.z}
            data-plane
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{ opacity: p.opacity }}
          >
            <IsoFrame viewBox="0 0 420 300" className="h-full w-full">
              <path d={plane(iso, p.half, p.z)} className="stroke-cream/60" />
              <path d={planeGrid(iso, p.half, p.z, p.grid)} className="stroke-cream/25" />
            </IsoFrame>
          </div>
        ))}

        {/* Las piezas vivas, sobre el plano más cercano. Pocas y grandes: a esta
            escala, muchos cubos chicos vuelven a ser la textura que esta
            alternativa está tratando de evitar. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
          <IsoFrame viewBox="0 0 420 300" className="h-full w-full">
            <GreenCube iso={iso} x={-44} y={-18} z={-40} s={13} />
            <WireCube iso={iso} x={26} y={30} z={-40} s={13} className="stroke-cream/50" />
            <SolidCube iso={iso} x={62} y={-36} z={-40} s={11} className="text-cream/80" />
          </IsoFrame>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_70%_50%_at_35%_50%,rgba(16,16,16,0.9)_0%,rgba(16,16,16,0.45)_60%,transparent_88%)]"
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
            <CtaPill href={HERO.cta.href} tone="solid" external>
              {HERO.cta.label}
            </CtaPill>
          </div>
        </Container>
      </section>

      {/* ── Números sobre el último plano ─────────────────────────────────── */}
      {/* El plano más cercano continúa acá, ya casi horizontal y recortado por
          el borde superior: las cifras se apoyan sobre él. Es la misma pieza del
          hero, vista desde más cerca. */}
      <section data-nav-dark className="relative isolate overflow-hidden border-t border-cream/20 bg-ink text-cream">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-[38%] z-0 h-[150%] opacity-40">
          <IsoFrame viewBox="0 0 420 300" className="h-full w-full">
            <path d={plane(iso, 58, -40)} className="stroke-cream/60" />
            <path d={planeGrid(iso, 58, -40, 3)} className="stroke-cream/25" />
          </IsoFrame>
        </div>
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
          className="pointer-events-none absolute inset-0 z-10 bg-[rgba(16,16,16,0.72)]"
        />

        <Container className="relative z-20 py-20 lg:py-24">
          <dl ref={numbers} className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
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
