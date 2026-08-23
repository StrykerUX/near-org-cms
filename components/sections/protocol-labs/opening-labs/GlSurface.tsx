"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { buildProgram, getGl2 } from "@/components/primitives/motion/glContext";

// El andamiaje WebGL de las aperturas, una sola vez.
//
// `HeroFoliage` resolvió este problema completo para la homepage —contexto,
// resize, `IntersectionObserver`, `prefers-reduced-motion`, cleanup sin
// `loseContext()`— y ese archivo tiene ~90 líneas de infraestructura por 20 de
// calibración. Cuatro aperturas con shader repetirían esas 90 líneas cuatro
// veces, y con ellas los cuatro modos de fallo que ya costó encontrar una vez.
//
// Acá queda todo eso parametrizado por dos cosas: el fragment shader y sus
// uniformes constantes. Lo que cada apertura escribe es su GLSL y una tabla de
// números — que es lo único que las distingue.
//
// ── Las decisiones heredadas, y por qué no se tocan ───────────────────────
//
// **Sin `loseContext()` en el cleanup.** React reusa el mismo `<canvas>` entre
// los dos montajes de StrictMode; perder el contexto ahí deja al segundo con un
// contexto muerto donde `createShader` devuelve objetos inertes y los info logs
// vuelven `null` — un error sin mensaje y sólo en dev. El razonamiento largo
// está en `glContext.ts`.
//
// **`prefers-reduced-motion` no apaga el fondo: lo congela.** Se pinta UN cuadro
// y se queda ahí. La superficie ES el fondo de la sección; quitarla dejaría un
// rectángulo vacío detrás del titular, que es peor que una imagen quieta. Lo que
// se apaga es la deriva, vía el uniforme `u_motion`.
//
// **El `IntersectionObserver` no es una optimización opcional.** Estas
// superficies viven arriba de una página larga: sin él seguirían pintando a
// 60fps detrás de todo lo que el lector scrollea después.

export type GlSurfaceProps = {
  /** El fragment shader. GLSL 1.0 sobre contexto WebGL2, igual que el resto del repo. */
  fragment: string;
  /** Uniformes constantes, subidos UNA vez. `u_res`, `u_time` y `u_motion` los pone este componente. */
  uniforms?: Record<string, number | number[]>;
  /** Prefijo de los mensajes de error, para saber qué superficie falló. */
  tag: string;
  /**
   * Color del canvas si no hay WebGL2 utilizable. No opcional a propósito: una
   * superficie sin fallback deja un agujero transparente sobre el que el texto
   * puede quedar ilegible.
   */
  fallback: string;
  /**
   * Fracción del canvas a la que se renderiza. 0.6 para campos difusos —lo que
   * se pierde no se ve y el costo cae con el CUADRADO del factor—; 1 cuando el
   * shader tiene bordes duros que aliasean.
   */
  renderScale?: number;
  /**
   * Tope de `devicePixelRatio` para el buffer. Por defecto 1.75, que en una
   * pantalla a dpr 2 obliga a un reescalado fraccionario. Una superficie con
   * bordes visibles debería pasar 2 para quedar 1:1 con la pantalla.
   */
  maxDpr?: number;
  className?: string;
};

// Triángulo que cubre la pantalla. Tres vértices, no seis: un quad de dos
// triángulos rasteriza dos veces la diagonal.
//
// ── Por qué GLSL ES 3.00 y no el GLSL 1.0 del resto del toolkit ───────────
//
// `HeroFoliage` y `glyphShine` escriben GLSL 1.0 sobre contexto WebGL2, y les
// alcanza. A estas superficies no: dos de las cuatro necesitan `fwidth()` para
// calcular el ancho de una línea en píxeles, y en GLSL ES 1.00 las derivadas no
// son parte del lenguaje — vienen de `OES_standard_derivatives`, una extensión
// que WebGL2 **no expone** (`getExtension` devuelve `null`) porque su
// funcionalidad ya es core en ES 3.00. El resultado es un error de compilación
// que no menciona ninguna extensión:
//
//   ERROR: 0:39: 'fwidth' : no matching overloaded function found
//
// Declarar `#version 300 es` es la salida correcta y no un parche: es la versión
// nativa del contexto que este componente ya pide. Lo que cambia en los shaders
// es la sintaxis de entrada/salida — `attribute` pasa a `in`, y `gl_FragColor` a
// un `out vec4` declarado.
//
// **`#version` tiene que ser la primerísima línea del fuente**, sin espacios ni
// saltos antes; por eso los dos fuentes pasan por `trimStart()` abajo. Un
// template literal que abre con salto de línea es exactamente el error que eso
// previene, y el mensaje que da el driver no lo insinúa.
const VERT = `#version 300 es
in vec2 a;
void main(){ gl_Position = vec4(a, 0., 1.); }`;

