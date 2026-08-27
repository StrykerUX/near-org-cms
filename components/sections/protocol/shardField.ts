/**
 * The Protocol page's signature visual: a field of shards that split.
 *
 * Same role the ring field plays on the quantum page — one metaphor the whole
 * page carries — but the idea here is *subdivision*: a cell reaches its
 * threshold and splits in two, the way a shard splits when it hits its
 * state-size limit. Nothing is decorative; the behaviour IS the content.
 *
 * Canvas rather than DOM because the cell count runs into the hundreds and
 * each one animates independently. Hairline strokes at hairline opacity, so at
 * rest it reads as texture and only resolves into structure when a split runs.
 *
 * Imperative factory rather than a hook — same contract as `quantumLattice`:
 * call it, keep the handle, call `destroy()` on unmount.
 */

type Cell = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** 0 at rest, 1 fully split. Drives the divider line drawing itself in. */
  t: number;
  /** null until this cell is chosen to split. */
  axis: "v" | "h" | null;
  depth: number;
  /** Lit cells carry the CTA ramp instead of the hairline. */
  lit: number;
};

export type ShardFieldHandle = { destroy: () => void };

const HAIRLINE = "rgba(0,0,0,0.10)";
const LIT = ["#00dc8d", "#00dc8d", "#00dc8d"];

/** Below this, a cell is too small to read as a shard and stops subdividing. */
const MIN_CELL = 46;
/** Seconds a single split takes to draw. */
const SPLIT_DUR = 0.9;
/** Seconds between splits. Slow: this is ambient, not a loading bar. */
const SPLIT_EVERY = 0.55;
/** How far a lit cell's glow reaches, as a fraction of its size. */
const MAX_DEPTH = 4;

export function createShardField(
  host: HTMLElement,
  opts: { motionOk: boolean }
): ShardFieldHandle {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy: () => canvas.remove() };

  let cells: Cell[] = [];
  let raf = 0;
  let last = 0;
  let sinceSplit = 0;
  let dpr = 1;

  const seed = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Start from a coarse grid rather than one cell: a single cell splitting
    // from full-bleed reads as a wipe, not as a field.
    const cols = Math.max(3, Math.round(w / 260));
    const rows = Math.max(2, Math.round(h / 260));
    const cw = w / cols;
    const ch = h / rows;
    cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({ x: c * cw, y: r * ch, w: cw, h: ch, t: 1, axis: null, depth: 0, lit: 0 });
      }
    }
  };

  /** Pick a cell and begin splitting it. Bias toward larger cells so the field
   *  subdivides evenly instead of grinding one corner into dust. */
  const split = () => {
    const eligible = cells.filter(
      (c) => c.axis === null && c.depth < MAX_DEPTH && Math.min(c.w, c.h) > MIN_CELL * 2
    );
    if (!eligible.length) return;
    eligible.sort((a, b) => b.w * b.h - a.w * a.h);
    const pool = eligible.slice(0, Math.max(1, Math.round(eligible.length * 0.4)));
    const cell = pool[Math.floor(pool.length * fract())];
    if (!cell) return;
    cell.axis = cell.w >= cell.h ? "v" : "h";
    cell.t = 0;
    // Roughly one split in five lights up. Enough to feel alive, rare enough
    // that a lit shard still reads as an event.
    cell.lit = fract() < 0.2 ? 1 : 0;
  };

  // Deterministic-ish jitter without Math.random, which is banned in some of
  // this repo's tooling and makes captures unrepeatable.
  let n = 0.37;
  const fract = () => {
    n = (n * 9301 + 49297) % 233280;
    return n / 233280;
  };

  const finish = (cell: Cell) => {
    const i = cells.indexOf(cell);
    if (i === -1) return;
    const { x, y, w, h, depth, lit } = cell;
    const a: Cell =
      cell.axis === "v"
        ? { x, y, w: w / 2, h, t: 1, axis: null, depth: depth + 1, lit: lit * 0.6 }
        : { x, y, w, h: h / 2, t: 1, axis: null, depth: depth + 1, lit: lit * 0.6 };
    const b: Cell =
      cell.axis === "v"
        ? { x: x + w / 2, y, w: w / 2, h, t: 1, axis: null, depth: depth + 1, lit: 0 }
        : { x, y: y + h / 2, w, h: h / 2, t: 1, axis: null, depth: depth + 1, lit: 0 };
    cells.splice(i, 1, a, b);
  };

  const draw = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;

    for (const c of cells) {
      // Cell outline. Hairline, always.
      ctx.strokeStyle = HAIRLINE;
      ctx.strokeRect(Math.round(c.x) + 0.5, Math.round(c.y) + 0.5, Math.round(c.w), Math.round(c.h));

      if (c.lit > 0.02) {
        // A lit shard is filled, not stroked — it should read as mass.
        const g = ctx.createLinearGradient(c.x, c.y, c.x + c.w, c.y + c.h);
        g.addColorStop(0, LIT[0]);
        g.addColorStop(0.55, LIT[1]);
        g.addColorStop(1, LIT[2]);
        ctx.globalAlpha = c.lit * 0.5;
        ctx.fillStyle = g;
        ctx.fillRect(c.x, c.y, c.w, c.h);
        ctx.globalAlpha = 1;
      }

      // The divider, drawing itself in from the centre outward.
      if (c.axis && c.t < 1) {
        const e = c.t < 0.5 ? 2 * c.t * c.t : 1 - Math.pow(-2 * c.t + 2, 2) / 2;
        ctx.strokeStyle = `rgba(0,185,111,${0.55 * (1 - c.t) + 0.1})`;
        ctx.beginPath();
        if (c.axis === "v") {
          const mx = Math.round(c.x + c.w / 2) + 0.5;
          const half = (c.h / 2) * e;
          ctx.moveTo(mx, c.y + c.h / 2 - half);
          ctx.lineTo(mx, c.y + c.h / 2 + half);
        } else {
          const my = Math.round(c.y + c.h / 2) + 0.5;
          const half = (c.w / 2) * e;
          ctx.moveTo(c.x + c.w / 2 - half, my);
          ctx.lineTo(c.x + c.w / 2 + half, my);
        }
        ctx.stroke();
      }
    }
  };

  const tick = (now: number) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;

    for (const c of cells) {
      if (c.axis && c.t < 1) {
        c.t = Math.min(1, c.t + dt / SPLIT_DUR);
        if (c.t >= 1) finish(c);
      }
      if (c.lit > 0) c.lit = Math.max(0, c.lit - dt * 0.12);
    }

    sinceSplit += dt;
    if (sinceSplit >= SPLIT_EVERY) {
      sinceSplit = 0;
      split();
    }

    draw();
    raf = requestAnimationFrame(tick);
  };

  seed();
  draw();

  if (opts.motionOk) raf = requestAnimationFrame(tick);

  // Rebuild on resize: the grid is derived from the host's size, and stretching
  // the old cells would distort every shard.
  let rt = 0;
  const onResize = () => {
    window.clearTimeout(rt);
    rt = window.setTimeout(() => {
      seed();
      draw();
    }, 180);
  };
  window.addEventListener("resize", onResize);

  return {
    destroy: () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      canvas.remove();
    },
  };
}
