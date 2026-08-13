"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";

/**
 * Six diagrams for the protocol spine — one per section, each animating what
 * its section actually claims.
 *
 * Hand-drawn SVG rather than generated art, for one reason: these have to
 * MOVE. A still can show a shard; only a moving one can show it splitting at
 * its threshold, which is the entire point of that section. The visual
 * language is the page's existing isometric one (hairline strokes, planes on
 * a 30° axis, one lit element in the CTA greens), so they sit next to the
 * `iso-*` renders without looking imported.
 *
 * Contract per diagram:
 *   · `Art` renders SVG only — no text. Numbers and words live in the HTML
 *     beside it, where the type scale governs them and a screen reader can
 *     reach them.
 *   · `build(root)` returns a paused timeline. The card plays it on open and
 *     kills it on close, so nothing animates off-screen.
 *   · Every element that moves carries a `data-*` hook. Nothing is selected
 *     by tag or by nth-child, so the markup stays editable.
 */

/* ── Isometric helpers ───────────────────────────────────────────────────── */

const CX = 160;
const CY = 104;
/** How far consensus sits above execution. Big enough to read as separation. */
const LIFT_Z = 58;
const COS30 = 0.866;

/** World (x, y, z) → SVG point on the page's 30° isometric axis. */
const iso = (x: number, y: number, z = 0) =>
  `${(CX + (x - y) * COS30).toFixed(1)},${(CY + (x + y) * 0.5 - z).toFixed(1)}`;

/** A square plane centred on the origin, at height z. */
const plane = (half: number, z = 0) =>
  `M ${iso(-half, -half, z)} L ${iso(half, -half, z)} L ${iso(half, half, z)} L ${iso(-half, half, z)} Z`;

/** The interior grid lines of that plane, as one path. */
const planeGrid = (half: number, z: number, n: number) => {
  const step = (half * 2) / n;
  let d = "";
  for (let i = 1; i < n; i++) {
    const t = -half + step * i;
    d += ` M ${iso(t, -half, z)} L ${iso(t, half, z)}`;
    d += ` M ${iso(-half, t, z)} L ${iso(half, t, z)}`;
  }
  return d.trim();
};

const HAIR = "stroke-cream/40";
const HAIR_SOFT = "stroke-cream/20";

/** Shared frame. 320×200 keeps every diagram on one coordinate system. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-full w-full"
    >
      {children}
    </svg>
  );
}

/**
 * Prepare a stroked path for a draw-on: measure it and park it fully offset.
 * GSAP's DrawSVG plugin does this, but it is not in this repo's licence, and
 * dash arithmetic is four lines.
 */
const armDraw = (el: Element) => {
  const len = (el as SVGPathElement).getTotalLength();
  gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  return len;
};

const drawIn = (tl: gsap.core.Timeline, els: Element[], at: string | number, stagger = 0.08) => {
  els.forEach(armDraw);
  tl.to(els, { strokeDashoffset: 0, duration: 0.7, stagger, ease: "power2.inOut" }, at);
};

/* ── 01 · Nightshade 3.0 — consensus decoupled from execution ────────────── */

function NightshadeArt() {
  return (
    <Frame>
      {/* Execution: the plane that stays put. */}
      <path d={plane(58, 0)} className={HAIR} />
      <path d={planeGrid(58, 0, 3)} className={HAIR_SOFT} />
      {/* Consensus: the plane that lifts away from it. */}
      <g data-lift>
        <path d={plane(58, LIFT_Z)} className="stroke-cream/70" />
        <path d={planeGrid(58, LIFT_Z, 3)} className={HAIR_SOFT} />
        {[
          [-29, -29],
          [29, -29],
          [-29, 29],
          [29, 29],
        ].map(([x, y]) => (
          <circle
            key={`${x}:${y}`}
            data-validator
            cx={CX + (x - y) * COS30}
            cy={CY + (x + y) * 0.5 - LIFT_Z}
            r={3.6}
            className="fill-cta-mint stroke-none"
            style={{ opacity: 0.18 }}
          />
        ))}
      </g>
      {/* The state witness that lets the two stay decoupled. */}
      <circle data-witness r={2.6} className="fill-cta-lime stroke-none" style={{ opacity: 0 }} />
      <path data-witness-track d={`M ${iso(0, 0, LIFT_Z - 3)} L ${iso(0, 0, 2)}`} className="stroke-cta-deep/50" />
    </Frame>
  );
}

