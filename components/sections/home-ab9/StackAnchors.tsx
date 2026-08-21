"use client";

import Container from "@/components/primitives/Container";
import StackAssembly, { type StackStop } from "@/components/sections/home-ab9/stackAssembly";
import StackCursorTag from "@/components/sections/home-ab9/StackCursorTag";
import { useStackScene } from "@/components/sections/home-ab9/useStackScene";
import {
  AI_BLOCK,
  INTENTS_BLOCK,
  NEARCOM_BLOCK,
  PROTOCOL_BLOCK,
  STACK_CAPABILITIES,
  STACK_PIECES,
} from "@/components/sections/home-ab9/nearStackContent";

// El stack de ab9: el ensamble isométrico al centro y las cuatro capas escritas
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
//  1. **Sin titular.** El lab abre con "The NEAR Stack" centrado arriba. Acá
//     ese titular vive AFUERA, en `StackIntro`, la sección inmediatamente
//     anterior: con cuatro fichas ocupando las esquinas de un viewport pegado,
//     un quinto bloque en el medio les come el alto justo donde son más
//     frágiles. Las dos secciones comparten el `bg-ink`, así que la juntura no
//     se ve.
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
          {/* El área de anclaje: el arte centrado y las cuatro fichas en las
              esquinas. `min-h-0` para que el arte pueda encogerse dentro del
              sticky en vez de desbordarlo. */}
          <div className="relative min-h-0 flex-1">
            <div
              ref={stageRef}
              {...stageProps}
              className="pointer-events-auto absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2"
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
        </Container>
      </div>
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
