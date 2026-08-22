"use client";

import Container from "@/components/primitives/Container";
import { ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import MachineArt from "@/components/sections/protocol-labs/b/machineArt";
import {
  CAPABILITIES,
  PROOF_BY_ID,
} from "@/components/sections/protocol-labs/protocolContent";

// Alternativa B · secciones 4 a 9 — el acto entero de la página.
//
// ── Qué se está probando ───────────────────────────────────────────────────
//
// Que las seis capacidades no son seis features sino seis vistas del mismo
// objeto. El panel pegado sostiene esa pieza durante todo el tramo y la columna
// de texto la va interrogando; lo que cambia entre beats es su ESTADO, no la
// pieza.
//
// Contra la alternativa A: A gana en comparación y en búsqueda —las seis
// abiertas, escaneables, con Cmd+F— y pierde el momento. B gana el momento y
// paga con el resto: para volver a la tercera hay que recorrer el tramo otra
// vez, y quien vino por una sola de las seis pasa por las otras cinco.
//
// ── La telemetría no es decoración ────────────────────────────────────────
//
// El doc trae la franja de prueba como sección aparte. Acá las seis cifras se
// reparten entre los seis beats y aparecen junto al texto de cada uno: la que
// corresponde a lo que se está mostrando. Es lo que convierte a la franja de un
// cartel de números en la lectura de un instrumento. El emparejamiento
// capacidad→cifra vive en `protocolContent`, no acá: es un dato del contenido,
// no una decisión de este archivo.
//
// ── Sticky de CSS, nunca `pin: true` ──────────────────────────────────────
//
// El recorrido lo declara el alto de los seis bloques de texto y el panel se
// pega con `position: sticky`. ScrollTrigger solo LEE cuál de los seis cruza la
// línea de lectura. La razón larga está en `components/sections/README.md`; la
// corta es que un pin-spacer pelea con Lenis y deja spacers fantasma en
// StrictMode.
//
// ── Dos layouts, no un layout degradado ───────────────────────────────────
//
// La escena existe en desktop y con movimiento permitido. Fuera de ahí —móvil,
// `prefers-reduced-motion`, JS que no llegó— el atributo `data-scene` no se
// escribe nunca y la sección es seis entradas en flujo normal, cada una con su
// figura ya resuelta en el estado que le toca.
//
// En móvil es una decisión de layout, no una renuncia: en una sola columna el
// panel tendría que abarcar el alto de los seis bloques para poder pegarse, y
// eso o lo tapa el texto o lo deja pegado dentro de su propia celda de 40svh,
// que es la versión rota del mismo gesto.

export default function Assembly() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const track = q("[data-track]")[0];
    if (!track) return;

    const off = enableScene(track, "scene");

    // Un trigger por bloque, y no uno solo repartiendo el progreso del track:
    // los seis no miden lo mismo —el de Chain Signatures lleva tres líneas más
    // que el de Speed— y con un reparto uniforme el beat cambiaría antes o
    // después de que su texto llegue a la línea de lectura.
    const triggers = q("[data-beat-block]").map((block, i) =>
      ScrollTrigger.create({
        trigger: block,
        // 55% y no el centro exacto: el bloque que cruza la mitad de la
        // pantalla ya está saliendo cuando el ojo todavía lo está leyendo.
        start: "top 55%",
        end: "bottom 55%",
        markers: DEBUG_MARKERS,
        onToggle: (self) => {
          if (self.isActive) track.dataset.beat = String(i);
        },
      })
    );

    return () => {
      triggers.forEach((t) => t.kill());
      delete track.dataset.beat;
      off();
    };
  });

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink text-cream">
      <div
        data-track
        // Los DOS grupos van en el mismo nodo, y no es comodidad: las capas del
        // SVG consultan `group-data-[beat=N]/machine`, que Tailwind compila a
        // `.group\/machine[data-beat="N"] &` — el atributo tiene que estar en el
        // MISMO elemento que lleva la clase del grupo, no en un ancestro suyo.
        // Como `data-beat` lo escribe el efecto sobre el track, el track es
        // también el grupo de la máquina.
        //
        // `data-beat="0"` SÍ se declara en el JSX, a diferencia de `data-scene`,
        // que solo escribe el efecto: es el estado de reposo del panel —el del
        // primer paint, y el que queda si el JS no llega—. Un panel sin ningún
        // beat encendido sería una plancha vacía.
        data-beat="0"
        className="group/track group/machine relative"
      >
        <Container className="grid gap-x-16 lg:grid-cols-2">
          {/* El panel pegado. Solo existe cuando la escena está armada; su
              ausencia es lo que deja a los bloques mostrar su figura propia. */}
          <div className="hidden lg:col-start-1 lg:group-data-[scene=on]/track:block">
            <div className="sticky top-0 flex h-svh items-center">
              <MachineArt className="h-[62svh] w-full" />
            </div>
          </div>

          {/* Los seis bloques de texto: son ellos los que definen el recorrido,
              porque el track mide lo que miden ellos. */}
          <div className="lg:col-start-2">
            {CAPABILITIES.map((cap, i) => {
              const stat = PROOF_BY_ID[cap.metric];
              return (
                <article
                  key={cap.id}
                  data-beat-block
                  className="flex flex-col justify-center gap-6 py-16 lg:py-24 lg:group-data-[scene=on]/track:min-h-svh"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="uppercase text-micro-mono text-cta-mint">{cap.index}</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-cream/20" />
                    <span className="uppercase text-micro-mono text-cream/45">{cap.key}</span>
                  </div>

                  <h3 className="text-h2 text-pretty">{cap.name}</h3>
                  <p className="max-w-[38ch] text-body-lg text-cream/60 text-pretty">
                    {cap.subhead}
                  </p>
                  <p className="max-w-[52ch] text-body text-cream/80 text-pretty">{cap.body}</p>

                  {/* La misma pieza del panel, resuelta en el estado de ESTE
                      beat. Un solo archivo dibuja los dos modos, así que el
                      objeto no puede divergir entre desktop y móvil. */}
                  <div className="lg:group-data-[scene=on]/track:hidden">
                    <MachineArt beat={i} className="h-64 w-full" />
                  </div>

                  {stat && (
                    <p className="flex items-baseline gap-3 border-t border-cream/15 pt-4">
                      <span className="text-h3-serif italic text-cta-mint">{stat.value}</span>
                      <span className="uppercase text-micro-mono text-cream/50">{stat.label}</span>
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
    </section>
  );
}
