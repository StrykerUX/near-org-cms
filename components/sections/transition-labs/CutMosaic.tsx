"use client";

import { useCallback, useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import SectionCut, { CUT_FROM, clamp01, fitCanvas, noise } from "@/components/sections/transition-labs/SectionCut";

// ── H · Mosaic ───────────────────────────────────────────────────────────────
//
// La pantalla no se cubre: se REEMPLAZA por partes. Una retícula de celdas, y
// cada una se BORRA cuando le toca, dejando ver la sección de abajo — que ya
// está montada detrás. Ni fundido ni barrido: reemplazo pieza a pieza.
//
// ── Se borra, no se pinta ───────────────────────────────────────────────────
//
// El canvas arranca lleno del color de la sección que sale y las celdas se
// abren con `destination-out`. Pintando negro encima, la sección siguiente
// llegaba DESPUÉS del gesto y quedaba una cola de pantalla negra sin nada;
// borrando, la última celda que cae ya te deja dentro de la sección.
//
// ── De abajo hacia arriba ───────────────────────────────────────────────────
//
// El umbral de cada celda mezcla ruido con una pendiente vertical, y la
// pendiente es CUADRÁTICA: las de abajo se abren casi todas juntas y arriba
// llegan cada vez más espaciadas. Con la pendiente lineal —y con el peso que
// tenía antes, 0.18— la dirección no se percibía y el mosaico parecía puro
// azar.
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
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = CUT_FROM;
    ctx.fillRect(0, 0, w, h);

    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);

    // A partir de acá se BORRA: cada celda abre un agujero en el velo.
    ctx.globalCompositeOperation = "destination-out";

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // `depth` es 0 en la fila de ABAJO y 1 en la de arriba, al cuadrado:
        // umbral bajo abajo (se abren casi todas juntas) y alto arriba (llegan
        // espaciadas). Con la cuenta al revés el mosaico se abre desde arriba,
        // que es justo lo contrario.
        const depth = rows > 1 ? 1 - y / (rows - 1) : 0;
        const t = noise(x, y) * 0.45 + depth * depth * 0.55;
        const a = clamp01((p * 1.12 - t) / 0.14);
        if (a <= 0) continue;
        ctx.globalAlpha = a;
        // +1 en el tamaño: sin eso, el redondeo del dispositivo deja hilos de
        // velo entre celdas contiguas y la pantalla nunca se abre del todo.
        ctx.fillRect(x * CELL, y * CELL, CELL + 1, CELL + 1);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
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

  // Los valores por defecto de `SectionCut`: 160svh de tramo, 100 de solape
  // hacia atrás y 40 de lead ⇒ 20svh netos, el presupuesto de un corte que no
  // tiene nada que leer.
  return (
    <SectionCut draw={draw}>
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </SectionCut>
  );
}
