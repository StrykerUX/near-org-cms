"use client";

import { useState } from "react";

import Container from "@/components/primitives/Container";
import NightHeader from "@/components/sections/closing-labs/night/NightHeader";
import { PRESS_ITEMS } from "@/components/sections/closing-labs/pressContent";

// Las notas de prensa que se abren — el FAQ de dreammotion.framer.website.
//
// ── Qué gana la sección al volverse plegable ────────────────────────────────
//
// `UpdatesList` tiene un `+` al final de cada fila que NO abre nada: es un link
// a otro lado. El signo promete un despliegue y entrega una navegación, y esa
// es la única cosa francamente floja de la sección tal como está hoy.
//
// Acá el signo cumple. Cada fila abre el arranque de la nota, y recién ahí
// aparece el link. Son dos decisiones en vez de una —¿me interesa? / ¿la leo?—
// y para tres titulares que se parecen entre sí, la primera es la que
// importaba.
//
// ── El despliegue es `grid-template-rows`, no `height` ──────────────────────
//
// `height: auto` no se puede animar y medir el contenido para pasarle un píxel
// exacto se rompe con cualquier cambio de ancho —la nota que ocupa dos líneas
// en desktop ocupa cuatro en móvil—. Una grilla de una fila que va de `0fr` a
// `1fr` SÍ interpola, y el contenido se mide solo. Necesita el `overflow-hidden`
// en el hijo: sin él la fila de `0fr` no recorta y el texto se ve igual.
//
// ── Una abierta por vez ─────────────────────────────────────────────────────
//
// Con tres titulares casi idénticos, dos abiertas a la vez dejan dos bloques de
// texto parecidos uno arriba del otro y no se sabe cuál es de cuál. `open`
// guarda un índice y no un set, así que abrir una cierra la anterior por
// construcción y no por un `useEffect` que las sincronice.
export default function NightPress() {
  const [open, setOpen] = useState<string | null>(PRESS_ITEMS[0].id);

  return (
    <section className="bg-ink py-28 text-cream lg:py-40">
      <Container className="flex flex-col gap-16">
        <NightHeader
          eyebrow="Media"
          lead="NEAR in the news,"
          tail="in the words of the people who wrote it."
        />

        <ul className="mx-auto flex w-full max-w-[64rem] flex-col">
          {PRESS_ITEMS.map((item) => {
            const isOpen = item.id === open;

            return (
              <li key={item.id} className="border-b border-cream/10 first:border-t">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="group flex w-full items-start justify-between gap-8 py-6 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cream"
                  >
                    <span className="flex flex-col gap-2">
                      <span className="text-caption-mono uppercase text-cream/45">
                        {item.outlet} · {item.dateLabel}
                      </span>
                      <span className="text-h4 max-w-[44ch] text-pretty">{item.title}</span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={`text-h4-mono flex size-9 shrink-0 items-center justify-center rounded-full border border-cream/20 transition-transform duration-300 ease-out motion-reduce:transition-none ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col items-start gap-5 pb-8 pr-16">
                      <p className="text-body max-w-[52ch] text-cream/60 text-pretty">
                        {item.blurb}
                      </p>
                      <a
                        href="#"
                        tabIndex={isOpen ? undefined : -1}
                        className="text-label rounded-full bg-cream px-5 py-2 text-ink transition-opacity duration-300 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream motion-reduce:transition-none"
                      >
                        Read the story
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
