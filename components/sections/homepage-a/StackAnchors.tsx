"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import StackAssembly, { type StackStop } from "@/components/sections/homepage-a/stackAssembly";
import StackCursorTag from "@/components/sections/homepage-a/StackCursorTag";
import { useStackScene } from "@/components/sections/homepage-a/useStackScene";
import {
  AI_BLOCK,
  INTENTS_BLOCK,
  NEARCOM_BLOCK,
  PROTOCOL_BLOCK,
  STACK_CAPABILITIES,
  STACK_NOTES,
  STACK_PIECES,
  STACK_INTRO as INTRO,
} from "@/components/sections/homepage-a/nearStackContent";

// El stack de ab10: el ensamble isométrico al centro y las cuatro capas escritas
// en las cuatro esquinas, cada una pegada a la pieza de la que habla.
//
// Es la variante **C · Anchors** de `components/sections/stack-labs/`, con la
// ficha rehecha según el prototipo. Copiada y no importada, igual que
// `ProofDatum`: el lab es un laboratorio y su contenido puede cambiar o
// borrarse sin aviso.
//
// ── Por qué la posición del texto significa algo ────────────────────────────
//
// Es la diferencia conceptual con las otras variantes del lab: acá el texto no
// vive en una lista aparte, está anclado a su capa.
//
// Las cuatro esquinas siguen el orden de lectura, y ese orden es el del stack de
// ADENTRO HACIA AFUERA: arriba a la izquierda el núcleo (Protocol), después el
// primer anillo (Intents), después el segundo (NEAR AI), y al final —abajo a la
// derecha, donde la lectura termina— la cáscara (near.com), que es lo único que
// el usuario final toca.
//
// Es al revés de como estaba en el lab, que abría por la cáscara. Las dos
// lecturas se sostienen; esta gana porque el arte se construye igual: la columna
// central primero y las capas envolviéndola.
//
// ── Qué cambia respecto del lab ─────────────────────────────────────────────
//
//  1. **El titular viaja con la escena.** El lab abre con "The NEAR Stack"
//     centrado arriba, y por un tiempo acá vivió AFUERA, en una sección propia
//     (`StackIntro`) inmediatamente anterior. El problema de eso era de lectura,
//     no de layout: el titular se leía una vez y se iba con el scroll, así que
//     cuando el arte terminaba de armarse ya no quedaba a la vista qué era lo
//     que se estaba mirando.
//
//     Ahora está DENTRO del sticky, arriba del arte y en `text-h2`. La objeción
//     que lo había echado afuera —que un bloque de texto le come el alto a las
//     cuatro fichas— valía para un titular en el MEDIO y a escala de `h1`;
//     arriba y dos escalones más chico, lo que descuenta es mucho menor, y el
//     arte cede ese alto en vez de las fichas (ver el `shrink-0`).
//  2. **La ficha es otra cosa.** El lab tenía rótulo + nombre + párrafo. Acá
//     lleva cuatro registros tipográficos que hacen cuatro trabajos distintos:
//     el nombre en mono a escala de heading, una regla con el destino externo,
//     el cuerpo en sans, y —abajo— las piezas de la capa y las capacidades del
//     stack en mono.
//  3. **La alineación es especular.** Las dos fichas de la derecha alinean a la
//     derecha, contra el borde. Es lo que deja el arte respirando en el centro
//     en vez de tener cuatro bloques mirando todos para el mismo lado.
//
// ── El halo ─────────────────────────────────────────────────────────────────
//
// Un radial verde muy contenido detrás del ensamble. No es decoración: sobre
// negro plano el arte flota en el vacío, y un objeto que no está EN ningún
// sitio se lee como un recorte pegado encima.
//
// ── Recorrido: 200svh ────────────────────────────────────────────────────────
//
// Cada parada enciende una capa Y su ficha, a la vez: pieza y texto son la
// misma unidad. `position: sticky` y un ScrollTrigger de SOLO LECTURA, nunca
// `pin: true` — el porqué está en components/sections/README.md.

const TRAVEL = "200svh";

