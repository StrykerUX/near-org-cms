"use client";

import { useRef, useState, useCallback, type RefObject, type CSSProperties } from "react";
import { gsap, Observer } from "@/components/primitives/motion/gsapClient";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { MQ } from "@/components/primitives/motion/motionTokens";

// El registro de Observer vive en `gsapClient`, junto al de ScrollTrigger y
// SplitText, y `Observer` se importa de ahí y no de "gsap/Observer": es la
// regla que ese archivo declara, un único lugar donde se registran plugins.

/**
 * Motor de carrusel — puerto 1:1 del prototipo de referencia
 * (carruseles-ambas-secciones.html, función `createCarousel`), con una sola
 * sustitución deliberada: el drag usa GSAP Observer en vez de pointer events
 * a mano, porque el diagnóstico de la auditoría (preventDefault condicionado
 * al eje + touch-action:pan-y, para convivir con el scroll nativo que Lenis
 * solo escucha vía `syncTouch:false`) se sostiene igual con Observer y da
 * lockAxis gratis. Todo lo demás —loop de 3 copias, snap por redondeo,
 * pausa en 4 causas, teclado, nav por camino más corto— es el mismo
 * algoritmo con los mismos números.
 *
 * Loop infinito REAL: el consumidor renderiza 3 copias de la lista
 * (`buildCells`) con `data-cell` + `data-logical` en cada una. Este hook
 * opera con posiciones ABSOLUTAS sobre esas 3*N celdas; `index` (el estado
 * que expone) es siempre la posición LÓGICA normalizada a [0, N). Al cruzar
 * un extremo, el track sigue animando hacia la copia vecina (contenido
 * idéntico) y recién en `onComplete` se reposiciona sin animar a la
 * posición equivalente de la copia central — el salto es invisible porque
 * las tres copias son pixel-idénticas. Ver `xFor`/`settle` abajo.
 */

const COPIES = 3;

/** Espera entre pasos del autoplay. */
const AUTOPLAY_MS = 7000;

/**
 * Duración de UN paso, en segundos. Es la fuente de verdad única del gesto.
 *
 * El consumidor la consume como `--step` (ver `stepStyle`) para que la
 * transición CSS de la card use exactamente este número. Antes no era así y
 * era el origen del movimiento inconsistente: el track lo movía GSAP en
 * 0.85s con `power3.inOut`, mientras la card cambiaba de tamaño y el titular
 * de cuerpo en 550ms con `cubic-bezier(.22,.61,.36,1)`. Dos duraciones y dos
 * curvas para el MISMO gesto — la card terminaba de crecer cuando el track
 * iba por la mitad, y el paso se leía en dos tiempos en vez de uno.
 */
const STEP_SECONDS = 1.75;

/**
 * El easing, en las dos sintaxis que hacen falta. Son la MISMA curva:
 * `power2.inOut` de GSAP es `easeInOutCubic`, y su equivalente CSS exacto es
 * el cubic-bezier de abajo. Si se cambia uno hay que cambiar el otro, o el
 * desfase vuelve por la puerta de atrás.
 *
 * `power2` y no `power3`: a 1.75s la curva de power3 pasa demasiado tiempo
 * casi quieta en los extremos y el paso se siente perezoso al arrancar.
 */
const SETTLE_EASE = "power2.inOut";
const SETTLE_EASE_CSS = "cubic-bezier(0.645, 0.045, 0.355, 1)";

const CLICK_GUARD_PX = 6;

/**
 * Lo que el consumidor pone en el `style` de su sección para que las
 * transiciones CSS de las cards salgan del mismo reloj que el track.
 */
export const stepStyle = {
  "--step": `${STEP_SECONDS}s`,
  "--step-ease": SETTLE_EASE_CSS,
} as CSSProperties;

export type UseLoopCarouselResult<T extends HTMLElement> = {
  containerRef: RefObject<T | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  /** Posición lógica normalizada a [0, N), la única que el consumidor necesita para pintar `data-active`. */
  index: number;
  /** Nav externa (click en logo): toma el camino más corto, igual que el prototipo. */
  goTo: (target: number) => void;
  rootProps: {
    role: "group";
    tabIndex: 0;
  };
};

