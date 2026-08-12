"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Smooth scroll de app/(site). Sigue siendo un provider distinto del de
// /prototype (`PrototypeMotionProvider`) porque resuelven cosas distintas: acá NO
// hay ScrollTrigger con recorridos medidos, y `ScrollTrigger.refresh()` se omite a
// propósito (ver el comentario abajo). Converger ambos es trabajo aparte.
//
// Los plugins y su configuración salen de `primitives/motion/gsapClient`, no de un
// `registerPlugin` propio. Este archivo tenía el segundo punto de registro del
// repo, y la consecuencia no era el registro duplicado —es idempotente— sino que
// el sitio público corría ScrollTrigger SIN el
// `config({ ignoreMobileResize: true })` que el wrapper aplica: en móvil, colapsar
// la barra de direcciones dispara un resize vertical y una re-medición.
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Blog pages don't use GSAP/ScrollTrigger animations and have long dynamic
    // content that causes Lenis's virtual scroll limit to desync mid-scroll.
    if (pathname.startsWith("/blog")) return;

    // Hijackear el scroll ES movimiento, así que va gateado por
    // `prefers-reduced-motion` igual que cualquier animación. Antes no lo estaba:
    // un lector que pide reducir movimiento recibía el scroll suavizado de todas
    // formas, que es justo lo que más se nota. `gsap.matchMedia` además reacciona
    // en vivo si la preferencia cambia con la página abierta.
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      // `autoRaf: false` es obligatorio junto con `gsap.ticker.add`: Lenis 1.3
      // arranca su PROPIO requestAnimationFrame por defecto, así que sin esto
      // había dos loops llamando `lenis.raf()` en el mismo frame — el suyo y el
      // del ticker.
      const lenis = new Lenis({ autoRaf: false });

      lenis.on("scroll", ScrollTrigger.update);

      // La referencia se guarda para poder quitar exactamente esta función.
      const rafCallback = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(rafCallback);

      // Recalculate scroll limit whenever the document height changes
      // (fonts loading, images rendering, code blocks, dynamic content).
      // Debounced to coalesce rapid bursts (e.g. several images loading at once).
      // ScrollTrigger.refresh() is intentionally omitted here: it temporarily
      // manipulates window.scrollY to re-measure offsets, which desynchronises
      // Lenis's virtual scroll position and causes scroll to freeze on long pages.
      // Pages that use ScrollTrigger animations mount their own provider
      // (PrototypeMotionProvider) that manages that lifecycle independently.
      let resizeTimer: ReturnType<typeof setTimeout>;
      const ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => lenis.resize(), 150);
      });
      ro.observe(document.documentElement);

      // Also force a recalculation once everything (images, fonts) is fully loaded
      const onLoad = () => {
        lenis.resize();
        ScrollTrigger.refresh();
      };
      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }

      return () => {
        lenis.destroy();
        gsap.ticker.remove(rafCallback);
        ro.disconnect();
        clearTimeout(resizeTimer);
        window.removeEventListener("load", onLoad);
      };
    });

    return () => mm.revert();
  }, [pathname]);

  return <>{children}</>;
}
