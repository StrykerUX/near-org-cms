"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT, REVEAL, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// ── "Own Your Own": el título se congela y las cards lo atraviesan ───────────
//
// El original hace esto con `pin: true` de ScrollTrigger, que este repo no usa
// (ver el comentario largo de components/sections/ProofStats.tsx). La conversión
// a sticky no es mecánica, porque cambia el signo de la velocidad:
//
//   · PINNEADO — el documento no se mueve, así que `y = −SPEED·s` ES el
//     recorrido que se ve en pantalla.
//   · STICKY   — el documento SÍ se mueve y ya aporta −1·s. Para que la
//     velocidad en pantalla siga siendo SPEED hace falta
//
//         y_i(s) = (1 − SPEED_i) · s
//
//     que con [0.9, 1.5, 1.56] da [+0.10s, −0.50s, −0.56s]: la primera card se
//     queda atrás de la página y las otras dos la adelantan.
//
// El beneficio no es solo evitar el pin. El original tiene que MEDIR la
// geometría para deducir cuánto dura el bloqueo, y para eso escribe
// `grid.style.marginTop` y `marginBottom` en vivo, con un MutationObserver que
// los repara cuando algo los pisa. Acá el cálculo va al revés: el recorrido se
// DECLARA en CSS (`--own-lock`) y las posiciones de las cards se derivan de él.
// Eso elimina measureRaw(), el MutationObserver, el handler de resize y el
// anti-duplicado de pin-spacers — cuatro mecanismos que existían solo para
// sostener una medición.
const SPEEDS = [0.9, 1.5, 1.56, 1.6] as const;

// La card que acopla bajo el título; es la que marca el final del bloqueo. Va
// como índice y no como literal para que añadir cards después no lo desplace.
const DOCK_INDEX = 2;

// svh de scroll con el título congelado. Es el `travel` que el original medía.
const LOCK_VH = 100;
// Tramo posterior al bloqueo: al soltarse, la velocidad relativa de las cards
// salta de (1+speed) a 1 de golpe, y este tramo disipa la diferencia con una
// ease en vez de cortarla.
//
// Es también lo que fija el FONDO del track, y de ahí que no pueda ser
// cualquier número. La última card acaba en `3059 − 812 − 0.42·tail` y el track
// mide `1804 + tail`, así que para que quepa hace falta `tail ≥ 34.6svh`. Por
// debajo se desborda sobre la sección siguiente (que es negra); muy por encima
// —estaba en 80— la card sale del viewport a mitad del tramo y el resto del
// track queda vacío: eran ~1200px de nada antes de "The NEAR Stack".
// 40 cumple la condición con ~70px de margen.
const TAIL_VH = 40;

// ── Tramo de salida ──────────────────────────────────────────────────────────
// El track mide `lock + 100svh + tail`, pero el bloqueo y el tail solo cubren
// `lock + tail` de scroll. Los 100svh restantes son los que tarda el track en
// salir por arriba, y ANTES NO LOS ANIMABA NADIE: las cards quedaban congeladas
// y subían a velocidad de página, o sea sin parallax, justo en el tramo en que
// la última es lo único que se ve.
//
// Este tramo los cubre. `EXIT_DRIFT` es positivo a propósito: las cards se
// RETRASAN respecto a la página en vez de seguir adelantándola. Eso da el
// parallax que faltaba y, de paso, las acerca al fondo del track — que es el
// hueco contra "The NEAR Stack".
//
// El techo de 0.15 no es estético: con la última card acabando a ~143px del
// fondo del track, un drift mayor la haría desbordar sobre la sección negra.
const EXIT_VH = 100;
const EXIT_DRIFT = 0.15;

// Aire entre el título y la card que acopla debajo.
const LOCK_GAP = 12;

// Desplazamiento de aproximación, antes de que empiece el bloqueo (el `preTl`
// del original), en fracciones de viewport.
const PRE = [-0.2, -0.2, -0.3, -0.3] as const;

// Dónde queda cada card, medido desde el borde superior del viewport, en el
// instante en que el título se congela. Se declara el destino y se deriva el
// origen: T_i = LAND_i + SPEED_i · LOCK.
//
// Alpha es la única cuyo destino no es un número suelto: acopla justo debajo del
// título, así que sale de la altura del token tipográfico. `--text-statement`
// tiene line-height 1, de ahí que el alto de la línea SEA el tamaño de fuente.
// La cuarta card cuelga de ese mismo ancla, para mantener su separación con
// Alpha aunque el título cambie de tamaño.
const DOCK = `calc(50svh + var(--text-statement) / 2 + ${LOCK_GAP}px)`;

