"use client";

import Container from "@/components/primitives/Container";
import Accent from "@/components/primitives/Accent";
import GradientMesh from "@/components/primitives/GradientMesh";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { subscribePointer } from "@/components/primitives/motion/pointer";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { HERO_B } from "@/components/sections/chain-abstraction-proposals/content";
import { CHAINS } from "@/components/sections/chain/chainContent";

// ── El campo de chains — abraza el título y el texto ────────────────────────
// Pedido: que las chains RODEEN el bloque de título/texto por arriba, por la
// derecha y por abajo (como el boceto de líneas verdes) — no un campo libre
// ni una medialuna al costado, un marco en "C" abierto a la izquierda, con
// el texto adentro del hueco.
//
// Se arma como una ruta de 3 tramos (no una curva suave tipo elipse): una
// recta arriba, un semi-óvalo que dobla por la derecha, una recta abajo. La
// curva suave que se probó antes (una elipse centrada fuera de pantalla)
// fallaba justo en esto: en su tramo intermedio pasaba por una altura media
// (donde vive el título) todavía con un `x` chico — quedaba una chain
// atravesando el texto. Con 3 tramos explícitos, las dos rectas se quedan
// SIEMPRE a una altura seria (`Y_TOP`/`Y_BOTTOM`, lejos del título y del
// subtítulo pase lo que pase en `x`), y el único tramo que cruza la altura
// del texto (el semi-óvalo) lo hace siempre con `x` grande (a la derecha de
// `X_CORNER`, más allá de dónde llega el título) — la combinación es la que
// garantiza que ninguna chain caiga arriba del texto.
//
// `t = i/(N-1)` recorre las 35 chains de punta a punta de la ruta (arriba →
// vuelta a la derecha → abajo). El offset perpendicular a la ruta
// (`bandT`, con el mismo jitter determinístico `Math.sin(i·const)` de
// siempre) es lo que le da grosor al trazo — sin eso, sería una sola línea
// de chains en fila india.
const T_TOP_END = 0.36;
const T_CAP_END = 0.64;
const X_LEFT = 3;
// `X_CORNER` tiene que quedar a la derecha de donde llega el título en su
// renglón único (~69% del ancho en desktop) — es el margen que hace que el
// semi-óvalo nunca pase por encima del texto.
const X_CORNER = 76;
const X_OUTER = 97;
const Y_TOP = 11;
const Y_BOTTOM = 89;
const CY_MID = (Y_TOP + Y_BOTTOM) / 2;
const RX_CAP = X_OUTER - X_CORNER;
const RY_CAP = (Y_BOTTOM - Y_TOP) / 2;
const BAND = 9;

const round = (n: number) => Math.round(n * 1e4) / 1e4;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function pointOnPath(t: number, bandT: number) {
  if (t < T_TOP_END) {
    // Recta de arriba: izquierda → la esquina.
    const lt = t / T_TOP_END;
    return { x: X_LEFT + lt * (X_CORNER - X_LEFT), y: Y_TOP + bandT * BAND };
  }
  if (t < T_CAP_END) {
    // El semi-óvalo de la derecha: dobla de arriba a abajo pasando por el
    // punto más a la derecha (`X_OUTER`) a mitad de camino.
    const lt = (t - T_TOP_END) / (T_CAP_END - T_TOP_END);
    const theta = ((-90 + lt * 180) * Math.PI) / 180;
    const rx = RX_CAP + bandT * BAND;
    const ry = RY_CAP + (bandT * BAND * RY_CAP) / RX_CAP;
    return { x: X_CORNER + rx * Math.cos(theta), y: CY_MID + ry * Math.sin(theta) };
  }
  // Recta de abajo: la esquina → izquierda (mismo sentido de recorrido).
  const lt = (t - T_CAP_END) / (1 - T_CAP_END);
  return { x: X_CORNER - lt * (X_CORNER - X_LEFT), y: Y_BOTTOM + bandT * BAND };
}

const FIELD = CHAINS.map((label, i) => {
  const t = CHAINS.length > 1 ? i / (CHAINS.length - 1) : 0.5;
  const bandT = clamp(Math.sin(i * 77.1) * 0.55, -0.5, 0.5);
  const p = pointOnPath(t, bandT);

  return {
    label,
    x: round(clamp(p.x, 2, 98)),
    y: round(clamp(p.y, 2, 98)),
    opacity: round(0.18 + Math.abs(Math.sin(i * 4.17)) * 0.42),
    phase: round((i * 0.61) % (Math.PI * 2)),
    period: 8 + (i % 5) * 1.6,
    // La mitad del campo solo en desktop — 35 labels apretadas en un marco
    // angosto de teléfono es una pared de texto, no un campo.
    dense: i % 2 === 1,
  };
});

