"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { getGl2, buildProgram } from "@/components/primitives/motion/glContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";
import { PRISM_FRAG, PRISM_VERT } from "@/components/sections/proof-alt/shaders/prismField";

// ── 07 · Prism ───────────────────────────────────────────────────────────────
//
// La misma grilla 3×2 de la 01, pero apoyada sobre un campo de interferencia
// que corre en la GPU. Cero recorrido: 100svh, sin sticky.
//
// ── Qué aporta el shader que no aporta un fondo CSS ─────────────────────────
//
// Que las celdas se ENTERAN unas de otras. Cada celda es una fuente de ondas;
// apuntar una le sube la energía y su frente viaja hasta las vecinas, donde se
// suma o se cancela con lo que ellas estén emitiendo. Eso —interferencia— no se
// puede fingir con seis gradientes independientes: el patrón entre dos celdas
// depende de las dos a la vez.
//
// Si al mirarlo la respuesta es "esto lo hacía un box-shadow", la versión no
// vale su costo y ese es un resultado legítimo del laboratorio.
//
// ── El texto NO está en el shader ───────────────────────────────────────────
//
// A diferencia de `hero-alt/GlassHero`, acá el titular no se rasteriza: las
// cifras son DOM encima del canvas. Se seleccionan, se traducen, las lee un
// lector de pantalla y las indexa un buscador. El shader es fondo, y un fondo
// no tiene por qué costar la accesibilidad del contenido.
//
// ── Contrato de canvas del repo ─────────────────────────────────────────────
//
//   · `deviceRatio()` para el buffer — un retina a 3× cuadruplica el costo de un
//     shader a pantalla completa para una diferencia que nadie ve;
//   · `onViewportToggle` corta el ticker fuera de vista;
//   · `gsap.ticker`, nunca un `requestAnimationFrame` propio;
//   · sin WebGL2 utilizable, `getGl2` devuelve null y queda el fondo sólido del
//     host. No un agujero negro.

const N = PROOF_STATS.length;

// Centro de cada celda en la grilla 3×2, en coordenadas 0..1 del canvas, con el
// eje Y ya invertido (el 0 de `gl_FragCoord` está abajo). Es geometría del
// shader, así que vive acá y no en los datos.
const SOURCES = PROOF_STATS.map((_, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return [(col + 0.5) / 3, 1 - (row + 0.5) / 2] as const;
});

// Energía de reposo. No es cero a propósito: con el campo completamente plano
// la sección se ve como un rectángulo de color y nadie sospecha que hay algo
// que tocar.
const IDLE_AMP = 0.16;
const HOT_AMP = 1;

// Sube rápido, baja despacio — el mismo par que `flowField`, y por lo mismo:
// con release alto la celda se apaga en seco al salir el puntero y el campo se
// siente como un interruptor en vez de como agua.
const ATTACK = 0.14;
const RELEASE = 0.028;

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

// Literales y nunca `var(--token)`: un shader no resuelve custom properties, y
// leerlas por frame obligaría a un recálculo de estilo por frame.
const BG = "#101010";
const LO = "#0e4a30";
const HI = "#00dc8d";

