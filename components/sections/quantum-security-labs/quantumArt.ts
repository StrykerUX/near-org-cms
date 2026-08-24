// Geometry shared by the two body proposals for /prototype/quantum-security-h2
// and -h3. Pure computation, no JSX and no GSAP — same status as
// `chain/chainDiagram.ts`.
//
// Sharing the GEOMETRY and not the components is deliberate. If both versions
// imported one `<KeyDiagram />` they would draw the same picture and the
// comparison would stop measuring design; if each recomputed the field, two
// files would disagree about the same figure.

// ── Rounding, for hydration ────────────────────────────────────────────────
// The ECMAScript spec does not require `Math.sin`/`Math.cos` to be correctly
// rounded, so Node and the browser disagree in the last ulp and React throws
// away the whole client tree over a `d=` that does not match. Four decimals is
// far below a pixel at any size these figures are drawn.
export const round4 = (n: number) => Math.round(n * 1e4) / 1e4;

// A cheap, stable integer generator. Nothing here may use `Math.random()`:
// random values during render produce different HTML on the server and the
// client, and a figure that changes on every refresh reads as noise rather than
// as a diagram.
function lcg(seed: number) {
  let state = (seed * 2654435761) >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// ── The exposed-key field ──────────────────────────────────────────────────
// The threat drawn without a metaphor: a field of accounts, and the ones whose
// public key is already visible onchain lit. It is the one fact this page
// repeats three times ("addresses whose public keys are already visible onchain
// are the most exposed"), and no section on the current page draws it.
//
// The exposed share is ~34%, which is illustrative and labelled as such
// wherever it is drawn. Nothing on the page states a percentage, so the figure
// must never look like it is reporting one — that is why the two proposals
// caption it rather than putting a number on it.

export type FieldDot = { x: number; y: number; r: number; exposed: boolean };

export function keyField(cols: number, rows: number, seed: number): FieldDot[] {
  const next = lcg(seed);
  const dots: FieldDot[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Jitter, so the field reads as a population and not as a screen door.
      // Bounded well under half a cell: past that, neighbours collide and the
      // even coverage the field depends on breaks down.
      const jx = (next() - 0.5) * 0.62;
      const jy = (next() - 0.5) * 0.62;
      dots.push({
        x: round4(((col + 0.5 + jx) / cols) * 100),
        y: round4(((row + 0.5 + jy) / rows) * 100),
        r: round4(0.5 + next() * 0.55),
        exposed: next() < 0.34,
      });
    }
  }

  return dots;
}

// ── The lattice ────────────────────────────────────────────────────────────
// ML-DSA is a LATTICE-based scheme, and that is the one piece of real
// mathematics this page can draw honestly: a point lattice with a short vector
// across it. It is not an illustration of the algorithm — no picture is — but
// it is the right family of shape, which an abstract mesh or a grain is not.
//
// Returned in a 0..100 box so callers can size their own viewBox.

export type Lattice = {
  points: { x: number; y: number }[];
  /** The basis vectors, drawn from the origin point. */
  basis: { x1: number; y1: number; x2: number; y2: number };
};

export function lattice(cols: number, rows: number, skew = 0.34): Lattice {
  const points: { x: number; y: number }[] = [];
  const dx = 100 / (cols - 1);
  const dy = 100 / (rows - 1);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // The skew is what makes it a lattice rather than a grid: every row is
      // offset by a fixed fraction of a column, so the basis is oblique. A
      // square grid reads as graph paper and says nothing.
      points.push({
        x: round4(col * dx + row * dx * skew - rows * dx * skew * 0.5),
        y: round4(row * dy),
      });
    }
  }

  return {
    points,
    basis: { x1: round4(dx), y1: 0, x2: round4(dx * skew), y2: round4(dy) },
  };
}

// ── The key-rotation diagram ───────────────────────────────────────────────
// The page's whole argument in one figure: the account is a fixed point, the
// keys are attachments, and rotating means detaching one and attaching another
// while the point never moves.
//
// Only the ANGLES live here. Both proposals draw the same three positions and
// each decides its own radius, stroke and labels — H2 draws it at section
// scale as a statement, H3 draws it small inside a stepped panel.
//
// −90° is straight up. The old key leaves to the left and the new one arrives
// from the right, so the motion reads left-to-right like the reading order.
export const KEY_SLOTS = {
  outgoing: -168,
  vacant: -90,
  incoming: -12,
} as const;

/** Polar → cartesian around a centre, for placing a slot on the ring. */
export function slotPoint(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: round4(cx + Math.cos(rad) * r), y: round4(cy + Math.sin(rad) * r) };
}
