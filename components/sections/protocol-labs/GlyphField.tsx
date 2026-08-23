"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";

// El campo de caracteres de las aperturas E (oscura) y G (clara).
//
// Nació dentro de `OpeningE` y salió de ahí cuando apareció la versión en
// claro: son ~120 líneas de canvas, y dos copias divergen en la primera
// corrección de la onda o de la siembra de palabras.
//
// ── Qué dibuja ─────────────────────────────────────────────────────────────
//
// Una retícula densa de caracteres monoespaciados con las palabras del
// protocolo —SHARD, FINALITY, WITNESS, SIGNATURE— sembradas entre ruido. Una
// onda diagonal lenta las va encendiendo por tramos, así que aparecen y se
// disuelven sin que nada se mueva de lugar.
//
// ── El tono no es un cambio de color, es otra calibración ─────────────────
//
// Sobre negro, tinta clara sobre fondo oscuro: el ojo suma luz y un alfa de 6%
// ya se ve. Sobre crema pasa lo contrario —el ojo resta— y ese mismo 6% de
// tinta oscura se lee MÁS marcado que su equivalente en oscuro. Por eso los dos
// tonos no comparten números: el claro arranca de una base más baja y su pico
// llega menos lejos.
//
// El claro además usa DOS colores y el oscuro uno solo. En oscuro el verde de la
// marca funciona en todo el rango; en claro, `--near-green-accent` no llega a
// 3:1 sobre crema, así que el campo apagado va en gris de tinta y sólo el frente
// de la onda pasa a `--green-ink`, que es el verde legible sobre claro. Es la
// misma distinción que `globals.css` documenta entre esos dos tokens.
//
// ── Por qué el texto va en canvas y no en el DOM ──────────────────────────
//
// Son varios miles de celdas repintadas cada frame. En el DOM son varios miles
// de nodos con su propio estilo — el navegador puede, pero el costo de layout no
// se paga por un fondo. En canvas es una llamada de dibujo por celda sobre un
// buffer a media densidad.
//
// El campo es `aria-hidden` y decorativo: nada de lo que dice es contenido, y
// las palabras que aparecen ya están en la página como texto real.

// Las palabras que el campo esconde. Salen del vocabulario real del protocolo
// —no son decorativas— para que quien las encuentre esté leyendo la página.
const WORDS = [
  "SHARD",
  "FINALITY",
  "WITNESS",
  "SIGNATURE",
  "NIGHTSHADE",
  "PRIVATE",
  "QUANTUM",
  "MAINNET",
];
const NOISE = "0123456789ABCDEF·:+—";

// Calibración por tono. Los números del claro NO son los del oscuro con otro
// color: ver la nota de arriba sobre por qué.
const TONE = {
  dark: {
    // Un solo color en todo el rango: sobre negro el verde de la marca se lee
    // desde el alfa más bajo hasta el más alto.
    base: "139, 242, 156",
    lit: "139, 242, 156",
    floor: 0.06,
    peak: 0.5,
    // Por encima de este valor de la onda, el glifo pasa al color `lit`. En
    // oscuro no hay salto de color, así que el umbral no se usa.
    threshold: 2,
  },
  light: {
    // Gris de tinta para el campo apagado — el verde de la marca no llega a 3:1
    // sobre crema y a alfa bajo desaparecería.
    base: "16, 16, 16",
    // `--green-ink`: el verde legible sobre claro.
    lit: "0, 168, 107",
    floor: 0.05,
    peak: 0.42,
    threshold: 0.5,
  },
} as const;

export default function GlyphField({
  tone = "dark",
  className,
}: {
  tone?: keyof typeof TONE;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = TONE[tone];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const CELL = 15;
    let cols = 0;
    let rows = 0;
    let chars: string[] = [];
    let dpr = 1;

    // La grilla se rearma sólo cuando cambia el tamaño, no cada frame: el
    // contenido de cada celda tiene que ser ESTABLE, o el campo se convierte en
    // estática de televisor y las palabras dejan de poder leerse.
    const build = () => {
      dpr = deviceRatio(1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      chars = new Array(cols * rows);

      for (let i = 0; i < chars.length; i++) {
        chars[i] = NOISE[Math.floor(Math.random() * NOISE.length)];
      }
      // Las palabras se siembran DESPUÉS del ruido, pisándolo: al revés el ruido
      // las taparía en parte y quedarían ilegibles.
      const seeds = Math.max(4, Math.round((cols * rows) / 900));
      for (let s = 0; s < seeds; s++) {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * Math.max(1, cols - word.length));
        for (let k = 0; k < word.length; k++) chars[row * cols + col + k] = word[k];
      }
    };

    let raf = 0;
    let visible = true;

    const draw = (t: number) => {
      const time = t * 0.001;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.font = "500 11px var(--font-montreal-mono), ui-monospace, monospace";
      ctx.textBaseline = "top";

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Onda diagonal lenta. Diagonal y no horizontal: en horizontal el
          // frente coincide con los renglones de las palabras y las enciende
          // enteras de golpe, lo que se lee como un parpadeo.
          const wave = Math.sin(x * 0.14 + y * 0.22 - time * 0.6);
          const crest = Math.max(0, wave);
          const alpha = cfg.floor + crest ** 3 * cfg.peak;
          ctx.fillStyle = `rgba(${crest > cfg.threshold ? cfg.lit : cfg.base}, ${alpha})`;
          ctx.fillText(chars[y * cols + x], x * CELL, y * CELL);
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    build();
    draw(0);
    if (!reduced) raf = requestAnimationFrame(loop);

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

    const ro = new ResizeObserver(() => {
      build();
      draw(0);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [tone]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