export default function PrismField() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!section || !host || !canvas) return;

    const gl = getGl2(canvas);
    if (!gl) return; // sin WebGL2 queda el fondo del host

    const program = buildProgram(gl, PRISM_VERT, PRISM_FRAG, "prismField");
    if (!program) return;

    // Un triángulo que cubre el clip space, no dos de un quad: la mitad de
    // vértices y ninguna diagonal en el medio de la pantalla donde el
    // rasterizador pueda dejar una costura.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("u_res");
    const uTime = u("u_time");
    const uSrc = u("u_src[0]");
    const uAmp = u("u_amp[0]");

    // Los tres colores no cambian nunca: se suben UNA vez, fuera del bucle.
    gl.uniform3f(u("u_bg"), ...hexToRgb(BG));
    gl.uniform3f(u("u_lo"), ...hexToRgb(LO));
    gl.uniform3f(u("u_hi"), ...hexToRgb(HI));
    gl.uniform2fv(uSrc, new Float32Array(SOURCES.flat()));

    const amp = new Float32Array(N).fill(IDLE_AMP);
    const target = new Float32Array(N).fill(IDLE_AMP);
    const start = performance.now();

    const resize = () => {
      const dpr = deviceRatio();
      const w = Math.max(1, Math.round(host.clientWidth * dpr));
      const h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const draw = (animate: boolean) => {
      resize();

      for (let i = 0; i < N; i++) {
        const k = target[i] > amp[i] ? ATTACK : RELEASE;
        amp[i] += (target[i] - amp[i]) * k;
      }

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, animate ? (performance.now() - start) / 1000 : 0);
      gl.uniform1fv(uAmp, amp);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Solo `prefers-reduced-motion`: declarar `isDesktop` haría que cruzar
      // los 1024px destruya y reconstruya el contexto WebGL, que es de lo más
      // caro que hay en la página.
      mm.add(MQ.motion, () => {
        const tick = () => draw(true);
        let running = false;

        const gate = onViewportToggle(
          host,
          (visible) => {
            if (visible === running) return;
            running = visible;
            if (visible) gsap.ticker.add(tick);
            else gsap.ticker.remove(tick);
          },
          // Un viewport de anticipación: el primer frame de un shader incluye el
          // warm-up del pipeline, y con lead 0 ese costo cae justo cuando la
          // sección entra en pantalla.
          1
        );

        const cells = Array.from(section.querySelectorAll<HTMLElement>("[data-cell]"));
        const handlers = cells.map((cell, i) => {
          const enter = () => {
            target[i] = HOT_AMP;
          };
          const leave = () => {
            target[i] = IDLE_AMP;
          };
          cell.addEventListener("pointerenter", enter);
          cell.addEventListener("pointerleave", leave);
          cell.addEventListener("focusin", enter);
          cell.addEventListener("focusout", leave);
          return { cell, enter, leave };
        });

        return () => {
          gsap.ticker.remove(tick);
          gate.kill();
          handlers.forEach(({ cell, enter, leave }) => {
            cell.removeEventListener("pointerenter", enter);
            cell.removeEventListener("pointerleave", leave);
            cell.removeEventListener("focusin", enter);
            cell.removeEventListener("focusout", leave);
          });
        };
      });

      // Con reduced-motion: UN frame con el campo en reposo. Se ve la textura,
      // no se mueve. Apagarlo del todo dejaría un rectángulo plano, que no es
      // lo que pidió quien pidió menos movimiento.
      mm.add(MQ.reduce, () => {
        draw(false);
      });

      return () => mm.revert();
    }, section);

    // El resize no puede colgarse del ticker: fuera de vista el ticker no corre,
    // y volver con la ventana redimensionada dejaría el buffer viejo estirado
    // hasta el primer frame.
    const ro = new ResizeObserver(() => {
      resize();
      if (!window.matchMedia(MQ.motion).matches) draw(false);
    });
    ro.observe(host);

    return () => {
      ro.disconnect();
      ctx.revert();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh items-center overflow-hidden bg-ink py-20 text-cream"
    >
      {/* El canvas va detrás y el contenido encima, los dos dentro de la misma
          sección: el `absolute inset-0` del host se mide contra ella. El fondo
          sólido está en la sección y no en el host para que el "sin WebGL2" se
          vea igual que el reposo del shader. */}
      <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      <Container className="relative flex flex-col gap-12">
        <div className="flex items-baseline justify-between gap-8">
          <Eyebrow className="text-cream/40">Built to</Eyebrow>
          <p className="text-caption-mono text-cream/40">
            apuntá una celda · el campo se entera en las otras
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-cream/10 lg:grid-cols-3">
          {PROOF_STATS.map((s) => (
            <article
              key={s.id}
              data-cell
              tabIndex={0}
              // El fondo de la celda es semitransparente para que el campo se
              // vea A TRAVÉS: opaco, las celdas serían seis ventanas apagadas
              // sobre un fondo bonito, que es la versión aburrida de esto.
              className="flex flex-col gap-5 bg-ink/70 p-10 backdrop-blur-sm transition-colors focus:outline-none focus-visible:bg-ink/50 hover:bg-ink/45"
            >
              <p className="text-h4 text-cream/70">{s.eyebrow}</p>
              <p className="text-h2-serif italic">
                {s.value}
                <span className="text-near-green-accent">{s.accent}</span>
              </p>
              <p className="text-body-sm text-cream/55 text-pretty">{s.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
