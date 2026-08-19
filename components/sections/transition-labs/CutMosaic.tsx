"use client";

import { useCallback, useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import SectionCut, { CUT_TO, clamp01, fitCanvas, noise } from "@/components/sections/transition-labs/SectionCut";

// ── H · Mosaic ───────────────────────────────────────────────────────────────
//
// La pantalla no se cubre de golpe: se REEMPLAZA por partes. Una retícula de
// celdas que se posan una a una sobre la sección de arriba, en orden de ruido.
// Ni fundido ni barrido: reemplazo pieza a pieza, y entre celda y celda la
// sección de arriba se sigue viendo.
//
// El canvas es transparente y solo se pintan las celdas. Cuando la última cae,
// detrás ya está la sección siguiente — eso lo resuelve el `lead` de
// `SectionCut`, no el dibujo.
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
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = CUT_TO;

    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // `depth` es 0 en la fila de ABAJO y 1 en la de arriba, al cuadrado:
        // umbral bajo abajo (caen casi todas juntas) y alto arriba (llegan
        // espaciadas). Con la cuenta al revés el mosaico entra desde arriba,
        // que es justo lo contrario.
        const depth = rows > 1 ? 1 - y / (rows - 1) : 0;
        const t = noise(x, y) * 0.45 + depth * depth * 0.55;
        const a = clamp01((p * 1.12 - t) / 0.14);
        if (a <= 0) continue;
        ctx.globalAlpha = a;
        // +1 en el tamaño: sin eso, el redondeo del dispositivo deja hilos sin
        // pintar entre celdas contiguas y la pantalla nunca cierra del todo.
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

  // 150svh de tramo menos los 100 de solape hacia atrás ⇒ 50svh de gesto, y
  // 50svh netos: sin `lead`, porque el borde de la sección entrante se vería
  // subir por debajo de las celdas como una línea divisoria (ver `SectionCut`).
  return (
    <SectionCut travel="150svh" draw={draw}>
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </SectionCut>
  );
}
