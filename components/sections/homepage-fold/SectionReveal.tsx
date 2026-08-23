"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { DEBUG_MARKERS, MQ } from "@/components/primitives/motion/motionTokens";

// El revelado: cómo esta página SALE del negro.
//
// ── Qué reemplaza, y por qué no alcanzaba ───────────────────────────────────
//
// `InkCurtain direction="up"` hacía el gesto contrario del que hace falta acá:
// un panel del color de LLEGADA que crece tapando. Eso funciona para entrar al
// negro —lo que se cubre es una sección ya leída— pero para salir es la pieza
// equivocada por una razón que no se arregla calibrando: un panel de color liso
// no tiene nada dentro, así que no puede revelar nada. Lo que el lector veía
// durante todo el gesto era crema VACÍO, y la sección de abajo aparecía entera
// de golpe cuando el panel se apagaba.
//
// Y no era un fallo estético suelto. Medido: la entrada de `ProofDatum`
// (`top 75%`) disparaba 651px de scroll ANTES de que la cortina terminara, o
// sea que las seis fichas, el eje y los contadores corrían enteros detrás del
// panel. Cuando el panel se iba, ya había terminado todo.
//
// ── Lo que hace en su lugar ─────────────────────────────────────────────────
//
// El velo es del color de PARTIDA —el negro del que se viene— y se ABRE desde
// abajo en vez de cerrarse. Detrás está la sección real, así que lo que el
// recorte descubre es contenido y no pintura.
//
// Y el componente envuelve a esa sección, así que puede decidir cuándo anima en
// vez de dejarla adivinar. Es el patrón inverso al que venía mordiendo —una
// sección animando a ciegas porque algo la tapaba— y acá no puede ocurrir por
// construcción: quien tapa es quien da paso.
//
// El paso llega cuando la sección ASOMA, no cuando el velo se abre. Los dos
// momentos parecen el mismo y están separados por medio viewport; atarlos fue
// el error de la primera versión, y se veía como una franja de fondo vacío
// subiendo sin nada dentro. Ver el trigger `entrance` más abajo.
//
// ── El velo no nace cerrado, nace CALZADO ───────────────────────────────────
//
// Es el detalle del que depende todo lo demás, y costó dos intentos.
//
// El velo se enciende en `top top`: el instante en que el tramo toca el techo,
// o sea cuando lo que venía arriba —el último párrafo del stack— acaba de
// salir. Pero en ese mismo frame la sección de abajo YA asoma, porque el tramo
// mide menos que un viewport. Un velo que naciera cerrado se la comería de
// golpe.
//
// Así que no nace cerrado: nace con el recorte exactamente donde está el borde
// de la sección de abajo. `1 - alto del tramo / alto del viewport` — con el
// tramo en 45svh, el velo aparece ya abierto un 55%, que es justo lo que la
// sección ocupa. No tapa un solo píxel al encenderse, y desde ahí retiene.
//
// El intento anterior resolvía esto estirando el tramo a un viewport entero,
// para que existiera un frame con la pantalla ocupada solo por el tramo. Es
// correcto y es peor: compra el frame limpio a cambio de un viewport de scroll
// con la pantalla en negro antes de que haya nada que revelar. Calzar el velo
// da el mismo frame limpio y no cuesta ni un píxel de espera.
//
// ── La curva va RETRASADA, y es lo que hace que el gesto exista ─────────────
//
// Mientras el velo se abre, la sección de abajo SUBE con el scroll, de forma
// lineal. Si el recorte corre por delante de esa subida nunca llega a tapar
// nada: lo único que se ve es el borde superior de la sección avanzando, o sea
// scroll normal con un panel invisible encima. (Ahí murió el primer intento,
// que usaba `EASE.curtain`: adelanta tanto que a un 13% del recorrido ya había
// descubierto medio viewport.)
//
// `power3.in` va por debajo de la diagonal en todo el rango, así que el negro
// RETIENE: la sección asoma por abajo y el velo la sostiene, cediendo más
// despacio de lo que el scroll pide, hasta soltarla al final. El borde del
// recorte deja de ser un panel que se quita y pasa a ser lo que se mira.
//
// Cuánto retiene es cosa de la curva y no del tramo — ver el docblock de
// `span`. La cuártica sostiene ~170px de sección tapada en su punto más
// fuerte; la cúbica, ~120. Es el número que hace que la cortina se lea alta.
//
// Y con el velo calzado, la curva puede permitirse ser marcada. El retén se
// mide sobre lo que queda por descubrir —el 45% de arriba, no la pantalla
// entera—, así que su punto más fuerte son unos 150px de sección retenida
// mientras el resto se ve todo el tiempo. La cúbica costaba negro cuando el
// velo nacía cerrado; calzado, no cuesta ninguno.
//
// `fixed` y no `sticky`, `z-[2]`, y el tramo declarado por el JS y no por el
// JSX: los tres por los mismos motivos que están escritos largo en
// `InkCurtain.tsx`, que sigue vivo para la bajada.

