"use client";

import type Lenis from "lenis";

// El Lenis activo, para lo que necesite MOVER la página desde fuera de React.
//
// Existe por una razón concreta: cuando hay smooth scroll, Lenis es el DUEÑO de
// la posición de scroll — escribe `scrollTop` en cada frame desde su posición
// interpolada. Cualquiera que escriba `scrollTop` por su cuenta (un
// `gsap.to(scroller, { scrollTop })`, un `window.scrollTo`) entra en una pelea
// de a un frame por vez con él: el otro escribe, Lenis lo pisa con su valor,
// y lo que se ve es un scroll que tironea. El tirón del footer hacia el fondo
// era exactamente eso.
//
// Los dos providers —`LenisProvider` de (site) y `PrototypeMotionProvider`—
// registran su instancia acá al crearla y la sacan al destruirla. `null`
// significa que NO hay smooth scroll (reduced-motion, o una ruta que lo
// desactiva como /blog): ahí el scroll nativo es de quien lo pida, y el
// llamador cae a su propio camino.
//
// Un módulo y no un contexto de React a propósito: los consumidores son
// efectos de GSAP, no render.
let current: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  current = instance;
}

export function getLenis(): Lenis | null {
  return current;
}
