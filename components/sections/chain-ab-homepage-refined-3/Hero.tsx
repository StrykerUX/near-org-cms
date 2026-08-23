"use client";

import Container from "@/components/primitives/Container";
import Accent from "@/components/primitives/Accent";
import GradientMesh from "@/components/primitives/GradientMesh";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { HERO_B } from "@/components/sections/chain-abstraction-proposals/content";
import { CHAINS } from "@/components/sections/chain/chainContent";

// ── El campo de chains — grid denso con las cajas de texto recortadas ──────
// Mismo acomodo de texto y mismo campo que la copia 4 (título arriba a la
// izquierda, texto abajo a la derecha, grid denso con las dos cajas de
// texto recortadas por descarte) — pedido explícito de traer ese mismo
// efecto acá, la única diferencia real es que esta variante mantiene el
// fondo oscuro (`bg-ink-slate`) en vez de pasar a claro.
const JITTER = 0.32;

const MARGIN = { x0: 6, y0: 8, x1: 94, y1: 92 }; // mismo margen de borde de siempre
const COLS = 16;
const ROWS = 11; // grid denso — de sobra para que no se note ningún hueco

// Cajas a evitar. Aproximan dónde caen el título y el párrafo — se
// reajustan a ojo si hace falta, mismo criterio que la copia 4.
type Rect = { x0: number; y0: number; x1: number; y1: number };
const TITLE_BOX: Rect = { x0: 0, y0: 0, x1: 69, y1: 50 };
const TEXT_BOX: Rect = { x0: 55, y0: 74, x1: 100, y1: 100 };

const inside = (x: number, y: number, r: Rect) => x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1;

const round = (n: number) => Math.round(n * 1e4) / 1e4;

const CELLS: { x: number; y: number }[] = [];
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const idx = row * COLS + col;
    const jx = Math.sin(idx * 12.9898) * 0.5;
    const jy = Math.sin(idx * 78.233) * 0.5;
    const tx = (col + 0.5 + jx * 2 * JITTER) / COLS;
    const ty = (row + 0.5 + jy * 2 * JITTER) / ROWS;
    const x = round(MARGIN.x0 + tx * (MARGIN.x1 - MARGIN.x0));
    const y = round(MARGIN.y0 + ty * (MARGIN.y1 - MARGIN.y0));
    if (inside(x, y, TITLE_BOX) || inside(x, y, TEXT_BOX)) continue;
    CELLS.push({ x, y });
  }
}

// Labels cíclicos sobre `CHAINS` (35 nombres reales) — hacen falta más
// celdas que nombres, así que se repiten. Como el label sale del índice DEL
// GRID (no al revés), una misma chain solo vuelve a aparecer después de dar
// toda una vuelta a la lista — nunca pegada a su propia repetición.
const FIELD = CELLS.map((p, i) => ({
  label: CHAINS[i % CHAINS.length],
  x: p.x,
  y: p.y,
  opacity: round(0.18 + Math.abs(Math.sin(i * 4.17)) * 0.42),
  phase: round((i * 0.61) % (Math.PI * 2)),
  period: 8 + (i % 5) * 1.6,
  // La mitad del campo solo en desktop — un grid así de denso en un
  // lienzo angosto de teléfono es una pared de texto, no un campo.
  dense: i % 2 === 1,
}));

const PULL_TAU = 0.2;
const MAX_FRAME_S = 0.05;

// ── El encendido de izquierda a derecha ─────────────────────────────────────
// Al cargar: una sola pasada, las de la izquierda ya visibles, la ola
// avanza hacia la derecha. Termina en el `onComplete` de este tween —no
// suelto en el tiempo— para encadenar justo ahí el arranque de la
// luciérnaga (ver más abajo): que no empiecen a parpadear chains que
// todavía no terminaron de aparecer.
const REVEAL_STEP = 0.028; // delay entre una chain y la siguiente en el barrido
const REVEAL_DURATION = 0.7;

