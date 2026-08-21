import { forwardRef } from "react";
import {
  LAYER_NAMES,
  SEG_NAMES,
  type StackHover,
} from "@/components/sections/home-ab10/stackAssembly";
import {
  AI_BLOCK,
  PROTOCOL_FEATURES,
} from "@/components/sections/home-ab10/nearStackContent";

// El tag de la pieza hovereada, clavado al cursor.
//
// Dos formas, las mismas que en `home-ab7/NearStackV2`:
//
// - **pill** para las capas (Protocol, Intents, near.com): solo el nombre. La
//   capa ya tiene su párrafo en la variante, a la vista; repetirlo bajo el
//   cursor sería decir dos veces lo mismo a la vez.
// - **card** para los tres productos de NEAR AI: nombre y cuerpo. Estos NO
//   tienen sitio propio en todas las variantes —en varias son un chip o un
//   renglón de una lista— así que el hover es donde de verdad se explican.
// - **card con subhead** para los seis cubos de la columna partida. Los
//   features del protocolo no están en ningún texto de ninguna variante: el
//   hover es su ÚNICO sitio, y por eso llevan el subhead además del cuerpo.
//
// El nodo vive SIEMPRE montado y el hover solo lo prende y le cambia el texto:
// la posición la escribe `useStackScene` sobre el nodo en cada pointermove, y
// montarlo/desmontarlo obligaría a re-medir en el peor momento.
//
// Decorativo (`aria-hidden`): el nombre accesible de cada pieza vive en el
// texto de la variante, no acá.
const StackCursorTag = forwardRef<HTMLDivElement, { hover: StackHover }>(
  function StackCursorTag({ hover }, ref) {
    const feature = hover?.kind === "cube" ? PROTOCOL_FEATURES[hover.index] : undefined;

    const label = hover
      ? hover.kind === "cube"
        ? feature?.name
        : hover.kind === "seg"
          ? SEG_NAMES[hover.key]
          : LAYER_NAMES[hover.key]
      : null;

    const sub = feature?.sub;

    const desc =
      hover?.kind === "cube"
        ? feature?.desc
        : hover?.kind === "seg"
          ? AI_BLOCK.subs.find((s) => s.key === hover.key)?.body
          : undefined;

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={`pointer-events-none absolute z-10 -translate-y-1/2 border border-cream/25 backdrop-blur-sm transition-opacity duration-150 ${
          label ? "opacity-100" : "opacity-0"
        } ${
          desc
            ? // Más opaca que la pill (/95 contra /85 de ab7): acá la caja no
              // cae solo sobre el arte — en varias variantes el gráfico tiene
              // una columna de texto al lado, y con /85 el párrafo de atrás se
              // leía a través de la tarjeta.
              "w-[19rem] translate-x-4 rounded-lg bg-ink/95 px-4 py-3"
            : "translate-x-3 rounded-full bg-ink/85 px-4 py-1.5"
        }`}
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span className="size-3 shrink-0 rounded-full bg-cta-mint" />
          <span className="text-body text-cream">{label}</span>
        </span>
        {/* El subhead va en verde y ARRIBA del cuerpo: es la afirmación del
            feature, y el cuerpo es su explicación. */}
        {sub && (
          <span className="mt-1.5 block text-caption text-cta-mint/90 text-pretty">{sub}</span>
        )}
        {desc && (
          <span className="mt-1 block text-caption text-cream/65 text-pretty">{desc}</span>
        )}
      </div>
    );
  }
);

export default StackCursorTag;
