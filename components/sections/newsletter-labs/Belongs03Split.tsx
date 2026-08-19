import Accent from "@/components/primitives/Accent";
import ShineField from "@/components/primitives/ShineField";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 03 · Split ───────────────────────────────────────────────────────────────
//
// La banda partida en dos por un corte vertical: el claim sobre verde profundo,
// el campo sobre el gris de siempre.
//
// ── El corte reemplaza a las escaleras ──────────────────────────────────────
//
// Las `StairTransition` daban la juntura en horizontal. Acá la tensión la da un
// corte en VERTICAL, en medio de la banda: la sección sigue teniendo un borde
// que se mira, pero ahora separa dos ideas (quién lo dice / qué hay que hacer)
// en vez de dos secciones.
//
// ── Por qué el campo va en la mitad clara ───────────────────────────────────
//
// La píldora de producción es blanca con texto oscuro y su brillo está calibrado
// sobre fondo claro. Sobre el verde profundo habría que invertirla —otro
// componente, otro shader— y esta variante no está probando eso.
export default function Belongs03Split() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      {/* La mitad de color: el claim, alineado al corte. */}
      <div className="flex items-center bg-ink-deep px-[60px] py-20 text-cream lg:justify-end lg:py-28">
        <h2 className="flex w-full max-w-[34rem] flex-col items-start text-h1 text-pretty">
          <Wordmark height="clamp(2rem, 1.5rem + 2.4vw, 3.4rem)" className="mb-1" invert />
          <Accent>{BELONGS_COPY.claim}</Accent>
        </h2>
      </div>

      {/* La mitad clara: el párrafo y el campo. */}
      <div className="flex items-center bg-stone px-[60px] py-20 text-ink lg:py-28">
        <div className="flex w-full max-w-[30rem] flex-col gap-7">
          <p className="text-body-lg text-ink/70 text-pretty">{BELONGS_COPY.body}</p>
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
