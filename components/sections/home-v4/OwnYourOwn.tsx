"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, REVEAL, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { driftOffsets } from "@/components/primitives/motion/staggerDrift";
import { OWN_YOUR_OWN_CARDS as CARDS } from "@/components/sections/home-v4/homeV4Content";

// ── "Own Your Own": el título se queda quieto y las cards lo atraviesan ──────
//
// ── Quién decide las posiciones: el LAYOUT, no este archivo ─────────────────
//
// Cada card ocupa su propia fila del grid y se separa de la anterior con un
// `margin-top` en píxeles. El navegador resuelve dónde cae cada una; acá no se
// calcula ninguna posición, no se mide nada y no se escribe ningún estilo de
// layout.
//
// Esto es una vuelta al modelo del HTML original, y es deliberado. La versión
// anterior declaraba la posición de cada card como una constante en `svh`
// (LAND_VH, AFTER_DOCK_VH, DOCK…), y eso era irreparable: la altura de una card
// se mide en píxeles y escala con el ANCHO de la ventana, mientras que `svh`
// escala con el ALTO. No existe un juego de constantes que funcione en todas las
// proporciones de ventana — cada ajuste de espaciado arreglaba un tamaño de
// pantalla y rompía otro, y en ventanas de menos de ~1044px de alto la última
// card terminaba desbordando sobre la sección siguiente.
//
// Con las cards en flujo eso no puede pasar: el contenedor mide lo que ellas
// ocupan, sea cual sea el tamaño de la ventana, y un resize lo recalcula el
// navegador solo. Mover una card es cambiar su `margin-top` acá abajo.
//
// ── Por qué sticky y no `pin: true` ────────────────────────────────────────
// Regla del repo; el razonamiento largo está en components/sections/README.md.
// El título es un item del grid que abarca TODAS las filas (`grid-row: 1/-1`) y
// se pega dentro de esa celda, así que se queda centrado durante todo el
// recorrido de las cards sin necesitar una pista de altura declarada.

// Velocidad de cada card RELATIVA a la página. Solo importan las DIFERENCIAS
// entre ellas: `driftOffsets` las centra en su media, así que sumarles una
// constante a todas no cambia nada.
//
// Esa convención —pedir la velocidad en múltiplos de la del scroll y no en px— es la
// que después se formalizó en `primitives/motion/velocityRamp.ts`, y esta sección es
// el precedente que cita.
//
// Alternan con las columnas: las de la izquierda (0 y 2) van lentas y bajan, las
// de la derecha (1 y 3) van rápidas y suben. Eso hace que el desfase se lea como
// un cizallamiento del grid y no como cuatro movimientos sueltos.
//
// Antes eran [0.33, 1.4, 1, 1.5]. El 1 exacto daba desvío CERO —esa card no
// participaba del efecto— porque el desvío se calculaba contra un 1 fijo. Ahora
// se calcula contra la media, así que ese caso no puede repetirse por accidente,
// pero igual conviene que estén repartidas.
const SPEEDS = [0.5, 1.2, 0.8, 1.5] as const;

// Qué fracción de la amplitud máxima SEGURA se usa. `driftAmplitude` calcula, a
// partir de los huecos reales del layout, la amplitud más grande con la que
// ningún par de cards se acerca a menos de `MIN_GAP`; esto es cuánto de eso se
// aprovecha.
//
// Con `k ≤ 1` el choque es imposible por construcción. Subirlo por encima de 1
// no está prohibido por el helper —hay layouts donde superponerse es el efecto—
// pero acá sería volver al bug.
const DRIFT_K = 0.85;

// Aire mínimo entre dos cards que puedan alcanzarse, en px. Es lo que separa
// "se acercan mucho" de "se tocan": con `k = 0.85` la distancia final del par
// más apretado es este valor más el 15% del hueco que le sobraba.
const MIN_GAP = 24;

