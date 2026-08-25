"use client";

import { RuleLabel } from "@/components/sections/closing-labs/shared";
import Slab from "@/components/sections/closing-labs/slab/Slab";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";

// Las cuatro voces adentro de la losa clara.
//
// ── La losa clara existe para que esta sección no sea el tramo oscuro ───────
//
// En la ruta viva, `TestimonialDeck` es el ÚNICO tramo negro del final y va
// después del newsletter porque es el cambio de voz. Esta dirección no puede
// usar ese recurso: alterna losa oscura y losa clara sección a sección, así que
// «oscuro» ya no significa «acá habla otro» — significa «esta es la impar».
//
// Lo que ocupa su lugar es la única losa de la dirección donde el contenido NO
// se apoya en el fondo de la losa: las cuatro citas van sobre celdas con filete
// y sin relleno, y el nombre va en serif. Es un cambio de temperatura
// tipográfica en vez de un cambio de fondo, y hace el mismo trabajo.
//
// ⚠️ Dos de las cuatro citas son reconstrucciones y un cargo dice
// «Company xxx» — ver la cabecera de `testimonialDeckContent.ts`.
export default function SlabVoices() {
  const rootRef = useScrollReveal<HTMLUListElement>();

  return (
    <Slab tone="paper">
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-8">
          <RuleLabel className="text-ink/60">On the record</RuleLabel>
          <h2 className="text-h2 max-w-[24ch] text-balance">
            Four people who had no reason to say it.
          </h2>
        </div>

        <ul ref={rootRef} className="-ml-px -mt-px grid overflow-hidden sm:grid-cols-2">
          {TESTIMONIALS.map((person) => (
            <li
              key={person.id}
              data-reveal
              className="flex flex-col justify-between gap-10 border-l border-t border-ink/12 p-6 lg:p-10"
            >
              <blockquote className="text-h4 max-w-[34ch] text-pretty">
                “{person.quote}”
              </blockquote>

              <figcaption className="flex flex-col gap-1">
                <span className="text-h3-serif italic">{person.name}</span>
                <span className="text-caption-mono uppercase text-ink/50">{person.role}</span>
              </figcaption>
            </li>
          ))}
        </ul>
      </div>
    </Slab>
  );
}
