import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { STACK_LAB_VARIANTS, type StackVariantId } from "@/components/sections/stack-labs/stackLabContent";

// El marco de cada ruta del laboratorio: relleno antes y después, más la barra
// para saltar entre variantes.
//
// ── El relleno no es paja ───────────────────────────────────────────────────
//
// Una sección de este tipo no se puede juzgar sola: lo que se está evaluando es
// cómo se siente LLEGAR a ella y cómo se sale. En la homepage la sección entra
// después de `OwnYourOwn` (fondo claro) y entrega a la sección de pruebas
// (blanca), así que el relleno de arriba y el de abajo son claros — el corte
// contra el negro es parte de lo que hay que mirar.
//
// Cada bloque mide una pantalla: lo justo para llegar con inercia de scroll,
// que es la condición real en la que el lector se encuentra la sección.
//
// ── Una ruta por variante ───────────────────────────────────────────────────
//
// Y no las cinco apiladas, como hace `hero-alt`. El motivo es concreto: el
// ensamble son ~287KB de paths, y tres de las cinco montan además un track
// sticky propio. Cinco árboles de ese tamaño en una misma página se notan al
// scrollear, y lo que se estaría midiendo entonces sería la página, no la
// variante.

export default function StackLabShell({
  current,
  children,
}: {
  current: StackVariantId;
  children: React.ReactNode;
}) {
  const spec = STACK_LAB_VARIANTS.find((v) => v.id === current);

  return (
    <main className="flex flex-col bg-cream">
      {/* Lo que viene ANTES en la homepage: una sección clara. */}
      <section className="flex min-h-svh flex-col justify-end bg-cream pb-24 pt-[calc(var(--site-header-block)+3rem)] text-ink">
        <Container className="flex flex-col gap-6">
          <Eyebrow className="text-gray-intermediate">Stack lab</Eyebrow>
          <h1 className="text-h2 max-w-[24ch]">
            {spec?.index} · {spec?.title}
          </h1>
          <p className="max-w-[62ch] text-body-lg text-gray-intermediate text-pretty">
            {spec?.pitch}
          </p>
          <p className="max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
            <span className="text-caption-mono text-green-ink">recorrido:</span> {spec?.travel}
          </p>
          <p className="text-caption-mono text-gray-intermediate">
            Seguí scrolleando — la sección empieza abajo, después de una pantalla
            de aire, para que se sienta como se siente en la página.
          </p>
        </Container>
      </section>

      {children}

      {/* Lo que viene DESPUÉS: en la homepage, la sección de pruebas, blanca. */}
      <section className="flex min-h-svh items-center bg-background text-ink">
        <Container className="flex flex-col gap-4">
          <Eyebrow className="text-gray-intermediate">Lo que sigue</Eyebrow>
          <p className="max-w-[52ch] text-h3 text-pretty">
            Acá entra la sección de pruebas. Está para que se vea el corte de
            salida: negro → blanco.
          </p>
        </Container>
      </section>

      {/* La barra para saltar entre variantes. Abajo y no arriba: el header del
          sitio es fijo y se pisarían. */}
      <div className="sticky bottom-0 z-40 border-t border-cream/15 bg-ink/85 backdrop-blur-sm">
        <Container className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
          <span className="text-caption-mono text-cream/40">Stack lab</span>
          {STACK_LAB_VARIANTS.map((v) => (
            <Link
              key={v.id}
              href={`/prototype/stack-labs/${v.id}`}
              className={`text-caption-mono transition-colors duration-200 ${
                v.id === current ? "text-cta-mint" : "text-cream/60 hover:text-cream"
              }`}
            >
              {v.index} {v.title}
            </Link>
          ))}
        </Container>
      </div>
    </main>
  );
}
