"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { buildProgram, getGl2 } from "@/components/primitives/motion/glContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { MURAL_FRAG, MURAL_VERT } from "./gl/muralShader";
import { rampGradient, type MuralLine } from "./muralContent";

// El overlay WebGL de una palabra del mural.
//
// ── Por qué es un overlay y no un reemplazo ────────────────────────────────
//
// El layout lo sigue haciendo el DOM: este canvas se monta ENCIMA de la palabra
// real, tomando su caja exacta, y la palabra queda debajo con `opacity: 0`.
//
// Eso conserva tres cosas que un canvas suelto perdería: el texto en el árbol
// de accesibilidad —sigue siendo un nodo de texto, seleccionable por el lector
// de pantalla—, el flujo (la caja sigue midiendo lo que mide la tipografía, así
// que el bloque no colapsa) y el layout fluido con `cqw`, que ningún canvas
// sabría replicar.
//
// El precio, entero y sin adornos: **ese texto ya no es texto en pantalla.** No
// se selecciona con el mouse, no se traduce y no lo encuentra el buscador del
// navegador. Es el mismo trato que `hero-alt` documenta para sus versiones 04 y
// 05, y por eso solo tres de las catorce lo pagan.
//
// ── La textura ya trae el degradado ────────────────────────────────────────
//
// El canvas 2D pinta el texto con el MISMO `linear-gradient` que usa el DOM
// (`rampGradient`), traducido a `createLinearGradient`. El shader entonces solo
// desplaza y mezcla: no re-implementa la rampa en GLSL, que sería una segunda
// fuente para el color y divergiría del diseño en cuanto alguien tocara una
// parada.
//
// ── Degradación ────────────────────────────────────────────────────────────
//
// Sin WebGL2 —`getGl2` devuelve `null`— el canvas no se monta y la palabra del
// DOM se queda visible: se pierde el efecto, no el contenido. Lo mismo con
// `prefers-reduced-motion`.

export type MuralGlEffect = "flare" | "ripple" | "melt";

const MODE: Record<MuralGlEffect, number> = { flare: 0, ripple: 1, melt: 2 };

/** El `--bar` del DS, en 0..1, que es el fondo con el que el shader mezcla. */
const BG = [0xd9 / 255, 0xd9 / 255, 0xd9 / 255] as const;

