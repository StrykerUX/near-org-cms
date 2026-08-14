"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";

/**
 * Six diagrams for the protocol spine — one per claim, each animating what its
 * claim actually says.
 *
 * Visual language (second pass): the NEAR Stack isometric CUBES, matched to
 * the brand frames Lawrence supplied — wireframe hairline cubes for structure,
 * and solid cubes with three green faces (lime top, mint left, deep right) for
 * whatever is live or active. Dark ground; the cards these render in stay
 * dark. The first pass drew flat planes and dots, which read as engineering
 * schematics rather than the brand's object world.
 *
 * Contract per diagram (unchanged):
 *   · `Art` renders SVG only — no text. Numbers and words live in the HTML.
 *   · `build(root)` returns a paused timeline. The card plays it on open and
 *     kills it on close; they play once and HOLD their resolved state.
 *   · Every element that moves carries a `data-*` hook.
 */

/* ── Isometric helpers ───────────────────────────────────────────────────── */

const CX = 160;
const CY = 104;
/** How far consensus sits above execution in the Nightshade diagram. */
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

/**
 * The three visible faces of a cube: world square x±s / y±s, bottom at z,
 * edge 2s. Everything cube-shaped on this page is built from these paths.
 */
const cubeFaces = (x: number, y: number, z: number, s: number) => ({
  top: `M ${iso(x - s, y - s, z + 2 * s)} L ${iso(x + s, y - s, z + 2 * s)} L ${iso(x + s, y + s, z + 2 * s)} L ${iso(x - s, y + s, z + 2 * s)} Z`,
  left: `M ${iso(x - s, y + s, z + 2 * s)} L ${iso(x + s, y + s, z + 2 * s)} L ${iso(x + s, y + s, z)} L ${iso(x - s, y + s, z)} Z`,
  right: `M ${iso(x + s, y + s, z + 2 * s)} L ${iso(x + s, y - s, z + 2 * s)} L ${iso(x + s, y - s, z)} L ${iso(x + s, y + s, z)} Z`,
});

/** Solid brand cube: lime top, mint left, deep right — the reference's ramp. */
function GreenCube({ x = 0, y = 0, z = 0, s }: { x?: number; y?: number; z?: number; s: number }) {
  const f = cubeFaces(x, y, z, s);
  return (
    <g>
      <path d={f.top} className="fill-cta-lime stroke-none" />
      <path d={f.left} className="fill-cta-mint stroke-none" />
      <path d={f.right} className="fill-cta-deep stroke-none" />
    </g>
  );
}

/** Hairline wireframe cube — structure, capacity, the not-yet-active. */
function WireCube({
  x = 0,
  y = 0,
  z = 0,
  s,
  className = HAIR,
}: {
  x?: number;
  y?: number;
  z?: number;
  s: number;
  className?: string;
}) {
  const f = cubeFaces(x, y, z, s);
  return <path d={`${f.top} ${f.left} ${f.right}`} fill="none" className={className} />;
}

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
 * GSAP's DrawSVG plugin does this, but it is not in this repo's licence.
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
      {/* Consensus: the plane that lifts away, its validators as live cubes. */}
      <g data-lift>
        <path d={plane(58, LIFT_Z)} className="stroke-cream/70" />
        <path d={planeGrid(58, LIFT_Z, 3)} className={HAIR_SOFT} />
        {[
          [-29, -29],
          [29, -29],
          [-29, 29],
          [29, 29],
        ].map(([x, y]) => (
          <g key={`${x}:${y}`} data-validator style={{ opacity: 0.18 }}>
            <GreenCube x={x} y={y} z={LIFT_Z} s={6} />
          </g>
        ))}
      </g>
      {/* The state witness travelling between the layers. */}
      <path
        data-witness-track
        d={`M ${iso(0, 0, LIFT_Z - 3)} L ${iso(0, 0, 2)}`}
        className="stroke-cta-deep/50"
      />
      <g data-witness style={{ opacity: 0 }}>
        <GreenCube x={0} y={0} z={LIFT_Z - 10} s={4} />
      </g>
    </Frame>
  );
}

