"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Figure from "@/components/primitives/Figure";
import CtaPill from "@/components/primitives/CtaPill";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import Panel from "@/components/sections/shells/instrument/Panel";
import { CENTER } from "@/components/sections/economics/economicsContent";

// §5 of variant B — one asset, three jobs, and the close.
//
// ── The figure, and the diagram it is not ─────────────────────────────────
// `CENTER` claims the three roles are three jobs of ONE asset, and that each
// reinforces the others. Three columns of prose can state that; they cannot
// show it, because three columns are three parallel things and the claim is
// about a single object.
//
// The obvious drawing is a hub with three lines radiating out of it. That is
// the picture of "a token with three uses", which is precisely what the copy
// says the OTHER tokens have. So the lines run the other way and they do not
// arrive at a point: each one arrives at a different FACE of the same standing
// block. Three faces, one solid — you cannot see all three at once and you are
// never looking at more than one object. That is the claim, drawn.
//
// It reuses the block from `circuit.ts` deliberately: the stations of the loop
// and the asset at the centre of it are made of the same thing, at different
// sizes, which is a sentence the page never has to write.
//
// ── Why it is here and not in variant A ───────────────────────────────────
// In A this would be the page's second ring after `LoopScene`, and two circular
// figures on one page make a reader hunt for a relationship between them that
// does not exist. B's loop is a rhombus of standing blocks, so a fourth block
// closing the page reads as the same machine, not as a second diagram.

// ── Geometry, at module scope ─────────────────────────────────────────────
// The JSX draws these and the timeline positions against them; a number living
// in only one of the two drifts the first time the box moves. Everything is
// integer arithmetic — no trigonometry, so no hydration rounding needed.
const W = 480;
const H = 360;

const BX = 300;
const BY = 232;
const SW = 66;
const SH = SW / 2;
const LIFT = 78;

const up = (x: number, y: number) => `${x},${y - LIFT}`;
const flat = (x: number, y: number) => `${x},${y}`;

const TOP_FACE = [
  up(BX, BY - SH),
  up(BX + SW, BY),
  up(BX, BY + SH),
  up(BX - SW, BY),
].join(" ");
const LEFT_FACE = [
  flat(BX - SW, BY),
  flat(BX, BY + SH),
  up(BX, BY + SH),
  up(BX - SW, BY),
].join(" ");
const RIGHT_FACE = [
  flat(BX, BY + SH),
  flat(BX + SW, BY),
  up(BX + SW, BY),
  up(BX, BY + SH),
].join(" ");

/**
 * One arrival per role, in `CENTER.roles` order, each landing on its own face.
 * `at` is the point on the face, `label` is where the role's name hangs, in %
 * of the box — HTML and not `<text>`, so the type stays on the page's mono
 * scale instead of being multiplied by the figure's own scale.
 */
const ARRIVALS = [
  {
    id: "settlement",
    d: `M 44 56 C 150 56, 214 96, ${BX} ${BY - LIFT}`,
    at: [BX, BY - LIFT],
    leftPct: 8,
    topPct: 9,
    align: "start",
  },
  {
    id: "unit",
    d: `M 44 322 C 140 322, 192 244, ${BX - SW / 2} ${BY - LIFT / 2 + SH / 2}`,
    at: [BX - SW / 2, BY - LIFT / 2 + SH / 2],
    leftPct: 8,
    topPct: 94,
    align: "start",
  },
  {
    id: "coordination",
    d: `M 436 322 C 372 322, 344 244, ${BX + SW / 2} ${BY - LIFT / 2 + SH / 2}`,
    at: [BX + SW / 2, BY - LIFT / 2 + SH / 2],
    leftPct: 92,
    topPct: 94,
    align: "end",
  },
] as const;

const TRACE = "#00dc8d";
const EDGE = "rgba(245,244,241,0.3)";
const FACE = { top: "#1d6b4c", right: "#14523a", left: "#0d3a29" } as const;

const PATH_LEN = 100;

