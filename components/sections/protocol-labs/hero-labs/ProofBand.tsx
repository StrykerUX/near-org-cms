"use client";

import Container from "@/components/primitives/Container";
import { ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// La franja de prueba CUANDO VIVE FUERA DEL HERO.
//
// Cuatro de las ocho variantes de hero sacan las seis cifras de arriba, y esa
// decisión abre una pregunta que el hero solo no contesta: si la evidencia no
// está en la primera pantalla, ¿dónde está y cómo se llega? Esta sección es la
// respuesta, y tiene dos formas porque las variantes piden dos cosas distintas:
//
//   · `band`   — banda normal, inmediatamente después del hero. La evidencia es
//                lo primero que aparece al moverse.
//   · `sticky` — la misma banda pegada bajo el header durante el primer tramo de
//                la página. La evidencia deja de ser un momento y pasa a ser una
//                referencia disponible mientras se lee.
//
// `sticky` es el que hay que mirar con cuidado: una barra que persiste come alto
// útil y convive con un nav que ya es fijo. Por eso se suelta —dura un tramo, no
// toda la página— y por eso baja de aire al pegarse. Si aun así estorba, la
// respuesta es `band`; afinar el umbral no arregla un patrón que no cabe.
//
// Sticky de CSS y ScrollTrigger de solo lectura, nunca `pin: true` — mismo
// contrato que el resto de las secciones pegadas del repo.

export default function ProofBand({
  mode = "band",
  tone = "light",
}: {
  mode?: "band" | "sticky";
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const stickyMode = mode === "sticky";

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    if (!stickyMode) return;

    const bar = scope.querySelector<HTMLElement>("[data-bar]");
    if (!bar) return;

    // El trigger no anima nada: enciende un atributo mientras la barra está
    // pegada, y el atributo es lo que la comprime. Sin JS la barra sigue siendo
    // sticky (lo hace el navegador) y simplemente no cambia de aire.
    const trigger = ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom top",
      markers: DEBUG_MARKERS,
      onToggle: (self) => {
        bar.dataset.stuck = self.isActive ? "on" : "off";
      },
    });

    return () => {
      trigger.kill();
      delete bar.dataset.stuck;
    };
  }, [stickyMode]);

  return (
    <section
      ref={rootRef}
      {...(dark ? { "data-nav-dark": "" } : {})}
      className={`${stickyMode ? "relative" : ""} ${
        dark ? "bg-ink text-cream" : "bg-background text-foreground"
      }`}
    >
      <div
        data-bar
        // El padding va en ESTE nodo y no en el Container: `data-stuck` lo
        // escribe el efecto acá, y una utilidad `data-[stuck=on]:` puesta en un
        // hijo no ve el atributo del padre — necesitaría `group-data-`, que es
        // un grupo de más para un solo valor.
        className={
          stickyMode
            ? "sticky top-[var(--site-header-block)] z-10 py-10 transition-[padding] duration-500 data-[stuck=on]:py-5"
            : "py-10 lg:py-14"
        }
      >
        <Container>
          <dl
            className={`grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-6 sm:grid-cols-3 lg:grid-cols-6 ${
              dark ? "border-cream/25" : "border-ink"
            }`}
          >
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-1">
                <dd className="text-h4">{stat.value}</dd>
                <dt
                  className={`uppercase text-micro-mono ${
                    dark ? "text-cream/50" : "text-gray-intermediate"
                  }`}
                >
                  {stat.label}
                </dt>
                {stat.note && (
                  <dd
                    className={`text-micro-mono ${
                      dark ? "text-cream/40" : "text-gray-intermediate"
                    }`}
                  >
                    {stat.note}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </Container>
      </div>

      {/* El recorrido del sticky: cuánto persiste la barra. Va como bloque vacío
          y no como `min-h` de la sección porque el sticky tiene que poder
          soltarse cuando el track se agota, y una sección alta con la barra
          adentro haría exactamente eso — pero sin dejar ver dónde termina. */}
      {stickyMode && <div aria-hidden="true" className="h-[70svh]" />}
    </section>
  );
}