// svh entre el ancla de Alpha y la cuarta card. Alpha arranca en DOCK+156 y mide
// ~55svh, así que el hueco entre ambas es `(AFTER_DOCK − 156)svh − altura`.
// A 228 daban 155px; 220 los deja en ~80px.
const AFTER_DOCK_VH = 220;

// Medido: con LAND[1] = 20 el hueco entre Assets e Intelligence era de 587px al
// empezar el bloqueo — el original las separa 140px. −30 lo deja en ~175px, que
// es la misma lectura sin que las cards lleguen a tocarse.
const LAND_VH = [-40, -30] as const;

const CARDS = [
  {
    src: "/prototype/feature-assets.png",
    title: "Assets",
    body: "You Can Now Pay for AI Usage by Staking NEAR",
    // Clases literales y no template strings: Tailwind v4 no detecta clases
    // construidas dinámicamente. Mismo criterio que el mapa WIDTH de Container.
    place: "group-data-[lock=on]/own:col-start-3 group-data-[lock=on]/own:-ml-[100px] group-data-[lock=on]/own:mr-[100px]",
    tint: "bg-white/50",
    top: `calc(${LAND_VH[0] + SPEEDS[0] * LOCK_VH}svh)`,
  },
  {
    src: "/prototype/feature-intelligence.png",
    title: "Intelligence",
    body: "Who Owns the Rails AI Runs On",
    place: "group-data-[lock=on]/own:col-start-9",
    tint: "bg-card-tint/50",
    top: `calc(${LAND_VH[1] + SPEEDS[1] * LOCK_VH}svh)`,
  },
  {
    src: "/prototype/feature-alpha.png",
    title: "Alpha",
    body: "Adding a New Execution Model to its Engine",
    place: "group-data-[lock=on]/own:col-start-3",
    tint: "bg-white/50",
    top: `calc(${DOCK} + ${SPEEDS[DOCK_INDEX] * LOCK_VH}svh)`,
  },
  {
    // Reusa el arte de Intelligence: el mismo glifo de IA, otro titular.
    src: "/prototype/feature-intelligence.png",
    title: "Agents",
    body: "Always-On Agents Running Inside Encrypted Enclaves",
    place: "group-data-[lock=on]/own:col-start-9",
    tint: "bg-card-tint/50",
    top: `calc(${DOCK} + ${AFTER_DOCK_VH}svh)`,
  },
] as const;

