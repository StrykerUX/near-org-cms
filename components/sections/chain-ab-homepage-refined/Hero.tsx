"use client";

import Container from "@/components/primitives/Container";
import Accent from "@/components/primitives/Accent";
import GradientMesh from "@/components/primitives/GradientMesh";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { subscribePointer } from "@/components/primitives/motion/pointer";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { HERO_B } from "@/components/sections/chain-abstraction-proposals/content";
import { CHAINS } from "@/components/sections/chain/chainContent";

// ── El campo de chains ──────────────────────────────────────────────────────
// Grid de 7×5 = 35 celdas (una por chain, mismo criterio que el campo real de
// `chain/ChainHero.tsx`) + jitter determinístico (sin `Math.random()`, para
// que no haya mismatch de hidratación).
//
// `keepOutside` empuja cualquier punto que caiga dentro de una elipse central
// hacia su borde: es lo que garantiza que ningún ticker quede DETRÁS del
// título/subhead — antes el campo cubría el 100% del área y algunos caían
// justo en el centro. La elipse es un poco más angosta que el bloque de
// texto real porque el texto crece con el viewport igual que la elipse
// (ambos en %).
const COLS = 7;
const ROWS = 5;
const JITTER = 0.32;
const SAFE_RX = 34;
const SAFE_RY = 30;

// `Math.sin`/`Math.cos` no están obligados por el spec a redondear igual en
// Node que en el motor del navegador (pueden discrepar en el último ulp), y
// eso es justo lo que compara React al hidratar un atributo `style`. Mismo
// fix que documenta `chain/ChainHero.tsx` para el mismo problema: redondear
// a 4 decimales antes de que el número llegue al DOM — muy por debajo de un
// píxel a cualquier tamaño de este campo, e idéntico en los dos lados.
const round = (n: number) => Math.round(n * 1e4) / 1e4;

function keepOutside(x: number, y: number) {
  const dx = (x - 50) / SAFE_RX;
  const dy = (y - 50) / SAFE_RY;
  const d = Math.hypot(dx, dy);
  if (d >= 1) return { x: round(x), y: round(y) };
  const angle = Math.atan2(dy, dx);
  return {
    x: round(50 + Math.cos(angle) * SAFE_RX * 1.03),
    y: round(50 + Math.sin(angle) * SAFE_RY * 1.03),
  };
}

