"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Provider de motion scopeado a las páginas de prototipo animadas (montado en
// el propio
// layout.tsx). NO reemplaza a components/site/providers/LenisProvider.tsx,
// que sigue sirviendo app/(site) tal cual — converger ambos es trabajo
// futuro, no de este prototipo.
//
// La diferencia con LenisProvider: esa página nunca usa ScrollTrigger, así
// que deliberadamente omite ScrollTrigger.refresh() (su comentario explica
// que refresh() mueve window.scrollY para re-medir, lo que desincroniza el
// scroll virtual de Lenis y lo congela en páginas largas). Acá SÍ hay
// ScrollTrigger — con pin incluido — así que el refresh es obligatorio, y en
// cambio resolvemos la desincronización re-anclando Lenis a su posición real
// (`actualScroll`) apenas termina cada refresh.
export default function PrototypeMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // ── La recarga conserva la posición ────────────────────────────────────
    //
    // Acá había un `scrollRestoration = "manual"` + `scrollTo(0, 0)` que mandaba
    // al hero en cada recarga. Su motivo escrito era "el navegador restaura el
    // scroll ANTES de que existan los triggers — el pin mediría contra un offset
    // viejo", y ese motivo ya no aplica: **en este repo no hay un solo
    // `pin: true`**. Está prohibido por regla (ver `motion/stickyScene.ts`), las
    // escenas pegadas usan `position: sticky` de CSS y sus triggers solo LEEN
    // progreso, así que el `refresh()` coordinado de más abajo los mide bien en
    // cualquier posición de scroll.
    //
    // Lo que el reset SÍ hacía, sin decirlo: garantizar que todos los triggers se
    // recorran desde su inicio. Aterrizando a mitad de página, un trigger que
    // quedó por encima nunca dispara su `onUpdate` —solo corre dentro del rango—
    // y sus elementos se quedan en el estado que les dejó el `gsap.set` inicial.
    //
    // Quien tiene `onRefresh` o una animación con `scrub` se recorrige solo.
    // `QuantumBars` y `HeroVideo` lo tienen; `ProofStepper`, `NearStack` y
    // `FooterV4` no, así que son el sitio donde mirar si algo aparece en un
    // estado raro tras recargar a mitad de página. El arreglo de fondo es que
    // cada uno se recorrija en `onRefresh`, no volver a mandar al lector al
    // principio.
    //
    // `clearScrollMemory` se queda: borra las posiciones que ScrollTrigger
    // recuerda por su cuenta, que si no pelearían con la restauración del
    // navegador.
    ScrollTrigger.clearScrollMemory();

    let lenis: Lenis | null = null;
    let refreshing = false;

    const onRefreshInit = () => {
      refreshing = true;
      lenis?.stop();
    };
    const onRefresh = () => {
      if (lenis) {
        lenis.start();
        lenis.resize();
        lenis.scrollTo(lenis.actualScroll, { immediate: true, force: true, lock: false });
      }
      refreshing = false;
    };
    ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Un solo refresh coordinado, debounced a doble rAF. Este efecto corre
    // DESPUÉS que los de todas las secciones-hijas (React vacía los efectos
    // de los hijos antes que los del padre), así que cuando dispara ya
    // existen todos los ScrollTrigger de la página.
    let raf1 = 0;
    let raf2 = 0;
    const settle = () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
      });
    };

    // Smooth scroll solo si el usuario no pidió reducir movimiento —
    // hijackear el scroll ES movimiento. matchMedia reacciona en vivo si la
    // preferencia cambia mientras la página está abierta.
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const instance = new Lenis({ autoRaf: false });
      lenis = instance;
      // Dev-only handle. Lenis owns the scroll position, so anything outside
      // React that needs to move the page — a screenshot harness, a manual
      // console poke — has to go through it; `window.scrollTo` gets animated
      // straight back. Without this the only way to capture a section was to
      // guess at document coordinates, which is how a whole page once got
      // built without anyone seeing it.
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __lenis?: Lenis }).__lenis = instance;
      }
      instance.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(raf);
      return () => {
        gsap.ticker.remove(raf);
        instance.destroy();
        if (process.env.NODE_ENV !== "production") {
          delete (window as unknown as { __lenis?: Lenis }).__lenis;
        }
        lenis = null;
      };
    });

    settle();

    // El layout se sigue moviendo después del mount: montreal es
    // display:swap, las imágenes decodifican, el SVG isométrico se acomoda.
    // Re-medir en cada hito real.
    document.fonts?.ready.then(settle).catch(() => {});
    const onLoad = () => settle();
    if (document.readyState === "complete") settle();
    else window.addEventListener("load", onLoad);

    // Cambios reales de altura. El umbral de 4px evita el bucle
    // refresh -> el pin-spacer cambia scrollHeight -> ResizeObserver -> refresh.
    let resizeTimer: ReturnType<typeof setTimeout>;
    let lastHeight = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      if (refreshing) return;
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastHeight) < 4) return;
      lastHeight = h;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(settle, 200);
    });
    ro.observe(document.documentElement);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(resizeTimer);
      ro.disconnect();
      window.removeEventListener("load", onLoad);
      mm.revert(); // destruye Lenis y saca su callback del ticker
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return <>{children}</>;
}
