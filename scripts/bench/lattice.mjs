// Compara la aritmética del draw loop del lattice: versión anterior (glowOf
// llamado desde dentro del bucle O(n²)) vs la actual (dos pasadas + lista de
// aristas). Sin canvas: mide solo el cómputo, que es lo que se cambió.
//
// Además verifica que los valores de glow y lift salgan IDÉNTICOS, para que la
// optimización no sea también un cambio visual.

const POINTER_SIGMA = 90, FRONT_SIGMA = 120, LIFT_PX = 8, DRIFT_PX = 2;
const ISO_SLOPE = 2.2, ROWS = 8, ROW_SQUASH = 0.42, MIN_STEP_X = 56;
const STEP_DIVISOR = 24, LINK_REACH = 0.62, DRIFT_HZ = 0.7, POINTER_WEIGHT = 0.8;
const FRONT_SPEED = 0.14, FRONT_OVERSHOOT = 1.35, FRONT_LEAD_IN = 0.15;

const W = 1512, H = 520;             // viewport de laptop, alto típico del field
const px = 700, py = 300;            // puntero en medio del campo

function lcg(seed = 4297) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff), s / 0x7fffffff);
}

function buildNodes() {
  const rnd = lcg();
  const stepX = Math.max(MIN_STEP_X, W / STEP_DIVISOR);
  const stepY = stepX * ROW_SQUASH;
  const nodes = [];
  const y0 = H - ROWS * stepY - 8;
  for (let row = 0; row < ROWS; row++) {
    const off = (row % 2) * (stepX / 2);
    for (let x = -stepX; x < W + stepX; x += stepX) {
      nodes.push({ x: x + off, y: y0 + row * stepY, seed: rnd() * Math.PI * 2 });
    }
  }
  return { nodes, stepX, stepY };
}

const { nodes, stepX, stepY } = buildNodes();

// ── versión anterior ────────────────────────────────────────────────────────
let exps = 0;
function glowOf(n, front) {
  const d = n.x + n.y * ISO_SLOPE - front;
  const v = Math.exp(-(d * d) / (2 * FRONT_SIGMA * FRONT_SIGMA)); exps++;
  const dx = n.x - px, dy = n.y - py;
  const pd = Math.exp(-(dx * dx + dy * dy) / (2 * POINTER_SIGMA * POINTER_SIGMA)); exps++;
  return Math.min(1, v + pd * POINTER_WEIGHT);
}
function liftOf(n, t, front) {
  return Math.sin(t * DRIFT_HZ + n.seed) * DRIFT_PX + LIFT_PX * glowOf(n, front);
}

function drawOld(t, collect) {
  const span = W + H * ISO_SLOPE;
  const front = ((t * span * FRONT_SPEED) % (span * FRONT_OVERSHOOT)) - span * FRONT_LEAD_IN;
  let segments = 0, strokeCalls = 0;
  const out = collect ? { glow: [], lift: [] } : null;

  for (const n of nodes) {
    const lift = liftOf(n, t, front);
    const alpha = 0.045 + 0.1 * glowOf(n, front);   // strokeStyle por nodo
    void alpha;
    for (const m of nodes) {
      const dx = m.x - n.x, dy = m.y - n.y;
      if (dy < 1 || dy > stepY + 1 || Math.abs(dx) > stepX * LINK_REACH) continue;
      void (n.y - lift); void (m.y - liftOf(m, t, front));
      segments++; strokeCalls++;             // un beginPath/stroke por segmento
    }
  }
  for (const n of nodes) {
    const g = glowOf(n, front);
    void (1.4 + 2.2 * g); void (n.y - liftOf(n, t, front));
    if (out) { out.glow.push(g); out.lift.push(liftOf(n, t, front)); }
  }
  return { segments, strokeCalls, out };
}

// ── versión actual ──────────────────────────────────────────────────────────
const nx = Float32Array.from(nodes.map((n) => n.x));
const ny = Float32Array.from(nodes.map((n) => n.y));
const nSeed = Float32Array.from(nodes.map((n) => n.seed));
const glow = new Float32Array(nodes.length);
const lift = new Float32Array(nodes.length);
const ALPHA_LEVELS = 16;
const buckets = Array.from({ length: ALPHA_LEVELS }, () => []);

