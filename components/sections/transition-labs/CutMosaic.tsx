"use client";

import { useCallback, useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import SectionCut, { clamp01, fitCanvas, noise } from "@/components/sections/transition-labs/SectionCut";

// ── H · Mosaic ───────────────────────────────────────────────────────────────
//
// La pantalla no se cubre: se REEMPLAZA por partes. Una retícula de celdas y
// cada una se pinta de negro cuando le toca, en un orden de ruido — ni fundido
// ni barrido.
//
// ── El orden es ruido, no azar ──────────────────────────────────────────────
//
// Cada celda tiene un umbral determinista sacado de su posición. Eso da dos
// cosas que el azar no da: el dibujo es idéntico si el lector sube y vuelve a
// bajar (con `Math.random` el mosaico se rearmaría distinto cada vez, y se lee
// como un parpadeo), y no hace falta guardar estado por celda.
//
// ── Por qué cada celda tiene su propia rampa ────────────────────────────────
//
// Una celda no aparece de golpe: cruza su umbral y se funde en ~0.16 del
// recorrido. Encendiéndose de golpe, el mosaico se ve como estática de
// televisor; con la rampa corta, se ve como piezas apoyándose.
//
// ── Sin ticker ──────────────────────────────────────────────────────────────
//
// El dibujo depende SOLO del progreso, así que se repinta cuando el scroll se
// mueve y no 60 veces por segundo. Un ResizeObserver lo vuelve a pintar con el
// último progreso cuando cambia el tamaño.

// Lado de la celda en px de CSS. A 44 se lee como retícula; más chico empieza a
// parecer ruido y más grande, un tablero de ajedrez.
const CELL = 44;

export default function CutMosaic() {
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
    ctx.fillStyle = "#101010";

    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // El umbral mezcla ruido con una leve pendiente vertical: el mosaico
        // avanza de abajo hacia arriba lo justo para tener dirección, sin
        // llegar a leerse como un barrido.
        const t = noise(x, y) * 0.82 + (1 - y / rows) * 0.18;
        const a = clamp01((p * 1.18 - t) / 0.16);
        if (a <= 0) continue;
        ctx.globalAlpha = a;
        // +1 en el tamaño: sin eso, el redondeo del dispositivo deja hilos de
        // fondo entre celdas contiguas y la pantalla nunca queda negra del todo.
        ctx.fillRect(x * CELL, y * CELL, CELL + 1, CELL + 1);
      }
    }
    ctx.globalAlpha = 1;
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
    <SectionCut travel="160svh" settle={0.85} draw={draw}>
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </SectionCut>
  );
}
