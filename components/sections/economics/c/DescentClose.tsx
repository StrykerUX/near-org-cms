"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Figure from "@/components/primitives/Figure";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CENTER } from "@/components/sections/economics/economicsContent";

// §5 of variant C — one asset, three jobs, and the page's exhale.
//
// ── White, and only here, and at the very end ─────────────────────────────
// A and B spend their single white section on the products. C cannot: its
// products are a full-bleed split, and a split needs two grounds that already
// mean something on this page. So the lift is saved for the close — which is
// also where it does the most, because the descent has just spent five screens
// alternating cream and ink and this is the first ground that is neither.
//
// ── Three columns, and the forward line set larger than any of them ───────
// The three roles are equal in standing, so they get identical columns; nothing
// is emphasised over the others and nothing is boxed. Then the page's last
// sentence — the only one about what has not happened yet — is set at
// `text-statement`, larger than the section's own heading. That inversion is
// the close: the page stops describing the system and points past it.
//
// ── Why the one drawn figure of variant C lands here ──────────────────────
// C is the only one of the three layouts that never draws anything: A spends
// its budget on the ring and B on the emission curves, and C spends its on
// typographic scale and full-height panels. That is a defensible variant right
// up to this section, where the copy makes a claim scale cannot carry — three
// roles that REINFORCE each other. Three columns of text can state that; they
// cannot show it, because three columns are three parallel things and the claim
// is about a return.
//
// So `CenterFigure` draws the return and nothing else: one asset, three lobes,
// and each lobe leaves the asset and comes back into it at a different point.
// A spoke diagram — a hub with three lines out — was the first version and it
// is the drawing of a token with three uses, which is the thing the copy
// explicitly says most tokens have. The return stroke is the entire content.
//
// It is NOT repeated in the other two variants, and that is a decision, not an
// oversight. In A it would be the page's second ring after `LoopScene`, and two
// circular figures on one page make the reader look for a relationship between
// them that does not exist. In B it would be a metaphor in the one variant that
// refuses metaphors: B is for the reader who wants the account.
//
// It sits to the LEFT of `CENTER.body`, which inverts this page's own habit of
// heading-left / prose-right. That inversion is the point of putting a figure
// in a close at all — if it landed on the same side and at the same width as
// everything above, it would change the page's rhythm by nothing.

// ── Figure geometry ────────────────────────────────────────────────────────
// Module scope because the SVG paths, the node markers and the HTML index
// labels all read the same three angles: a number that lived in only one of
// them would drift the moment the radius changed. Everything trigonometric is
// rounded to four decimals before it reaches the DOM — `Math.cos`/`Math.sin`
// are explicitly not required by the spec to be correctly rounded, so Node and
// the browser disagree in the last ulp and React refuses to hydrate. Same
// reason, stated at length, in `a/loopRing.ts`.
/** Distance from the asset to each role's node. */
const FIG_R = 70;
/** The asset's own ring. Lobes attach to it rather than starting at the point. */
const HUB_R = 11;
/** Half the angle between a lobe's departure and its return, in radians. */
const MOUTH = 0.16;
/** Where the index labels hang, outside the node ring. */
const LABEL_R = FIG_R + 24;

// The box is sized to the drawing rather than the drawing centred in a square.
// A trefoil with one lobe up and two down is not symmetric about its own
// centre: its extremes are `LABEL_R` above and `LABEL_R / 2` below, so a
// centred origin leaves a band of dead space along the bottom, and since the
// SVG is `w-full` that dead space is paid for by making the whole figure
// smaller in its column.
const FIG_W = 220;
const FIG_H = 190;
const FIG_CX = FIG_W / 2;
const FIG_CY = FIG_H / 2 + LABEL_R / 4;

const round = (n: number) => Math.round(n * 1e4) / 1e4;

