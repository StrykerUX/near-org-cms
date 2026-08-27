"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/primitives/CtaPill";
import {
  ROADMAP_STAGES as STAGES,
  type RoadmapStage,
} from "@/components/sections/quantum/quantumContent";

// NEAR's post-quantum roadmap: four stages threaded on a spine that draws
// itself as you scroll, with only the stage crossing the middle of the frame at
// full strength.

// How each stage's dot reads. `live` is solid, `progress` is the half-filled
// conic, and the last two are hollow rings that differ only in ring colour —
// research is still green, horizon has gone neutral.
const DOTS = {
  live: "bg-near-green-accent",
  progress: "[background:conic-gradient(var(--near-green-accent)_0_50%,#dcdad4_50%_100%)]",
  research: "border-2 border-green-ink bg-cream",
  horizon: "border-2 border-[#b3b1ab] bg-cream",
} satisfies Record<RoadmapStage["dot"], string>;

// `satisfies` y no `as const` a secas: el tipo de `dot` vive ahora en
// quantumContent (tiene que ser un union de literales para que el contenido sea
// serializable), así que esto es lo que mantiene los dos lados atados — si alguien
// agrega una etapa con un `dot` nuevo y se olvida de la clase, el build falla acá
// en vez de renderizar un punto sin estilo.

// How faint an inactive stage sits. Low enough to read as a ghost, high enough
// that the text is still legible if someone stops mid-scroll.
const DIM = 0.18;

// ── Scroll thresholds ────────────────────────────────────────────────────────
// The spine draws over a longer stretch than any single stage is lit for, on
// purpose: the line should already be arriving before the stage it points at
// takes focus, and should still be growing after it.
const SPINE_START = "top 70%";
const SPINE_END = "bottom 55%";
const SPINE_SCRUB = 0.4;
// A stage is focused while it occupies the middle band of the frame. The two
// numbers are asymmetric because reading happens above centre: a stage lights up
// before its top reaches the middle and stays lit until well past it.
const STAGE_START = "top 62%";
const STAGE_END = "bottom 42%";
const STAGE_FADE = 0.45;
// The dot pops once, slightly before its stage lights up.
const DOT_START = "top 70%";
const DOT_FROM_SCALE = 0.3;
const DOT_DUR = 0.5;