function buildNightshade(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });
  const lift = q("[data-lift]");
  const track = q("[data-witness-track]");

  gsap.set(lift, { y: -30, autoAlpha: 0 });
  drawIn(tl, track, 0.5);

  tl.to(lift, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" }, 0)
    .to(q("[data-validator]"), { opacity: 1, duration: 0.35, stagger: 0.09 }, 0.45)
    // Consensus proving to execution — the upgrade in one gesture: the
    // witness cube rides the track down and hands off.
    .fromTo(
      q("[data-witness]"),
      { y: 0, opacity: 0 },
      { y: LIFT_Z - 14, opacity: 1, duration: 0.75, ease: "power1.in" },
      0.95
    )
    .to(q("[data-witness]"), { opacity: 0, duration: 0.2 }, 1.7);
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
      {/* Two halves, which separate once the split lands — each born with its
          own live cube, because a new shard is a new working validator set. */}
      <g data-half-a>
        <path d={`M ${iso(-56, -56)} L ${iso(0, -56)} L ${iso(0, 56)} L ${iso(-56, 56)} Z`} className="stroke-cream/55" />
        <path
          d={`M ${iso(-28, -56)} L ${iso(-28, 56)} M ${iso(-56, -28)} L ${iso(0, -28)} M ${iso(-56, 0)} L ${iso(0, 0)} M ${iso(-56, 28)} L ${iso(0, 28)}`}
          className={HAIR_SOFT}
        />
        <g data-born style={{ opacity: 0 }}>
          <GreenCube x={-28} y={0} z={0} s={8} />
        </g>
      </g>
      <g data-half-b>
        <path d={`M ${iso(0, -56)} L ${iso(56, -56)} L ${iso(56, 56)} L ${iso(0, 56)} Z`} className="stroke-cream/55" />
        <path
          d={`M ${iso(28, -56)} L ${iso(28, 56)} M ${iso(0, -28)} L ${iso(56, -28)} M ${iso(0, 0)} L ${iso(56, 0)} M ${iso(0, 28)} L ${iso(56, 28)}`}
          className={HAIR_SOFT}
        />
        <g data-born style={{ opacity: 0 }}>
          <GreenCube x={28} y={0} z={0} s={8} />
        </g>
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
    // The whole shard and the cut stop existing the moment there are two.
    .to([q("[data-whole]"), q("[data-cut]"), q("[data-threshold]")], { autoAlpha: 0, duration: 0.45 }, 1.7)
    .to(q("[data-born]"), { opacity: 1, duration: 0.4, stagger: 0.12, ease: "power2.out" }, 2.0);
  return tl;
}

/* ── 03 · Speed. Scale. Access. — 600ms blocks, 1.2s finality ────────────── */

// The reference frames' column: a stack of wireframe cube slots, one solid
// green cube stepping down them — block production as discrete arrivals, not
// a bar filling. A mint top-face outline follows two slots behind: finality
// at 1.2s against 600ms blocks, to scale.
const STACK_S = 12;
const STACK_N = 5;
const STEP_Z = STACK_S * 2;
const STACK_TOP_Z = (STACK_N - 1) * STEP_Z;
/** Screen offset that seats the whole column in the frame. */
const STACK_DY = 52;

function SpeedArt() {
  return (
    <Frame>
      <g transform={`translate(0, ${STACK_DY})`}>
        {Array.from({ length: STACK_N }, (_, i) => (
          <WireCube key={i} z={i * STEP_Z} s={STACK_S} />
        ))}
        <g data-head style={{ opacity: 0 }}>
          <GreenCube z={STACK_TOP_Z} s={STACK_S} />
        </g>
        <path
          data-final-ring
          d={cubeFaces(0, 0, STACK_TOP_Z, STACK_S).top}
          fill="none"
          className="stroke-cta-mint"
          strokeWidth={1.75}
          style={{ opacity: 0 }}
        />
      </g>
    </Frame>
  );
}

