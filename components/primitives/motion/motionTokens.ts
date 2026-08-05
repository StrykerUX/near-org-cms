// Tokens compartidos por el toolkit de motion — nada de esto es de marca,
// es infraestructura de animación (breakpoints, easing, media queries).

export const MQ = {
  // "no-preference" y no la negación de "reduce": en un user-agent que no
  // soporte la feature, ambas media queries dan `false` — cae del lado
  // estático (seguro), no del animado (el fallo peligroso).
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
} as const;

export const EASE_OUT = "power3.out";

export const REVEAL = {
  y: 28,
  duration: 0.9,
  stagger: 0.09,
  start: "top 82%",
} as const;

// ?markers=1 en la URL enciende los markers de ScrollTrigger, solo en dev —
// nunca en producción, y solo si el flag está explícito en la URL.
export const DEBUG_MARKERS =
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  window.location.search.includes("markers");
