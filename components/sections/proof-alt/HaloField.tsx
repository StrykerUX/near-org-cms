"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { getGl2, buildProgram } from "@/components/primitives/motion/glContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { diagonalReveal } from "@/components/sections/proof-alt/diagonalReveal";
import ProofComposition from "@/components/sections/proof-alt/ProofComposition";
import { HALO_FRAG, HALO_VERT } from "@/components/sections/proof-alt/shaders/haloField";

// ── 02 · Halo ────────────────────────────────────────────────────────────────
//
// La 01, exactamente, más UNA capa: un campo de curvas de nivel en gris casi
// blanco que deriva muy despacio detrás de la composición. La entrada es la
// misma función (`diagonalReveal`), así que lo único que se está comparando
// entre las dos versiones es esta capa.
//
// ── El fondo no puede pedir atención, y eso es un número ────────────────────
//
// Las líneas van a #ECEAE4 sobre blanco: ~4% de contraste. Es deliberadamente
// poco. Un fondo vivo detrás de seis cifras compite con ellas, y en una
// homepage el que tiene que ganar es el texto. Lo que esta capa aporta no es
// "movimiento", es PROFUNDIDAD: un blanco liso de 100svh entre una sección
// negra y una gris se lee como un hueco.
//
// Dos decisiones que sostienen eso:
//
//   · el campo se desvanece contra el borde superior e inferior, así que el
//     blanco de la sección y el de la página son el mismo blanco y no hay un
//     rectángulo pegado encima;
//   · la deriva es de ~0.014 unidades por segundo. A ojo, el campo tarda cerca
//     de un minuto en cambiar de forma reconociblemente. Si se ve moverse, está
//     mal calibrado.
//
// ── Contrato de canvas del repo ─────────────────────────────────────────────
//
//   · buffer con `deviceRatio()` — un retina a 3× cuadruplica el costo de un
//     shader a pantalla completa para una diferencia que nadie ve;
//   · `onViewportToggle` corta el ticker fuera de vista;
//   · `gsap.ticker`, nunca un `requestAnimationFrame` propio;
//   · sin WebGL2 utilizable `getGl2` devuelve null y queda el blanco liso, que
//     es exactamente la versión 01. La degradación de esta sección ES la otra
//     propuesta, lo cual dice bastante sobre cuánto está aportando la capa.

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

// Literales y nunca `var(--token)`: un shader no resuelve custom properties, y
// leerlas por frame obligaría a un recálculo de estilo por frame.
const BG = "#ffffff";
const LINE = "#eceae4";

export default function HaloField() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!section || !host || !canvas) return;

    // El canvas se OCULTA en cualquier camino de fallo, y esto no es un detalle:
    // el contexto se pide con `alpha: false`, así que un canvas montado y sin
    // pintar es un rectángulo NEGRO a pantalla completa — el peor fallback
    // posible en una sección que existe para ser blanca. Escondiéndolo, lo que
    // queda es el `bg-background` de la sección, o sea exactamente la versión 01.
    const bail = () => {
      canvas.style.display = "none";
    };

    const gl = getGl2(canvas);
    if (!gl) return bail();

    const program = buildProgram(gl, HALO_VERT, HALO_FRAG, "haloField");
    if (!program) return bail();

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

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    gl.uniform3f(gl.getUniformLocation(program, "u_bg"), ...hexToRgb(BG));
    gl.uniform3f(gl.getUniformLocation(program, "u_line"), ...hexToRgb(LINE));

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
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, animate ? (performance.now() - start) / 1000 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Solo `prefers-reduced-motion` y `matchMedia` directo: declarar
      // `isDesktop` como condición haría que cruzar los 1024px destruya y
      // reconstruya el contexto WebGL, que es de lo más caro que hay acá.
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
          // sección entra en pantalla — o sea encima de la entrada en diagonal.
          1
        );

        return () => {
          gsap.ticker.remove(tick);
          gate.kill();
        };
      });

      // Con reduced-motion: UN frame, el campo quieto. Se ve la textura, no se
      // mueve. Es exactamente lo que pidió quien pidió menos movimiento, y no
      // "nada", que dejaría un rectángulo blanco.
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

  // La entrada va en su propio contexto de motion, separada del efecto del
  // canvas: son dos ciclos de vida distintos —uno depende del breakpoint, el
  // otro no— y mezclarlos obligaría a reconstruir el contexto WebGL cada vez
  // que se cruzan los 1024px.
  const revealRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;
    const blocks = q("[data-block]");
    if (blocks.length === 0) return;
    const reveal = diagonalReveal(scope, blocks);
    return () => reveal.kill();
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh items-center overflow-hidden bg-background py-24 text-ink"
    >
      <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {/* `relative` para que la composición quede sobre el canvas sin necesidad
          de z-index: en el mismo contexto de apilamiento, un elemento posicionado
          gana a uno que no lo está. */}
      <div ref={revealRef} className="relative w-full">
        <ProofComposition />
      </div>
    </section>
  );
}
