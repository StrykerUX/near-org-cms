"use client";

// Registro único de plugins GSAP para el toolkit de motion del prototipo
// "homepage". Este módulo se evalúa una sola vez por bundle — cualquier
// archivo que necesite gsap/ScrollTrigger/SplitText lo importa de acá, nunca
// directo de "gsap", para no registrar los plugins más de una vez.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
// CustomEase lo usa por ahora solo el laboratorio del descenso
// (components/sections/lab/): permite declarar una curva de scroll con puntos de
// control en vez de elegir entre los eases con nombre de GSAP.
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase); // idempotente

if (typeof window !== "undefined") {
  // iOS/Android colapsan la address bar al scrollear: eso dispara un resize
  // vertical que haría re-medir (y saltar) cualquier pin.
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Sin esto, cualquier stall del main thread (muy común en dev con HMR)
  // hace que el ticker "recupere" tiempo de golpe — en un loop infinito eso
  // se ve como un salto/stutter en vez de una simple pausa.
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger, SplitText, CustomEase };