// Posición de cada card en el grid y su tinte, en el MISMO orden que
// `OWN_YOUR_OWN_CARDS`. Se queda acá y no en el módulo de contenido porque es
// composición: en qué celda cae cada card y cuánto se separa de la anterior.
//
// Clases literales y no template strings: Tailwind v4 no detecta clases
// construidas dinámicamente. Mismo criterio que el mapa WIDTH de Container.
//
// El margen superior es la separación con la card anterior, y es lo único que hay
// que tocar para reespaciarlas. Los valores salen del original.
const CARD_LAYOUT = [
  {
    place: "lg:col-start-3 lg:col-span-3 lg:row-start-1 lg:mt-[150px] lg:-ml-[100px] lg:mr-[100px]",
    tint: "bg-white/50",
  },
  {
    place: "lg:col-start-9 lg:col-span-3 lg:row-start-2 lg:mt-[140px]",
    tint: "bg-card-tint/50",
  },
  {
    place: "lg:col-start-3 lg:col-span-3 lg:row-start-3 lg:mt-[152px] lg:ml-[150px] lg:-mr-[150px]",
    tint: "bg-white/50",
  },
  {
    place: "lg:col-start-9 lg:col-span-3 lg:row-start-4 lg:mt-[230px] lg:-ml-[30px] lg:mr-[30px]",
    tint: "bg-card-tint/50",
  },
] as const;

