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
// ── Dos disposiciones internas ────────────────────────────────────────────
//
//   · `"stacked"` — el panel arriba y el texto debajo. Es la de la home.
//   · `"row"` — el panel a la IZQUIERDA y el texto a su derecha.
//
// La segunda existe por una razón concreta y no estética: en `stacked` la card
// mide el alto del panel MÁS el del texto, y el panel es alto porque hereda la
// proporción vertical de los PNG de la home (381×401). Tres de esas seguidas
// empujan la sección hacia el doble de pantalla. Poniendo el panel al costado,
// los dos altos dejan de sumarse y pasan a competir: la card mide lo que mida el
// más alto de los dos, no su suma.
//
// El panel también cambia de forma con la disposición. En `stacked` conserva la
// proporción vertical de la home; en `row` pasa a cuadrado, porque un panel
// vertical al costado de un texto de tres líneas vuelve a estirar la card y
// deshace lo único que la variante vino a arreglar.
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
  layout = "stacked",
}: {
  index: number;
  title: string;
  body: string;
  layout?: "stacked" | "row";
}) {
  const Art = SCALE_ART[index];
  const row = layout === "row";

  return (
    <li
      data-reveal
      className={`flex rounded-3xl bg-card-tint/70 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-md ${
        // `items-center` en `row` y no `items-start`: el panel es cuadrado y el
        // texto rara vez lo iguala en alto, así que alinear por arriba deja un
        // hueco visible bajo el texto. Centrado, el aire se reparte y la card se
        // lee equilibrada aunque los dos bloques no midan lo mismo.
        row ? "flex-row items-center gap-5" : "flex-col"
      }`}
    >
      {/* El panel del arte. `aspect-[381/401]` es la proporción de los PNG de la
          home —verticales, no cuadrados—, y va como aspecto y no como alto fijo
          para que las cards midan lo mismo a cualquier ancho de columna. Es lo
          que permite que las dos versiones de la sección compartan esta pieza
          aunque sus columnas sean de anchos distintos.

          `rounded-xl` contra el `rounded-3xl` de la card: el redondeo interior
          tiene que ser MENOR que el exterior o los dos bordes dejan de ser
          concéntricos y la card se lee mal sin que se pueda decir por qué. */}
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl bg-background/70 ${
          // En `row` el panel toma un ancho fijo en proporción a la card y se
          // vuelve cuadrado; el `shrink-0` es lo que impide que el texto lo
          // aplaste cuando la columna se estrecha.
          row ? "aspect-square w-[38%] p-3" : "aspect-[381/401] w-full p-5"
        }`}
      >
        <Art />
      </div>

      {/* Sin padding lateral propio: los 24px de la card (`p-6`) ya envuelven a
          los dos hijos por igual, y duplicarlos acá metería al texto más adentro
          que al panel. Lo único que queda es el `pt`, la separación panel→texto. */}
      <div className={`flex min-w-0 flex-col gap-3 ${row ? "" : "pt-6"}`}>
        {/* `text-h3-serif italic`, el mismo rol que la home le da al título de
            card: Kepler, dos escalones por encima de un `text-h4`. En una card el
            rótulo tiene que ser un titular y no una etiqueta del tamaño de su
            propio cuerpo. */}
        {/* Mismo rol serif en las dos disposiciones. En `row` la columna de
            texto es ~55% de una card que ya es un tercio de la sección, así que
            el título quiebra en dos o tres renglones — y aun así se queda en
            `text-h3-serif`, porque el escalón de abajo en la escala serif es
            `text-body-serif`, o sea el tamaño de su propio cuerpo. Un rótulo de
            card que mide lo mismo que su texto sólo se distingue por la familia,
            que es exactamente lo que la home documenta haber corregido.
            
            Si el quiebre molesta, la salida es ensanchar la columna de texto
            (bajar el `w-[38%]` del panel), no encoger el título. */}
        <h3 className="text-h3-serif italic">{title}</h3>
        <p
          className={`text-foreground/75 text-pretty ${row ? "text-body-sm" : "text-body"}`}
        >
          {body}
        </p>
      </div>
    </li>
  );
}
