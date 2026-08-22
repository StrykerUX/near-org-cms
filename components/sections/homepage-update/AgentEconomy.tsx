import Image from "next/image";

import Container from "@/components/primitives/Container";
import { AGENT_ECONOMY as COPY } from "@/components/sections/homepage-update/homepageUpdateContent";

// El statement, en negro sobre el crema, con el icono de NEAR abriendo la frase.
//
// Ocupa el lugar que en ab7 tenía `QuantumBars` —justo después del hero— y dice
// la misma frase que decía el card negro que estuvo acá hasta el 2026-08-22.
// No es ese card repintado: aquel era una caja `rounded-[32px]` flotando sobre
// el crema, con su campo de glifos detrás y el texto centrado. Este no tiene
// caja ni fondo propio; es tipografía apoyada sobre el mismo crema que traen las
// secciones vecinas, alineada a la izquierda. Lo único que sobrevivió es la
// frase.
//
// ── Por qué el verde es literal ──────────────────────────────────────────────
//
// No sale de los tokens del DS porque no existe ahí: `--near-green` (#00ec97)
// es turquesa y sobre crema se lava hasta perder el filo. Este es hoja, tomado
// del medio del gradiente del icono para que el acento y el glifo se lean como
// la misma tinta. Va como custom property del `<section>` —no suelto en el
// JSX— para tunearlo desde un solo lugar.
const PALETTE = {
  "--statement-accent": "#5cb946",
} as React.CSSProperties;

export default function AgentEconomy() {
  return (
    <section className="bg-cream py-24 text-foreground lg:py-36" style={PALETTE}>
      <Container>
        {/* El `@container` es la mitad de un acuerdo con `--text-manifesto`, que
            mide su cuerpo en `cqw`: sin contenedor declarado resolvería contra
            el viewport y el texto seguiría creciendo cuando el `Container` ya
            topó en su `max-width`. */}
        <div className="@container">
          {/* `items-baseline` y no `items-start` ni `items-center`: en la
              referencia el icono se apoya sobre la BASELINE de la primera línea
              —sobresale por encima de la altura de mayúscula y baja justo hasta
              donde se sienta la N de "NEAR"—. Una imagen en flexbox no tiene
              baseline tipográfica: la suya es su borde inferior, que es
              exactamente el anclaje que hace falta. Alinearlo por el top exige
              un `margin` negativo calculado contra las métricas de Montreal, y
              eso se desalinea solo el día que cambie la fuente.

              El icono va FUERA del `<h2>` y no como span inline al principio de
              la frase, porque el texto tiene que sangrar parejo en las seis
              líneas: inline, las líneas 2 a 6 volverían al margen y el icono
              quedaría flotando en un hueco.

              `w-fit mx-auto` centra el CONJUNTO —icono más columna de texto— en
              el ancho del `Container`, sin tocar la alineación interna: las seis
              líneas siguen arrancando todas en el mismo margen izquierdo y
              cerrando desparejas a la derecha. `justify-center` no serviría: el
              `<h2>` es un flex item que se estira hasta sus 17em aunque la línea
              más larga mida menos, así que centraría la caja y no el texto. */}
          <div className="mx-auto flex w-fit items-baseline gap-[0.52em] text-manifesto">
            <Image
              src="/prototype/homepage-update/near-icon.png"
              alt=""
              aria-hidden="true"
              width={296}
              height={296}
              className="h-[1.07em] w-[1.07em] shrink-0"
            />

            {/* El `max-w` va en **em**, y esa unidad es el punto entero: en em
                la medida de línea escala con el font-size, así que el reparto en
                seis líneas —y sobre todo dónde cae el acento, que tiene que
                cerrar la última— es el mismo en cualquier viewport. En rem o en
                % el bloque se ensancharía por su cuenta y el quiebre se movería
                con el ancho de la ventana: la línea más larga ("Quantum-
                resistant and confidential") se comería la siguiente y el acento
                dejaría de quedar solo. 17em son ~38 caracteres: un poco más que
                esa línea, que es lo que le deja aire al reparto sin que ninguna
                otra se le suba encima. */}
            <h2 className="max-w-[17em]">
              {COPY.body}{" "}
              {/* El token `--text-manifesto` define un solo peso (500) para todo
                  el rol, y acá el acento pesa MÁS que el cuerpo dentro de la misma
                  frase. No es un rol tipográfico nuevo que merezca su token: es el
                  contraste interno del statement, y vive con él. */}
              {/* ds-exempt: acento más pesado que su propia frase */}
              <strong className="font-bold text-[color:var(--statement-accent)]">
                {COPY.accent}
              </strong>
            </h2>
          </div>
        </div>
      </Container>
    </section>
  );
}
