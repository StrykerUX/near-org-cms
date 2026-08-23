"use client";

import Container from "@/components/primitives/Container";
import MachineArt from "@/components/sections/protocol-labs/machineArt";
import { useActScene } from "@/components/sections/protocol-labs/useActScene";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import {
  CAPABILITIES,
  PROOF_BY_ID,
} from "@/components/sections/protocol-labs/protocolContent";

// EL ACTO · versión C — mural ────────────────────────────────────────────────
//
// Mismo mecanismo que A: el arte queda pegado y los seis bloques desfilan por su
// lado cambiando el estado de la pieza. Lo que cambia es la ENTRADA a cada
// bloque, y con ella el eje de lectura.
//
// ── La diferencia ─────────────────────────────────────────────────────────
//
// Cada parada abre con su palabra a escala de cartel —Nightshade, Resharding,
// Private— cruzando la columna. Es el único elemento de las tres versiones que
// se puede leer sin enfocar, y eso cambia lo que hace el acto: en A y B hay que
// entrar en el párrafo para saber de qué trata esta pantalla; acá se sabe de
// reojo.
//
// El nombre completo baja entonces a rótulo —«Nightshade 3.0» en mono, sobre la
// palabra— porque la palabra grande ya hizo el trabajo de titular. Dos titulares
// seguidos es lo que este layout viene a evitar.
//
// La palabra sale de `cap.key`, que existe en `protocolContent` justamente para
// esto: una sola palabra por capacidad, decidida en el contenido y no en cada
// diseño que la necesite.
//
// ── El arte va a la izquierda y el texto a la derecha, como en A ───────────
//
// A propósito: lo que se compara entre las tres es el tratamiento del texto, y
// mantener el reparto de columnas deja esa comparación limpia. La diferencia con
// A tiene que estar en la tipografía, no en dónde cae cada cosa — si además
// cambiara el lado, no se sabría cuál de las dos cosas hizo la diferencia.
//
// ── Qué paga ──────────────────────────────────────────────────────────────
//
// «Signatures» a escala de cartel ocupa media columna y empuja el párrafo hacia
// abajo; en pantallas cortas el bloque puede no entrar entero en su parada. El
// tamaño va con `text-poster` y no con `text-mural` justamente por eso — mural
// es una escala pensada para una palabra sola en una pantalla, no para una que
// encabeza un párrafo.
export default function AssemblyBand() {
  const rootRef = useActScene();

  return (
    <section ref={rootRef} className="bg-cream">
      <div data-act-frame data-nav-dark className="bg-ink text-cream">
        <div data-track data-beat="0" className="group/track group/machine relative">
          <Container data-act-container className="grid-ds">
            {/* El panel pegado. Solo existe cuando la escena está armada; su
                ausencia es lo que deja a los bloques mostrar su figura propia. */}
            <div className="hidden lg:col-start-1 lg:col-span-6 lg:group-data-[scene=on]/track:block">
              <div data-act-stick className="sticky top-0 flex h-svh items-center">
                {/* El envoltorio existe para poder desplazar la pieza durante la
                    intro sin tocar el `sticky` de su padre: un `transform` sobre
                    el elemento pegado lo convierte en su propio contenedor de
                    posicionamiento y deja de pegarse. */}
                <div data-act-art className="w-full">
                  <MachineArt className="h-[70svh] w-full" />
                </div>
              </div>
            </div>

            <div className="col-span-full lg:col-start-8 lg:col-span-5">
              {CAPABILITIES.map((cap, i) => {
                const stat = PROOF_BY_ID[cap.metric];
                return (
                  <article
                    key={cap.id}
                    id={cap.id}
                    data-beat-block
                    data-act-copy
                    className="flex scroll-mt-[var(--site-header-block)] flex-col justify-center gap-6 py-16 lg:py-24 lg:group-data-[scene=on]/track:min-h-svh"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-4">
                        <span className="uppercase text-micro-mono text-cta-mint">
                          {cap.index}
                        </span>
                        <span aria-hidden="true" className="h-px flex-1 bg-cream/20" />
                      </div>
                      {/* La palabra. `text-balance` porque `Signatures` y
                          `Resharding` no parten bien solas a este cuerpo. */}
                      <p className="text-poster text-cream text-balance">{cap.key}</p>
                      {/* El nombre completo, a rótulo. Sobre la palabra sería
                          otro titular; debajo y en mono es lo que la nombra. */}
                      <p className="uppercase text-body-sm-mono text-cream/50">{cap.name}</p>
                    </div>

                    <p className="max-w-[28ch] text-h3-serif italic text-cta-mint">
                      {cap.subhead}
                    </p>
                    <p className="max-w-[48ch] text-body text-cream/70 text-pretty">{cap.body}</p>

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