// ── La luciérnaga — solo opacidad, sin intercambio de posición ─────────────
// Sin efecto hover (nunca lo tuvo esta sección, a diferencia de la vieja
// versión de la copia 4): cada chain parpadea independiente, en su propio
// lugar, opacidad de reposo → 0 → opacidad de reposo. Lote grande y con
// tiempo real apagada (`FIREFLY_HOLD`) para que se note — mismos valores ya
// afinados en la copia 4.
const FIREFLY_MIN = 16;
const FIREFLY_RANGE = 16;
const FIREFLY_FADE_OUT = 0.5;
const FIREFLY_HOLD = 0.9;
const FIREFLY_FADE_IN = 0.5;
const FIREFLY_GAP_MIN = 0.4;
const FIREFLY_GAP_RANGE = 0.6;

export default function Hero() {
  // Scope 1: el campo de tickers — encendido de izquierda a derecha al
  // cargar + wander idle, en un loop de `gsap.ticker`.
  const fieldRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };
      const drifts = q("[data-ticker-drift]");
      if (!motionOk) return;

      const setX = drifts.map((el) => gsap.quickSetter(el, "x", "px"));
      const setY = drifts.map((el) => gsap.quickSetter(el, "y", "px"));
      const cur = drifts.map(() => ({ x: 0, y: 0 }));

      let elapsed = 0;
      let visible = true;
      const update = (_time: number, deltaMs: number) => {
        if (!visible) return;
        const dt = Math.min(deltaMs / 1000, MAX_FRAME_S);
        elapsed += dt;
        const k = 1 - Math.exp(-dt / PULL_TAU);

        for (let i = 0; i < drifts.length; i++) {
          const f = FIELD[i];
          const tx = Math.sin(elapsed / f.period + f.phase) * 6;
          const ty = Math.cos(elapsed / f.period + f.phase) * 6;

          const c = cur[i];
          c.x += (tx - c.x) * k;
          c.y += (ty - c.y) * k;
          setX[i](c.x);
          setY[i](c.y);
        }
      };

      gsap.ticker.add(update);

      // Luciérnaga: arranca recién cuando termina el barrido de encendido
      // (se engancha a su `onComplete`, no corre en paralelo) — `revealDone`
      // frena a `scheduleFirefly` hasta ese momento aunque `onViewportToggle`
      // dispare antes (dispara al montar, con la sección ya visible, mucho
      // antes de que el barrido termine). Gateada además por `inView` — se
      // pausa fuera de pantalla y retoma al volver, siempre que ya haya
      // terminado el barrido.
      const busy = new Set<number>();
      let fireflyTimer: gsap.core.Tween | null = null;
      let revealDone = false;
      let inView = true;

      const blinkOne = () => {
        const idle = drifts.map((_, i) => i).filter((i) => !busy.has(i));
        if (!idle.length) return;
        const i = idle[Math.floor(Math.random() * idle.length)];
        busy.add(i);
        gsap
          .timeline({ onComplete: () => busy.delete(i) })
          .to(drifts[i], { opacity: 0, duration: FIREFLY_FADE_OUT, ease: "power1.in" })
          .to(
            drifts[i],
            { opacity: FIELD[i].opacity, duration: FIREFLY_FADE_IN, ease: "power1.out" },
            `+=${FIREFLY_HOLD}`,
          );
      };

      const blink = () => {
        const wanted = FIREFLY_MIN + Math.floor(Math.random() * FIREFLY_RANGE);
        for (let n = 0; n < wanted; n++) blinkOne();
      };

      const scheduleFirefly = () => {
        fireflyTimer?.kill();
        if (!revealDone || !inView) return;
        fireflyTimer = gsap.delayedCall(FIREFLY_GAP_MIN + Math.random() * FIREFLY_GAP_RANGE, () => {
          if (!inView) return;
          blink();
          scheduleFirefly();
        });
      };

      // Encendido de izquierda a derecha, una sola vez: se ordenan los
      // índices por `x` (no por orden del DOM, que es orden de grid — fila
      // por fila, no columna por columna) y se anima cada `drift` de
      // opacity 0 a su opacity de reposo (`FIELD[i].opacity`, la misma que
      // ya trae el `style` inline de React) con un delay creciente en ESE
      // orden. `gsap.set` a 0 primero para no depender de que el inline
      // style de React "gane" la carrera contra el primer paint.
      const order = drifts.map((_, i) => i).sort((a, b) => FIELD[a].x - FIELD[b].x);
      const orderedDrifts = order.map((i) => drifts[i]);
      const orderedOpacity = order.map((i) => FIELD[i].opacity);
      gsap.set(orderedDrifts, { opacity: 0 });
      gsap.to(orderedDrifts, {
        opacity: (i) => orderedOpacity[i],
        duration: REVEAL_DURATION,
        ease: EASE_OUT,
        stagger: REVEAL_STEP,
        onComplete: () => {
          revealDone = true;
          scheduleFirefly();
        },
      });

      const track = scope.closest("section") ?? scope;
      onViewportToggle(track, (v) => {
        visible = v;
        inView = v;
        if (v) scheduleFirefly();
        else fireflyTimer?.kill();
      });

      return () => {
        gsap.ticker.remove(update);
        fireflyTimer?.kill();
        gsap.killTweensOf(drifts);
      };
    });

    return () => mm.revert();
  }, []);

  // Scope 2: título y subtítulo entran juntos al cargar, sin scroll.
  const introRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    const heading = q("[data-hero-heading]")[0];
    const items = q("[data-hero-item]");

    if (!motionOk) {
      gsap.set(items, { clearProps: "all" });
      return;
    }

    if (!heading) return;

    SplitText.create(heading, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) => {
        allowDescenders(self.lines);
        return gsap.from(self.lines, {
          yPercent: 110,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1,
          ease: EASE_OUT,
        });
      },
    });

    gsap.from(items, { y: 32, autoAlpha: 0, duration: 0.9, delay: 0.7, ease: EASE_OUT });
  }, []);

  return (
    <section
      ref={introRef}
      data-nav-dark
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-ink-slate text-white"
    >
      <GradientMesh tone="dark" />
      <div ref={fieldRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        {FIELD.map((t, i) => (
          <span
            key={i}
            data-ticker
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${t.dense ? "hidden lg:block" : ""}`}
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
          >
            <span
              data-ticker-drift
              className="block whitespace-nowrap text-caption-mono uppercase text-white/70"
              style={{ opacity: t.opacity }}
            >
              {t.label}
            </span>
          </span>
        ))}
      </div>
      {/* Título arriba a la izquierda y texto abajo a la derecha: dos
          bloques en esquinas opuestas, no una fila compartida — por eso son
          dos `Container` en flujo normal (`justify-between` de la sección
          los separa a los extremos), no uno solo con `items-end`. */}
      <Container className="relative pt-44">
        {/* Sin `max-w` en el `<h1>` a propósito: "The Chain Disappears."
            entera en un renglón necesita el ancho que necesite a este
            tamaño de fuente (`text-display`, hasta 8rem) — con un `max-w`
            puesto se corta antes de tiempo y vuelve a partir en dos líneas
            ("The Chain" / "Disappears."), que es justo lo que no se quiere.
            El `<Container>` de afuera sigue poniendo el techo real
            (`max-w-[1780px]`). */}
        <h1 data-hero-heading className="text-display text-pretty">
          <div className="lg:whitespace-nowrap">The Chain Disappears.</div>
          <div className="mt-4 lg:mt-6">
            <Accent display>You don&apos;t.</Accent>
          </div>
        </h1>
      </Container>
      <Container className="relative flex justify-end pb-20">
        {/* `text-justify` estira cada línea salvo la última ("...never
            does.") para que ambos bordes, izquierdo y derecho, queden
            parejos. Sin `hyphens-auto`: sin partir palabras. El bloque
            entero sigue clavado abajo a la derecha (lo pone el
            `justify-end` del `Container`). */}
        <div data-hero-item className="max-w-2xl">
          <p className="text-body-lg text-justify text-white/70">{HERO_B.sub}</p>
        </div>
      </Container>
    </section>
  );
}
