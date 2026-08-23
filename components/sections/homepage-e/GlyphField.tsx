"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";

// El campo de caracteres que respira detrás del statement de `AgentEconomy`.
//
// Una grilla de letras de "near" pintadas casi al borde de lo visible, más densa
// hacia abajo, con unas pocas encendidas. Es textura, no información: va
// `aria-hidden` y no lleva ni una palabra que alguien deba leer.
//
// ── Por qué canvas y no DOM ──────────────────────────────────────────────────
//
// Un card de 1600×760 a celda de 14px son ~6.200 celdas. En DOM eso es 6.200
// nodos que el layout tiene que medir y que el compositor tiene que pintar por
// separado; en canvas es un solo elemento y un solo paint. La textura además no
// se selecciona, no se busca con ⌘F y no entra en el árbol de accesibilidad —
// las tres cosas que hacen que 6.200 spans sean una mala idea.
//
// Tampoco es WebGL: no hay animación por frame que justifique un contexto GL. Se
// dibuja UNA vez por tamaño y se queda quieto.
//
// ── Por qué un hash 2D y no `createSeededRandom` ─────────────────────────────
//
// `motion/seededRandom.ts` da una SECUENCIA determinista, y para lo que ese
// módulo resuelve —sembrar N elementos y re-sembrar los mismos N— es lo correcto.
// Acá no sirve: al cambiar el ancho cambia la cantidad de columnas, así que el
// consumo se desalinea y la celda (3, 5) recibe otro valor del que tenía. El
// resultado sería el campo entero reshuffleándose con cada resize.
//
// Con un hash de las COORDENADAS, la celda (3, 5) saca siempre lo mismo sin
// importar cuántas celdas haya alrededor: al ensanchar, lo que ya estaba pintado
// se queda como estaba y solo aparecen columnas nuevas a la derecha.
function hash2(x: number, y: number): number {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/** Lado de la celda en px CSS. Sale de medir la referencia: ~96 columnas en un
 *  card de ~1250px. */
const CELL = 13;

/** El alfabeto es el de la marca. No es decorativo: leído de cerca, el campo
 *  está hecho de "near" desarmado. */
const ALPHABET = "near";

/** El verde del campo es el MISMO de la itálica del statement (el card lo
 *  declara como `--glyph-ink` y esto lo lee de ahí, así que se tunea en un solo
 *  lugar). Este es el fallback para el primer paint, antes de que el custom
 *  property resuelva. */
const FALLBACK_INK = "120, 197, 82";

// ── El relieve del campo ─────────────────────────────────────────────────────
//
// Tres términos, y cada uno hace una cosa que se ve:
//
//   · la RAMPA vertical, que es lo que da la lectura de "se posa hacia abajo";
//   · la BANDA ancha centrada en ~76% de altura, que carga el tercio inferior sin
//     dibujar un borde: con sigma chica se lee como una franja pegada y el card
//     queda partido en dos;
//   · el ONDULADO de baja frecuencia (dos senos cruzados, sin período común), que
//     rompe las dos anteriores para que el campo no se lea en franjas.
function relief(tx: number, ty: number): number {
  const ramp = 0.1 + 0.6 * Math.pow(ty, 2.2);
  const band = 0.32 * Math.exp(-Math.pow((ty - 0.76) / 0.17, 2));
  const swell =
    0.13 * Math.sin(tx * 5.1 + ty * 2.3) + 0.1 * Math.sin(tx * 2.2 - ty * 7.4);
  return Math.max(0, Math.min(1, ramp + band + swell));
}

export default function GlyphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    if (!host) return;

    const cs = getComputedStyle(canvas);
    const ink = cs.getPropertyValue("--glyph-ink").trim() || FALLBACK_INK;

    // Canvas 2D NO resuelve custom properties dentro de `ctx.font`: un
    // `var(--font-mono)` ahí se descarta entero y la cadena queda inválida, así
    // que el navegador cae al `10px sans-serif` por defecto y la grilla sale con
    // la fuente equivocada y sin avisar. Hay que resolver la familia acá y
    // pasarle a `ctx.font` un valor ya literal.
    const family =
      cs.getPropertyValue("--font-mono").trim() || "ui-monospace, Menlo, monospace";

    const draw = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;

      const dpr = deviceRatio();
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${Math.round(CELL * 0.72)}px ${family}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);

      for (let r = 0; r < rows; r++) {
        const ty = (r + 0.5) / rows;
        for (let c = 0; c < cols; c++) {
          const roll = hash2(c, r);

          // Las celdas vacías son parte del dibujo: sin ellas la grilla se lee
          // como una trama regular en vez de como caracteres sueltos. Pero la
          // ocupación es ALTA —del 58% arriba al 97% abajo—: con la grilla rala
          // el campo se lee como suciedad dispersa, no como una superficie de
          // texto. Lo que separa una lectura de la otra es el alpha, no el hueco.
          const field = relief((c + 0.5) / cols, ty);
          if (roll > 0.58 + field * 0.39) continue;

          // Segundo hash con las coordenadas cruzadas: si la letra saliera del
          // mismo `roll` que decide la presencia, las celdas más tenues serían
          // siempre la misma letra.
          const ch = ALPHABET[Math.floor(hash2(r + 977, c) * ALPHABET.length)];

          // Una de cada ~90 se enciende. Son las que hacen que el campo se lea
          // como algo vivo y no como una textura plana.
          const hot = hash2(c + 4271, r + 1153) < 0.011;
          const alpha = hot ? 0.3 + field * 0.3 : 0.075 + field * 0.11;

          ctx.fillStyle = `rgba(${ink}, ${alpha.toFixed(3)})`;
          ctx.fillText(ch, (c + 0.5) * CELL, (r + 0.5) * CELL);
        }
      }
    };

    draw();

    // El card crece con el viewport y con la altura del statement (que reflowea
    // al cambiar el ancho), así que se observa la CAJA y no `window.resize`: un
    // cambio de alto por reflow no dispara resize y dejaría el canvas corto.
    const ro = new ResizeObserver(draw);
    ro.observe(host);

    // La fuente mono llega tarde: el primer paint puede caer con el fallback del
    // sistema y las métricas cambian lo suficiente para que se note.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) draw();
    });

    return () => {
      alive = false;
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