/** Lo que la sección revelada recibe: cuándo puede animar, y cuándo rebobinar. */
export type RevealGate = {
  /**
   * `open` corre cuando el recorte ya descubrió lo suficiente; `close`, cuando
   * el lector volvió a subir y el velo tapa de nuevo. Devuelve la baja.
   *
   * `instant` distingue las dos maneras de abrirse. Con el scroll llega en
   * `false`: hay alguien mirando y la entrada tiene que verse. Llega en `true`
   * cuando el tramo ya quedó atrás sin que nadie lo cruzara —una recarga a
   * media página, una llegada por ancla—, y entonces lo correcto es que la
   * escena ya esté puesta: nadie debe ver llegar algo que debería haber
   * llegado hace media página.
   *
   * Si el velo ya estaba abierto al suscribirse, `open` corre en el acto: un
   * consumidor que monta tarde no puede quedarse esperando una señal que ya
   * pasó.
   */
  subscribe(open: (instant: boolean) => void, close: () => void): () => void;
};

const RevealContext = createContext<RevealGate | null>(null);

/**
 * El gate de la transición que revela esta sección, o `null` si no hay ninguna.
 * `null` es el caso normal —la sección se monta suelta en cinco de las seis
 * vistas— y significa "animá con tu propio trigger, como siempre".
 */
export function useRevealGate() {
  return useContext(RevealContext);
}

export type SectionRevealProps = {
  /**
   * Selector del bloque cuyo borde inferior marca el final del gesto. Es el
   * último contenido del mundo del que se sale — acá, las dos notas del stack.
   *
   * Se ancla al BLOQUE y no a su sección a propósito: la sección lleva pegado
   * su propio padding, así que tocarlo desincronizaría el punto sin que nadie
   * se entere.
   */
  settleTo?: string;
  /**
   * A qué altura del viewport, en porcentaje desde arriba, tiene que estar ese
   * borde cuando la cortina termina de abrirse. 20 = ya casi salió.
   */
  settleAt?: number;
  /**
   * Cuánto mide el tramo previo, en svh. Es también lo que dura el gesto: el
   * recorte empieza cuando el tramo toca el techo y termina cuando lo cruza
   * entero.
   *
   * ⚠️ Este número no es una calibración de gusto: gobierna las DOS cosas que
   * están en tensión, y en direcciones opuestas.
   *
   *   · Es cuánto scroll negro hay entre lo de arriba y el revelado.
   *   · Es el techo del retén. El velo solo puede ocultar lo que todavía no se
   *     descubrió, y eso es exactamente `span / viewport`. Con 14svh, el velo
   *     puede retener como mucho un 14% de pantalla — ninguna curva lo sube.
   *
   * O sea: pedirle a la cortina que cierre apenas el texto de arriba sale
   * IMPLICA un gesto sutil. No hay ajuste que dé las dos cosas; lo que hay es
   * dónde poner el punto.
   *
   * Y desde que el gesto se ancla al texto de arriba, subirlo tiene un efecto
   * de más: empuja hacia abajo el punto en que la sección revelada asoma, que
   * es donde el gesto ARRANCA — así que un tramo más alto da un recorrido más
   * corto. El retén se recupera con la curva, no con este número.
   */
  span?: number;
  children: React.ReactNode;
};

