"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { FRAGMENTS, type ShaderId } from "./shaders";

// ══════════════════════════════════════════════════════════════════════════
// UN SOLO contexto WebGL para las diez variantes que lo usan.
//
// ── Por qué, y no un canvas por botón ─────────────────────────────────────
//
// Los navegadores limitan los contextos WebGL vivos: 16 por navegador y 8 POR
// ORIGEN en desktop, 8 en Android. Al pasarse, el navegador no falla de forma
// visible — mata el contexto más viejo y dispara `webglcontextlost`, así que
// la página se degrada al azar según el orden en que el usuario haya
// scrolleado. Diez variantes con su propio canvas caen justo en ese borde.
//
// La salida no es administrar mejor diez contextos: es no necesitarlos. Hay UN
// puntero, así que hay como máximo UN efecto de hover corriendo. Este módulo
// mantiene un único canvas y lo REPARENTA (appendChild) al elemento que se
// está hovereando, cambia de programa y sigue. Mover un canvas en el DOM no
// pierde su contexto; los programas quedan compilados y cacheados, así que a
// partir del segundo hover de cada variante el cambio no cuesta nada.
//
// El efecto lateral es que el runtime también se apaga solo: sin host activo
// no hay canvas en el DOM ni callback en el ticker. En reposo, cero trabajo.
// ══════════════════════════════════════════════════════════════════════════

/** Lo que las variantes animan. GSAP escribe acá directo (`gsap.to(gl.state,
 *  {hover: 1})`) y el render lo lee una vez por frame — sin un callback por
 *  propiedad por frame. */
export type GLState = {
  /** 0..1. Lo anima GSAP: la curva del hover ES el efecto. */
  hover: number;
  /** 0..1. Segundo canal, para lo que necesite dos tiempos. */
  prog: number;
  /** Puntero en CSS px relativos al host; el runtime lo pasa a device px e
   *  invierte la Y antes de mandarlo al shader. */
  mx: number;
  my: number;
  /**
   * El `vec4` libre — cada shader documenta qué espera en cada canal.
   *
   * Es un OBJETO y no un array de cuatro números, y eso no es un detalle de
   * estilo: `gsap.to(unArray, …)` interpreta el array como una LISTA DE
   * TARGETS, así que animar `aux` como array no anima nada y no avisa. Con un
   * objeto, `gsap.to(state.aux, { x, y, z })` hace lo que uno cree que hace —
   * que es cómo el subrayado de plasma se desliza entre links.
   */
  aux: { x: number; y: number; z: number; w: number };
};

export type AttachOptions = {
  /** `screen` para las luces del footer (el negro no suma), `normal` para el
   *  resto. Va como `mix-blend-mode` en el canvas, no en el shader. */
  blend?: "normal" | "screen" | "difference";
  /** Radio en CSS px, para que el canvas siga la forma del botón. También
   *  llega al shader en `uAux.x` cuando el efecto lo necesita (glBorder). */
  radius?: number;
  /** z-index del canvas dentro del host. Por defecto queda detrás del label. */
  z?: number;
};

type Compiled = {
  program: WebGLProgram;
  loc: Record<string, WebGLUniformLocation | null>;
};

const VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const UNIFORMS = [
  "uTime", "uRes", "uMouse", "uHover", "uProg", "uAux",
  "uC1", "uC2", "uC3", "uInk", "uTex",
] as const;

/** #RRGGBB -> [r,g,b] en 0..1. Los colores salen de los tokens de marca leídos
 *  del `:root`, no de constantes en el shader: la paleta ya tiene un dueño
 *  (`app/globals.css`) y un hex copiado en GLSL sería el segundo. */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) return [1, 0, 1]; // magenta = token roto
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function readBrand() {
  const s = getComputedStyle(document.documentElement);
  return {
    c1: hexToRgb(s.getPropertyValue("--cta-lime") || "#ecfdb0"),
    c2: hexToRgb(s.getPropertyValue("--cta-mint") || "#8bf29c"),
    c3: hexToRgb(s.getPropertyValue("--cta-deep") || "#00b96f"),
    ink: hexToRgb(s.getPropertyValue("--ink") || "#101010"),
  };
}

class SharedGL {
  readonly canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private quad: WebGLBuffer | null = null;
  private cache = new Map<ShaderId, Compiled>();
  private tex: WebGLTexture | null = null;
  private brand = { c1: [0, 0, 0], c2: [0, 0, 0], c3: [0, 0, 0], ink: [0, 0, 0] } as ReturnType<typeof readBrand>;

