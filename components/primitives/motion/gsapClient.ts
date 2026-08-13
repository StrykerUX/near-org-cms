"use client";

// Registro único de plugins GSAP para el toolkit de motion de los prototipos.
// Este módulo se evalúa una sola vez por bundle — cualquier archivo que
// necesite gsap/ScrollTrigger/SplitText lo importa de acá, nunca directo de
// "gsap", para no registrar los plugins más de una vez.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText); // idempotente

if (typeof window !== "undefined") {
  // iOS/Android colapsan la address bar al scrollear: eso dispara un resize
  // vertical que haría re-medir (y saltar) cualquier pin.
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Sin esto, cualquier stall del main thread (muy común en dev con HMR)
  // hace que el ticker "recupere" tiempo de golpe — en un loop infinito eso
  // se ve como un salto/stutter en vez de una simple pausa.
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, SplitText };