export function useLoopCarousel<T extends HTMLElement = HTMLDivElement>(
  count: number
): UseLoopCarouselResult<T> {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goToRef = useRef<(i: number) => void>(() => {});
  const goToExternalRef = useRef<(target: number) => void>(() => {});
  const goTo = useCallback((target: number) => goToExternalRef.current(target), []);

  const containerRef = useGsapContext<T>((_self, container) => {
    const track = trackRef.current;
    if (!track) return;

    // `count` directo y no un ref: el efecto ya lo declara en sus
    // dependencias, así que se rehace entero cuando cambia y el valor que
    // captura siempre es el vigente. El ref que había acá se escribía durante
    // el render —lo que React desaconseja, porque un render puede descartarse
    // antes de commitearse— y no compraba nada a cambio.
    const N = count;
    const cells = Array.from(container.querySelectorAll<HTMLElement>("[data-cell]"));
    if (cells.length === 0) return;

    // Arranca en FALSE, no en true.
    //
    // `mm.add(MQ.motion, ...)` solo corre su callback cuando la media query
    // MATCHEA. Con `prefers-reduced-motion: reduce` no matchea nunca, así que
    // el callback no corre — y con el valor inicial en `true` la bandera se
    // quedaba en true para siempre: el carrusel animaba y hacía autoplay
    // igual, justo para quien pidió que no. Empezando en false, el único que
    // la enciende es el match.
    const motionOkRef = { current: false };
    const hoverRef = { current: false };
    const focusRef = { current: false };
    const inViewRef = { current: true };
    const draggedRef = { current: false };
    const tweenRef: { current: gsap.core.Tween | null } = { current: null };
    const timerRef: { current: ReturnType<typeof gsap.delayedCall> | null } = { current: null };

    // ── La geometría de la fila ───────────────────────────────────────────
    //
    // La grilla NO es uniforme: la celda activa mide `activeW` y las demás
    // `idleW`, y esa diferencia es el gesto de la sección. Lo fue siempre en
    // `CustomerStories`; lo que cambió es de quién es el ancho. Antes la celda
    // era fija y la card de adentro ocupaba el 62% de ella, alineada al borde
    // interno — o sea que cada vecina cargaba un hueco del 38% escondido hacia
    // afuera. En reposo eso cierra; durante el paso no, porque el borde de la
    // card y el track viajan a distinta velocidad y el hueco entra en cuadro.
    // Ahora encoge la CELDA y flex corre a las vecinas: el hueco no existe.
    //
    // `PressCarousel` no encoge nada, así que ahí `activeW === idleW` y todo
    // esto se reduce a la grilla uniforme de antes. No hace falta un caso
    // aparte.
    let activeW = 0;
    let idleW = 0;
    let gap = 0;

    // offsetLeft/offsetWidth, no getBoundingClientRect(): el rect refleja
    // cualquier transform de la celda, y lo que hace falta es el layout box.
    //
    // Las transiciones se apagan para medir. Sin eso, medir a mitad de un paso
    // devuelve anchos EN TRÁNSITO —la activa a medio encoger, la entrante a
    // medio crecer— y la fila entera queda calibrada contra un estado que no
    // existe en reposo. Apagarlas hace que el ancho salte a su valor de
    // destino, que es el que la fórmula necesita. Se restauran después: como
    // el cambio ya se aplicó sin transición, restaurarlas no dispara nada.
    //
    // Va inline y no por una clase del consumidor a propósito: esto es del
    // motor, y un hook que depende de que su consumidor recuerde declarar una
    // clase se rompe en silencio en el segundo consumidor.
    function measure() {
      const restore = cells.map((cell) => cell.style.transition);
      cells.forEach((cell) => {
        cell.style.transition = "none";
      });
      void container.offsetWidth; // fuerza el reflow con las transiciones apagadas

      const active = cells.find((c) => c.dataset.active === "true") ?? cells[0];
      const idle = cells.find((c) => c.dataset.active !== "true") ?? cells[0];
      activeW = active.offsetWidth;
      idleW = idle.offsetWidth;
      gap = cells[1] ? cells[1].offsetLeft - cells[0].offsetLeft - cells[0].offsetWidth : 0;

      cells.forEach((cell, i) => {
        cell.style.transition = restore[i];
      });
    }

    /**
     * Cuántas celdas a tamaño ACTIVO quedan a la izquierda de `pos`.
     *
     * No es siempre cero, y ese descuido costó que la card destacada apareciera
     * ~`activeW - idleW` corrida a la derecha —384px a tamaño máximo— saliéndose
     * del viewport hasta que el siguiente reposicionamiento la acomodaba.
     *
     * `paint()` marca `data-active` en TODAS las celdas con el mismo `logical`,
     * o sea una por copia, y tiene que hacerlo: el loop salta entre copias en
     * `settle()` y ese salto solo es invisible si las tres son pixel-idénticas.
     * Así que a la izquierda de la copia central siempre hay al menos una celda
     * ancha, y la cuenta cambia según a qué copia apunte `pos`.
     */
    function activesBefore(pos: number, norm: number) {
      let n = 0;
      for (let c = 0; c < COPIES; c++) if (N * c + norm < pos) n++;
      return n;
    }

    /** Borde izquierdo de la celda ABSOLUTA `pos`, con `norm` al frente. */
    function leftOf(pos: number, norm: number) {
      return pos * (idleW + gap) + activesBefore(pos, norm) * (activeW - idleW);
    }

    // x para que la celda ABSOLUTA `pos` quede centrada en el viewport.
    //
    // Todo se calcula, no se lee del DOM, y eso importa más de lo que parece:
    // durante el paso los anchos están cambiando, así que un `offsetLeft` leído
    // a mitad de vuelo daría un destino que se mueve solo.
    //
    // Y la fórmula tiene una propiedad que es la que hace que todo cierre: si se
    // desarrolla el centro real de la celda entrante en función del progreso
    // `q`, sale `C ± (activeW - idleW) * q / 2` — LINEAL en q. O sea que animar
    // `x` linealmente entre el x de origen y el de destino coincide exactamente
    // con el centro real en todo instante, siempre que el ancho de las celdas
    // interpole con la misma curva y la misma duración. De eso se encargan
    // `--step` y `--step-ease`, que salen de acá mismo.
    function xFor(pos: number, norm: number) {
      const vw = container.getBoundingClientRect().width;
      return vw / 2 - (leftOf(pos, norm) + activeW / 2);
    }

    /**
     * La inversa de `xFor`, redondeada a la celda más cercana. Para el drag.
     *
     * No se despeja de una: `activesBefore` es escalonada, así que `pos` aparece
     * a los dos lados de la ecuación. Se prueban las tres cuentas posibles —hay
     * tres copias, así que no puede haber más— y gana la que es consistente
     * consigo misma. Con celdas uniformes (`PressCarousel`) el término se anula
     * y acierta en la primera vuelta.
     */
    function posFor(x: number, norm: number) {
      const vw = container.getBoundingClientRect().width;
      const rhs = vw / 2 - x - activeW / 2;
      const delta = activeW - idleW;
      let pos = 0;
      for (let a = 0; a <= COPIES; a++) {
        pos = Math.round((rhs - a * delta) / (idleW + gap));
        if (activesBefore(pos, norm) === a) return pos;
      }
      return pos;
    }

    const absPos = (i: number) => N + i; // copia central

    function paint(norm: number) {
      cells.forEach((cell) => {
        const logical = Number(cell.dataset.logical);
        cell.dataset.active = String(logical === norm);
      });
    }

    function pause() {
      timerRef.current?.kill();
      timerRef.current = null;
    }
    function startTimer() {
      pause();
      if (!motionOkRef.current || hoverRef.current || focusRef.current || !inViewRef.current) return;
      timerRef.current = gsap.delayedCall(AUTOPLAY_MS / 1000, () => {
        goTo(indexRef.current + 1);
        startTimer();
      });
    }
    function resume() {
      startTimer();
    }

    function goTo(i: number, immediate = false) {
      tweenRef.current?.kill();
      // El `norm` de DESTINO, no el actual: es el que va a estar pintado cuando
      // el layout se asiente, y por lo tanto el que decide dónde quedan las
      // celdas anchas que `xFor` tiene que saltear.
      const norm = ((i % N) + N) % N;
      const target = xFor(absPos(i), norm);

      function settle() {
        if (norm !== i) {
          indexRef.current = norm;
          gsap.set(track, { x: xFor(absPos(norm), norm) });
        } else {
          indexRef.current = i;
        }
        setIndex(indexRef.current);
        paint(indexRef.current);
      }

      if (immediate || !motionOkRef.current) {
        gsap.set(track, { x: target });
        settle();
      } else {
        paint(norm);
        // `setIndex` ACÁ y no solo en `settle`, y esto era un bug de verdad.
        //
        // `paint` escribe `data-active` directo en el DOM; `index` es estado de
        // React. Mientras el segundo se actualizara recién al terminar el tween,
        // los dos vivían desincronizados 1.75s enteros — y todo lo que el
        // consumidor derive de `index` quedaba pintando el paso ANTERIOR: el
        // subrayado del logo activo se quedaba en el logo viejo y saltaba al
        // final, y en `CustomerStories` la alineación de cada card salía del
        // índice equivocado, lo que en saltos de más de una card dejaba un hueco
        // enorme a los dos lados de la activa.
        //
        // El re-render no interrumpe el tween: React no toca el `transform` del
        // track, que es inline y de GSAP.
        setIndex(norm);
        tweenRef.current = gsap.to(track, {
          x: target,
          duration: STEP_SECONDS,
          ease: SETTLE_EASE,
          onComplete: settle,
        });
      }
    }
    goToRef.current = goTo;

    // Nav externa: camino más corto, no rebobina — igual que el prototipo.
    goToExternalRef.current = (target: number) => {
      const total = N;
      let diff = ((target - indexRef.current + total) % total);
      if (diff > total / 2) diff -= total;
      goTo(indexRef.current + diff);
      startTimer();
    };

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      motionOkRef.current = true;
      // Arrancar el timer ACÁ y no solo abajo.
      //
      // `startTimer` es una de las cuatro cosas que miran `motionOkRef`, y con
      // la bandera empezando en `false` (ver su declaración) el orden importa:
      // si GSAP difiere este callback aunque sea un tick, el `startTimer()` de
      // más abajo ya corrió con la bandera apagada y salió sin agendar nada —
      // y nadie lo vuelve a intentar, así que el autoplay no arranca nunca.
      //
      // Llamarlo también desde acá lo deja correcto en los dos casos: si el
      // callback es síncrono, el de abajo es un no-op (`startTimer` empieza
      // matando el timer anterior); si es diferido, este es el que arranca.
      startTimer();
      return () => {
        motionOkRef.current = false;
        pause();
      };
    });

    measure();
    goTo(0, true);
    startTimer();

    // Reposicionar tras un cambio de breakpoint o de fuente: los anchos de celda
    // son clamps contra el viewport, así que `activeW`/`idleW`/`gap` quedan
    // viejos si no se remide.
    let resizeId: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeId);
      resizeId = setTimeout(() => {
        measure();
        goTo(indexRef.current, true);
      }, 150);
    };
    window.addEventListener("resize", onResize);
    document.fonts?.ready?.then(() => {
      measure();
      goTo(indexRef.current, true);
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        pause();
        goTo(indexRef.current + 1);
        startTimer();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        pause();
        goTo(indexRef.current - 1);
        startTimer();
      }
    };
    const onPointerEnter = () => {
      hoverRef.current = true;
      pause();
    };
    const onPointerLeave = () => {
      hoverRef.current = false;
      resume();
    };
    const onFocusIn = () => {
      focusRef.current = true;
      pause();
    };
    const onFocusOut = () => {
      focusRef.current = false;
      resume();
    };
    // Capture: tiene que decidir ANTES de que el click le llegue al <a>/<button>
    // real de la card, o ya es tarde para cancelar la navegación.
    const onClickCapture = (e: MouseEvent) => {
      if (draggedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        draggedRef.current = false;
      }
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inViewRef.current = entry.isIntersecting;
            if (entry.isIntersecting) resume();
            else pause();
          });
        },
        { threshold: 0.15 }
      );
      io.observe(container.closest("section") ?? container);
    }

    let pressX = 0;

    // `passive` es una opción real de Observer en runtime que su .d.ts no
    // declara (ver Observer.js, `vars.passive`) — variable tipada aparte y
    // no objeto literal inline para que el excess-property-check de TS no
    // la rechace.
    const vars: Observer.ObserverVars & { passive?: boolean } = {
      target: container,
      type: "touch,pointer",
      lockAxis: true,
      preventDefault: false,
      passive: false,
      onPress: () => {
        draggedRef.current = false;
        tweenRef.current?.kill();
        pause();
        container.classList.replace("cursor-grab", "cursor-grabbing");
        pressX = Number(gsap.getProperty(track, "x"));
      },
      onDrag: (self) => {
        if (self.axis !== "x") return;
        self.event?.preventDefault?.();
        const dx = (self.x ?? 0) - (self.startX ?? 0);
        if (Math.abs(dx) > CLICK_GUARD_PX) draggedRef.current = true;
        gsap.set(track, { x: pressX + dx });

        // Acá había un `paint()` por frame, para adelantar cuál iba a quedar al
        // frente. Se fue cuando el ancho de la celda pasó a depender de
        // `data-active`: repintarlo mientras el dedo arrastra reacomoda la fila
        // ENTERA —la celda entrante crece, todas las siguientes se corren— y el
        // contenido se escapa de debajo del dedo. Mientras el atributo solo
        // cambiaba el interior de una card, esto no se notaba.
        //
        // El destino se pinta al soltar, en el `goTo` de `onRelease`, y ahí el
        // ancho y el track viajan juntos con la misma curva.
      },
      onRelease: (self) => {
        container.classList.replace("cursor-grabbing", "cursor-grab");
        if (self.axis !== "x") {
          resume();
          return;
        }
        // `indexRef.current` como `norm`: durante el drag el estado activo no
        // cambia —ver la nota del `onDrag`— así que el layout que se está
        // midiendo es el que corresponde al índice vigente.
        const x = Number(gsap.getProperty(track, "x"));
        goTo(posFor(x, indexRef.current) - N);
        resume();
      },
    };

    const observer = Observer.create(vars);

    container.addEventListener("keydown", onKeyDown);
    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("focusin", onFocusIn);
    container.addEventListener("focusout", onFocusOut);
    container.addEventListener("click", onClickCapture, true);

    return () => {
      observer.kill();
      tweenRef.current?.kill();
      pause();
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeId);
      container.removeEventListener("keydown", onKeyDown);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("focusin", onFocusIn);
      container.removeEventListener("focusout", onFocusOut);
      container.removeEventListener("click", onClickCapture, true);
      goToRef.current = () => {};
      goToExternalRef.current = () => {};
    };
  }, [count]);

  return {
    containerRef,
    trackRef,
    index,
    goTo,
    rootProps: {
      role: "group",
      tabIndex: 0,
    },
  };
}

/** 3 copias de `items`, cada celda con `data-logical` para que el motor la ubique. Solo la copia central (c===1) queda accesible a lectores de pantalla. */
export function buildLoopCells<Item>(items: readonly Item[]): Array<{ item: Item; key: string; logical: number; hidden: boolean }> {
  const cells: Array<{ item: Item; key: string; logical: number; hidden: boolean }> = [];
  for (let c = 0; c < COPIES; c++) {
    items.forEach((item, k) => {
      cells.push({ item, key: `${c}-${k}`, logical: k, hidden: c !== 1 });
    });
  }
  return cells;
}
