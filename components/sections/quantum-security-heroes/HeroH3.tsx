"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { pickDigit, monoFont, setupCanvas } from "@/components/sections/quantum-security-heroes/asciiField";
import { createWordReveal } from "@/components/sections/quantum-security-heroes/wordReveal";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO_BODY, HERO_CTA } from "@/components/sections/quantum-security-heroes/heroContent";

const CELL_DESKTOP = 15;
const CELL_MOBILE = 22;
const FONT_PX = 11;
const STREAM_LEN = 4; // celdas encendidas por columna del rain
const DIM_RGBA = "rgba(17,17,17,0.3)";
const MUTED_RGBA = "rgba(17,17,17,0.55)"; // el rain mientras SECURITY está en pantalla
const GREEN_RGB = "0,220,141"; // = --near-green-accent, mismo verde que HeroH2/quantumLattice
const GREEN_RGBA = `rgba(${GREEN_RGB},1)`;
const TICK_S = 0.1; // 10Hz, mismo ritmo que PipesField

// Perfil del borde SUPERIOR del rain. El campo no es un rectángulo: el
// centro se hunde formando un embudo para dejar leer el cuerpo del hero, que
// cae justo ahí, y cada columna arranca a su propia altura para que el borde
// no lea como una línea recta.
const FUNNEL_SPAN = 0.66; // ancho del embudo, en fracción del ancho del campo
const FUNNEL_DEPTH = 0.62; // cuánto baja el centro, en fracción de las filas
const FUNNEL_CURVE = 1.6; // >1 = paredes del embudo más verticales
const EDGE_JITTER = 3; // celdas de dentado columna a columna
const EDGE_DROP_CHANCE = 0.22; // columnas que además arrancan bastante más abajo
const WORD_CUTOFF = 0.3; // fracción de SECURITY que queda fuera por abajo

