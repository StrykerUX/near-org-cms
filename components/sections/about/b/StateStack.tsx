import {
  FACE,
  LEVEL,
  MODELS_BREAK,
  PIVOT_X,
  PLAN,
  SHARD_BOXES,
  STUB_Y,
  VIEW,
  WORK_MARKS,
  edge,
  project,
  projectPct,
  slab,
  type Box,
  type FaceTone,
} from "@/components/sections/about/b/iso";

// The machine, at one of four states.
//
// ── What it is ────────────────────────────────────────────────────────────
//
// Variant B reads this history as the log of a system that has been running for
// eight years, and this is the system. It is one object across the whole page:
// what existed in 2017 and what exists in 2026 are not the same machine, and
// the only thing the four states do is add and light strata.
//
//   01 · 2017 — 2018   one stratum, alone and high: the models. It stops
//                      partway across, because in 2018 they did. A column drops
//                      from where it stops to a ground plane that is not built
//                      yet — the detour, before it became the project.
//   02 · 2018 — 2021   the ground plane arrives PARTITIONED: four boundaries
//                      over the footprint one plane had, with the same twelve
//                      units of work sitting in the same twelve places. A bar
//                      leaves the right edge: the bridges.
//   03 · 2023 — 2024   a plane spans the shards and overhangs them, reaching
//                      off-frame to three other chains. The models stratum
//                      resumes past the gap: the LLMs arrive.
//   04 · 2025 — 2026   the models stratum comes down and lands on the
//                      abstraction plane — one solid — with agents standing on
//                      it and a rail leaving the frame. It does not close into
//                      a ring, for the same reason the flat convergence drawing
//                      does not: this history arrives somewhere its beginning
//                      could not reach.
//
// ── Why four separate drawings and not one that morphs ────────────────────
//
// Every state is drawn whole, and the sticky scene cross-fades between them.
// Two reasons. Without JavaScript, on a phone, or under `prefers-reduced-
// motion`, the four stack in normal flow and each one is a complete, readable
// figure — a morphing rig has no such resting state, it has a first frame.
// And because the geometry is deterministic, everything shared between two
// states is at identical coordinates, so a cross-fade shows only the delta
// moving: the boundaries appearing under marks that stay put is the effect,
// and it costs nothing.
//
// ── Why the labels are HTML and not `<text>` ──────────────────────────────
//
// House pattern, same as `chain/CapabilityStack` and `community/CityField`: SVG
// text inside a scaled viewBox is multiplied by the figure's scale, so it stops
// matching the mono scale everywhere else on the page. The positions come from
// the same projection the drawing does.
//
// The five words — MODELS, NETWORK, SHARDS, INTENTS, AGENTS — are the deck's
// own nouns, one word each. They are part of the drawing rather than copy, so
// they stay here and not in `aboutContent.ts`, which carries sentences.

const GROUND: Box = { ...PLAN, ...LEVEL.ground };
const PLANE: Box = { x0: -0.35, x1: 10.35, y0: -0.35, y1: 3.35, ...LEVEL.plane };
const MERGED: Box = { ...PLAN, ...LEVEL.merged };
const MODELS_A: Box = { x0: PLAN.x0, x1: MODELS_BREAK.end, y0: PLAN.y0, y1: PLAN.y1, ...LEVEL.models };
const MODELS_B: Box = { x0: MODELS_BREAK.resume, x1: PLAN.x1, y0: PLAN.y0, y1: PLAN.y1, ...LEVEL.models };

// The bar that leaves the right edge in act two, and the three that leave in
// act three. Both run past x = 10 on purpose: the viewBox clips them, which is
// what makes them read as continuing rather than as stopping at a boundary.
const BRIDGE: Box = { x0: 10, x1: 13.6, y0: 1.1, y1: 1.9, z0: 4, z1: 20 };
const STUBS: Box[] = STUB_Y.map((y) => ({
  x0: 10.35,
  x1: 13.2,
  y0: y - 0.16,
  y1: y + 0.16,
  z0: LEVEL.plane.z0 + 3,
  z1: LEVEL.plane.z0 + 11,
}));

// Four agents standing on the merged solid. Small enough to read as things ON
// the machine rather than as another stratum of it.
const AGENTS: Box[] = [1.2, 3.6, 6.0, 8.4].map((x) => ({
  x0: x,
  x1: x + 0.9,
  y0: 1.05,
  y1: 1.95,
  z0: LEVEL.merged.z1,
  z1: LEVEL.merged.z1 + 26,
}));

const PIVOT = edge([PIVOT_X, 1.5, LEVEL.models.z0], [PIVOT_X, 1.5, LEVEL.ground.z1]);
const GAP_TICK = edge(
  [(MODELS_BREAK.end + MODELS_BREAK.resume) / 2, 1.5, LEVEL.models.z0 - 12],
  [(MODELS_BREAK.end + MODELS_BREAK.resume) / 2, 1.5, LEVEL.models.z1 + 12]
);
const EXIT = edge([PLAN.x1 - 0.4, 1.5, LEVEL.merged.z1 - 8], [13.6, 1.5, LEVEL.merged.z1 - 8]);

