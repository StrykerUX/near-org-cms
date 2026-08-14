"use client";

import { useState } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { LAYERS, VIEW_BOX, type FaceRole } from "./nearStackGeometry";
import { TIERS } from "./nearStackContent";

// ── NearStack: objeto isométrico + acordeón de cuatro capas ──────────────────
//
// Rediseño sobre los frames WIP de brand (2026-08-13): la escena de scroll
// anterior se reemplaza por un estado `active` compartido entre el arte y el
// rail. Un solo número gobierna las dos mitades:
//
//   · en el SVG, la capa activa se pinta con caras verdes sólidas (lime arriba,
//     mint a la izquierda, deep a la derecha — el vocabulario de cubos de
//     protocol/spineDiagrams); el resto queda en wireframe hairline.
//   · en el rail, el item activo expande su panel (body + link "Visit …");
//     los demás quedan como filas colapsadas.
//
// Todo el movimiento es transición CSS: dos clases que cambian con `active`
// (fill de caras, grid-template-rows del panel). No hay nada que interpolar a
// mano, así que GSAP no participa — y con reduced-motion las transiciones se
// apagan por clase y el cambio es instantáneo, con el mismo contenido.
//
// El hover se filtra por pointerType: en touch, el navegador sintetiza
// pointerenter en el tap y el reset de pointerleave llegaría al tocar cualquier
// otra cosa, colapsando lo que el usuario acaba de abrir. Mouse hovering y
// touch tapping son caminos separados a propósito.

/** Tier que queda encendido cuando el puntero no está sobre la sección. */
const DEFAULT_TIER = 0;

// Caras verdes de una capa encendida. Mismo mapeo de roles que los GreenCube
// de protocol/spineDiagrams: la luz viene de arriba a la izquierda.
const LIT_FILL: Record<FaceRole, string> = {
  top: "fill-cta-lime",
  left: "fill-cta-mint",
  right: "fill-cta-deep",
};

