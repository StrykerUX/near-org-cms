import Accent from "@/components/primitives/Accent";
import ShineField from "@/components/primitives/ShineField";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 01 · Marquee ─────────────────────────────────────────────────────────────
//
// El claim a escala de cartel, tan ancho que roza los dos bordes. La sección
// actual pone ese mismo texto en `text-h2` dentro de una caja de 42rem centrada;
// acá el titular ES la banda.
//
// ── Sin escaleras: el corte es recto y a propósito ──────────────────────────
//
// Las `StairTransition` que hoy abren y cierran esta sección quedaron fuera del
// lab. Lo que las reemplaza no es "nada": es un corte limpio de color, que a
// esta escala de titular funciona porque el borde del bloque de texto ya da la
// tensión que antes daba la escalera.
//
// ── El campo mide lo que mide el titular ────────────────────────────────────
//
// No un ancho fijo: el mismo `max-w` que el bloque de arriba. Es lo que hace que
// el conjunto se lea como UN objeto y no como un cartel con un formulario
// debajo.
export default function Belongs01Marquee() {
  return (
    <section className="bg-stone py-24 text-ink lg:py-32">
      <div className="mx-auto flex w-full max-w-[1780px] flex-col items-center gap-10 px-[60px]">
        <h2 className="flex flex-col items-center text-display text-center text-pretty">
          <Wordmark height="clamp(3rem, 2rem + 5vw, 7rem)" className="mb-1" />
          <Accent display>{BELONGS_COPY.claim}</Accent>
        </h2>

        <p className="max-w-[44ch] text-center text-body-lg text-ink/70 text-pretty">
          {BELONGS_COPY.body}
        </p>

        {/* La píldora real de producción, con su brillo. A este ancho el
            barrido del shine recorre mucho más camino y se lee como una
            invitación, no como un detalle. */}
        <div className="w-full max-w-[36rem]">
          <ShineField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </div>
    </section>
  );
}
