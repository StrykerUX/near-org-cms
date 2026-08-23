"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import StackAssembly, { type StackStop } from "@/components/sections/homepage-e/stackAssembly";
import StackCursorTag from "@/components/sections/homepage-e/StackCursorTag";
import { useStackScene } from "@/components/sections/homepage-e/useStackScene";
import {
  AI_BLOCK,
  INTENTS_BLOCK,
  NEARCOM_BLOCK,
  PROTOCOL_BLOCK,
  PROTOCOL_FEATURES,
  STACK_CAPABILITIES,
  STACK_NOTES,
  STACK_PIECES,
  STACK_INTRO as INTRO,
} from "@/components/sections/homepage-e/nearStackContent";

// El NEAR Stack rehecho contra el audit de carga cognitiva.
//
// Es la **solución B** de ese audit —integración física— aplicada sobre la
// misma escena, el mismo arte y el mismo recorrido que `StackAnchors`. Lo que
// cambia es dónde está cada cosa y a qué distancia del ojo.
//
// ── Los tres problemas que resuelve, y cómo ─────────────────────────────────
//
// **1. Atención dividida.** En `StackAnchors` el arte vive en el centro y los
// cuatro textos en las esquinas: para saber qué pieza corresponde a qué párrafo
// hay que cruzar la pantalla con la mirada y sostener lo visto en memoria de
// trabajo. Es el *split-attention effect* en su forma de manual, y la solución
// canónica es la que está acá: los rótulos se PEGAN a su pieza, con una línea
// guía corta, como en un despiece técnico. La sacada pasa de media pantalla a
// dos centímetros.
//
// El párrafo largo no cabe pegado —sería un muro sobre el arte— así que va a un
// panel de POSICIÓN FIJA debajo, que cambia de contenido con la capa activa.
// Una sola posición que el ojo aprende en la primera parada, en vez de cuatro
// que hay que redescubrir.
//
// **2. Las 24 etiquetas.** Las seis capacidades estaban repetidas en las cuatro
// fichas, con la idea de que la repetición fuera el mensaje. El *redundancy
// effect* dice lo contrario: la información repetida aumenta la carga, porque
// el lector no puede asumir que dos bloques son idénticos sin compararlos — se
// leen 24 para descubrir que había que leer 6. Acá se declaran UNA vez, al pie,
// y el mensaje se dice explícito («todas las capas, sin excepción») en vez de
// dejarlo inferir por repetición.
//
// **3. Contenido escondido en hover.** Los seis features del protocolo solo
// existían al pasar el puntero sobre los cubos: inalcanzables por teclado y en
// táctil. Ahora están en el panel, como texto.
//
// ── Contraste: el estado NO se dice con opacidad ────────────────────────────
//
// El mecanismo de `StackAnchors` —atenuar lo que no está activo— es lo que
// rompía 1.4.3. Los valores apagados (`cream/25` a `cream/45`) dan entre 2.1:1
// y 3.2:1 sobre `--ink`, muy por debajo del 4.5:1 de AA, y subirlos hasta que
// pasen elimina la distinción que justificaba atenuarlos.
//
// Acá el estado va por otros dos canales: **presencia** (el panel muestra solo
// la capa activa; no hay tres párrafos apagados compitiendo) y **marca** (el
// rótulo activo suma un punto verde y una línea más gruesa). Los rótulos
// inactivos viven en `cream/70` —~8.5:1, cómodo AA— así que se leen todos, y
// lo que los distingue no es cuánta tinta tienen.
//
// Eso además cierra 1.4.1 (uso del color): el estado se percibe sin depender de
// distinguir dos grises.

/* ── Dónde se ancla cada rótulo ──────────────────────────────────────────── */

