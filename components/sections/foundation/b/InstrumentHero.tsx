"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import {
  HERO,
  PLATES,
  STIFTUNG_FACTS,
} from "@/components/sections/foundation/foundationContent";
import {
  FAR_EDGES,
  NEAR_WALLS,
  ORIGIN,
  V,
  VIEW_BOX,
  at,
  plane,
} from "@/components/sections/foundation/b/apparatus";

// §1 of variant B — the nameplate.
//
// ── Why the hero already carries a panel ───────────────────────────────────
// The failure mode of this variant is being variant A painted black: the same
// paragraphs on ink. What separates them is the unit of composition — a
// paragraph against an apparatus — and the page has to declare that in its
// first screen or the reader arrives at the first panel three sections later
// with nothing to read it as. So the hero states the headline and then hands
// over the object it is about: a case with a name plate, two readings, and
// nothing open yet.
//
// The drawing is the vessel CLOSED, and it is the same vessel the mission
// reads a level off and the Stiftung section cuts open. That sequence —
// closed, gauged, cut away, divided — is the spine of the variant, and it is
// why the geometry lives in `apparatus.ts` rather than in four files.
//
// ── Two of the four legal facts, not four ──────────────────────────────────
// A nameplate carries the identity; the record comes later, in full, in the
// section that is about the record. Both are read off `STIFTUNG_FACTS`, so
// there is no second copy of a legal fact anywhere on the page.
//
// The case gets no `Figure`: the panel already frames it and names it, and a
// caption rule inside a case that has a label engraved on it is two frames
// around one object. The drawings that carry an ARGUMENT — the level and the
// cutaway — do get one, because an argument needs a sentence under it.

/** The lid seam. Far enough below the rim to read as a joint and not as a second rim. */
const SEAM_Z = V.h - 13;

function ClosedCase() {
  return (
    <svg viewBox={VIEW_BOX} className="w-full" aria-hidden="true">
      <g transform={ORIGIN} fill="none" stroke="currentColor" strokeWidth="1">
        <polygon points={plane(V.h)} fill="currentColor" opacity="0.07" stroke="none" />

        {FAR_EDGES.map((d) => (
          <path key={d} d={d} opacity="0.18" />
        ))}

        <polygon points={plane(V.h)} opacity="0.5" />

        {NEAR_WALLS.map((d) => (
          <path key={d} d={d} opacity="0.5" />
        ))}

        {/* The seam runs only along the two walls that face us: carried around
            the back it would describe a joint the viewer cannot see, which is
            the difference between a drawing of an object and a drawing of the
            idea of one. */}
        <path
          d={`M ${at(0, V.d, SEAM_Z)} L ${at(V.w, V.d, SEAM_Z)} L ${at(V.w, 0, SEAM_Z)}`}
          opacity="0.3"
        />
      </g>
    </svg>
  );
}

export default function InstrumentHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const heading = q("[data-hero-heading]")[0];
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
    let split: SplitText | null = null;
    let cancelled = false;

    // The split waits for the fonts: a line mask measured against the fallback
    // face clips the real one. Until it runs the headline is simply on screen.
    const run = () => {
      if (cancelled || !heading) return;
      split = SplitText.create(heading, { type: "lines", mask: "lines", autoSplit: false });
      allowDescenders(split.lines);
      tl.from(split.lines, { yPercent: 112, autoAlpha: 0, duration: 1.05, stagger: 0.12 }, 0);
    };

    if (document.fonts?.ready) document.fonts.ready.then(run).catch(run);
    else run();

    tl.from(q("[data-hero-item]"), { y: 22, autoAlpha: 0, duration: 0.85, stagger: 0.14 }, 0.4);

    return () => {
      cancelled = true;
      split?.revert();
      tl.kill();
    };
  });

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh flex-col justify-between bg-ink pb-[8svh] pt-[calc(var(--site-header-block)+7svh)] text-cream"
    >
      <Container>
        <div data-hero-item>
          <Eyebrow className="text-white/40">{HERO.eyebrow}</Eyebrow>
        </div>
      </Container>

      <Container className="mt-[10svh]">
        <div className="grid-ds gap-y-10">
          <h1
            data-hero-heading
            className="col-span-12 max-w-[18ch] text-h1 lg:col-span-7 lg:text-statement text-balance"
          >
            Enabling community-driven innovation to{" "}
            <Accent display>benefit people</Accent> around the world
          </h1>

          <p
            data-hero-item
            className="col-span-12 max-w-[44ch] text-body-lg text-white/60 lg:col-span-4 lg:col-start-9 lg:self-end text-pretty"
          >
            {HERO.sub}
          </p>
        </div>
      </Container>

      <Container className="mt-[9svh]">
        <div data-hero-item>
          <Panel label={PLATES.hero.label} meta={PLATES.hero.meta}>
            <div className="grid-ds items-center gap-y-10 px-5 pb-8 pt-16 lg:px-7 lg:pb-10 lg:pt-20">
              <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <div className="mx-auto max-w-[16rem]">
                  <ClosedCase />
                </div>
              </div>

              {/* Not a `<dl>`: `Readout` prints two paragraphs, and a
                  definition list whose items are not `dt`/`dd` is worse markup
                  than a plain group — it announces a structure that is not
                  there. The pairing is visual and the shell owns it. */}
              <div className="col-span-12 grid grid-cols-1 gap-8 sm:col-span-6 sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
                {STIFTUNG_FACTS.slice(0, 2).map((fact) => (
                  <Readout key={fact.id} value={fact.value} label={fact.term} />
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </Container>
    </section>
  );
}
