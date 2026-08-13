type Placement =
  /**
   * Reparte los caracteres sobre una fracción FIJA del progreso de la timeline.
   * El paso se deriva del número de caracteres, así que el efecto ocupa el mismo
   * tramo de scroll aunque la frase cambie de largo. Es lo que hay que usar
   * cuando el texto viene de datos y no de un literal.
   */
  | { at: number; span: number }
  /**
   * Paso fijo por carácter. El efecto se alarga si la frase se alarga — sirve
   * cuando lo calibrado es la VELOCIDAD de la escritura (el ancho del frente de
   * color) y no cuánto scroll ocupa.
   */
  | { at?: number; step: number };

/**
 * Coloca un tween por carácter, escalonados, sobre una timeline existente.
 *
 * Es la mecánica común a los dos pasajes que "escriben" texto letra a letra en
 * quantum-security. Lo que se comparte no es el efecto — cada uno tiene sus
 * propios keyframes de color — sino la aritmética del reparto, que es justo donde
 * se copia mal: dividir por `length` en lugar de `length - 1` deja el último
 * carácter fuera del span, y sin el `Math.max(1, ...)` una frase de un solo
 * carácter divide por cero.
 *
 * `build` recibe el índice y `t`, la posición normalizada del carácter en la
 * frase (0 en el primero, 1 en el último), y devuelve las vars del tween. `t` es
 * lo que permite que el color final de cada letra muestree una rampa:
 *
 *   staggerChars(tl, split.chars, { at: 0.68, span: 0.15 }, (i, t) => ({
 *     keyframes: [
 *       { autoAlpha: 1, color: CTA_RAMP_HEAD, duration: 0.05, ease: "none" },
 *       { color: gsap.utils.interpolate(CTA_RAMP, t), duration: 0.1, ease: "none" },
 *     ],
 *   }));
 */
export function staggerChars(
  tl: gsap.core.Timeline,
  chars: Element[],
  placement: Placement,
  build: (index: number, t: number) => gsap.TweenVars
): void {
  const last = Math.max(1, chars.length - 1);
  const at = placement.at ?? 0;
  const step = "step" in placement ? placement.step : placement.span / last;

  chars.forEach((c, i) => {
    tl.to(c, build(i, i / last), at + i * step);
  });
}
