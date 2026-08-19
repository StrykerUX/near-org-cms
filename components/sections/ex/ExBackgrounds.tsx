"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { getGl2, buildProgram } from "@/components/primitives/motion/glContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { EX_COPY } from "@/components/sections/ex/exContent";
import { EX_FIELD_FRAG, EX_FIELD_VERT } from "@/components/sections/ex/shaders/exField";
import { EX_ASCII_FRAG, EX_ASCII_VERT } from "@/components/sections/ex/shaders/exAscii";

// Los tres fondos de los drafts EX. Cada uno es un `React.ReactNode` que
// `ExHero` pinta detrás de todo; el hero no sabe nada de ellos más allá de que
// llevan `data-fade` para retirarse cuando la «o» se abre.
//
// Contrato de canvas del repo, que los dos de WebGL cumplen:
//
//   · buffer con `deviceRatio()` — un retina a 3× cuadruplica el coste de un
//     shader a pantalla completa para una diferencia que nadie ve;
//   · `onViewportToggle` corta el ticker fuera de vista;
//   · `gsap.ticker`, nunca un `requestAnimationFrame` propio;
//   · sin WebGL2 utilizable, `getGl2` devuelve null y queda el fondo sólido del
//     host — nunca un rectángulo negro.

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

/* ── EX1 · el vídeo ───────────────────────────────────────────────────────── */

/**
 * El clip de ab7 en loop, no scrubbeado: todo el scroll de la sección se lo
 * lleva la apertura de la «o».
 *
 * El velo va en BLANCO y no en tinta porque el cartel es negro: lo que le da
 * contraste es aclarar el vídeo, no oscurecerlo. 35% arriba (donde caen el nav
 * y el primer renglón sobre la parte más clara del clip) y 10% abajo, donde el
 * vídeo ya es oscuro por sí solo y un velo fuerte lo lavaría.
 */
export function ExBgVideo() {
  return (
    <>
      <video
        data-fade
        className="absolute inset-0 h-full w-full object-cover"
        src={EX_COPY.video}
        poster={EX_COPY.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div
        data-fade
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.10)_100%)]"
      />
    </>
  );
}

/* ── EX2 · el campo de curvas de nivel ────────────────────────────────────── */

const FIELD_BG = "#faf9f6";
const FIELD_LINE = "#c9c7c1";
const FIELD_GLOW = "#bfe3cd";

export function ExBgField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const bail = () => {
      // El contexto se pide con `alpha: false`: un canvas montado y sin pintar
      // es un rectángulo NEGRO a pantalla completa. Escondiéndolo queda el
      // fondo del host.
      canvas.style.display = "none";
    };

    const gl = getGl2(canvas);
    if (!gl) return bail();
    const program = buildProgram(gl, EX_FIELD_VERT, EX_FIELD_FRAG, "exField");
    if (!program) return bail();

    // Un triángulo que cubre el clip space, no dos de un quad: la mitad de
    // vértices y ninguna diagonal donde el rasterizador deje una costura.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    gl.uniform3f(gl.getUniformLocation(program, "u_bg"), ...hexToRgb(FIELD_BG));
    gl.uniform3f(gl.getUniformLocation(program, "u_line"), ...hexToRgb(FIELD_LINE));
    gl.uniform3f(gl.getUniformLocation(program, "u_glow"), ...hexToRgb(FIELD_GLOW));

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
      // Solo `prefers-reduced-motion`: declarar `isDesktop` haría que cruzar los
      // 1024px destruya y reconstruya el contexto WebGL.
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
        return () => {
          gsap.ticker.remove(tick);
          gate.kill();
        };
      });
      mm.add(MQ.reduce, () => draw(false));
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
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-fade
      aria-hidden="true"
      className="absolute inset-0 bg-[#faf9f6]"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

/* ── EX3 · el campo ASCII ─────────────────────────────────────────────────── */

// Del más vacío al más denso. El orden IMPORTA: el shader convierte la
// intensidad del campo en un índice de esta tira, así que una rampa mal ordenada
// se ve como ruido en vez de como un degradado.
const RAMP = " .:-=+*#%@";

// Lado de la celda en px de CSS. Más chico da más detalle y más glifos que
// rasterizar; a 14 el carácter todavía se reconoce como carácter.
const CELL = 14;

