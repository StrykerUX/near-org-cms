"use client";

import { useRef, useState } from "react";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";

// Lo que otros dicen de NEAR, sobre carbón y en un mazo que avanza.
//
// Va después del newsletter y es el único tramo oscuro del final de la página:
// hasta acá NEAR viene hablando de sí misma, y esto es lo que dijeron otros. El
// cambio de fondo no es ritmo visual, es el cambio de voz.
//
// ── La idea: el mazo ES el índice ───────────────────────────────────────────
//
// La card de adelante y la cita gigante de la izquierda son LA MISMA persona.
// La columna izquierda es la card de adelante leída en voz alta: avanza el
// mazo, cambia la cita, el nombre y la píldora del cargo.
//
// De ahí sale que la profundidad signifique algo. Un mazo en perspectiva al
// lado de una cita fija es decoración —tres rectángulos en diagonal—; un mazo
// donde lo que está adelante es lo que se está leyendo convierte a las cards de
// atrás en testimonios esperando turno, y a la diagonal en una fila. Es la
// misma jugada que el eje de `ProofLedger` unas secciones más arriba: la
// estructura dice algo o no está.
//
// Por eso el artboard, que muestra a Austin Federa con dos textos distintos
// (uno grande a la izquierda y otro dentro de su card), acá tiene uno solo. El
// porqué está escrito en `testimonialDeckContent.ts`, junto a las citas.
//
// ── Cómo se arma la profundidad ─────────────────────────────────────────────
//
// Cuatro señales a la vez, y ninguna alcanza sola:
//
//   · POSICIÓN — cada card retrocede arriba y a la derecha;
//   · ESCALA — y encoge, que es la perspectiva;
//   · SOLAPE — la de adelante tapa la esquina de la de atrás, que es lo único
//     que fija sin ambigüedad cuál está más cerca;
//   · LUZ — un velo en degradé que se opaca con la distancia. Es el que hace el
//     trabajo pesado: sin él, cuatro cards crema sobre carbón se leen como
//     cuatro cards y no como una pila, por más escala que tengan.
//
// El velo va en DEGRADÉ y no plano porque una card entera un 40% más oscura se
// lee como otro color; oscurecida en diagonal se lee como la misma card con
// menos luz encima, que es lo que tiene que parecer.
//
// ── El mazo mide en `xPercent`, no en píxeles ───────────────────────────────
//
// Las posiciones de los slots están en ANCHOS Y ALTOS DE CARD (0.66 = dos
// tercios de card a la derecha), y GSAP las aplica con `xPercent`/`yPercent`,
// que resuelven contra el tamaño del propio elemento. O sea que el mazo no
// necesita medir nada: cambia el ancho de la card —el breakpoint, el zoom, un
// `clamp` distinto— y el abanico se reacomoda solo, sin un `resize` que
// escuchar ni un `ScrollTrigger.refresh()` que disparar. Un mazo posicionado en
// píxeles necesita las dos cosas y se descalibra en silencio cuando falla una.
//
// `transform-origin: top left` es lo que hace que esos números sean legibles:
// con el origen en la esquina, el `scale` no mueve el punto que la posición
// declara, así que cada par (x, y) ES la esquina superior izquierda de la card
// en el artboard. Con el origen al centro habría que compensar cada escala.

const N = TESTIMONIALS.length;

/**
 * El abanico, slot por slot: dónde va la card que está a `i` lugares del
 * frente.
 *
 * `x` e `y` van en anchos y altos de card; `veil`, en opacidad del velo.
 *
 * Es una TABLA y no una fórmula a propósito. Los números salen medidos del
 * artboard, y una progresión geométrica que los aproxime esconde justo lo que
 * hay que poder tocar: el paso horizontal se abre más que el vertical, y la
 * escala cae más lento que los dos. Escrito como tabla, mover una card es
 * mover una fila.
 *
 * Puede tener MENOS filas que testimonios haya. Las cards que no alcanzan slot
 * quedan estacionadas en el último, invisibles, y entran cuando les toca — por
 * eso agregar un quinto testimonio no obliga a inventar un quinto slot.
 */
const DECK = [
  { x: 0, y: 0, scale: 1, veil: 0 },
  { x: 0.66, y: -0.8, scale: 0.93, veil: 0.2 },
  { x: 1.41, y: -1.11, scale: 0.85, veil: 0.4 },
  { x: 2.1, y: -1.28, scale: 0.77, veil: 0.58 },
] as const;

