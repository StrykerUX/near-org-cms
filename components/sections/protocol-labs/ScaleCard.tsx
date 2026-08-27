import { SCALE_ART } from "@/components/sections/protocol-labs/scaleArt";

// La card de una propiedad de «Built for AI scale».
//
// ── Por qué sigue siendo un componente ────────────────────────────────────
//
// Nació para que tres disposiciones de la sección compartieran exactamente la
// misma card mientras se comparaban. Quedó una sola, así que hoy tiene un
// consumidor y podría estar inline en `ScaleClaim`.
//
// Se queda aparte igual, por lo que la card ES: una copia del objeto de «Own
// Your Own» de la home, con su calibración propia anotada. Metido dentro de la
// sección, ese razonamiento se lee como parte del layout y se pierde el día que
// alguien reordene las columnas — que es justo cuando hace falta.
//
// ── El objeto es el de «Own Your Own» en la home ──────────────────────────
//
// Sus tres partes, enteras: el panel de arte con su propio redondeo y su fondo
// un tono por encima de la card, el título serif y el cuerpo. No es una cita
// estética — es el único componente-caja que la línea de diseño viva tiene, y
// una página nueva que invente el suyo obliga a mantener dos.
//
// **El tinte es el mismo que en la home, y ahora sí puede serlo.** `card-tint`
// al 50% compone ≈ #f5f4f1 sobre crema: un escalón por debajo del fondo, que es
// la relación que hace que se lean como cards.
//
// Estuvo un rato al 70%, y no por gusto: la sección era de fondo blanco puro, y
// sobre blanco ese 50% compone ≈ #f5f4f1 —la mitad de contraste— y dejaba las
// cards a medio camino entre caja y mancha. Al pasar la sección a crema, el
// motivo desapareció y el número vuelve al de la home. Lo que se copia de allá
// es la RELACIÓN con su fondo; el porcentaje es sólo su consecuencia, y hay que
// recalcularlo cada vez que el fondo cambie.
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
      className="flex flex-col rounded-3xl bg-card-tint/50 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-md"
    >
      {/* El panel del arte. `aspect-[381/401]` es la proporción de los PNG de la
          home —verticales, no cuadrados—, y va como aspecto y no como alto fijo
          para que las cards midan lo mismo a cualquier ancho de columna. Es lo
          que permite que las dos versiones de la sección compartan esta pieza
          aunque sus columnas sean de anchos distintos.

          `rounded-xl` contra el `rounded-3xl` de la card: el redondeo interior
          tiene que ser MENOR que el exterior o los dos bordes dejan de ser
          concéntricos y la card se lee mal sin que se pueda decir por qué. */}
      {/* El panel sí es blanco: es el tono que queda POR ENCIMA de la card, y
          sobre un fondo crema el único que sube de verdad. Con crema otra vez
          desaparecería contra su propia caja. */}
      <div className="flex aspect-[381/401] w-full items-center justify-center rounded-xl bg-background/70 p-5">
        <Art />
      </div>

      {/* Sin padding lateral propio: los 24px de la card (`p-6`) ya envuelven a
          los dos hijos por igual, y duplicarlos acá metería al texto más adentro
          que al panel. Lo único que queda es el `pt`, la separación panel→texto. */}
      <div className="flex min-w-0 flex-col gap-3 pt-6">
        {/* `text-h3-serif italic`, el mismo rol que la home le da al título de
            card: Kepler, dos escalones por encima de un `text-h4`. En una card el
            rótulo tiene que ser un titular y no una etiqueta del tamaño de su
            propio cuerpo. */}
        {/* `text-h3-serif italic`, el mismo rol que la home le da al título de
            card: Kepler, dos escalones por encima de un `text-h4`. En una card el
            rótulo tiene que ser un titular y no una etiqueta del tamaño de su
            propio cuerpo — el escalón de abajo en la escala serif es
            `text-body-serif`, o sea el tamaño de su cuerpo. */}
        <h3 className="text-h3-serif italic">{title}</h3>
        <p className="text-body text-foreground/75 text-pretty">{body}</p>
      </div>
    </li>
  );
}