// El campo es FONDO, no contenido: en tinta plena compite con el titular y el
// subtítulo se pierde entre los caracteres. A este gris los glifos se leen como
// una textura y el texto negro vuelve a mandar. El acento solo aparece en las
// celdas más densas, que con el cursor cerca son las que lo rodean — así la mano
// deja un rastro de color sin que haya que pintar nada aparte.
const ASCII_BG = "#faf9f6";
const ASCII_INK = "#cfcdc7";
const ASCII_ACCENT = "#8fd0ae";

/**
 * Un campo de caracteres que deriva solo y se densifica alrededor del cursor.
 *
 * El puntero no pinta un halo encima: deforma el CAMPO, así que lo que cambia
 * bajo la mano es qué carácter le toca a cada celda. Es la diferencia entre un
 * efecto sobre el ASCII y un efecto del ASCII.
 */
export function ExBgAscii() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const bail = () => {
      canvas.style.display = "none";
    };

    const gl = getGl2(canvas);
    if (!gl) return bail();
    const program = buildProgram(gl, EX_ASCII_VERT, EX_ASCII_FRAG, "exAscii");
    if (!program) return bail();

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    // ── El atlas ─────────────────────────────────────────────────────────────
    //
    // Una tira horizontal con un carácter por casilla, rasterizada en un canvas
    // 2D y subida como textura. Es la única forma de tener texto en un shader:
    // GLSL no sabe nada de fuentes.
    //
    // Se dibuja a 4× el tamaño de la celda y el muestreo lo reduce: a 1× los
    // remates de los glifos caen entre píxeles y la rampa deja de leerse como
    // una progresión de densidad.
    const SS = 4;
    const cellPx = CELL * SS;
    const atlas = document.createElement("canvas");
    atlas.width = cellPx * RAMP.length;
    atlas.height = cellPx;
    const actx = atlas.getContext("2d");
    if (!actx) return bail();
    actx.clearRect(0, 0, atlas.width, atlas.height);
    actx.font = `${Math.round(cellPx * 0.82)}px ui-monospace, Menlo, monospace`;
    actx.textAlign = "center";
    actx.textBaseline = "middle";
    actx.fillStyle = "#fff";
    for (let i = 0; i < RAMP.length; i++) {
      actx.fillText(RAMP[i], i * cellPx + cellPx / 2, cellPx / 2);
    }

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // `CLAMP_TO_EDGE` y no `REPEAT`: con repetición, el borde de un glifo
    // muestrea el del vecino y cada carácter sale con la cola del siguiente.
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
    gl.uniform1f(gl.getUniformLocation(program, "u_glyphs"), RAMP.length);
    gl.uniform1i(gl.getUniformLocation(program, "u_atlas"), 0);
    gl.uniform3f(gl.getUniformLocation(program, "u_bg"), ...hexToRgb(ASCII_BG));
    gl.uniform3f(gl.getUniformLocation(program, "u_ink"), ...hexToRgb(ASCII_INK));
    gl.uniform3f(gl.getUniformLocation(program, "u_accent"), ...hexToRgb(ASCII_ACCENT));

    const start = performance.now();
    // El puntero se persigue con un lazo, no se copia: sin amortiguar, el bulbo
    // salta de un frame a otro con cada movimiento rápido del ratón.
    let px = -9999;
    let py = -9999;
    let tx = -9999;
    let ty = -9999;
    let on = 0;
    let onTarget = 0;

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
      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;
      on += (onTarget - on) * 0.08;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, animate ? (performance.now() - start) / 1000 : 0);
      gl.uniform2f(uPointer, px, py);
      gl.uniform1f(uPointerOn, on);
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

        // El listener va en la VENTANA y no en el host: el hero tiene el texto y
        // los botones por encima, y con el listener en el canvas el efecto se
        // apagaría cada vez que el puntero pasa sobre una palabra.
        const onMove = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          const dpr = deviceRatio();
          tx = (e.clientX - r.left) * dpr;
          // El origen de `gl_FragCoord` está ABAJO: sin invertir la Y, el bulbo
          // sigue al cursor reflejado.
          ty = (r.height - (e.clientY - r.top)) * dpr;
          if (px < -9000) {
            px = tx;
            py = ty;
          }
          onTarget = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0;
        };
        const onLeave = () => {
          onTarget = 0;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerleave", onLeave);

        return () => {
          gsap.ticker.remove(tick);
          gate.kill();
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerleave", onLeave);
        };
      });

      // Con reduced-motion: un frame, el campo quieto y sin cursor. Se ve la
      // textura, no se mueve.
      mm.add(MQ.reduce, () => draw(false));

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
      gl.deleteBuffer(buffer);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-fade
      aria-hidden="true"
      className="absolute inset-0 bg-[#faf9f6]"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
