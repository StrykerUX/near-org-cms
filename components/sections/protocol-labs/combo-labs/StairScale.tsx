"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// COMBO C · Stair — la diagonal contra la vertical.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// El trío original de C es coherente hasta la monotonía: bandas verticales en el
// hero, seis columnas verticales en los números, tres columnas verticales en las
// propiedades. Tres pantallas seguidas con la misma dirección de lectura.
//
// Acá la sección 2 va en DIAGONAL. Las seis cifras bajan en escalera, cada una
// arrancando una columna más a la derecha que la anterior, unidas por el filete
// vertical que las cuelga. El campo del hero sigue corriendo en vertical detrás
// de un layout que ahora lo cruza — y esa contradicción es el punto: la
// superficie es el fondo, no el molde.
//
// ── Por qué la escalera no es un adorno ────────────────────────────────────
//
// Hace dos cosas que la fila de seis no puede:
//
//   · **Impone un orden de lectura.** En seis columnas iguales el ojo entra por
//     donde quiere y las seis pesan lo mismo. En escalera hay una primera y una
//     última, y la página puede poner adelante la cifra que más le conviene.
//   · **Da ancho.** Cada escalón ocupa seis de doce columnas, o sea la mitad del
//     contenedor, contra un sexto en la fila. La cifra deja de pelear con su
//     label y la nota entra sin quebrar en tres renglones.
//
// El precio es el alto: seis escalones ocupan bastante más que una franja. Se
// paga con lo que hace la sección 3, que es corta.
//
// ── El desplazamiento es de UNA columna, y esa es la calibración ───────────
//
// Con seis escalones de seis columnas, un paso de una columna deja el último
// arrancando en la 6 y terminando en la 12 — justo el ancho disponible. Un paso
// de dos se saldría de la retícula al cuarto escalón; un paso de media columna
// no se leería como escalera sino como seis bloques mal alineados.
//
// El solape entre un escalón y el siguiente es de cinco sextos: casi total. Es
// lo que hace que se lean como una sola cinta que baja, y no como seis fichas
// escalonadas.

// Mapa literal de clases de retícula. NUNCA un template string: Tailwind v4 no
// detecta clases construidas en tiempo de ejecución y las purga del CSS.
const STEP = [
  "lg:col-start-1",
  "lg:col-start-2",
  "lg:col-start-3",
  "lg:col-start-4",
  "lg:col-start-5",
  "lg:col-start-6",
] as const;

// Las tres propiedades alternan lado. Izquierda, derecha, izquierda: después de
// la escalera —que baja siempre hacia el mismo lado— la alternancia frena la
// deriva y devuelve la página a su eje.
const SIDE = [
  "lg:col-start-1 lg:col-span-6",
  "lg:col-start-7 lg:col-span-6",
  "lg:col-start-1 lg:col-span-6",
] as const;

// La escalera existe en los dos tonos, porque el hero de Spectrum también. Lo
// que cambia es sólo la sección 2 —la que continúa el color del hero—; la 3 es
// blanca en las dos, y es ahí donde está el único corte de valor real de esta
// alternativa.
//
// En claro el filete de cada escalón pasa a `--green-ink`: el menta de la
// versión oscura no llega a 3:1 sobre crema y un filete de 1px en ese verde
// desaparece, que es justo la pieza que cuelga los escalones entre sí.
type StairTone = {
  section: string;
  eyebrow: string;
  stem: string;
  value: string;
  label: string;
  note: string;
};

const TONES: Record<"dark" | "light", StairTone> = {
  dark: {
    section: "border-t border-cream/20 bg-[#070b09] text-cream",
    eyebrow: "text-cream/50",
    stem: "border-cta-mint/30",
    value: "text-cta-mint",
    label: "text-cream/50",
    note: "text-cream/40",
  },
  light: {
    // Mismo crema que el hero. El borde superior marca el corte: sin él, dos
    // secciones del mismo color pierden su frontera — que es lo que hace un
    // degradé de transición, sólo que sin degradé.
    section: "border-t border-ink/20 bg-cream text-foreground",
    eyebrow: "text-gray-intermediate",
    stem: "border-green-ink/40",
    value: "text-green-ink",
    label: "text-gray-intermediate",
    note: "text-gray-intermediate",
  },
};

