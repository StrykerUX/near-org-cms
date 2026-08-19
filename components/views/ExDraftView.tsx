import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Link from "next/link";
import OwnYourOwn from "@/components/sections/home-ab7/OwnYourOwn";
import ExHero, {
  type ExHeroLayout,
  type ExHeroWord,
} from "@/components/sections/ex/ExHero";
import { type ExNextMode } from "@/components/sections/ex/exNextReveal";

// Los tres drafts EX comparten esta view: hero + «Own Your Own» + un cierre. Lo
// único que las distingue es el FONDO y la COMPOSICIÓN del hero, que llegan por
// prop.
//
// Tres views idénticas salvo dos líneas divergirían en el primer ajuste, y
// entonces la comparación mediría también esa divergencia — que es justo lo que
// estas tres páginas existen para no hacer.
//
// La sección del NEAR Stack llega por prop y no está fijada acá: cada draft
// monta la SUYA (F · Axis, G · Concentric, H · Dolly, del laboratorio de
// `stack-labs`), y las tres se importan de ahí en vez de copiarse — mismo
// motivo que `OwnYourOwn`: el ensamble son ~287KB de paths y su escena es
// geometría medida.
//
// `OwnYourOwn` se IMPORTA de ab7, no se copia. La sección mide 32KB y su gesto
// —las cards atravesando el título quieto— depende de medir el layout en vivo:
// una copia divergiría del original en el primer ajuste de cualquiera de los
// dos lados, y estos drafts no existen para tener su propia versión de una
// sección que ya está resuelta.

const VARIANTS = [
  { id: "ex1", label: "EX1 · video" },
  { id: "ex2", label: "EX2 · field" },
  { id: "ex3", label: "EX3 · ascii" },
] as const;

export type ExDraftViewProps = {
  current: (typeof VARIANTS)[number]["id"];
  background: React.ReactNode;
  layout?: ExHeroLayout;
  word?: ExHeroWord;
  reveal?: ExNextMode;
  tone?: "ink" | "cream";
  /** La variante del NEAR Stack de este draft. */
  stack?: React.ReactNode;
};

export default function ExDraftView({
  current,
  background,
  layout,
  word,
  reveal,
  tone,
  stack,
}: ExDraftViewProps) {
  return (
    <main className="flex flex-col bg-cream">
      <ExHero
        background={background}
        layout={layout}
        word={word}
        reveal={reveal}
        tone={tone}
      />

      <OwnYourOwn />

      {stack}

      <section className="flex min-h-svh items-center bg-cream text-ink">
        <Container className="flex flex-col gap-5">
          <Eyebrow className="text-gray-intermediate">Draft</Eyebrow>
          <p className="max-w-[46ch] text-h3 text-pretty">
            From here down, the page is still to be built.
          </p>
          <p className="max-w-[62ch] text-body-lg text-gray-intermediate text-pretty">
            This pass resolves the hero, the opening of the O and the handover to
            «Own Your Own». The remaining sections, their order and their content
            are the next decision.
          </p>
        </Container>
      </section>

      {/* Para saltar entre los tres sin volver atrás. Abajo y no arriba: el
          header del sitio es fijo y se pisarían. */}
      <div className="sticky bottom-0 z-40 border-t border-ink/10 bg-cream/90 backdrop-blur-sm">
        <Container className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3">
          <span className="text-caption-mono text-gray-intermediate">
            EX drafts
          </span>
          {VARIANTS.map((v) => (
            <Link
              key={v.id}
              href={`/prototype/${v.id}`}
              className={`text-caption-mono transition-colors duration-200 ${
                v.id === current
                  ? "text-green-ink"
                  : "text-gray-intermediate hover:text-ink"
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