// En % de la caja del arte, calibrado contra la geometría de `stackAssembly`
// (`POS`, en el espacio de 695×650) y ajustado a ojo contra la pieza dibujada:
// los valores del `POS` son la caja del SVG, no el trazo visible, y entre una
// cosa y otra hay bastante aire.
//
// `side` alterna para que no se apilen dos líneas guía en el mismo margen, y el
// orden vertical sigue el del stack de afuera hacia adentro — la cáscara arriba
// y la columna abajo, que es como el arte se lee.
//
// Calibrarlos tiene dos restricciones que tiran en direcciones opuestas, y por
// eso los valores no salen de la geometría sola:
//
//  · **Cerca**, porque la cercanía es el punto entero de este layout. Un rótulo
//    lejos de su pieza es la esquina de `StackAnchors` con otro nombre.
//  · **Fuera del trazo**, porque las tres capas exteriores son hexágonos
//    ANIDADOS: un rótulo puesto donde su pieza tiene borde cae encima del arte
//    y deja de leerse.
//
// Lo que las concilia es que los anillos no solo son concéntricos sino que
// están escalonados en altura (ver `POS` en `stackAssembly`): la cáscara
// arriba, AI en el medio, Intents abajo. Cada `y` apunta a la banda donde su
// capa manda, y la `x` sale justo del arte hacia el margen más libre. La línea
// guía cubre el resto.
//
// Son cuatro pares de números y se mueven mirando, no calculando.
type LayerKey = "nearcom" | "ai" | "intents" | "protocol";

const ANCHORS: readonly {
  key: LayerKey;
  label: string;
  x: number;
  y: number;
  side: "left" | "right";
}[] = [
  { key: "nearcom", label: "NEAR.com", x: 82, y: 30, side: "right" },
  { key: "ai", label: AI_BLOCK.name, x: 20, y: 46, side: "left" },
  { key: "intents", label: INTENTS_BLOCK.name, x: 82, y: 63, side: "right" },
  { key: "protocol", label: PROTOCOL_BLOCK.name, x: 44, y: 90, side: "left" },
];

/** El contenido del panel, por capa. */
const PANELS: Record<LayerKey, { name: string; body: string; href?: string; items: readonly string[] }> = {
  protocol: {
    name: PROTOCOL_BLOCK.name,
    body: PROTOCOL_BLOCK.body,
    href: PROTOCOL_BLOCK.link?.href,
    // Los seis features, por fin visibles. Solo los nombres: el panel tiene
    // alto fijo y seis descripciones lo desbordarían — pero que existan y se
    // puedan leer sin puntero es lo que cierra 2.1.1.
    items: PROTOCOL_FEATURES.map((f) => f.name),
  },
  intents: {
    name: INTENTS_BLOCK.name,
    body: INTENTS_BLOCK.body,
    href: INTENTS_BLOCK.link?.href,
    items: STACK_PIECES.intents ?? [],
  },
  ai: {
    name: AI_BLOCK.name,
    body: AI_BLOCK.intro,
    href: AI_BLOCK.link?.href,
    items: STACK_PIECES.ai ?? [],
  },
  nearcom: {
    name: NEARCOM_BLOCK.name,
    body: NEARCOM_BLOCK.body,
    href: NEARCOM_BLOCK.link?.href,
    items: [],
  },
};

const TRAVEL = "200svh";

