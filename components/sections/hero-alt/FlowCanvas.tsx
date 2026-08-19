"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { getGl2, buildProgram } from "@/components/primitives/motion/glContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { FLOW_FRAG, FLOW_VERT } from "@/components/sections/hero-alt/shaders/flowField";

// El motor de la versión 02 · Flow. Lo montan las DOS secciones del par, con la
// única diferencia de `cols`.
//
// Que sea un solo motor no es ahorro de código, es la idea de la versión: la
// segunda sección no imita al hero con barras parecidas — es el MISMO campo,
// muestreado a siete columnas en vez de a cada píxel. Dos shaders distintos que
// se parecen serían otra cosa, y se notaría en cuanto uno de los dos cambiara.
//
// ── Lo que este archivo cumple del contrato de canvas del repo ──────────────
//
//   · el buffer se dimensiona con `deviceRatio()`, no con `devicePixelRatio`
//     crudo (un retina a 3× cuadruplica el costo de un shader de pantalla
//     completa para una diferencia que nadie ve);
//   · no dibuja fuera de vista — `onViewportToggle()` corta el ticker;
//   · se cuelga de `gsap.ticker`, NUNCA de un `requestAnimationFrame` propio:
//     dos relojes en la misma página se desincronizan y el `lagSmoothing(0)`
//     que `gsapClient` configura no alcanzaría al de acá;
//   · si no hay WebGL2 utilizable, `getGl2` devuelve null y lo que queda es el
//     gradiente CSS de `fallback`. No un rectángulo negro.

export type FlowCanvasProps = {
  /** 0 = campo continuo. >0 = muestreado a esa cantidad de columnas. */
  cols?: number;
  /** Recorte inferior del campo, 0..1. Más alto = más fondo limpio. */
  floor?: number;
  /** `[fondo, valle, medio, cresta]`, en hex. Literales, nunca `var(--token)`. */
  palette: readonly [string, string, string, string];
  /** Gradiente CSS que se ve mientras el shader no está, o si nunca llega. */
  fallback: string;
  className?: string;
};

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

// Cuánta fase acumula el campo por píxel de scroll. Calibrado para que un
// viewport de scroll mueva el campo aproximadamente un ciclo de su octava más
// grande: menos y el campo parece quieto, más y se lee como ruido hirviendo.
const FLOW_PER_PX = 0.0016;

// Suavizado de la energía, por frame. Bajo a propósito: la energía tiene que
// SUBIR rápido cuando el lector empuja y bajar despacio cuando suelta, para que
// el campo se apague como una inercia y no como un interruptor.
const ENERGY_ATTACK = 0.18;
const ENERGY_RELEASE = 0.035;

// Velocidad de scroll, en px/frame, que se considera energía máxima.
const ENERGY_FULL = 55;

export default function FlowCanvas({
  cols = 0,
  floor = 0.34,
  palette,
  fallback,
  className,
}: FlowCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = getGl2(canvas);
    if (!gl) return; // sin WebGL2: se queda el gradiente de `fallback`

    const program = buildProgram(gl, FLOW_VERT, FLOW_FRAG, "flowField");
    if (!program) return;

    // Un triángulo que cubre el viewport de clip, no dos triángulos de un quad:
    // la mitad de vértices y ninguna arista diagonal en el medio de la pantalla
    // donde el rasterizador pueda dejar una costura.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("u_res");
    const uFlow = u("u_flow");
    const uTime = u("u_time");
    const uEnergy = u("u_energy");
    const uCols = u("u_cols");
    const uFloor = u("u_floor");
    const uBg = u("u_bg");
    const uC0 = u("u_c0");
    const uC1 = u("u_c1");
    const uC2 = u("u_c2");

    let flow = 0;
    let energy = 0;
    let lastY = window.scrollY;
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

      if (animate) {
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;

        // La fase integra el VALOR ABSOLUTO: el campo avanza scrollees para
        // donde scrollees. Con el signo, subir desandaría el gesto y el hero se
        // sentiría como un scrubber de video — que es exactamente lo que esta
        // versión existe para no ser.
        flow += Math.abs(delta) * FLOW_PER_PX;

        const target = Math.min(1, Math.abs(delta) / ENERGY_FULL);
        const k = target > energy ? ENERGY_ATTACK : ENERGY_RELEASE;
        energy += (target - energy) * k;
      }

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uFlow, flow);
      gl.uniform1f(uTime, animate ? (performance.now() - start) / 1000 : 0);
      gl.uniform1f(uEnergy, energy);
      gl.uniform1f(uCols, cols);
      gl.uniform1f(uFloor, floor);
      gl.uniform3f(uBg, ...hexToRgb(palette[0]));
      gl.uniform3f(uC0, ...hexToRgb(palette[1]));
      gl.uniform3f(uC1, ...hexToRgb(palette[2]));
      gl.uniform3f(uC2, ...hexToRgb(palette[3]));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Solo `prefers-reduced-motion`, y por eso `matchMedia` directo en vez de
      // `useMotionScope`: declarar `isDesktop` como condición haría que cruzar
      // los 1024px destruya y reconstruya el contexto WebGL, que es de lo más
      // caro que hay en la página.
      mm.add(MQ.motion, () => {
        const tick = () => draw(true);
        let running = false;

        // Devuelve el ScrollTrigger que crea, no un apagador. Lo revierte el
        // `mm.revert()` del contexto, igual que al resto del scope; se mata
        // explícito de todas formas para que el orden con el `ticker.remove`
        // quede a la vista y no dependa de en qué orden GSAP revierta.
        const gate = onViewportToggle(
          host,
          (visible) => {
            if (visible === running) return;
            running = visible;
            if (visible) gsap.ticker.add(tick);
            else gsap.ticker.remove(tick);
          },
          // Un viewport de anticipación: el primer frame de un shader incluye
          // el warm-up del pipeline, y con `lead: 0` ese costo cae justo cuando
          // la sección entra en pantalla.
          1
        );

        return () => {
          gsap.ticker.remove(tick);
          gate.kill();
        };
      });

      // Con reduced-motion: UN frame y nada más. El campo se ve, no se mueve.
      // Es la degradación correcta — apagarlo del todo dejaría una sección
      // vacía, que no es lo que el usuario pidió al pedir menos movimiento.
      mm.add(MQ.reduce, () => {
        draw(false);
      });

      return () => mm.revert();
    }, host);

    // El resize del canvas no puede colgarse del ticker: fuera de vista el
    // ticker no corre, y volver con la ventana redimensionada dejaría un buffer
    // del tamaño viejo estirado hasta el primer frame.
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
  }, [cols, floor, palette, fallback]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      // El gradiente va en el HOST y el canvas encima: si el shader no llega
      // —sin WebGL2, contexto perdido, o simplemente todavía no— lo que se ve es
      // esto y no un agujero.
      style={{ backgroundImage: fallback }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