export default function NearStack() {
  // -1 = nada encendido (tap sobre el item abierto lo colapsa). Cualquier
  // salida del puntero vuelve a DEFAULT_TIER, así que el estado "vacío" solo
  // se ve en touch/teclado, donde es una decisión del usuario.
  const [active, setActive] = useState<number>(DEFAULT_TIER);

  const hoverTier = (e: React.PointerEvent, tier: number) => {
    if (e.pointerType === "mouse") setActive(tier);
  };
  const hoverReset = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setActive(DEFAULT_TIER);
  };

  return (
    <section className="bg-ink text-cream">
      {/* pt-32 iguala el pb-32 con que cierra OwnYourOwn: el corte entre las
          dos secciones es a sangre, así que el aire a cada lado tiene que
          coincidir o la juntura se lee descentrada. */}
      <Container className="flex flex-col gap-14 pb-32 pt-32 lg:gap-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-h1 text-pretty">
            The NEAR <Accent>Stack</Accent>
          </h2>
          <p className="max-w-[26ch] text-h3 text-cream/70 text-balance">
            Open infrastructure{" "}
            <span
              aria-hidden="true"
              className="inline-block size-[0.78em] translate-y-[0.06em] rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom right, var(--near-teal), var(--near-green-accent), var(--near-teal))",
              }}
            />{" "}
            powering the{" "}
            <span
              aria-hidden="true"
              className="inline-block size-[0.72em] translate-y-[0.04em] rotate-45 rounded-[0.12em] bg-near-green-accent"
            />{" "}
            agent economy
          </p>
        </div>

        {/* El reset de hover vive acá y no en cada mitad: cruzar del arte al
            rail no debe pasar por el estado default en el medio. */}
        <div
          onPointerLeave={hoverReset}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16"
        >
          {/* El arte va PRIMERO en el DOM: en mobile queda apilado arriba del
              rail, como piden los frames. Decorativo (aria-hidden): cada capa
              es alcanzable como texto en el rail de al lado. */}
          <svg
            viewBox={VIEW_BOX}
            aria-hidden="true"
            className="mx-auto block w-full max-w-[420px] lg:max-h-[62svh] lg:max-w-[640px]"
          >
            {/* El orden de LAYERS ES el z-order y no se puede reordenar: cada
                anillo tiene una parte por detrás del eje y otra por delante, y
                ese cruce es todo el efecto de profundidad. */}
            {LAYERS.map((layer, li) => {
              const lit = layer.tier === active;
              return (
                <g key={li}>
                  {layer.pieces.map((p) => (
                    <g
                      key={p.id}
                      data-piece={p.id}
                      className="cursor-pointer"
                      onPointerEnter={(e) => hoverTier(e, layer.tier)}
                      // Click directo sobre el arte (touch incluido): enciende,
                      // nunca colapsa — el toggle es del rail, donde está el
                      // contenido que se abre y se cierra.
                      onClick={() => setActive(layer.tier)}
                    >
                      {p.faces.map((f, fi) => (
                        <path
                          key={fi}
                          d={f.d}
                          // El fill apagado tiene que ser EXACTAMENTE el fondo
                          // de la sección: el back-face culling de la geometría
                          // solo se lee como oclusión sólida si coinciden. Por
                          // eso los dos salen del token `ink` (ver el README).
                          className={`${lit ? LIT_FILL[f.role] : "fill-ink"} stroke-cream/40 transition-[fill] duration-300 motion-reduce:transition-none`}
                          strokeWidth={1}
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>

          <div className="flex w-full flex-col gap-3">
            {TIERS.map((tier, i) => {
              const open = i === active;
              return (
                <div
                  key={tier.name}
                  data-open={open}
                  onPointerEnter={(e) => hoverTier(e, i)}
                  className="group/tier rounded-2xl border border-cream/12 transition-colors duration-300 data-[open=true]:border-cream/30 motion-reduce:transition-none"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`near-stack-panel-${i}`}
                    // Toggle y no set: el segundo tap/Enter sobre el item
                    // abierto lo colapsa (es el camino de mobile y teclado; en
                    // desktop el hover ya lo dejó abierto antes del click).
                    onClick={() => setActive((prev) => (prev === i ? -1 : i))}
                    // Solo focus VISIBLE abre el panel: el focus de un click de
                    // mouse llegaría antes que el click y el toggle vería el
                    // item ya abierto — o sea, click sobre un item cerrado lo
                    // abriría y cerraría en el mismo gesto.
                    onFocus={(e) => {
                      if (e.currentTarget.matches(":focus-visible")) setActive(i);
                    }}
                    className="w-full cursor-pointer rounded-2xl px-6 pb-4 pt-5 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint"
                  >
                    <span className="text-h4 text-cream/40 transition-colors duration-300 group-data-[open=true]/tier:text-cream motion-reduce:transition-none">
                      <sup className="index-marker mr-2 align-super text-cream/30 transition-colors duration-300 group-data-[open=true]/tier:text-cta-mint motion-reduce:transition-none">
                        0{i + 1}
                      </sup>
                      {tier.name}
                    </span>
                  </button>

                  {/* grid-template-rows 0fr ↔ 1fr en vez de animar height: el
                      navegador interpola sin que nadie mida. El overflow-hidden
                      va en el hijo interno para que el padding del contenido
                      quede DENTRO de la caja que se recorta. */}
                  <div
                    id={`near-stack-panel-${i}`}
                    className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-data-[open=true]/tier:grid-rows-[1fr] motion-reduce:transition-none"
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col items-center gap-5 px-6 pb-6 sm:px-10">
                        <p className="max-w-[46ch] text-center text-body-sm text-cream/60 text-pretty">
                          {tier.body}
                        </p>
                        <a
                          href={tier.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          // Un panel colapsado no es display:none — sin esto el
                          // Tab aterrizaría en links invisibles.
                          tabIndex={open ? 0 : -1}
                          className="text-caption text-cta-mint transition-colors duration-200 hover:text-cta-lime motion-reduce:transition-none"
                        >
                          {tier.link.label} <span aria-hidden="true">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
