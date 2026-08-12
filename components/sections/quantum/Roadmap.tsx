"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/sections/quantum/CtaPill";

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
} as const;

type Stage = {
  when: string;
  whenAccent: string;
  dot: keyof typeof DOTS;
  title: string;
  body: string;
};

const STAGES: Stage[] = [
  {
    when: "Live",
    whenAccent: "now",
    dot: "live",
    title: "Post-quantum signing",
    body: "FIPS-204 / ML-DSA at the account and protocol level. Rotate through the NEAR CLI.",
  },
  {
    when: "In",
    whenAccent: "progress",
    dot: "progress",
    title: "Wallets and cross-chain",
    body: "Post-quantum support across software and hardware wallets. Quantum-safe Chain Signatures for cross-chain users on NEAR Intents.",
  },
  {
    when: "In",
    whenAccent: "research",
    dot: "research",
    title: "Ownership proofs",
    body: "Zero-knowledge seed-phrase ownership proofs as a quantum contingency.",
  },
  {
    when: "On the",
    whenAccent: "horizon",
    dot: "horizon",
    title: "Deep protocol layers",
    body: "Post-quantum consensus, validators, and epoch sync, the deeper protocol layers that complete the migration.",
  },
];

// How faint an inactive stage sits. Low enough to read as a ghost, high enough
// that the text is still legible if someone stops mid-scroll.
const DIM = 0.18;

export default function Roadmap() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const track = q("[data-roadline]")[0];
      const fill = q("[data-roadline-fill]")[0];

      if (track && fill) {
        gsap.fromTo(
          fill,
          // Revealed by clipping, NOT by scaling. Scaling squashes the gradient
          // into whatever height it has so far, so the colours would slide as it
          // grew; clipping uncovers a gradient that is already at full height.
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: {
              trigger: track,
              start: "top 70%",
              end: "bottom 55%",
              scrub: 0.4,
              invalidateOnRefresh: true,
              markers: DEBUG_MARKERS,
            },
          }
        );
      }

      q("[data-road-item]").forEach((item) => {
        // Only the text columns fade. The dot keeps its opaque halo, which is
        // what makes the spine stop before each circle and pick up after it.
        const fades = item.querySelectorAll("[data-road-fade]");
        gsap.set(fades, { opacity: DIM });
        ScrollTrigger.create({
          trigger: item,
          start: "top 62%",
          end: "bottom 42%",
          onToggle: (st) =>
            gsap.to(fades, {
              opacity: st.isActive ? 1 : DIM,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            }),
        });

        const dot = item.querySelector("[data-road-dot]");
        if (dot) {
          gsap.from(dot, {
            scale: 0.3,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: { trigger: item, start: "top 70%", once: true },
          });
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    // The gradient hands off to the white of "In the news" over the last 560px
    // rather than at the section boundary, so the seam falls inside the
    // roadmap's bottom padding instead of on a visible edge.
    <section
      ref={rootRef}
      id="roadmap"
      className="text-foreground [background:linear-gradient(to_bottom,var(--cream)_0%,var(--cream)_calc(100%-560px),#ffffff_100%)]"
    >
      <Container className="flex flex-col gap-[120px] pb-60 pt-[170px]">
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
                className="relative grid items-center gap-6 py-20 lg:grid-cols-[1fr_96px_1fr] lg:py-[110px]"
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
