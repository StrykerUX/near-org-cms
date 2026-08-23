import { SCALE_ART } from "@/components/sections/protocol-labs/a/scaleArt";

// La card de una propiedad de «Built for AI scale».
//
// ── Por qué es un componente y no markup repetido ─────────────────────────
//
// Hay dos versiones de la sección montadas a la vez —`ScaleClaim`, con el texto
// arriba y las cards en tres columnas anchas, y `ScaleClaimSplit`, con el texto
// en una cuarta columna y las cards más estrechas— y se están comparando entre
// sí. Con el markup copiado en las dos, el primer ajuste al panel o al redondeo
// entra en una sola y la comparación pasa a medir esa diferencia en vez de la
// que se quiere ver, que es el layout.
//
// Es el mismo criterio que `protocolContent.ts` aplica a la copy.
//
// ── El objeto es el de «Own Your Own» en la home ──────────────────────────
//
// Sus tres partes, enteras: el panel de arte con su propio redondeo y su fondo
// un tono por encima de la card, el título serif y el cuerpo. No es una cita
// estética — es el único componente-caja que la línea de diseño viva tiene, y
// una página nueva que invente el suyo obliga a mantener dos.
//
// **El tinte cambia respecto de la home, y es obligatorio.** Allá las cards
// viven sobre crema y `bg-card-tint/50` compone ≈ #efefec, un escalón por
// debajo. Acá el fondo es blanco puro: ese mismo 50% compone ≈ #f4f4f3, la mitad
// de contraste, y las deja a medio camino entre card y mancha. Sube a 70% para
// conservar el mismo escalón perceptual — lo que se copia es la relación con su
// fondo, no el número.
export default function ScaleCard({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  const Art = SCALE_ART[index];

  return (
    <li
      data-reveal
      className="flex flex-col rounded-3xl bg-card-tint/70 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-md"
    >
      {/* El panel del arte. `aspect-[381/401]` es la proporción de los PNG de la
          home —verticales, no cuadrados—, y va como aspecto y no como alto fijo
          para que las cards midan lo mismo a cualquier ancho de columna. Es lo
          que permite que las dos versiones de la sección compartan esta pieza
          aunque sus columnas sean de anchos distintos.

          `rounded-xl` contra el `rounded-3xl` de la card: el redondeo interior
          tiene que ser MENOR que el exterior o los dos bordes dejan de ser
          concéntricos y la card se lee mal sin que se pueda decir por qué. */}
      <div className="flex aspect-[381/401] items-center justify-center rounded-xl bg-background/70 p-5">
        <Art />
      </div>

      {/* Sin padding lateral propio: los 24px de la card (`p-6`) ya envuelven a
          los dos hijos por igual, y duplicarlos acá metería al texto más adentro
          que al panel. Lo único que queda es el `pt`, la separación panel→texto. */}
      <div className="flex flex-col gap-3 pt-6">
        {/* `text-h3-serif italic`, el mismo rol que la home le da al título de
            card: Kepler, dos escalones por encima de un `text-h4`. En una card el
            rótulo tiene que ser un titular y no una etiqueta del tamaño de su
            propio cuerpo. */}
        <h3 className="text-h3-serif italic">{title}</h3>
        <p className="text-body text-foreground/75 text-pretty">{body}</p>
      </div>
    </li>
  );
}
