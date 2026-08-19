"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { hermiteRamp } from "@/components/primitives/motion/velocityRamp";

// El motor de la versión 05 · Lattice. Canvas 2D, sin WebGL y sin DOM animado.
//
// ── De dónde salen las posiciones del texto ─────────────────────────────────
//
// No están escritas en ningún lado: se MUESTREAN del propio titular. Se dibuja
// el texto en un canvas fuera de pantalla, se lee su `ImageData`, y cada píxel
// con alfa por encima del umbral es un destino candidato. Eso significa que
// cambiar la copy cambia la escena sola, y que la nube respeta la forma real de
// los glifos —incluidos los remates y la itálica— sin que nadie la describa.
//
// El muestreo va con paso fijo y no con "elegir N al azar": el paso da una
// densidad uniforme, y el azar deja huecos y grumos que se ven como suciedad.
//
// ── Por qué canvas 2D y no WebGL ────────────────────────────────────────────
//
// Son ~2000 puntos de 2px. Un `fillRect` por punto es una llamada barata y el
// navegador la batchea; montar un pipeline de instancias en WebGL para esto
// sería más código, más superficie de fallo y ninguna diferencia visible. La
// versión 02 usa WebGL porque necesita evaluar un campo POR PÍXEL; esta no.

export type LatticeTarget = "text" | "bars";

// Qué conduce el colapso de la nube.
//
//   · "intro"  — una timeline que corre al montar. Es lo que necesita un HERO:
//     quien llega no ha tocado la rueda todavía, así que un gesto atado al
//     scroll no existe para él. La primera versión de esta escena era "scroll"
//     y por eso se veía vacía.
//   · "scroll" — el progreso de la sección cruzando el viewport. Correcto para
//     una sección a la que se LLEGA scrolleando, que ya tiene al lector
//     empujando.
export type LatticeDrive = "intro" | "scroll";

// Timing de la intro, exportado porque el hero necesita sincronizar su titular
// contra él. Dos timelines con las mismas constantes copiadas a mano se
// desincronizan en el primer ajuste; con una sola fuente, mover el aterrizaje
// mueve las dos cosas.
export const LATTICE_INTRO = {
  /** Cuánto dura el colapso, en segundos. */
  duration: 1.7,
  /** En qué segundo la nube ya está sobre los glifos. */
  settle: 1.45,
} as const;

export type LatticeCanvasProps = {
  /** Las líneas del titular a muestrear. Vacío para el modo "bars". */
  lines?: readonly string[];
  /** Adónde van los puntos: a la silueta del texto, o a las columnas. */
  target?: LatticeTarget;
  /** Qué conduce el colapso. */
  drive?: LatticeDrive;
  /** Alto de la tipografía como fracción del alto del host. */
  fontScale?: number;
  /** Color de los puntos, literal. */
  dot: string;
  /** Cuántas columnas forma el modo "bars". */
  cols?: number;
};

// Paso del muestreo, en px del buffer. 5 da ~2000 puntos en un titular de
// display a 1440; 3 da 5500 y ya se ve como texto sólido en vez de como nube,
// que es justo lo que la versión no quiere.
const SAMPLE_STEP = 5;

// Techo duro de puntos. No es una optimización: sin él, una ventana 4K con la
// fuente muy grande genera decenas de miles y el ticker empieza a perder
// frames en el peor momento posible, que es durante el gesto.
const MAX_DOTS = 2600;

// La rampa con que cada punto viaja a su destino. Entrada rápida y aterrizaje
// muy lento: los puntos salen todos juntos y llegan escalonados, que es lo que
// hace que la palabra se "revele" en vez de aparecer de golpe.
const TRAVEL = hermiteRamp(2.6, 0.22);

type Dot = {
  // Origen: dónde está el punto cuando el progreso es 0.
  ox: number;
  oy: number;
  // Destino: dónde está cuando es 1.
  tx: number;
  ty: number;
  // Retardo propio, 0..1. Sembrado, no aleatorio.
  lag: number;
};

