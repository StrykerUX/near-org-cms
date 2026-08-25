"use client";

import Link from "next/link";

import Container from "@/components/primitives/Container";
import { ArrowDisc, RAMPS } from "@/components/sections/closing-labs/shared";
import NightHeader from "@/components/sections/closing-labs/night/NightHeader";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { GET_INTO_ROWS } from "@/components/sections/homepage-tuck/getIntoNearContent";

// Las tres puertas sobre negro, con la rampa convertida en luz.
//
// ── La rampa cambia de material, no de forma ────────────────────────────────
//
// Sobre crema, la rampa es pigmento: una píldora de color apoyada en papel
// blanco. Sobre negro el mismo objeto se lee distinto —cualquier cosa clara
// sobre negro se lee como EMITIDA, no como impresa— y pelearse con eso da lo
// peor de los dos mundos: una barra de color plana que parece un error de
// contraste.
//
// Así que acá la rampa se acepta como luz. Va dos veces en el mismo lugar: una
// nítida de 2px, que es el objeto, y otra debajo desenfocada y a media
// opacidad, que es lo que ese objeto ilumina. Es un `blur` y una opacidad, nada
// más, y alcanza para que los mismos quince verdes dejen de parecer una barra
// pegada encima del negro.
//
// El resplandor NO se anima al hover. Lo que responde es la card entera (borde
// y fondo un punto más claros): una luz que sube y baja convertiría la puerta
// en un botón que late, y son tres al lado.
//
// ── Por qué la rampa va abajo y no al medio ─────────────────────────────────
//
// En el artboard ocupa el tercio central del renglón porque el renglón es una
// fila horizontal y el centro es el único lugar que le queda entre el nombre y
// el cuerpo. Acá la puerta es una card en columna, y el centro de una card lo
// ocupa el texto. Abajo, a lo ancho, la rampa hace de zócalo — que es la misma
// función que cumplía: separar el nombre de lo que viene después.
export default function NightGateway() {
  const rootRef = useScrollReveal<HTMLUListElement>();

  return (
    <section className="bg-ink py-28 text-cream lg:py-40">
      <Container className="flex flex-col gap-16">
        <NightHeader
          eyebrow="Start here"
          lead="Three ways into NEAR."
          tail="Pick the one that sounds like you."
        />

        <ul ref={rootRef} className="grid gap-4 lg:grid-cols-3">
          {GET_INTO_ROWS.map((row) => (
            <li key={row.id} data-reveal>
              <Link
                href={row.href}
                className="group relative flex h-full flex-col justify-between gap-12 overflow-hidden rounded-[24px] border border-cream/10 bg-cream/[0.03] p-6 pb-10 transition-colors duration-300 hover:border-cream/20 hover:bg-cream/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream motion-reduce:transition-none"
              >
                <div className="flex flex-col gap-4">
                  <p className="text-h3">{row.label}</p>
                  <p className="text-body text-cream/60 text-pretty">{row.body}</p>
                </div>

                <span className="text-label flex items-center gap-3 text-cream/80">
                  Enter
                  <ArrowDisc className="text-cream/80" />
                </span>

                {/* El resplandor va PRIMERO en el DOM y con `blur`, así que la
                    línea nítida de abajo se dibuja encima sin necesidad de
                    z-index: dos hermanos posicionados, el segundo gana. */}
                <span
                  aria-hidden="true"
                  style={{ backgroundImage: RAMPS[row.id] }}
                  className="pointer-events-none absolute inset-x-6 bottom-0 h-6 rounded-full opacity-40 blur-xl"
                />
                <span
                  aria-hidden="true"
                  style={{ backgroundImage: RAMPS[row.id] }}
                  className="pointer-events-none absolute inset-x-6 bottom-4 h-0.5 rounded-full"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
