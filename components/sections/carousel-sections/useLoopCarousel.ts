"use client";

import { useRef, useState, useCallback, type RefObject } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { Observer } from "gsap/Observer";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Registro local, no en gsapClient.ts (compartido, fuera de los límites de
// este trabajo): registerPlugin es idempotente y aditivo.
gsap.registerPlugin(Observer);

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
const AUTOPLAY_MS = 7000;
const SETTLE_DURATION = 0.85;
const SETTLE_EASE = "power3.inOut";
const CLICK_GUARD_PX = 6;

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
  const countRef = useRef(count);
  countRef.current = count;

  const goToRef = useRef<(i: number) => void>(() => {});
  const goToExternalRef = useRef<(target: number) => void>(() => {});
  const goTo = useCallback((target: number) => goToExternalRef.current(target), []);

  const containerRef = useGsapContext<T>((_self, container) => {
    const track = trackRef.current;
    if (!track) return;

    const N = countRef.current;
    const cells = Array.from(container.querySelectorAll<HTMLElement>("[data-cell]"));
    if (cells.length === 0) return;

    const motionOkRef = { current: true };
    const hoverRef = { current: false };
    const focusRef = { current: false };
    const inViewRef = { current: true };
    const draggedRef = { current: false };
    const tweenRef: { current: gsap.core.Tween | null } = { current: null };
    const timerRef: { current: ReturnType<typeof gsap.delayedCall> | null } = { current: null };

    let stepW = 0;

    // offsetLeft/offsetWidth, no getBoundingClientRect(): el rect refleja
    // cualquier transform de la celda, y acá la grilla es uniforme — todas
    // las celdas miden y espacian igual, la diferencia activa/vecina es
    // interna a la card, no de la celda. offsetWidth es el layout box.
    function measure() {
      const a = cells[0].offsetLeft;
      const b = cells[1]?.offsetLeft ?? a;
      stepW = b - a;
    }

    // x para que la celda ABSOLUTA `pos` quede centrada en el viewport.
    function xFor(pos: number) {
      const vw = container.getBoundingClientRect().width;
      const cardW = cells[0].offsetWidth;
      return vw / 2 - (pos * stepW + cardW / 2);
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
      const target = xFor(absPos(i));

      function settle() {
        const norm = ((i % N) + N) % N;
        if (norm !== i) {
          indexRef.current = norm;
          gsap.set(track, { x: xFor(absPos(norm)) });
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
        paint(((i % N) + N) % N);
        tweenRef.current = gsap.to(track, {
          x: target,
          duration: SETTLE_DURATION,
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
      return () => {
        motionOkRef.current = false;
      };
    });

    measure();
    goTo(0, true);
    startTimer();

    // Reposicionar tras un cambio de breakpoint o de fuente: --card-w/--gap
    // cambian de ancho, así que stepW/cardW quedan viejos si no se remide.
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
        const x = pressX + dx;
        gsap.set(track, { x });

        const cardW = cells[0].offsetWidth;
        const vw = container.getBoundingClientRect().width;
        const pos = Math.round((vw / 2 - x - cardW / 2) / stepW);
        paint((((pos - N) % N) + N) % N);
      },
      onRelease: (self) => {
        container.classList.replace("cursor-grabbing", "cursor-grab");
        if (self.axis !== "x") {
          resume();
          return;
        }
        const x = Number(gsap.getProperty(track, "x"));
        const cardW = cells[0].offsetWidth;
        const vw = container.getBoundingClientRect().width;
        const pos = Math.round((vw / 2 - x - cardW / 2) / stepW);
        goTo(pos - N);
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
