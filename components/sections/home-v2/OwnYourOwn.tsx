"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, REVEAL, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

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
// Regla del repo; el razonamiento largo está en components/sections/ProofStats.tsx.
// El título es un item del grid que abarca TODAS las filas (`grid-row: 1/-1`) y
// se pega dentro de esa celda, así que se queda centrado durante todo el
// recorrido de las cards sin necesitar una pista de altura declarada.

// Velocidad de cada card RELATIVA a la página. >1 se adelanta, <1 se retrasa.
// Lo que importa es la distancia a 1, no el valor: una card en 1 iría clavada
// al scroll y no se desviaría nada.
//
// Estas están acercadas respecto a las del original ([0.9, 1.5, 1.56, 1.6]).
// Ahí la primera se separaba 54px de su sitio y la última 324 — seis veces más,
// y la primera se leía como si no participara. Ahora el rango va de 119 a 270px
// (a 900px de alto de ventana): la relación baja a 2,3× y ninguna queda ni
// estática ni disparada.
const SPEEDS = [0.78, 1.38, 1.44, 1.5] as const;

// Amplitud del desvío, en svh. Es cuánto se separa de su posición de layout la
// card más rápida en el punto medio del recorrido.
//
// El desvío SALE DE CERO Y VUELVE A CERO. No es un capricho: los transforms no
// afectan al layout, así que el grid reserva sitio para las posiciones sin
// desplazar. Si la coreografía terminara con las cards desplazadas hacia arriba,
// ese hueco reaparecería al final de la sección — que es exactamente el vacío
// que había antes contra "The NEAR Stack".
const DRIFT_VH = 60;

const CARDS = [
  {
    src: "/prototype/feature-assets.png",
    title: "Assets",
    body: "You Can Now Pay for AI Usage by Staking NEAR",
    // Clases literales y no template strings: Tailwind v4 no detecta clases
    // construidas dinámicamente. Mismo criterio que el mapa WIDTH de Container.
    //
    // El margen superior es la separación con la card anterior, y es lo único
    // que hay que tocar para reespaciarlas. Los valores salen del original.
    place:
      "lg:col-start-3 lg:col-span-3 lg:row-start-1 lg:-ml-[100px] lg:mr-[100px]",
    tint: "bg-white/50",
  },
  {
    src: "/prototype/feature-intelligence.png",
    title: "Intelligence",
    body: "Who Owns the Rails AI Runs On",
    place: "lg:col-start-9 lg:col-span-3 lg:row-start-2 lg:mt-[140px]",
    tint: "bg-card-tint/50",
  },
  {
    src: "/prototype/feature-alpha.png",
    title: "Alpha",
    body: "Adding a New Execution Model to its Engine",
    place: "lg:col-start-3 lg:col-span-3 lg:row-start-3 lg:mt-[152px]",
    tint: "bg-white/50",
  },
  {
    // Reusa el arte de Intelligence: el mismo glifo de IA, otro titular.
    src: "/prototype/feature-intelligence.png",
    title: "Agents",
    body: "Always-On Agents Running Inside Encrypted Enclaves",
    place: "lg:col-start-9 lg:col-span-3 lg:row-start-4 lg:mt-[150px]",
    tint: "bg-card-tint/50",
  },
] as const;

export default function OwnYourOwn() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
    const cards = q("[data-own-card]");
    const stage = q("[data-own-stage]")[0];
    if (cards.length !== SPEEDS.length || !stage) return;

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

    // Desvío máximo de cada card. El signo sale de su velocidad: las que van
    // por encima de 1 se adelantan (y negativo) y la que va por debajo se
    // queda atrás. Es la única lectura del entorno, y no toca el DOM.
    const drift = (i: number) => (1 - SPEEDS[i]) * window.innerHeight * (DRIFT_VH / 100);

    // Ida y vuelta sobre el recorrido del grid.
    //
    // ── El start ────────────────────────────────────────────────────────
    // `top bottom` = en cuanto el grid asoma por abajo. Con `top top`, que es
    // lo que había, la coreografía no empezaba hasta que el grid tocaba el
    // techo de la ventana: quedaban ~850px de scroll con las cards ya en
    // pantalla y completamente quietas, y al cruzar ese umbral el desvío
    // pasaba de 0 a su velocidad máxima de un frame al otro. Ese era el tirón.
    //
    // El end, en cambio, NO puede ser `bottom top`, que sería el simétrico
    // natural: el desvío tiene que valer cero cuando se ve el fondo del grid,
    // y con `bottom top` la última card seguiría ~105px por encima de su sitio
    // en ese momento. Como los transforms no afectan al layout, ahí reaparece
    // el hueco contra "The NEAR Stack" — el mismo que ya se arregló una vez.
    // `bottom bottom` hace que el retorno a cero caiga exactamente ahí.
    //
    // De paso el recorrido pasa de ~1300px de scroll a ~2200px, y como el
    // desvío es el mismo repartido en más distancia, la velocidad máxima cae
    // a la mitad. Buena parte de la fluidez sale de eso.
    //
    // ── Las curvas ──────────────────────────────────────────────────────
    // `sine.in` en la ida y `sine.out` en la vuelta, en ese orden. Es lo que
    // pone la velocidad en cero en los dos bordes y el máximo en el medio del
    // recorrido, donde las cards cruzan el título. Al revés —que era lo que
    // había— el perfil es 0 → MAX → 0 → MAX → 0: arranca y corta en seco, y
    // encima se frena justo en el cruce, que es lo que hay que mirar.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        markers: DEBUG_MARKERS,
      },
    });

    tl.fromTo(cards, { y: 0 }, { y: drift, ease: "sine.in", duration: 1 })
      .to(cards, { y: 0, ease: "sine.out", duration: 1 });

    return () => {
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: "transform" });
    };
  });

  return (
    // z-[1]: esta sección pasa POR ENCIMA de las barras de QuantumBars, que
    // vienen antes en el documento y montan sobre el hero.
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
            className="z-[1] hidden lg:mt-[150px] lg:mb-[200px] lg:block lg:sticky lg:col-start-4 lg:col-span-6 lg:self-start lg:[grid-row:1/-1]"
            style={{ top: "calc(50svh - var(--text-statement) / 2)" }}
          >
            <h3 className="whitespace-nowrap text-center text-statement">Own Your Own</h3>
          </div>

          {CARDS.map((card) => (
            <article
              key={card.title}
              data-own-card
              // z-[2]: las cards cruzan el título por delante, como en la
              // referencia.
              className={`z-[2] rounded-3xl p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-[3px] will-change-transform ${card.tint} ${card.place}`}
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

        {/* En mobile el título va después de las cards: sin el cruce no es un
            elemento de fondo, es el cierre de la sección. */}
        <h3 className="whitespace-nowrap text-center text-statement lg:hidden">
          Own Your Own
        </h3>
      </Container>
    </section>
  );
}