export default function StackAnchors() {
  const { rootRef, stageRef, stage, stop, hover, enhanced, goTo, stageProps, tagRef } =
    useStackScene();

  // La ficha se enciende cuando su capa es la parada activa, cuando el puntero
  // está sobre su pieza, o siempre en el fallback sin escena.
  const on = (key: StackStop | "ai") => {
    if (!enhanced) return true;
    // Un cubo de la columna partida es la capa `protocol`: no tiene `key`
    // propia, se identifica por índice.
    if (hover?.kind === "cube") return key === "protocol";
    if (hover) return hover.key === key || (key === "ai" && hover.kind === "seg");
    if (key === "ai") return stop === "ai" || AI_BLOCK.subs.some((s) => s.key === stop);
    return stop === key;
  };

  return (
    <>
      <section
        ref={rootRef}
        style={{ "--travel": TRAVEL } as React.CSSProperties}
        className="group/anchors relative bg-ink text-cream data-[mode=track]:h-[calc(var(--travel)+100svh)]"
      >
        <div className="relative overflow-hidden group-data-[mode=track]/anchors:sticky group-data-[mode=track]/anchors:top-0 group-data-[mode=track]/anchors:h-svh">
          {/* El halo. `inset` negativo y el degradado apagándose antes del borde:
              si el radial termina dentro de su propia caja, se ve el rectángulo. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[30svh] bg-[radial-gradient(circle_at_50%_50%,rgba(0,220,141,0.13)_0%,rgba(0,220,141,0.05)_22%,rgba(0,220,141,0.015)_34%,rgba(16,16,16,0)_46%)]"
          />

          <Container className="pointer-events-none relative flex h-full flex-col py-10 group-data-[mode=track]/anchors:pt-[calc(var(--site-header-block)+1rem)]">
            {/* El titular del stack, DENTRO de la escena pegada.

                Vivía en su propia sección (`StackIntro`) justo encima, y por eso
                se leía una vez y se iba con el scroll: cuando el arte se armaba,
                el lector ya no tenía a la vista qué era lo que estaba mirando.
                Acá viaja con el sticky y se queda mientras dura la escena.

                `shrink-0` para que sea el arte —que está en el `flex-1` de
                abajo— el que ceda alto, y no el titular. El razonamiento viejo
                de `StackIntro` (que un bloque de texto en el medio le come el
                alto a las cuatro fichas) sigue siendo cierto para el MEDIO; acá
                está arriba y en `text-h2` en vez de `text-h1`, así que lo que
                descuenta es bastante menos. */}
            <div className="shrink-0 pb-6 text-center lg:pb-8">
              <h2 className="text-h2 text-balance">
                {INTRO.lead} <Accent>{INTRO.accent}</Accent>
              </h2>
              {/* Sin `mt`: el aire entre titular y subtítulo ya lo pone el
                  interlineado del `text-h2`, que a esta escala son ~14px de
                  descuelgue bajo la última línea. El `mt-3` que había acá se
                  sumaba a eso y separaba los dos como si fueran bloques
                  distintos, cuando son una sola entrada. */}
              <p className="mx-auto max-w-[42ch] text-body text-cream/70 text-balance">
                {INTRO.sub}
              </p>
            </div>

            {/* El área de anclaje: el arte centrado y las cuatro fichas en las
                esquinas. `min-h-0` para que el arte pueda encogerse dentro del
                sticky en vez de desbordarlo. */}
            <div className="relative min-h-0 flex-1">
              {/* `h-[80%]` y no `h-full`: el ensamble isométrico se pidió un 20%
                  más chico.

                  El tamaño se toca ACÁ, en el alto del stage, y no con un
                  `scale()` sobre el arte: el `w-auto` del SVG deriva su ancho de
                  este alto, así que la pieza sigue midiendo lo que ocupa de
                  verdad. Un `scale` la dejaría reservando el espacio del tamaño
                  original —y las cuatro fichas de las esquinas se anclan contra
                  esta caja, así que se habrían quedado separadas del arte. El
                  centrado no se toca: `left-1/2 top-1/2` con las traslaciones
                  sigue centrando la caja, mida lo que mida. */}
              <div
                ref={stageRef}
                {...stageProps}
                className="pointer-events-auto absolute left-1/2 top-1/2 h-[80%] -translate-x-1/2 -translate-y-1/2"
              >
                <StackAssembly stage={stage} hover={hover} className="h-full w-auto" />
                <StackCursorTag ref={tagRef} hover={hover} />
              </div>

              {/* Sin `pieces`: las del protocolo son los cubos de la columna, y
                  cada uno se cuenta solo al pasar el puntero. Ver el docblock de
                  `STACK_PIECES`. */}
              <Anchor
                side="left"
                leaf={PROTOCOL_BLOCK}
                on={on("protocol")}
                onSelect={() => goTo("protocol")}
                className="left-0 top-0"
              />
              <Anchor
                side="right"
                leaf={INTENTS_BLOCK}
                pieces={STACK_PIECES.intents}
                on={on("intents")}
                onSelect={() => goTo("intents")}
                className="right-0 top-0"
              />
              <Anchor
                side="left"
                leaf={{ ...AI_BLOCK, body: AI_BLOCK.intro }}
                pieces={STACK_PIECES.ai}
                on={on("ai")}
                onSelect={() => goTo("ai")}
                className="bottom-0 left-0"
              />
              <Anchor
                side="right"
                leaf={NEARCOM_BLOCK}
                // El único nombre partido en dos colores: "NEAR" es la marca y
                // ".com" el dominio, y el prototipo tiñe solo la marca. Los otros
                // tres van enteros porque no tienen esa costura.
                tint="NEAR"
                on={on("nearcom")}
                onSelect={() => goTo("nearcom")}
                className="bottom-0 right-0"
              />
            </div>

            {/* El pie DENTRO de la escena. Solo en pantallas altas — ver el
                docblock de `StackNotes`.

                `shrink-0`, como el titular de arriba: lo que cede alto es el
                `flex-1` del medio, o sea el arte. Eso es lo que lo empuja todo
                hacia arriba sin tocar ningún número: el ensamble deriva su ancho
                del alto del stage (`h-[80%]` + `w-auto`), así que se achica y sube
                solo, y las cuatro fichas se anclan contra esa misma caja y lo
                acompañan.

                `pointer-events-none` lo hereda del `Container` y no se revierte:
                estas dos notas no son interactivas, y devolverles el puntero les
                robaría hover al arte, que ocupa el centro y llega hasta acá
                abajo. */}
            <StackNotes className="hidden shrink-0 pt-8 [@media(min-height:900px)]:grid lg:pt-10" />
          </Container>
        </div>
      </section>

      {/* El pie FUERA de la escena, para cuando adentro no entra.

          Hermano de la `<section>` de arriba y no un bloque más adentro de ella,
          por dos razones que apuntan al mismo lado. La primera es el
          `end: "bottom bottom"` del ScrollTrigger de la escena: mide la sección
          ENTERA, así que cualquier alto agregado ahí estira el recorrido de las
          seis etapas del ensamble — el texto tardaría en aparecer y, peor, las
          etapas se separarían entre sí. La segunda es que en modo track esa
          sección tiene alto FIJO (`--travel` + 100svh), y un hijo después del
          sticky se le sale por abajo. */}
      <StackNotesSection />
    </>
  );
}

