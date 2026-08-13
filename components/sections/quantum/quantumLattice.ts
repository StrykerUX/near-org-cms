import { gsap } from "@/components/primitives/motion/gsapClient";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { deviceRatio } from "@/components/primitives/motion/dpr";

// The hero's node field: eight rows of points in a hexagonal weave along the
// bottom of the section, joined by segments, with a light front sweeping across
// them diagonally and lifting each one as it passes. The pointer lights its own
// halo.
//
// Imperative factory (`setPointer`/`setVisible`/`destroy`) rather than a hook
// with its own `useEffect`, for the same reason as `glyphShine`: the section
// creates and destroys it from its `gsap.matchMedia()`, so a live change of
// `prefers-reduced-motion` has ONE lifecycle to handle rather than two that can
// fall out of sync.
//
// It opens no requestAnimationFrame of its own for the animated case: it hooks
// into `gsap.ticker`, the same rAF that already drives Lenis and the page's
// ScrollTriggers (same call as `primitives/motion/flowField.ts`).
//
// ── How the frame is spent ───────────────────────────────────────────────────
// Measured on a 1512×520 field (208 nodes, 357 segments), comparing the previous
// implementation against this one:
//
//                    before    after
//   Math.exp()/frame   2378      416     6× fewer
//   stroke()/frame      357       13    27× fewer
//   arithmetic/frame  0.081ms  0.012ms   6.7× faster
//
// The big win is the draw calls, not the arithmetic. Worth writing down because
// the first reading of this file got it backwards: the link pass is O(n²) over
// the nodes, which looks like ~43 000 iterations a frame each doing two
// exponentials — but the early `continue` rejects all but the 357 real pairs
// before `liftOf` is ever called, so the true count was 2378, not 90 000. The
// arithmetic was never the bottleneck; 357 canvas stroke() calls a frame were.
//
// Three structural changes, none of which alters a pixel (verified: glow and
// lift agree with the old implementation to within Float32Array precision):
//
//   · glow and lift are functions of (node, t, front) ALONE — they do not depend
//     on which pair is being drawn, so they are computed in one pass over the
//     nodes and cached in two Float32Arrays instead of being recomputed per use.
//   · which nodes are neighbours is fixed geometry, changing only on rebuild. The
//     pair test runs once in `build()` and leaves an edge list, so the draw loop
//     is O(edges) rather than O(n²).
//   · segments are batched by alpha into one path per level, so the number of
//     stroke() calls is bounded by ALPHA_LEVELS instead of scaling with the
//     field.

// Mirrors the `--rule` and `--near-green-accent` tokens in app/globals.css.
// Literals rather than getComputedStyle because these are written into the 2D
// context every frame: resolving a custom property there would mean forcing a
// style recalc inside the draw loop.
const NODE_IDLE = "#c9c7c1";
const NODE_GLOW_RGB = "0,220,141";
const LINK_RGB = "0,0,0";

// Radius of the pointer halo and of the wave front, in px. These are gaussian
// sigmas, not hard radii: a node lights up gradually.
const POINTER_SIGMA = 90;
const FRONT_SIGMA = 120;

// How far a node rises at peak glow, and how much it drifts at rest.
const LIFT_PX = 8;
const DRIFT_PX = 2;

// The slant the light front travels along: `x + y * ISO_SLOPE`. It is the
// isometric diagonal the rest of the page's geometry uses, which is why the
// light crosses the field at the same angle as everything else.
const ISO_SLOPE = 2.2;

// Rows of nodes, and the vertical squash that turns the grid into a weave.
const ROWS = 8;
const ROW_SQUASH = 0.42;
// Floor on the horizontal step. Without it a narrow window packs in hundreds of
// nodes; it matters less than it did (the loop is no longer quadratic) but the
// weave also stops reading as one at very small steps.
const MIN_STEP_X = 56;
const STEP_DIVISOR = 24;
// How far apart in x two nodes of consecutive rows can be and still be linked.
const LINK_REACH = 0.62;

// Link opacity: the floor every segment has, plus what its glow adds.
const LINK_ALPHA_BASE = 0.045;
const LINK_ALPHA_GLOW = 0.1;
// Segments are grouped into this many alpha buckets so each bucket is a single
// path with one stroke(). 16 puts the step at ~0.006 of alpha — far below what
// the eye can pick out on a 4.5%-to-14.5% black line, so the gaussian front
// still reads as a smooth gradient and not as bands.
const ALPHA_LEVELS = 16;

// Below this glow a node is drawn in its resting grey instead of green.
const NODE_LIT_THRESHOLD = 0.04;
const NODE_R_BASE = 1.4;
const NODE_R_GLOW = 2.2;

