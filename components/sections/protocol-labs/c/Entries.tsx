"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import EntryMark from "@/components/sections/protocol-labs/c/entryMarks";
import {
  CAPABILITIES,
  type Capability,
} from "@/components/sections/protocol-labs/protocolContent";

// Alternativa C · secciones 4 a 9 — seis entradas de un ensayo.
//
// ── Qué se está probando ───────────────────────────────────────────────────
//
// Que estas seis capacidades se pueden LEER en vez de escanearse (A) o mirarse
// (B). Cada una abre con su palabra cruzando la página de borde a borde y sigue
// con el argumento repartido en dos columnas: a la izquierda qué es, a la
// derecha por qué importa.
//
// La palabra a `--text-mural` es el único elemento a esa escala en toda la
// página después del hero, y son seis. Ese es el riesgo de esta dirección y
// conviene mirarlo de frente: seis palabras gigantes seguidas pueden leerse como
// seis carteles en vez de como seis capítulos. Lo que lo sostiene —si se
// sostiene— es que cada una llega precedida por su marca de avance y seguida por
// un bloque de texto de peso normal, así que el ojo sube y baja de escala en
// lugar de quedarse arriba.
//
// ── El fondo alterna y una entrada es negra ───────────────────────────────
//
// blanco · crema · blanco · INK · blanco · crema. La cuarta es el Private Shard,
// y va en negro por lo mismo que en la alternativa A su figura es la única
// oscura: es la capacidad cuyo contenido no se puede ver. Acá el tratamiento
// alcanza a la entrada entera porque en un ensayo el cambio de fondo es un
// cambio de voz, no un destaque.
//
// ── `text-mural` exige `@container` ───────────────────────────────────────
//
// El token mide su cuerpo en `cqw` —contra el ancho del BLOQUE y no del
// viewport— para que la proporción palabra/página sea la misma a 1440 que a
// 2560. Sin `@container` declarado, `cqw` resuelve contra el viewport y en un
// monitor ancho la palabra se parte en dos renglones. Está documentado en el
// token; se repite acá porque es lo primero que se rompe al copiar el bloque.

// Mapa literal de fondos por índice. No se calcula con un módulo: la cuarta
// entrada es una excepción con motivo, y una excepción dentro de una fórmula se
// lee como un error de la fórmula.
const GROUND = [
  "bg-background text-foreground",
  "bg-cream text-foreground",
  "bg-background text-foreground",
  "bg-ink text-cream",
  "bg-background text-foreground",
  "bg-cream text-foreground",
] as const;

export default function Entries() {
  return (
    <>
      {CAPABILITIES.map((cap, i) => (
        <Entry key={cap.id} cap={cap} index={i} />
      ))}
    </>
  );
}

// Una entrada, con SU propio reveal.
//
// El hook va acá y no en el componente de arriba, y no es una preferencia de
// estilo: `useScrollReveal` dispara una vez cuando su scope entra en viewport,
// así que puesto sobre el contenedor de las seis, las seis entrarían juntas al
// aparecer la primera — y las cinco siguientes ya estarían reveladas cuando el
// lector llegue. Un componente por entrada es también la única forma de llamar
// al hook dentro de un map.
function Entry({ cap, index: i }: { cap: Capability; index: number }) {
  const ref = useScrollReveal<HTMLElement>({ y: 26, stagger: 0.08, start: "top 85%" });
  const dark = i === 3;

  return (
    <section ref={ref} {...(dark ? { "data-nav-dark": "" } : {})} className={GROUND[i]}>
      <Container className="@container flex flex-col gap-10 py-24 lg:py-32">
        <div data-reveal className="flex items-center gap-8">
          <EntryMark index={i + 1} tone={dark ? "dark" : "light"} />
          <span
            className={`uppercase text-micro-mono ${
              dark ? "text-cream/50" : "text-gray-intermediate"
            }`}
          >
            {cap.index} / 06
          </span>
        </div>

        {/* La palabra. `text-mural` ya trae interlineado, tracking y peso; lo
            único que se le agrega acá es el color heredado y las versalitas. */}
        <h2 data-reveal className="text-mural uppercase">
          {cap.key}
        </h2>

        <div className="grid-ds gap-y-8 pt-2">
          <div data-reveal className="col-span-full flex flex-col gap-3 lg:col-span-4">
            <h3 className="text-h3-serif italic">{cap.name}</h3>
            <p
              className={`max-w-[34ch] text-body-sm text-pretty ${
                dark ? "text-cream/55" : "text-gray-intermediate"
              }`}
            >
              {cap.subhead}
            </p>
          </div>

          <div
            data-reveal
            className="col-span-full flex flex-col gap-6 lg:col-start-6 lg:col-span-7"
          >
            <p
              className={`max-w-[62ch] text-body-lg text-pretty ${
                dark ? "text-cream/85" : "text-ink-soft"
              }`}
            >
              {cap.body}
            </p>
            {cap.link && (
              <a
                href={cap.link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-q-arrow-host
                className={`flex w-fit items-center gap-3 text-label ${dark ? "text-cream" : ""}`}
              >
                <ArrowCircle />
                {cap.link.label}
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
