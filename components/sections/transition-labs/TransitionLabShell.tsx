import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import OwnYourOwn from "@/components/sections/home-ab7/OwnYourOwn";
import StackTriptych from "@/components/sections/stack-labs/StackTriptych";
import { TRANSITIONS, type TransitionId } from "@/components/sections/transition-labs/transitionLabContent";

// El marco de cada ruta del laboratorio de transiciones.
//
// ── Las dos secciones son las DE VERDAD ─────────────────────────────────────
//
// `OwnYourOwn` de ab7 y el tríptico del stack, importados, sin maquetas ni
// stubs. Una transición entre dos rectángulos de color es una transición entre
// dos rectángulos de color: lo que hay que juzgar es cómo se siente llegar con
// las cards todavía en la retina y salir con la columna ya en pantalla.
//
// El precio es que cada ruta es pesada —dos secciones grandes, una con canvas—,
// y por eso hay UNA ruta por transición y no las cinco apiladas: cinco árboles
// de ese tamaño en la misma página se notan al scrollear, y lo que se estaría
// midiendo entonces es la página.
//
// ── El encabezado va arriba del todo ────────────────────────────────────────
//
// Antes de `OwnYourOwn` y no entre las dos secciones: la transición tiene que
// encontrarse con inercia de scroll y sin nada raro justo antes, que es como se
// la va a encontrar en la página.

export default function TransitionLabShell({
  current,
  children,
}: {
  current: TransitionId;
  children: React.ReactNode;
}) {
  const spec = TRANSITIONS.find((t) => t.id === current);

  return (
    <main className="flex flex-col bg-cream">
      <section className="flex min-h-svh flex-col justify-end bg-cream pb-24 pt-[calc(var(--site-header-block)+3rem)] text-ink">
        <Container className="flex flex-col gap-6">
          <Eyebrow className="text-gray-intermediate">Transición</Eyebrow>
          <h1 className="text-h2 max-w-[24ch]">
            {spec?.index} · {spec?.title}
          </h1>
          <p className="max-w-[62ch] text-body-lg text-gray-intermediate text-pretty">
            {spec?.pitch}
          </p>
          <p className="max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
            <span className="text-caption-mono text-green-ink">cuesta:</span> {spec?.cost}
            {" · "}
            <span className="text-caption-mono text-green-ink">técnica:</span> {spec?.stack}
          </p>
          <p className="text-caption-mono text-gray-intermediate">
            Seguí scrolleando — abajo está «Own Your Own», después la transición,
            y después el stack.
          </p>
        </Container>
      </section>

      <OwnYourOwn />

      {children}

      <StackTriptych />

      {/* La barra para saltar entre transiciones. Abajo y no arriba: el header
          del sitio es fijo y se pisarían. */}
      <div className="sticky bottom-0 z-40 border-t border-cream/15 bg-ink/85 backdrop-blur-sm">
        <Container className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
          <span className="text-caption-mono text-cream/40">Transiciones</span>
          {TRANSITIONS.filter((t) => t.current).map((t) => (
            <Link
              key={t.id}
              href={`/prototype/transition-labs/${t.id}`}
              className={`text-caption-mono transition-colors duration-200 ${
                t.id === current ? "text-cta-mint" : "text-cream/60 hover:text-cream"
              }`}
            >
              {t.index} {t.title}
            </Link>
          ))}
        </Container>
      </div>
    </main>
  );
}