/**
 * El mismo abanico, recogido, para cuando no hay ancho.
 *
 * A 375px el abanico de arriba manda la tercera card a dos anchos de distancia,
 * o sea fuera de la pantalla, y el mazo se queda en una card con un borde
 * asomando. Recogido conserva lo que importa —que hay más, y que están
 * detrás— con el único gesto que cabe: un canto de card por lado.
 *
 * El velo sube en vez de bajar. Con este solape las cards de atrás se ven casi
 * enteras, así que el que las separa de la de adelante ya no es la posición
 * sino la luz, y tiene que trabajar más.
 */
const DECK_TIGHT = [
  { x: 0, y: 0, scale: 1, veil: 0 },
  { x: 0.11, y: -0.1, scale: 0.94, veil: 0.3 },
  { x: 0.22, y: -0.2, scale: 0.88, veil: 0.5 },
  { x: 0.33, y: -0.3, scale: 0.82, veil: 0.66 },
] as const;

/**
 * Adónde se va la card que deja el frente.
 *
 * Hacia ABAJO, a la izquierda y creciendo: sale hacia el lector, como se
 * levanta una carta de la pila. La alternativa —viajar del slot 0 al último
 * cruzando todo el abanico— es un barrido de un segundo por delante de las
 * otras tres que nadie lee como "esta se fue al fondo"; se lee como que una
 * card se escapó.
 */
const EXIT = { x: -0.4, y: 0.34, scale: 1.08 } as const;

/* ── Tiempos ──────────────────────────────────────────────────────────────── */

/** El viaje de una card al slot de adelante. */
const STEP = 0.9;

/**
 * `inOut` y no `out`.
 *
 * Las cuatro cards se mueven a la vez y el ojo las lee como UN objeto —el mazo—
 * que se corre. Un `out` arranca de golpe: cada card sale disparada y el mazo
 * se desarma en cuatro cosas que viajan juntas por casualidad. Con `inOut`
 * arrancan y frenan juntas y el mazo se mueve como un bloque.
 */
const STEP_EASE = "power3.inOut";

/** La salida de la card de adelante, y la vuelta al fondo. */
const EXIT_OUT = 0.45;
const EXIT_IN = 0.5;

/** El relevo de la cita grande: se va, cambia el texto, vuelve. */
const QUOTE_OUT = 0.26;
const QUOTE_IN = 0.5;

/**
 * El paso solo, y el paso una vez que el lector tocó el mazo.
 *
 * Los mismos números y la misma política que `homepage-shared/useLoopCarousel`,
 * donde está el razonamiento largo: 5s es lo que se tarda en leer una card, y
 * en cuanto alguien elige una el autoplay deja de ser una sugerencia y pasa a
 * ser una interrupción, así que la espera se triplica y se queda triplicada.
 *
 * No se importan de ahí porque ese hook es un carrusel de riel —tres copias,
 * drag, snap por redondeo— y esto es un mazo; compartir la constante ataría dos
 * mecanismos que no tienen nada más en común que el número.
 *
 * WCAG 2.2.2 pide poder detener el movimiento: acá lo detienen el hover y el
 * foco de teclado, además de la pestaña oculta y salirse de cuadro.
 */
const AUTOPLAY_MS = 5000;
const AUTOPLAY_ENGAGED_MS = 15000;

/** El frente va arriba de todo; el fondo, abajo. */
const Z_TOP = 10 + N;

type Slot = { x: number; y: number; scale: number; veil: number };

/** Llevar un testimonio al frente. `user` distingue el click del autoplay. */
type GoTo = (to: number, user: boolean) => void;

/** El slot de una card, o el último si el mazo tiene menos slots que cards. */
function slotAt(deck: readonly Slot[], slot: number) {
  return deck[Math.min(slot, deck.length - 1)];
}