// ── Interactividad del puntero ──────────────────────────────────────────────
// Mismo mecanismo (acotado) que `chain/ChainHero.tsx`: cada ticker se inclina
// hacia el cursor dentro de un radio, con un tope de desplazamiento — nunca
// se "pega" al puntero. `subscribePointer` es el listener compartido de toda
// la página (un solo `pointermove`, muchos suscriptores).
const PULL_RADIUS = 220;
const PULL_MAX = 14;
const PULL_TAU = 0.2;
const MAX_FRAME_S = 0.05;

// ── El parpadeo tipo luciérnaga ─────────────────────────────────────────────
// De a pares: los dos se apagan y, en el instante invisible, INTERCAMBIAN
// posición — nunca un destino al azar (eso pisaba tickers reales), siempre
// una de las posiciones ya válidas de `FIELD`. Real `Math.random()`, no el
// seed determinístico de `FIELD`: corre solo después del mount, nunca en
// SSR/hidratación.
const FIREFLY_MIN = 1;
const FIREFLY_RANGE = 3;
const FIREFLY_FADE_OUT = 0.22;
const FIREFLY_FADE_IN = 0.25;
const FIREFLY_GAP_MIN = 0.35;
const FIREFLY_GAP_RANGE = 0.65;

export default function Hero() {
  // Scope 1: el campo de tickers — wander idle + gravedad de puntero +
  // parpadeo de luciérnaga, todo en un loop de `gsap.ticker`/`delayedCall`.
  const fieldRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };
      const drifts = q("[data-ticker-drift]");
      const tickers = q("[data-ticker]");
      if (!motionOk) return;

      let boxLeft = 0;
      let boxTop = 0;
      let boxW = 0;
      let boxH = 0;
      const measure = () => {
        const r = scope.getBoundingClientRect();
        boxLeft = r.left;
        boxTop = r.top + window.scrollY;
        boxW = r.width;
        boxH = r.height;
      };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);

      let pointerX = 0.5;
      let pointerY = 0.5;
      let hasPointer = false;
      let seeded = false;
      const unsubscribe = subscribePointer((x, y) => {
        if (!seeded) {
          seeded = true;
          hasPointer = x !== 0.5 || y !== 0.5;
        } else if (x !== pointerX || y !== pointerY) {
          hasPointer = true;
        }
        pointerX = x;
        pointerY = y;
      });

      const setX = drifts.map((el) => gsap.quickSetter(el, "x", "px"));
      const setY = drifts.map((el) => gsap.quickSetter(el, "y", "px"));
      const cur = drifts.map(() => ({ x: 0, y: 0 }));

      // Posición ACTUAL de cada ticker (arranca igual a `FIELD`, cambia
      // cuando la luciérnaga intercambia un par). El wander y el pull de
      // puntero tienen que leer de acá, no de `FIELD[i]` directo.
      const currentPos = FIELD.map((f) => ({ x: f.x, y: f.y }));

      let elapsed = 0;
      let visible = true;
      const update = (_time: number, deltaMs: number) => {
        if (!visible) return;
        const dt = Math.min(deltaMs / 1000, MAX_FRAME_S);
        elapsed += dt;
        const k = 1 - Math.exp(-dt / PULL_TAU);
        const boxTopNow = boxTop - window.scrollY;
        const px = pointerX * window.innerWidth;
        const py = pointerY * window.innerHeight;

        for (let i = 0; i < drifts.length; i++) {
          const f = FIELD[i];
          let tx = Math.sin(elapsed / f.period + f.phase) * 6;
          let ty = Math.cos(elapsed / f.period + f.phase) * 6;

          if (hasPointer) {
            const p = currentPos[i];
            const cx = boxLeft + (p.x / 100) * boxW;
            const cy = boxTopNow + (p.y / 100) * boxH;
            const dx = px - cx;
            const dy = py - cy;
            const dist = Math.hypot(dx, dy);
            if (dist > 0.001 && dist < PULL_RADIUS) {
              const t = 1 - dist / PULL_RADIUS;
              const pull = t * t * PULL_MAX;
              tx += (dx / dist) * pull;
              ty += (dy / dist) * pull;
            }
          }

          const c = cur[i];
          c.x += (tx - c.x) * k;
          c.y += (ty - c.y) * k;
          setX[i](c.x);
          setY[i](c.y);
        }
      };

      gsap.ticker.add(update);

      const busy = new Set<number>();
      let fireflyTimer: gsap.core.Tween | null = null;
      let fireflyLive = true;

      const swapPair = () => {
        const idle: number[] = [];
        for (let i = 0; i < tickers.length; i++) if (!busy.has(i)) idle.push(i);
        if (idle.length < 2) return;
        const a = idle.splice(Math.floor(Math.random() * idle.length), 1)[0];
        const b = idle[Math.floor(Math.random() * idle.length)];
        busy.add(a);
        busy.add(b);
        const elA = tickers[a];
        const elB = tickers[b];

        gsap
          .timeline({
            onComplete: () => {
              busy.delete(a);
              busy.delete(b);
            },
          })
          .to([elA, elB], { opacity: 0, duration: FIREFLY_FADE_OUT, ease: "power1.in" })
          .call(() => {
            const pa = currentPos[a];
            const pb = currentPos[b];
            currentPos[a] = pb;
            currentPos[b] = pa;
            elA.style.left = `${pb.x}%`;
            elA.style.top = `${pb.y}%`;
            elB.style.left = `${pa.x}%`;
            elB.style.top = `${pa.y}%`;
          })
          .to([elA, elB], { opacity: 1, duration: FIREFLY_FADE_IN, ease: "power1.out" }, "+=0.05");
      };

      const blink = () => {
        const wanted = FIREFLY_MIN + Math.floor(Math.random() * FIREFLY_RANGE);
        for (let n = 0; n < wanted; n++) swapPair();
      };

      const scheduleFirefly = () => {
        fireflyTimer?.kill();
        fireflyTimer = gsap.delayedCall(FIREFLY_GAP_MIN + Math.random() * FIREFLY_GAP_RANGE, () => {
          if (!fireflyLive) return;
          blink();
          scheduleFirefly();
        });
      };

      const track = scope.closest("section") ?? scope;
      onViewportToggle(track, (v) => {
        visible = v;
        fireflyLive = v;
        if (v) scheduleFirefly();
        else fireflyTimer?.kill();
      });

      return () => {
        gsap.ticker.remove(update);
        unsubscribe();
        ScrollTrigger.removeEventListener("refresh", measure);
        fireflyTimer?.kill();
        gsap.killTweensOf(tickers);
      };
    });

    return () => mm.revert();
  }, []);

  // Scope 2: título y subtítulo entran juntos al cargar, sin scroll — a
  // diferencia de la otra copia, acá NO hay reemplazo por scroll: los dos se
  // quedan visibles a la vez, apilados a la izquierda (pedido explícito de
  // esta variante).
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
      className="relative flex min-h-svh items-center overflow-hidden bg-cream"
    >
      <GradientMesh tone="light" />
      <div ref={fieldRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        {FIELD.map((t) => (
          <span
            key={t.label}
            data-ticker
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${t.dense ? "hidden lg:block" : ""}`}
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
          >
            <span
              data-ticker-drift
              className="block whitespace-nowrap text-caption-mono uppercase text-foreground"
              style={{ opacity: t.opacity }}
            >
              {t.label}
            </span>
          </span>
        ))}
      </div>
      <Container className="relative flex flex-col items-start py-32 text-left">
        {/* Sin `max-w` acá a propósito: a este tamaño de fuente (`text-display`,
            hasta 8rem en desktop ancho) "The Chain Disappears." necesita
            ~1550px para entrar en un solo renglón — casi todo el ancho
            disponible del `Container`. El pedido es justo ese: una sola
            línea, bloque estirado a lo ancho. El `<p>` de abajo mantiene su
            propio `max-w-2xl` (ver más abajo), así que no hereda este ancho
            — el subtítulo sigue en una columna de lectura normal. */}
        <div className="w-full">
          <h1 data-hero-heading className="text-display text-pretty">
            The Chain Disappears.
            <br />
            <Accent display>You don&apos;t.</Accent>
          </h1>
          <p data-hero-item className="mt-8 max-w-2xl text-body-lg text-foreground/70 text-pretty">
            {HERO_B.sub}
          </p>
        </div>
      </Container>
    </section>
  );
}
