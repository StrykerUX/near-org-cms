"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Provider de motion scopeado a /prototype/homepage (montado en su propio
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
    // Si se recarga a mitad de página, el navegador restaura el scroll ANTES
    // de que existan los triggers — el pin mediría contra un offset viejo.
    const prevRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
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
      instance.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(raf);
      return () => {
        gsap.ticker.remove(raf);
        instance.destroy();
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
      history.scrollRestoration = prevRestoration;
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return <>{children}</>;
}