export default function Roadmap() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const track = q("[data-roadline]")[0];
      const fill = q("[data-roadline-fill]")[0];
      const allFades: Element[] = [];

      if (track && fill) {
        gsap.fromTo(
          fill,
          // Revealed by clipping, NOT by scaling. Scaling squashes the gradient
          // into whatever height it has so far, so the colours would slide as it
          // grew; clipping uncovers a gradient that is already at full height.
          //
          // `clip-path` is a paint property, so this repaints the fill every
          // frame of the scrub — but the fill is a 3px-wide hairline, so the
          // repainted area is a few thousand pixels. Left as is: the compositable
          // alternative (scaleY on a child, gradient on a fixed-height ancestor)
          // adds a wrapper and a second transform origin to reason about, to save
          // a repaint that does not show up in a profile.
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: {
              trigger: track,
              start: SPINE_START,
              end: SPINE_END,
              scrub: SPINE_SCRUB,
              invalidateOnRefresh: true,
              markers: DEBUG_MARKERS,
            },
          }
        );
      }

      // One trigger per stage plus one per dot — nine in total for four stages.
      // Left that way on purpose: consolidating them into a single trigger over
      // the section means deriving each stage's threshold from overall progress,
      // and the stages have different heights, so the thresholds would stop being
      // "this stage is in the middle band" and start being "roughly a quarter of
      // the way down". ScrollTrigger handles hundreds of instances; the only cost
      // is re-measuring on refresh, which is nine cheap measurements.
      q("[data-road-item]").forEach((item) => {
        // Only the text columns fade. The dot keeps its opaque halo, which is
        // what makes the spine stop before each circle and pick up after it.
        const fades = item.querySelectorAll("[data-road-fade]");
        allFades.push(...fades);
        gsap.set(fades, { opacity: DIM });
        ScrollTrigger.create({
          trigger: item,
          start: STAGE_START,
          end: STAGE_END,
          onToggle: (st) =>
            gsap.to(fades, {
              opacity: st.isActive ? 1 : DIM,
              duration: STAGE_FADE,
              ease: "power2.out",
              overwrite: "auto",
            }),
        });

        const dot = item.querySelector("[data-road-dot]");
        if (dot) {
          gsap.from(dot, {
            scale: DOT_FROM_SCALE,
            duration: DOT_DUR,
            ease: "back.out(2)",
            scrollTrigger: { trigger: item, start: DOT_START, once: true },
          });
        }
      });

      // Cleanup explícito aunque el contexto de matchMedia revierta los tweens y
      // los triggers de arriba igual: este era el único archivo del directorio que
      // no devolvía nada, y la asimetría invita a asumir que acá no hace falta
      // limpiar. Lo que el revert NO alcanza por sí solo es el `gsap.set` de
      // opacidad sobre los fades, que quedaría inline si un tween lo hubiera
      // tocado a mitad de camino.
      return () => {
        gsap.killTweensOf(allFades);
        gsap.set(allFades, { clearProps: "opacity" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // The gradient hands off to the white of "In the news" over the last 400px
    // rather than at the section boundary, so the seam falls inside the
    // roadmap's bottom padding instead of on a visible edge.
    // The distance is absolute, so it has to be re-tuned whenever the section's
    // height changes: at the old 2062px height this was 560px (~27%), and the
    // tightened timeline keeps roughly that share of a shorter section.
    <section
      ref={rootRef}
      id="roadmap"
      className="text-foreground [background:linear-gradient(to_bottom,var(--cream)_0%,var(--cream)_calc(100%-400px),#ffffff_100%)]"
    >
      <Container className="flex flex-col gap-20 pb-36 pt-28">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-ink-soft">Roadmap</Eyebrow>
            <h2 className="text-h2 text-pretty">
              NEAR&rsquo;s post-quantum
              <br />
              <Accent>roadmap</Accent>
            </h2>
          </div>

          <div className="flex flex-col gap-[18px] lg:pt-2">
            {/* text-h4 and not `text-body-lg font-medium`: this is the lead-in
                subhead of the section, and h4 is the DS role for "short line
                carrying weight" — the sizes are within a step of each other. */}
            <p className="text-h4">One future-proof migration, sequenced in public.</p>
            <p className="max-w-[52ch] text-body text-ink-soft text-pretty">
              Securing accounts is step one. Every layer of a live blockchain eventually
              needs post-quantum protection, and NEAR is sequencing that work so the
              ecosystem migrates once rather than repeatedly.
            </p>
            <p className="text-body-sm text-gray-blue">
              Near One publishes ongoing technical detail on this work as it ships.
            </p>
            <CtaPill href="https://blog.nearone.org" tone="filled" external className="mt-1.5">
              Follow the research
            </CtaPill>
          </div>
        </div>

        <div data-roadline className="relative">
          {/* Two elements: a static hairline the full height, and the gradient
              fill clipped over it. Both hidden below lg — the stacked mobile
              layout has no centre column to thread. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-foreground/15 lg:block"
          />
          <div
            data-roadline-fill
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 hidden w-[3px] -translate-x-1/2 lg:block"
            style={{
              // Runs the CTA ramp down the spine and holds solid green for the
              // last third, so the line resolves to one colour at the endpoint
              // rather than still shifting when it lands.
              background:
                "linear-gradient(to bottom, var(--cta-lime) 0%, var(--cta-mint) 28%, var(--cta-deep) 68%, var(--cta-deep) 100%)",
            }}
          />

          <div className="flex flex-col">
            {STAGES.map((stage) => (
              <div
                key={stage.title}
                data-road-item
                // 110px above AND below each stage was 220px of padding around
                // ~98px of content — the timeline was mostly air, and four of
                // them made the section a scroll in its own right. 56px still
                // reads as a sequence of separate beats rather than a list,
                // and takes ~430px off the section.
                className="relative grid items-center gap-6 py-12 lg:grid-cols-[1fr_96px_1fr] lg:py-14"
              >
                <p
                  data-road-fade
                  className="whitespace-nowrap text-h2 lg:justify-self-center"
                >
                  {stage.when} <Accent>{stage.whenAccent}</Accent>
                </p>

                {/* The 6px ring in the dot's own colour is what punches the hole
                    in the spine behind it. box-shadow and not a border so the
                    dot's own size stays exactly 16px. */}
                <span
                  data-road-dot
                  aria-hidden="true"
                  className={`hidden size-5 rounded-full shadow-[0_0_0_7px_var(--cream)] lg:block lg:justify-self-center ${DOTS[stage.dot]}`}
                />

                <div data-road-fade className="flex max-w-[34rem] flex-col gap-2.5">
                  <h3 className="text-h4">{stage.title}</h3>
                  <p className="text-body text-ink-soft text-pretty">{stage.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
