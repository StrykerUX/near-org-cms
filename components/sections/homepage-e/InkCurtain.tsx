"use client";

import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { EASE } from "@/components/sections/homepage-e/motion";

// La cortina: cómo esta página entra y sale del negro.
//
// ── El problema ─────────────────────────────────────────────────────────────
//
// «The NEAR Stack» es lo único oscuro del recorrido y hasta acá llegaba de
// golpe: la sección crema termina, empieza la negra, y lo que el lector ve es
// una línea recta subiendo por el viewport. No es un corte mal hecho — es que no
// hay corte NINGUNO, solo dos fondos vecinos y el scroll del documento pasando
// de uno al otro. El stack se leía como una pieza pegada de otro sitio.
//
// ── Por qué no un degradé ───────────────────────────────────────────────────
//
// La respuesta obvia —una banda en degradé de crema a tinta entre las dos— se
// probó y se descartó: un degradé entre dos fondos planos no disimula la costura,
// la SUBRAYA, porque agrega dos bordes nuevos donde antes había uno. Está anotado
// en docs/labs-archivados.md junto con el resto de ese descarte.
//
// ── Lo que sí ───────────────────────────────────────────────────────────────
//
// El sitio ya tiene una forma de cambiar de mundo y la usa una vez: el takeover
// del footer, donde el negro SUBE TAPANDO la página. Esto es esa misma
// gramática, dicha antes. Con la cortina, el gesto aparece dos veces en el
// recorrido —al entrar al stack y al cerrar la página— y deja de ser un truco
// del final para volverse la manera en que este sitio cambia de escena.
//
// ── Cómo está hecho ─────────────────────────────────────────────────────────
//
// Un panel `fixed` del tamaño del viewport, recortado con `clip-path` desde
// abajo y atado al scroll con scrub. `fixed` y no `sticky` por lo de siempre:
// un sticky se pega dentro de su contenedor, y acá el panel tiene que tapar el
// viewport entero mientras el contenedor todavía viene subiendo — que es
// exactamente el tramo que se quiere cubrir. Es lo mismo que hace el wipe del
// footer.
//
// `z-[2]` por dos vecinos concretos: `OwnYourOwn` declara `z-[1]` y sin superarlo
// la cortina le pasaría por detrás justo cuando tiene que taparla, y `SiteHeader`
// es `fixed z-50`, así que sigue por encima — el menú no se apaga durante la
// transición, igual que en el takeover.
//
// El tramo de scroll que esto cuesta lo declara el JS y no el JSX: sin motion,
// en móvil o sin JS la sección mide CERO y la página queda exactamente como
// estaba, con su corte. Es la degradación correcta — un hueco vacío de media
// pantalla entre dos secciones sería peor que el corte que vino a arreglar.
//
// La curva (`EASE.curtain`) es la mitad del efecto: arranca despegándose del
// scroll y llega frenando. Sin ella el panel sube a la velocidad del dedo y
// vuelve a leerse como el borde de una sección, que es de lo que se estaba
// escapando.

export type InkCurtainProps = {
  /** `down` baja al negro (panel tinta sobre crema); `up` vuelve al crema. */
  direction: "down" | "up";
  /** Cuánto scroll cuesta el gesto, en svh. */
  span?: number;
};

export default function InkCurtain({ direction, span = 55 }: InkCurtainProps) {
  const down = direction === "down";

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    // Sin motion no hay cortina Y no hay tramo: la sección se colapsa a nada.
    if (!motionOk) return;

    const panel = q("[data-curtain-panel]")[0];
    if (!panel) return;

    scope.dataset.curtain = "on";

    // El recorrido: de "todavía no empezó" a "la pantalla es del otro color".
    //
    // El final es `bottom top` y no un punto del tramo, y ese detalle es lo que
    // separa una transición de una pausa. `bottom top` es EXACTAMENTE el
    // instante en que la sección siguiente toca el techo del viewport: la
    // cortina termina de cerrar justo cuando hay algo detrás. Con el valor
    // anterior (`top 15%`) cerraba antes de tiempo y quedaban ~600px de scroll
    // sobre una pantalla negra vacía, esperando — que se lee como que la página
    // se colgó, no como un cambio de escena.
    const wipe = gsap.fromTo(
      panel,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: EASE.curtain,
        scrollTrigger: {
          trigger: scope,
          // El arranque no es simétrico, y no puede serlo.
          //
          // Bajando, lo que queda arriba mientras el negro sube es una sección
          // que el lector ya leyó: taparla pronto no cuesta nada y el gesto
          // gana recorrido.
          //
          // Subiendo es al revés — arriba están las notas de gobernanza y
          // economía, que son lo ÚLTIMO que el stack dice y todavía se están
          // leyendo. El panel es `fixed` y cubre el viewport entero, así que un
          // wipe que empieza pronto las corta a media frase. Arrancando cuando
          // el tramo ya subió más de medio viewport, para entonces las notas
          // salieron por arriba y no hay nada que interrumpir.
          start: down ? "top 85%" : "top 45%",
          end: "bottom top",
          scrub: true,
          markers: DEBUG_MARKERS,
        },
      }
    );

    // El panel existe SOLO mientras su tramo está en pantalla.
    //
    // Fuera de ese rango tiene que estar apagado, y por los dos lados: antes,
    // porque todavía no le toca; después, porque es `fixed` y se quedaría
    // clavado sobre la página para siempre. Que se apague al salir por arriba no
    // se ve: en ese instante el viewport ya es 100% de la sección siguiente, que
    // es de este mismo color.
    //
    // ⚠️ `onToggle` **y** `onRefresh`, y ese par no es redundante. `onToggle`
    // cubre los cruces, pero una recarga a media página no cruza nada: el
    // navegador restaura el scroll, el trigger nace con su rango ya pasado y
    // nunca dispara. Con solo `onToggle`, quien recargara por debajo del stack
    // se encontraba la página entera tapada de negro, porque el scrub sí evalúa
    // su progreso al nacer (y a esa altura vale 1, o sea el panel completo).
    // `onRefresh` sincroniza ese estado inicial — y vuelve a hacerlo en cada
    // re-medición, que es cuando el rango puede haberse movido bajo los pies.
    const sync = (self: ScrollTrigger) =>
      gsap.set(panel, { visibility: self.isActive ? "visible" : "hidden" });

    const gate = ScrollTrigger.create({
      trigger: scope,
      start: "top bottom",
      end: "bottom top",
      onToggle: sync,
      onRefresh: sync,
    });

    return () => {
      wipe.scrollTrigger?.kill();
      wipe.kill();
      gate.kill();
      gsap.set(panel, { clearProps: "clipPath,visibility" });
      delete scope.dataset.curtain;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-hidden="true"
      style={{ "--curtain-span": `${span}svh` } as React.CSSProperties}
      // Sin el atributo —o sea sin JS, sin motion o en móvil— la sección no
      // ocupa nada. El fondo es el del color de PARTIDA: durante el tramo, lo
      // que se ve por debajo del panel todavía es de dónde se viene.
      className={`relative data-[curtain=on]:h-[var(--curtain-span)] ${
        down ? "bg-cream" : "bg-ink"
      }`}
    >
      <div
        data-curtain-panel
        className={`pointer-events-none invisible fixed inset-0 z-[2] ${
          down ? "bg-ink" : "bg-cream"
        }`}
      />
    </section>
  );
}
