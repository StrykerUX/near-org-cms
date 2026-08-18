"use client";

import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import ProofComposition from "@/components/sections/proof-alt/ProofComposition";

// ── 03 · Staircase ───────────────────────────────────────────────────────────
//
// La misma composición de la 01, conducida por el scroll — y sin gastar un solo
// píxel de recorrido extra.
//
// ── Cómo puede ir por scroll sin costar scroll ──────────────────────────────
//
// Porque el recorrido NO es un track: es el paso natural de la sección por el
// viewport. El ScrollTrigger va de "la sección asoma por abajo" a "la sección
// terminó de salir por arriba", que es un tramo que el lector va a scrollear de
// todos modos para llegar a lo que viene después.
//
// Un `pin` o un track de 200svh, en cambio, insertan altura: la página se hace
// más larga y el lector tiene que gastar rueda sin avanzar. Esa es la
// diferencia entre esta versión y las que se descartaron en la primera ronda, y
// es exactamente la queja que abrió todo esto — 325svh del stepper de ab7 para
// entregar cinco datos.
//
// ── El gesto: la escalera se resuelve en el centro ──────────────────────────
//
// Cada bloque lleva su propio desfase vertical, distinto por columna. Ese
// desfase vale su máximo cuando la sección está entrando (y cuando está
// saliendo, con el signo cambiado) y vale CERO cuando la sección queda centrada
// en la pantalla.
//
// O sea: la composición está escalonada mientras pasa y se endereza justo en el
// momento en que se lee. No hay estado "oculto" en ningún punto del recorrido —
// las seis cifras están completas y legibles desde el primer frame; lo único que
// cambia es a qué altura está cada una.
//
// El progreso se lee con `st.progress` y el desfase se escribe con
// `quickSetter`: seis nodos por frame durante el cruce, sin crear un tween por
// frame.

// Cuánto se desfasa cada bloque, en píxeles, en el extremo del recorrido. El
// orden es el del DOM y los valores NO son crecientes a propósito: la escalera
// tiene que leerse contra la composición asimétrica, que ya reparte los bloques
// a distinta altura. Con valores crecientes el desfase refuerza el zigzag del
// CSS y las dos cosas se suman hasta romper la lectura.
const DRIFT = [0, 150, 62, 210, 96, 250] as const;

// Cuánto del recorrido ocupa el trazado de las reglas. 0.34 las deja completas
// cuando la sección todavía está entrando, así que quien la mira ya centrada no
// ve una regla a medias.
const RULE_SPAN = 0.34;

export default function StaircaseDrift() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const blocks = q("[data-block]");
    const rules = q("[data-rule]");
    if (blocks.length === 0) return;

    // En móvil no hay escalera que resolver: la composición es una columna, y un
    // desfase vertical ahí solo produciría bloques que tiemblan al scrollear.
    if (!motionOk || !isDesktop) return;

    const setY = blocks.map((block) => gsap.quickSetter(block, "y", "px"));
    const setScale = rules.map((rule) => gsap.quickSetter(rule, "scaleX"));

    const st = ScrollTrigger.create({
      trigger: scope,
      // El cruce completo: de asomar por abajo a terminar de salir por arriba.
      // Sin `pin`, sin `scrub` y sin altura declarada — este trigger solo LEE.
      start: "top bottom",
      end: "bottom top",
      markers: DEBUG_MARKERS,
      // `will-change` solo mientras el cruce está activo. Fijo en el className,
      // los seis bloques quedarían promovidos a su propia capa de compositing
      // durante toda la sesión, con la sección a varias pantallas de distancia.
      onToggle: (self) => {
        blocks.forEach((b) => {
          b.style.willChange = self.isActive ? "transform" : "auto";
        });
      },
      onUpdate: (self) => {
        // De +1 (entrando) a −1 (saliendo), pasando por 0 en el centro exacto.
        const swing = 1 - self.progress * 2;
        blocks.forEach((_, i) => setY[i](swing * DRIFT[i]));

        // Las reglas se trazan en el primer tramo y ahí se quedan. No se
        // deshacen al salir: son un subrayado, y un subrayado que se borra al
        // irse llama la atención sobre la salida en vez de sobre el dato.
        const drawn = Math.min(1, self.progress / RULE_SPAN);
        rules.forEach((_, i) => setScale[i](drawn));
      },
    });

    // Estado de partida coherente con el trigger: si la sección ya está en
    // pantalla al cargar (recarga a media página, o un ancla), `onUpdate` no ha
    // corrido todavía y los bloques estarían en su sitio final sin las reglas.
    const swing = 1 - st.progress * 2;
    blocks.forEach((_, i) => setY[i](swing * DRIFT[i]));
    rules.forEach((_, i) => setScale[i](Math.min(1, st.progress / RULE_SPAN)));

    return () => {
      st.kill();
      gsap.set([...blocks, ...rules], { clearProps: "transform" });
      blocks.forEach((b) => {
        b.style.willChange = "auto";
      });
    };
  });

  return (
    <section ref={rootRef} className="flex min-h-svh items-center bg-background py-24 text-ink">
      <ProofComposition />
    </section>
  );
}
