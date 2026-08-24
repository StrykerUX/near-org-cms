"use client";

import Container from "@/components/primitives/Container";
import MachineArt from "@/components/sections/protocol-labs/machineArt";
import { useActScene } from "@/components/sections/protocol-labs/useActScene";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import {
  CAPABILITIES,
  PROOF_BY_ID,
} from "@/components/sections/protocol-labs/protocolContent";

// EL ACTO · versión B — telón ────────────────────────────────────────────────
//
// Mismo mecanismo que A: el arte queda pegado y los seis bloques de texto
// desfilan por delante, cambiando su estado al pasar. Lo que cambia es DÓNDE
// está el arte.
//
// ── La diferencia ─────────────────────────────────────────────────────────
//
// En A el arte vive en su media columna y el texto en la otra: son dos vecinos.
// Acá el arte ocupa la pantalla ENTERA, atenuado, y el texto pasa por encima en
// una sola columna estrecha. Deja de ser un vecino y pasa a ser el fondo sobre
// el que se lee.
//
// Es lo que la superficie del hero hace en las tres páginas —correr entera
// detrás del texto— aplicado al diagrama. Y contesta una pregunta que A no
// puede: si la pieza aguanta ser lo primero que se ve en cada pantalla del acto,
// a tamaño grande, o si a esa escala se convierte en ruido detrás de un párrafo.
//
// ── Los dos costes, y cómo se pagan ───────────────────────────────────────
//
// **Contraste.** Un diagrama de hairlines detrás de texto le roba legibilidad al
// texto y al revés. Se paga con dos cosas: el arte baja a un 45% de opacidad, y
// la columna de lectura lleva un velo de tinta local —radial, no una capa plana
// sobre todo— que despeja justo donde caen las líneas y deja el resto del
// diagrama a plena vista.
//
// **El diagrama queda descentrado respecto de su lector.** Con el texto a la
// derecha, la mitad interesante de la figura tiene que caer a la izquierda; por
// eso el arte se corre un 12% en esa dirección en vez de quedar centrado en el
// viewport. Centrado, la pieza queda justo detrás del párrafo.
export default function AssemblyOrbit() {
  const rootRef = useActScene();

  return (
    <section ref={rootRef} className="bg-cream">
      <div data-act-frame data-nav-dark className="bg-ink text-cream">
        <div data-track data-beat="0" className="group/track group/machine relative">
          {/* El telón. Va antes que los bloques y fuera de ellos: un sticky se
              pega respecto de su contenedor, y dentro de un bloque de texto se
              despegaría al terminar ese bloque.

              `pointer-events-none` porque es fondo: el texto que pasa por encima
              lleva enlaces, y una capa a pantalla completa sobre ellos se los
              comería. */}
          <div className="pointer-events-none absolute inset-0 hidden lg:group-data-[scene=on]/track:block">
            <div data-act-stick className="sticky top-0 flex h-svh items-center overflow-hidden">
              <div data-act-art className="h-[86svh] w-full -translate-x-[12%] opacity-45">
                <MachineArt className="h-full w-full" />
              </div>
            </div>
          </div>

          <Container data-act-container className="relative grid-ds">
            <div className="col-span-full lg:col-start-8 lg:col-span-5">
              {CAPABILITIES.map((cap, i) => {
                const stat = PROOF_BY_ID[cap.metric];
                return (
                  <article
                    key={cap.id}
                    id={cap.id}
                    data-beat-block
                    data-act-copy
                    className="relative flex scroll-mt-[var(--site-header-block)] flex-col justify-center gap-5 py-16 lg:py-24 lg:group-data-[scene=on]/track:min-h-svh"
                  >
                    {/* El velo de legibilidad, por bloque y no una capa sobre la
                        sección: sigue al texto pantalla por pantalla y deja el
                        resto del diagrama sin apagar. Radial y sobredimensionado
                        —`-inset-x-16`— para que su borde caiga fuera de la
                        columna y no se vea el corte. */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-x-16 -inset-y-4 -z-10 hidden lg:group-data-[scene=on]/track:block"
                      style={{
                        background:
                          "radial-gradient(ellipse 62% 46% at 55% 50%, rgba(16,16,16,0.92) 0%, rgba(16,16,16,0.72) 55%, transparent 84%)",
                      }}
                    />

                    <div className="flex items-baseline gap-4">
                      <span className="uppercase text-micro-mono text-cta-mint">{cap.index}</span>
                      <span aria-hidden="true" className="h-px flex-1 bg-cream/20" />
                      <span className="uppercase text-micro-mono text-cream/45">{cap.key}</span>
                    </div>

                    <h3 className="text-h3">{cap.name}</h3>
                    <p className="max-w-[30ch] text-h3-serif italic text-cta-mint">
                      {cap.subhead}
                    </p>
                    <p className="max-w-[46ch] text-body-lg text-cream/75 text-pretty">
                      {cap.body}
                    </p>

                    {/* La misma pieza, resuelta en el estado de ESTE beat, para
                        el layout en flujo — móvil y `prefers-reduced-motion`. */}
                    <div className="lg:group-data-[scene=on]/track:hidden">
                      <MachineArt beat={i} className="h-72 w-full" />
                    </div>

                    {stat && (
                      <p className="flex items-baseline gap-3 border-t border-cream/15 pt-4">
                        <span className="text-h3-serif italic text-cta-mint">{stat.value}</span>
                        <span className="uppercase text-micro-mono text-cream/50">
                          {stat.label}
                        </span>
                      </p>
                    )}

                    {cap.link && (
                      <a
                        href={cap.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-q-arrow-host
                        className="flex w-fit items-center gap-3 text-label text-cream"
                      >
                        <ArrowCircle />
                        {cap.link.label}
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