function buildNightshade(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });
  const lift = q("[data-lift]");
  const track = q("[data-witness-track]");
  const witness = q("[data-witness]")[0] as unknown as SVGCircleElement | undefined;

  gsap.set(lift, { y: -30, autoAlpha: 0 });
  drawIn(tl, track, 0.5);

  tl.to(lift, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" }, 0)
    .to(q("[data-validator]"), { opacity: 1, duration: 0.35, stagger: 0.09 }, 0.45);

  if (witness) {
    // Travels the same line the witness path draws — consensus proving to
    // execution, which is the upgrade in one gesture.
    tl.fromTo(
      witness,
      { attr: { cx: CX, cy: CY - LIFT_Z + 3 }, opacity: 0 },
      { attr: { cx: CX, cy: CY - 2 }, opacity: 1, duration: 0.75, ease: "power1.in" },
      0.95
    ).to(witness, { opacity: 0, duration: 0.2 }, 1.6);
  }
  return tl;
}

/* ── 02 · Dynamic resharding — a shard splits at its threshold ───────────── */

function ReshardingArt() {
  return (
    <Frame>
      <g data-whole>
        <path d={plane(56, 0)} className={HAIR} />
        <path d={planeGrid(56, 0, 4)} className={HAIR_SOFT} />
      </g>
      {/* The shard, filling toward its state-size limit. */}
      <clipPath id="reshard-clip">
        <path d={plane(56, 0)} />
      </clipPath>
      <g clipPath="url(#reshard-clip)">
        <rect
          data-load
          x={CX - 100}
          y={CY - 60}
          width={200}
          height={120}
          className="fill-cta-deep/45 stroke-none"
          style={{ transformOrigin: `${CX}px ${CY + 60}px`, transform: "scaleY(0)" }}
        />
      </g>
      {/* The threshold it is filling toward. */}
      <path data-threshold d={`M ${iso(-56, 0)} L ${iso(56, 0)}`} className="stroke-cta-lime" strokeWidth={1.5} />
      {/* Two halves, which separate once the split lands. */}
      <g data-half-a>
        <path d={`M ${iso(-56, -56)} L ${iso(0, -56)} L ${iso(0, 56)} L ${iso(-56, 56)} Z`} className="stroke-cream/55" />
        <path
          d={`M ${iso(-28, -56)} L ${iso(-28, 56)} M ${iso(-56, -28)} L ${iso(0, -28)} M ${iso(-56, 0)} L ${iso(0, 0)} M ${iso(-56, 28)} L ${iso(0, 28)}`}
          className={HAIR_SOFT}
        />
      </g>
      <g data-half-b>
        <path d={`M ${iso(0, -56)} L ${iso(56, -56)} L ${iso(56, 56)} L ${iso(0, 56)} Z`} className="stroke-cream/55" />
        <path
          d={`M ${iso(28, -56)} L ${iso(28, 56)} M ${iso(0, -28)} L ${iso(56, -28)} M ${iso(0, 0)} L ${iso(56, 0)} M ${iso(0, 28)} L ${iso(56, 28)}`}
          className={HAIR_SOFT}
        />
      </g>
      <path data-cut d={`M ${iso(0, -56)} L ${iso(0, 56)}`} className="stroke-cta-mint" strokeWidth={2} />
    </Frame>
  );
}

function buildResharding(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });
  const cut = q("[data-cut]");

  gsap.set([q("[data-half-a]"), q("[data-half-b]")], { x: 0, y: 0, autoAlpha: 0 });
  drawIn(tl, cut, 1.0);

  tl.fromTo(q("[data-load]"), { scaleY: 0 }, { scaleY: 1, duration: 1.0, ease: "power1.inOut" }, 0)
    .fromTo(q("[data-threshold]"), { autoAlpha: 0.25 }, { autoAlpha: 1, duration: 0.25 }, 0.85)
    .to([q("[data-half-a]"), q("[data-half-b]")], { autoAlpha: 1, duration: 0.2 }, 1.55)
    // No vote, no human: the halves just move apart along the isometric axis.
    .to(q("[data-half-a]"), { x: -17, y: -10, duration: 0.8, ease: "power2.out" }, 1.6)
    .to(q("[data-half-b]"), { x: 17, y: 10, duration: 0.8, ease: "power2.out" }, 1.6)
    .to(q("[data-load]"), { autoAlpha: 0, duration: 0.5 }, 1.6)
    // The whole shard and the cut that made it stop existing the moment there
    // are two shards. Leaving them on is what turned the split into a cross.
    .to([q("[data-whole]"), q("[data-cut]"), q("[data-threshold]")], { autoAlpha: 0, duration: 0.45 }, 1.7);
  return tl;
}

