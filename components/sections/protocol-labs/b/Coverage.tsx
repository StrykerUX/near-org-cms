"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import { GALLERY } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa B · sección 14.
//
// Cinco filas a ancho completo, una por línea. No es la lista a dos columnas de
// la página viva ni la bibliografía numerada de la alternativa A: acá cada
// entrada ocupa el ancho de la página y el título va a `text-h3`, porque después
// del acto y del cierre de developers esta sección es el último tramo con
// contenido nuevo y una lista chica se lee como un pie de página.
//
// El desplazamiento al hover es de la FILA entera, no de la flecha: mueve el
// bloque que se va a clickear, que es la retroalimentación que el gesto pide.
export default function Coverage() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 18, stagger: 0.07 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-14 py-28 lg:py-36">
        <div className="flex flex-col gap-4">
          <h2 className="text-h2 text-pretty">
            {GALLERY.title.lead} <Accent>{GALLERY.title.accent}</Accent>
          </h2>
          <p className="text-body-lg text-ink-soft">{GALLERY.subhead}</p>
        </div>

        <div ref={ref} className="flex flex-col">
          {GALLERY.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              data-q-arrow-host
              className="flex items-start gap-6 border-t border-rule py-8 transition-[transform,border-color] duration-500 hover:translate-x-2 hover:border-ink"
            >
              <ArrowCircle className="mt-1" />
              <span className="flex flex-1 flex-col gap-2">
                <span className="text-h3 text-pretty">{item.title}</span>
                <span className="text-body text-gray-intermediate text-pretty">{item.note}</span>
              </span>
            </a>
          ))}
          <span aria-hidden="true" className="block h-px bg-rule" />
        </div>
      </Container>
    </section>
  );
}
