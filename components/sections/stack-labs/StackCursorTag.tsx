import { forwardRef } from "react";
import {
  LAYER_NAMES,
  SEG_NAMES,
  type StackHover,
} from "@/components/sections/stack-labs/stackAssembly";

// El bubble tag de la pieza hovereada, clavado al cursor.
//
// El nodo vive SIEMPRE montado y el hover solo lo prende y le cambia el texto:
// la posición la escribe `useStackScene` sobre el nodo en cada pointermove, y
// montarlo/desmontarlo obligaría a re-medir en el peor momento.
//
// Decorativo (`aria-hidden`): el nombre accesible de cada pieza vive en el
// texto de la variante, no acá.
const StackCursorTag = forwardRef<HTMLDivElement, { hover: StackHover }>(
  function StackCursorTag({ hover }, ref) {
    const label = hover
      ? hover.kind === "seg"
        ? SEG_NAMES[hover.key]
        : LAYER_NAMES[hover.key]
      : null;

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={`pointer-events-none absolute z-10 translate-x-3 -translate-y-1/2 rounded-full border border-cream/25 bg-ink/85 px-4 py-1.5 backdrop-blur-sm transition-opacity duration-150 ${
          label ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span className="size-3 shrink-0 rounded-full bg-cta-mint" />
          <span className="text-body text-cream">{label}</span>
        </span>
      </div>
    );
  }
);

export default StackCursorTag;
