"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── 06 · Plotter ─────────────────────────────────────────────────────────────
//
// Un registrador de aguja: la traza recorre el ancho de la sección y las seis
// pruebas son los seis picos del papel. Cero recorrido de scroll — lo que
// conduce la aguja es la posición X del puntero.
//
// ── El papel a la izquierda de la aguja está escrito; a la derecha, no ──────
//
// Es la idea entera de la versión. Un plotter no dibuja una curva completa que
// después se ilumina: dibuja hasta donde llegó la aguja, y lo de adelante
// todavía no existe. Por eso la traza se pinta en dos tramos con dos estilos, y
// la aguja es la frontera. Mover el puntero no "recorre" un gráfico ya hecho —
// lo escribe.
//
// Con el puntero quieto (o sin puntero) la aguja avanza sola, despacio, y
// vuelve al principio: la sección se registra a sí misma.
//
// ── Por qué canvas 2D y no SVG ──────────────────────────────────────────────
//
// La traza se recalcula en cada frame porque el temblor depende de dónde está
// la aguja. En SVG eso es reescribir un atributo `d` de ~900 puntos por frame y
// que el navegador re-parsee el path entero; en canvas es un `stroke()`. La
// versión 04 usa SVG porque sus seis círculos NO cambian de forma nunca — es la
// distinción, y no una preferencia.
//
// El contrato de canvas del repo, cumplido: `deviceRatio()` para el buffer,
// `onViewportToggle` para no dibujar fuera de vista, y `gsap.ticker` en vez de
// un `requestAnimationFrame` propio.

const N = PROOF_STATS.length;

// Dónde cae cada hito, en fracción del ancho. Repartidos con medio hueco en los
// extremos: pegados al borde, el pico se corta por la mitad.
const MARK_AT = (i: number) => (i + 0.5) / N;

// Ancho de cada pico, en fracción del ancho total. Angosto: si se solapan, el
// papel se lee como una onda continua y se pierde la idea de seis eventos.
const PEAK_W = 0.055;

// Altura del pico y del ruido de fondo, en fracción del alto del papel.
const PEAK_H = 0.42;
const NOISE_H = 0.035;

// Velocidad de la aguja en automático, en fracción del ancho por segundo.
const AUTO_SPEED = 0.085;

