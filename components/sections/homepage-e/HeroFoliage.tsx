"use client";

import { useEffect, useRef } from "react";
import { getGl2, buildProgram } from "@/components/primitives/motion/glContext";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { FOLIAGE_VERT, FOLIAGE_FRAG } from "@/components/sections/homepage-e/gl/foliage";

// El canvas del fondo del hero. Versión de producción del que vive en el lab
// `/prototype/hero-ab9-gl`: mismo shader, sin el panel de sliders ni la
// conmutación de variantes, y con los uniformes subidos UNA vez en vez de por
// frame (ver más abajo).

// ── Calibración ─────────────────────────────────────────────────────────────
//
// Los valores salieron del panel del lab, comparando contra el frame de
// referencia. Los que más cambian el resultado, y por qué están donde están:
//
//   · `focus` vive FUERA del canvas, a la derecha (x > 1): es el punto al que
//     apuntan las estrías, y ponerlo adentro haría visible el centro de un
//     remolino.
//   · `gradMix × contrast` es el número que de verdad importa del follaje: es
//     la amplitud con la que abolla el degradé, y el degradé solo recorre 1.0
//     de punta a punta. Pasado ~0.45 el follaje tapa la dirección de la luz y
//     la imagen se vuelve un mármol verde sin encuadre.
//   · `gradGamma > 1` aprieta la zona clara contra la esquina iluminada y deja
//     el resto en los verdes medios. Sin esa curva solo se puede elegir entre
//     "todo medio" y "dos bloques con una costura diagonal".
/**
 * La calibración del shader, con cada valor como `number` y no como el literal
 * que `as const` deja en `P`. Sin este remapeo, `focusX` tendría el tipo `1.28`
 * y ninguna recalibración compilaría — que es lo contrario de para qué existe.
 */
export type FoliageParams = { [K in keyof typeof P]: number };

const P = {
  focusX: 1.28,
  focusY: 0.58,
  scale: 3.4,
  curl: 1.35,
  // 0 = flujo radial, el del hero. Ver `u_swirl` en el shader.
  swirl: 0,
  curlScale: 1.1,
  blur: 3.4,
  detail: 0.72,
  detailFall: 1.45,
  contrast: 1.35,
  lift: 0.0,
  gradAngle: -0.72,
  gradSpread: 1.15,
  gradGamma: 1.5,
  gradMix: 0.34,
  grain: 0.032,
  // Deriva lenta del campo. Es lo único que se mueve: el hero ya no scrubbea
  // nada con el scroll, así que este es todo el movimiento que tiene.
  drift: 1,
} as const;

// De la luz a la sombra. La primera no es blanca ni la última negra a
// propósito: la referencia nunca satura por arriba —su punto más claro sigue
// siendo un crema verdoso— ni cierra en negro puro, y esos dos topes son buena
// parte de por qué se lee como película y no como un degradé sintético.
const PALETTE = ["#e8efbe", "#b5cc86", "#5e8f5c", "#1f5540", "#0a2018"] as const;

// Resolución del buffer, como fracción del canvas.
//
// 0.6 y no 1: el contenido es blur puro, sin un solo borde duro que pueda
// aliasear, así que lo que se pierde no se ve — y el costo cae con el CUADRADO
// del factor (0.6² ≈ 0.36). Misma economía que `hero-burst`.
const RENDER_SCALE = 0.6;

// Tope de densidad por encima del de `deviceRatio`. Con RENDER_SCALE aplicado,
// esto ya da un buffer generoso para una imagen sin bordes.
const MAX_DPR = 1.75;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export type HeroFoliageProps = {
  className?: string;
  /**
   * Recalibración del shader. Se mezcla sobre los valores del hero, así que un
   * consumidor solo declara lo que cambia.
   *
   * Existe porque el mismo campo sirve para dos cosas distintas: el paisaje del
   * hero —luz diagonal, verdes medios, el foco fuera a la derecha— y el flujo
   * del stack, que es el mismo shader con la luz naciendo abajo al centro y
   * casi todo el cuadro en negro. Duplicar el componente para eso serían 130
   * líneas idénticas y un segundo sitio donde arreglar el mismo bug.
   */
  params?: Partial<FoliageParams>;
  /** Las cinco paradas del degradé, de la luz a la sombra. */
  palette?: readonly string[];
};

