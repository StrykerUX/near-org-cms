import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// H7 · Mural — prueba FUERA, sin movimiento propio.
//
// ── La tesis: invertir qué es lo grande ────────────────────────────────────
//
// Todas las demás variantes agrandan la AFIRMACIÓN ("the settlement layer for
// the agent economy"). Esta agranda la CATEGORÍA: dos palabras, "agent economy",
// cruzando la página de borde a borde, y la afirmación completa arriba, en
// cuerpo de línea de servicio.
//
// Es una apuesta sobre qué pelea está peleando la página. Si la pelea es
// "¿cuál settlement layer?", el titular largo es correcto. Si la pelea es
// "¿esto de la economía de agentes existe y quién tiene los rieles?", entonces la
// palabra grande es el término, no la frase — y el que lo pone en la pantalla
// primero se queda con la categoría.
//
// ── Por qué las cifras salen de acá ────────────────────────────────────────
//
// A esta escala no hay dónde ponerlas sin romper el gesto: cualquier bloque de
// seis datos al lado de una palabra de 176px es un pie de página. Van en la banda
// de abajo (`ProofBand`), y por eso esta variante depende de que esa banda
// exista — sola, es un cartel sin argumento. Ese es su riesgo, y es real.
//
// ── Tipografía ─────────────────────────────────────────────────────────────
//
// `--text-mural` mide su cuerpo en `cqw` —contra el ancho del BLOQUE, no del
// viewport— para que la proporción palabra/página sea la misma a 1440 que a
// 2560. Por eso el Container declara `@container`: sin él, `cqw` resuelve contra
// el viewport y en un monitor ancho la palabra se parte en dos renglones.
//
// Server component: sin entrada animada. Un cartel no necesita presentarse.
export default function H7Mural() {
  return (
    <section className="flex min-h-svh flex-col justify-center bg-cream pt-[var(--site-header-block)] text-foreground">
      <Container className="@container flex flex-col gap-10 py-20">
        <div className="flex flex-col gap-4">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">{HERO.eyebrow}</p>
          {/* La afirmación completa sigue estando, y sigue siendo el `h1`: lo que
              cambia es su cuerpo, no su rango. Un `h1` de dos palabras y un `h2`
              con la frase le mentiría al lector de lectores de pantalla sobre cuál
              es el título de la página. */}
          <h1 className="flex flex-col gap-2">
            <span className="text-h3 text-ink-soft">
              {HERO.lead} {HERO.accent}
            </span>
            {/* ds-exempt: `text-mural` es un rol completo del DS (escala,
                interlineado, tracking y peso); `uppercase` no lo parchea */}
            <span className="text-mural uppercase">Agent economy</span>
          </h1>
        </div>

        <div className="flex flex-col gap-8 border-t border-ink pt-8 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-[46ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
