"use client";

import { useCallback, useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import SectionCut, { CUT_TO, fitCanvas, noise } from "@/components/sections/transition-labs/SectionCut";

// ── J · Melt ─────────────────────────────────────────────────────────────────
//
// La tinta INUNDA la página desde el pie, pero su borde no es una línea: es un
// frente irregular con dedos que se adelantan y bahías que se quedan atrás. Lo
// que sube no parece un panel, parece líquido, y por encima de él la sección de
// arriba se sigue viendo hasta que la alcanza.
//
// Cuando el frente termina de cubrir, detrás ya está la sección siguiente — eso
// lo resuelve el `lead` de `SectionCut`, no el dibujo.
//
// Es el único de los siete en el que el negro tiene materia. Los demás son
// geometría —lamas, celdas, puntos, un pliegue—; este es un fluido.
//
// ── Canvas 2D y no un shader ────────────────────────────────────────────────
//
// La primera idea era un shader de desplazamiento que deformara lo que hay
// debajo. No se puede: un shader no lee el DOM, así que habría que rasterizar
// la sección de arriba a una textura —y eso son las mismas trampas que ya
// paga `hero-alt` 04 (el texto deja de ser texto).
//
// Dibujando SOLO el frente, el problema desaparece: lo de arriba se ve porque
// el canvas es transparente donde no hay tinta, y el borde puede ser tan
// caprichoso como se quiera. Además son ~200 columnas por frame, que es menos
// trabajo que compilar un programa de GL.
//
// ── Ruido INTERPOLADO, no un hash ───────────────────────────────────────────
//
// El primer intento sampleaba el hash directamente por columna. Un hash da
// valores independientes para posiciones vecinas: el resultado no era un
// líquido, era una forma de onda de audio —dientes de 3px, todos distintos—.
//
// El ruido de verdad interpola entre los valores de una retícula, con una curva
// suave (smoothstep) entre nodo y nodo. Eso es lo que hace que la altura de una
// columna se parezca a la de su vecina, que es la definición práctica de que
// algo se vea continuo.
//
// Tres octavas: una lenta (los golfos), una media (los dedos) y una fina de
// poca amplitud (el temblor del borde). Una sola frecuencia da una onda, y una
// onda se lee como decoración.
//
// ── El frente sobrepasa la pantalla ─────────────────────────────────────────
//
// Al final la altura base es 1.25 de la pantalla: si el frente terminara justo
// en el borde de arriba, los golfos más profundos dejarían bahías de cream
// asomando en el último frame. Con el exceso, cuando el gesto acaba la pantalla
// está negra de verdad.

// Ancho de la columna con la que se muestrea el frente. A 6px el borde se ve
// continuo; más fino no se distingue y cuesta el triple.
const STEP = 6;

/**
 * Ruido de valor en 1D: hash en los nodos enteros de la retícula e
 * interpolación suave entre ellos. `seed` separa las octavas para que no
 * compartan los mismos nodos y se sumen en fase.
 */
const vnoise = (x: number, seed: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return noise(i, seed) * (1 - u) + noise(i + 1, seed) * u;
};

export default function CutMelt() {
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

    // Altura base del frente, con el exceso que garantiza el cierre.
    const base = h * p * 1.25;
    // La amplitud se APAGA al final: mientras sube, el frente es muy irregular;
    // cuando ya cubrió, un borde ondulado fuera de cuadro no aporta nada y sí
    // puede dejar bahías.
    const amp = h * 0.16 * (1 - p) * (1 - p);

    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + STEP; x += STEP) {
      const n =
        vnoise(x * 0.004, 0) * 1.0 +
        vnoise(x * 0.012, 7.3) * 0.5 +
        vnoise(x * 0.038, 21.7) * 0.2;
      // n va de 0 a ~1.7; se centra para que el frente no suba de media.
      const y = h - base + (n / 1.7 - 0.5) * 2 * amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w + STEP, h);
    ctx.closePath();
    ctx.fill();
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