export default function MuralGl({
  line,
  effect,
  /** 0..1. La variante lo conduce: con timeline propia o con el scroll. */
  progress,
  /** 0..1. Solo lo usa `ripple`. */
  velocity,
  /** El elemento cuya caja copia el canvas. */
  hostRef,
}: {
  line: MuralLine;
  effect: MuralGlEffect;
  progress: React.RefObject<{ value: number }>;
  velocity?: React.RefObject<{ value: number }>;
  hostRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    if (!window.matchMedia(MQ.motion).matches) return;

    const gl = getGl2(canvas);
    if (!gl) return;

    const program = buildProgram(gl, MURAL_VERT, MURAL_FRAG, `mural:${effect}`);
    if (!program) return;

    // Un triángulo que cubre el viewport, no un quad: dos triángulos comparten
    // una diagonal y algunos drivers muestran una costura de un píxel ahí.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const u = (n: string) => gl.getUniformLocation(program, n);
    const uRes = u("u_res");
    const uP = u("u_p");
    const uVel = u("u_vel");
    const uTime = u("u_time");
    gl.uniform1i(u("u_mode"), MODE[effect]);
    gl.uniform3f(u("u_bg"), BG[0], BG[1], BG[2]);
    gl.uniform1i(u("u_tex"), 0);

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // CLAMP y no REPEAT: los tres modos empujan la coordenada fuera de 0..1, y
    // con REPEAT la palabra reaparecería dada vuelta del otro lado.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // El canvas 2D produce datos premultiplicados; se le pide a WebGL que los
    // conserve así en vez de des-premultiplicarlos al subir. Es lo que permite
    // que el shader mezcle con una suma sobre el fondo atenuado, que es la
    // única fórmula que no deja halo en los bordes antialiaseados de las
    // letras. Ver el comentario largo en `gl/muralShader.ts`.
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    const tex2d = document.createElement("canvas");
    const ctx = tex2d.getContext("2d");

    const paint = (w: number, h: number) => {
      if (!ctx) return;
      tex2d.width = w;
      tex2d.height = h;
      ctx.clearRect(0, 0, w, h);

      // Familia, peso y tamaño salen del `computedStyle` del host y nunca de
      // literales: el token `--text-mural` los define y este canvas tiene que
      // seguirlo, incluido su `clamp` en `cqw`.
      const cs = getComputedStyle(host);
      const size = parseFloat(cs.fontSize) * (h / host.clientHeight);
      ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`;

      // El tracking hay que pasárselo aparte, y no es opcional: el canvas 2D
      // ignora el `letter-spacing` que viene dentro del shorthand de `font`, y
      // el token `--text-mural` lleva -0.04em. Sin esto la palabra se rasteriza
      // ~4% más ancha que su caja y el canvas la corta por el borde — que fue
      // exactamente el primer síntoma: "THE AGENT ECONOMY" empezando en "HE".
      //
      // Se reescala igual que el cuerpo, porque `letterSpacing` viene en px
      // resueltos contra el tamaño del DOM y acá se dibuja al tamaño del buffer.
      const track = parseFloat(cs.letterSpacing);
      if (Number.isFinite(track)) {
        ctx.letterSpacing = `${track * (h / host.clientHeight)}px`;
      }

      ctx.textAlign = line.align === "right" ? "right" : "left";
      ctx.textBaseline = "alphabetic";

      // El mismo degradado que el DOM, traducido a canvas. Se parsean las
      // paradas del string CSS para no tener dos definiciones de la rampa.
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      const css = rampGradient(line);
      for (const m of css.matchAll(/(#[0-9a-f]{3,6}|rgba?\([^)]+\))\s+([\d.]+)%/gi)) {
        grad.addColorStop(Math.min(1, Math.max(0, parseFloat(m[2]) / 100)), m[1]);
      }
      ctx.fillStyle = grad;

      // La línea base: el alto de la caja menos el descendente aproximado del
      // corte de display. Medirlo con `TextMetrics` sería más exacto, pero el
      // canvas ya está recortado a la caja del host y un píxel de diferencia no
      // se ve a este cuerpo.
      const baseline = h * 0.84;
      ctx.fillText(line.word.toUpperCase(), line.align === "right" ? w : 0, baseline);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex2d);
    };

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = deviceRatio(1.75);
      const nw = Math.max(1, Math.round(host.clientWidth * dpr));
      const nh = Math.max(1, Math.round(host.clientHeight * dpr));
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      paint(w, h);
    };
    resize();

    const start = performance.now();
    // Se cuelga del ticker de GSAP y nunca de un `rAF` propio: es lo que hace
    // que el shader avance en el mismo frame que las timelines que lo conducen.
    const tick = () => {
      resize();
      // Los valores se leen del ref en cada frame y nunca de una prop: cambian
      // sesenta veces por segundo, y hacerlos estado sería un re-render por
      // frame para algo que React no tiene que saber.
      gl.uniform1f(uP, progress.current?.value ?? 0);
      gl.uniform1f(uVel, velocity?.current?.value ?? 0);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    gsap.ticker.add(tick);

    // No dibuja fuera de vista. El lead de un viewport es porque el primer
    // frame de un shader incluye el warm-up del pipeline, y ese warm-up en
    // pantalla se ve como un parpadeo.
    const viewport = onViewportToggle(
      host,
      (visible) => {
        if (visible) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      },
      1
    );

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    return () => {
      viewport.kill();
      gsap.ticker.remove(tick);
      ro.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    };
  }, [effect, hostRef, line, progress, velocity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
