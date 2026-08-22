// El divisor entre entradas de la alternativa C.
//
// Seis celdas sobre una misma línea isométrica; en la entrada N hay N llenas. Es
// a la vez el separador gráfico entre argumentos y la barra de avance de la
// lectura: en un ensayo de seis entradas, saber por cuál se va es información,
// no adorno.
//
// Es la única pieza vectorial recurrente de esta alternativa, y eso es la
// dirección: C apuesta a que en una página de protocolo la tipografía puede
// cargar el peso que en A lleva la retícula y en B el objeto. Un dibujo por
// entrada la volvería una versión más de B con otra tipografía.

import { GreenCube, IsoFrame, WireCube, isoAt } from "@/components/sections/protocol-labs/isoKit";

const iso = isoAt(160, 44);
const SLOTS = [-50, -30, -10, 10, 30, 50];

export default function EntryMark({
  index,
  tone = "light",
}: {
  /** 1 a 6. Cuántas celdas están llenas. */
  index: number;
  tone?: "light" | "dark";
}) {
  return (
    <IsoFrame viewBox="0 0 320 88" className="h-16 w-full max-w-[320px]">
      <path
        d={`M ${iso(-62, 0, 0)} L ${iso(62, 0, 0)}`}
        className={tone === "dark" ? "stroke-cream/25" : "stroke-ink/20"}
      />
      {SLOTS.map((x, i) =>
        i < index ? (
          <GreenCube key={x} iso={iso} x={x} y={0} s={5} />
        ) : (
          <WireCube
            key={x}
            iso={iso}
            x={x}
            y={0}
            s={5}
            className={tone === "dark" ? "stroke-cream/30" : "stroke-ink/25"}
          />
        )
      )}
    </IsoFrame>
  );
}