export default function OwnYourOwn() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();
    const host = scope as HTMLElement;

    mm.add({ motionOk: MQ.motion, isDesktop: MQ.desktop }, (mctx) => {
      const { motionOk, isDesktop } = mctx.conditions as {
        motionOk: boolean;
        isDesktop: boolean;
      };

      const cards = q("[data-own-card]");
      const wrap = q("[data-own-wrap]")[0];
      if (cards.length !== SPEEDS.length || !wrap) return;

      // Con reduced-motion no se enciende nada: el JSX ya renderiza el estado
      // legible (título arriba, tres cards apiladas en flujo normal).
      if (!motionOk) return;

      // En mobile el bloqueo no tiene sentido —no hay ancho para que las cards
      // crucen el título— así que cae al reveal genérico, igual que la rama
      // !isDesktop del original.
      if (!isDesktop) {
        gsap.from(cards, {
          autoAlpha: 0,
          y: REVEAL.y,
          stagger: REVEAL.stagger,
          duration: REVEAL.duration,
          ease: EASE_OUT,
          scrollTrigger: { trigger: wrap, start: REVEAL.start, once: true, markers: DEBUG_MARKERS },
        });
        return;
      }

      // Enciende el layout superpuesto. Va por atributo y no por breakpoint a
      // secas: con reduced-motion en desktop las cards quedarían encimadas e
      // ilegibles si el CSS decidiera solo.
      host.dataset.lock = "on";

      // Ninguna lectura de layout y ninguna escritura: los tres salen de las
      // mismas constantes que alimentan el CSS del track, así que no hay forma de
      // que JS y hoja de estilos se desincronicen.
      //
      // `lockPx` se calcula desde LOCK_VH y NO restando partes al alto del track
      // (que era lo de antes): el track lleva ahora un tramo extra de holgura
      // para la última card, y esa holgura no forma parte del recorrido.
      const tailPx = () => window.innerHeight * (TAIL_VH / 100);
      const lockPx = () => window.innerHeight * (LOCK_VH / 100);
      const exitPx = () => window.innerHeight * (EXIT_VH / 100);
      const preOff = (i: number) => PRE[i] * window.innerHeight;

      // Aproximación: de "el track asoma por abajo" a "el track toca el techo".
      gsap.fromTo(cards, { y: 0 }, {
        y: (i: number) => preOff(i),
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      // Bloqueo + tail + salida, en un solo timeline. Las duraciones van en las
      // MISMAS unidades que el CSS (svh), así el tiempo del timeline es
      // directamente la fracción de scroll, sin factor de conversión.
      //
      // `bottom top` y no `bottom bottom`: el rango tiene que ser el track
      // ENTERO (lock + 100svh + tail = 240svh), porque las tres duraciones de
      // abajo suman eso mismo. Con `bottom bottom` el rango era 140svh y los
      // últimos 100 quedaban sin animar.
      //
      // La sincronía con el sticky se mantiene: el título se despega a los
      // `lock` svh de scroll, que es exactamente la unidad `LOCK_VH` del
      // timeline — o sea, el final del primer tramo.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      tl.fromTo(cards,
        { y: (i: number) => preOff(i) },
        {
          y: (i: number) => preOff(i) + (1 - SPEEDS[i]) * lockPx(),
          ease: "none",
          duration: LOCK_VH,
          immediateRender: false,
        },
        0
      );

      // Desplazamiento acumulado al terminar el tail. Se nombra para que el
      // tramo de salida pueda partir de ahí sin repetir la expresión.
      const afterTail = (i: number) =>
        preOff(i) +
        (1 - SPEEDS[i]) * lockPx() +
        (i === DOCK_INDEX ? -0.2 * tailPx() : (1 - SPEEDS[i]) * tailPx() * 0.7);

      tl.to(cards, {
        y: afterTail,
        ease: "power1.out",
        duration: TAIL_VH,
      }, LOCK_VH);

      // Salida: las cards derivan hacia abajo mientras el track termina de
      // pasar. Cada una a su ritmo —el drift escala con su velocidad, así que la
      // que más adelantó es la que más se retrasa ahora— y el conjunto queda
      // pegado al fondo del track en vez de dejar un hueco muerto.
      tl.to(cards, {
        y: (i: number) => afterTail(i) + EXIT_DRIFT * SPEEDS[i] * exitPx(),
        ease: "none",
        duration: EXIT_VH,
      }, LOCK_VH + TAIL_VH);

      return () => {
        delete host.dataset.lock;
        gsap.killTweensOf(cards);
        gsap.set(cards, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // z-[1]: esta sección pasa POR ENCIMA de las barras de QuantumBars, que
    // vienen antes en el documento y montan sobre el hero.
    //
    // Nada de overflow-hidden en ningún ancestro del sticky de más abajo: lo
    // convertiría en el contenedor de scroll y el sticky dejaría de pegarse, en
    // silencio.
    <section
      ref={rootRef}
      data-lock="off"
      style={
        { "--own-lock": `${LOCK_VH}svh`, "--own-tail": `${TAIL_VH}svh` } as React.CSSProperties
      }
      className="group/own relative z-[1] bg-cream text-foreground"
    >
      {/* `pb-8` y no `pb-20`: el track ya termina justo debajo de la última
          card, así que el padding de cierre se suma directo al hueco contra la
          sección siguiente. */}
      <Container className="flex flex-col gap-24 pb-8 pt-32">
        {/* El encabezado va en flujo normal. Con sticky sale de cuadro solo
            cuando el track toca el techo, así que no necesita ni un tween de `y`
            ni el marginTop calculado que tenía el original. */}
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Eyebrow>The future of finance is yours</Eyebrow>
            <h2 className="text-h2 text-pretty">
              Next gen
              <br />
              <Accent>self custody</Accent>
            </h2>
          </div>
          <p className="text-body-lg text-muted-foreground text-pretty lg:pt-12">
            Your keys, your assets, no compromises. NEAR accounts pair
            programmable access keys with quantum-safe signing, so you get the
            ease of a web login with the guarantees of true self custody. Trade,
            stake, and move value across 30+ chains without ever handing your
            assets to an exchange.
          </p>
        </div>

        {/* El track: única fuente de la altura del recorrido.
            lock + 100svh (el tramo pegado) + tail (la salida).

            Nada de holgura extra al final. Hubo un `--own-overhang` aquí,
            dimensionado para que la última card cupiera en su posición ESTÁTICA
            — pero en esa posición la card nunca se ve: cuando el track entra en
            pantalla, el tramo de aproximación ya la ha desplazado. El resultado
            era ~1200px de track vacío entre la última card y la sección
            siguiente. Quien vaya a añadir holgura aquí: mide la posición FINAL
            de la card (la de después del tail), no la de reposo. */}
        {/* ── El margen negativo: por qué el track sube sobre el header ──────
            El título va dentro de un sticky de 100svh que lo CENTRA, así que
            desde el primer frame está a 50svh (~450px) del inicio del track. Con
            el header justo encima, ese medio viewport de aire queda a la vista
            como un hueco entre el párrafo y la primera card.

            El original no lo tiene porque su título vive en flujo, pegado al
            header, y solo se centra cuando el pin lo congela. Subir el track
            recupera parte de ese aire sin rehacer la mecánica del sticky.

            Solo con `lock=on`: en mobile y con reduced-motion el contenido está
            en flujo normal y un margen negativo lo encimaría con el header. */}
        <div
          data-own-wrap
          className="relative group-data-[lock=on]/own:-mt-[25svh] group-data-[lock=on]/own:h-[calc(var(--own-lock)+100svh+var(--own-tail))]"
        >
          {/* La pista del sticky mide lock + 100svh, así que el hijo queda
              pegado exactamente `lock`. El centro vertical exacto sale gratis:
              la caja sticky ES el viewport y el título va centrado dentro. */}
          <div className="group-data-[lock=on]/own:h-[calc(var(--own-lock)+100svh)]">
            <div className="z-[1] flex justify-center group-data-[lock=on]/own:sticky group-data-[lock=on]/own:top-0 group-data-[lock=on]/own:h-svh group-data-[lock=on]/own:items-center">
              <h3 className="whitespace-nowrap text-center text-statement">Own Your Own</h3>
            </div>
          </div>

          {/* Capa de cards: absoluta, así no aporta altura (la altura la manda
              el CSS de arriba, no el contenido). z por encima del título, como
              en la referencia: las cards lo cruzan por delante.

              Las TRES en `grid-row: 1`. Ese es el detalle que hace innecesario
              medir: con filas automáticas el top de cada card dependería de la
              altura de las anteriores, y habría que leerlo del DOM. En la misma
              fila, el top de cada una ES su `margin-top`, y punto.

              `items-start` es OBLIGATORIO por lo mismo: en grid los items se
              estiran a la altura de la FILA, y la fila la define la card que
              arranca más abajo (Alpha, con ~1900px de margen). Sin esto, las
              otras dos se estiran hasta ese fondo y quedan con cientos de
              píxeles de tinte vacío colgando — medido: Assets pasaba de 495px
              de contenido a 1957px de caja. El original lo trae como
              `align-items:start` y es la clase que faltaba al portarlo. */}
          <div className="z-[2] grid grid-cols-1 items-start gap-14 group-data-[lock=on]/own:absolute group-data-[lock=on]/own:inset-x-0 group-data-[lock=on]/own:top-0 group-data-[lock=on]/own:grid-cols-12 group-data-[lock=on]/own:gap-x-6 group-data-[lock=on]/own:gap-y-0">
            {CARDS.map((card) => (
              <article
                key={card.title}
                data-own-card
                style={{ "--own-top": card.top } as React.CSSProperties}
                className={`rounded-3xl p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-[3px] will-change-transform ${card.tint} ${card.place} group-data-[lock=on]/own:col-span-3 group-data-[lock=on]/own:mt-[var(--own-top)] group-data-[lock=on]/own:[grid-row:1]`}
              >
                <Image
                  src={card.src}
                  alt=""
                  width={290}
                  height={267}
                  className="block h-auto w-full rounded-[1.15rem]"
                />
                <div className="flex flex-col gap-3 px-3 py-7">
                  <h4 className="text-h4">{card.title}</h4>
                  <p className="text-body text-foreground/75 text-pretty">{card.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
