"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { GALLERY } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa C · sección 14 — las lecturas.
//
// Cinco entradas en serif, numeradas, sin flecha ni disco: en un texto, un
// enlace no necesita un botón para anunciarse. El subrayado aparece al hover y
// el número queda fijo a la izquierda, que es lo que hace que la lista se lea
// como el final de un documento y no como cinco llamados a la acción.
//
// Es la tercera respuesta al mismo bloque: A lo trata como apéndice tabulado con
// el host de cada fuente a la derecha, B como cinco filas anchas con disco de
// flecha, C como bibliografía.
export default function Reading() {
  const ref = useScrollReveal<HTMLOListElement>({ y: 16, stagger: 0.07 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="py-28 lg:py-36">
        <div className="grid-ds gap-y-12">
          <div className="col-span-full flex flex-col gap-3 lg:col-span-4">
            <h2 className="text-h2 text-pretty">
              {GALLERY.title.lead} <Accent>{GALLERY.title.accent}</Accent>
            </h2>
            <p className="text-body text-ink-soft text-pretty">{GALLERY.subhead}</p>
          </div>

          <ol ref={ref} className="col-span-full flex flex-col lg:col-start-6 lg:col-span-7">
            {GALLERY.items.map((item, i) => (
              <li key={item.href} data-reveal>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/read flex gap-6 border-t border-rule py-6 lg:gap-10"
                >
                  <span className="uppercase text-micro-mono text-gray-intermediate">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1.5">
                    {/* El subrayado con `decoration-*` y no un borde: sigue la
                        forma del texto en varias líneas, que es lo que un borde
                        inferior no puede hacer. */}
                    <span className="text-h3-serif italic underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors duration-500 group-hover/read:decoration-green-ink">
                      {item.title}
                    </span>
                    <span className="text-body-sm text-gray-intermediate text-pretty">
                      {item.note}
                    </span>
                  </span>
                </a>
              </li>
            ))}
            <span aria-hidden="true" className="block h-px bg-rule" />
          </ol>
        </div>
      </Container>
    </section>
  );
}
