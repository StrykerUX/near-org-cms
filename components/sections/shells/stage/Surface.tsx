import type { ReactNode } from "react";
import GlSurface from "@/components/primitives/GlSurface";
import { hexToRgb } from "@/components/primitives/gl/color";
import { CONTOUR_FRAG } from "@/components/sections/shells/stage/contour";

// La superficie del armazón «escenario»: el terreno con shader, y el contenido
// encima.
//
// ── Una paleta por página, un shader para todas ───────────────────────────
//
// El vocabulario GRÁFICO de cada página es propio —esa fue la decisión— pero el
// suelo es compartido, y a propósito. Si cada página trajera su propio shader,
// cuatro superficies distintas leerían como cuatro sitios; con una sola
// calibrada distinto, leen como cuatro habitaciones de la misma casa. La paleta
// y la escala son suficientes para que no se confundan entre sí: un terreno de
// colinas anchas y verdes no se parece a uno de crestas apretadas y frías.
//
// ── El contenido no va dentro del canvas ──────────────────────────────────
//
// El canvas es hermano del contenido y va debajo, no padre. Un `<canvas>` con
// hijos los esconde del árbol de accesibilidad, y el texto de un hero es el
// `<h1>` de la página.
//
// ── `fallback` no es opcional ─────────────────────────────────────────────
//
// Sin WebGL2 utilizable el canvas queda transparente, y un titular en crema
// sobre el fondo de la página puede quedar ilegible. El color de reserva es la
// meseta más baja de la paleta, así que el peor caso es la superficie sin
// relieve — no un agujero.

export type StagePalette = {
  /** La meseta más baja. También es el color de reserva sin WebGL. */
  bg: string;
  /** La meseta más alta. */
  high: string;
  /** La curva de nivel. */
  line: string;
};

export type SurfaceProps = {
  children: ReactNode;
  palette: StagePalette;
  /** Cuántos niveles cruzan el rango. Pocos = mesetas anchas donde apoyar texto. */
  bands?: number;
  /** Tamaño del terreno. Más chico = colinas más anchas. */
  scale?: number;
  /** 0 = terreno plano en pantalla; 1 = horizonte marcado hacia arriba. */
  tilt?: number;
  className?: string;
};

export default function Surface({
  children,
  palette,
  bands = 9,
  scale = 2.1,
  tilt = 0.5,
  className = "",
}: SurfaceProps) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <GlSurface
        tag="stage-contour"
        fragment={CONTOUR_FRAG}
        fallback={palette.bg}
        // `renderScale` 1 y `maxDpr` 2: las curvas son bordes duros. A media
        // resolución se escalonan, y a un dpr fraccionario el reescalado
        // reparte cada píxel de forma despareja — ver la nota de `GlSurface`.
        renderScale={1}
        maxDpr={2}
        uniforms={{
          u_bg: hexToRgb(palette.bg),
          u_high: hexToRgb(palette.high),
          u_line: hexToRgb(palette.line),
          u_bands: bands,
          u_scale: scale,
          u_speed: 0.14,
          u_tilt: tilt,
          u_lineOpacity: 0.55,
        }}
        className="absolute inset-0 -z-10 size-full"
      />
      {children}
    </div>
  );
}
