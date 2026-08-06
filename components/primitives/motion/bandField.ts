"use client";

import { BAND_FIELD_FRAGMENT, BAND_FIELD_VERTEX } from "./shaders/bandField";

/** Los 4 stops de la rampa, en RGB 0..1, de saturado a neutro.
 *
 *  `readonly` en los dos niveles: así una paleta declarada con `as const` en el
 *  componente encaja sin castear. Sin esto, cada `colors` de un objeto `as
 *  const` necesitaría un `as unknown as`. */
export type BandFieldColors = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
];

export type BandFieldOptions = {
  colors: BandFieldColors;
  /** Cuántas bandas verticales. ~10 en el prototipo. */
  bands?: number;
  /** Tope de 1.5 y no 2: son 3 covers corriendo fbm a 60fps, y el material es
   *  difuso — la resolución extra no se ve. Además engrosa un poco el grano,
   *  que en la referencia es de film y no de píxel. */
  maxDpr?: number;
};

export type BandField = {
  /** 0 = bandas alineadas · 1 = desfase abierto. Es el hover. */
  setSpread: (v: number) => void;
  /** Segundos para la deriva. Lo alimenta el ticker compartido. */
  setTime: (seconds: number) => void;
  /** Gate de viewport: en false descarta los draws. */
  setVisible: (v: boolean) => void;
  /** Dibuja un frame con los valores actuales. */
  render: () => void;
  destroy: () => void;
};

const DEV = process.env.NODE_ENV !== "production";

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

/**
 * Material de bandas verticales desfasadas para el cover de una card.
 *
 * NO tiene loop propio a propósito: `render()` lo llama quien la usa. En esta
 * página eso es `gsap.ticker` — el mismo rAF que ya mueve Lenis y ScrollTrigger
 * — así 3 covers con deriva continua no agregan 3 loops compitiendo.
 *
 * Devuelve `null`, sin lanzar y sin loguear en prod, si no hay WebGL2 utilizable.
 * Quien la llama debe tener un fallback visible: acá el cover ES el contenido de
 * la card, no un adorno.
 */
export function createBandField(
  canvas: HTMLCanvasElement,
  { colors, bands = 10, maxDpr = 1.5 }: BandFieldOptions
): BandField | null {
  // ── Capability check: el check ES crear el contexto ──────────────────────
  const glOrNull = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    failIfMajorPerformanceCaveat: true,
    powerPreference: "low-power",
  }) as WebGL2RenderingContext | null;

  if (!glOrNull) {
    if (DEV) console.info("[bandField] sin WebGL2 utilizable — el cover cae al fallback CSS.");
    return null;
  }
  const gl = glOrNull;

  const vs = compile(gl, gl.VERTEX_SHADER, BAND_FIELD_VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, BAND_FIELD_FRAGMENT);
  const program = vs && fs ? gl.createProgram() : null;

  const bail = () => {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    if (program) gl.deleteProgram(program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  };

  if (!vs || !fs || !program) return bail();

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!(gl.getProgramParameter(program, gl.LINK_STATUS) as boolean)) {
    if (DEV) {
      console.error(
        "[bandField] link falló:", gl.getProgramInfoLog(program),
        "\nvertex:", gl.getShaderInfoLog(vs),
        "\nfragment:", gl.getShaderInfoLog(fs)
      );
    }
    return bail();
  }

  gl.detachShader(program, vs);
  gl.detachShader(program, fs);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.useProgram(program);

  const uBands = gl.getUniformLocation(program, "uBands");
  const uSpread = gl.getUniformLocation(program, "uSpread");
  const uTime = gl.getUniformLocation(program, "uTime");

  // Los colores son constantes por instancia: se suben UNA vez, no por frame.
  gl.uniform3f(gl.getUniformLocation(program, "uC1"), ...colors[0]);
  gl.uniform3f(gl.getUniformLocation(program, "uC2"), ...colors[1]);
  gl.uniform3f(gl.getUniformLocation(program, "uC3"), ...colors[2]);
  gl.uniform3f(gl.getUniformLocation(program, "uC4"), ...colors[3]);
  gl.uniform1f(uBands, bands);

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);

  // ── Estado ──────────────────────────────────────────────────────────────
  let dead = false;
  let visible = true;
  let bufW = 0;
  let bufH = 0;
  let spread = 0;
  let time = 0;

  const onContextLost = (e: Event) => {
    // preventDefault habilita que el navegador PUEDA restaurar. No
    // reconstruimos: perder el material deja la card con su fondo CSS, que es
    // un degradado aceptable.
    e.preventDefault();
    dead = true;
    if (DEV) console.warn("[bandField] contexto WebGL perdido — el cover queda estático.");
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  function render() {
    if (dead || !visible || bufW === 0 || bufH === 0) return;
    gl.uniform1f(uSpread, spread);
    gl.uniform1f(uTime, time);
    // Sin gl.clear(): el triángulo cubre el 100% del framebuffer.
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function resize() {
    if (dead) return;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (w === bufW && h === bufH) return;

    bufW = w;
    bufH = h;
    canvas.width = w; // resetea el drawing buffer, NO el estado GL
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    render();
  }

  // Se observa el canvas mismo: acá su tamaño lo fija el CSS (inset del cover),
  // no este módulo, así que no hay bucle de realimentación.
  const ro = new ResizeObserver(resize);
  try {
    ro.observe(canvas, { box: "device-pixel-content-box" });
  } catch {
    ro.observe(canvas);
  }
  resize();

  return {
    setSpread(v: number) {
      spread = v;
    },
    setTime(seconds: number) {
      time = seconds;
    },
    setVisible(v: boolean) {
      visible = v;
      if (v) render();
    },
    render,
    destroy() {
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (dead) return;
      dead = true;

      gl.bindVertexArray(null);
      gl.deleteVertexArray(vao);
      gl.useProgram(null);
      gl.deleteProgram(program);
      // Sin esto, StrictMode + HMR acumulan contextos fantasma hasta que el
      // navegador empieza a matar contextos vivos (~16 en Chrome).
      gl.getExtension("WEBGL_lose_context")?.loseContext();

      canvas.width = 1;
      canvas.height = 1;
    },
  };
}