export default function LatticeCanvas({
  lines = [],
  target = "text",
  drive = "scroll",
  fontScale = 0.19,
  dot,
  cols = 7,
}: LatticeCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    let dots: Dot[] = [];
    // 0 = retícula dispersa · 1 = nube sobre los glifos.
    let progress = 0;
    // 0 = la nube está donde la dejó `progress` · 1 = ya cayó del todo.
    // Solo lo usa el modo "intro": es la salida del hero, y va por scroll
    // aunque la entrada haya ido por timeline.
    let exit = 0;

    // ── Construcción de la nube ──────────────────────────────────────────────
    const build = (w: number, h: number) => {
      const rand = createSeededRandom();
      const next: Dot[] = [];

      if (target === "text" && lines.length > 0) {
        // Canvas fuera de pantalla solo para leer píxeles. No se muestra nunca.
        const off = document.createElement("canvas");
        off.width = w;
        off.height = h;
        const octx = off.getContext("2d", { willReadFrequently: true });
        if (!octx) return;

        const style = getComputedStyle(host);
        const size = h * fontScale;
        octx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.fillStyle = "#fff";
        const lh = size * 1.05;
        const top = h / 2 - ((lines.length - 1) * lh) / 2;
        lines.forEach((line, i) => octx.fillText(line, w / 2, top + i * lh));

        const data = octx.getImageData(0, 0, w, h).data;
        const found: [number, number][] = [];
        for (let y = 0; y < h; y += SAMPLE_STEP) {
          for (let x = 0; x < w; x += SAMPLE_STEP) {
            // Solo el canal alfa. El umbral en 128 y no en 0: el antialiasing
            // de los bordes deja una orla de alfas bajos que, muestreada,
            // engorda cada glifo con una sombra de puntos sueltos.
            if (data[(y * w + x) * 4 + 3] > 128) found.push([x, y]);
          }
        }

        // Diezmado uniforme si hay de más. `step` fraccionario e índice
        // acumulado: quedarse con los primeros N recortaría el titular por
        // abajo, porque el barrido va de arriba hacia abajo.
        const step = Math.max(1, found.length / MAX_DOTS);
        for (let i = 0; i < found.length; i += step) {
          const [tx, ty] = found[Math.floor(i)];
          next.push({
            // Origen: una retícula regular con jitter sembrado. La retícula es
            // lo que se ve antes de que el gesto empiece, y tiene que leerse
            // como retícula — de ahí que el jitter sea chico.
            ox: (Math.floor(rand() * 60) / 60) * w + (rand() - 0.5) * 14,
            oy: (Math.floor(rand() * 34) / 34) * h + (rand() - 0.5) * 14,
            tx,
            ty,
            lag: rand(),
          });
        }
      } else {
        // Modo "bars": el destino es una columna, y dentro de ella una altura
        // que sale de la silueta en V invertida — la misma de la versión 01, y
        // por la misma razón: el centro despejado es donde va el texto.
        const colW = w / cols;
        for (let i = 0; i < MAX_DOTS; i++) {
          const col = Math.floor(rand() * cols);
          const fromCenter = Math.abs(col - (cols - 1) / 2) / ((cols - 1) / 2);
          const barTop = h * (1 - (0.16 + 0.6 * fromCenter * fromCenter));
          next.push({
            ox: rand() * w,
            oy: rand() * h * 0.5,
            tx: col * colW + rand() * colW,
            ty: barTop + rand() * (h - barTop),
            lag: rand(),
          });
        }
      }

      dots = next;
    };

    const resize = () => {
      const dpr = deviceRatio();
      const w = Math.max(1, Math.round(host.clientWidth * dpr));
      const h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      build(w, h);
    };

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx2d.clearRect(0, 0, w, h);
      ctx2d.fillStyle = dot;

      // El tamaño del punto sube con el dpr para que no desaparezca en retina.
      const s = Math.max(1.5, deviceRatio());

      for (const d of dots) {
        // El retardo consume el primer 35% del recorrido: cada punto arranca
        // cuando el progreso pasa SU lag, y usa el resto para viajar.
        const t = TRAVEL(gsap.utils.clamp(0, 1, (progress - d.lag * 0.35) / 0.65));

        // La salida: los puntos caen y se apagan. La distancia depende del lag,
        // así que la nube se deshilacha en vez de bajar como un bloque.
        const fall = exit * h * (0.35 + 0.65 * d.lag);

        ctx2d.globalAlpha = 1 - exit;
        ctx2d.fillRect(
          d.ox + (d.tx - d.ox) * t,
          d.oy + (d.ty - d.oy) * t + fall,
          s,
          s
        );
      }
      // El alfa es estado del contexto y sobrevive al frame: sin resetearlo, un
      // `exit` alto deja el canvas atenuado para siempre en cuanto el ticker se
      // corta a mitad del gesto.
      ctx2d.globalAlpha = 1;
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const tick = () => draw();
        let running = false;

        const gate = onViewportToggle(
          host,
          (visible) => {
            if (visible === running) return;
            running = visible;
            if (visible) gsap.ticker.add(tick);
            else gsap.ticker.remove(tick);
          },
          1
        );

        // Los ScrollTrigger solo LEEN — sin scrub, sin pin. El dibujo lo hace
        // el ticker, así que un scrub acá sería un segundo reloj para lo mismo.
        const triggers: ScrollTrigger[] = [];
        let intro: gsap.core.Tween | null = null;

        if (drive === "intro") {
          // Entrada por timeline: la nube colapsa al montar, sin esperar a que
          // nadie scrollee. El objeto animado es un proxy — el canvas no tiene
          // propiedades que GSAP pueda tocar.
          const proxy = { p: 0 };
          intro = gsap.to(proxy, {
            p: 1,
            duration: LATTICE_INTRO.duration,
            ease: "power2.inOut",
            onUpdate: () => {
              progress = proxy.p;
            },
          });

          // Y salida por scroll: el hero saliendo de cuadro deshace la nube.
          // `start: "top top"` y no "top bottom" — el recorrido tiene que ser
          // el hero SALIENDO, no el hero existiendo. Ese era el error de la
          // versión anterior: con "top bottom", al cargar el trigger ya iba por
          // la mitad y la nube nacía formada.
          triggers.push(
            ScrollTrigger.create({
              trigger: host,
              start: "top top",
              end: "bottom top",
              onUpdate: (self) => {
                exit = self.progress;
              },
            })
          );
        } else {
          triggers.push(
            ScrollTrigger.create({
              trigger: host,
              start: "top bottom",
              end: "center center",
              onUpdate: (self) => {
                progress = self.progress;
              },
            })
          );
        }

        return () => {
          gsap.ticker.remove(tick);
          intro?.kill();
          triggers.forEach((t) => t.kill());
          gate.kill();
        };
      });

      // Con reduced-motion la figura se pinta YA FORMADA. Es la degradación
      // correcta: lo que el gesto tenía para decir es la forma final, y esa se
      // puede entregar sin mover un píxel.
      mm.add(MQ.reduce, () => {
        progress = 1;
        draw();
      });

      return () => mm.revert();
    }, host);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(host);

    // La nube se reconstruye cuando llega la fuente real: muestreada contra la
    // fuente de sistema, la silueta es la de OTRA tipografía y no se corrige
    // sola hasta el próximo resize.
    document.fonts.ready.then(() => {
      if (canvas.width > 0) {
        build(canvas.width, canvas.height);
        draw();
      }
    });

    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, [lines, target, drive, fontScale, dot, cols]);

  return (
    <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