/* ── El pie: gobernanza y economía ────────────────────────────────────────── */

// A partir de qué alto de ventana el pie entra DENTRO de la escena: 900px.
//
// La escena reparte una pantalla entre el titular, el arte y este pie, y el arte
// se lleva lo que sobra. Por debajo de este alto lo que sobra no alcanza: el
// ensamble queda tan chico que las cuatro fichas de las esquinas se le acercan
// hasta tocarlo y el gesto de "el arte en el centro, anclado" se pierde.
//
// Está escrito como clase literal en los dos lugares y no como constante porque
// Tailwind no detecta clases construidas dinámicamente — mismo criterio que el
// mapa WIDTH de `Container` y el `CARD_LAYOUT` de `OwnYourOwn`. Si se mueve, se
// mueve en los dos: son el mismo `min-height:900px`, uno encendiendo el pie de
// adentro y el otro apagando el de afuera.

function StackNotes({ className = "" }: { className?: string }) {
  return (
    // `max-w` en `ch` y no en px: son dos bloques de TEXTO y lo que tiene que
    // quedar constante es la medida de línea, no el ancho de la caja.
    <div className={`mx-auto max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16 ${className}`}>
      {STACK_NOTES.map((note) => (
        <div key={note.label} className="flex max-w-[52ch] flex-col gap-3">
          <Eyebrow className="text-cream/70">{note.label}</Eyebrow>
          {/* `text-body-sm` y no `text-body`: son pie de la escena, no su
              contenido. Al tamaño del cuerpo competían con el subtítulo del
              titular, que es lo que sí tiene que leerse primero. La opacidad
              dice lo mismo por otra vía.

              50% es el piso, no una preferencia: `--cream` (#00dc8d) a esa
              opacidad compone ~#e1e1e1 sobre el `--ink` de la sección, que da
              ~5.5:1 de contraste. El escalón siguiente (40%) cae a ~3.9:1 y deja
              de pasar AA para texto de este tamaño. */}
          <p className="text-body-sm text-cream/50 text-pretty">{note.body}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * El pie cuando la ventana es baja: debajo del gráfico, en el último scroll.
 *
 * Los dos montajes son el MISMO componente y se excluyen por media query de
 * `display`, no por opacidad ni por visibilidad: un `display: none` no lo lee
 * ningún lector de pantalla, así que el contenido nunca se anuncia dos veces
 * aunque esté dos veces en el árbol.
 *
 * `bg-ink` propio: la escena de arriba lo trae de su `<section>`, y esta es otra
 * — sin él, el pie caería sobre el fondo de la página y el negro se cortaría
 * justo donde termina el sticky.
 */
function StackNotesSection() {
  return (
    <section className="bg-ink py-20 text-cream [@media(min-height:900px)]:hidden">
      <Container>
        <StackNotes className="grid" />
      </Container>
    </section>
  );
}

/* ── Una ficha anclada ────────────────────────────────────────────────────── */

type AnchorLeaf = {
  name: string;
  body: string;
  link?: { label: string; href: string };
};

function Anchor({
  side,
  leaf,
  tint,
  pieces,
  on,
  onSelect,
  className,
}: {
  side: "left" | "right";
  leaf: AnchorLeaf;
  /** Prefijo del nombre que va en verde, si lo hay. */
  tint?: string;
  pieces?: readonly string[];
  on: boolean;
  onSelect: () => void;
  className: string;
}) {
  const right = side === "right";
  // El destino se muestra como host en versalitas ("VISIT NEAR.AI") y no con el
  // label largo del contenido ("Visit near.ai"): al lado del nombre en mono, la
  // frase completa compite con él en vez de acompañarlo.
  const visit = leaf.link
    ? `Visit ${leaf.link.href.replace(/^https?:\/\//, "")}`
    : null;

  return (
    <div
      className={`pointer-events-auto absolute w-[24rem] ${className} flex flex-col gap-3 ${
        right ? "items-end text-right" : "items-start"
      }`}
    >
      {/* Nombre y destino en la misma línea de base, en extremos opuestos, con
          la regla debajo cruzando la ficha entera. La regla es lo que convierte
          dos textos sueltos en un encabezado. */}
      <div className="w-full">
        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 ${
            right ? "flex-row-reverse" : ""
          }`}
        >
          {/* `whitespace-nowrap`: el nombre es una unidad y no parte nunca. Si
              no entra junto al destino, es el destino el que baja de línea
              —para eso el `flex-wrap` de arriba—; un "NEAR / Protocol" cortado
              en dos deja de leerse como el rótulo de la capa.

              El `text-left`/`text-right` tampoco es opcional: un <button> trae
              `text-align: center` del user-agent, así que no hereda la
              alineación de la ficha y su contenido se centra solo. */}
          <button
            type="button"
            onClick={onSelect}
            className={`cursor-pointer whitespace-nowrap text-h4-mono transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint ${
              right ? "text-right" : "text-left"
            }`}
          >
            {tint && <span className="text-cta-mint">{tint}</span>}
            <span className={on ? "text-cream" : "text-cream/60"}>
              {tint ? leaf.name.slice(tint.length) : leaf.name}
            </span>
          </button>

          {visit && (
            <span
              className={`whitespace-nowrap uppercase text-caption-mono transition-colors duration-300 ${
                on ? "text-cream/60" : "text-cream/30"
              }`}
            >
              {visit}
            </span>
          )}
        </div>

        <span
          aria-hidden="true"
          className={`mt-1.5 block h-px transition-colors duration-500 ${
            on ? "bg-cream/45" : "bg-cream/15"
          }`}
        />
      </div>

      <p
        className={`text-body-sm text-pretty transition-colors duration-300 ${
          on ? "text-cream/80" : "text-cream/40"
        }`}
      >
        {leaf.body}
      </p>

      {/* Las piezas de la capa. El cuadrito las marca como enumeración sin
          gastar una viñeta redonda, que en este contexto leería como lista de
          producto; acá son etiquetas de lo que la capa contiene. */}
      {pieces && (
        <ul
          className={`flex flex-wrap gap-x-5 gap-y-1.5 ${right ? "justify-end" : ""}`}
        >
          {pieces.map((piece) => (
            <li key={piece} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 transition-colors duration-300 ${
                  on ? "bg-cream" : "bg-cream/35"
                }`}
              />
              <span
                className={`text-body-sm transition-colors duration-300 ${
                  on ? "text-cream" : "text-cream/45"
                }`}
              >
                {piece}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Las capacidades del stack, iguales en las cuatro fichas — la
          repetición es el mensaje, ver `nearStackContent.ts`. Los corchetes van
          en el JSX y no en la copy: son notación tipográfica, no parte de la
          palabra, y en el dato harían que "Confidential" no se pudiera reusar
          en ningún otro sitio sin arrastrarlos. */}
      <ul
        className={`flex flex-wrap gap-x-4 gap-y-1 ${right ? "justify-end" : ""}`}
      >
        {STACK_CAPABILITIES.map((cap) => (
          <li
            key={cap}
            className={`whitespace-nowrap uppercase text-micro-mono transition-colors duration-300 ${
              on ? "text-cream/55" : "text-cream/25"
            }`}
          >
            [ {cap} ]
          </li>
        ))}
      </ul>
    </div>
  );
}
