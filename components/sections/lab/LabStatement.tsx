"use client";

import Container from "@/components/primitives/Container";
import { BARS_STATEMENT as STATEMENT } from "@/components/sections/home-v2/homeV2Content";

// El bloque de texto de la sección de barras, idéntico al de producción. Compartido
// por los dos approaches nuevos por lo mismo que `labTextSweep`: no participa del
// problema, y tenerlo duplicado dos veces solo abre la puerta a que uno de los dos se
// quede atrás mientras se los compara.
export default function LabStatement() {
  return (
    // El aire vertical también se mide en `--u`: escala con el ancho de columna, así
    // la caja de texto queda siempre a la misma distancia proporcional de los
    // escalones, que es lo que la mantiene centrada dentro del marco.
    <Container className="relative py-[calc(var(--u)*2)]">
      {/* `isolate` acota el apilado de las dos capas. Las dos ocupan la misma celda
          de grid: mismo string, mismo ancho, mismos quiebres de línea — es lo que
          garantiza que el brillo caiga sobre el glifo. */}
      <div
        data-quantum="stage"
        className="relative isolate mx-auto grid max-w-[64rem] px-10 text-center"
      >
        <h2 data-quantum="line" className="text-h2 text-pretty [grid-area:1/1]">
          {STATEMENT}
        </h2>
        {/* `opacity-0` en la clase y el JS lo enciende: esta capa no es contenido
            —el contenido es el <h2>, que se ve entero sin JS— sino un brillo
            decorativo. Sin este 0, un fallo del bundle dejaría el párrafo AMARILLO
            pegado encima del negro, ilegible. */}
        <p
          data-quantum="shine"
          aria-hidden="true"
          className="pointer-events-none text-h2 text-sweep opacity-0 text-pretty [grid-area:1/1]"
        >
          {STATEMENT}
        </p>
      </div>
    </Container>
  );
}