export default function StackAtlas() {
  const { rootRef, stageRef, stage, stop, hover, enhanced, goTo, stageProps, tagRef } =
    useStackScene();
  const entryRef = useEntry();

  // La capa activa: la parada del recorrido, con las tres sub-paradas de AI
  // plegadas a su capa. Antes de arrancar, la primera — el panel nunca está
  // vacío, porque un panel vacío es un hueco que el lector tiene que explicarse.
  const active: LayerKey = (() => {
    if (!stop) return "protocol";
    if (stop === "intents" || stop === "nearcom" || stop === "protocol") return stop;
    return "ai";
  })();

  const panel = PANELS[active];

  return (
    <>
      <section
        ref={rootRef}
        style={{ "--travel": TRAVEL } as React.CSSProperties}
        className="group/atlas relative bg-ink text-cream data-[mode=track]:h-[calc(var(--travel)+100svh)]"
      >
        <div className="relative overflow-hidden group-data-[mode=track]/atlas:sticky group-data-[mode=track]/atlas:top-0 group-data-[mode=track]/atlas:h-svh">
          {/* El halo, igual que en la escena original: sobre negro plano el arte
              flota en el vacío, y un objeto que no está EN ningún sitio se lee
              como un recorte pegado encima. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[30svh] bg-[radial-gradient(circle_at_50%_50%,rgba(0,220,141,0.13)_0%,rgba(0,220,141,0.05)_22%,rgba(0,220,141,0.015)_34%,rgba(16,16,16,0)_46%)]"
          />

          <Container className="relative flex h-full flex-col py-8 group-data-[mode=track]/atlas:pt-[calc(var(--site-header-block)+1rem)]">
            {/* El encabezado, en la misma posición y al mismo tamaño en que la
                obertura (`StackOverture`) deja el suyo: el relevo entre los dos
                no se ve. */}
            <div className="shrink-0 pb-4 text-center lg:pb-6">
              <h2 className="text-h2 text-balance">
                {INTRO.lead} <Accent>{INTRO.accent}</Accent>
              </h2>
              <p className="mx-auto max-w-[42ch] text-body text-cream/70 text-balance">
                {INTRO.sub}
              </p>
            </div>

            {/* ── El arte, con los rótulos pegados ─────────────────────────── */}
            <div ref={entryRef} className="relative min-h-0 flex-1">
              <div
                data-atlas-art
                ref={stageRef}
                {...stageProps}
                className="pointer-events-auto absolute left-1/2 top-1/2 h-[86%] -translate-x-1/2 -translate-y-1/2"
              >
                <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
                <StackCursorTag ref={tagRef} hover={hover} />

                {/* Los rótulos viven DENTRO de la caja del arte y se posicionan
                    contra ella: así siguen pegados a su pieza en cualquier
                    tamaño de ventana, sin una sola medición en JS. */}
                {ANCHORS.map((a) => (
                  <Tag
                    key={a.key}
                    anchor={a}
                    active={active === a.key}
                    drawn={isDrawn(a.key, stage, enhanced)}
                    enhanced={enhanced}
                    onSelect={() => goTo(a.key as StackStop)}
                  />
                ))}
              </div>
            </div>

            {/* ── El panel: una sola posición, siempre la misma ───────────── */}
            <div
              data-atlas-panel
              // `aria-live` porque el contenido cambia solo, empujado por el
              // scroll: sin esto, quien usa lector de pantalla no se entera de
              // que el panel dice otra cosa que hace un momento.
              aria-live="polite"
              // `min-h`: el panel cambia de contenido con la capa, y sin un
              // alto reservado su altura salta —Protocol trae seis features en
              // tres filas, near.com ninguno—. Como el arte vive en el `flex-1`
              // de arriba, cada salto del panel lo hacía CRECER Y ENCOGER al
              // pasar de una capa a otra: el ensamble cambiaba de tamaño en
              // cada parada sin que nada lo pidiera.
              className="mx-auto grid min-h-[9.5rem] w-full max-w-4xl shrink-0 grid-cols-1 gap-x-10 gap-y-2 pt-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:pt-6"
            >
              <div className="flex flex-col gap-1">
                {/* Acá el tinte de marca SÍ se conserva: el panel muestra una
                    sola capa, así que no hay estado que el verde pueda
                    confundir. */}
                <h3 className="text-h4-mono">
                  {panel.name === NEARCOM_BLOCK.name ? (
                    <>
                      <span className="text-cta-mint">NEAR</span>
                      <span>{panel.name.slice(4)}</span>
                    </>
                  ) : (
                    panel.name
                  )}
                </h3>
                {panel.href && (
                  <span className="uppercase text-caption-mono text-cream/70">
                    Visit {panel.href.replace(/^https?:\/\//, "")}
                  </span>
                )}
                {panel.items.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {panel.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span aria-hidden="true" className="size-1.5 shrink-0 bg-cta-mint" />
                        <span className="text-body-sm text-cream/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* `cream/80` ≈ 10:1 sobre `--ink`. El cuerpo del panel es el
                  texto más largo de la sección y el que peor tolera un gris
                  justo: acá no hay estado que comunicar, así que no hay motivo
                  para bajarlo. */}
              <p className="text-body-sm text-cream/80 text-pretty">{panel.body}</p>
            </div>

            {/* ── Las capacidades, UNA vez ────────────────────────────────── */}
            <div className="mt-auto flex shrink-0 flex-col items-center gap-2 pt-5">
              {/* El mensaje se dice, no se infiere. Era lo que la repetición
                  intentaba comunicar sin decirlo. */}
              <Eyebrow className="text-cream/70">Every layer, without exception</Eyebrow>
              <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                {STACK_CAPABILITIES.map((cap) => (
                  <li
                    key={cap}
                    className="whitespace-nowrap uppercase text-caption-mono text-cream/75"
                  >
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>
      </section>

      {/* El pie, fuera de la escena: igual que en la original, por el mismo
          motivo —el `end: "bottom bottom"` mide la sección entera y cualquier
          alto agregado adentro estiraría el recorrido de las seis paradas. */}
      <section className="bg-ink py-16 text-cream">
        <Container>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16">
            {STACK_NOTES.map((note) => (
              <div key={note.label} className="flex max-w-[52ch] flex-col gap-3">
                <Eyebrow className="text-cream/70">{note.label}</Eyebrow>
                {/* `cream/70` y no `/50`: el original usaba 50% —~5.2:1, que
                    pasa AA por poco— apoyándose en que es «pie de la escena».
                    Con el pie ya fuera de la escena y sin nada que lo compita,
                    no hay razón para dejarlo al borde del mínimo. */}
                <p className="text-body-sm text-cream/70 text-pretty">{note.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

/* ── Un rótulo pegado a su pieza ─────────────────────────────────────────── */

/**
 * Nombre + línea guía, anclado al punto de su capa.
 *
 * Es un `<button>` y no un adorno: saltar a la capa es una acción, y por
 * teclado tiene que existir. `aria-current` en vez de `aria-pressed` porque no
 * es un interruptor —no hay estado encendido/apagado— sino cuál de cuatro es la
 * actual, que es exactamente lo que `aria-current` significa.
 */
function Tag({
  anchor,
  active,
  drawn,
  enhanced,
  onSelect,
}: {
  anchor: (typeof ANCHORS)[number];
  active: boolean;
  /** Su capa ya está dibujada en el arte. */
  drawn: boolean;
  enhanced: boolean;
  onSelect: () => void;
}) {
  const right = anchor.side === "right";
  // Sin escena (móvil, reduced-motion, sin JS) no hay capa activa que valga:
  // todas se muestran al mismo peso y ninguna miente diciendo que es la actual.
  const lit = enhanced ? active : true;

  return (
    <div
      data-atlas-tag
      className={`pointer-events-auto absolute flex items-center gap-2 ${
        right ? "flex-row" : "flex-row-reverse"
      }`}
      // El rótulo aparece cuando su capa aparece, y desaparece con ella.
      //
      // El ensamble se construye de adentro hacia afuera y los anillos no
      // existen hasta su parada: un rótulo puesto desde el principio queda
      // señalando el vacío con una línea que no toca nada, que se lee como un
      // error de dibujo y no como una promesa.
      //
      // Presencia/ausencia y no opacidad intermedia, que es la regla de toda
      // esta versión: un texto a media tinta sigue siendo texto que hay que
      // poder leer, y ahí es donde el contraste se cae.
      style={{
        left: `${anchor.x}%`,
        top: `${anchor.y}%`,
        transform: `translate(${right ? "0" : "-100%"}, -50%)`,
        opacity: drawn ? 1 : 0,
        visibility: drawn ? "visible" : "hidden",
        transition: "opacity 400ms, visibility 400ms",
      }}
    >
      {/* La línea guía. Corta a propósito: su trabajo es decir «este nombre es
          de ESA pieza», y cuanto más larga, más lejos queda el nombre de lo que
          nombra — que es el problema que este layout viene a resolver. */}
      <span
        aria-hidden="true"
        className={`h-px w-[clamp(30px,6vw,96px)] shrink-0 transition-colors duration-300 ${
          lit ? "bg-cta-mint" : "bg-cream/40"
        }`}
      />
      <button
        type="button"
        onClick={onSelect}
        aria-current={enhanced && active ? "true" : undefined}
        className={`flex items-center gap-2 whitespace-nowrap text-label-mono transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta-mint ${
          lit ? "text-cream" : "text-cream/70"
        }`}
      >
        {/* El segundo canal del estado. Sin él, «cuál es la activa» se
            respondería solo comparando dos grises — que es justo lo que
            1.4.1 no permite. */}
        <span
          aria-hidden="true"
          className={`size-1.5 shrink-0 rounded-full transition-opacity duration-300 ${
            lit ? "bg-cta-mint opacity-100" : "opacity-0"
          }`}
        />
        {/* Sin el tinte verde de «NEAR» que la ficha original le daba a
            near.com. Acá el verde significa UNA cosa —esta es la capa activa— y
            usarlo también como color de marca lo rompe: el rótulo de near.com
            se leía como seleccionado incluso con otra capa activa. Un canal,
            un significado. */}
        {anchor.label}
      </button>
    </div>
  );
}

/**
 * Si la capa ya está dibujada en el arte, con el mismo criterio que
 * `StackAssembly` usa para pintarla — los umbrales viven allá y acá solo se
 * leen. Sin escena (móvil, reduced-motion, sin JS) el ensamble está completo,
 * así que todos los rótulos están.
 */
function isDrawn(key: LayerKey, stage: number, enhanced: boolean): boolean {
  if (!enhanced) return true;
  if (key === "protocol") return true;
  if (key === "intents") return stage >= 1;
  if (key === "ai") return stage >= 2;
  return stage >= 6;
}

/* ── La entrada ──────────────────────────────────────────────────────────── */

/**
 * El arte, los rótulos y el panel entran al plantarse la escena.
 *
 * Mismo criterio que en `StackAnchors`: la sección llega tapada por la obertura
 * hasta el instante exacto en que su borde superior toca el techo, así que
 * cualquier entrada disparada antes ocurre detrás del negro.
 *
 * `set` + `to`, nunca `from` con stagger: un `.from()` escalonado deja aplicado
 * el estado inicial solo del primer elemento y el resto arranca visible. Está
 * documentado con su síntoma en `StackAnchors`.
 */
function useEntry() {
  return useGsapContext<HTMLDivElement>((_self, scope) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const section = scope.closest("section");
      if (!section) return;

      const art = section.querySelector<HTMLElement>("[data-atlas-art]");
      const tags = Array.from(section.querySelectorAll<HTMLElement>("[data-atlas-tag]"));
      const panel = section.querySelector<HTMLElement>("[data-atlas-panel]");
      const targets = [art, panel, ...tags].filter(Boolean) as HTMLElement[];
      if (targets.length === 0) return;

      // El arte no lleva `y`: su caja está centrada con dos `translate` de la
      // hoja de estilos y un desplazamiento de GSAP los pisaría. Los rótulos
      // tampoco, por lo mismo — su posición ES un transform.
      gsap.set([art, ...tags].filter(Boolean) as HTMLElement[], { autoAlpha: 0 });
      if (panel) gsap.set(panel, { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", once: true, markers: DEBUG_MARKERS },
      });

      if (art) tl.to(art, { autoAlpha: 1, duration: 0.5 }, 0);
      // Los rótulos entran en el orden del stack —de la cáscara a la columna—,
      // que es el mismo en que el arte se construye.
      if (tags.length) tl.to(tags, { autoAlpha: 1, duration: 0.4, stagger: 0.08 }, 0.2);
      if (panel) tl.to(panel, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.35);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(targets, { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);
}