export default function HeroFoliage({
  className,
  params,
  palette,
}: HeroFoliageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Los dos entran como dependencias del efecto para que un cambio de
  // calibración recree el programa. En la práctica son constantes de módulo en
  // los dos consumidores, así que el efecto corre una vez.
  const key = JSON.stringify([params, palette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = getGl2(canvas);
    if (!gl) return; // sin WebGL2 utilizable queda el color de fondo del canvas

    const cfg = { ...P, ...params };
    const ramp = palette ?? PALETTE;

    const program = buildProgram(gl, FOLIAGE_VERT, FOLIAGE_FRAG, "hero-foliage");
    if (!program) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    gl.useProgram(program);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);

    // `prefers-reduced-motion` no apaga el fondo: pinta UN cuadro y se queda
    // ahí. La imagen ES el fondo del hero — quitarla dejaría un rectángulo
    // vacío detrás del titular, que es peor que una imagen quieta. Lo que se
    // apaga es el movimiento, vía `u_drift = 0`.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Los uniformes que NO cambian nunca se suben una sola vez.
    //
    // En el lab iban por frame porque un slider podía moverlos en cualquier
    // momento; acá son constantes, y mandar veinte uniformes a 60fps es
    // tráfico gratuito hacia el driver. Por frame quedan solo `u_res` y
    // `u_time`.
    gl.uniform2f(u("u_focus"), cfg.focusX, cfg.focusY);
    gl.uniform1f(u("u_scale"), cfg.scale);
    gl.uniform1f(u("u_curl"), cfg.curl);
    gl.uniform1f(u("u_swirl"), cfg.swirl);
    gl.uniform1f(u("u_curlScale"), cfg.curlScale);
    gl.uniform1f(u("u_blur"), cfg.blur);
    gl.uniform1f(u("u_detail"), cfg.detail);
    gl.uniform1f(u("u_detailFall"), cfg.detailFall);
    gl.uniform1f(u("u_contrast"), cfg.contrast);
    gl.uniform1f(u("u_lift"), cfg.lift);
    gl.uniform1f(u("u_gradAngle"), cfg.gradAngle);
    gl.uniform1f(u("u_gradSpread"), cfg.gradSpread);
    gl.uniform1f(u("u_gradGamma"), cfg.gradGamma);
    gl.uniform1f(u("u_gradMix"), cfg.gradMix);
    gl.uniform1f(u("u_grain"), cfg.grain);
    gl.uniform1f(u("u_drift"), reduced ? 0 : cfg.drift);
    ramp.forEach((hex, i) => gl.uniform3fv(u(`u_c${i}`), hexToRgb(hex)));

    const uRes = u("u_res");
    const uTime = u("u_time");

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = deviceRatio(MAX_DPR) * RENDER_SCALE;
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

    // El hero está al tope de la página, así que lo normal es que entre en
    // viewport; el observer existe para cuando el lector baja y el canvas sale
    // de pantalla — sin esto seguiría pintando a 60fps detrás del resto de la
    // home, que es todo lo que la página hace mientras se scrollea.
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

    // El primer cuadro se pinta siempre, aunque haya reduced-motion: si no, el
    // hero arrancaría en el color de fondo hasta que el lector scrollee.
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
      // Sin `loseContext()`: ver la nota larga en `glContext.ts` — con
      // StrictMode React reusa el mismo <canvas>, y perder el contexto acá deja
      // al segundo montaje con un contexto muerto y errores sin mensaje.
    };
  }, [key]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      // El fallback es la parada de sombra de la paleta y no negro: si WebGL2
      // no está disponible el hero queda en verde oscuro, que sigue siendo la
      // familia correcta.
      style={{ backgroundColor: PALETTE[4] }}
    />
  );
}
