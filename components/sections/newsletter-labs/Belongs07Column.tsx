import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 07 · Column ──────────────────────────────────────────────────────────────
//
// Todo en una columna estrecha alineada a la izquierda, con el resto del ancho
// vacío sobre una retícula tenue. Es lo contrario exacto del centrado de hoy.
//
// La apuesta: en una homepage donde todo está centrado o a sangre, una sección
// que se aparta a un lado y deja dos tercios en silencio se nota MÁS, no menos.
// El vacío no es espacio sobrante: es lo que la hace distinta de sus vecinas.
//
// ── La retícula da escala al vacío ──────────────────────────────────────────
//
// Sin ella, dos tercios de banda gris se leen como un error de maquetación. Con
// ella, se leen como un margen: hay algo ahí, medido, aunque no haya contenido.
// 64px y al 5% — si se lee como cuadrícula, está demasiado fuerte.
export default function Belongs07Column() {
  return (
    <section className="relative overflow-hidden bg-stone py-24 text-ink lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[length:64px_64px] bg-[linear-gradient(rgba(16,16,16,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,16,16,0.05)_1px,transparent_1px)]"
      />

      <Container className="relative">
        <div className="flex max-w-[30rem] flex-col gap-7">
          <h2 className="flex flex-col items-start text-h2 text-pretty">
            <Wordmark height="clamp(1.8rem, 1.4rem + 2vw, 2.8rem)" className="mb-1" />
            <Accent>{BELONGS_COPY.claim}</Accent>
          </h2>

          <p className="text-body text-ink/70 text-pretty">{BELONGS_COPY.body}</p>

          <ShineField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </Container>
    </section>
  );
}
