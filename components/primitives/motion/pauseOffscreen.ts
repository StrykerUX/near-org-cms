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
export function onViewportToggle(
  trigger: Element,
  cb: (visible: boolean) => void,
  /**
   * Margen de anticipación, en viewports. 0 = avisa cuando la sección toca el
   * borde (el default, y lo correcto para pausar un loop). Un valor mayor avisa
   * ANTES, que es lo que hace falta cuando la reacción tarda: descargar un chunk,
   * inicializar un contexto WebGL, construir una escena. Con 1 el aviso llega a
   * un viewport de distancia.
   */
  lead = 0
) {
  const startPct = 100 + lead * 100;
  const endPct = -lead * 100;

  // Estado inicial calculado a mano: ScrollTrigger no invoca onToggle al
  // crearse, y leer self.isActive antes del primer refresh no es confiable.
  const r = trigger.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  cb(r.bottom > -lead * vh && r.top < vh + lead * vh);

  return ScrollTrigger.create({
    trigger,
    start: `top ${startPct}%`,
    end: `bottom ${endPct}%`,
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
 * También administra el `will-change` de los elementos animados, por lo mismo:
 * pausar el tween deja de repintar, pero la CAPA de compositing que
 * `will-change` reserva sigue ocupando memoria de GPU mientras el elemento está
 * fuera de vista. En un marquee eso son bandas de varios miles de píxeles de
 * ancho promovidas durante toda la sesión. Al entrar se promueve, al salir se
 * suelta — que es exactamente lo que la propiedad está pensada para hacer y lo
 * contrario de declararla fija en el className.
 *
 * Por eso las secciones que lo usan NO deben llevar `will-change-transform` en
 * el markup: sería permanente y anularía esto.
 *
 * Debe llamarse DENTRO de un gsap.context() (ver useGsapContext) para que el
 * ScrollTrigger que crea se revierta junto con el resto del scope.
 */
export function pauseOffscreen(tween: gsap.core.Animation, trigger: Element) {
  tween.pause();

  // Los targets del propio tween: es lo que se está moviendo y por tanto lo que
  // conviene promover. `targets()` los devuelve resueltos, ya sea que el tween se
  // haya creado con un selector, un nodo o un array. Solo lo tienen Tween y
  // Timeline, no el tipo Animation que acepta esta función, de ahí el guard: una
  // timeline anidada simplemente no promueve nada y sigue pausándose igual.
  const hasTargets = (a: gsap.core.Animation): a is gsap.core.Tween =>
    typeof (a as gsap.core.Tween).targets === "function";
  const targets = hasTargets(tween)
    ? tween.targets<Element>().filter((t): t is HTMLElement => t instanceof HTMLElement)
    : [];

  onViewportToggle(trigger, (visible) => {
    if (visible) tween.play();
    else tween.pause();
    for (const el of targets) el.style.willChange = visible ? "transform" : "auto";
  });
}
