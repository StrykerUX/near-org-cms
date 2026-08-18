import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// La composición que comparten las tres versiones: seis bloques —rótulo, cifra,
// regla, cuerpo— repartidos en doce columnas SIN alinearse entre sí.
//
// Que sea un solo componente y no tres copias es la misma decisión que toman
// los "motores" de `hero-alt` (`FlowCanvas`, `LatticeCanvas`): lo que se está
// comparando entre las tres versiones es el MECANISMO, y con tres markups
// parecidos la comparación mediría también las diferencias de maquetación que
// se colaran sin querer. Acá el markup es idéntico byte a byte; lo único que
// cambia es qué lo anima.
//
// ── Por qué la composición es asimétrica ────────────────────────────────────
//
// Una grilla 3×2 regular con seis celdas del mismo peso se lee como una tabla:
// el ojo la barre en zeta, encuentra seis datos equivalentes y sigue. Que las
// cifras arranquen a distinta altura y midan distinto obliga a recorrerla, y
// —más importante— dice cuál importa más. Dos de las seis van a escala de h1 y
// las otras cuatro a h2: eso es jerarquía, no decoración.
//
// ── El layout es un mapa literal de clases ──────────────────────────────────
//
// Nunca un template string: Tailwind v4 no detecta clases construidas en
// tiempo de ejecución y las purga del CSS. Es la misma razón por la que
// `Container` tiene su `WIDTH` como mapa.
//
// Las clases de posición van todas con prefijo `lg:`. Por debajo de 1024px la
// composición asimétrica no existe —seis bloques en una columna, en orden— y
// eso NO es una degradación: en un móvil no hay doce columnas que repartir, y
// forzar el zigzag ahí produce bloques de cuatro palabras por renglón.

// El zigzag. Los desplazamientos verticales son suaves y suman poco alto total,
// para que las seis entren en 100svh.
//
// Hay UN solo mapa y no uno por versión: las tres tienen que terminar en la
// misma composición, o lo que se compare entre ellas sería la maquetación y no
// el mecanismo. La 03 parte de un escalonado más fuerte, pero ese estado inicial
// lo pone su animación en píxeles — no otro layout.
const PLACE = [
  "lg:col-start-1 lg:col-span-5",
  "lg:col-start-8 lg:col-span-4 lg:mt-20",
  "lg:col-start-2 lg:col-span-4 lg:mt-28",
  "lg:col-start-7 lg:col-span-6 lg:mt-12",
  "lg:col-start-1 lg:col-span-4 lg:mt-24",
  "lg:col-start-6 lg:col-span-4 lg:mt-6",
] as const;

// Cuáles de las seis mandan. No es un dato del contenido —ninguna prueba vale
// objetivamente más que otra— sino una decisión de composición: son las dos que
// caen en las diagonales del recorrido del ojo, y por eso viven acá y no en
// `proofAltContent.ts`.
const LEAD = new Set([0, 3]);

export default function ProofComposition() {
  return (
    <Container className="relative flex flex-col gap-14">
      <Eyebrow className="text-gray-intermediate">Built to</Eyebrow>

      <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-12 lg:gap-y-0">
        {PROOF_STATS.map((stat, i) => (
          <article
            key={stat.id}
            data-block
            data-lead={LEAD.has(i) ? "true" : "false"}
            className={`flex min-w-0 flex-col gap-4 ${PLACE[i]}`}
          >
            <h3 data-eyebrow className="text-h4 text-gray-intermediate">
              {stat.eyebrow}
            </h3>

            {/* `text-balance` en la cifra: cuando una parte en dos líneas
                —"30 + Blockchains" a escala de h1— el reparto por defecto deja
                una línea larga y una de dos letras. */}
            <p
              data-figure
              className={
                LEAD.has(i)
                  ? "text-h1-serif italic text-balance"
                  : "text-h2-serif italic text-balance"
              }
            >
              {stat.value}
              <span className="text-green-ink">{stat.accent}</span>
            </p>

            {/* La regla es un nodo propio y no un `border-b` del bloque: se
                anima escalando desde la izquierda, y un borde no se puede
                escalar sin escalar también su caja. */}
            <span
              data-rule
              aria-hidden="true"
              className="block origin-left border-t border-rule"
            />

            <p data-body className="max-w-[42ch] text-body-sm text-gray-intermediate text-pretty">
              {stat.body}
            </p>
          </article>
        ))}
      </div>
    </Container>
  );
}
