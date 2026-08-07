"use client";

// Lo que comparten los efectos WebGL2 de esta carpeta: conseguir un contexto y
// construir un programa. Los dos consumidores (`flowField`, `glyphShine`) tenían
// esto duplicado, y el duplicado escondía el mismo bug dos veces.

const DEV = process.env.NODE_ENV !== "production";

/**
 * UN contexto por canvas, cacheado, y **nunca** forzado a perderse mientras el
 * canvas viva.
 *
 * El motivo es un modo de fallo concreto y muy confuso. React REUSA el mismo
 * elemento `<canvas>` entre el primer y el segundo montaje de StrictMode. Si el
 * cleanup del primero llama `WEBGL_lose_context.loseContext()` —que es lo que
 * hacían los dos módulos— el segundo pide `getContext("webgl2")` y el navegador
 * devuelve, por spec, EL MISMO contexto, que sigue perdido. Sobre un contexto
 * perdido `createShader` devuelve objetos válidos pero inertes, `linkProgram`
 * falla, y los tres `get*InfoLog` devuelven `null`: un error sin mensaje, que
 * además solo aparece en dev.
 *
 * Cachear por canvas resuelve mejor el problema que aquel `loseContext()`
 * intentaba atacar —acumular contextos fantasma con HMR hasta el límite de ~16
 * de Chrome—: un canvas nuevo trae contexto nuevo, y cuando el canvas viejo se
 * recolecta su contexto se libera con él. El WeakMap no retiene nada.
 *
 * Devuelve `null` si no hay WebGL2 utilizable, o si el contexto cacheado se
 * perdió de verdad (el navegador puede matarlo por su cuenta). Quien llama debe
 * tener un fallback.
 */
const contexts = new WeakMap<HTMLCanvasElement, WebGL2RenderingContext>();

export function getGl2(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
  const cached = contexts.get(canvas);
  if (cached) return cached.isContextLost() ? null : cached;

  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    // El check de capacidad ES crear el contexto: si solo hay rasterizador por
    // software, preferimos el fallback a 3 fps de shader.
    failIfMajorPerformanceCaveat: true,
    powerPreference: "low-power",
  }) as WebGL2RenderingContext | null;

  if (gl) contexts.set(canvas, gl);
  return gl;
}

function compile(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
  tag: string,
  label: string
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  // Chequear COMPILE_STATUS acá y no dejárselo al link: si un shader no
  // compila, el link falla igual, pero su mensaje no dice en qué línea del GLSL
  // está el problema. Este sí. TypeScript no puede mirar adentro de estos
  // template literals, así que es el único chequeo que hay.
  if (!(gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean)) {
    if (DEV) {
      console.error(
        `[${tag}] el shader ${label} no compiló:\n${gl.getShaderInfoLog(shader) ?? "(sin log)"}`
      );
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Compila, linkea y suelta los shaders. Devuelve `null` sin lanzar si algo
 * falla — en prod además sin loguear.
 *
 * `tag` es el prefijo de los mensajes de error, para saber qué efecto falló
 * cuando hay varios en la misma página.
 */
export function buildProgram(
  gl: WebGL2RenderingContext,
  vertexSrc: string,
  fragmentSrc: string,
  tag: string
): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, vertexSrc, tag, "vertex");
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSrc, tag, "fragment");
  const program = vs && fs ? gl.createProgram() : null;

  // El bail NO pierde el contexto, a propósito: ver getGl2. Solo suelta los
  // objetos de este intento.
  if (!vs || !fs || !program) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    if (program) gl.deleteProgram(program);
    return null;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;

  // Los shaders se sueltan pase lo que pase: una vez linkeados, el programa ya
  // no los necesita.
  gl.detachShader(program, vs);
  gl.detachShader(program, fs);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!linked) {
    if (DEV) {
      const log = gl.getProgramInfoLog(program);
      console.error(
        `[${tag}] el link falló: ${log || "(sin log)"}` +
          (gl.isContextLost() ? " — el contexto WebGL está perdido." : "")
      );
    }
    gl.deleteProgram(program);
    return null;
  }

  return program;
}
