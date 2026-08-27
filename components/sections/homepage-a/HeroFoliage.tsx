"use client";

import { useEffect, useRef } from "react";
import { getGl2, buildProgram } from "@/components/primitives/motion/glContext";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { FOLIAGE_VERT, FOLIAGE_FRAG } from "@/components/sections/homepage-a/gl/foliage";

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
const P = {
  focusX: 1.28,
  focusY: 0.58,
  scale: 3.4,
  curl: 1.35,
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
// ⚠️ La rampa NO entra al sistema de color, y es la única excepción de arte del
// sitio junto con `stackArt.generated.tsx`. Son cinco paradas de una película:
// aplanarlas al verde de marca no la simplifica, la borra —queda un plano de un
// color—. Lo que sí sigue a la marca es la parada MEDIA, la que se lee como «el
// verde» del follaje; las otras cuatro son la luz y la sombra que hacen el
// volumen, y sus topes (ni satura por arriba ni cierra en negro puro) son buena
// parte de por qué se lee como película.
const PALETTE = ["#e8efbe", "#b5cc86", "#00dc8d", "#1f5540", "#0a2018"] as const;

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

export default function HeroFoliage({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = getGl2(canvas);
    if (!gl) return; // sin WebGL2 utilizable queda el color de fondo del canvas

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
    gl.uniform2f(u("u_focus"), P.focusX, P.focusY);
    gl.uniform1f(u("u_scale"), P.scale);
    gl.uniform1f(u("u_curl"), P.curl);
    gl.uniform1f(u("u_curlScale"), P.curlScale);
    gl.uniform1f(u("u_blur"), P.blur);
    gl.uniform1f(u("u_detail"), P.detail);
    gl.uniform1f(u("u_detailFall"), P.detailFall);
    gl.uniform1f(u("u_contrast"), P.contrast);
    gl.uniform1f(u("u_lift"), P.lift);
    gl.uniform1f(u("u_gradAngle"), P.gradAngle);
    gl.uniform1f(u("u_gradSpread"), P.gradSpread);
    gl.uniform1f(u("u_gradGamma"), P.gradGamma);
    gl.uniform1f(u("u_gradMix"), P.gradMix);
    gl.uniform1f(u("u_grain"), P.grain);
    gl.uniform1f(u("u_drift"), reduced ? 0 : P.drift);
    PALETTE.forEach((hex, i) => gl.uniform3fv(u(`u_c${i}`), hexToRgb(hex)));

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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      // El fallback es la parada CLARA de la paleta, no la de sombra.
      //
      // Estuvo en `PALETTE[4]` (#0a2018) con el argumento de que sin WebGL2 el
      // hero quedaba en verde oscuro, «que sigue siendo la familia correcta».
      // La familia sí; la legibilidad no: el titular del hero es tinta oscura y
      // sobre esa parada da 1.13:1 — o sea que quien no tenga WebGL2 utilizable
      // ve un rectángulo verde sin texto. Sobre `PALETTE[1]` da 8.61:1 y sigue
      // siendo la misma paleta.
      //
      // No se ve cuando el shader arranca: lo tapa el primer cuadro. Es
      // exactamente el caso que nadie mira, y por eso conviene que sea el
      // legible.
      style={{ backgroundColor: PALETTE[1] }}
    />
  );
}