export default function OwnYourOwn() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
    const cards = q("[data-own-card]");
    const stage = q("[data-own-stage]")[0];
    const title = q("[data-own-title]")[0];
    if (cards.length !== SPEEDS.length || !stage || !title) return;

    // Con reduced-motion no se anima nada: el JSX ya renderiza el estado
    // legible, y sin transforms las cards quedan exactamente donde el layout
    // las puso.
    if (!motionOk) return;

    // En mobile las cards se apilan en una columna y no hay ancho para que
    // crucen el título, así que el desvío no comunica nada. Reveal genérico.
    if (!isDesktop) {
      gsap.from(cards, {
        autoAlpha: 0,
        y: REVEAL.y,
        stagger: REVEAL.stagger,
        duration: REVEAL.duration,
        ease: EASE_OUT,
        scrollTrigger: { trigger: stage, start: REVEAL.start, once: true, markers: DEBUG_MARKERS },
      });
      return;
    }

    // ── El desvío lo decide el LAYOUT ──────────────────────────────────────
    //
    // Se miden las cajas de las cards sin transform y `driftOffsets` devuelve
    // cuánto puede desviarse cada una sin que ningún par se acerque a menos de
    // `MIN_GAP`. Los pares que no se cruzan en horizontal —las cards viven en
    // dos columnas— no se restringen entre sí: no pueden chocar aunque quieran,
    // y acotarlas sería desperdiciar recorrido.
    //
    // Se remide en cada refresh, así que un resize o un cambio de `mt` en
    // CARD_LAYOUT reajustan la amplitud solos. Ese es el punto: la constante en
    // `vh` que había antes no podía hacerlo, porque el hueco entre cards escala
    // con el ANCHO de la ventana y `vh` con el ALTO.
    let offsets: number[] = cards.map(() => 0);

    const measure = () => {
      // A cero antes de medir: `getBoundingClientRect` devuelve la caja YA
      // transformada, y medir sobre el desvío vigente lo realimentaría.
      gsap.set(cards, { y: 0 });
      const boxes = cards.map((card) => {
        const r = card.getBoundingClientRect();
        return {
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY,
          left: r.left,
          right: r.right,
        };
      });
      offsets = driftOffsets(boxes, SPEEDS, { k: DRIFT_K, minGap: MIN_GAP });
    };

    measure();

    // ── El start ────────────────────────────────────────────────────────
    // `top bottom` = en cuanto el grid asoma por abajo. Con `top top`, que es
    // lo que había, la coreografía no empezaba hasta que el grid tocaba el
    // techo de la ventana: quedaban ~850px de scroll con las cards ya en
    // pantalla y completamente quietas, y al cruzar ese umbral el desvío
    // pasaba de 0 a su velocidad máxima de un frame al otro. Ese era el tirón.
    //
    // ── El end ──────────────────────────────────────────────────────────
    // La regla: el scrub termina exactamente cuando el borde VISUAL superior
    // de la última card (Agents) — layout + transform — alcanza el borde
    // inferior del título pegado. Ahí las cards se congelan en su desvío
    // final y el scroll normal se lleva todo; el `sine.inOut` ya pone la
    // velocidad del desvío en cero en ese borde, así que la salida del
    // scroll lock es una rampa, no un corte.
    //
    // La cuenta cierra sola sea cual sea la velocidad o la posición de
    // partida, y no es iterativa: en el frame final la curva vale 1 por
    // definición, o sea que el desvío es exactamente el de `offsets` completo.
    // Basta con resolver
    //     layoutTop(Agents) − scroll + drift = titleBottom
    // para el scroll del end. Que el cruce cae justo ahí (y no antes) está
    // garantizado porque el top visual de la card baja monótonamente en
    // viewport mientras el scrub avanza.
    //
    // ── La curva ────────────────────────────────────────────────────────
    // Un solo tramo, sin vuelta: las rápidas se mantienen rápidas y la lenta
    // lenta durante todo el recorrido. `sine.inOut` pone la velocidad del
    // desvío en cero en los dos bordes — la entrada suave es el "asentarse"
    // del título en su sticky, y la salida suave evita el corte en seco al
    // terminar la sección aunque las cards queden desplazadas.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: "top bottom",
        end: () => {
          const agents = cards[cards.length - 1];
          // Top de layout en coordenadas de documento. Se resta el transform
          // vigente por si el refresh corre con el tween a medio aplicar.
          const layoutTop =
            agents.getBoundingClientRect().top +
            window.scrollY -
            Number(gsap.getProperty(agents, "y"));
          const titleBottom =
            parseFloat(getComputedStyle(title).top) + title.offsetHeight;
          return layoutTop + offsets[cards.length - 1] - titleBottom;
        },
        scrub: true,
        invalidateOnRefresh: true,
        markers: DEBUG_MARKERS,
        // Remedir ANTES del refresh, no después: el `end` de acá arriba y el `y`
        // del tween son funciones que GSAP re-evalúa durante el refresh, y las
        // dos leen `offsets`. `refreshInit` es el único hook que corre antes de
        // esa re-evaluación.
        onRefreshInit: measure,
        // `will-change` solo durante el recorrido. Estas cards llevan además
        // `backdrop-blur`, que ya fuerza su propia capa: fijo en el className,
        // eran cuatro capas con filtro vivas durante toda la sesión para una
        // animación que ocupa dos pantallas de scroll.
        onToggle: (st) => {
          const value = st.isActive ? "transform" : "auto";
          for (const card of cards) card.style.willChange = value;
        },
      },
    });

    // `y` como función y no como array: GSAP la re-evalúa en cada
    // `invalidateOnRefresh`, así que lee el `offsets` recién medido.
    tl.fromTo(
      cards,
      { y: 0 },
      { y: (i: number) => offsets[i], ease: "sine.inOut", duration: 1 }
    );

    return () => {
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: "transform" });
      for (const card of cards) card.style.willChange = "auto";
    };
  });

  return (
    // z-[1]: por DEBAJO de las barras de QuantumBars, que son `z-[2]` y vienen antes en
    // el documento. Acá decía lo contrario —"pasa POR ENCIMA"— y es al revés: si algo de
    // las barras invade este territorio, las barras ganan.
    //
    // Hoy no se nota porque el `overflow-hidden` de QuantumBars las acota a su propia
    // caja y las dos secciones no se solapan (son hermanas en flujo normal, sin margen
    // negativo entre ellas). Pero el borde inferior del gris ahora se anima, así que
    // cualquiera que toque esa zona necesita el orden correcto para razonar.
    //
    // Nada de overflow-hidden en ningún ancestro: convertiría a este elemento en
    // el contenedor de scroll del título sticky y dejaría de pegarse, en
    // silencio.
    <section ref={rootRef} className="relative z-[1] bg-cream text-foreground">
      {/* El `pb` es aire real, no compensación: ahora que el grid termina justo
          debajo de la última card, es lo único que separa la sección del corte
          con la siguiente (que es negra y entra a sangre).

          El gap separa tres hijos: encabezado → grid de cards → título de
          mobile. El escalón de desktop solo actúa en el primer hueco: el tercer
          hijo es `lg:hidden`, y un elemento oculto no genera caja ni gap. */}
      <Container className="flex flex-col gap-24 pb-32 pt-32 lg:gap-36">
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

        {/* El grid manda: su altura es la de las cards y sus márgenes, así que
            no hay ninguna altura declarada que pueda quedarse corta o larga. */}
        <div
          data-own-stage
          className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0"
        >
          {/* El título ocupa las cuatro filas y se pega DENTRO de esa celda: por
              eso se queda centrado mientras las cards pasan, sin necesitar un
              track aparte.

              `self-start` es imprescindible: por defecto un grid item se estira
              a la altura de su celda —aquí, el grid entero— y un elemento tan
              alto como su contenedor no tiene recorrido para pegarse. Con
              `start` mide su contenido y el sticky funciona.

              El `top` va inline porque `calc()` con var y espacios es ilegible
              como clase arbitraria. En mobile el elemento es estático y `top` no
              tiene efecto, así que no hace falta condicionarlo.

              Los márgenes recortan el tramo pegado por sus dos puntas. Van como
              margen y no como padding a propósito: el padding agranda el
              elemento pegado y se llevaría al `h3` con él, moviendo también la
              posición congelada. El margen mueve el rectángulo en el que el
              sticky puede vivir —el área de grid del item, encogida por sus
              propios márgenes— y deja el anclaje intacto.

              `mt` es la entrada: sin él el título nace exactamente a la altura
              de la card Assets, la única sin `mt` y por lo tanto también pegada
              al techo del grid, y las dos entran juntas.

              `mb` es la salida: el título se despega cuando su borde inferior
              alcanza el fondo del grid menos este margen, así que estos 200px
              son —literalmente— cuánta card queda por debajo cuando el título
              empieza a subir. Sin él quedaría clavado hasta el último píxel de
              la última card.

              Ambos en px, como los `mt` de las cards y por lo mismo: `svh`
              escala con el alto de la ventana y las cards con el ancho. */}
          <div
            data-own-title
            className="z-[1] hidden lg:mt-[150px] lg:mb-[200px] lg:block lg:sticky lg:col-start-4 lg:col-span-6 lg:self-start lg:[grid-row:1/-1]"
            style={{ top: "calc(50svh - var(--text-display) / 2)" }}
          >
            <h3 className="whitespace-nowrap text-center text-display">
              Own Your <Accent display>Own</Accent>
            </h3>
          </div>

          {CARDS.map((card, i) => (
            <article
              key={card.title}
              data-own-card
              // z-[2]: las cards cruzan el título por delante, como en la
              // referencia. El resto sale de CARD_LAYOUT, emparejado por índice
              // con el contenido — el `cards.length !== SPEEDS.length` del efecto
              // ya falla si los tres arrays se desincronizan.
              className={`z-[2] rounded-3xl p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-[3px] ${CARD_LAYOUT[i].tint} ${CARD_LAYOUT[i].place}`}
            >
              {/* `sizes` es obligatorio en cuanto la imagen es fluida: con solo
                  `width`, Next genera el srcset pero el navegador asume que ocupa
                  el 100% del viewport y baja la variante más grande. La card vive
                  en `lg:col-span-3` de un grid de 12, o sea ~24vw en desktop y
                  ancho completo apilada en móvil. */}
              <Image
                src={card.src}
                alt=""
                width={290}
                height={267}
                sizes="(min-width: 1024px) 24vw, 100vw"
                className="block h-auto w-full rounded-[1.15rem]"
              />
              <div className="flex flex-col gap-3 px-3 py-7">
                <h4 className="text-h4">{card.title}</h4>
                <p className="text-body text-foreground/75 text-pretty">{card.body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* En mobile el título va después de las cards: sin el cruce no es un
            elemento de fondo, es el cierre de la sección. */}
        <h3 className="whitespace-nowrap text-center text-display lg:hidden">
          Own Your <Accent display>Own</Accent>
        </h3>
      </Container>
    </section>
  );
}
