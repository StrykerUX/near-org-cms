"use client";

import { useRef, useState } from "react";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";

// Lo que otros dicen de NEAR, sobre carbón y en una cinta que baja.
//
// Va después del newsletter y es el único tramo oscuro del final de la página:
// hasta acá NEAR viene hablando de sí misma, y esto es lo que dijeron otros. El
// cambio de fondo no es ritmo visual, es el cambio de voz.
//
// ── La idea: la cinta ES el índice ──────────────────────────────────────────
//
// La card de adelante y la cita gigante de la izquierda son LA MISMA persona.
// La columna izquierda es la card de adelante leída en voz alta: avanza la
// cinta, cambia la cita, el nombre y la píldora del cargo.
//
// De ahí sale que la profundidad signifique algo. Cuatro cards en diagonal al
// lado de una cita fija son decoración; una fila donde lo que está adelante es
// lo que se está leyendo convierte a las de atrás en testimonios esperando
// turno. Es la misma jugada que el eje de `ProofLedger` unas secciones más
// arriba: la estructura dice algo o no está.
//
// ── Es una CINTA, no un mazo que se baraja ──────────────────────────────────
//
// Las cards entran por arriba a la derecha, bajan la diagonal de slot en slot
// hasta el frente, y salen por abajo creciendo, hacia el lector. Nada se
// teletransporta a la vista.
//
// La primera versión no hacía esto y por eso se veía a saltos: tenía cuatro
// slots y cuatro cards, así que la que dejaba el frente TENÍA que reaparecer al
// fondo — no había de dónde sacar otra. Apagarla antes disimulaba el salto,
// pero el gesto seguía siendo el de un mazo que se recicla.
//
// Lo que lo arregla es una ESCALERA más larga que la parte visible:
//
//   peldaño 0            la salida — abajo, grande, apagada
//   peldaños 1 … 4       los cuatro slots que se ven (1 es el frente)
//   peldaños 5 … 7       la entrada — arriba a la derecha, chica, apagada
//
// Cada paso baja a todas las cards un peldaño. La que estaba en el 1 se va al 0
// y sale del cuadro; la que estaba en el 5 baja al 4 y aparece por la derecha.
// El único salto que queda es del peldaño 0 al 7, entre dos posiciones
// invisibles.
//
// Para que los ocho peldaños tengan ocupante hacen falta más cards que
// testimonios, así que la lista se renderiza DOS VECES. Es el mismo recurso que
// `homepage-shared/useLoopCarousel` con sus tres copias, y la aritmética lo
// sostiene: las copias quedan a N peldaños de distancia y la ventana visible
// mide N, así que nunca hay dos copias de la misma persona a la vista.
//
// El `aria-hidden` y el `tabIndex` salen del peldaño VIVO y no del número de
// copia: cuál de las dos está adelante va rotando, así que marcar "la copia 2"
// como decorativa dejaría fuera del tab a la card que el lector tiene enfrente.
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
//     cuatro cards y no como una fila, por más escala que tengan.
//
// El velo va en DEGRADÉ y no plano porque una card entera un 40% más oscura se
// lee como otro color; oscurecida en diagonal se lee como la misma card con
// menos luz encima, que es lo que tiene que parecer.
//
// ── La cinta mide en `xPercent`, no en píxeles ──────────────────────────────
//
// Las posiciones están en ANCHOS Y ALTOS DE CARD (0.66 = dos tercios de card a
// la derecha), y GSAP las aplica con `xPercent`/`yPercent`, que resuelven contra
// el tamaño del propio elemento. O sea que la cinta no necesita medir nada:
// cambia el ancho de la card —el breakpoint, el zoom, un `clamp` distinto— y la
// diagonal entera se reacomoda sola, sin un `resize` que escuchar. Posicionada
// en píxeles necesita eso y se descalibra en silencio cuando falla.
//
// `transform-origin: top left` es lo que hace que esos números sean legibles:
// con el origen en la esquina, el `scale` no mueve el punto que la posición
// declara, así que cada par (x, y) ES la esquina superior izquierda de la card
// en el artboard. Con el origen al centro habría que compensar cada escala.
//
// ⚠️ NADA puede escribir un `transform` sobre estas cards fuera de GSAP, y esa
// es una regla con historia. Hubo un `style={{transform}}` en el JSX —el
// abanico para cuando no hay JS— y el resultado fue que TODO viajaba el doble:
// GSAP lee el transform que encuentra, lo guarda como `x`/`y` en PÍXELES, y
// después le suma su `xPercent`. En el DOM quedaba
// `translate(66%,-80%) translate(235px,-215px)`. Por eso `place()` fija
// `x: 0, y: 0` explícitos: si algo vuelve a inyectar un transform, el
// desplazamiento en píxeles se cancela en vez de acumularse.

