"use client";

import Image from "next/image";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { WHY_IT_MATTERS } from "@/components/sections/chain-abstraction-proposals/content";

// Los MISMOS íconos y la misma card que `homepage-update/OwnYourOwn.tsx`
// (`/prototype/homepage-update/icon-*.webp`, los mismos archivos, no un
// ícono de lucide-react inventado) — 3 de los 4 (Data/Assets/Intelligence),
// emparejados por afinidad de concepto con los 3 pilares de este copy.
const ICONS = [
  "/prototype/homepage-update/icon-data.webp",
  "/prototype/homepage-update/icon-assets.webp",
  "/prototype/homepage-update/icon-intelligence.webp",
] as const;

// La escalera: cada fila se alinea distinto dentro del `Container`
// (izquierda → derecha → centro, el pedido literal) sobre un ancho menor al
// 100% — a ancho completo `mr-auto`/`ml-auto`/`mx-auto` no mueven nada, así
// que el ancho recortado (`lg:max-w-[78%]`) es lo que hace que la
// alineación se note.
//
// Antes había un margen negativo (`-mt-10`) para que una fila pisara
// levemente a la anterior — leía bien en el boceto, pero acá con cards
// sólidas (sombra + `backdrop-blur`) el resultado era justo lo contrario a
// "escalón prolijo": las esquinas de la fila del medio cruzaban por encima
// de las otras dos a la vez (una arriba, una abajo), y esa doble
// intersección se ve como un bug, no como diseño. `gap-6` normal, sin
// solape — el escalón lo sigue haciendo la alineación horizontal sola.
const ALIGN = ["lg:mr-auto", "lg:ml-auto", "lg:mx-auto"] as const;

// Entrada por fila, alternada — 1ª de izquierda a derecha, 2ª de derecha a
// izquierda, 3ª de nuevo izquierda a derecha (pedido literal). `x` es de
// dónde SALE la tarjeta (`gsap.from`): negativo = arranca a la izquierda de
// su lugar final y entra viajando hacia la derecha; positivo = arranca a la
// derecha y entra viajando hacia la izquierda.
const ENTER_X = [-64, 64, -64] as const;

export default function WhyItMatters() {
  const rootRef = useScrollReveal<HTMLElement>({
    // "al tocar esa sección": el default del hook (`top 82%`) dispara con la
    // sección todavía lejos del borde. `top 95%` es el borde de arriba de la
    // sección casi tocando el borde de abajo del viewport — recién ahí
    // arranca.
    start: "top 95%",
    build: ({ tl, q }) => {
      const cards = q("[data-reveal]");
      cards.forEach((el, i) => {
        tl.from(el, { autoAlpha: 0, x: ENTER_X[i], duration: 0.8, ease: EASE_OUT }, i * 0.15);
      });
    },
  });

  return (
    <section ref={rootRef} className="bg-cream py-20 lg:py-28">
      <Container className="flex flex-col gap-6">
        {WHY_IT_MATTERS.map((item, i) => (
          <div
            key={item.title}
            data-reveal
            className={`flex w-full flex-col gap-6 rounded-3xl bg-card-tint/50 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between lg:max-w-[78%] ${ALIGN[i]}`}
          >
            <div className="flex flex-col gap-3">
              <h3 className="text-h3-serif italic text-pretty">{item.title}</h3>
              <p className="max-w-md text-body text-foreground/75 text-pretty">{item.body}</p>
            </div>
            <Image
              src={ICONS[i]}
              alt=""
              width={160}
              height={168}
              sizes="160px"
              className="h-28 w-28 flex-none rounded-xl object-cover sm:h-36 sm:w-36"
            />
          </div>
        ))}
      </Container>
    </section>
  );
}
