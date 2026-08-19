"use client";

import { useCallback, useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import SectionCut, { CUT_TO, clamp01, fitCanvas } from "@/components/sections/transition-labs/SectionCut";

// ── I · Halftone ─────────────────────────────────────────────────────────────
//
// La página se IMPRIME. Una trama de medio tono se posa SOBRE la sección de
// arriba —que sigue ahí, visible entre los puntos— y los puntos engordan hasta
// tocarse. Cuando se tocan, detrás ya está la sección siguiente. El corte no es
// un telón: es un proceso de reproducción.
//
// El canvas es TRANSPARENTE y solo se pintan los puntos. Se probó lo contrario
// —un velo del color de la sección que sale, con los puntos abriéndolo— y se
// descartó: el velo tapa de golpe en el primer frame, así que la sección de
// arriba desaparece antes de que la trama diga nada.
//
// Es el gesto más editorial de todos, y por eso está: esta página se apoya en
// la tipografía, no en la tecnología, y una trama de imprenta habla el mismo
// idioma que su titular en serif.
//
// ── La retícula va girada 45° ───────────────────────────────────────────────
//
// Como en imprenta de verdad. Con la trama a 0° el ojo ve filas y columnas —una
// rejilla— y con 45° ve textura. Es la razón por la que la industria eligió ese
// ángulo hace un siglo y sigue siendo válida en una pantalla.
//
// ── El radio pasa de la diagonal de la celda ────────────────────────────────
//
// Un punto inscrito en su celda (radio = mitad del lado) deja los cuatro huecos
// entre puntos sin cubrir: la pantalla se queda gris para siempre. El radio
// final tiene que llegar a la MITAD DE LA DIAGONAL (×√2) para que los huecos
// cierren, y por eso el último tramo de la rampa es el que de verdad apaga la
// pantalla.

// Paso de la trama en px de CSS.
const PITCH = 26;
const ANGLE = (45 * Math.PI) / 180;

export default function CutHalftone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastP = useRef(0);

  const paint = useCallback((p: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = deviceRatio();
    const { w, h } = fitCanvas(canvas, dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = CUT_TO;

    // Radio máximo: media diagonal de la celda, para que los huecos cierren.
    const rMax = (PITCH / 2) * Math.SQRT2;
    const cos = Math.cos(ANGLE);
    const sin = Math.sin(ANGLE);
    // La retícula girada tiene que cubrir la diagonal de la pantalla.
    const reach = Math.ceil(Math.hypot(w, h) / PITCH / 2) + 1;
    const cx = w / 2;
    const cy = h / 2;

    for (let j = -reach; j <= reach; j++) {
      for (let i = -reach; i <= reach; i++) {
        const x = cx + (i * cos - j * sin) * PITCH;
        const y = cy + (i * sin + j * cos) * PITCH;
        if (x < -PITCH || x > w + PITCH || y < -PITCH || y > h + PITCH) continue;

        // Los puntos de abajo engordan antes: la tinta entra por el pie de la
        // página. Sin ese sesgo la trama crece toda a la vez y parece un fundido
        // con textura, no una impresión.
        const bias = 0.65 + (y / h) * 0.35;
        const t = clamp01(p * 1.25 * bias);
        const r = rMax * t * t;
        if (r <= 0.2) continue;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  const draw = useCallback(
    (p: number) => {
      lastP.current = p;
      paint(p);
    },
    [paint]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => paint(lastP.current));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [paint]);

  return (
    <SectionCut draw={draw}>
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </SectionCut>
  );
}
