import { ScrollTrigger } from "./gsapClient";

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
  ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
  });
}