/** One slab: two walls, then the lid. Painted in that order or the lid ends up buried. */
function Slab({ box, tone }: { box: Box; tone: FaceTone }) {
  const f = slab(box);
  const c = FACE[tone];
  return (
    <g stroke={c.stroke} strokeWidth="1">
      <path d={f.left} fill={c.left} />
      <path d={f.right} fill={c.right} />
      <path d={f.top} fill={c.top} />
    </g>
  );
}

function WorkMarks({ tone }: { tone: FaceTone }) {
  return (
    <g fill={FACE[tone].stroke} stroke="none">
      {WORK_MARKS.map((m) => {
        const [cx, cy] = project(m.x, m.y, LEVEL.ground.z1);
        return <circle key={m.x} cx={cx} cy={cy} r="2.6" />;
      })}
    </g>
  );
}

type LabelProps = {
  x: number;
  y: number;
  z: number;
  children: string;
  dim?: boolean;
  /** Anchor the label's right edge instead of its left — for the far corners. */
  end?: boolean;
};

function Label({ x, y, z, children, dim = false, end = false }: LabelProps) {
  return (
    <span
      className={`absolute whitespace-nowrap text-micro-mono uppercase ${
        end ? "-translate-x-full" : ""
      } -translate-y-1/2 ${dim ? "text-white/25" : "text-near-green-accent"}`}
      style={projectPct(x, y, z)}
    >
      {children}
    </span>
  );
}

export type StateStackProps = {
  /** 0–3. Out of range renders the first state rather than an empty frame. */
  act: number;
  className?: string;
};

export default function StateStack({ act, className = "" }: StateStackProps) {
  const step = act < 0 || act > 3 ? 0 : act;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="w-full"
        fill="none"
        aria-hidden="true"
      >
        {/* ── the ground ──────────────────────────────────────────────── */}
        {step === 0 ? (
          <Slab box={GROUND} tone="dim" />
        ) : (
          <>
            {SHARD_BOXES.map((b, i) => (
              <Slab key={i} box={b} tone={step === 1 ? "live" : "idle"} />
            ))}
            <WorkMarks tone={step === 1 ? "live" : "idle"} />
          </>
        )}

        {step === 1 ? <Slab box={BRIDGE} tone="live" /> : null}

        {/* ── the abstraction plane ───────────────────────────────────── */}
        {step >= 2 ? (
          <>
            <Slab box={PLANE} tone={step === 2 ? "live" : "idle"} />
            {step === 2
              ? STUBS.map((b, i) => <Slab key={i} box={b} tone="live" />)
              : null}
          </>
        ) : null}

        {/* ── the models, and where they land ─────────────────────────── */}
        {step === 3 ? (
          <>
            <Slab box={MERGED} tone="live" />
            {AGENTS.map((b, i) => (
              <Slab key={i} box={b} tone="live" />
            ))}
            <path d={EXIT} stroke={FACE.live.stroke} strokeWidth="1" />
          </>
        ) : (
          <>
            <Slab box={MODELS_A} tone={step === 0 ? "live" : "dim"} />
            {step === 2 ? <Slab box={MODELS_B} tone="idle" /> : null}
            {step >= 1 ? (
              <path d={GAP_TICK} stroke={FACE.dim.stroke} strokeWidth="1" />
            ) : null}
            <path
              d={PIVOT}
              stroke={step === 0 ? FACE.dim.stroke : FACE.idle.stroke}
              strokeWidth="1"
              strokeDasharray={step === 0 ? "4 5" : undefined}
            />
          </>
        )}
      </svg>

      {/* ── the labels ────────────────────────────────────────────────── */}
      {step === 0 ? (
        <>
          <Label x={PLAN.x0} y={PLAN.y0} z={LEVEL.models.z1 + 18}>
            Models
          </Label>
          <Label x={PLAN.x0} y={PLAN.y1} z={LEVEL.ground.z0 - 18} dim>
            Network
          </Label>
        </>
      ) : null}

      {step === 1 ? (
        <>
          <Label x={PLAN.x0} y={PLAN.y1} z={LEVEL.ground.z0 - 18}>
            Shards
          </Label>
          <Label x={PLAN.x0} y={PLAN.y0} z={LEVEL.models.z1 + 18} dim>
            Models
          </Label>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Label x={PLANE.x0} y={PLANE.y1} z={LEVEL.plane.z0 - 16}>
            Intents
          </Label>
          <Label x={PLAN.x1} y={PLAN.y0} z={LEVEL.models.z1 + 18} end>
            Models
          </Label>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <Label x={PLAN.x1} y={PLAN.y0} z={LEVEL.merged.z1 + 34} end>
            Agents
          </Label>
          <Label x={PLANE.x0} y={PLANE.y1} z={LEVEL.plane.z0 - 16} dim>
            Intents
          </Label>
        </>
      ) : null}
    </div>
  );
}
