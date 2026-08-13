"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import { NEWS_STORIES as STORIES } from "@/components/sections/quantum/quantumContent";

// Press coverage of the quantum threat and of NEAR's readiness. Three cards,
// the last one inverted because it is NEAR's own announcement rather than
// third-party coverage.

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
                className={`relative flex flex-col gap-5 overflow-hidden rounded-3xl p-8 ${
                  dark ? "bg-ink text-white" : "bg-card-tint text-foreground"
                }`}
              >
                {/* The dark card carries a faint vertical rule pattern, which is
                    what stops a large flat black panel from reading as a hole
                    next to the two tinted ones. */}
                {dark && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.035)_0_3%,rgba(0,0,0,0)_3%_6%)]"
                  />
                )}

                {/* Decorative closing quote, sized off the h1 token. aria-hidden
                    because a screen reader announcing a stray '"' before every
                    card is noise. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-7 top-5 select-none text-h1"
                >
                  &rdquo;
                </span>

                <p className="relative text-h4">{story.outlet}</p>
                <p
                  className={`relative max-w-[34ch] text-body text-pretty ${
                    dark ? "text-white/75" : ""
                  }`}
                >
                  {story.quote}
                </p>

                {/* data-q-arrow-host on the link: the disc reacts to the whole
                    link, label included, not just to itself. */}
                <a
                  href={story.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-q-arrow-host
                  className="relative mt-auto flex w-fit items-center gap-3 text-label"
                >
                  <ArrowCircle />
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
