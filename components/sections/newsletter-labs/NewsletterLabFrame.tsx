import Container from "@/components/primitives/Container";
import type { NewsletterVariantSpec } from "@/components/sections/newsletter-labs/newsletterLabContent";

// El marco de cada variante: su ficha, y las dos bandas vecinas de la homepage.
//
// ── La ficha pesa MENOS que la pieza, y antes pesaba más ────────────────────
//
// La versión anterior era un bloque `bg-ink-slate` a ancho completo con el
// número en verde a tamaño h2. En una página cuyo trabajo es comparar catorce
// bandas pálidas, eso ponía una losa negra cada dos pantallas: lo primero que
// veía el ojo al scrollear no era ninguna variante, era el rótulo. Y como las
// piezas alternan crema, gris y lima, la página entera se leía como un cebrado.
//
// Ahora la ficha es una CARTELA de museo: crema, un filete arriba, el número en
// mono y los datos en una línea de etiquetas. La pieza es lo único que tiene
// color y masa.
//
// ── El pitch tiene medida ───────────────────────────────────────────────────
//
// En el `dl` de tres columnas anterior el texto largo caía en la tercera y se
// estiraba a todo el ancho disponible: líneas de 140 caracteres, que es el doble
// del máximo legible. Ahora va en su propio renglón, topado a 78ch.
//
// ── Los rótulos de las vecinas, en el borde de FUERA ────────────────────────
//
// Antes «↑ proof section» estaba al final de la banda blanca, es decir pegado a
// la variante, y se leía como si la rotulara a ella. Cada rótulo va ahora en el
// extremo opuesto a la pieza: el de arriba arriba, el de abajo abajo.
//
// ── 22svh y no 28 ───────────────────────────────────────────────────────────
//
// Lo que hay que ver es el CORTE, no la vecina. Con catorce variantes, cada
// svh de más son catorce svh de scroll que no muestran nada.

const BAND = "h-[22svh]";

export default function NewsletterLabFrame({
  spec,
  children,
}: {
  spec: NewsletterVariantSpec;
  children: React.ReactNode;
}) {
  return (
    <>
      <section
        id={spec.id}
        className="scroll-mt-[var(--site-header-block)] border-t border-ink bg-cream text-ink"
      >
        <Container className="flex flex-col gap-3 py-6">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="text-caption-mono text-green-ink">{spec.index}</span>
            <h2 className="text-h4">{spec.title}</h2>

            {/* Los datos, como etiquetas en una sola línea. Tres columnas de un
                `dl` para dos palabras cada una dejaban dos tercios de la fila
                vacíos y obligaban a barrer a lo ancho para leer tres datos. */}
            <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-caption-mono text-gray-intermediate">
              <div className="flex gap-1.5">
                <dt className="text-green-ink">ground</dt>
                <dd>{spec.ground}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-green-ink">field</dt>
                <dd>{spec.input}</dd>
              </div>
              {/* Solo las seis últimas mueven algo; en las ocho primeras la
                  etiqueta no se pinta en vez de decir "nada", que ocuparía lo
                  mismo y afirmaría menos. */}
              {spec.motion && (
                <div className="flex gap-1.5">
                  <dt className="text-green-ink">motion</dt>
                  <dd>{spec.motion}</dd>
                </div>
              )}
            </dl>
          </div>

          <p className="max-w-[78ch] text-body-sm text-gray-intermediate text-pretty">
            {spec.pitch}
          </p>
        </Container>
      </section>

      {/* Lo que hay encima en la homepage: el blanco de la sección de pruebas. */}
      <div className={`flex ${BAND} items-start bg-background`}>
        <Container className="pt-4">
          <span className="text-caption-mono uppercase text-gray-intermediate/60">
            ↑ proof section · white
          </span>
        </Container>
      </div>

      {children}

      {/* Y lo que sigue: el crema de customer stories. */}
      {/* `pb-12` y no `pb-4`: abajo de todo vive la barra de salto, que es
          sticky y taparía el rótulo. */}
      <div className={`flex ${BAND} items-end bg-cream`}>
        <Container className="pb-12">
          <span className="text-caption-mono uppercase text-gray-intermediate/60">
            ↓ customer stories · cream
          </span>
        </Container>
      </div>
    </>
  );
}