function buildSpeed(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });
  const drop = (STACK_N - 1) * STEP_Z;

  // steps() eases make the descent land slot by slot — arrivals, not a slide.
  tl.to(q("[data-head]"), { opacity: 1, duration: 0.25 }, 0)
    .to(q("[data-head]"), { y: drop, duration: 1.6, ease: `steps(${STACK_N - 1})` }, 0.3)
    .to(q("[data-final-ring]"), { opacity: 1, duration: 0.2 }, 0.8)
    // Finality trails two slots — produced but not yet final, held honestly.
    .to(
      q("[data-final-ring]"),
      { y: drop - 2 * STEP_Z, duration: 1.2, ease: `steps(${STACK_N - 3})` },
      0.9
    );
  return tl;
}

/* ── 04 · Private Shard — transactions go dark on entry ──────────────────── */

// The story runs on the TRANSACTIONS, not on the box: three live green cubes
// drop into the shard and turn to wireframe ghosts the moment they cross in —
// shielded from public view is something that HAPPENS to them, on screen.
// Then one ghost re-lights while an auditor looks (selective disclosure) and
// goes dark again. The held end state is the claim: a shard full of ghosts.
const SHARD_S = 34;
const TX_S = 7;
const TX_POS = [
  { x: -11, y: 9, z: 2 },
  { x: 11, y: -9, z: 2 },
  { x: 0, y: 0, z: 26 },
] as const;
/** Which ghost gets disclosed. */
const TX_SHOWN = 1;

function PrivateShardArt() {
  return (
    <Frame>
      <WireCube s={SHARD_S} className={HAIR} />
      <path d={planeGrid(SHARD_S, SHARD_S * 2, 2)} className={HAIR_SOFT} />
      {TX_POS.map((p, i) => (
        <g key={i} data-tx style={{ opacity: 0 }}>
          <g data-tx-green>
            <GreenCube x={p.x} y={p.y} z={p.z} s={TX_S} />
          </g>
          <g data-tx-ghost style={{ opacity: 0 }}>
            <WireCube x={p.x} y={p.y} z={p.z} s={TX_S} className="stroke-cream/55" />
          </g>
        </g>
      ))}
    </Frame>
  );
}

function buildPrivateShard(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });
  const txs = q("[data-tx]");
  const greens = q("[data-tx-green]");
  const ghosts = q("[data-tx-ghost]");

  txs.forEach((tx, i) => {
    const at = 0.1 + i * 0.5;
    // In from above, live and visible…
    tl.fromTo(
      tx,
      { y: -64, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.55, ease: "power2.in" },
      at
    )
      // …and dark the moment it lands inside. Confidential by default.
      .to(greens[i], { opacity: 0, duration: 0.28 }, at + 0.55)
      .to(ghosts[i], { opacity: 0.55, duration: 0.28 }, at + 0.55);
  });

  // Selective disclosure: one ghost re-lights while someone with the right to
  // look is looking, then goes dark with the rest.
  tl.to(greens[TX_SHOWN], { opacity: 1, duration: 0.3, ease: "power2.out" }, 2.4)
    .to(txs[TX_SHOWN], { y: -4, duration: 0.3, yoyo: true, repeat: 1, ease: "power1.inOut" }, 2.4)
    .to(greens[TX_SHOWN], { opacity: 0, duration: 0.5 }, 3.3);
  return tl;
}

/* ── 05 · Quantum-safe accounts — the crypto module swap ─────────────────── */

// "Accounts are decoupled from cryptography" drawn literally: the ACCOUNT is
// the big wireframe volume and never moves; the CRYPTOGRAPHY is a small
// module docked into its right face. The old module undocks and slides away,
// the ML-DSA module slides in and seats, and the account's own edges take a
// green charge — same account, new signing. (Second concept for this card:
// the key glyph and the shell swap were both vetoed.)
const ACC_S = 26;
const MOD_S = 9;
/** Where the module docks: seated into the account's right face. */
const DOCK = { x: ACC_S + MOD_S, y: 0, z: 16 } as const;
/** Screen-space vector for sliding along the +x isometric axis. */
const SLIDE = (w: number) => ({ x: w * COS30, y: w * 0.5 });

