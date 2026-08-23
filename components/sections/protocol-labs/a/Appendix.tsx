"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { GALLERY } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa A · sección 14 — la galería de contenido, como apéndice.
//
// Cinco entradas numeradas con su destino escrito al final de la fila, que es la
// forma de una bibliografía y no la de una grilla de cards. Es coherente con lo
// que A viene diciendo desde el hero —esto es un documento— y además resuelve
// mejor el número: cinco cards dejan una última fila coja en cualquier grilla de
// dos, tres o cuatro columnas.
//
// El host va visible (`near.org`, `www.near.org`) en vez de un ícono de enlace
// externo: en una página que enumera pruebas, de dónde viene cada una es parte
// del dato.
const host = (href: string) => new URL(href).host.replace(/^www\./, "");

export default function Appendix() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 16, stagger: 0.06 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-14 py-28 lg:py-36">
        <div className="grid-ds gap-y-4">
          <h2 className="col-span-full text-h2 text-pretty lg:col-span-5">
            {GALLERY.title.lead} <Accent>{GALLERY.title.accent}</Accent>
          </h2>
          <p className="col-span-full text-body-lg text-ink-soft lg:col-start-7 lg:col-span-5 lg:pt-3">
            {GALLERY.subhead}
          </p>
        </div>

        <div ref={ref} className="flex flex-col">
          {GALLERY.items.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              className="group/ref grid-ds items-baseline gap-y-2 border-t border-rule py-6 transition-colors duration-500 hover:border-ink"
            >
              <span className="col-span-full uppercase text-micro-mono text-gray-intermediate lg:col-span-1">
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <span className="col-span-full text-h4 text-pretty lg:col-span-6">{item.title}</span>
              <span className="col-span-full text-body-sm text-gray-intermediate text-pretty lg:col-span-3">
                {item.note}
              </span>
              <span className="col-span-full uppercase text-micro-mono text-gray-intermediate transition-colors duration-500 group-hover/ref:text-green-ink lg:col-span-2 lg:text-right">
                {host(item.href)}
              </span>
            </a>
          ))}
          <span aria-hidden="true" className="block h-px bg-ink" />
        </div>
      </Container>
    </section>
  );
}
