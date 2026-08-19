import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Link from "next/link";
import ExHero, { type ExHeroLayout } from "@/components/sections/ex/ExHero";

// Los tres drafts EX comparten esta view: hero + un bloque de cierre. Lo único
// que las distingue es el FONDO y la COMPOSICIÓN del hero, que llegan por prop.
//
// Tres views idénticas salvo dos líneas divergirían en el primer ajuste, y
// entonces la comparación mediría también esa divergencia — que es justo lo que
// estas tres páginas existen para no hacer.

const VARIANTS = [
  { id: "ex1", label: "EX1 · vídeo" },
  { id: "ex2", label: "EX2 · campo" },
  { id: "ex3", label: "EX3 · ascii" },
] as const;

export type ExDraftViewProps = {
  current: (typeof VARIANTS)[number]["id"];
  background: React.ReactNode;
  layout?: ExHeroLayout;
  tone?: "ink" | "cream";
};

export default function ExDraftView({ current, background, layout, tone }: ExDraftViewProps) {
  return (
    <main className="flex flex-col bg-cream">
      <ExHero background={background} layout={layout} tone={tone} />

      <section className="flex min-h-svh items-center bg-cream text-ink">
        <Container className="flex flex-col gap-5">
          <Eyebrow className="text-gray-intermediate">Draft</Eyebrow>
          <p className="max-w-[46ch] text-h3 text-pretty">
            De acá para abajo, la página está por construir.
          </p>
          <p className="max-w-[62ch] text-body-lg text-gray-intermediate text-pretty">
            Esta pasada resuelve el hero y la apertura de la O. El resto de las
            secciones, su orden y su contenido son la decisión siguiente.
          </p>
        </Container>
      </section>

      {/* Para saltar entre los tres sin volver atrás. Abajo y no arriba: el
          header del sitio es fijo y se pisarían. */}
      <div className="sticky bottom-0 z-40 border-t border-ink/10 bg-cream/90 backdrop-blur-sm">
        <Container className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
          <span className="text-caption-mono text-gray-intermediate">EX drafts</span>
          {VARIANTS.map((v) => (
            <Link
              key={v.id}
              href={`/prototype/${v.id}`}
              className={`text-caption-mono transition-colors duration-200 ${
                v.id === current ? "text-green-ink" : "text-gray-intermediate hover:text-ink"
              }`}
            >
              {v.label}
            </Link>
          ))}
        </Container>
      </div>
    </main>
  );
}