// Tope de densidad por defecto.
//
// 1.75 y no 2 es una economía heredada de superficies sin bordes, y tiene un
// efecto secundario que en aquéllas no importa y en una superficie con
// estructura sí: en una pantalla a dpr 2, un buffer a 1.75 se muestra con un
// factor de 1.143 — un reescalado FRACCIONARIO. Es peor que uno entero: la
// interpolación reparte cada píxel del buffer entre uno y dos de pantalla según
// dónde caiga, así que el suavizado no es uniforme y aparecen escalones
// irregulares en los bordes diagonales.
//
// Una superficie con bordes debería pasar `maxDpr={2}` para que el buffer
// coincida 1:1 con la pantalla y no haya resampling en absoluto.
const MAX_DPR = 1.75;

export default function GlSurface({
  fragment,
  uniforms = {},
  tag,
  fallback,
  renderScale = 0.6,
  maxDpr = MAX_DPR,
  className,
}: GlSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Los uniformes entran al efecto por su forma SERIALIZADA y no por la
  // identidad del objeto. El motivo: cada render del padre crea un literal
  // nuevo, así que con `uniforms` en las dependencias el programa WebGL se
  // reconstruiría en cada render — contexto, shaders, link y todo.
  //
  // La alternativa habitual es un ref escrito durante el render, que es
  // exactamente lo que React desaconseja (y lo que el lint marca). Serializar
  // es correcto acá porque estos objetos son tablas de calibración de una
  // docena de números: si el JSON cambia, es porque alguien editó el archivo, y
  // entonces reconstruir el programa es lo que se quiere.
  const uniformsKey = JSON.stringify(uniforms);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = getGl2(canvas);
    if (!gl) return; // sin WebGL2 queda el color de fondo del canvas

    const program = buildProgram(gl, VERT.trimStart(), fragment.trimStart(), tag);
    if (!program) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    gl.useProgram(program);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Los constantes se suben una sola vez: mandar veinte uniformes a 60fps es
    // tráfico gratuito hacia el driver.
    const constants = JSON.parse(uniformsKey) as Record<string, number | number[]>;
    for (const [name, value] of Object.entries(constants)) {
      const location = u(name);
      if (!location) continue;
      if (typeof value === "number") gl.uniform1f(location, value);
      else if (value.length === 2) gl.uniform2fv(location, value);
      else if (value.length === 3) gl.uniform3fv(location, value);
      else if (value.length === 4) gl.uniform4fv(location, value);
    }
    gl.uniform1f(u("u_motion"), reduced ? 0 : 1);

    const uRes = u("u_res");
    const uTime = u("u_time");

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = deviceRatio(maxDpr) * renderScale;
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const draw = (t: number) => {
      resize();
      gl.useProgram(program);
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uTime, t * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let visible = true;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const now = entry.isIntersecting;
        if (now === visible) return;
        visible = now;
        if (!visible) {
          cancelAnimationFrame(raf);
          raf = 0;
        } else if (!raf && !reduced) {
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // El primer cuadro se pinta siempre, incluso con reduced-motion: si no, la
    // sección arranca en el color de fallback hasta que el lector scrollee.
    draw(0);
    if (!reduced) raf = requestAnimationFrame(loop);

    // No por `window.resize`: el canvas puede cambiar de tamaño sin que la
    // ventana lo haga. Con reduced-motion no hay lazo que repinte, así que el
    // observer tiene que dibujar él mismo.
    const ro = new ResizeObserver(() => {
      if (reduced) draw(0);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [fragment, tag, renderScale, maxDpr, uniformsKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ backgroundColor: fallback }}
    />
  );
}

/** `#00dc8d` → `[0, 0.862, 0.553]`. Los shaders reciben color en 0..1. */
// Re-export por compatibilidad: la función se mudó a `gl/color.ts` porque este
// módulo es de cliente y ella se llama al armar la tabla de uniformes, que a
// veces ocurre en un server component. Ver la nota de aquel archivo.
export { hexToRgb } from "@/components/sections/protocol-labs/opening-labs/gl/color";