  private host: HTMLElement | null = null;
  private shader: ShaderId | null = null;
  private radius = 0;
  private ro: ResizeObserver;
  private running = false;
  private dead = false;
  /** El tiempo se congela con reduced-motion: el estado final del hover llega
   *  igual (uHover lo sigue animando GSAP, o saltando), pero nada late solo. */
  private reduce: MediaQueryList;

  state: GLState = { hover: 0, prog: 0, mx: 0, my: 0, aux: { x: 0, y: 0, z: 0, w: 0 } };

  constructor(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
    this.gl = gl;
    this.canvas = canvas;
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      pointerEvents: "none",
      opacity: "0",
    } satisfies Partial<CSSStyleDeclaration>);

    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    // Dos triángulos que cubren el clip space. No hay más geometría en todo el
    // módulo: cada efecto es un fragment shader sobre este rectángulo.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // alpha premultiplicado

    // Perder el contexto no es un caso hipotético: pasa al dormir la máquina o
    // al quedarse sin memoria de GPU. Sin el preventDefault no se restaura
    // nunca; sin limpiar la caché, los programas quedan apuntando a objetos de
    // un contexto muerto.
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.dead = true;
      this.cache.clear();
      this.tex = null;
      this.stop();
    });
    canvas.addEventListener("webglcontextrestored", () => {
      this.dead = false;
      this.setup();
    });

    this.ro = new ResizeObserver(() => this.resize());
    this.setup();
  }

  private setup() {
    this.brand = readBrand();
  }

  private compile(id: ShaderId): Compiled | null {
    const cached = this.cache.get(id);
    if (cached) return cached;

    const gl = this.gl;
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return null;

    gl.shaderSource(vs, VERT);
    gl.compileShader(vs);
    gl.shaderSource(fs, FRAGMENTS[id]);
    gl.compileShader(fs);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      // El log de compilación importa en desarrollo y no en producción: un
      // shader roto acá no puede tumbar la página, sólo apagar el efecto.
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[hover-lab] shader "${id}" no linkeó\n`,
          gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(program)
        );
      }
      return null;
    }
    // Los shaders ya están linkeados dentro del programa; los objetos sueltos
    // no hacen falta más.
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    const loc: Compiled["loc"] = {};
    for (const u of UNIFORMS) loc[u] = gl.getUniformLocation(program, u);

    const compiled = { program, loc };
    this.cache.set(id, compiled);
    return compiled;
  }

  private resize() {
    const host = this.host;
    if (!host) return;
    // Cap a 2: en un botón de 140×40 el tercer píxel por punto no se ve y
    // triplica el fill rate.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = host.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (this.canvas.width === w && this.canvas.height === h) return;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  /** Trae el canvas a este host y lo pone a dibujar `shader`. Si había otro
   *  host, lo suelta — el canvas es uno solo, y eso es el punto. */
  attach(host: HTMLElement, shader: ShaderId, opts: AttachOptions = {}) {
    if (this.dead) return;

    if (this.host && this.host !== host) this.release();

    this.host = host;
    this.shader = shader;
    this.radius = opts.radius ?? 0;
    this.canvas.style.mixBlendMode = opts.blend === "screen" ? "screen" : "normal";
    this.canvas.style.zIndex = String(opts.z ?? 1);
    this.canvas.style.borderRadius = opts.radius ? `${opts.radius}px` : "inherit";

    host.appendChild(this.canvas);
    this.ro.observe(host);
    this.resize();

    gsap.killTweensOf(this.canvas);
    gsap.to(this.canvas, { opacity: 1, duration: 0.14, ease: "none", overwrite: true });

    this.start();
  }

  /** Saca el canvas del host. Se llama al terminar la animación de salida, no
   *  al `pointerleave`: el efecto todavía tiene que poder desvanecerse. */
  detach(host: HTMLElement) {
    if (this.host !== host) return; // el puntero ya se fue a otra variante
    this.release();
  }

  private release() {
    if (!this.host) return;
    this.ro.unobserve(this.host);
    this.canvas.remove();
    this.host = null;
    this.shader = null;
    this.stop();
    this.state.hover = 0;
    this.state.prog = 0;
    // `aux` también, o la próxima variante hereda la geometría de la anterior
    // durante el primer frame — el subrayado apareciendo donde estaba el link
    // de la tarjeta de al lado.
    Object.assign(this.state.aux, { x: 0, y: 0, z: 0, w: 0 });
  }

  /** Sube (o actualiza) la textura de `glText`. */
  setTexture(source: TexImageSource) {
    const gl = this.gl;
    if (this.dead) return;
    if (!this.tex) {
      this.tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      // CLAMP + LINEAR y sin mipmaps: la textura no es potencia de dos y en
      // WebGL 1 eso obliga a estos parámetros o el muestreo devuelve negro.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }

  private start() {
    if (this.running) return;
    this.running = true;
    gsap.ticker.add(this.tick);
  }

  private stop() {
    if (!this.running) return;
    this.running = false;
    gsap.ticker.remove(this.tick);
  }

  // Campo y no método para que la identidad sea estable: `ticker.remove` compara
  // por referencia.
  private tick = (time: number) => {
    const gl = this.gl;
    const id = this.shader;
    if (!id || this.dead) return;

    const c = this.compile(id);
    if (!c) {
      this.stop();
      return;
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(c.program);

    const pos = gl.getAttribLocation(c.program, "aPos");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const s = this.state;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { c1, c2, c3, ink } = this.brand;

    if (c.loc.uTime) gl.uniform1f(c.loc.uTime, this.reduce.matches ? 0 : time);
    if (c.loc.uRes) gl.uniform2f(c.loc.uRes, w, h);
    // El estado guarda CSS px; el shader razona en píxeles de dispositivo, y el
    // eje Y va al revés que el del DOM.
    if (c.loc.uMouse) gl.uniform2f(c.loc.uMouse, s.mx * dpr, h - s.my * dpr);
    if (c.loc.uHover) gl.uniform1f(c.loc.uHover, s.hover);
    if (c.loc.uProg) gl.uniform1f(c.loc.uProg, s.prog);
    if (c.loc.uAux) {
      // El estado guarda CSS px y el shader trabaja en píxeles de dispositivo,
      // así que los tres primeros canales se escalan por dpr; el cuarto queda
      // crudo para lo que no sea una longitud.
      //
      // `aux.x` es el radio del botón en las variantes que no lo usan para otra
      // cosa (glBorder) y una coordenada en las del footer — de ahí el fallback
      // al radio sólo cuando la variante no escribió nada.
      const a = s.aux;
      gl.uniform4f(c.loc.uAux, (a.x || this.radius) * dpr, a.y * dpr, a.z * dpr, a.w);
    }
    if (c.loc.uC1) gl.uniform3fv(c.loc.uC1, c1);
    if (c.loc.uC2) gl.uniform3fv(c.loc.uC2, c2);
    if (c.loc.uC3) gl.uniform3fv(c.loc.uC3, c3);
    if (c.loc.uInk) gl.uniform3fv(c.loc.uInk, ink);
    if (c.loc.uTex && this.tex) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.uniform1i(c.loc.uTex, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
}

let instance: SharedGL | null | undefined;

/**
 * El runtime compartido. Devuelve `null` —una sola vez, cacheado— si el
 * navegador no da WebGL; las variantes que lo usan tienen que quedar
 * presentables en ese caso, y por eso todas traen su reposo en CSS.
 */
export function getSharedGL(): SharedGL | null {
  if (instance !== undefined) return instance;
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl", {
      alpha: true,
      antialias: false, // no hay geometría que aliasear: todo son fragmentos
      premultipliedAlpha: true,
      // El contenido se redibuja entero cada frame; preservarlo cuesta una
      // copia por frame y no lo usa nadie.
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    }) ||
    canvas.getContext("experimental-webgl");

  instance = gl ? new SharedGL(gl as WebGLRenderingContext, canvas) : null;
  return instance;
}

/**
 * El label rasterizado con la MISMA fuente que el DOM, para `glText`.
 *
 * `getComputedStyle(el).font` es lo que hace que el cambio del texto real al
 * del shader no se note: replicar la fuente a mano (family, peso, tamaño,
 * tracking) es donde este tipo de efecto se delata siempre.
 *
 * Devuelve `null` si la fuente todavía no cargó — quien llama tiene que
 * reintentar tras `document.fonts.ready` en vez de dibujar con el fallback.
 */
export function textTexture(el: HTMLElement, w: number, h: number): HTMLCanvasElement | null {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cv = document.createElement("canvas");
  cv.width = Math.max(1, Math.round(w * dpr));
  cv.height = Math.max(1, Math.round(h * dpr));
  const ctx = cv.getContext("2d");
  if (!ctx) return null;

  const cs = getComputedStyle(el);
  ctx.scale(dpr, dpr);
  ctx.font = cs.font || `500 14px ${cs.fontFamily}`;
  ctx.letterSpacing = cs.letterSpacing;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff"; // sólo importa el alpha: el color lo pone el shader
  ctx.fillText(el.textContent ?? "", w / 2, h / 2 + 0.5);

  return cv;
}
