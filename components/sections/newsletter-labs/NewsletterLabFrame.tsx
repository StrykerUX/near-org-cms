import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import type { NewsletterVariantSpec } from "@/components/sections/newsletter-labs/newsletterLabContent";

// El marco de cada variante: su ficha y las dos bandas de contexto.
//
// ── Por qué hay contexto y no van las ocho seguidas ─────────────────────────
//
// En la homepage esta sección vive ENTRE dos claros: encima la sección de
// pruebas (blanca) y debajo customer stories (crema). Buena parte de lo que se
// está decidiendo es el corte contra esos dos vecinos — sobre todo ahora, que
// las escaleras quedaron fuera y el corte es recto.
//
// Ocho bandas pegadas una a otra se juzgarían contra la banda de al lado, que no
// es donde van a estar. Cada una lleva su propio par de vecinas.
//
// Las bandas miden 28svh y no una pantalla entera: lo justo para que el ojo
// registre el cambio de color al llegar y al salir. Con una pantalla por vecina,
// recorrer las ocho serían dieciséis pantallas de relleno.
export default function NewsletterLabFrame({
  spec,
  children,
}: {
  spec: NewsletterVariantSpec;
  children: React.ReactNode;
}) {
  return (
    <>
      <section
        id={spec.id}
        className="scroll-mt-[var(--site-header-block)] bg-ink-slate text-cream"
      >
        <Container className="flex flex-col gap-5 py-10">
          <div className="flex items-baseline gap-4">
            <span className="text-h2 text-near-green-accent">{spec.index}</span>
            <h2 className="text-h3">{spec.title}</h2>
          </div>
          <dl className="grid grid-cols-1 gap-x-10 gap-y-3 lg:grid-cols-[10rem_12rem_minmax(0,1fr)]">
            <div className="flex flex-col gap-1">
              <dt className="text-caption-mono text-near-green-accent">fondo</dt>
              <dd className="text-body-sm text-cream/70">{spec.ground}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-caption-mono text-near-green-accent">campo</dt>
              <dd className="text-body-sm text-cream/70">{spec.input}</dd>
            </div>
            {/* Solo las tres últimas mueven algo; en las ocho primeras la fila
                no se pinta en vez de decir "nada", que ocuparía lo mismo y
                afirmaría menos. */}
            {spec.motion && (
              <div className="flex flex-col gap-1 lg:col-span-2">
                <dt className="text-caption-mono text-near-green-accent">se mueve</dt>
                <dd className="text-body-sm text-cream/70">{spec.motion}</dd>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <dt className="text-caption-mono text-near-green-accent">qué mirar</dt>
              <dd className="text-body-sm text-cream/70 text-pretty">{spec.pitch}</dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* Lo que hay encima en la homepage: el blanco de la sección de pruebas. */}
      <div className="flex h-[28svh] items-end bg-background">
        <Container className="pb-6">
          <Eyebrow className="text-gray-intermediate/70">↑ sección de pruebas · blanco</Eyebrow>
        </Container>
      </div>

      {children}

      {/* Y lo que sigue: el crema de customer stories. */}
      <div className="flex h-[28svh] items-start bg-cream">
        <Container className="pt-6">
          <Eyebrow className="text-gray-intermediate/70">↓ customer stories · crema</Eyebrow>
        </Container>
      </div>
    </>
  );
}