// Clockwise from the top, so the three lobes arrive in the reading order of the
// three columns above them.
const LOBES = [0, 1, 2].map((i) => {
  const a = -Math.PI / 2 + (i / 3) * Math.PI * 2;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  // Perpendicular to the axis: how far the lobe bulges before it comes back.
  const px = -uy;
  const py = ux;

  const nx = FIG_CX + ux * FIG_R;
  const ny = FIG_CY + uy * FIG_R;

  // Departure and return sit on the hub ring a few degrees apart. One point for
  // both would draw a closed loop touching a circle, which reads as a bubble;
  // two points read as leaving and coming back.
  // The departure sits on the same side of the hub as the lobe's outward bulge
  // and the return on the other: reversed, the two strands cross each other at
  // the hub and the figure reads as a knot instead of a round trip.
  const outA = a + MOUTH;
  const inA = a - MOUTH;
  const sx = FIG_CX + Math.cos(outA) * HUB_R;
  const sy = FIG_CY + Math.sin(outA) * HUB_R;
  const ex = FIG_CX + Math.cos(inA) * HUB_R;
  const ey = FIG_CY + Math.sin(inA) * HUB_R;

  const c = (base: number, u: number, per: number, axis: "x" | "y") =>
    round(base + u + per * (axis === "x" ? px : py));

  const outward = `${c(FIG_CX, ux * FIG_R * 0.45, FIG_R * 0.42, "x")} ${c(FIG_CY, uy * FIG_R * 0.45, FIG_R * 0.42, "y")}`;
  const nearNodeOut = `${c(nx, -ux * FIG_R * 0.3, FIG_R * 0.34, "x")} ${c(ny, -uy * FIG_R * 0.3, FIG_R * 0.34, "y")}`;
  const nearNodeIn = `${c(nx, -ux * FIG_R * 0.3, -FIG_R * 0.34, "x")} ${c(ny, -uy * FIG_R * 0.3, -FIG_R * 0.34, "y")}`;
  const inward = `${c(FIG_CX, ux * FIG_R * 0.45, -FIG_R * 0.42, "x")} ${c(FIG_CY, uy * FIG_R * 0.45, -FIG_R * 0.42, "y")}`;

  return {
    d: `M ${round(sx)} ${round(sy)} C ${outward}, ${nearNodeOut}, ${round(nx)} ${round(ny)} C ${nearNodeIn}, ${inward}, ${round(ex)} ${round(ey)}`,
    node: { x: round(nx), y: round(ny) },
    // The return point, marked filled: on this site a filled dot is something
    // settled, and the whole claim is that the role settles back into the asset.
    back: { x: round(ex), y: round(ey) },
    // In % of the figure box, because the labels are HTML and not <text>: inside
    // a scaled viewBox an SVG label would be multiplied by the figure's scale
    // and stop matching the mono scale used everywhere else on the page.
    labelLeft: round(((FIG_CX + ux * LABEL_R) / FIG_W) * 100),
    labelTop: round(((FIG_CY + uy * LABEL_R) / FIG_H) * 100),
  };
});

/** One asset, three roles, and the stroke that makes them one system. */
function CenterFigure() {
  return (
    <div className="relative w-full max-w-[26rem]">
      <svg
        viewBox={`0 0 ${FIG_W} ${FIG_H}`}
        className="w-full overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <circle cx={FIG_CX} cy={FIG_CY} r={HUB_R} />
        <circle cx={FIG_CX} cy={FIG_CY} r="3" fill="currentColor" stroke="none" />
        {LOBES.map((l, i) => (
          <g key={i}>
            <path d={l.d} />
            <circle cx={l.node.x} cy={l.node.y} r="4.5" />
            <circle cx={l.back.x} cy={l.back.y} r="1.8" fill="currentColor" stroke="none" />
          </g>
        ))}
      </svg>

      {CENTER.roles.map((r, i) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="absolute -translate-x-1/2 -translate-y-1/2 text-micro-mono text-gray-intermediate"
          style={{ left: `${LOBES[i].labelLeft}%`, top: `${LOBES[i].labelTop}%` }}
        >
          {r.index}
        </span>
      ))}
    </div>
  );
}

export default function DescentClose() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section ref={rootRef} className="bg-background py-[14svh]">
      <Container>
        <div data-reveal>
          <Eyebrow className="text-gray-intermediate">{CENTER.eyebrow}</Eyebrow>
        </div>

        <div className="mt-12 grid-ds gap-y-10">
          <h2 data-reveal className="col-span-12 max-w-[16ch] text-h1 text-pretty lg:col-span-6">
            {CENTER.headline}
          </h2>
          <p
            data-reveal
            className="col-span-12 max-w-[46ch] text-body-lg text-ink-soft text-pretty lg:col-span-5 lg:col-start-8"
          >
            {CENTER.intro}
          </p>
        </div>

        <div className="mt-24 grid-ds gap-y-16">
          {CENTER.roles.map((r) => (
            <div key={r.id} data-reveal className="col-span-12 md:col-span-6 lg:col-span-4">
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <p className="mt-5 text-caption-mono text-gray-intermediate">{r.index}</p>
              <h3 className="mt-8 max-w-[12ch] text-h2 text-pretty">{r.role}</h3>
              <p className="mt-6 max-w-[32ch] text-body text-ink-soft text-pretty">{r.body}</p>
              <p className="mt-6 max-w-[30ch] text-body-sm-mono text-green-ink text-pretty">
                {r.reinforces}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 grid-ds gap-y-14">
          <div data-reveal className="col-span-12 lg:col-span-5">
            <Figure caption="Each role leaves the asset and returns to it. Three jobs, and one thing all three come back to.">
              <CenterFigure />
            </Figure>
          </div>

          <p
            data-reveal
            className="col-span-12 max-w-[52ch] self-center text-body-lg text-ink-soft text-pretty lg:col-span-6 lg:col-start-7"
          >
            {CENTER.body}
          </p>
        </div>

        <div data-reveal className="mt-20">
          <p className="max-w-[18ch] text-statement text-balance">{CENTER.forward}</p>
          <CtaPill href={CENTER.cta.href} tone="filled" external className="mt-14">
            {CENTER.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