export default function PlotterTrace() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!host || !canvas || !section) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    // El interruptor de la escena lo escribe el efecto y NUNCA el JSX: es la
    // regla de `sections/README.md`. Sin él (sin JS, o si el contexto 2D no
    // existe) las seis fichas quedan en flujo normal y se leen las seis.
    section.dataset.plotter = "on";

    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-card]"));
    const pins = Array.from(section.querySelectorAll<HTMLElement>("[data-pin]"));

    // El ruido de fondo se siembra UNA vez y no se recalcula por frame: es el
    // grano del papel, no una señal. Recalculado en cada frame sería una
    // pantalla de televisión sin señal, que dice algo muy distinto.
    const rand = createSeededRandom();
    const grain = Array.from({ length: 512 }, () => rand() - 0.5);

    // Posición de la aguja, 0..1. `pointer` es el destino y `head` la posición
    // suavizada: la aguja PERSIGUE al puntero en vez de estar pegada a él, que
    // es lo que le da masa.
    let pointer = 0;
    let head = 0;
    let auto = true;
    let active = -1;

    const paperY = (x: number, w: number, h: number) => {
      const mid = h * 0.62;
      let y = mid;
      for (let i = 0; i < N; i++) {
        const d = (x / w - MARK_AT(i)) / PEAK_W;
        // Gaussiana: el pico sube y baja suave y no deja esquinas. Un triángulo
        // sería más barato y se vería como un diente de sierra.
        y -= h * PEAK_H * Math.exp(-d * d);
      }
      const g = grain[Math.floor((x / w) * (grain.length - 1))] ?? 0;
      return y + g * h * NOISE_H;
    };

    const setActive = (i: number) => {
      if (i === active) return;
      active = i;
      cards.forEach((card, j) => {
        gsap.to(card, { autoAlpha: j === i ? 1 : 0, duration: 0.3, overwrite: "auto" });
      });
      pins.forEach((pin, j) => {
        gsap.to(pin, {
          opacity: j === i ? 1 : 0.35,
          duration: 0.3,
          overwrite: "auto",
        });
      });
    };

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx2d.clearRect(0, 0, w, h);

      const headX = head * w;
      const step = Math.max(1, Math.floor(deviceRatio()));

      // Tramo NO registrado: la línea de reposo, tenue. Va primero para que el
      // tramo escrito la tape en el punto de contacto.
      ctx2d.beginPath();
      ctx2d.strokeStyle = "rgba(16,16,16,0.13)";
      ctx2d.lineWidth = deviceRatio();
      ctx2d.moveTo(headX, h * 0.62);
      ctx2d.lineTo(w, h * 0.62);
      ctx2d.stroke();

      // Tramo registrado: la traza real, hasta la aguja.
      ctx2d.beginPath();
      ctx2d.strokeStyle = "#101010";
      ctx2d.lineWidth = 1.6 * deviceRatio();
      ctx2d.lineJoin = "round";
      for (let x = 0; x <= headX; x += step) {
        const y = paperY(x, w, h);
        if (x === 0) ctx2d.moveTo(x, y);
        else ctx2d.lineTo(x, y);
      }
      ctx2d.stroke();

      // La aguja: una vertical que cruza el papel entero, más el punto de
      // contacto. La vertical es lo que hace legible DÓNDE está escribiendo;
      // solo con el punto, la frontera entre los dos tramos se pierde en los
      // valles.
      const ny = paperY(headX, w, h);
      ctx2d.beginPath();
      ctx2d.strokeStyle = "rgba(0,168,107,0.35)";
      ctx2d.lineWidth = deviceRatio();
      ctx2d.moveTo(headX, 0);
      ctx2d.lineTo(headX, h);
      ctx2d.stroke();

      ctx2d.beginPath();
      ctx2d.fillStyle = "#00a86b";
      ctx2d.arc(headX, ny, 3.4 * deviceRatio(), 0, Math.PI * 2);
      ctx2d.fill();
    };

    const resize = () => {
      const dpr = deviceRatio();
      const w = Math.max(1, Math.round(host.clientWidth * dpr));
      const h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Solo `prefers-reduced-motion` y `matchMedia` directo: declarar
      // `isDesktop` como condición haría que cruzar los 1024px reconstruya el
      // canvas y su ruido, y el papel cambiaría de grano al redimensionar.
      mm.add(MQ.motion, () => {
        const tick = (_t: number, delta: number) => {
          if (auto) {
            pointer += (AUTO_SPEED * delta) / 1000;
            if (pointer > 1) pointer = 0;
            // En automático la aguja NO persigue: se teletransporta al reinicio
            // en vez de barrer la pantalla hacia atrás en un frame.
            if (pointer < head) head = pointer;
          }
          head += (pointer - head) * 0.16;
          setActive(Math.min(N - 1, Math.max(0, Math.round(head * N - 0.5))));
          draw();
        };

        let running = false;
        const gate = onViewportToggle(
          host,
          (visible) => {
            if (visible === running) return;
            running = visible;
            if (visible) gsap.ticker.add(tick);
            else gsap.ticker.remove(tick);
          },
          1
        );

        const onMove = (event: PointerEvent) => {
          const r = host.getBoundingClientRect();
          auto = false;
          pointer = gsap.utils.clamp(0, 1, (event.clientX - r.left) / r.width);
        };
        // El automático se reanuda al salir de la SECCIÓN, no del papel: la
        // ficha activa está debajo del canvas, e ir a leerla no debe hacer que
        // la aguja se escape.
        const onLeave = () => {
          auto = true;
        };
        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerleave", onLeave);

        return () => {
          gsap.ticker.remove(tick);
          gate.kill();
          section.removeEventListener("pointermove", onMove);
          section.removeEventListener("pointerleave", onLeave);
        };
      });

      // Con reduced-motion el papel se entrega ESCRITO ENTERO y quieto: la
      // aguja al final, las seis marcas visibles, la primera ficha abierta. Lo
      // que el gesto tenía para decir es que hay seis picos, y eso se puede
      // decir sin mover nada.
      mm.add(MQ.reduce, () => {
        auto = false;
        pointer = 1;
        head = 1;
        draw();
        setActive(0);
      });

      return () => mm.revert();
    }, section);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(host);
    resize();
    draw();

    return () => {
      ro.disconnect();
      ctx.revert();
      delete section.dataset.plotter;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="group/plot flex min-h-svh flex-col justify-center gap-10 bg-cream py-20 text-ink"
    >
      <Container className="flex items-baseline justify-between gap-8">
        <Eyebrow className="text-gray-intermediate">Built to</Eyebrow>
        <p className="text-caption-mono text-gray-intermediate">
          movés el puntero, la aguja escribe
        </p>
      </Container>

      {/* El papel. Los rótulos van en DOM y no dibujados en el canvas: son
          texto real, se seleccionan y los lee un lector de pantalla. Lo único
          que el canvas pinta es la traza. */}
      <div ref={hostRef} className="relative h-[34svh] w-full">
        <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
        <div className="pointer-events-none absolute inset-0">
          {PROOF_STATS.map((s, i) => (
            <span
              key={s.id}
              data-pin
              style={{ left: `${MARK_AT(i) * 100}%` }}
              className="absolute top-[8%] -translate-x-1/2 text-caption-mono text-ink"
            >
              {s.short}
            </span>
          ))}
        </div>
      </div>

      <Container>
        {/* Las seis fichas en flujo normal sin JS; el efecto las superpone con
            `autoAlpha` y deja una sola visible. Se apilan con `[grid-area]`
            sobre un grid de una celda, que es como lo resuelven las demás
            secciones del repo. */}
        <div className="grid grid-cols-1 gap-8">
          {PROOF_STATS.map((s) => (
            <article
              key={s.id}
              data-card
              className="flex flex-col gap-4 group-data-[plotter=on]/plot:[grid-area:1/1]"
            >
              <p className="text-h4">{s.eyebrow}</p>
              <p className="text-h2-serif italic">
                {s.value}
                <span className="text-green-ink">{s.accent}</span>
              </p>
              <p className="max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
                {s.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