/* ── 03 · Speed. Scale. Access. — 600ms blocks, 1.2s finality ────────────── */

const RAIL_Y = 80;
const RAIL_X0 = 28;
const BLOCK_W = 42;
const BLOCK_H = 30;
const BLOCK_GAP = 6;
const N_BLOCKS = 6;
/** Finality rests two blocks behind the head: 1.2s against 600ms, to scale. */
const FINAL_BLOCKS = 4;
const blockX = (i: number) => RAIL_X0 + i * (BLOCK_W + BLOCK_GAP);

function SpeedArt() {
  return (
    <Frame>
      {/* Blocks as a chain, not as ticks on a ruler: the thing being measured
          is production, and production is a run of blocks. */}
      {Array.from({ length: N_BLOCKS }, (_, i) => (
        <g key={i} data-block style={{ transformOrigin: `${blockX(i) + BLOCK_W / 2}px ${RAIL_Y}px` }}>
          <rect
            x={blockX(i)}
            y={RAIL_Y - BLOCK_H / 2}
            width={BLOCK_W}
            height={BLOCK_H}
            className="fill-cream/6 stroke-cream/45"
          />
          <path
            d={`M ${blockX(i) + 9} ${RAIL_Y - 6} h 24 M ${blockX(i) + 9} ${RAIL_Y} h 24 M ${blockX(i) + 9} ${RAIL_Y + 6} h 15`}
            className="stroke-cream/20"
          />
          {i > 0 && (
            <path
              d={`M ${blockX(i) - BLOCK_GAP} ${RAIL_Y} h ${BLOCK_GAP}`}
              className="stroke-cream/35"
            />
          )}
        </g>
      ))}

      {/* Finality, running underneath and never catching up. */}
      <path
        d={`M ${RAIL_X0} ${RAIL_Y + 40} H ${blockX(N_BLOCKS - 1) + BLOCK_W}`}
        className={HAIR_SOFT}
      />
      <path
        data-final
        d={`M ${RAIL_X0} ${RAIL_Y + 40} H ${blockX(N_BLOCKS - 1) + BLOCK_W}`}
        className="stroke-cta-mint"
        strokeWidth={2.5}
        style={{ transformOrigin: `${RAIL_X0}px ${RAIL_Y + 40}px` }}
      />
      <circle data-head cx={RAIL_X0} cy={RAIL_Y + 40} r={4} className="fill-cta-lime stroke-none" />

      {/* The gap between produced and final, called out as a measurement. */}
      <g data-lag style={{ opacity: 0 }}>
        <path
          d={`M ${blockX(FINAL_BLOCKS - 1) + BLOCK_W} ${RAIL_Y + 52} v 8 H ${blockX(N_BLOCKS - 1) + BLOCK_W} v -8`}
          className="stroke-cta-lime/70"
        />
      </g>
    </Frame>
  );
}

function buildSpeed(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });
  const blocks = q("[data-block]");
  const stopX = blockX(FINAL_BLOCKS - 1) + BLOCK_W;
  const fullX = blockX(N_BLOCKS - 1) + BLOCK_W;

  gsap.set(blocks, { scaleX: 0.2, autoAlpha: 0 });
  gsap.set(q("[data-final]"), { scaleX: 0 });

  tl.to(blocks, {
    scaleX: 1,
    autoAlpha: 1,
    duration: 0.32,
    stagger: 0.16,
    ease: "back.out(1.4)",
  })
    .to(
      q("[data-final]"),
      { scaleX: (stopX - RAIL_X0) / (fullX - RAIL_X0), duration: 1.35, ease: "none" },
      0.3
    )
    .to(q("[data-head]"), { attr: { cx: stopX }, duration: 1.35, ease: "none" }, 0.3)
    // The last two blocks are produced but not yet final — the honest reading
    // of "600ms blocks, 1.2s finality" rather than a bar that fills to 100%.
    .to(blocks.slice(FINAL_BLOCKS), { autoAlpha: 0.35, duration: 0.4 }, 1.5)
    .to(q("[data-lag]"), { opacity: 1, duration: 0.4 }, 1.7);
  return tl;
}

