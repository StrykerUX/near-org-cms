import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

// El contenido dummy que va ARRIBA del footer, idéntico en las seis rutas.
//
// Existe por una razón sola: un footer no se puede juzgar en el vacío. Los tres
// takeover tapan "la última sección de la página" y los tres restantes se
// descubren al final de un recorrido — sin página que tapar ni recorrido que
// terminar, las seis se ven igual de bien.
//
// Es deliberadamente NEUTRO y no una sección real de la home: con contenido de
// marca compitiendo, la comparación mediría la sección tanto como el footer.
// Gris, tipografía de la escala, cero animación propia.
//
// ── El alto ────────────────────────────────────────────────────────────────
//
// El bloque entero da ~2000px en un viewport de escritorio, sobre el mínimo de
// ~1700px que el lab pide. No es un capricho de encuadre: los seis mecanismos
// se disparan contra el fondo del documento y varios miden un viewport entero
// de recorrido, así que una página corta los deja arrancando ya dentro de su
// propio rango — que es exactamente el bug que `SiteFooter` documenta en su
// `canTakeover()`.

const CARDS = [
  { k: "01", t: "Placeholder", d: "Neutral block. Not real homepage content." },
  { k: "02", t: "Placeholder", d: "It is here to give the footer height and a top edge." },
  { k: "03", t: "Placeholder", d: "Same visual weight across the six lab routes." },
  { k: "04", t: "Placeholder", d: "No animation of its own: nothing competes with the footer." },
  { k: "05", t: "Placeholder", d: "Grey on cream, type from the scale." },
  { k: "06", t: "Placeholder", d: "The last row is the one the takeovers cover." },
];

export default function LabFiller() {
  return (
    <>
      <Container as="section" className="flex min-h-[70svh] flex-col justify-center py-24">
        <Eyebrow className="text-gray-intermediate">Filler content</Eyebrow>
        <p className="text-h1 mt-6 max-w-[16ch] text-balance">Just any page</p>
        <p className="text-body-lg mt-6 max-w-[58ch] text-muted-foreground">
          Everything above the footer is dummy and identical across the six lab
          routes. Scrolling to the bottom is the only instruction.
        </p>
      </Container>

      <Container as="section" className="pb-32">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <article
              key={c.k}
              className="flex min-h-[340px] flex-col justify-between rounded-lg border border-rule bg-stone/25 p-8"
            >
              <p className="text-caption text-gray-intermediate">{c.k}</p>
              <div>
                <h2 className="text-h4">{c.t}</h2>
                <p className="text-body-sm mt-2 text-muted-foreground">{c.d}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
