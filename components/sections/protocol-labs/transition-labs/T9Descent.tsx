"use client";

import Container from "@/components/primitives/Container";
import { ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T9 · Descent — de una cifra a pantalla completa, a la fila. ~100svh × 7
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// La transición es un descenso. Cada cifra ocupa la pantalla entera, sola, a
// escala de cartel; se pasa a la siguiente; y al final las seis se contraen a la
// fila compacta que introduce el contenido. El lector entra por una afirmación y
// sale con un encabezado de datos — la transición lo lleva de un registro al
// otro.
//
// Es la única de las doce que le da a cada cifra un momento propio. Ese es su
// argumento y su costo: seis pantallas para seis datos es mucho recorrido, y sólo
// se paga si el equipo cree que estos seis números son lo más importante de la
// página.
//
// ── El séptimo estado no es un detalle, es el punto ───────────────────────
//
// Sin él, esto sería un carrusel de cifras y terminaría con la sexta llenando la
// pantalla — o sea, dejando al lector arriba en vez de entregándolo abajo. El
// último beat las junta a las seis en la fila que la sección siguiente va a
// tener por encabezado, así que el descenso **aterriza**.
//
// ── Sticky de CSS, nunca `pin: true` ──────────────────────────────────────
//
// El recorrido lo declara el alto del track y el panel se pega con
// `position: sticky`; ScrollTrigger sólo LEE en qué tramo está. Un pin-spacer
// pelea con Lenis y deja spacers fantasma en StrictMode — el razonamiento largo
// está en `components/sections/README.md`.
//
// ── La degradación es un layout, no una versión pobre ────────────────────
//
// `data-scene` lo escribe sólo el efecto. Sin JS, en móvil o con
// `prefers-reduced-motion`, el atributo no existe: el track pierde su alto, el
// panel deja de pegarse y las siete pantallas se convierten en una fila de seis
// cifras. Que es, exactamente, el séptimo estado.

// Siete tramos: seis cifras y el aterrizaje. Cada uno mide una pantalla.
const BEATS = PROOF.length + 1;

export default function T9Descent() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const track = q("[data-track]")[0];
    if (!track) return;

    const off = enableScene(track, "scene");

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      markers: DEBUG_MARKERS,
      onUpdate: (self) => {
        // `min` y no un clamp por redondeo: en `progress === 1` exacto,
        // `floor(1 * 7)` da 7, que es un beat que no existe.
        const beat = Math.min(BEATS - 1, Math.floor(self.progress * BEATS));
        track.dataset.beat = String(beat);
      },
    });

    return () => {
      trigger.kill();
      delete track.dataset.beat;
      off();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream text-foreground">
      <div
        data-track
        data-beat="0"
        // El alto sale de una variable para que el número de tramos y el
        // recorrido no puedan desincronizarse: cambiar `BEATS` cambia los dos.
        style={{ "--beats": BEATS } as React.CSSProperties}
        className="group/track relative data-[scene=on]:h-[calc(var(--beats)*100svh)]"
      >
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          <Container className="relative">
            {/* Las seis, superpuestas. Sólo la del beat activo está visible; el
                resto espera con opacidad cero y un desplazamiento hacia abajo,
                así que el paso de una a otra se lee como un descenso y no como
                un fundido. */}
            <div className="relative flex min-h-[46svh] items-center justify-center">
              {PROOF.map((stat, i) => (
                <div
                  key={stat.id}
                  className={`absolute flex flex-col items-center gap-4 text-center transition-all duration-700 ease-out ${BEAT_STATE[i]}`}
                >
                  <p className="text-display tabular-nums">{stat.value}</p>
                  <p className="uppercase text-eyebrow-mono text-gray-intermediate">
                    {stat.label}
                  </p>
                  {stat.note && (
                    <p className="text-body text-gray-intermediate">{stat.note}</p>
                  )}
                </div>
              ))}

              {/* El aterrizaje: las seis juntas, en la forma que la sección de
                  abajo va a heredar. */}
              <dl
                className={`absolute inset-x-0 grid grid-cols-2 gap-x-8 gap-y-6 transition-all duration-700 ease-out sm:grid-cols-3 lg:grid-cols-6 ${LANDING}`}
              >
                {PROOF.map((stat) => (
                  <div key={stat.id} className="flex flex-col gap-1 border-t border-ink pt-3">
                    <dd className="text-h3 tabular-nums">{stat.value}</dd>
                    <dt className="uppercase text-micro-mono text-gray-intermediate">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

// Una clase por beat, escritas literales: Tailwind v4 no ve las clases armadas en
// tiempo de ejecución, y una cadena construida sale del CSS sin avisar.
//
// El estado de reposo (`opacity-0 translate-y-6`) es el de ABAJO, no el de
// arriba: cada cifra sube a su lugar y la anterior sigue subiendo al salir, así
// que el conjunto se lee como una caída continua y no como seis apariciones.
const BEAT_STATE = [
  "opacity-0 translate-y-6 group-data-[beat=0]/track:opacity-100 group-data-[beat=0]/track:translate-y-0",
  "opacity-0 translate-y-6 group-data-[beat=1]/track:opacity-100 group-data-[beat=1]/track:translate-y-0",
  "opacity-0 translate-y-6 group-data-[beat=2]/track:opacity-100 group-data-[beat=2]/track:translate-y-0",
  "opacity-0 translate-y-6 group-data-[beat=3]/track:opacity-100 group-data-[beat=3]/track:translate-y-0",
  "opacity-0 translate-y-6 group-data-[beat=4]/track:opacity-100 group-data-[beat=4]/track:translate-y-0",
  "opacity-0 translate-y-6 group-data-[beat=5]/track:opacity-100 group-data-[beat=5]/track:translate-y-0",
] as const;

// El aterrizaje al revés: visible por defecto —que es lo que se ve sin JS y con
// reduced-motion— y oculto sólo mientras la escena está armada y no le toca.
const LANDING =
  "group-data-[scene=on]/track:opacity-0 group-data-[scene=on]/track:translate-y-6 group-data-[beat=6]/track:opacity-100 group-data-[beat=6]/track:translate-y-0";