const FIELD = CHAINS.map((label, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const jx = Math.sin(i * 12.9898) * 0.5;
  const jy = Math.sin(i * 78.233) * 0.5;
  const rawX = ((col + 0.5 + jx * 2 * JITTER) / COLS) * 100;
  const rawY = ((row + 0.5 + jy * 2 * JITTER) / ROWS) * 100;
  const { x, y } = keepOutside(rawX, rawY);

  return {
    label,
    x,
    y,
    opacity: round(0.18 + Math.abs(Math.sin(i * 4.17)) * 0.42),
    phase: round((i * 0.61) % (Math.PI * 2)),
    period: 8 + (i % 5) * 1.6,
    // La mitad del campo solo en desktop — 35 labels en un tercio del ancho
    // de un teléfono es una pared de texto, no un campo.
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
// Cada tanto, un par de tickers se apaga y — en el instante exacto en que
// están invisibles — INTERCAMBIAN posición. No un destino al azar dentro del
// 0-100%: eso empujaba seguido (~1 de cada 3 veces, el área de la elipse
// central sobre el total) el punto nuevo justo al borde de la elipse vía
// `keepOutside`, que es EXACTAMENTE donde ya caen otros tickers reales — de
// ahí las chains encimadas. Intercambiando entre dos de las 35 posiciones ya
// válidas y sin colisión de `FIELD` (las mismas de siempre, nunca se inventa
// una nueva), la superposición es imposible por construcción. Real
// `Math.random()`, no el seed determinístico de `FIELD`: este loop corre
// solo después del mount, nunca en SSR/hidratación, así que no hay riesgo de
// mismatch — mismo criterio que el "spark" de `quantum/wordField.ts`.
const FIREFLY_MIN = 1;
const FIREFLY_RANGE = 3;
const FIREFLY_FADE_OUT = 0.22;
const FIREFLY_FADE_IN = 0.25;
const FIREFLY_GAP_MIN = 0.35;
const FIREFLY_GAP_RANGE = 0.65;

// ── El cruce título → subtítulo ─────────────────────────────────────────────
// Reemplazo SECUENCIAL, no crossfade: el título termina de desvanecerse del
// todo (`autoAlpha` llega a 0) ANTES de que el subtítulo empiece a aparecer
// — nunca los dos con opacidad > 0 al mismo tiempo, así que no hay tramo
// donde se lean encimados. `ease:"none"` porque con `scrub:true` el "tiempo"
// de la tween ya es el scroll; un easing con aceleración distorsiona la
// relación lineal entre delta de scroll y delta visual.
const TRAVEL_SVH = 70;
const TRAVEL = `${TRAVEL_SVH}svh`;
const CROSS = 0.5;
const OVERLAP = 0.3;
const EXIT_DUR = OVERLAP / 2;
const ENTER_DUR = OVERLAP / 2;
const TEXT_ENTER_Y = 64;
const TEXT_EXIT_Y = -56;

export default function Hero() {
  // Scope 1: el campo de tickers — wander idle + gravedad de puntero +
  // parpadeo de luciérnaga, todo en un loop de `gsap.ticker`/`delayedCall`
  // (no ScrollTrigger salvo para el gate de viewport: esto no depende del
  // scroll, corre igual con la página quieta).
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
      // puntero tienen que leer de acá, no de `FIELD[i]` directo — si no, un
      // ticker ya intercambiado sigue atrayéndose hacia donde YA NO está.
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

      // Luciérnaga: de a pares. Los dos se apagan, en el instante invisible
      // intercambian su `currentPos` (y por tanto su `left`/`top` en el DOM
      // — nunca un destino inventado), y vuelven a prender a `opacity:1`
      // llano — la opacidad de reposo real vive en el span INTERIOR
      // (`data-ticker-drift`, `style={{opacity:t.opacity}}`), nunca tocado
      // acá, así que no hay que recordar a qué valor volver.
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

      // El gate de viewport NO se ancla a `scope` (el div del campo): ese div
      // es `h-svh` fijo, o sea que su ALTO ESTÁTICO (el que ScrollTrigger usa
      // para calcular `start`/`end`) es de un solo viewport — pero visualmente
      // queda pegado (`position:sticky`) durante `100svh + var(--travel)`,
      // bastante más que eso. Con el trigger en `scope`, apenas se scrollea
      // ~1 viewport dentro del pin (mucho antes de que el pin termine),
      // ScrollTrigger daba por "salido de vista" un contenido que seguía
      // clavado en pantalla — wander y luciérnaga se apagaban solos a mitad
      // de la escena y no volvían a prender. El ancestro `<section>` sí tiene
      // como alto estático el total del pin (`100svh + travel`), así que su
      // rango de trigger coincide con cuánto tiempo real el campo está a la
      // vista.
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

  // Scope 2: el título entra solo al cargar (SplitText, sin depender de
  // scroll). El subtítulo NO aparece con él — lo trae recién el scroll,
  // reemplazando al título en el mismo lugar (escena pegada, mismo
  // `enableScene`/`trackTimeline` que `StickyScrollCapabilities.tsx`).
  // Mobile / motion reducido: subtítulo en flujo normal, sin pin.
  const introRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
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

    if (!isDesktop) {
      gsap.from(items, { y: 40, autoAlpha: 0, duration: 1, delay: 0.9, ease: EASE_OUT });
      return;
    }

    const off = enableScene(scope, "stack");
    const tl = trackTimeline(scope);

    gsap.set(items, { autoAlpha: 0 });

    // Salida y entrada en TRAMOS DISTINTOS de la timeline (no el mismo
    // punto): la entrada arranca justo donde termina la salida
    // (`exitAt + EXIT_DUR`), nunca antes — así el título llega a
    // `autoAlpha:0` completo antes de que el subtítulo empiece a subir de 0.
    const exitAt = CROSS - OVERLAP / 2;
    const enterAt = exitAt + EXIT_DUR;
    tl.to(heading, { autoAlpha: 0, y: TEXT_EXIT_Y, duration: EXIT_DUR, ease: "none" }, exitAt);
    tl.fromTo(
      items,
      { autoAlpha: 0, y: TEXT_ENTER_Y },
      { autoAlpha: 1, y: 0, duration: ENTER_DUR, ease: "none" },
      enterAt
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      off();
    };
  }, []);

  return (
    <section
      ref={introRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/stack relative bg-cream data-[stack=on]:h-[calc(100svh+var(--travel))]"
    >
      <div className="relative flex h-svh items-center justify-center overflow-hidden group-data-[stack=on]/stack:sticky group-data-[stack=on]/stack:top-0">
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
        <Container className="relative flex flex-col items-center gap-8 py-32 text-center">
          {/* Los dos beats se centran cada uno DENTRO de esta misma caja
              (`inset-0 flex items-center justify-center`) en vez de anclarse
              los dos a `top-0`: título y subtítulo tienen alturas muy
              distintas (el título ocupa 2-3 líneas de `text-display`), así
              que anclados arriba su CENTRO visual quedaba en un punto
              distinto cada uno — la transición se sentía descentrada. Cada
              uno centrado en la misma caja comparten el mismo punto medio,
              así que el reemplazo lee como un swap en el mismo lugar. */}
          <div className="relative flex w-full flex-col items-center gap-8 group-data-[stack=on]/stack:h-[46svh] group-data-[stack=on]/stack:gap-0">
            <div className="group-data-[stack=on]/stack:absolute group-data-[stack=on]/stack:inset-0 group-data-[stack=on]/stack:flex group-data-[stack=on]/stack:items-center group-data-[stack=on]/stack:justify-center">
              <h1 data-hero-heading className="max-w-4xl text-display text-pretty">
                The Chain Disappears.
                <br />
                <Accent display>You don&apos;t.</Accent>
              </h1>
            </div>
            {/* `max-w-2xl` va en el `<p>`, NO acá — este div es el que se
                vuelve `absolute inset-0` (`left:0` Y `right:0` a la vez). Con
                un `max-width` puesto en ESE MISMO elemento y sin margen
                automático, ese trío queda sobre-restringido y el spec de CSS
                lo resuelve ignorando `right` — la caja se pega al borde
                izquierdo en vez de quedar centrada (el mismo bug no existe en
                el título de arriba porque ahí `max-w-4xl` vive en el `<h1>`,
                un hijo flex normal, no en el div que lleva `inset-0`). */}
            <div
              data-hero-item
              className="group-data-[stack=on]/stack:absolute group-data-[stack=on]/stack:inset-0 group-data-[stack=on]/stack:flex group-data-[stack=on]/stack:items-center group-data-[stack=on]/stack:justify-center"
            >
              <p className="max-w-2xl text-body-lg text-foreground/70 text-pretty">{HERO_B.sub}</p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