/* ── 04 · Private Shard — shielded, with selective disclosure ────────────── */

function PrivateShardArt() {
  return (
    <Frame>
      <defs>
        <pattern id="shield-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <line x1="0" y1="0" x2="0" y2="6" className="stroke-cream/20" strokeWidth={1} />
        </pattern>
        <clipPath id="shard-clip">
          <path d={plane(52, 0)} />
        </clipPath>
      </defs>
      <path d={plane(52, 0)} className={HAIR} />
      {/* Shielded from public view — the contents are there, unreadable. */}
      <g clipPath="url(#shard-clip)">
        <rect data-hatch x={CX - 100} y={CY - 60} width={200} height={120} fill="url(#shield-hatch)" stroke="none" />
      </g>
      <path d={planeGrid(52, 0, 3)} className={HAIR_SOFT} />
      {/* The one record that gets disclosed. */}
      <g data-record>
        <path
          d={`M ${iso(-17, -17)} L ${iso(17, -17)} L ${iso(17, 17)} L ${iso(-17, 17)} Z`}
          className="fill-cta-deep/45 stroke-cta-mint"
        />
      </g>
      {/* The beam that opens for it, and closes again. */}
      <path
        data-beam
        d={`M ${iso(-17, -17, 58)} L ${iso(17, -17, 58)} L ${iso(17, 17)} L ${iso(-17, 17)} Z`}
        className="fill-cta-lime/12 stroke-none"
        style={{ opacity: 0 }}
      />
    </Frame>
  );
}

function buildPrivateShard(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });

  gsap.set(q("[data-record]"), { autoAlpha: 0, scale: 0.85, transformOrigin: `${CX}px ${CY}px` });

  tl.fromTo(q("[data-hatch]"), { autoAlpha: 0.35 }, { autoAlpha: 1, duration: 0.7 }, 0)
    .to(q("[data-beam]"), { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.7)
    .to(q("[data-record]"), { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }, 0.85)
    // …and it shuts again. Selective, not open.
    .to(q("[data-beam]"), { opacity: 0, duration: 0.6 }, 2.0)
    .to(q("[data-record]"), { autoAlpha: 0.35, duration: 0.6 }, 2.0);
  return tl;
}

/* ── 05 · Quantum-safe accounts — one key rotation ───────────────────────── */

const ACC_R = 52;

/** An arc on the account ring, from `a0°` to `a1°`, clockwise from 12 o'clock. */
const arc = (r: number, a0: number, a1: number) => {
  const pt = (a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return `${(CX + Math.cos(rad) * r).toFixed(1)},${(CY + Math.sin(rad) * r).toFixed(1)}`;
  };
  return `M ${pt(a0)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${pt(a1)}`;
};

function QuantumArt() {
  return (
    <Frame>
      {/* The account. Everything else swaps; this does not. */}
      <circle cx={CX} cy={CY} r={ACC_R + 22} className={HAIR_SOFT} />
      <circle data-account cx={CX} cy={CY} r={ACC_R} className="stroke-cream/45" />

      {/* The rotation itself, as an arc that closes on the ring. */}
      <path data-sweep d={arc(ACC_R, 0, 359)} className="stroke-cta-lime" strokeWidth={2} />

      {/* Old key out to the left, new key in from the right. Two bits and
          three bits — the second is visibly a bigger key. */}
      <g data-key-old style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <path d={`M ${CX - 20} ${CY} h 40`} className="stroke-cream/55" strokeWidth={1.5} />
        <circle cx={CX - 20} cy={CY} r={7} className="stroke-cream/55" strokeWidth={1.5} />
        <path d={`M ${CX + 8} ${CY} v 9 M ${CX + 17} ${CY} v 6`} className="stroke-cream/55" strokeWidth={1.5} />
      </g>
      <g data-key-new style={{ transformOrigin: `${CX}px ${CY}px`, opacity: 0 }}>
        <path d={`M ${CX - 22} ${CY} h 44`} className="stroke-cta-mint" strokeWidth={2} />
        <circle cx={CX - 22} cy={CY} r={8} className="fill-cta-deep/40 stroke-cta-mint" strokeWidth={2} />
        <path
          d={`M ${CX + 2} ${CY} v 11 M ${CX + 11} ${CY} v 8 M ${CX + 20} ${CY} v 11`}
          className="stroke-cta-mint"
          strokeWidth={2}
        />
      </g>
    </Frame>
  );
}

