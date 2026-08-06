import { ScrollTrigger } from "./gsapClient";

/**
 * Notifica entrada/salida del viewport. Mismo criterio que `pauseOffscreen`
 * pero con un callback en vez de una animación de GSAP — necesario para
 * gatear cosas que GSAP no conoce (un loop de rAF propio, un contexto
 * WebGL, un listener costoso).
 *
 * Debe llamarse DENTRO de un gsap.context() para que el ScrollTrigger que
 * crea se revierta con el resto del scope.
 */
export function onViewportToggle(trigger: Element, cb: (visible: boolean) => void) {
  // Estado inicial calculado a mano: ScrollTrigger no invoca onToggle al
  // crearse, y leer self.isActive antes del primer refresh no es confiable.
  const r = trigger.getBoundingClientRect();
  cb(r.bottom > 0 && r.top < (window.innerHeight || 0));

  return ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => cb(self.isActive),
  });
}

/**
 * Pausa un tween/timeline en loop infinito mientras su sección no toca el
 * viewport, y lo reanuda al volver a entrar. Con varios loops infinitos
 * simultáneos en una misma página (marquee, ken-burns, float idle), esto es
 * la diferencia entre una página fluida y una que repinta fuera de pantalla
 * todo el tiempo.
 *
 * Debe llamarse DENTRO de un gsap.context() (ver useGsapContext) para que el
 * ScrollTrigger que crea se revierta junto con el resto del scope.
 */
export function pauseOffscreen(tween: gsap.core.Animation, trigger: Element) {
  tween.pause();
  onViewportToggle(trigger, (visible) => (visible ? tween.play() : tween.pause()));
}