export default function SectionReveal({
  span = 24,
  settleTo,
  settleAt = 20,
  children,
}: SectionRevealProps) {
  // El estado del velo y sus suscriptores viven en un ref y no en estado de
  // React a propósito: esto cambia con el scroll, y un re-render por frame para
  // un dato que solo consume un tween sería trabajo puro.
  const gateRef = useRef({
    open: false,
    subs: new Set<{ open: (instant: boolean) => void; close: () => void }>(),
  });

  const setOpen = useCallback((next: boolean, instant = false) => {
    const g = gateRef.current;
    if (g.open === next) return;
    g.open = next;
    g.subs.forEach((s) => (next ? s.open(instant) : s.close()));
  }, []);

  // El modo se decide en RENDER, no en el layout effect, y por una razón de
  // orden: los layout effects de los hijos corren ANTES que los del padre, así
  // que para cuando este componente sabe si puede animar, la sección de adentro
  // ya armó su escena. Si el modo llegara tarde, la sección se armaría creyendo
  // que hay un velo que nunca va a existir y se quedaría invisible.
  //
  // Sin `window` —o sea en el render del servidor— da `false`, que es el valor
  // seguro: el HTML es idéntico en los dos casos (esto no pinta nada, solo
  // decide un valor de contexto que ningún render lee), así que no hay
  // desajuste de hidratación que arreglar.
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MQ.motion).matches &&
      window.matchMedia(MQ.desktop).matches
  );

  const gate = useMemo<RevealGate | null>(
    () =>
      enabled
        ? {
            subscribe(open, close) {
              const entry = { open, close };
              gateRef.current.subs.add(entry);
              if (gateRef.current.open) open(true);
              return () => {
                gateRef.current.subs.delete(entry);
              };
            },
          }
        : null,
    [enabled]
  );

  const rootRef = useMotionScope<HTMLDivElement>(
    ({ q, scope, motionOk, isDesktop }) => {
      // Sin velo no hay tramo: el bloque se colapsa a nada y la página queda
      // como si esta pieza no existiera. Un hueco negro de media pantalla entre
      // dos secciones sería peor que el corte que vino a arreglar.
      if (!motionOk || !isDesktop) return;

      const veil = q("[data-reveal-veil]")[0];
      const track = q("[data-reveal-track]")[0];
      const content = q("[data-reveal-content]")[0];
      if (!veil || !track || !content) return;

      scope.dataset.reveal = "on";

      // El velo existe SOLO mientras dura el gesto — apagado antes porque
      // taparía lo que todavía se está leyendo, y apagado después porque es
      // `fixed` y se quedaría clavado sobre la página para siempre.
      //
      // `onToggle` **y** `onRefresh`: el par no es redundante. `onToggle` cubre
      // los cruces, pero una recarga a media página no cruza nada —el navegador
      // restaura el scroll y el trigger nace con su rango ya pasado—, y el
      // scrub sí evalúa su progreso al nacer. Sin `onRefresh`, quien recargara
      // por debajo de acá se encontraría la página tapada de negro.
      const sync = (self: ScrollTrigger) => {
        gsap.set(veil, { visibility: self.isActive ? "visible" : "hidden" });
        // El gate se re-sincroniza con el mismo pase: si el tramo quedó atrás,
        // lo de abajo ya tendría que estar animado; si todavía no llegó, no.
        if (!self.isActive) setOpen(self.progress >= 1, true);
      };

      // El paso al contenido NO cuelga del velo, y esa separación es la que
      // quita la espera.
      //
      // Colgado del wipe, el contenido esperaba a que el velo se encendiera —y
      // el velo no puede encenderse hasta que lo de arriba termina de salir—.
      // Pero la sección de abajo asoma por el borde inferior mucho antes que
      // eso, y durante todo ese tramo se la veía VACÍA: su fondo, sin una sola
      // de sus piezas, porque seguía esperando un permiso que llegaba medio
      // viewport después. Eso es lo que se leía como quedarse esperando.
      //
      // Con trigger propio, el contenido entra en cuanto asoma. Lo que aparece
      // por abajo ya se está construyendo, y el velo pasa a hacer solo lo suyo:
      // retener el último tramo.
      const entrance = ScrollTrigger.create({
        trigger: content,
        start: "top bottom",
        end: "bottom top",
        markers: DEBUG_MARKERS,
        onEnter: () => setOpen(true),
        onLeaveBack: () => setOpen(false),
        onRefresh: (self) => {
          // Nacer ya pasado es instantáneo; nacer a media entrada, no: ahí
          // todavía hay alguien mirando cómo llega.
          if (self.progress > 0) setOpen(true, !self.isActive);
        },
      });

      // Dónde termina el gesto: cuando el borde inferior del ancla llega a la
      // altura pedida. Se devuelve como posición absoluta de scroll y se
      // recalcula en cada refresh (`invalidateOnRefresh`), porque los dos
      // números que lo deciden se mueven con la ventana.
      //
      // Sin ancla, el gesto termina cuando la sección revelada llena la
      // pantalla, que es el final natural.
      const settle = () => {
        const anchor = settleTo ? document.querySelector(settleTo) : null;
        if (!anchor) return "bottom top";
        return (
          anchor.getBoundingClientRect().bottom +
          window.scrollY -
          (settleAt / 100) * window.innerHeight
        );
      };

      const wipe = gsap.fromTo(
        veil,
        // Cerrado: el velo cubre el viewport ENTERO al encenderse.
        //
        // Puede permitírselo porque enciende en el frame en que la sección de
        // abajo todavía no asomó —no hay nada suyo que borrar— y porque lo que
        // queda arriba va por encima de él: las notas del stack declaran
        // `z-[3]` contra el `z-[2]` de acá. Sin ese par, un velo de pantalla
        // completa se comería el último párrafo a media frase; con él, el texto
        // viaja sobre la cortina y se va por arriba mientras el negro se retira
        // por abajo.
        { clipPath: "inset(0% 0% 0% 0%)" },
        {
          // El borde inferior sube hasta comerse el velo entero. `bottom` es el
          // tercer valor de `inset()`, y llevarlo a 100% deja el panel sin
          // altura — abierto del todo, sin que en ningún frame haya un borde
          // que no sea horizontal.
          clipPath: "inset(0% 0% 100% 0%)",
          ease: "power3.in",
          scrollTrigger: {
            trigger: content,
            // Los dos bordes del gesto:
            //
            //   start — la sección de abajo asoma por el borde inferior. Antes
            //           de eso no hay nada que revelar, y el velo cerrado no
            //           tapa nada suyo porque todavía no hay nada suyo.
            //   end   — el ancla llega a la altura pedida. Ver `settle`.
            start: "top bottom",
            end: settle,
            scrub: true,
            invalidateOnRefresh: true,
            markers: DEBUG_MARKERS,
            // El encendido va en ESTE trigger y no en uno más ancho, y la
            // diferencia no es cosmética.
            //
            // La cortina podía permitirse un rango generoso porque su panel
            // nace VACÍO —`inset(100%)`, altura cero— y encenderlo antes de
            // tiempo no se ve. Este nace ocupando: encenderlo un píxel antes de
            // su rango pinta de negro todo lo que quede por encima de la
            // costura. Con un rango más ancho, eso caía sobre el stack todavía
            // a la vista y se lo comía de golpe.
            onToggle: (self) => sync(self),
            onRefresh: (self) => sync(self),
          },
        }
      );

      return () => {
        wipe.scrollTrigger?.kill();
        wipe.kill();
        entrance.kill();
        gsap.set(veil, { clearProps: "clipPath,visibility" });
        delete scope.dataset.reveal;
        // Red de seguridad: si esta escena se revierte y el velo desaparece
        // —cruzar los 1024px de ancho lo hace, y `enabled` no reacciona a eso
        // porque se fijó en el primer render—, quien esté esperando el paso se
        // quedaría invisible para siempre. Abrir al desarmar lo deja visible
        // pase lo que pase.
        setOpen(true, true);
      };
    },
    [setOpen, settleTo, settleAt]
  );

  return (
    <div
      ref={rootRef}
      style={{ "--reveal-span": `${span}svh` } as React.CSSProperties}
      className="group/reveal relative"
    >
      {/* El tramo. Negro como lo que viene arriba: mientras el recorte todavía
          no llegó hasta acá, lo que se ve por debajo del velo sigue siendo el
          mundo del que se sale. */}
      <div
        data-reveal-track
        aria-hidden="true"
        className="bg-ink group-data-[reveal=on]/reveal:h-[var(--reveal-span)]"
      />
      <div data-reveal-content>
        <RevealContext.Provider value={gate}>{children}</RevealContext.Provider>
      </div>
      <div
        data-reveal-veil
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[2] bg-ink"
      />
    </div>
  );
}