// Hero · H3 accomodo — ver /prototype/protocol-heroes/h3 (H3Threshold.tsx).
// Mismo reparto que esa referencia: el bloque entero — título, cuerpo, CTA —
// centrado en los dos ejes.
//
// Fondo: ASCII rain hecho a mano — columnas de dígitos que SUBEN (al revés
// del "Matrix rain" clásico) desde el borde inferior, ~40% del alto del
// hero. Mismo grid de celdas y mismo principio de costo que PipesField: la
// base se pinta una vez, cada tick (10Hz) solo se tocan las celdas que
// cambiaron.
//
// El campo NO llena su caja: cada columna tiene su propia fila de arranque
// (`topRow`), y el perfil que forman las tres cosas juntas —embudo al
// centro, dentado columna a columna, alguna columna suelta más baja— es lo
// que despeja el cuerpo del hero y evita que el borde superior lea como una
// línea recta. Todo lo que dibuja el rain pasa por ese tope: `ignite`,
// `revert` y `paintBase` recortan contra `topRow[col]`, no contra 0.
//
// Mientras SECURITY está en pantalla el rain se pinta en `MUTED_RGBA` en vez
// de verde: el único verde de la sección es la palabra, y se lee sin que el
// campo compita. El cambio de estado repinta el campo entero una vez (dos
// veces por ciclo, no por tick) — ver `repaintAll`.
//
// SECURITY: `createWordReveal` (wordReveal.ts) — arte ASCII de bloque
// DENTRO de este mismo grid, una región de celdas se ilumina en el patrón
// de sus letras en vez de al azar. Acá va a sangre de ancho y anclada al
// borde inferior con un 30% del bloque fuera de la sección — se lee cortada
// por el corte de la sección, no flotando en la franja. Factorizado ahí
// porque las variantes h3-v2/h3-v3 necesitan exactamente el mismo mecanismo
// sobre su propio campo de fondo. Ver ese archivo para el ciclo (ruido →
// resuelve → sostiene → disuelve) y el porqué de cíclico.
//
// Accesibilidad: el titular visible ya NO incluye "security" como palabra
// —el arte de bloque ocupa ese rol— así que el `<h1>` se separa en un
// bloque visible `aria-hidden` (lo que se ve: "Post-quantum" / "live on
// mainnet") y un `sr-only` con la oración real y completa, que es lo único
// que anuncia un lector de pantalla o indexa un buscador para este heading.
export default function HeroH3() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    // ── entrada del titular ──────────────────────────────────────────────
    mm.add(MQ.motion, () => {
      const heading = q("[data-hero-heading]")[0];
      const rest = q("[data-hero-item]");

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

      if (heading) {
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
      }

      tl.from(rest, { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, 0.35);

      return () => tl.kill();
    });

    // ── rain + SECURITY, un solo canvas, un solo grid ───────────────────────
    const canvas = q("[data-rain-canvas]")[0] as HTMLCanvasElement | undefined;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return () => mm.revert();

    let cols = 0;
    let rows = 0;
    let cell = CELL_DESKTOP;
    let chars: string[] = [];
    let heads: number[] = [];
    let topRow: number[] = [];
    let speedDiv: number[] = [];
    let phase: number[] = [];
    let tickCount = 0;
    let wordActive = false;
    const rng = createSeededRandom(9042);

    const key = (col: number, row: number) => row * cols + col;

    // `keep`: pinta ENCIMA de lo que ya haya en la celda en vez de borrarla
    // primero. Lo usa el crossfade de la palabra (dígito gris abajo, el
    // mismo dígito en verde con alpha parcial arriba); el rain siempre
    // borra.
    const drawCell = (col: number, row: number, text: string, style: string, keep = false) => {
      const x = col * cell;
      const y = row * cell;
      if (!keep) ctx.clearRect(x, y, cell, cell);
      ctx.font = monoFont(FONT_PX);
      ctx.textBaseline = "top";
      ctx.fillStyle = style;
      ctx.fillText(text, x + 2, y + 2);
    };

    // El rain se corta arriba en `topRow[col]` y no pisa la palabra mientras
    // esta esté resolviéndose o sostenida — si no, le enciende celdas al azar
    // por dentro y la vuelve ilegible.
    const blocked = (col: number, row: number) =>
      row < topRow[col] || row >= rows || security.suppresses(col, row);

    const ignite = (col: number, row: number) => {
      if (blocked(col, row)) return;
      drawCell(col, row, chars[key(col, row)], wordActive ? MUTED_RGBA : GREEN_RGBA);
    };
    const revert = (col: number, row: number) => {
      if (blocked(col, row)) return;
      drawCell(col, row, chars[key(col, row)], DIM_RGBA);
    };

    const paintBase = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      for (let c = 0; c < cols; c++) {
        for (let r = topRow[c]; r < rows; r++) drawCell(c, r, chars[key(c, r)], DIM_RGBA);
      }
    };

    const security = createWordReveal({
      word: "SECURITY",
      charAt: (col, row) => chars[key(col, row)],
      drawCell,
      greenRgb: GREEN_RGB,
      dimRgba: DIM_RGBA,
      rng,
    });

    const build = () => {
      cell = window.matchMedia(MQ.mobile).matches ? CELL_MOBILE : CELL_DESKTOP;
      const dpr = deviceRatio(1.5);
      const { width, height } = setupCanvas(canvas, dpr);
      cols = Math.max(1, Math.floor(width / cell));
      rows = Math.max(1, Math.floor(height / cell));

      chars = new Array(cols * rows);
      for (let i = 0; i < chars.length; i++) chars[i] = pickDigit(rng);

      heads = new Array(cols);
      topRow = new Array(cols);
      speedDiv = new Array(cols);
      phase = new Array(cols);
      for (let c = 0; c < cols; c++) {
        // Embudo: 0 en los bordes del campo, 1 en el centro, con las paredes
        // curvadas por `FUNNEL_CURVE`. Fuera de `FUNNEL_SPAN` no hunde nada.
        const t = cols <= 1 ? 0.5 : c / (cols - 1);
        const fromCenter = Math.abs(t - 0.5) * 2;
        const inside = Math.max(0, 1 - fromCenter / FUNNEL_SPAN);
        const funnel = Math.pow(inside, FUNNEL_CURVE) * rows * FUNNEL_DEPTH;
        const drop = rng() < EDGE_DROP_CHANCE ? 2 + Math.floor(rng() * 3) : 0;
        const jitter = Math.floor(rng() * (EDGE_JITTER + 1));
        topRow[c] = Math.min(rows - 1, Math.round(funnel) + jitter + drop);

        // Arranca en una fase aleatoria de su propio ciclo, no todas en el
        // borde inferior a la vez — si no, la primera pasada se ve como una
        // ola sincronizada en vez de lluvia.
        heads[c] = topRow[c] + Math.floor(rng() * (rows - topRow[c] + STREAM_LEN));
        speedDiv[c] = rng() < 0.5 ? 1 : 2;
        phase[c] = Math.floor(rng() * 2);
      }

      // A sangre de ancho y clavada al borde INFERIOR, con un 30% del bloque
      // por debajo del corte de la sección.
      security.layout(cols, rows, { widthFraction: 1, cutoffFraction: WORD_CUTOFF });

      repaintAll();
    };

    // Repinta el campo entero: base + los streams en el color que toque +
    // la palabra tal cual esté. Se llama al construir y en los dos cambios
    // de estado de SECURITY por ciclo — nunca por tick.
    const repaintAll = () => {
      paintBase();
      for (let c = 0; c < cols; c++) {
        for (let r = heads[c]; r < heads[c] + STREAM_LEN; r++) ignite(c, r);
      }
      security.redraw();
    };

    const tick = () => {
      const active = security.isActive();
      if (active !== wordActive) {
        wordActive = active;
        repaintAll();
      }
      tickCount++;
      for (let c = 0; c < cols; c++) {
        if ((tickCount + phase[c]) % speedDiv[c] !== 0) continue;
        const oldHead = heads[c];
        let newHead = oldHead - 1;
        if (newHead < topRow[c] - STREAM_LEN) {
          for (let r = oldHead; r < oldHead + STREAM_LEN; r++) revert(c, r);
          newHead = rows;
          for (let r = newHead; r < newHead + STREAM_LEN; r++) ignite(c, r);
        } else {
          revert(c, oldHead + STREAM_LEN - 1);
          ignite(c, newHead);
        }
        heads[c] = newHead;
      }
      security.tick();
    };

    let visible = true;
    let animating = false;
    let acc = 0;
    let lastT = 0;

    const onFrame = (time: number) => {
      const dt = time - lastT;
      lastT = time;
      if (!visible || !animating) return;
      acc += dt;
      if (acc >= TICK_S) {
        acc = 0;
        tick();
      }
    };

    gsap.ticker.add(onFrame);
    onViewportToggle(scope, (v) => {
      visible = v;
    });

    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);

    const mmRain = gsap.matchMedia();
    mmRain.add(MQ.motion, () => {
      animating = true;
      return () => {
        animating = false;
      };
    });
    // Con reduced-motion, SECURITY queda resuelta y quieta (contenido, no
    // movimiento) en vez de en ruido.
    mmRain.add(MQ.reduce, () => {
      security.forceHeld();
    });

    build();

    return () => {
      gsap.ticker.remove(onFrame);
      ro.disconnect();
      mmRain.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-cream pt-[var(--site-header-block)] text-foreground"
    >
      <canvas
        data-rain-canvas
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 block h-[40%] w-full"
      />

      <Container className="relative z-10 flex flex-1 flex-col items-center justify-center gap-[1.35rem] py-20 text-center">
        <h1 data-hero-heading className="max-w-[18ch] text-display text-pretty">
          <span aria-hidden="true">
            Post-quantum
            <br />
            <Accent display>live on mainnet</Accent>
          </span>
          <span className="sr-only">Post-quantum security, live on mainnet</span>
        </h1>
        <p data-hero-item className="max-w-[42ch] text-body-lg text-ink-soft text-pretty">
          {HERO_BODY}
        </p>
        <div data-hero-item className="mt-[0.9rem]">
          <CtaPill href={HERO_CTA.href} tone="filled">
            {HERO_CTA.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
