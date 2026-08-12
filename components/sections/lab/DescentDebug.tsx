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
// `gap` es la distancia en píxeles entre el fondo de la imagen del hero y el borde
// superior del bloque gris. **Tiene que valer 0 (o negativo, que es solape) en todo el
// recorrido.** En cuanto se pone positivo hay franja crema, y el panel lo dice en el
// momento exacto, con el número.
//
// El resto de los campos son para entender POR QUÉ: si el gap se abre, `core` dice si
// es porque la tapa no creció, y `hold` si es porque el hero se fue de más.
//
// ── El error del panel, y por qué se agregaron `flat` y `stair` ──────────────
// Durante siete approaches el panel midió `gap` y solo `gap`. Ese número describe el
// bug ANTERIOR —la franja crema en la costura— y estaba en verde en todos ellos. El
// defecto que en realidad se perseguía es otro: que lo primero que se ve al scrollear
// sea una barra gris plana en vez de una escalera. `gap` no dice nada de eso, así que
// cada variante pasaba el gate mientras fallaba el objetivo, y el verde se leía como
// progreso.
//
// Las dos medidas que sí lo describen:
//
//   · `flat`  — alto en px de la zona de ANCHO COMPLETO (donde las siete columnas son
//               grises). Es la barra. Cuanto más chica, mejor.
//   · `stair` — alto en px de la zona con RELIEVE (entre el borde de la columna
//               exterior y el de la central). Es la escalera.
//
// El criterio es la RELACIÓN entre las dos: mientras `stair > flat` lo que se ve se lee
// como una escalera; cuando `flat` gana, se lee como una barra. El panel se pone en
// alarma en ese caso, no en el de `gap`.

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
  /** Alto en px de la zona de ancho completo visible: la barra. Cuanto menos, mejor. */
  flat: number;
  /** Alto en px de la zona con relieve visible: la escalera. Tiene que ganarle a `flat`. */
  stair: number;
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
    flat: 0,
    stair: 0,
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

      // Cuánto de un rect cae dentro del viewport. Lo que importa es lo que se VE, no
      // el alto del elemento: el bloque gris mide más de una pantalla desde temprano.
      const vh = window.innerHeight;
      const onScreen = (r: DOMRect) => Math.max(0, Math.min(vh, r.bottom) - Math.max(0, r.top));

      // `flat` y `stair` los publica el componente cuando puede calcularlos mejor que
      // el DOM. En el approach del tallado el recorte NO aparece en ningún rect —el
      // elemento sigue midiendo lo mismo, solo se pinta menos— así que medirlo desde
      // acá daría números falsos. Cuando no hay valores publicados se cae a los rects,
      // que es lo correcto para producción y para los approaches que escalan piezas.
      const published = hero.dataset;

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
        // El bloque uniforme abarca las siete columnas: lo que se ve de él ES la zona
        // de ancho completo.
        flat:
          published.labFlat !== undefined
            ? Number(published.labFlat)
            : Math.round(onScreen(coreBox)),
        // El escalón exterior es el más alto de la escalera, así que su parte visible
        // es el relieve de la figura.
        stair:
          published.labStair !== undefined
            ? Number(published.labStair)
            : step
              ? Math.round(onScreen(step.getBoundingClientRect()))
              : 0,
      };

      // Solo se re-renderiza cuando cambia algo visible: sin esto el panel dispara
      // un render por frame y falsea la medición de rendimiento que uno viene a
      // hacer acá.
      const key = `${next.p.toFixed(3)}|${next.hold.toFixed(0)}|${next.core.toFixed(2)}|${next.step.toFixed(2)}|${next.gap}|${next.flat}|${next.stair}`;
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
  const franja = readout.gap > 0;
  // La comparación solo dice algo cuando ya hay gris en pantalla: antes del primer
  // scroll las dos medidas valen 0 y su relación no significa nada.
  const barra = readout.flat > 0 && readout.flat >= readout.stair;

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
      <div className={franja ? "mt-1 rounded bg-red-500 px-1.5 py-0.5 font-bold" : "mt-1"}>
        <Row label="gap" value={`${readout.gap}px${franja ? "  ← FRANJA" : ""}`} />
      </div>
      {/* La medida que importa para ESTE defecto: escalera contra barra. */}
      {/* ds-exempt: HUD de laboratorio */}
      <div className={barra ? "mt-1 rounded bg-red-500 px-1.5 py-0.5 font-bold" : "mt-1"}>
        <Row label="stair" value={`${readout.stair}px`} />
        <Row
          label="flat"
          value={`${readout.flat}px${barra ? "  ← BARRA" : `  (×${ratio(readout)})`}`}
        />
      </div>
    </div>
  );
}

/** Cuántas veces le gana la escalera a la barra. Es el número que hay que vigilar. */
function ratio(readout: DescentReadout) {
  if (readout.flat <= 0) return "∞";
  return (readout.stair / readout.flat).toFixed(1);
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-10 text-white/50">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
