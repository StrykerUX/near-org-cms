"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { getGl2, buildProgram } from "@/components/primitives/motion/glContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { EX_ASCII_FRAG, EX_ASCII_VERT } from "@/components/sections/ex/shaders/exAscii";

// ── C · ASCII ────────────────────────────────────────────────────────────────
//
// La página se vuelve texto. Un campo de caracteres arranca casi invisible
// sobre el cream y, al scrollear, se DENSIFICA desde el centro mientras la
// paleta entera rueda a negro con los glifos en verde. Lo que le entrega al
// stack no es un telón: ya es su propio fondo.
//
// ── El shader se importa, no se copia ───────────────────────────────────────
//
// Es el de EX3 (`ex/shaders/exAscii`) sin tocar una línea. Lo único que cambia
// acá es CÓMO se alimentan sus uniformes: allá el bulbo de densidad lo mueve el
// cursor y la paleta es fija; acá el bulbo está clavado en el centro y lo abre
// el SCROLL, y los tres colores se interpolan por progreso.
//
// Que el mismo shader sirva a las dos cosas no es casualidad: el campo nunca
// supo qué lo estaba empujando.
//
// ── Por qué la paleta se interpola en CPU ───────────────────────────────────
//
// Son tres `uniform3f` por frame contra pasar un cuarto uniforme y hacer tres
// `mix` por PÍXEL. A 1440×900 eso son 1.3M de mezclas por frame para calcular
// tres colores que son iguales en toda la pantalla.

// ── La transición SOLAPA la sección de arriba ───────────────────────────────
//
// `-mt-[100svh]` y `z-[2]`: el tramo empieza una pantalla ANTES de donde
// terminaría la sección anterior, así que el gesto ocurre encima de ella —
// todavía con las cards en pantalla— y no sobre un rectángulo vacío.
//
// Sin eso, el primer viewport del tramo es una pantalla de cream con nada, el
// gesto arranca recién después, y lo que se lee no es una transición: es una
// pausa y después un efecto. El coste real en scroll es también menor: el
// recorrido menos la pantalla que solapa.

const TRAVEL = "200svh";

// Misma rampa y misma celda que EX3: el campo tiene que ser reconociblemente el
// mismo material, no un primo.
const RAMP = " .:-=+*#%@";
const CELL = 14;

// Los dos extremos del viaje. El de salida es el fondo de la sección de arriba
// y el de llegada el de la de abajo — la transición no inventa colores, los
// interpola entre lo que ya hay.
const FROM = { bg: "#f5f4f1", ink: "#dedcd6", accent: "#bfe6cf" };
const TO = { bg: "#101010", ink: "#2a3a30", accent: "#8bf29c" };

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

const mix3 = (a: [number, number, number], b: [number, number, number], t: number) =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] as const;

export default function TransAscii() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!host || !canvas || !section) return;

    const bail = () => {
      canvas.style.display = "none";
    };

    const gl = getGl2(canvas);
    if (!gl) return bail();
    const program = buildProgram(gl, EX_ASCII_VERT, EX_ASCII_FRAG, "transAscii");
    if (!program) return bail();

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    // El atlas: una tira con un carácter por casilla, del más vacío al más
    // denso. Se dibuja a 4× y el muestreo lo reduce — a 1× los remates caen
    // entre píxeles y la rampa deja de leerse como progresión de densidad.
    const SS = 4;
    const cellPx = CELL * SS;
    const atlas = document.createElement("canvas");
    atlas.width = cellPx * RAMP.length;
    atlas.height = cellPx;
    const actx = atlas.getContext("2d");
    if (!actx) return bail();
    actx.font = `${Math.round(cellPx * 0.82)}px ui-monospace, Menlo, monospace`;
    actx.textAlign = "center";
    actx.textBaseline = "middle";
    actx.fillStyle = "#fff";
    for (let i = 0; i < RAMP.length; i++) {
      actx.fillText(RAMP[i], i * cellPx + cellPx / 2, cellPx / 2);
    }

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uPointerOn = gl.getUniformLocation(program, "u_pointerOn");
    const uBg = gl.getUniformLocation(program, "u_bg");
    const uInk = gl.getUniformLocation(program, "u_ink");
    const uAccent = gl.getUniformLocation(program, "u_accent");
    gl.uniform1f(gl.getUniformLocation(program, "u_glyphs"), RAMP.length);
    gl.uniform1i(gl.getUniformLocation(program, "u_atlas"), 0);

    const FROM_RGB = { bg: hexToRgb(FROM.bg), ink: hexToRgb(FROM.ink), accent: hexToRgb(FROM.accent) };
    const TO_RGB = { bg: hexToRgb(TO.bg), ink: hexToRgb(TO.ink), accent: hexToRgb(TO.accent) };

    const start = performance.now();
    let progress = 0;

    const resize = () => {
      const dpr = deviceRatio();
      const w = Math.max(1, Math.round(host.clientWidth * dpr));
      const h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform1f(gl.getUniformLocation(program, "u_cell"), CELL * dpr);
    };

    const draw = (animate: boolean) => {
      resize();
      const p = progress;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, animate ? (performance.now() - start) / 1000 : 0);
      // El bulbo vive en el centro exacto de la pantalla y lo abre el scroll:
      // el campo se densifica desde el medio hacia los bordes.
      gl.uniform2f(uPointer, canvas.width / 2, canvas.height / 2);
      gl.uniform1f(uPointerOn, p);
      gl.uniform3f(uBg, ...mix3(FROM_RGB.bg, TO_RGB.bg, p));
      // La tinta llega a su destino ANTES que el fondo (p·1.4): si los dos
      // rodaran a la vez, en la mitad del viaje los glifos y el fondo tendrían
      // casi el mismo valor y el campo desaparecería justo en el medio.
      gl.uniform3f(uInk, ...mix3(FROM_RGB.ink, TO_RGB.ink, Math.min(1, p * 1.4)));
      gl.uniform3f(uAccent, ...mix3(FROM_RGB.accent, TO_RGB.accent, p));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

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
          1
        );

        const t = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          // Igual que el wipe: termina de rodar a negro antes del último tramo,
          // así el lector llega al stack con el fondo ya puesto.
          onUpdate: (self) => {
            const p = self.progress;
            progress = Math.min(1, p / 0.85);
            canvas.style.opacity = `${Math.min(1, p / 0.14)}`;
          },
        });

        return () => {
          gsap.ticker.remove(tick);
          gate.kill();
          t.kill();
        };
      });

      // Sin motion: el campo se pinta ya llegado. Lo que el gesto tenía para
      // decir es el fondo final, y ese se entrega sin mover un píxel.
      mm.add(MQ.reduce, () => {
        progress = 1;
        canvas.style.opacity = "1";
        draw(false);
      });

      return () => mm.revert();
    }, host);

    const ro = new ResizeObserver(() => draw(false));
    ro.observe(host);

    return () => {
      ro.disconnect();
      ctx.revert();
      gl.deleteTexture(tex);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="relative z-[2] -mt-[100svh] h-[var(--travel)] bg-transparent"
    >
      <div ref={hostRef} className="sticky top-0 h-svh overflow-hidden">
        {/* El campo es opaco (su fondo lo pinta el shader), así que entra por
            opacidad: aparece SOBRE lo que había, en vez de cortarlo. */}
        <canvas ref={canvasRef} aria-hidden="true" className="block size-full opacity-0" />
      </div>
    </section>
  );
}
