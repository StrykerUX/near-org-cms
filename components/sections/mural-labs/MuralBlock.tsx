import Container from "@/components/primitives/Container";
import { LINES, rampGradient, type MuralLine } from "./muralContent";

// El bloque del diseño, sin una sola línea de animación.
//
// Las cuatro variantes montan ESTE componente y le animan las partes por sus
// `data-*`. Es lo que garantiza que la comparación sea sobre el movimiento: si
// cada variante escribiera su propio marcado, cualquier diferencia de layout se
// leería como diferencia de animación.
//
// ── Cómo se pinta el degradado ─────────────────────────────────────────────
//
// `background-clip: text` sobre un texto transparente. El degradado es del
// ELEMENTO, no de las letras, así que cada carácter recibe el color que le toca
// por dónde cae — que es exactamente lo que hace el diseño y lo que permite que
// `03 · Split` lo arme letra por letra sin calcular un color por letra.
//
// `background-size` va al 100% y la posición en 0: `01 · Ramp` los mueve para
// barrer, y necesita partir de un estado declarado, no del default.
//
// ── El layout ──────────────────────────────────────────────────────────────
//
// Flex y no absolute. El artboard posiciona las ocho piezas con coordenadas
// —está bien en Figma— pero acá el ancho es fluido y el token de tamaño es un
// `clamp`, así que las coordenadas dejarían de calzar apenas cambia el
// viewport. Lo que se conserva del diseño es la RELACIÓN: rótulo pegado a un
// borde, palabra ocupando todo el resto, alineada al borde opuesto.

function Line({ line, index }: { line: MuralLine; index: number }) {
  const label = (
    <p
      data-mural-label
      className="text-body-lg shrink-0 whitespace-pre-line text-foreground"
    >
      {line.label}
    </p>
  );

  return (
    <div
      data-mural-line
      data-index={index}
      className={`flex items-baseline gap-6 ${
        line.labelSide === "right" ? "flex-row-reverse" : ""
      }`}
    >
      {label}

      {/* El wrapper existe para la máscara de `02 · Rise`: recortar dentro del
          mismo elemento que lleva el `background-clip` apagaría el degradado.
          `pb`/`-mb` le dan aire a los descendentes, que a este tamaño se
          cercenan en cuanto hay un `overflow-hidden` de por medio. */}
      <span
        data-mural-mask
        className="min-w-0 flex-1 overflow-hidden pb-[0.12em] -mb-[0.12em]"
      >
        <span
          data-mural-word
          style={{
            backgroundImage: rampGradient(line),
            backgroundSize: "100% 100%",
            backgroundPosition: "0% 0%",
          }}
          className={`text-mural font-display block whitespace-nowrap bg-clip-text uppercase text-transparent ${
            line.align === "right" ? "text-right" : "text-left"
          }`}
        >
          {line.word}
        </span>
      </span>
    </div>
  );
}

export default function MuralBlock() {
  return (
    <Container as="section" className="bg-bar py-[7svh]">
      {/* El `@container` va acá y NO en el `Container`, y la diferencia es
          visible: `Container` incluye su propio `px-[60px]`, así que medir
          contra él da un `cqw` mayor que el ancho de contenido real y las
          palabras salían un 7% más grandes de lo que la caja aguanta — a 1780px
          eso es "ECONOMY" cortado en "ECONO".

          El artboard define la proporción contra el CONTENIDO (153px sobre
          1280px = 11.95%), así que el contenedor de consulta tiene que ser el
          bloque sin padding. */}
      <div className="@container flex flex-col gap-[2.5svh]">
        {LINES.map((line, i) => (
          <Line key={line.word} line={line} index={i} />
        ))}
      </div>
    </Container>
  );
}