export default function CenterSolid() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const lines = q<SVGPathElement>("[data-arrival]");
    const dots = q("[data-landing]");
    const blocks = q("[data-solid]");

    gsap.set(lines, { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN });
    gsap.set(dots, { autoAlpha: 0 });
    gsap.set(blocks, { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 68%", once: true, markers: DEBUG_MARKERS },
    });

    // The solid arrives first and the lines find it. Drawn the other way round,
    // three lines converging on empty space build a hub — the exact diagram the
    // note above says this one is not.
    tl.to(blocks, { autoAlpha: 1, duration: 0.6 }, 0)
      .to(lines, { strokeDashoffset: 0, duration: 1.3, ease: "power1.inOut", stagger: 0.14 }, 0.3)
      .to(dots, { autoAlpha: 1, duration: 0.4, stagger: 0.14 }, 1.3);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-ink py-[18svh] text-cream">
      <Container>
        <div className="grid-ds items-end gap-y-6">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-white/40">{CENTER.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-[16ch] text-h1 text-balance">{CENTER.headline}</h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[42ch] text-body text-white/60 text-pretty">{CENTER.intro}</p>
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          <Panel label="Fig. 02 · One asset" meta="Three roles, three faces" tone="slate">
            <div className="grid-ds items-center gap-y-14 px-5 pb-10 pt-20 lg:px-8 lg:pb-14 lg:pt-24">
              <div className="col-span-12 lg:col-span-5 lg:row-start-1">
                <Figure
                  tone="dark"
                  caption="Each role arrives on a different face of the same solid."
                >
                  <div className="relative w-full">
                    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" aria-hidden="true">
                      {ARRIVALS.map((a) => (
                        <path
                          key={a.id}
                          data-arrival
                          d={a.d}
                          fill="none"
                          stroke={TRACE}
                          strokeWidth="1.5"
                          pathLength={PATH_LEN}
                        />
                      ))}

                      <g data-solid>
                        <polygon points={LEFT_FACE} fill={FACE.left} stroke={EDGE} strokeWidth="1" />
                        <polygon
                          points={RIGHT_FACE}
                          fill={FACE.right}
                          stroke={EDGE}
                          strokeWidth="1"
                        />
                        <polygon points={TOP_FACE} fill={FACE.top} stroke={EDGE} strokeWidth="1" />
                      </g>

                      {/* Filled landing points: on this site a solid dot is
                          something that has arrived. They are drawn over the
                          faces so the line visibly ends ON the surface. */}
                      {ARRIVALS.map((a) => (
                        <circle
                          key={a.id}
                          data-landing
                          cx={a.at[0]}
                          cy={a.at[1]}
                          r="3.5"
                          fill={TRACE}
                          stroke="none"
                        />
                      ))}
                    </svg>

                    {CENTER.roles.map((r, i) => {
                      const a = ARRIVALS[i];
                      return (
                        <span
                          key={r.id}
                          className="pointer-events-none absolute max-w-[14ch] text-micro-mono uppercase text-white/50"
                          style={{
                            left: `${a.leftPct}%`,
                            top: `${a.topPct}%`,
                            transform:
                              a.align === "end"
                                ? "translate(-100%, -50%)"
                                : "translate(0, -50%)",
                          }}
                        >
                          {r.index} {r.role}
                        </span>
                      );
                    })}
                  </div>
                </Figure>
              </div>

              <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:row-start-1">
                <ol role="list" className="flex flex-col gap-8">
                  {CENTER.roles.map((r) => (
                    <li key={r.id} className="border-t border-white/10 pt-6">
                      <p className="text-micro-mono text-white/30">{r.index}</p>
                      <h3 className="mt-3 text-h4 text-pretty">{r.role}</h3>
                      <p className="mt-3 max-w-[42ch] text-body-sm text-white/60 text-pretty">
                        {r.body}
                      </p>
                      {/* The consequence is the half that argues, so it is set
                          apart from the definition rather than run into it. */}
                      <p className="mt-3 max-w-[38ch] text-caption-mono text-near-green-accent text-pretty">
                        {r.reinforces}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Panel>
        </div>

        <div className="mt-20 grid-ds gap-y-12">
          <p className="col-span-12 max-w-[54ch] text-body-lg text-white/65 text-pretty lg:col-span-6">
            {CENTER.body}
          </p>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            {/* The forward line is the only sentence on the page about what has
                not happened yet, so it is the only one set in the serif. */}
            <p className="max-w-[22ch] text-h2-serif italic text-pretty">{CENTER.forward}</p>
            <CtaPill href={CENTER.cta.href} tone="solid" external className="mt-10">
              {CENTER.cta.label}
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  );
}
