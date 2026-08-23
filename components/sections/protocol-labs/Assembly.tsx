"use client";

import Container from "@/components/primitives/Container";
import MachineArt from "@/components/sections/protocol-labs/machineArt";
import { useActScene } from "@/components/sections/protocol-labs/useActScene";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import {
  CAPABILITIES,
  PROOF_BY_ID,
} from "@/components/sections/protocol-labs/protocolContent";

// EL ACTO · versión A — riel de progreso ────────────────────────────────────
//
// Las seis capacidades del protocolo como seis vistas del MISMO objeto: el
// panel pegado sostiene la pieza durante todo el tramo y la columna de texto la
// va interrogando. Lo que cambia entre paradas es su estado, no la pieza.
//
// ── El layout, y de dónde sale ────────────────────────────────────────────
//
// Tres columnas de contenido sobre la retícula de doce: el riel (1), el arte
// (2–6) y el texto (8–12).
//
// El **riel** es el patrón del eje de `homepage-update/ProofDatum` girado: una
// línea con seis marcas donde la activa se enciende. Lo que aporta no es
// decoración — es lo único que responde "cuántas van y cuántas faltan", que en
// un tramo pegado de seis pantallas es la pregunta que el lector se hace y la
// versión anterior no contestaba. Sin él, el acto es un pasillo sin puertas.
//
// El **índice a escala de titular** viene de las entradas de ensayo del lab de
// alternativas: un número grande es un ancla de lectura mucho más barata que un
// rótulo, y deja el nombre de la capacidad libre para ser lo segundo que se lee
// y no lo tercero.
//
// ── La jerarquía del bloque de texto ──────────────────────────────────────
//
// Cambió, y por un motivo concreto: antes el `subhead` iba en `text-body-lg`
// justo debajo del nombre, y los dos competían — el nombre decía "Nightshade
// 3.0" y la línea siguiente, del mismo peso visual, decía "Stateless validation
// is here", que es igual de titular. Ahora el subhead sube a serif itálica y el
// nombre baja de `text-h2` a `text-h3`: dejan de ser dos titulares seguidos y
// pasan a ser un nombre y su afirmación, que es lo que son.
export default function Assembly() {
  const rootRef = useActScene();

  return (
    <section ref={rootRef} className="bg-cream">
      {/* La caja. Es lo que se recorta al entrar y lo único oscuro de la
          sección, así que también es lo que invierte el nav: con `data-nav-dark`
          en la sección, el header se pondría claro sobre el crema de los
          márgenes. */}
      <div data-act-frame data-nav-dark className="bg-ink text-cream">
        <div
          data-track
          // Los DOS grupos van en el mismo nodo, y no es comodidad: las capas
          // del SVG consultan `group-data-[beat=N]/machine`, que Tailwind
          // compila a `.group\/machine[data-beat="N"] &` — el atributo tiene que
          // estar en el MISMO elemento que lleva la clase del grupo, no en un
          // ancestro suyo.
          //
          // `data-beat="0"` sí se declara en el JSX, a diferencia de
          // `data-scene`: es el estado de reposo del panel —el del primer paint,
          // y el que queda si el JS no llega—. Un panel sin ningún beat
          // encendido sería una plancha vacía.
          data-beat="0"
          className="group/track group/machine relative"
        >
          <Container data-act-container className="grid-ds">
            {/* ── El riel ────────────────────────────────────────────────────
                Sólo con la escena armada: en flujo, sin panel pegado, un riel
                de progreso no tiene contra qué progresar. */}
            <div className="hidden lg:col-start-1 lg:col-span-1 lg:group-data-[scene=on]/track:block">
              <div className="sticky top-0 flex h-svh flex-col justify-center gap-4">
                {CAPABILITIES.map((cap, i) => (
                  <div key={cap.id} className="flex items-center gap-3">
                    {/* La marca. Un filete que se alarga y se enciende: el
                        cambio de LARGO es lo que se ve de reojo, y el de color
                        lo que confirma cuál es. Sólo color sería invisible en
                        una barra lateral que nadie está mirando. */}
                    <span
                      aria-hidden="true"
                      className={`block h-px w-4 transition-all duration-500 ${RAIL[i]}`}
                    />
                    <span
                      className={`uppercase text-micro-mono transition-colors duration-500 ${RAIL_LABEL[i]}`}
                    >
                      {cap.index}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── El panel pegado ────────────────────────────────────────── */}
            <div className="hidden lg:col-start-2 lg:col-span-5 lg:group-data-[scene=on]/track:block">
              <div data-act-stick className="sticky top-0 flex h-svh items-center">
                {/* El envoltorio existe para poder desplazar la pieza durante la
                    intro sin tocar el `sticky` de su padre: un `transform` sobre
                    el elemento pegado lo convierte en su propio contenedor de
                    posicionamiento y deja de pegarse. */}
                <div data-act-art className="w-full">
                  <MachineArt className="h-[66svh] w-full" />
                </div>
              </div>
            </div>

            {/* ── Los seis bloques ───────────────────────────────────────── */}
            <div className="col-span-full lg:col-start-8 lg:col-span-5">
              {CAPABILITIES.map((cap, i) => {
                const stat = PROOF_BY_ID[cap.metric];
                return (
                  <article
                    key={cap.id}
                    // `id` para poder enlazar una capacidad concreta desde
                    // fuera. `scroll-mt` es su complemento obligatorio: el nav
                    // es fijo, y sin ese margen el ancla deja el título tapado
                    // por la barra. Los dos juntos o ninguno.
                    id={cap.id}
                    data-beat-block
                    data-act-copy
                    className="flex scroll-mt-[var(--site-header-block)] flex-col justify-center gap-5 py-16 lg:py-24 lg:group-data-[scene=on]/track:min-h-svh"
                  >
                    <span className="text-h1 text-cream/15">{cap.index}</span>

                    <div className="flex flex-col gap-3">
                      <h3 className="text-h3">{cap.name}</h3>
                      {/* Serif itálica y no `text-body-lg`: el subhead es una
                          afirmación, no un párrafo, y en sans del mismo cuerpo
                          que el body se leía como la primera línea de éste. */}
                      <p className="max-w-[30ch] text-h3-serif italic text-cta-mint">
                        {cap.subhead}
                      </p>
                    </div>

                    <p className="max-w-[52ch] text-body-lg text-cream/70 text-pretty">
                      {cap.body}
                    </p>

                    {/* La misma pieza del panel, resuelta en el estado de ESTE
                        beat. Un solo archivo dibuja los dos modos, así que el
                        objeto no puede divergir entre desktop y móvil. */}
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

// Mapas literales de clases por beat. Nunca un template string: Tailwind v4 no
// detecta las clases construidas en tiempo de ejecución y las purga del CSS —
// el riel se apagaría entero, y sólo en producción.
const RAIL = [
  "bg-cream/25 group-data-[beat=0]/track:w-10 group-data-[beat=0]/track:bg-cta-lime",
  "bg-cream/25 group-data-[beat=1]/track:w-10 group-data-[beat=1]/track:bg-cta-lime",
  "bg-cream/25 group-data-[beat=2]/track:w-10 group-data-[beat=2]/track:bg-cta-lime",
  "bg-cream/25 group-data-[beat=3]/track:w-10 group-data-[beat=3]/track:bg-cta-lime",
  "bg-cream/25 group-data-[beat=4]/track:w-10 group-data-[beat=4]/track:bg-cta-lime",
  "bg-cream/25 group-data-[beat=5]/track:w-10 group-data-[beat=5]/track:bg-cta-lime",
] as const;

const RAIL_LABEL = [
  "text-cream/30 group-data-[beat=0]/track:text-cta-lime",
  "text-cream/30 group-data-[beat=1]/track:text-cta-lime",
  "text-cream/30 group-data-[beat=2]/track:text-cta-lime",
  "text-cream/30 group-data-[beat=3]/track:text-cta-lime",
  "text-cream/30 group-data-[beat=4]/track:text-cta-lime",
  "text-cream/30 group-data-[beat=5]/track:text-cta-lime",
] as const;