/**
 * El abanico visible, slot por slot, más los dos peldaños de fuera de cuadro.
 *
 * `x` e `y` van en anchos y altos de card; `veil`, en opacidad del velo.
 *
 * Los cuatro slots son una TABLA y no una fórmula a propósito. Salen medidos
 * del artboard, y una progresión geométrica que los aproxime esconde justo lo
 * que hay que poder tocar: el paso horizontal se abre más que el vertical, y la
 * escala cae más lento que los dos. Escrito como tabla, mover una card es mover
 * una fila.
 *
 * `entry` y `exit` NO están medidos: son la misma curva un peldaño más allá en
 * cada punta. La entrada continúa la diagonal (un paso más de x, casi nada de
 * y, un escalón menos de escala); la salida la continúa al revés, y por eso
 * crece por encima de 1 — es la card viniendo hacia el lector.
 *
 * La salida cae A PLOMO (x casi cero) y no siguiendo la diagonal, que pediría
 * irse un ancho entero hacia la izquierda. Ahí al lado está la columna de la
 * cita, y una card cruzándola la tapa justo cuando el lector la está leyendo.
 * La card igual se abre hacia afuera: crece por encima de 1 y el origen está en
 * su esquina, así que se despliega hacia abajo y a la derecha.
 *
 * El salto de velo entre el primer slot y el segundo es chico (0 → 0.1) y
 * después se abre. Es lo que está medido en el artboard, y tiene sentido: la
 * segunda card es la que va a pasar al frente, y ensombrecerla la saca de la
 * conversación un paso antes de tiempo.
 */
const WIDE = {
  slots: [
    { x: 0, y: 0, scale: 1, veil: 0 },
    { x: 0.66, y: -0.8, scale: 0.93, veil: 0.1 },
    { x: 1.41, y: -1.11, scale: 0.85, veil: 0.34 },
    { x: 2.1, y: -1.28, scale: 0.77, veil: 0.5 },
  ],
  entry: { x: 2.78, y: -1.37, scale: 0.7, veil: 0.64 },
  exit: { x: -0.06, y: 1.3, scale: 1.12, veil: 0 },
} as const;

/**
 * La misma cinta, recogida, para cuando no hay ancho.
 *
 * A 375px el abanico de arriba manda la tercera card a dos anchos de distancia,
 * o sea fuera de la pantalla, y la fila se queda en una card con un borde
 * asomando. Recogida conserva lo que importa —que hay más, y que están detrás—
 * con el único gesto que cabe: un canto de card por lado.
 *
 * El velo sube en vez de bajar. Con este solape las cards de atrás se ven casi
 * enteras, así que lo que las separa de la de adelante ya no es la posición
 * sino la luz, y tiene que trabajar más.
 */
const TIGHT = {
  slots: [
    { x: 0, y: 0, scale: 1, veil: 0 },
    { x: 0.11, y: -0.1, scale: 0.94, veil: 0.3 },
    { x: 0.22, y: -0.2, scale: 0.88, veil: 0.5 },
    { x: 0.33, y: -0.3, scale: 0.82, veil: 0.66 },
  ],
  entry: { x: 0.46, y: -0.4, scale: 0.76, veil: 0.78 },
  exit: { x: -0.06, y: 1.15, scale: 1.08, veil: 0 },
} as const;

/* ── Tiempos ──────────────────────────────────────────────────────────────── */

/** El viaje de una card al peldaño siguiente. */
const STEP = 1;

/**
 * La curva de las cards que están de paso.
 *
 * `inOut` y no `out`: se mueven todas a la vez y el ojo las lee como una FILA
 * que se corre. Un `out` arranca de golpe y la fila se desarma en cuatro cosas
 * que viajan juntas por casualidad.
 */
const STEP_EASE = "power3.inOut";

/**
 * La curva de la que LLEGA AL FRENTE, que es la única con curva propia.
 *
 * Se pasa de largo y vuelve. Es la card que el lector va a leer, y frenar en
 * seco justo ahí la deja quieta un cuarto de segundo antes de que la cita de la
 * izquierda termine de cambiar; el rebote llena ese hueco y, sobre todo,
 * distingue la que llegó de las tres que siguen de paso.
 */
const FRONT_EASE = "back.out(1.15)";

