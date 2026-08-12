"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";

// El panel de lectura del laboratorio. Se enciende con `?debug` en la URL — mismo
// criterio que `DEBUG_MARKERS` en `motionTokens.ts`, que ya usa el flag de la query
// para los markers de ScrollTrigger.
//
// ── Por qué existe ───────────────────────────────────────────────────────────
// Dos intentos de esta animación fallaron por lo mismo: el defecto (una franja de
// página de unos pocos píxeles en la juntura hero↔barras) solo se ve en una parte
// del recorrido, y detectarlo requería scrollear despacio y mirar una zona concreta.
// Con el ciclo de "cambiar código → recargar → cazar el defecto → describirlo",
// cada iteración costaba minutos y dos veces se dio por bueno algo que estaba roto.
//
// La medición que importa es `gap`: la distancia en píxeles entre el fondo de la
// imagen del hero y el borde superior del bloque gris. **Tiene que valer 0 (o
// negativo, que es solape) en todo el recorrido.** En cuanto se pone positivo hay
// franja, y el panel lo dice en el momento exacto, con el número.
//
// El resto de los campos son para entender POR QUÉ: si el gap se abre, `core` dice
// si es porque la tapa no creció, y `hold` si es porque el hero se fue de más.

export type DescentReadout = {
  /** Progreso del recorrido del hero, 0..1. */
  p: number;
  /** Compensación aplicada al hero, en px. */
  hold: number;
  /** scaleY del bloque gris uniforme: la TAPA de la juntura. */
  core: number;
  /** scaleY del último par de escalones en entrar. */
  step: number;
  /**
   * Píxeles entre el fondo de la imagen del hero y el borde superior del gris.
   * 0 o negativo = bien. Positivo = franja visible.
   */
  gap: number;
};

/**
 * Lee las medidas del DOM en cada tick del ticker de GSAP y las publica.
 *
 * Se cuelga de `gsap.ticker` y no de un rAF propio (regla del repo: un solo rAF, el
 * que ya mueve Lenis y los ScrollTriggers), y solo cuando el panel está encendido —
 * son cuatro `getBoundingClientRect` por frame, que es exactamente el tipo de coste
 * que no debe existir en producción.
 */
export function useDescentReadout(enabled: boolean): DescentReadout {
  const [readout, setReadout] = useState<DescentReadout>({
    p: 0,
    hold: 0,
    core: 0,
    step: 0,
    gap: 0,
  });
  const last = useRef("");

  useEffect(() => {
    if (!enabled) return;

    const read = () => {
      // Los selectores tienen fallback a los de la página REAL, para que el mismo
      // panel sirva en la maqueta y en `/prototype/descent/real`, que monta
      // `HeroVideo` y `QuantumBars` sin tocarlos. Los `[data-qbar-*]` son los mismos
      // en las dos porque la maqueta copió esos nombres a propósito.
      const hero =
        document.querySelector<HTMLElement>("[data-lab-hero]") ??
        document.querySelector<HTMLElement>("[data-hero-bg]")?.closest("section") ??
        null;
      const art =
        document.querySelector<HTMLElement>("[data-lab-art]") ??
        document.querySelector<HTMLElement>("[data-hero-bg]");
      const core = document.querySelector<HTMLElement>("[data-qbar-core]");
      const step = document.querySelector<HTMLElement>("[data-qbar-top]");
      if (!hero || !art || !core) return;

      const artBox = art.getBoundingClientRect();
      const coreBox = core.getBoundingClientRect();

      const next: DescentReadout = {
        p: Number(hero.dataset.labProgress ?? 0),
        hold: Number(hero.dataset.labHold ?? 0),
        // El scaleY efectivo sale de la matriz, no de una variable nuestra: así el
        // panel mide lo que el navegador está pintando y no lo que creemos haberle
        // pedido. Si un tween se pisa con otro, acá se ve.
        core: gsap.getProperty(core, "scaleY") as number,
        step: step ? (gsap.getProperty(step, "scaleY") as number) : 0,
        // La medición clave. `coreBox.top` es el borde superior del gris ya
        // transformado; `artBox.bottom`, el fondo de la imagen. Si el gris empieza
        // por debajo de donde termina la imagen, entre los dos se ve la página.
        gap: Math.round(coreBox.top - artBox.bottom),
      };

      // Solo se re-renderiza cuando cambia algo visible: sin esto el panel dispara
      // un render por frame y falsea la medición de rendimiento que uno viene a
      // hacer acá.
      const key = `${next.p.toFixed(3)}|${next.hold.toFixed(0)}|${next.core.toFixed(2)}|${next.step.toFixed(2)}|${next.gap}`;
      if (key === last.current) return;
      last.current = key;
      setReadout(next);
    };

    gsap.ticker.add(read);
    return () => gsap.ticker.remove(read);
  }, [enabled]);

  return readout;
}

export default function DescentDebug({
  approach,
  curve,
  readout,
}: {
  approach: string;
  curve: string;
  readout: DescentReadout;
}) {
  const bad = readout.gap > 0;

  return (
    <div
      // `fixed` abajo a la izquierda: arriba está el nav de las páginas reales y al
      // centro-derecha cae la escalera, que es lo que hay que mirar.
      //
      // Instrumental de laboratorio, no UI del sitio. Es un HUD de números que solo
      // existe con ?debug y que nunca se ve en producción, así que se dibuja con
      // tipografía de monitor —mono, chica, interlineado suelto para leer valores que
      // cambian por frame— en vez de con un rol de la escala. Meter un token al DS
      // para esto sería sumarle vocabulario que ninguna página usa.
      /* ds-exempt: HUD de laboratorio, ver la nota de arriba */
      className="pointer-events-none fixed bottom-4 left-4 z-[100] rounded-lg bg-black/85 px-4 py-3 font-mono text-xs leading-relaxed text-white backdrop-blur"
    >
      {/* ds-exempt: ver la nota de arriba — cabecera del HUD. */}
      <div className="mb-1.5 uppercase tracking-wider text-white/50">
        {approach} · curva {curve}
      </div>
      <Row label="p" value={readout.p.toFixed(3)} />
      <Row label="hold" value={`${readout.hold.toFixed(0)}px`} />
      <Row label="core" value={readout.core.toFixed(2)} />
      <Row label="step" value={readout.step.toFixed(2)} />
      {/* El estado de alarma del HUD tiene que saltar a la vista sin leerlo. */}
      {/* ds-exempt: HUD de laboratorio */}
      <div className={bad ? "mt-1 rounded bg-red-500 px-1.5 py-0.5 font-bold" : "mt-1"}>
        <Row label="gap" value={`${readout.gap}px${bad ? "  ← FRANJA" : ""}`} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-10 text-white/50">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
