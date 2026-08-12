"use client";

import { buildProgram, getGl2 } from "./glContext";
import { deviceRatio } from "./dpr";
import { FLOW_FIELD_FRAGMENT, FLOW_FIELD_VERTEX } from "./shaders/flowField";

/** Los 4 stops del campo, en RGB 0..1, de saturado a neutro.
 *
 *  `readonly` en los dos niveles: así una paleta declarada con `as const` en el
 *  componente encaja sin castear. Sin esto, cada `colors` de un objeto `as
 *  const` necesitaría un `as unknown as`. */
export type FlowFieldColors = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
];

export type FlowFieldOptions = {
  colors: FlowFieldColors;
  /** Tope de 1.5 y no 2: son 3 covers corriendo ruido gradiente 3D a 60fps con
   *  8 iteraciones, y el material es difuso — la resolución extra no se ve.
   *  Además engrosa un poco el grano, que acá es de film y no de píxel. */
  maxDpr?: number;
};

export type FlowField = {
  /** 0 = reposo · 1 = puntero encima. Abre la amplitud del flujo. */
  setHover: (v: number) => void;
  /** Posición del puntero en [0,1] relativa a la card. Traslada el campo. */
  setMouse: (x: number, y: number) => void;
  /** Segundos para la deriva. Lo alimenta el ticker compartido. */
  setTime: (seconds: number) => void;
  /** Gate de viewport: en false descarta los draws. */
  setVisible: (v: boolean) => void;
  /** Dibuja un frame con los valores actuales. */
  render: () => void;
  destroy: () => void;
};

const DEV = process.env.NODE_ENV !== "production";

/**
 * Campo de color arrastrado por un flujo de ruido, para el cover de una card.
 *
 * NO tiene loop propio a propósito: `render()` lo llama quien la usa. En esta
 * página eso es `gsap.ticker` — el mismo rAF que ya mueve Lenis y ScrollTrigger
 * — así 3 covers animados no agregan 3 loops compitiendo.
 *
 * Devuelve `null`, sin lanzar y sin loguear en prod, si no hay WebGL2 utilizable.
 * Quien la llama debe tener un fallback visible: acá el cover ES el contenido de
 * la card, no un adorno.
 */
export function createFlowField(
  canvas: HTMLCanvasElement,
  { colors, maxDpr = 1.5 }: FlowFieldOptions
): FlowField | null {
  // El paso por dos variables no es redundante: el narrowing de un `const` que
  // sale de un `if (!x) return` NO sobrevive dentro de las clausuras que se
  // declaran más abajo (`render`, `resize`, `destroy`). Reasignarlo a un
  // `const` ya no-nulo sí.
  const glOrNull = getGl2(canvas);
  if (!glOrNull) {
    if (DEV) console.info("[flowField] sin WebGL2 utilizable — el cover cae al fallback CSS.");
    return null;
  }
  const gl = glOrNull;

  const program = buildProgram(gl, FLOW_FIELD_VERTEX, FLOW_FIELD_FRAGMENT, "flowField");
  if (!program) return null;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.useProgram(program);

  const uHover = gl.getUniformLocation(program, "uHover");
  const uMouse = gl.getUniformLocation(program, "uMouse");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uAspect = gl.getUniformLocation(program, "uAspect");

  // Los colores son constantes por instancia: se suben UNA vez, no por frame.
  gl.uniform3f(gl.getUniformLocation(program, "uC1"), ...colors[0]);
  gl.uniform3f(gl.getUniformLocation(program, "uC2"), ...colors[1]);
  gl.uniform3f(gl.getUniformLocation(program, "uC3"), ...colors[2]);
  gl.uniform3f(gl.getUniformLocation(program, "uC4"), ...colors[3]);

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);

  // ── Estado ──────────────────────────────────────────────────────────────
  let dead = false;
  let visible = true;
  let bufW = 0;
  let bufH = 0;
  let hover = 0;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let time = 0;

  const onContextLost = (e: Event) => {
    // preventDefault habilita que el navegador PUEDA restaurar. No
    // reconstruimos: perder el material deja la card con su fondo CSS, que es
    // un degradado aceptable.
    e.preventDefault();
    dead = true;
    if (DEV) console.warn("[flowField] contexto WebGL perdido — el cover queda estático.");
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  function render() {
    if (dead || !visible || bufW === 0 || bufH === 0) return;
    gl.uniform1f(uHover, hover);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.uniform1f(uTime, time);
    // Sin gl.clear(): el triángulo cubre el 100% del framebuffer.
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function resize() {
    if (dead) return;
    const dpr = deviceRatio(maxDpr);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (w === bufW && h === bufH) return;

    bufW = w;
    bufH = h;
    canvas.width = w; // resetea el drawing buffer, NO el estado GL
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    // El aspecto entra al shader para que la escala del flujo sea isotrópica.
    gl.uniform1f(uAspect, w / h);
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
    setHover(v: number) {
      hover = v;
    },
    setMouse(x: number, y: number) {
      mouseX = x;
      mouseY = y;
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

      // Se sueltan los objetos GL de ESTA instancia, pero el contexto queda
      // vivo y cacheado contra el canvas. Perderlo acá era lo que rompía el
      // segundo montaje de StrictMode: React reusa el mismo <canvas>, y sobre
      // un contexto perdido el link falla sin ningún mensaje.
      //
      // Lo que ese loseContext() intentaba evitar —acumular contextos fantasma
      // con HMR— lo resuelve mejor el cache por canvas: un canvas nuevo trae
      // contexto nuevo, y el viejo se libera cuando el elemento se recolecta.
      gl.bindVertexArray(null);
      gl.deleteVertexArray(vao);
      gl.useProgram(null);
      gl.deleteProgram(program);
    },
  };
}
