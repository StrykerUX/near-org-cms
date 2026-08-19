"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { getGl2, buildProgram } from "@/components/primitives/motion/glContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { subscribePointer } from "@/components/primitives/motion/pointer";
import { GLASS_FRAG, GLASS_VERT } from "@/components/sections/hero-alt/shaders/glass";

// El motor de la versión 04 · Glass, montado por las dos secciones del par.
//
// ── Por qué el texto se rasteriza y no va en el DOM ─────────────────────────
//
// Un shader no puede leer el DOM. Para que el titular se DOBLE con el vidrio
// —y no simplemente flote encima de un fondo que se dobla— tiene que estar
// dentro de la misma imagen que el shader muestrea. Así que se dibuja en un
// canvas 2D fuera de pantalla y se sube como textura.
//
// El precio hay que decirlo entero: **este texto no es texto**. No se
// selecciona, no se traduce, no lo lee un lector de pantalla y no lo indexa
// nadie. Por eso el JSX monta igual el titular real como `sr-only` — el DOM
// tiene la versión accesible, el canvas la versión que se ve. Es el mismo trato
// que hace `glyphShine` en el repo, y la razón por la que esta versión es la
// más cara de las cinco en algo que no es rendimiento.
//
// La familia y el peso NO se hardcodean: se leen del `computedStyle` del host,
// que hereda del design system. Hardcodear "Montreal" acá sería una segunda
// fuente para la tipografía, y se rompería en silencio el día que el DS cambie
// de familia — con el canvas cayendo a Helvetica sin que nada avise.

export type GlassCanvasProps = {
  /** Las líneas del texto a rasterizar, ya partidas. Una por renglón. */
  lines: readonly string[];
  /** Alto de la tipografía como fracción del alto del host. */
  fontScale?: number;
  /** 0 = lámina continua. >0 = columnas con refracción independiente. */
  cols?: number;
  /** Fuerza de la refracción. */
  ior?: number;
  /** `[fondo arriba, fondo abajo, tinta del texto]`, en hex. */
  palette: readonly [string, string, string];
  fallback: string;
};

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

// Suavizado del puntero por frame. Bajo: el vidrio tiene inercia, y un lente
// que sigue al mouse frame a frame se siente liviano, como una capa de CSS.
const POINTER_EASE = 0.08;

// ── Techo de resolución, y por qué es más bajo que el del resto ─────────────
//
// El default del toolkit es 2. Acá se baja a 1.25 y no es una concesión: este
// shader hace CUATRO muestreos de textura y una gaussiana por píxel, a pantalla
// completa, y la página monta dos instancias que se solapan al scrollear. A dpr
// 2 en un portátil retina eso son ~16M de invocaciones por frame entre las dos.
//
// Lo que se pierde a 1.25 es nitidez en el borde de los glifos — y el borde de
// los glifos acá está DELIBERADAMENTE distorsionado y con aberración cromática.
// Es el único efecto de los cinco donde bajar la resolución casi no se ve.
const GLASS_MAX_DPR = 1.25;

// Anticipación del gate de viewport, en viewports. Menor que el 1 del resto por
// lo mismo: con 1, las dos instancias de esta sección arrancan a dibujar un
// viewport antes de entrar y pasan un tramo largo corriendo las dos a la vez.
// Con 0.35 el warm-up del pipeline sigue llegando a tiempo y el solapamiento se
// reduce a la zona donde de verdad se ven las dos.
const GLASS_LEAD = 0.35;