const pairs = [];
for (let a = 0; a < nodes.length; a++) {
  for (let b = 0; b < nodes.length; b++) {
    const dy = ny[b] - ny[a];
    if (dy < 1 || dy > stepY + 1) continue;
    if (Math.abs(nx[b] - nx[a]) > stepX * LINK_REACH) continue;
    pairs.push(a, b);
  }
}
const edges = Int32Array.from(pairs);

function drawNew(t, collect) {
  const span = W + H * ISO_SLOPE;
  const front = ((t * span * FRONT_SPEED) % (span * FRONT_OVERSHOOT)) - span * FRONT_LEAD_IN;
  const frontDenom = 2 * FRONT_SIGMA * FRONT_SIGMA;
  const pointerDenom = 2 * POINTER_SIGMA * POINTER_SIGMA;

  for (let i = 0; i < nx.length; i++) {
    const x = nx[i], y = ny[i];
    const d = x + y * ISO_SLOPE - front;
    const v = Math.exp(-(d * d) / frontDenom); exps++;
    const dx = x - px, dy = y - py;
    const halo = Math.exp(-(dx * dx + dy * dy) / pointerDenom); exps++;
    const gl = Math.min(1, v + halo * POINTER_WEIGHT);
    glow[i] = gl;
    lift[i] = Math.sin(t * DRIFT_HZ + nSeed[i]) * DRIFT_PX + LIFT_PX * gl;
  }

  for (const b of buckets) b.length = 0;
  for (let e = 0; e < edges.length; e += 2) {
    const level = Math.min(ALPHA_LEVELS - 1, Math.round(glow[edges[e]] * (ALPHA_LEVELS - 1)));
    buckets[level].push(e);
  }
  let strokeCalls = 0;
  for (const b of buckets) {
    if (!b.length) continue;
    strokeCalls++;
    for (const e of b) { void nx[edges[e]]; void nx[edges[e + 1]]; }
  }
  const out = collect ? { glow: [...glow], lift: [...lift] } : null;
  return { segments: edges.length / 2, strokeCalls, out };
}

// ── equivalencia ────────────────────────────────────────────────────────────
// Float32Array redondea a simple precisión, así que la tolerancia es la de f32,
// no cero exacto.
const T = 3.7;
const a = drawOld(T, true).out;
const b = drawNew(T, true).out;
let maxGlow = 0, maxLift = 0;
for (let i = 0; i < a.glow.length; i++) {
  maxGlow = Math.max(maxGlow, Math.abs(a.glow[i] - b.glow[i]));
  maxLift = Math.max(maxLift, Math.abs(a.lift[i] - b.lift[i]));
}

// ── medición ────────────────────────────────────────────────────────────────
function bench(fn, frames = 600) {
  fn(0); // calentar
  const t0 = process.hrtime.bigint();
  for (let f = 0; f < frames; f++) fn(f / 60);
  return Number(process.hrtime.bigint() - t0) / 1e6 / frames;
}

exps = 0; drawOld(1); const expsOld = exps;
exps = 0; drawNew(1); const expsNew = exps;
const infoOld = drawOld(1), infoNew = drawNew(1);
const msOld = bench(drawOld), msNew = bench(drawNew);

console.log(`Campo: ${nodes.length} nodos, ${infoNew.segments} aristas (${W}×${H})\n`);
console.log(`                      antes        ahora     factor`);
console.log(`Math.exp()/frame  ${String(expsOld).padStart(9)}  ${String(expsNew).padStart(11)}   ${(expsOld / expsNew).toFixed(0)}× menos`);
console.log(`stroke()/frame    ${String(infoOld.strokeCalls).padStart(9)}  ${String(infoNew.strokeCalls).padStart(11)}   ${(infoOld.strokeCalls / infoNew.strokeCalls).toFixed(0)}× menos`);
console.log(`ms/frame (calc)   ${msOld.toFixed(3).padStart(9)}  ${msNew.toFixed(3).padStart(11)}   ${(msOld / msNew).toFixed(1)}× más rápido`);
console.log(`\nEquivalencia de valores (tolerancia f32 ≈ 1e-6):`);
console.log(`  glow: desvío máximo ${maxGlow.toExponential(2)}`);
console.log(`  lift: desvío máximo ${maxLift.toExponential(2)}`);
console.log(maxGlow < 1e-5 && maxLift < 1e-4 ? "  ✓ idénticos dentro de la precisión de Float32Array" : "  ✗ DIVERGEN");
