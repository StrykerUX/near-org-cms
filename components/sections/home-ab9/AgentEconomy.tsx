import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { AGENT_ECONOMY as COPY } from "@/components/sections/home-ab9/homeAb9Content";
import GlyphField from "@/components/sections/home-ab9/GlyphField";

// El statement, sobre un card negro con un campo de caracteres detrás.
//
// Ocupa el lugar que en ab7 tenía `QuantumBars` —justo después del hero— y dice
// la misma frase, pero no es esa sección con otra piel: aquella era una escalera
// de siete columnas encastrada al hero por geometría compartida, y esta es una
// caja suelta que flota sobre el crema. Nada acá mide contra la vecina.
//
// ── Los tres colores son literales, y es a propósito ─────────────────────────
//
// El negro del card, el blanco del texto y el verde de los acentos NO salen de
// los tokens del DS, porque ninguno de los tres existe ahí:
//
//   · el card es más negro que `--ink` (#101010) — sobre crema, #101010 se lee
//     gris carbón y el borde del card se ablanda;
//   · el texto es blanco puro, no `--cream` (#f5f4f1), que sobre negro tira a
//     hueso y le saca el filo a la tipografía;
//   · el verde es lima, no `--near-green` (#00ec97), que es turquesa. Es el
//     verde de la referencia y no tiene token.
//
// Van declarados como custom properties del `<section>` —no repartidos por el
// JSX— para que las tres piezas que los usan (el card, la itálica y el canvas)
// se tuneen desde un solo lugar. `--glyph-ink` va en canal RGB suelto porque el
// canvas compone su propio alpha por celda.
const PALETTE = {
  "--card-ink": "#080808",
  "--statement-accent": "#78c552",
  "--glyph-ink": "120, 197, 82",
} as React.CSSProperties;

export default function AgentEconomy() {
  return (
    <section className="bg-cream py-16 text-foreground lg:py-24" style={PALETTE}>
      <Container>
        {/* `isolate`: el canvas es `absolute` dentro de este card y el radio lo
            recorta con `overflow-hidden`. Sin el stacking context propio, el
            `border-radius` no recorta al canvas en Safari cuando algún ancestro
            promueve capa. */}
        <div className="relative isolate @container overflow-hidden rounded-[32px] bg-[var(--card-ink)]">
          <GlyphField />

          {/* El campo llega hasta el centro del card y le pelea contraste al
              statement. En vez de bajarle el alpha en todo el canvas —que lo
              apagaría también en los bordes, que es donde se tiene que ver— se
              apoya el color del card sobre la zona del texto y se desvanece
              antes de llegar al borde.

              Es un velo, no una tapa: los glifos SE VEN detrás de las letras, y
              tienen que verse. Subirlo hasta opacar el centro deja un óvalo
              liso en medio del card que se lee como un error de composición. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 58% 42% at 50% 48%, color-mix(in srgb, var(--card-ink) 78%, transparent) 0%, color-mix(in srgb, var(--card-ink) 45%, transparent) 55%, transparent 80%)",
            }}
          />

          {/* El aire vertical es asimétrico —más arriba que abajo— porque el
              campo de glifos se densifica en el tercio inferior: con el bloque
              centrado a ojo, el texto queda apoyado sobre la parte cargada. Va
              en % del ANCHO y no en rem para que el card conserve su proporción
              a cualquier tamaño en vez de achatarse al ensanchar.

              El `max-w` va en **em**, y esa unidad es el punto entero: en em, la
              medida de línea escala con el font-size, así que el reparto en seis
              líneas —y sobre todo dónde caen los dos acentos serif— es el mismo
              en cualquier viewport. En rem o en % el bloque se ensancharía por su
              cuenta y el quiebre se movería con el ancho de la ventana: la línea
              más larga ("Quantum-resistant and confidential") se comería la
              siguiente y los acentos dejarían de cerrar sus líneas. 16em son
              ~36 caracteres: un poco más que esa línea, que es lo que le deja
              aire al reparto sin que ninguna otra se le suba encima.

              El `@container` del card es la otra mitad del mismo acuerdo:
              `--text-manifesto` mide su cuerpo en `cqw`, así que sin contenedor
              declarado resolvería contra el viewport y el texto crecería
              mientras el card ya topó en su `max-width`. */}
          <div className="relative flex flex-col items-center px-6 pb-[9%] pt-[11%] sm:px-10">
            <h2 className="max-w-[16em] text-center text-manifesto text-pretty text-white">
              {COPY.lead}{" "}
              <span className="text-[color:var(--statement-accent)]">
                <Accent>{COPY.accentA}</Accent>
              </span>{" "}
              {COPY.body}{" "}
              <span className="text-[color:var(--statement-accent)]">
                <Accent>{COPY.accentB}</Accent>
              </span>
            </h2>
          </div>
        </div>
      </Container>
    </section>
  );
}
