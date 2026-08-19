import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Ex2Hero from "@/components/sections/ex2/Ex2Hero";

// EX2 — el borrador de una homepage nueva, más tipográfica.
//
// No es un fork de ab7: no comparte ninguna sección con ella. Lo único que
// reusa es el ASSET del vídeo (`/prototype/v2/hero-descent-v2.mp4`), que ya está
// en `public/` y no tiene sentido duplicar.
//
// ── Qué hay en esta pasada y qué no ─────────────────────────────────────────
//
// Hay: el hero de cartel sobre el vídeo, y la transición en la que la O de
// WORLD se abre y descubre la sección siguiente.
//
// No hay: contenido definitivo, resto de secciones, ni móvil. El objetivo de
// este draft es decidir si el mecanismo funciona; todo lo demás vendría después
// y con el contenido ya cerrado.
//
// La sección que sigue al hero vive DENTRO de `Ex2Hero`, en la capa recortada.
// Lo que va debajo en esta view es lo que viene DESPUÉS de esa transición.
export default function Ex2View() {
  return (
    <main className="flex flex-col bg-cream">
      <Ex2Hero />

      {/* El resto de la página, por construir. Existe para que el hero tenga
          algo debajo y el scroll no termine en seco al salir del track. */}
      <section className="flex min-h-svh items-center bg-cream text-ink">
        <Container className="flex flex-col gap-5">
          <Eyebrow className="text-gray-intermediate">Draft</Eyebrow>
          <p className="max-w-[46ch] text-h3 text-pretty">
            De acá para abajo, la página está por construir.
          </p>
          <p className="max-w-[62ch] text-body-lg text-gray-intermediate text-pretty">
            Esta pasada resuelve el hero y la apertura de la O. El resto de las
            secciones, su orden y su contenido son la decisión siguiente.
          </p>
        </Container>
      </section>
    </main>
  );
}