function buildQuantum(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });
  const sweep = q("[data-sweep]");
  sweep.forEach(armDraw);

  tl.to(
    q("[data-key-old]"),
    { rotation: 180, x: -26, autoAlpha: 0, duration: 0.7, ease: "power2.in" },
    0.35
  )
    .fromTo(
      q("[data-key-new]"),
      { rotation: -180, x: 26, autoAlpha: 0 },
      { rotation: 0, x: 0, autoAlpha: 1, duration: 0.85, ease: "back.out(1.3)" },
      0.8
    )
    // One rotation, drawn as one turn of the ring. It stays green: the account
    // is the same account, and it is now on quantum-safe keys.
    .to(sweep, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0.3)
    .to(q("[data-account]"), { autoAlpha: 0.2, duration: 0.5 }, 1.5);
  return tl;
}

/* ── 06 · Chain Signatures — one account, many chains ────────────────────── */

const TARGETS = [
  { x: 262, y: 34 },
  { x: 290, y: 104 },
  { x: 250, y: 172 },
];

function ChainSignaturesArt() {
  return (
    <Frame>
      <circle cx={48} cy={104} r={30} className={HAIR_SOFT} />
      <circle cx={48} cy={104} r={22} className={HAIR_SOFT} />
      <circle data-source cx={48} cy={104} r={15} className="fill-cta-deep/40 stroke-cta-mint" />
      {TARGETS.map((t, i) => (
        <g key={i}>
          <path
            data-arc
            d={`M 63 104 Q ${(63 + t.x) / 2} ${104 + (t.y - 104) * 0.12} ${t.x - 14} ${t.y}`}
            className="stroke-cta-mint/80"
          />
          <circle data-target cx={t.x} cy={t.y} r={9} className="fill-cream/8 stroke-cream/55" />
          <circle
            data-target-core
            cx={t.x}
            cy={t.y}
            r={3.4}
            className="fill-cta-lime stroke-none"
            style={{ opacity: 0 }}
          />
        </g>
      ))}
    </Frame>
  );
}

function buildChainSignatures(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });

  tl.fromTo(
    q("[data-source]"),
    { scale: 0.7, autoAlpha: 0.4, transformOrigin: "48px 104px" },
    { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.6)" },
    0
  );
  // One signature fans out to every chain at once — no bridge, no relay hop.
  drawIn(tl, q("[data-arc]"), 0.35, 0.14);
  tl.to(q("[data-target-core]"), { opacity: 1, duration: 0.3, stagger: 0.14 }, 0.95)
    .to(q("[data-target]"), { attr: { r: 14 }, duration: 0.3, stagger: 0.14, yoyo: true, repeat: 1 }, 0.95)
    .to(q("[data-target-core]"), { opacity: 0.25, duration: 0.6 }, 2.1);
  return tl;
}

/* ── Registry ────────────────────────────────────────────────────────────── */

export type DiagramKey =
  | "nightshade"
  | "resharding"
  | "speed"
  | "private-shard"
  | "quantum"
  | "chain-signatures";

export const DIAGRAMS: Record<
  DiagramKey,
  { Art: () => React.JSX.Element; build: (root: HTMLElement) => gsap.core.Timeline }
> = {
  nightshade: { Art: NightshadeArt, build: buildNightshade },
  resharding: { Art: ReshardingArt, build: buildResharding },
  speed: { Art: SpeedArt, build: buildSpeed },
  "private-shard": { Art: PrivateShardArt, build: buildPrivateShard },
  quantum: { Art: QuantumArt, build: buildQuantum },
  "chain-signatures": { Art: ChainSignaturesArt, build: buildChainSignatures },
};
