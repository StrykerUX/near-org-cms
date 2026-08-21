"use client";

import { useEffect, useRef } from "react";
import { getGl2, buildProgram } from "@/components/primitives/motion/glContext";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { FOLIAGE_VERT, FOLIAGE_FRAG, type FoliageVariant } from "./gl/foliage";
import type { FoliageParams } from "./gl/params";

// Factor de resolución del buffer.
//
// 0.6 y no 1: el contenido es blur puro, sin un solo borde duro que pueda
// aliasear, así que lo que se pierde al renderizar por debajo del canvas no se
// ve — y el costo cae con el CUADRADO del factor (0.6² ≈ 0.36, casi un tercio).
// Es la misma economía que hace `hero-burst`, y en las variantes de 13 taps es
// la diferencia entre correr a 60fps y no correr.
//
// El grano se aplica DESPUÉS del upscale del navegador, así que también sale
// más grueso de lo que pediría un buffer a resolución nativa. Ahí se compensa
// bajando `grain` en el panel, no subiendo este factor.
const RENDER_SCALE = 0.6;

// Tope de densidad por encima del de `deviceRatio`. Con RENDER_SCALE ya
// aplicado, dpr 2 sobre una pantalla retina sigue dando un buffer generoso para
// una imagen sin bordes.
const MAX_DPR = 1.75;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

type Props = {
  variant: FoliageVariant;
  params: FoliageParams;
  className?: string;
};

export default function FoliageCanvas({ variant, params, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Los parámetros van por ref y NO por dependencia del efecto de abajo.
  //
  // Si estuvieran en su array de dependencias, mover un slider recompilaría el
  // programa y recrearía el contexto en cada frame del arrastre. El lazo de rAF
  // lee el valor vigente en cada frame; el efecto solo se rehace cuando cambia
  // la VARIANTE, que es lo único que de verdad cambia el shader.
  //
  // La escritura va en un efecto y no suelta en el cuerpo del componente: un
  // render puede descartarse antes de commitearse, y escribir el ref ahí deja
  // al lazo pintando parámetros de un render que nunca llegó a existir.
  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = getGl2(canvas);
    if (!gl) return; // sin WebGL2 utilizable: el fallback CSS de abajo queda a la vista

    const program = buildProgram(
      gl,
      FOLIAGE_VERT,
      FOLIAGE_FRAG[variant],
      `foliage:${variant}`
    );
    if (!program) return;

    // Un quad a pantalla completa como triángulo doble. El buffer se crea una
    // vez y vive lo que viva el efecto.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    gl.useProgram(program);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // Las ubicaciones se resuelven UNA vez y no por frame: `getUniformLocation`
    // hace una búsqueda por nombre en el programa linkeado, y con 20 uniformes a
    // 60fps eso es tráfico gratuito hacia el driver.
    const u = (name: string) => gl.getUniformLocation(program, name);
    const U = {
      res: u("u_res"),
      time: u("u_time"),
      focus: u("u_focus"),
      scale: u("u_scale"),
      curl: u("u_curl"),
      curlScale: u("u_curlScale"),
      blur: u("u_blur"),
      detail: u("u_detail"),
      detailFall: u("u_detailFall"),
      contrast: u("u_contrast"),
      lift: u("u_lift"),
      gradAngle: u("u_gradAngle"),
      gradSpread: u("u_gradSpread"),
      gradGamma: u("u_gradGamma"),
      gradMix: u("u_gradMix"),
      grain: u("u_grain"),
      drift: u("u_drift"),
      c0: u("u_c0"),
      c1: u("u_c1"),
      c2: u("u_c2"),
      c3: u("u_c3"),
      c4: u("u_c4"),
    };

    // `prefers-reduced-motion` no apaga el shader: pinta UN cuadro y se queda
    // ahí. La imagen es el contenido del hero — quitarla dejaría un rectángulo
    // vacío, que es peor que una imagen quieta. Lo que se apaga es el
    // movimiento, vía `u_drift = 0`.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      const p = paramsRef.current;
      resize();

      gl.useProgram(program);
      gl.uniform2f(U.res, width, height);
      gl.uniform1f(U.time, t * 0.001);
      gl.uniform2f(U.focus, p.focusX, p.focusY);
      gl.uniform1f(U.scale, p.scale);
      gl.uniform1f(U.curl, p.curl);
      gl.uniform1f(U.curlScale, p.curlScale);
      gl.uniform1f(U.blur, p.blur);
      gl.uniform1f(U.detail, p.detail);
      gl.uniform1f(U.detailFall, p.detailFall);
      gl.uniform1f(U.contrast, p.contrast);
      gl.uniform1f(U.lift, p.lift);
      gl.uniform1f(U.gradAngle, p.gradAngle);
      gl.uniform1f(U.gradSpread, p.gradSpread);
      gl.uniform1f(U.gradGamma, p.gradGamma);
      gl.uniform1f(U.gradMix, p.gradMix);
      gl.uniform1f(U.grain, p.grain);
      gl.uniform1f(U.drift, reduced ? 0 : p.drift);
      gl.uniform3fv(U.c0, hexToRgb(p.c0));
      gl.uniform3fv(U.c1, hexToRgb(p.c1));
      gl.uniform3fv(U.c2, hexToRgb(p.c2));
      gl.uniform3fv(U.c3, hexToRgb(p.c3));
      gl.uniform3fv(U.c4, hexToRgb(p.c4));

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let visible = true;

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    // IntersectionObserver y no `onViewportToggle`: ese helper crea un
    // ScrollTrigger y exige vivir dentro de un `gsap.context()`, y este canvas
    // no depende de GSAP para nada más. Acoplarlo obligaría a montarlo siempre
    // bajo un provider de motion.
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

    // El primer cuadro se pinta siempre, aunque haya reduced-motion o el canvas
    // arranque fuera de pantalla: si no, el hero se vería negro hasta que el
    // lector scrollee.
    draw(0);
    if (!reduced) raf = requestAnimationFrame(loop);

    // El resize NO va por `window.resize`: el canvas puede cambiar de tamaño sin
    // que la ventana lo haga (el panel del lab colapsa, un contenedor flex se
    // reparte de nuevo). Con reduced-motion no hay lazo que repinte, así que el
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
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      // El fallback es el color de sombra de la paleta y no negro: si WebGL2 no
      // está disponible el hero queda en verde oscuro, que sigue siendo la
      // familia correcta y deja el texto blanco legible.
      style={{ backgroundColor: "#0a2018" }}
    />
  );
}