export default function GlassCanvas({
  lines,
  fontScale = 0.17,
  cols = 0,
  ior = 1,
  palette,
  fallback,
}: GlassCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = getGl2(canvas);
    if (!gl) return;

    const program = buildProgram(gl, GLASS_VERT, GLASS_FRAG, "glass");
    if (!program) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const u = (n: string) => gl.getUniformLocation(program, n);
    const uRes = u("u_res");
    const uTime = u("u_time");
    const uPointer = u("u_pointer");
    const uScroll = u("u_scroll");
    const uIor = u("u_ior");
    const uCols = u("u_cols");
    const uBg0 = u("u_bg0");
    const uBg1 = u("u_bg1");
    const uInk = u("u_ink");

    // ── La textura del texto ─────────────────────────────────────────────────
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // CLAMP_TO_EDGE en los dos ejes: el offset de refracción empuja la
    // coordenada fuera de 0..1 en los bordes, y con REPEAT el texto reaparecería
    // dado vuelta del otro lado de la pantalla.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(u("u_text"), 0);

    const textCanvas = document.createElement("canvas");
    const text2d = textCanvas.getContext("2d");

    const paintText = (w: number, h: number) => {
      if (!text2d) return;
      textCanvas.width = w;
      textCanvas.height = h;
      text2d.clearRect(0, 0, w, h);

      const style = getComputedStyle(host);
      const size = h * fontScale;
      // El peso sale del computed del host y no de un literal: el token de
      // display del DS lo define, y este canvas tiene que seguirlo.
      text2d.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
      text2d.textAlign = "center";
      text2d.textBaseline = "middle";
      // Blanco pleno: lo único que el shader lee es el canal ALFA. El color de
      // la tinta lo pone el uniform, así que pintar acá el color real sería
      // decidir dos veces lo mismo.
      text2d.fillStyle = "#fff";

      // Interlineado de 1.05, el del token de display. Va como literal porque
      // `line-height` de un computedStyle puede venir como "normal", que no es
      // un número y no se puede multiplicar.
      const lh = size * 1.05;
      const top = h / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((line, i) => text2d.fillText(line, w / 2, top + i * lh));

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    };

    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let scroll = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = deviceRatio(GLASS_MAX_DPR);
      const w = Math.max(1, Math.round(host.clientWidth * dpr));
      const h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return false;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      // La textura se repinta con el canvas: su resolución es la del buffer, o
      // el texto sale pixelado al agrandar la ventana.
      paintText(w, h);
      return true;
    };

    const draw = (animate: boolean) => {
      resize();
      if (animate) {
        pointerX += (targetX - pointerX) * POINTER_EASE;
        pointerY += (targetY - pointerY) * POINTER_EASE;
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, animate ? (performance.now() - start) / 1000 : 0);
      gl.uniform2f(uPointer, pointerX, pointerY);
      gl.uniform1f(uScroll, scroll);
      gl.uniform1f(uIor, ior);
      gl.uniform1f(uCols, cols);
      gl.uniform3f(uBg0, ...hexToRgb(palette[0]));
      gl.uniform3f(uBg1, ...hexToRgb(palette[1]));
      gl.uniform3f(uInk, ...hexToRgb(palette[2]));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // El texto se repinta cuando la fuente real llega. Sin esto, el primer
    // paint rasteriza con la fuente de sistema y esa imagen se queda hasta el
    // próximo resize — un titular en Helvetica que nadie entiende de dónde sale.
    document.fonts.ready.then(() => {
      if (canvas.width > 0) paintText(canvas.width, canvas.height);
    });

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
          GLASS_LEAD
        );

        // El puntero llega por el listener global compartido del toolkit, no por
        // uno propio: con dos instancias de esta sección en la misma página
        // serían dos listeners de mousemove haciendo el mismo trabajo.
        const stopPointer = subscribePointer((x, y) => {
          targetX = x / window.innerWidth;
          targetY = y / window.innerHeight;
        });

        // El progreso de la sección alimenta `u_scroll`, que aplana el vidrio
        // hacia el final. Solo LEE — sin scrub, sin pin.
        const st = ScrollTrigger.create({
          trigger: host,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            scroll = self.progress;
          },
        });

        return () => {
          gsap.ticker.remove(tick);
          stopPointer();
          st.kill();
          gate.kill();
        };
      });

      // Con reduced-motion: un frame, con el puntero en el centro y el vidrio
      // en reposo. El titular se ve, refractado y quieto.
      mm.add(MQ.reduce, () => {
        draw(false);
      });

      return () => mm.revert();
    }, host);

    const ro = new ResizeObserver(() => {
      resize();
      if (!window.matchMedia(MQ.motion).matches) draw(false);
    });
    ro.observe(host);

    return () => {
      ro.disconnect();
      ctx.revert();
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [lines, fontScale, cols, ior, palette, fallback]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: fallback }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