function QuantumArt() {
  return (
    <Frame>
      <g data-acc>
        <WireCube s={ACC_S} className={HAIR} />
        <path d={planeGrid(ACC_S, ACC_S * 2, 2)} className={HAIR_SOFT} />
      </g>
      {/* The charge: the same edges, green, faded up when the swap lands. */}
      <g data-acc-charge style={{ opacity: 0 }}>
        <WireCube s={ACC_S} className="stroke-cta-mint" />
      </g>
      <g data-mod-old>
        <WireCube x={DOCK.x} y={DOCK.y} z={DOCK.z} s={MOD_S} className="stroke-cream/55" />
      </g>
      <g data-mod-new style={{ opacity: 0 }}>
        <GreenCube x={DOCK.x} y={DOCK.y} z={DOCK.z} s={MOD_S} />
      </g>
    </Frame>
  );
}

function buildQuantum(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } });
  const out = SLIDE(46);

  // The old module undocks — cryptography leaving, account untouched…
  tl.to(
    q("[data-mod-old]"),
    { x: out.x, y: out.y, autoAlpha: 0, duration: 0.65, ease: "power2.in" },
    0.35
  )
    // …the quantum-safe module rides the same axis in and seats.
    .fromTo(
      q("[data-mod-new]"),
      { x: SLIDE(72).x, y: SLIDE(72).y, autoAlpha: 0 },
      { x: 0, y: 0, autoAlpha: 1, duration: 0.85, ease: "back.out(1.4)" },
      0.9
    )
    // The click: the account's edges take the green charge and keep a trace
    // of it. One rotation, and it signs quantum-safe from here on.
    .fromTo(q("[data-acc-charge]"), { opacity: 0 }, { opacity: 0.9, duration: 0.25 }, 1.75)
    .to(q("[data-acc-charge]"), { opacity: 0.35, duration: 0.6 }, 2.1);
  return tl;
}

/* ── 06 · Chain Signatures — one account, many chains ────────────────────── */

// Source account bottom-left as a solid cube; three destination chains as
// wireframe cubes. Signature lines draw outward, and each chain's TOP FACE
// lights green on arrival — a native transaction landing, no bridge in the
// middle.
const SRC = { dx: -104, dy: 10 };
const CHAINS = [
  { dx: 96, dy: -58 },
  { dx: 122, dy: -2 },
  { dx: 88, dy: 54 },
];
const TGT_S = 9;

function ChainSignaturesArt() {
  return (
    <Frame>
      <g transform={`translate(${SRC.dx}, ${SRC.dy})`}>
        <WireCube s={16} className={HAIR_SOFT} />
        <g data-source>
          <GreenCube s={12} />
        </g>
      </g>
      {CHAINS.map((c, i) => (
        <g key={i}>
          <path
            data-arc
            d={`M ${CX + SRC.dx + 24} ${CY + SRC.dy - 8} Q ${(CX + SRC.dx + CX + c.dx) / 2} ${CY + SRC.dy + (c.dy - SRC.dy) * 0.12} ${CX + c.dx - 18} ${CY + c.dy}`}
            className="stroke-cta-mint/80"
          />
          <g transform={`translate(${c.dx}, ${c.dy})`}>
            <WireCube s={TGT_S} className="stroke-cream/55" />
            <path
              data-target-core
              d={cubeFaces(0, 0, 0, TGT_S).top}
              className="fill-cta-lime stroke-none"
              style={{ opacity: 0 }}
            />
          </g>
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
    { scale: 0.7, autoAlpha: 0.4, transformOrigin: `${CX}px ${CY}px` },
    { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.6)" },
    0
  );
  // One signature fans out to every chain at once — no bridge, no relay hop.
  drawIn(tl, q("[data-arc]"), 0.35, 0.14);
  tl.to(q("[data-target-core]"), { opacity: 1, duration: 0.3, stagger: 0.14 }, 0.95)
    .to(q("[data-target-core]"), { opacity: 0.45, duration: 0.6 }, 2.1);
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
