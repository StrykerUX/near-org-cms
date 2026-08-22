"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import GlSurface, { hexToRgb } from "@/components/sections/protocol-labs/opening-labs/GlSurface";
import { HORIZON_FRAG } from "@/components/sections/protocol-labs/opening-labs/gl/horizon";
import { ScaleSection } from "@/components/sections/protocol-labs/opening-labs/OpeningA";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// F · Horizon — la única cálida de las seis.
//
// ── Por qué existe ─────────────────────────────────────────────────────────
//
// Las otras cinco aperturas son geométricas o tipográficas: retícula, celdas,
// columnas, planos, texto. Ninguna aporta lo que la fotografía de amanecer
// aporta a la portada de Ondo — temperatura, y la sensación de que hay algo
// detrás del texto en vez de un patrón.
//
// No hay banco de imágenes ni presupuesto de render para esta página, así que la
// temperatura la da un degradé con banda de luz, nubes de ruido y grano. Escala
// a cualquier proporción sin recortar mal, que es la mitad del trabajo de
// mantener una foto de portada.
//
// ── El trío es un amanecer ────────────────────────────────────────────────
//
// Hero de noche con la banda baja; los números justo sobre la línea de luz, ya
// más claros; y "Built for AI scale" en pleno día, sobre crema. La progresión
// no es una metáfora del contenido —no lo es, y conviene no fingir que sí— es
// una progresión de temperatura que hace que las tres secciones se lean como un
// solo movimiento.
//
// ── Lo que se arriesga, y hay que decirlo ────────────────────────────────
//
// Es la más bonita y la menos argumentada. Las otras cinco superficies dicen
// algo del protocolo; ésta dice "esto es importante y es de noche". Si el equipo
// quiere que la primera pantalla trabaje, no es ésta. Si quiere que emocione,
// probablemente sí.

const DEEP = "#04120c";

const HORIZON_UNIFORMS = {
  u_deep: hexToRgb(DEEP),
  u_mid: hexToRgb("#0d3a29"),
  u_light: hexToRgb("#b7f0a8"),
  // La banda baja, a un tercio del borde inferior: deja los dos tercios de
  // arriba para el cielo, que es donde va el titular.
  u_horizon: 0.3,
  u_spread: 0.13,
  u_grain: 0.05,
  u_drift: 1,
};

export default function OpeningF() {
  const numbers = useCountUp<HTMLDListElement>({ stagger: 0.08 });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        data-nav-dark
        className="relative isolate flex min-h-svh flex-col overflow-hidden pt-[var(--site-header-block)] text-cream"
      >
        <GlSurface
          fragment={HORIZON_FRAG}
          uniforms={HORIZON_UNIFORMS}
          tag="opening-horizon"
          fallback={DEEP}
          className="absolute inset-0 z-0 h-full w-full"
        />

        {/* No hay velo. Es la única de las cuatro superficies que no lo lleva: el
            shader ya trae su propia viñeta y una caída de luz, y apilarle un
            gradiente encima aplana justamente lo que la hace ver como una
            imagen y no como un fondo. */}
        <Container className="relative z-20 grid-ds flex-1 items-center gap-y-10 py-14">
          <div className="col-span-full flex flex-col gap-7 lg:col-span-7">
            <p className="uppercase text-eyebrow-mono text-cream/60">{HERO.eyebrow}</p>
            <h1 className="text-h1 text-balance">
              {HERO.lead}
              <br />
              <Accent display>{HERO.accent}</Accent>
            </h1>
          </div>

          <div className="col-span-full flex flex-col gap-7 lg:col-start-9 lg:col-span-4 lg:self-end lg:pb-2">
            <p className="max-w-[36ch] text-body-lg text-cream/75 text-pretty">{HERO.body}</p>
            <CtaPill href={HERO.cta.href} tone="solid" external>
              {HERO.cta.label}
            </CtaPill>
          </div>
        </Container>
      </section>

      {/* ── Números, sobre la línea de luz ────────────────────────────────── */}
      {/* El mismo shader con la banda subida al centro y más abierta: la sección
          está literalmente en el horizonte, que es el punto más claro del
          recorrido antes de salir al día. */}
      <section data-nav-dark className="relative isolate overflow-hidden border-t border-cream/20 bg-[#04120c] text-cream">
        <GlSurface
          fragment={HORIZON_FRAG}
          uniforms={{ ...HORIZON_UNIFORMS, u_horizon: 0.5, u_spread: 0.26 }}
          tag="opening-horizon-band"
          fallback={DEEP}
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
          className="pointer-events-none absolute inset-0 z-10 bg-[rgba(4,18,12,0.55)]"
        />

        <Container className="relative z-20 py-20 lg:py-24">
          <dl ref={numbers} className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-2">
                <dd data-count={stat.value} className="text-h2-serif italic tabular-nums text-cream">
                  {stat.value}
                </dd>
                <dt className="uppercase text-micro-mono text-cream/60">{stat.label}</dt>
                {stat.note && <dd className="text-micro-mono text-cream/40">{stat.note}</dd>}
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <ScaleSection tone="cream" />
    </>
  );
}
