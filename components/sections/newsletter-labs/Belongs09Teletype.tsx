"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 09 · Teletype ────────────────────────────────────────────────────────────
//
// La frase se ESCRIBE al llegar, con un cursor que la va guiando, y el campo
// aparece cuando termina de escribirse.
//
// La apuesta: en una sección que pide un dato, que el texto se escriba solo
// prepara el gesto — cuando el cursor se apaga, el sitio natural para seguir
// escribiendo es el campo. Nada lo dice; lo dice el orden.
//
// ── El cursor se COLOCA, no se anima ────────────────────────────────────────
//
// La forma obvia —animar la `x` del cursor de un extremo al otro— falla en
// cuanto el párrafo hace wrap: cruzaría el hueco entre el final de una línea y
// el principio de la siguiente en diagonal, por el aire.
//
// Acá se mide la caja de cada carácter respecto del párrafo y la timeline lleva
// un `set` por carácter: saltos discretos que caen exactamente sobre el glifo
// que se está revelando, salto de renglón incluido. Es el mismo mecanismo que
// `hero-alt/ShatterBars`, y por el mismo motivo.
//
// `offsetLeft/Top` y no `getBoundingClientRect`: son relativos al padre
// posicionado —el propio párrafo— así que no hay que restar el scroll.
//
// ── Por qué `once` y no scrub ───────────────────────────────────────────────
//
// Un texto que se re-escribe cada vez que el lector sube dos líneas y vuelve a
// bajar es ruido. Esto entra una vez y se queda.

// Cuánto tarda en aparecer cada carácter. 0.012s da ~110 caracteres por
// segundo: rápido para que no se haga esperar, lento para que se lea como
// escritura y no como un fundido.
const CHAR_STEP = 0.012;

// Cuántos caracteres por delante del texto va el cursor. Cero lo deja tapado
// por el glifo que acaba de aparecer; con dos se ve que va guiando.
const CURSOR_LEAD = 2;

export default function Belongs09Teletype() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    // Sin animación con reduced-motion: el texto ya está completo en el markup y
    // el `set` inicial es lo único que lo esconde. No hacer nada ES la
    // degradación correcta.
    if (!motionOk) return;

    const copy = q("[data-copy]")[0];
    const cursor = q("[data-cursor]")[0];
    const head = q("[data-head]")[0];
    const field = q("[data-field]")[0];
    if (!copy || !cursor) return;

    // `words,chars` y no solo `chars`: partiendo únicamente en caracteres, cada
    // glifo queda en su propio nodo y el navegador puede cortar la línea entre
    // dos cualesquiera — el párrafo salía partido a mitad de palabra
    // ("milesto / nes"). Con las palabras como nodo intermedio, el wrap vuelve a
    // respetar sus límites y el escalonado sigue yendo por carácter.
    const split = SplitText.create(copy, { type: "words,chars" });
    const chars = split.chars as HTMLElement[];

    // Estado de partida desde JS y no desde el markup: con `opacity-0` en las
    // clases, un fallo de bundle dejaría el párrafo invisible para siempre.
    gsap.set(chars, { autoAlpha: 0 });
    gsap.set(cursor, { autoAlpha: 1 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top 75%", once: true, markers: DEBUG_MARKERS },
    });

    // El titular entra antes de que empiece la escritura: es el encabezado del
    // mensaje, no parte del mensaje.
    if (head) tl.from(head, { autoAlpha: 0, y: 16, duration: 0.7, ease: EASE_OUT }, 0);

    chars.forEach((char, i) => {
      const at = 0.45 + i * CHAR_STEP;
      // Sin transform: cualquier `y` acá haría temblar el texto ya escrito
      // mientras el resto sigue entrando.
      tl.to(char, { autoAlpha: 1, duration: 0.001, ease: "none" }, at);

      const guide = chars[Math.min(chars.length - 1, i + CURSOR_LEAD)];
      tl.set(
        cursor,
        { x: guide.offsetLeft + guide.offsetWidth, y: guide.offsetTop },
        at
      );
    });

    const end = 0.45 + chars.length * CHAR_STEP;

    // El cursor se apaga y el campo entra: ese relevo es la idea de la variante.
    tl.to(cursor, { autoAlpha: 0, duration: 0.2 }, end + 0.15);
    if (field) tl.from(field, { autoAlpha: 0, y: 14, duration: 0.6, ease: EASE_OUT }, end + 0.2);

    return () => {
      // Primero la timeline (que referencia los nodos del split) y después el
      // revert: al revés, los tweens quedan apuntando a nodos que ya no están.
      tl.scrollTrigger?.kill();
      tl.kill();
      split.revert();
      gsap.set([cursor, ...(field ? [field] : []), ...(head ? [head] : [])], {
        clearProps: "all",
      });
    };
  });

  return (
    <section ref={rootRef} className="bg-stone py-24 text-ink lg:py-32">
      <Container className="flex flex-col items-center gap-8 text-center">
        <h2 data-head className="flex flex-col items-center text-h1 text-pretty">
          <Wordmark height="clamp(2rem, 1.5rem + 2.4vw, 3.6rem)" className="mb-1" />
          <Accent>{BELONGS_COPY.claim}</Accent>
        </h2>

        {/* `relative` es lo que hace que el `offsetLeft/Top` de cada carácter sea
            relativo a ESTE bloque: es contra lo que se posiciona el cursor. */}
        <div className="relative max-w-[46ch]">
          <p data-copy className="text-body-lg text-ink/70 text-pretty">
            {BELONGS_COPY.body}
          </p>
          {/* El cursor: un bloque del alto de la línea. `aria-hidden` porque no
              es contenido — el párrafo entero ya está en el DOM desde el SSR. */}
          <span
            data-cursor
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 block h-[1.1em] w-[0.5ch] bg-green-ink opacity-0"
          />
        </div>

        <div data-field className="w-full max-w-[32rem]">
          <ShineField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </Container>
    </section>
  );
}
