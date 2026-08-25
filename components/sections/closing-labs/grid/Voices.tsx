"use client";

import { Hatch } from "@/components/sections/closing-labs/shared";
import RuleGrid, {
  Band,
  RULE,
} from "@/components/sections/closing-labs/grid/RuleGrid";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";

// Lo que otros dicen, como registro.
//
// ── El mazo se desarma a propósito ───────────────────────────────────────────
//
// `TestimonialDeck` apila las cuatro citas en perspectiva y avanza una por vez:
// el mazo ES el índice, y hay siempre una cita adelante. Es una puesta en
// escena, y funciona porque hay UNA voz por vez.
//
// Esta dirección hace lo contrario y por eso vale la pena compararlas: cuatro
// renglones, las cuatro voces a la vez, ninguna destacada. Es el listado de
// clientes de armory —logo, año, título, cuerpo, chevron— aplicado a personas
// en vez de a empresas.
//
// Lo que se gana: se leen las cuatro sin esperar, y el conjunto pesa más que
// cualquiera de ellas. Lo que se pierde: la cita grande, que era el único
// momento del tramo oscuro. Es una decisión de qué vale más, no un ajuste.
//
// ⚠️ Dos de las cuatro citas son reconstrucciones y un cargo dice
// «Company xxx» — ver la cabecera de `testimonialDeckContent.ts` antes de sacar
// esto de /prototype.
export default function GridVoices() {
  return (
    <RuleGrid tone="dark">
      <Band tone="dark">
        <div className={`hidden border-l lg:block ${RULE.dark}`} />
        <div className={`flex flex-col gap-6 border-l p-8 sm:col-span-2 lg:p-12 ${RULE.dark}`}>
          <p className="text-eyebrow-mono flex items-center gap-3 uppercase text-cream/60">
            <Hatch />
            On the record
          </p>
          <h2 className="text-h2 text-balance">Builders who bet early, in their own words.</h2>
        </div>
        <div className={`hidden border-l lg:block ${RULE.dark}`} />
      </Band>

      <ul className="border-b border-cream/15">
        {TESTIMONIALS.map((person, i) => (
          <li key={person.id}>
            {/* La fila entera es el objetivo del hover, y lo único que cambia
                es el fondo. Un `translate` acá empujaría el filete de la
                retícula, que es la estructura: la referencia mueve el chevron y
                nada más, y por eso la tabla no se deforma al recorrerla. */}
            <a
              href="#"
              className={`group grid items-start gap-y-6 border-t p-8 transition-colors duration-300 hover:bg-cream/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cream motion-reduce:transition-none sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:p-12 ${RULE.dark}`}
            >
              <div className="flex flex-col gap-2">
                {/* El índice numera el registro, no ordena un proceso: son
                    cuatro voces sin secuencia. Va en mono y muy chico
                    justamente para que se lea como una referencia de archivo. */}
                <span className="text-micro-mono text-cream/40">
                  //{String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-h4">{person.name}</span>
                <span className="text-caption-mono text-cream/55">{person.role}</span>
              </div>

              <blockquote className="text-body text-cream/85 text-pretty sm:col-span-2 lg:col-span-2">
                “{person.quote}”
              </blockquote>

              <span
                aria-hidden="true"
                className="text-h4-mono justify-self-start text-cream/40 transition-[color,transform] duration-300 ease-out group-hover:translate-x-2 group-hover:text-cream motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 lg:justify-self-end"
              >
                »
              </span>
            </a>
          </li>
        ))}
      </ul>
    </RuleGrid>
  );
}
