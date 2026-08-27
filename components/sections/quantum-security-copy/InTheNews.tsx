"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/primitives/ArrowCircle";
import { NEWS_STORIES as STORIES, type NewsStory } from "@/components/sections/quantum-security-copy/quantumContent";

// Press coverage of the quantum threat and of NEAR's readiness. Three cards,
// styled like PressCarousel's (/prototype/carousel-sections): mismos tres
// tonos exactos (verde degradado / gris / negro), mismo radius, mismo
// espaciado y comillas en fila (no superpuestas) — el link con flecha es
// propio de esta sección, PressCarousel no tiene CTA que portar.
const TONE_CARD: Record<NewsStory["tone"], string> = {
  green: "bg-[linear-gradient(155deg,#BBEF7F_0%,#37C142_100%)] text-ink",
  gray: "bg-[#E1E1E1] text-ink",
  dark: "bg-[#1e1e1e] text-white",
};

const TONE_QUOTE: Record<NewsStory["tone"], string> = {
  green: "text-ink/30",
  gray: "text-ink/30",
  dark: "text-white/30",
};

export default function InTheNews() {
  const gridRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-[72px] py-40">
        <div className="flex flex-col gap-4">
          <Eyebrow className="text-ink-soft">In the news</Eyebrow>
          <h2 className="text-h2 text-pretty">
            Blockchain quantum security
            <br />
            <Accent>in the news</Accent>
          </h2>
          <p className="max-w-3xl text-body-lg text-ink-soft text-pretty">
            How the industry is covering the quantum threat, and NEAR&rsquo;s readiness
          </p>
        </div>

        <div ref={gridRef} className="grid items-stretch gap-6 md:grid-cols-3">
          {STORIES.map((story) => {
            const dark = story.tone === "dark";
            return (
              <article
                key={story.href}
                data-reveal
                className={`flex flex-col gap-2 overflow-hidden rounded-[clamp(16px,1.6vw,26px)] p-[clamp(20px,2.2vw,40px)] ${TONE_CARD[story.tone]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-h4">{story.outlet}</p>
                  <span aria-hidden="true" className={`shrink-0 select-none text-h1 ${TONE_QUOTE[story.tone]}`}>
                    &rdquo;
                  </span>
                </div>

                <p className={`max-w-[46ch] text-body-sm text-pretty ${dark ? "text-white/75" : ""}`}>
                  {story.quote}
                </p>

                {/* data-q-arrow-host on the link: the disc reacts to the whole
                    link, label included, not just to itself. */}
                <a
                  href={story.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-q-arrow-host
                  className="mt-auto flex w-fit items-center gap-3 text-label"
                >
                  <ArrowCircle tone="cream" />
                  {story.cta}
                </a>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