/**
 * El retardo que cada peldaño le lleva al anterior.
 *
 * La fila no arranca entera: primero se va la de adelante y las de atrás la
 * siguen, como una cadena que se tensa. Sin esto son cuatro rectángulos
 * trasladándose en bloque, que es lo que hace que una diagonal animada se vea
 * como un `transform` y no como profundidad.
 */
const LAG = 0.055;
const LAG_MAX = 0.22;

/** El relevo de la cita grande: se va, cambia el texto, vuelve. */
const QUOTE_OUT = 0.26;
const QUOTE_IN = 0.5;

/**
 * El paso solo, y el paso una vez que el lector tocó la cinta.
 *
 * Los mismos números y la misma política que `homepage-shared/useLoopCarousel`,
 * donde está el razonamiento largo: 5s es lo que se tarda en leer una card, y
 * en cuanto alguien elige una el autoplay deja de ser una sugerencia y pasa a
 * ser una interrupción, así que la espera se triplica y se queda triplicada.
 *
 * No se importan de ahí porque ese hook es un carrusel de riel —tres copias,
 * drag, snap por redondeo— y esto es una cinta en diagonal; compartir la
 * constante ataría dos mecanismos que no tienen nada más en común que el número.
 *
 * WCAG 2.2.2 pide poder detener el movimiento: acá lo detienen el hover y el
 * foco de teclado, además de la pestaña oculta y salirse de cuadro.
 */
const AUTOPLAY_MS = 5000;
const AUTOPLAY_ENGAGED_MS = 15000;

type Slot = { x: number; y: number; scale: number; veil: number };
type Fan = { slots: readonly Slot[]; entry: Slot; exit: Slot };

/** Llevar un testimonio al frente. `user` distingue el click del autoplay. */
type GoTo = (to: number, user: boolean) => void;

const N = TESTIMONIALS.length;
/**
 * Cuántas veces se repite la lista.
 *
 * La escalera necesita un ocupante por peldaño: los slots visibles más la
 * entrada y la salida. Con cuatro testimonios y cuatro slots eso son seis
 * peldaños y dos copias; el `max(2, …)` es lo que mantiene la cuenta si mañana
 * la lista crece o se acorta, en vez de dejar un `2` clavado que se rompe en
 * silencio el día que queden tres testimonios.
 */
const COPIES = Math.max(2, Math.ceil((WIDE.slots.length + 2) / N));
const TOTAL = N * COPIES;

/** Las cards del DOM: la lista repetida, en orden. */
const CARDS = Array.from({ length: TOTAL }, (_, j) => ({
  item: TESTIMONIALS[j % N],
  key: `${TESTIMONIALS[j % N].id}-${Math.floor(j / N)}`,
}));

/**
 * El z-index de un peldaño. El 0 —la salida— queda ARRIBA de todo, y es
 * correcto: la card que se va es la que el lector tiene más cerca hasta que
 * desaparece.
 */
const Z_BASE = 20;

/** En qué peldaño está la card `j` con el cursor en `cursor`. */
function rungOf(j: number, cursor: number) {
  return (((j - cursor + 1) % TOTAL) + TOTAL) % TOTAL;
}

/** Dónde cae un peldaño. Fuera del tramo visible, la entrada o la salida. */
function poseOf(fan: Fan, rung: number): Slot {
  if (rung === 0) return fan.exit;
  if (rung <= fan.slots.length) return fan.slots[rung - 1];
  return fan.entry;
}

/** Si el peldaño está dentro del abanico que se ve. */
function isVisible(fan: Fan, rung: number) {
  return rung >= 1 && rung <= fan.slots.length;
}

