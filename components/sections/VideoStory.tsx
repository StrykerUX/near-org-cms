"use client";

import { Play } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

export default function VideoStory() {
  // El ref del reveal va en un wrapper NO visual: gsap.utils.selector(scope)
  // busca descendientes de scope, así que `data-reveal` no puede vivir en el
  // mismo nodo que el ref o el selector nunca lo encuentra.
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    // El pt grande es el aire con ProofStats, que termina justo donde se
    // despega su sección pegada. Va acá y NO como pb de ProofStats a
    // propósito: agrandar esa sección movería el `end: "bottom bottom"` de su
    // ScrollTrigger y correría los umbrales de sus 5 steps.
    // El pb grande reemplaza el aire que aportaba el ZigguratDivider que se
    // quitó (medía 112-160px): sin él, el corte al negro quedaba pegado a la
    // card del video.
    <section className="bg-background pt-32 pb-28 md:pt-48 md:pb-36">
      <Container>
        <div ref={rootRef}>
          <div
            data-reveal
            className="relative aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] border border-border sm:aspect-[21/10]"
          >
            {/* Sin asset de video real (fuera de alcance de este draft): el
                interior es un gris sólido, sin gradiente ni animación. */}
            <div className="absolute inset-0 bg-neutral-400" />

            {/* El degradado sí se queda: es lo que hace legible el texto
                blanco de abajo sobre el gris. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <button
              type="button"
              className="group absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4 text-label text-black shadow-lg transition-transform hover:scale-105 sm:left-8 sm:top-8"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:scale-110">
                <Play className="size-3.5" fill="currentColor" />
              </span>
              watch
            </button>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-white sm:p-10">
              <h2 className="text-h2 text-pretty">
                The worlds you build
                <br />
                <Accent>should be yours to own.</Accent>
              </h2>
              <p className="max-w-md text-body-sm text-white/70 text-pretty">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
