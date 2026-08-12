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
// It opens no requestAnimationFrame of its own: it hooks into `gsap.ticker`,
// the same rAF that already drives Lenis and the page's ScrollTriggers (same
// call as `primitives/motion/flowField.ts`).

// Mirrors the `--rule` and `--near-green-accent` tokens in app/globals.css.
// Literals rather than getComputedStyle because these are written into the 2D
// context once per node per frame: resolving a custom property there would mean
// forcing a style recalc inside the draw loop.
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

type Node = { x: number; y: number; seed: number };

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
  let stepX = 0;
  let stepY = 0;
  let nodes: Node[] = [];
  let px = -9999;
  let py = -9999;
  let visible = true;

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

    // The step scales with width but has a floor: leaving it purely
    // proportional would put hundreds of nodes in a narrow window, and the link
    // pass is O(n²).
    stepX = Math.max(56, w / 24);
    stepY = stepX * 0.42;

    nodes = [];
    const rows = 8;
    const y0 = h - rows * stepY - 8;
    for (let r2 = 0; r2 < rows; r2++) {
      // Odd rows shifted half a step: that is what turns the square grid into a
      // hexagonal weave.
      const off = (r2 % 2) * (stepX / 2);
      for (let x = -stepX; x < w + stepX; x += stepX) {
        nodes.push({ x: x + off, y: y0 + r2 * stepY, seed: rnd() * Math.PI * 2 });
      }
    }
  }

  function glowOf(n: Node, front: number) {
    let v = 0;
    if (wave) {
      // The front advances along `x + y*2.2`, not along x: that combination is
      // the isometric diagonal, so the light crosses the field at the same
      // slant as the rest of the page's geometry.
      const d = n.x + n.y * 2.2 - front;
      v = Math.exp(-(d * d) / (2 * FRONT_SIGMA * FRONT_SIGMA));
    }
    const dx = n.x - px;
    const dy = n.y - py;
    const pd = Math.exp(-(dx * dx + dy * dy) / (2 * POINTER_SIGMA * POINTER_SIGMA));
    return Math.min(1, v + pd * 0.8);
  }

  function liftOf(n: Node, t: number, front: number) {
    const drift = wave ? Math.sin(t * 0.7 + n.seed) * DRIFT_PX : 0;
    return drift + LIFT_PX * glowOf(n, front);
  }

  function draw(t: number) {
    g!.clearRect(0, 0, w, h);

    const span = w + h * 2.2;
    // The front travels 35% further than the field before resetting, so there
    // is a dark pause between passes rather than a continuous loop.
    const front = wave ? ((t * span * 0.14) % (span * 1.35)) - span * 0.15 : -1e9;

    g!.lineWidth = 1;
    for (const n of nodes) {
      const lift = liftOf(n, t, front);
      g!.strokeStyle = `rgba(${LINK_RGB},${0.045 + 0.1 * glowOf(n, front)})`;
      for (const m of nodes) {
        const dx = m.x - n.x;
        const dy = m.y - n.y;
        // Only downward into the next row and within half a step in x: each
        // segment is drawn ONCE (dy > 0 rejects the mirrored pair).
        if (dy < 1 || dy > stepY + 1 || Math.abs(dx) > stepX * 0.62) continue;
        g!.beginPath();
        g!.moveTo(n.x, n.y - lift);
        g!.lineTo(m.x, m.y - liftOf(m, t, front));
        g!.stroke();
      }
    }

    for (const n of nodes) {
      const glow = glowOf(n, front);
      g!.fillStyle =
        glow > 0.04 ? `rgba(${NODE_GLOW_RGB},${0.25 + 0.75 * glow})` : NODE_IDLE;
      g!.beginPath();
      g!.arc(n.x, n.y - liftOf(n, t, front), 1.4 + 2.2 * glow, 0, Math.PI * 2);
      g!.fill();
    }
  }

  build();

  const tick = (time: number) => {
    if (!visible) return;
    draw(time);
  };

  if (wave) {
    gsap.ticker.add(tick);
  } else {
    // With no wave there is nothing to animate: paint the rest state once.
    draw(0);
  }

  const ro = new ResizeObserver(() => {
    build();
    if (!wave) draw(0);
  });
  ro.observe(host);

  return {
    setPointer: (x, y) => {
      px = x;
      py = y;
      if (!wave) draw(0);
    },
    clearPointer: () => {
      px = -9999;
      py = -9999;
      if (!wave) draw(0);
    },
    setVisible: (v) => {
      visible = v;
    },
    destroy: () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      g.clearRect(0, 0, w, h);
    },
  };
}
