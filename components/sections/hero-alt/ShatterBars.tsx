"use client";

import Container from "@/components/primitives/Container";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { STATEMENT } from "@/components/sections/hero-alt/heroAltContent";

// ── 03 · Shatter · segunda sección ───────────────────────────────────────────
//
// El teletipo: el statement se escribe con el scroll, carácter por carácter, y
// un cursor recorre el texto por delante del frente de escritura.
//
// ── El cursor no se anima: se COLOCA ────────────────────────────────────────
//
// La forma obvia —animar el `x` del cursor de un extremo al otro— falla en
// cuanto el párrafo hace wrap: el cursor cruzaría el hueco entre el final de
// una línea y el principio de la siguiente en diagonal, por el aire.
//
// Acá se mide una vez la caja de cada carácter respecto del párrafo, y la
// timeline lleva un `set` por carácter. Con `scrub`, esos `set` se resuelven
// como saltos discretos que caen exactamente sobre el glifo que se está
// revelando, salto de renglón incluido. Es más código que un tween y es la
// única versión que funciona con texto que no cabe en una línea.
//
// Las medidas se toman DESPUÉS del split y dentro del efecto, así que ya
// incluyen la fuente real; si el swap de fuentes llegara tarde,
// `invalidateOnRefresh` del track hace que ScrollTrigger vuelva a pedir el
// cálculo — por eso las posiciones se leen en una función y no se hornean en un
// array al construir la timeline.

// Cada cuánto avanza el frente, en fracción del recorrido del track. El
// statement tiene ~190 caracteres, así que con 0.0032 la escritura ocupa un 60%
// del track y queda el resto para leerlo quieto.
const CHAR_STEP = 0.0032;

// Cuántos caracteres por delante del frente va el cursor. Cero lo deja tapado
// por el glifo que acaba de aparecer; con dos se ve que va guiando.
const CURSOR_LEAD = 2;

export default function ShatterBars() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const copy = q("[data-sh2-copy]")[0];
    const cursor = q("[data-sh2-cursor]")[0];
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "sh");
    const split = SplitText.create(copy, { type: "chars" });
    const chars = split.chars as HTMLElement[];

    // Estado de partida: todo apagado. Va acá y no en el JSX porque sin JS —o
    // con reduced-motion— el statement tiene que leerse entero, y un
    // `opacity: 0` en el markup lo dejaría invisible para siempre.
    gsap.set(chars, { autoAlpha: 0 });
    gsap.set(cursor, { autoAlpha: 1 });

    const tl = trackTimeline(scope, { scrub: 0.25 });

    chars.forEach((char, i) => {
      const at = i * CHAR_STEP;

      // El glifo aparece sin transform: cualquier `y` acá haría que el texto ya
      // escrito tiemble mientras el resto sigue entrando.
      tl.to(char, { autoAlpha: 1, duration: 0.001, ease: "none" }, at);

      // El cursor salta al carácter que viene. `offsetLeft/Top` y no
      // `getBoundingClientRect`: los primeros son relativos al padre posicionado
      // —el propio párrafo— así que no hay que restar scroll ni la posición del
      // sticky, que cambia en cada frame del track.
      const guide = chars[Math.min(chars.length - 1, i + CURSOR_LEAD)];
      tl.set(
        cursor,
        { x: guide.offsetLeft + guide.offsetWidth, y: guide.offsetTop },
        at
      );
    });

    // El cursor se apaga cuando termina de escribir. `+ 0.02` y no exactamente
    // al final: si coincide con el último carácter, el parpadeo del apagado se
    // superpone con su aparición y parece un glitch.
    tl.to(cursor, { autoAlpha: 0, duration: 0.02 }, chars.length * CHAR_STEP + 0.02);

    return () => {
      // El orden importa: primero matar la timeline (que tiene referencias a los
      // nodos del split) y recién después revertir el split, o los tweens
      // quedan apuntando a nodos que ya no están en el documento.
      tl.scrollTrigger?.kill();
      tl.kill();
      split.revert();
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      className="relative overflow-x-clip bg-cream text-foreground data-[sh=on]:h-[300svh]"
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <Container>
          {/* El cursor va FUERA del <p>, y no es un detalle de estilo: SplitText
              divide TODO el contenido del elemento que recibe, así que un <span>
              adentro terminaría troceado entre los caracteres y el cursor
              dejaría de existir como nodo.

              Este wrapper es además el contenedor posicionado contra el que se
              miden los `offsetLeft/Top`. Como el <p> NO lleva `position`, el
              `offsetParent` de cada carácter es este div — el mismo origen que
              usa el cursor. Ponerle `relative` al <p> rompería justamente eso:
              pasarían a medirse contra el párrafo y el cursor contra el
              wrapper, dos orígenes distintos separados por el centrado. */}
          <div className="relative mx-auto w-fit">
            <p
              data-sh2-copy
              className="mx-auto max-w-[24ch] text-center text-statement text-pretty"
            >
              {STATEMENT}
            </p>

            {/* `top-0 left-0` + transform: GSAP escribe `x`/`y`, que son
                transforms, y sumarlos a un `top` no nulo obligaría a restarlo en
                cada `set`. El alto es `1em` del propio bloque, así que sigue a
                la escala fluida del token sin declarar un tamaño a mano.

                `aria-hidden` porque es un adorno del gesto: el texto que guía ya
                está en el DOM y un lector de pantalla lo lee entero. */}
            <span
              data-sh2-cursor
              aria-hidden="true"
              className="absolute left-0 top-0 block w-[0.06em] bg-near-green-accent"
              style={{ height: "1em" }}
            />
          </div>
        </Container>
      </div>
    </section>
  );
}