export default function TestimonialDeck() {
  // Dónde está la cinta, para lo que RENDERIZA React: el texto de la columna y
  // los atributos de accesibilidad de cada card. El motor lleva su propio
  // cursor en una variable local y no depende de esto — si dependiera, cada
  // paso tendría que esperar a un re-render para empezar a animar.
  const [cursor, setCursor] = useState(0);
  const active = cursor % N;

  const apiRef = useRef<{ goTo: GoTo } | null>(null);

  // La columna izquierda entra sola cada vez que cambia el testimonio. El
  // `deps` es lo que la vuelve a correr; la salida la dispara la cinta, desde
  // `goTo`.
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

    let fan: Fan = WIDE;
    let animate = true;
    let at = 0;

    const veilOf = (el: HTMLElement) =>
      el.querySelector<HTMLElement>("[data-veil]");

    /**
     * Planta una card en un peldaño, sin animar.
     *
     * Los `x: 0, y: 0` son la vacuna contra el bug del transform doble: GSAP
     * guarda el desplazamiento en píxeles y el porcentual por separado y los
     * SUMA, así que cualquier `translate` en píxeles que llegue de afuera se
     * acumularía sobre el nuestro en vez de reemplazarlo.
     */
    const place = (el: HTMLElement, p: Slot, rung: number) => {
      gsap.set(el, {
        x: 0,
        y: 0,
        xPercent: p.x * 100,
        yPercent: p.y * 100,
        scale: p.scale,
        zIndex: Z_BASE - rung,
      });
      gsap.set(veilOf(el), { opacity: p.veil });
    };

    /** Deja la cinta como corresponde al cursor actual, sin animar. */
    const layout = () => {
      cards.forEach((el, j) => {
        const rung = rungOf(j, at);
        place(el, poseOf(fan, rung), rung);
        gsap.set(el, { autoAlpha: isVisible(fan, rung) ? 1 : 0 });
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
    // (`: Function`) y hace lo mismo, así que se usa esa.
    const goTo = self.add("goTo", (to: number, user: boolean) => {
      const next = ((to % TOTAL) + TOTAL) % TOTAL;
      if (next === at) return;
      const from = at;
      at = next;

      if (user) engaged = true;

      cards.forEach((el) => {
        const j = cards.indexOf(el);
        const before = rungOf(j, from);
        const after = rungOf(j, next);
        const pose = poseOf(fan, after);
        const veil = veilOf(el);
        const wasSeen = isVisible(fan, before);
        const nowSeen = isVisible(fan, after);

        // Un paso puede llegar con el anterior todavía en vuelo —dos clicks
        // seguidos— y ahí conviven dos tweens sobre la misma card. Matando lo
        // que haya, el destino que manda es siempre el último.
        gsap.killTweensOf([el, veil]);

        // Fuera de cuadro en las dos puntas: el salto del peldaño 0 al último,
        // que es el que hace que la cinta no tenga fin. No hay nada que animar
        // porque no hay nada que se vea.
        if (!animate || (!wasSeen && !nowSeen)) {
          place(el, pose, after);
          gsap.set(el, { autoAlpha: nowSeen ? 1 : 0 });
          return;
        }

        // Retroceder en la escalera (`after > before`) es dar la vuelta con la
        // card A LA VISTA, y solo pasa cuando alguien elige una card de atrás y
        // la cinta salta varios peldaños de una. Interpolar esa distancia la
        // hace cruzar el abanico entero en diagonal; en dos tramos sale por
        // abajo como todas, se apaga y reaparece donde le toque.
        if (after > before) {
          gsap
            .timeline()
            .set(el, { zIndex: Z_BASE })
            .to(el, {
              x: 0,
              y: 0,
              xPercent: fan.exit.x * 100,
              yPercent: fan.exit.y * 100,
              scale: fan.exit.scale,
              autoAlpha: 0,
              duration: STEP * 0.55,
              ease: "power2.in",
            })
            .add(() => place(el, pose, after))
            .to(el, {
              autoAlpha: nowSeen ? 1 : 0,
              duration: STEP * 0.5,
              ease: "power2.out",
            });
          return;
        }

        // El retardo se mide desde el FRENTE: la card que se va arranca
        // primero y las de atrás la siguen.
        const lag = Math.min(Math.max(before - 1, 0) * LAG, LAG_MAX);
        const arriving = after === 1;

        // El z-index no se interpola: se pone ya, para que la card que avanza
        // pase por delante de la que deja atrás durante todo el viaje.
        gsap.set(el, { zIndex: Z_BASE - after });
        gsap.to(el, {
          x: 0,
          y: 0,
          xPercent: pose.x * 100,
          yPercent: pose.y * 100,
          scale: pose.scale,
          duration: arriving ? STEP * 1.05 : STEP,
          ease: arriving ? FRONT_EASE : STEP_EASE,
          delay: lag,
        });
        gsap.to(veil, {
          opacity: pose.veil,
          duration: STEP,
          ease: STEP_EASE,
          delay: lag,
        });

        // La opacidad va en su propio tween para poder tener otra curva: la que
        // entra se enciende TEMPRANO —si no, aparece de la nada a mitad de
        // camino— y la que sale se apaga TARDE, ya lejos, para que se vea
        // irse en vez de evaporarse en el sitio.
        if (!wasSeen && nowSeen) {
          gsap.to(el, {
            autoAlpha: 1,
            duration: STEP * 0.55,
            ease: "power2.out",
            delay: lag,
          });
        } else if (wasSeen && !nowSeen) {
          gsap.to(el, {
            autoAlpha: 0,
            duration: STEP * 0.6,
            ease: "power2.in",
            delay: lag + STEP * 0.25,
          });
        }
      });

      // La cita se va, y el texto cambia recién cuando terminó de irse. Sin ese
      // `onComplete` el relevo sería un corte seco a media opacidad.
      const quote = quoteRef.current;
      if (!animate || !quote) {
        setCursor(next);
        return;
      }
      gsap.to(quote, {
        autoAlpha: 0,
        y: -14,
        duration: QUOTE_OUT,
        ease: "power2.in",
        onComplete: () => setCursor(next),
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
          goTo(at + 1, false);
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
    // seguiría corriendo igual: el lector vuelve a una sección que avanzó sola
    // tres veces mientras no la miraba.
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0.25 },
    );
    io.observe(scope);

    // Las flechas mueven la cinta. Las cards ya son botones, así que el Tab
    // recorre los testimonios; esto es el atajo para quien ya está adentro.
    const keys = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(at + 1, true);
      else if (e.key === "ArrowLeft") goTo(at - 1, true);
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
      fan = wide ? WIDE : TIGHT;
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
      // `overflow-hidden` no es higiene: es parte de la composición. La entrada
      // y la salida de la cinta viven fuera del cuadro, y el fondo del abanico
      // se sale por la derecha a propósito —la última card entra cortada por el
      // borde—, que es lo que dice que la fila sigue más allá del encuadre.
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
                El contenido de verdad son las cards, así que un lector de
                pantalla las recorre y no escucha ninguna dos veces. */}
            <div ref={quoteRef} aria-hidden="true" className="flex flex-col">
              {/* `text-balance` y no `text-pretty`. Probado contra el artboard:
                  `pretty` llena la medida y deja "…the only AI / x Crypto thing
                  I'm looking / forward to.", que parte la frase por donde no va.
                  Balanceada cae en tres renglones parejos con el corte del
                  diseño. Es una cita de una o dos frases —el rango donde
                  `balance` está pensado para funcionar—, no un párrafo. */}
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

            {/* ── La cinta ─────────────────────────────────────────────────── */}
            <ol
              // `relative` para las cards, que son absolutas. El alto lo declara
              // la cinta y no las cards: son elementos fuera de flujo, así que
              // sin esta altura la sección colapsaría a la nada.
              className="relative h-[var(--tdeck-h)]"
              aria-label="What people say about NEAR"
            >
              {CARDS.map(({ item, key }, j) => {
                // El peldaño vivo, para lo único que React manda acá: qué card
                // está en el tab y cuál es decorativa. La POSICIÓN no sale de
                // acá —la escribe GSAP— y no puede salir de acá: un `transform`
                // en el JSX se le suma al suyo y todo viaja el doble. Está
                // contado largo en la cabecera.
                const rung = rungOf(j, cursor);
                const seen = isVisible(WIDE, rung);
                return (
                  <li
                    key={key}
                    data-card
                    aria-hidden={seen ? undefined : "true"}
                    className="absolute bottom-0 left-0 h-[var(--tcard-h)] w-[var(--tcard-w)] origin-top-left will-change-transform"
                  >
                    <figure className="relative flex h-full flex-col overflow-hidden rounded-[clamp(16px,2.1cqw,34px)] bg-cream p-[8.5%] text-ink shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
                      <figcaption>
                        <span className="block text-body-sm">{item.name}</span>
                        <span className="block text-label">{item.role}</span>
                      </figcaption>
                      {/* `line-clamp` y no un corte a mano: el artboard ya
                          muestra una card cortando su cita a mitad de frase, y
                          eso pasa en cuanto alguien escribe una más larga. El
                          clamp corta por RENGLÓN y con puntos suspensivos, y no
                          saca el texto del DOM — la cita completa sigue estando
                          para quien la lea con un lector de pantalla. */}
                      <blockquote className="mt-[16%] text-body-sm line-clamp-5">
                        &ldquo;{item.quote}&rdquo;
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
                      tabIndex={seen ? 0 : -1}
                      onClick={() =>
                        apiRef.current?.goTo(cursor + (rung - 1), true)
                      }
                      aria-current={rung === 1 ? "true" : undefined}
                      className="absolute inset-0 cursor-pointer rounded-[clamp(16px,2.1cqw,34px)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                    >
                      <span className="sr-only">
                        {rung === 1
                          ? `Now showing: ${item.name}, ${item.role}`
                          : `Bring ${item.name}, ${item.role}, to the front`}
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