export default function TestimonialDeck() {
  // Qué testimonio muestra la COLUMNA. Es estado de React porque cambia texto;
  // el mazo no lo usa —tiene su propio índice en un ref— y esa separación es
  // deliberada: si el motor del mazo dependiera del re-render, cada paso
  // tendría que esperar a React para empezar a animar.
  const [active, setActive] = useState(0);

  const apiRef = useRef<{ goTo: (to: number, user: boolean) => void } | null>(
    null,
  );

  // La columna izquierda entra sola cada vez que cambia `active`. El `deps` es
  // lo que la vuelve a correr; la salida la dispara el mazo, desde `goTo`.
  const quoteRef = useGsapContext<HTMLDivElement>(
    (_self, scope) => {
      if (window.matchMedia(MQ.reduce).matches) {
        gsap.set(scope, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        scope,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: QUOTE_IN, ease: "power3.out" },
      );
    },
    [active],
  );

  const rootRef = useGsapContext<HTMLElement>((self, scope) => {
    const cards = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-card]"),
    );
    if (cards.length === 0) return;

    let deck: readonly Slot[] = DECK;
    let animate = true;
    let index = 0;

    /* ── El motor ─────────────────────────────────────────────────────────── */

    const place = (el: HTMLElement, s: Slot, z: number) =>
      gsap.set(el, {
        xPercent: s.x * 100,
        yPercent: s.y * 100,
        scale: s.scale,
        zIndex: z,
      });

    const veilOf = (el: HTMLElement) =>
      el.querySelector<HTMLElement>("[data-veil]");

    /** Deja el mazo como corresponde al índice actual, sin animar. */
    const layout = () => {
      cards.forEach((el, i) => {
        const slot = (i - index + N) % N;
        const s = slotAt(deck, slot);
        place(el, s, Z_TOP - slot);
        gsap.set(el, { autoAlpha: slot < deck.length ? 1 : 0 });
        gsap.set(veilOf(el), { opacity: s.veil });
      });
    };

    // ── El envoltorio contextSafe, y por qué lleva nombre ─────────────────
    //
    // Lo que hace `add` es lo que documenta `useGsapContext`: los tweens que
    // este handler cree AL LLAMARSE —desde un click, desde el temporizador, o
    // sea fuera del setup— entran igual al contexto y se revierten con él. Sin
    // eso, un desmonte a mitad de un paso deja transforms inline pegados.
    //
    // La forma con nombre y no la de un argumento: los tipos de GSAP declaran
    // la corta como `add<T>(func: T): ReturnType<T>`, que devuelve lo que
    // devuelve el callback —o sea `void` acá— en vez del envoltorio. Es un bug
    // de los tipos y no del runtime, pero la de dos argumentos está bien tipada
    // (`: Function`) y hace exactamente lo mismo, así que se usa esa y el `as`
    // de abajo solo le devuelve la firma.
    const goTo = self.add("goTo", (to: number, user: boolean) => {
      const next = ((to % N) + N) % N;
      if (next === index) return;
      const from = index;
      index = next;

      if (user) engaged = true;

      cards.forEach((el, i) => {
        const before = (i - from + N) % N;
        const after = (i - next + N) % N;
        const s = slotAt(deck, after);
        const z = Z_TOP - after;
        const veil = veilOf(el);
        const shown = after < deck.length ? 1 : 0;

        // Un paso puede llegar con el anterior todavía en vuelo —dos clicks
        // seguidos— y ahí conviven dos tweens sobre la misma card. El peor caso
        // no es el salto: es que la línea de tiempo del reciclado, que apaga la
        // card antes de teletransportarla, quede a medio camino y la deje
        // invisible para siempre. Matando lo que haya, el destino que manda es
        // siempre el último.
        gsap.killTweensOf([el, veil]);

        if (!animate) {
          place(el, s, z);
          gsap.set(el, { autoAlpha: shown });
          gsap.set(veil, { opacity: s.veil });
          return;
        }

        // Retroceder en el mazo (`after > before`) es dar la vuelta: la card
        // pasó del frente al fondo. Interpolar esa distancia la hace cruzar el
        // abanico entero a la vista; en dos tramos, sale de frente, se
        // teletransporta apagada y vuelve a encenderse en el fondo.
        if (after > before) {
          gsap
            .timeline()
            // Arriba de todo mientras sale: es la card que el lector tiene
            // adelante y tiene que taparlas a todas hasta desaparecer.
            .set(el, { zIndex: Z_TOP + 1 })
            .to(el, {
              xPercent: EXIT.x * 100,
              yPercent: EXIT.y * 100,
              scale: EXIT.scale,
              autoAlpha: 0,
              duration: EXIT_OUT,
              ease: "power2.in",
            })
            .add(() => {
              place(el, s, z);
              gsap.set(veil, { opacity: s.veil });
            })
            .to(el, {
              autoAlpha: shown,
              duration: EXIT_IN,
              ease: "power2.out",
            });
          return;
        }

        // El z-index no se interpola: se pone ya, para que la card que avanza
        // pase por DELANTE de la que deja atrás durante todo el viaje.
        gsap.set(el, { zIndex: z });
        gsap.to(el, {
          xPercent: s.x * 100,
          yPercent: s.y * 100,
          scale: s.scale,
          autoAlpha: shown,
          duration: STEP,
          ease: STEP_EASE,
        });
        gsap.to(veil, { opacity: s.veil, duration: STEP, ease: STEP_EASE });
      });

      // La cita se va, y el texto cambia recién cuando terminó de irse. Sin ese
      // `onComplete` el relevo sería un corte seco a media opacidad.
      const quote = quoteRef.current;
      if (!animate || !quote) {
        setActive(next);
        return;
      }
      gsap.to(quote, {
        autoAlpha: 0,
        y: -14,
        duration: QUOTE_OUT,
        ease: "power2.in",
        onComplete: () => setActive(next),
      });
    }) as GoTo;

    apiRef.current = { goTo };

    /* ── El autoplay, y las cuatro cosas que lo detienen ──────────────────── */

    let engaged = false;
    let timer = 0;
    let hovering = false;
    let focused = false;
    let onScreen = true;

    const stop = () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    };

    const start = () => {
      stop();
      if (!animate || hovering || focused || !onScreen || document.hidden)
        return;
      timer = window.setTimeout(
        () => {
          goTo(index + 1, false);
          start();
        },
        engaged ? AUTOPLAY_ENGAGED_MS : AUTOPLAY_MS,
      );
    };

    const enter = () => {
      hovering = true;
      stop();
    };
    const leave = () => {
      hovering = false;
      start();
    };
    const focusIn = () => {
      focused = true;
      stop();
    };
    const focusOut = () => {
      focused = false;
      start();
    };
    const visibility = () => (document.hidden ? stop() : start());

    scope.addEventListener("pointerenter", enter);
    scope.addEventListener("pointerleave", leave);
    scope.addEventListener("focusin", focusIn);
    scope.addEventListener("focusout", focusOut);
    document.addEventListener("visibilitychange", visibility);

    // Fuera de cuadro no hay a quién mostrarle el paso, y el temporizador
    // seguiría corriendo igual: el lector vuelve a una sección que avanzó
    // sola tres veces mientras no la miraba.
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0.25 },
    );
    io.observe(scope);

    // Las flechas mueven el mazo. Las cards ya son botones, así que el Tab
    // recorre los testimonios; esto es el atajo para quien ya está adentro.
    const keys = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1, true);
      else if (e.key === "ArrowLeft") goTo(index - 1, true);
      else return;
      e.preventDefault();
    };
    scope.addEventListener("keydown", keys);

    /* ── Los dos abanicos, y el motion apagado ────────────────────────────── */

    const mm = gsap.matchMedia();
    mm.add({ wide: MQ.desktop, motion: MQ.motion }, (ctx) => {
      const { wide, motion } = ctx.conditions as {
        wide: boolean;
        motion: boolean;
      };
      deck = wide ? DECK : DECK_TIGHT;
      animate = motion;
      layout();
      start();
      return () => stop();
    });

    return () => {
      apiRef.current = null;
      stop();
      io.disconnect();
      mm.revert();
      scope.removeEventListener("pointerenter", enter);
      scope.removeEventListener("pointerleave", leave);
      scope.removeEventListener("focusin", focusIn);
      scope.removeEventListener("focusout", focusOut);
      scope.removeEventListener("keydown", keys);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  const current = TESTIMONIALS[active];

  return (
    <section
      ref={rootRef}
      // `overflow-hidden` no es higiene: es parte de la composición. El fondo
      // del mazo se sale por la derecha a propósito —la última card entra
      // cortada por el borde— y eso es lo que dice que la fila sigue más allá
      // del cuadro en vez de terminar en cuatro.
      className="overflow-hidden bg-ink-soft py-28 text-cream lg:py-40"
      aria-labelledby="testimonial-deck-title"
    >
      <h2 id="testimonial-deck-title" className="sr-only">
        What people say about NEAR
      </h2>

      <Container>
        {/* El contenedor de consulta: la cita (`text-quote`) y el ancho de las
            cards se miden contra ESTE bloque. Sin él resuelven contra el
            viewport y la sección deja de encajar en su propia caja. */}
        <div className="@container [--tcard-w:min(25.6cqw,400px)] [--tcard-h:calc(var(--tcard-w)*0.755)] [--tdeck-h:calc(var(--tcard-h)*2.35)] max-lg:[--tcard-w:min(74vw,340px)] max-lg:[--tdeck-h:calc(var(--tcard-h)*1.5)]">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,38%)_minmax(0,1fr)] lg:gap-x-[2%]">
            {/* ── La cita, que es la card de adelante leída en voz alta ──────
                `aria-hidden` porque eso es exactamente lo que es: la misma
                cita, el mismo nombre y el mismo cargo que ya están en la card.
                El contenido de verdad son las cards —las cuatro, no solo la de
                adelante— así que un lector de pantalla las recorre completas y
                no escucha ninguna dos veces. */}
            <div ref={quoteRef} aria-hidden="true" className="flex flex-col">
              <p className="text-quote text-balance">
                &ldquo;{current.quote}&rdquo;
              </p>
              <p className="mt-[8%] text-h2-serif italic">{current.name}</p>
              <p className="mt-auto pt-16">
                <span className="inline-flex rounded-full border border-cream/35 px-5 py-2.5 text-label text-cream/85">
                  {current.role}
                </span>
              </p>
            </div>

            {/* ── El mazo ──────────────────────────────────────────────────── */}
            <ol
              // `relative` para las cards, que son absolutas. El alto lo declara
              // el mazo y no las cards: son cuatro elementos fuera de flujo, así
              // que sin esta altura la sección colapsaría a la nada.
              className="relative h-[var(--tdeck-h)]"
              aria-label="What people say about NEAR"
            >
              {TESTIMONIALS.map((t, i) => {
                // El slot VIVO, solo para lo que React manda: el `aria-current`
                // y la etiqueta del botón.
                const slot = (i - active + N) % N;
                // El slot INICIAL, para el `style` de abajo. Tiene que salir de
                // `i` y no de `slot`, o sea ser constante entre renders: React
                // solo reescribe las propiedades de `style` que cambiaron, y un
                // `transform` que cambia con `active` se lo pisa a GSAP en el
                // medio del tween — la card salta al slot nuevo de golpe y
                // después el tween sigue desde ahí.
                const seed = slotAt(DECK, i);
                return (
                  <li
                    key={t.id}
                    data-card
                    // El transform inicial va inline y no lo pone GSAP: el
                    // motor corre en un layout effect, o sea antes del primer
                    // paint, pero sin JS —o mientras el bundle carga en una
                    // conexión mala— las cuatro cards quedarían apiladas en el
                    // mismo lugar. Con esto el abanico existe desde el HTML.
                    style={{
                      transform: `translate(${seed.x * 100}%, ${seed.y * 100}%) scale(${seed.scale})`,
                      zIndex: Z_TOP - i,
                    }}
                    className="absolute bottom-0 left-0 h-[var(--tcard-h)] w-[var(--tcard-w)] origin-top-left will-change-transform"
                  >
                    <figure className="relative flex h-full flex-col overflow-hidden rounded-[clamp(16px,2.1cqw,34px)] bg-cream p-[8.5%] text-ink shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
                      <figcaption>
                        <span className="block text-body-sm">{t.name}</span>
                        <span className="block text-label">{t.role}</span>
                      </figcaption>
                      {/* `line-clamp` y no un corte a mano: el artboard ya
                          muestra una card cortando su cita a mitad de frase, y
                          eso pasa en cuanto alguien escribe una más larga. El
                          clamp corta por RENGLÓN y con puntos suspensivos, y no
                          saca el texto del DOM — la cita completa sigue estando
                          para quien la lea con un lector de pantalla. */}
                      <blockquote className="mt-[16%] text-body-sm line-clamp-5">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      {/* El velo. En degradé porque una card entera más oscura
                          se lee como otro color; oscurecida en diagonal se lee
                          como la misma card con menos luz encima. */}
                      <span
                        data-veil
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(16,16,16,0.5),rgba(16,16,16,0.92))] opacity-0"
                      />
                    </figure>

                    {/* El botón va ENCIMA y no envolviendo a la card: un
                        `<button>` solo admite contenido de frase, y adentro hay
                        un `<figure>` con su `<blockquote>`. Envolverlo es HTML
                        inválido y los lectores de pantalla lo resuelven cada uno
                        a su manera. */}
                    <button
                      type="button"
                      onClick={() => apiRef.current?.goTo(i, true)}
                      aria-current={slot === 0 ? "true" : undefined}
                      className="absolute inset-0 cursor-pointer rounded-[clamp(16px,2.1cqw,34px)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                    >
                      <span className="sr-only">
                        {slot === 0
                          ? `Now showing: ${t.name}, ${t.role}`
                          : `Bring ${t.name}, ${t.role}, to the front`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