// ── La prop `proof`: si la escalera se monta o no ─────────────────────────
//
// Las variantes claras la apagan. No es una preferencia visual: sus heroes
// llevan las seis cifras asomando por el borde inferior de la pantalla
// (`ProofPeek`), así que la escalera las mostraba por segunda vez a dos
// pantallas de distancia. Era la tensión que este archivo tenía anotada sin
// resolver, y se resolvió por el lado del asomo — que llega antes y es el que
// hace el trabajo de anunciar que la página sigue.
//
// La versión oscura la conserva, porque su hero no trae cifras: ahí la escalera
// es la única aparición de la evidencia y quitarla dejaría la página sin ella
// hasta el acto.
//
// Con `proof` en false lo que queda es «Built for AI scale» sola, y entonces
// este componente ya no aporta un tono: la sección 3 es blanca en los dos casos.
export default function StairScale({
  tone = "dark",
  proof = true,
}: { tone?: "dark" | "light"; proof?: boolean } = {}) {
  const t = TONES[tone];
  const numbers = useCountUp<HTMLDListElement>({ stagger: 0.1, start: "top 85%" });
  const points = useScrollReveal<HTMLDivElement>({ y: 24, stagger: 0.12 });

  return (
    <>
      {proof && (
      <>
      {/* ── La escalera ────────────────────────────────────────────────────── */}
      {/* Sigue en el color del hero: el corte con la sección 3 lo marca el cambio
          de valor, y el corte con el hero, el filete superior. Ningún degradé
          funde una sección con la siguiente — regla del laboratorio. */}
      <section data-nav-dark={tone === "dark" || undefined} className={t.section}>
        <Container className="flex flex-col gap-10 py-20 lg:py-24">
          <p className={`uppercase text-eyebrow-mono ${t.eyebrow}`}>La evidencia</p>

          <dl ref={numbers} className="grid-ds gap-y-3">
            {PROOF.map((stat, i) => (
              <div
                key={stat.id}
                className={`col-span-full flex flex-col gap-2 border-l ${t.stem} py-4 pl-6 lg:col-span-6 ${STEP[i]}`}
              >
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <dd data-count={stat.value} className={`text-h2 tabular-nums ${t.value}`}>
                    {stat.value}
                  </dd>
                  <dt className={`uppercase text-micro-mono ${t.label}`}>{stat.label}</dt>
                </div>
                {stat.note && (
                  <dd className={`max-w-[48ch] text-body-sm ${t.note} text-pretty`}>
                    {stat.note}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </Container>
      </section>
      </>
      )}

      {/* ── Built for AI scale, tres bloques que alternan ───────────────────── */}
      <section className="bg-background text-foreground">
        <Container className="flex flex-col gap-16 py-24 lg:py-32">
          <div className="grid-ds gap-y-6">
            <h2 className="col-span-full text-h2 text-pretty lg:col-span-6">
              {AI_SCALE.title.lead}
              <br />
              <Accent>{AI_SCALE.title.accent}</Accent>
            </h2>
            <p className="col-span-full max-w-[42ch] text-body-lg text-ink-soft text-pretty lg:col-start-8 lg:col-span-5 lg:pt-2">
              {AI_SCALE.body}
            </p>
          </div>

          <div ref={points} className="grid-ds gap-y-12">
            {AI_SCALE.points.map((p, i) => (
              <div
                key={p.title}
                data-reveal
                className={`col-span-full flex flex-col gap-4 border-t border-ink pt-6 ${SIDE[i]}`}
              >
                {/* El número a escala de titular, no de etiqueta: es lo que le da
                    a un bloque de tres líneas el peso para sostener media
                    pantalla de ancho. */}
                <span className="text-h1 text-rule">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-h3 text-pretty">{p.title}</h3>
                <p className="max-w-[46ch] text-body-lg text-ink-soft text-pretty">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