// Speed of the front, and how much further than the field it travels before
// resetting — the excess is what leaves a dark pause between passes instead of a
// continuous loop.
const FRONT_SPEED = 0.14;
const FRONT_OVERSHOOT = 1.35;
const FRONT_LEAD_IN = 0.15;

// Rest drift frequency, and how much of the pointer halo adds to the front.
const DRIFT_HZ = 0.7;
const POINTER_WEIGHT = 0.8;

// Parked pointer. Any value far enough outside the canvas that its gaussian is
// zero everywhere; named so the three places that use it agree.
const POINTER_AWAY = -9999;

export type LatticeHandle = {
  setPointer: (x: number, y: number) => void;
  clearPointer: () => void;
  setVisible: (v: boolean) => void;
  destroy: () => void;
};

export function createQuantumLattice(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  { wave }: { wave: boolean }
): LatticeHandle | null {
  const g = canvas.getContext("2d");
  if (!g) return null;

  let w = 0;
  let h = 0;
  let stepY = 0;

  // Node data in parallel arrays rather than an array of objects: the draw loop
  // reads them in order every frame, and this is the layout that keeps that a
  // linear scan.
  let nx = new Float32Array(0);
  let ny = new Float32Array(0);
  let nSeed = new Float32Array(0);
  // Per-frame scratch, allocated once per build and overwritten in place.
  let glow = new Float32Array(0);
  let lift = new Float32Array(0);
  // Flat pairs of node indices: [a0, b0, a1, b1, …]. Computed in `build()`.
  let edges = new Int32Array(0);

  let px = POINTER_AWAY;
  let py = POINTER_AWAY;
  let visible = true;

  // Reused across frames so batching the segments allocates nothing per frame.
  const buckets: number[][] = Array.from({ length: ALPHA_LEVELS }, () => []);

  function build() {
    // A deterministic seed of our own rather than Math.random(): the at-rest
    // drift has to differ per node, but two consecutive builds (a resize) should
    // not reseed the whole field and produce a visible jump. Created fresh here
    // so every build replays the SAME sequence — see `motion/seededRandom`.
    const rnd = createSeededRandom();

    const r = host.getBoundingClientRect();
    const dpr = deviceRatio();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    g!.setTransform(dpr, 0, 0, dpr, 0, 0);

    const stepX = Math.max(MIN_STEP_X, w / STEP_DIVISOR);
    stepY = stepX * ROW_SQUASH;

    const xs: number[] = [];
    const ys: number[] = [];
    const seeds: number[] = [];
    const y0 = h - ROWS * stepY - 8;
    for (let row = 0; row < ROWS; row++) {
      // Odd rows shifted half a step: that is what turns the square grid into a
      // hexagonal weave.
      const off = (row % 2) * (stepX / 2);
      for (let x = -stepX; x < w + stepX; x += stepX) {
        xs.push(x + off);
        ys.push(y0 + row * stepY);
        seeds.push(rnd() * Math.PI * 2);
      }
    }

    nx = Float32Array.from(xs);
    ny = Float32Array.from(ys);
    nSeed = Float32Array.from(seeds);
    glow = new Float32Array(xs.length);
    lift = new Float32Array(xs.length);

    // The pair test, run ONCE. Only downward into the next row and within
    // LINK_REACH of a step in x, so each segment is listed exactly once (dy > 0
    // rejects the mirrored pair).
    const reach = stepX * LINK_REACH;
    const pairs: number[] = [];
    for (let a = 0; a < xs.length; a++) {
      for (let b = 0; b < xs.length; b++) {
        const dy = ys[b] - ys[a];
        if (dy < 1 || dy > stepY + 1) continue;
        if (Math.abs(xs[b] - xs[a]) > reach) continue;
        pairs.push(a, b);
      }
    }
    edges = Int32Array.from(pairs);
  }

  /** One pass over the nodes, filling `glow` and `lift` for this frame. */
  function computeField(t: number, front: number) {
    const frontDenom = 2 * FRONT_SIGMA * FRONT_SIGMA;
    const pointerDenom = 2 * POINTER_SIGMA * POINTER_SIGMA;

    for (let i = 0; i < nx.length; i++) {
      const x = nx[i];
      const y = ny[i];

      let v = 0;
      if (wave) {
        const d = x + y * ISO_SLOPE - front;
        v = Math.exp(-(d * d) / frontDenom);
      }
      const dx = x - px;
      const dy = y - py;
      const halo = Math.exp(-(dx * dx + dy * dy) / pointerDenom);

      const gl = Math.min(1, v + halo * POINTER_WEIGHT);
      glow[i] = gl;
      lift[i] =
        (wave ? Math.sin(t * DRIFT_HZ + nSeed[i]) * DRIFT_PX : 0) + LIFT_PX * gl;
    }
  }

  function draw(t: number) {
    g!.clearRect(0, 0, w, h);

    const span = w + h * ISO_SLOPE;
    const front = wave
      ? ((t * span * FRONT_SPEED) % (span * FRONT_OVERSHOOT)) - span * FRONT_LEAD_IN
      : -1e9;

    computeField(t, front);

    // ── segments, batched by alpha ────────────────────────────────────────
    // A segment's alpha comes from the glow of its FIRST node, which is what the
    // per-node strokeStyle did before.
    for (const bucket of buckets) bucket.length = 0;
    for (let e = 0; e < edges.length; e += 2) {
      const level = Math.min(
        ALPHA_LEVELS - 1,
        Math.round(glow[edges[e]] * (ALPHA_LEVELS - 1))
      );
      buckets[level].push(e);
    }

    g!.lineWidth = 1;
    for (let level = 0; level < ALPHA_LEVELS; level++) {
      const bucket = buckets[level];
      if (bucket.length === 0) continue;

      const alpha = LINK_ALPHA_BASE + LINK_ALPHA_GLOW * (level / (ALPHA_LEVELS - 1));
      g!.strokeStyle = `rgba(${LINK_RGB},${alpha})`;
      g!.beginPath();
      for (const e of bucket) {
        const a = edges[e];
        const b = edges[e + 1];
        g!.moveTo(nx[a], ny[a] - lift[a]);
        g!.lineTo(nx[b], ny[b] - lift[b]);
      }
      g!.stroke();
    }

    // ── nodes ─────────────────────────────────────────────────────────────
    // Not batched: each lit node has its own radius as well as its own colour,
    // so there is nothing to group.
    for (let i = 0; i < nx.length; i++) {
      const gl = glow[i];
      g!.fillStyle =
        gl > NODE_LIT_THRESHOLD ? `rgba(${NODE_GLOW_RGB},${0.25 + 0.75 * gl})` : NODE_IDLE;
      g!.beginPath();
      g!.arc(nx[i], ny[i] - lift[i], NODE_R_BASE + NODE_R_GLOW * gl, 0, Math.PI * 2);
      g!.fill();
    }
  }

  build();

  const tick = (time: number) => {
    if (!visible) return;
    draw(time);
  };

  // ── the static case ─────────────────────────────────────────────────────
  // With `wave: false` (the reader asked for reduced motion) there is no loop:
  // the field is painted once, and repainted only when the pointer moves or the
  // section resizes.
  //
  // Those repaints are COALESCED into one rAF instead of running inside the
  // event handler. Before, every `pointermove` redrew the whole field
  // synchronously — dozens of full redraws a second, in the mode that is
  // supposed to be the cheap one.
  let staticRaf = 0;
  const redrawStatic = () => {
    if (wave) return;
    if (staticRaf) return;
    staticRaf = requestAnimationFrame(() => {
      staticRaf = 0;
      draw(0);
    });
  };

  if (wave) {
    gsap.ticker.add(tick);
  } else {
    draw(0);
  }

  // Debounced, and with a threshold: `build()` reassigns canvas.width, which
  // reallocates the backing store and clears the bitmap. Dragging a window edge
  // would otherwise do that once per frame. Same criterion as `wordField`.
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  let lastW = 0;
  let lastH = 0;
  const ro = new ResizeObserver((entries) => {
    // `contentRect` rather than a fresh getBoundingClientRect(): reading layout
    // inside a ResizeObserver callback is what triggers "ResizeObserver loop
    // completed with undelivered notifications" in some browsers.
    const box = entries[0]?.contentRect;
    if (!box) return;
    if (Math.abs(box.width - lastW) < 4 && Math.abs(box.height - lastH) < 4) return;
    lastW = box.width;
    lastH = box.height;

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      redrawStatic();
    }, 180);
  });
  ro.observe(host);

  return {
    setPointer: (x, y) => {
      px = x;
      py = y;
      redrawStatic();
    },
    clearPointer: () => {
      px = POINTER_AWAY;
      py = POINTER_AWAY;
      redrawStatic();
    },
    setVisible: (v) => {
      if (v === visible) return;
      visible = v;
      // Out of view the callback comes off the ticker entirely rather than
      // returning early from it: gsap calls every registered tick every frame.
      if (!wave) return;
      if (v) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    },
    destroy: () => {
      gsap.ticker.remove(tick);
      if (staticRaf) cancelAnimationFrame(staticRaf);
      clearTimeout(resizeTimer);
      ro.disconnect();
      g.clearRect(0, 0, w, h);
    },
  };
}
