"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import {
  EASE_OUT,
  REVEAL,
  DEBUG_MARKERS,
} from "@/components/primitives/motion/motionTokens";
import { driftOffsets } from "@/components/primitives/motion/staggerDrift";
import { OWN_YOUR_OWN_CARDS as CARDS } from "@/components/sections/homepage-update/homepageUpdateContent";

// ── "Own Your Own": el título se queda quieto y las cards lo atraviesan ──────
//
// ── Quién decide las posiciones: el LAYOUT, no este archivo ─────────────────
//
// Cada card ocupa su propia fila del grid y se separa de la anterior con un
// `margin-top` (porcentual, ver CARD_LAYOUT). El navegador resuelve dónde cae
// cada una; acá no se calcula ninguna posición, no se mide nada y no se escribe
// ningún estilo de layout.
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
// Cuatro velocidades DISTINTAS, ninguna pareja: es lo que hace que el
// destiempo se lea entre todas las cards y no solo en un hueco.
//
// El reparto anterior era por GRUPO —dos rápidas casi idénticas arriba, dos
// lentas casi idénticas abajo—, y eso tenía una consecuencia concreta: los
// pares no se deformaban y lo único que se movía era el hueco DEL MEDIO. Un
// gesto limpio, pero con tres de los cuatro saltos congelados.
//
// Ahora los desvíos normalizados son +0.92, −0.20, +0.28 y −1.0: Data se va
// arriba, Intelligence se queda muy atrás, y las dos del medio se mueven poco
// pero en sentidos opuestos. Los cuatro saltos cambian de largo durante el
// scroll, cada uno a su ritmo.
//
// Lo que NO se toca es el signo por mitades: las dos de arriba (Data, Assets)
// con desvío positivo y las dos de abajo (Traces, Intelligence) negativo. Eso
// es lo que hace que el reparto EXPANDA el recorrido en vez de comprimirlo. Un
// reparto monótono con la fila comprime, y ahí sí hay un punto de colapso donde
// el escalonado del layout se come a sí mismo (es el techo de ~0.6 que menciona
// DRIFT_K).
//
// Ampliar el rango NO agranda el movimiento: `driftOffsets` normaliza por el
// swing (`max|media − speed|`), así que [0.3…1.7] da exactamente el mismo
// desvío que [0.8…1.2]. Acá solo se decide QUIÉN sube y quién baja, y en qué
// proporción entre ellos. La magnitud es `DRIFT_K`.
//
// Antes eran [0.33, 1.4, 1, 1.5]. El 1 exacto daba desvío CERO —esa card no
// participaba del efecto— porque el desvío se calculaba contra un 1 fijo. Ahora
// se calcula contra la media, así que ese caso no puede repetirse por accidente,
// pero igual conviene que estén repartidas.
const SPEEDS = [1.5, 0.8, 1.1, 0.3] as const;

// Qué fracción de la amplitud máxima SEGURA se usa. `driftAmplitude` calcula, a
// partir de los huecos reales del layout, la amplitud más grande con la que
// ningún par de cards se acerca a menos de `MIN_GAP`; esto es cuánto de eso se
// aprovecha.
//
// Con `k ≤ 1` el choque es imposible por construcción. Subirlo por encima de 1
// no está prohibido por el helper —hay layouts donde superponerse es el efecto—
// pero acá sería volver al bug.
//
// ── Por qué 0.5 y no 0.85 ───────────────────────────────────────────────────
//
// Las cuatro cards viven en bandas de X disjuntas, así que ningún par puede
// chocar y `driftAmplitude` devuelve `Infinity`: el único límite que queda es
// `spacingAmplitude`, o sea el paso más corto del layout dividido por el
// desvío relativo más grande. Con `k = 0.85` eso daba desvíos de casi un paso
// entero y el escalonado vertical del layout desaparecía — las cuatro
// terminaban alineadas en una franja horizontal contra el título.
//
// ── Por qué acá se pasa de 1 a propósito ────────────────────────────────────
//
// Las dos advertencias de arriba —que `k ≤ 1` evita el choque, y el techo de
// ~0.6 que valía en una versión anterior— asumen cosas que este layout no
// cumple:
//
//   · El choque es imposible por otra razón: las cuatro bandas de X son
//     disjuntas, así que `driftAmplitude` ni siquiera acota. `k` solo escala
//     `spacingAmplitude`, que no es un límite de seguridad sino la escala del
//     layout — el paso MÁS CORTO (Data→Intelligence, 0.65 celdas). Pasarse de
//     1 significa "desviarse más que el hueco más chico", que acá es
//     exactamente lo que se busca.
//   · El techo de 0.6 era de un reparto de velocidades MONÓTONO con la fila,
//     donde el desvío comprime el recorrido y llega a comerse el layout. El
//     reparto por grupos (ver SPEEDS) hace lo contrario: EXPANDE. No hay punto
//     de colapso, solo se estira.
//
// ── Qué se siente a 1.55 ────────────────────────────────────────────────────
//
// Subido de 1.2 a 1.55 para que el destiempo se note más, junto con el reparto
// de velocidades menos agrupado de SPEEDS. Las dos palancas hacen cosas
// distintas y hay que no confundirlas: SPEEDS decide QUIÉN se mueve y cuánto
// respecto de los demás —cambiar sus números NO agranda el movimiento, porque
// `driftOffsets` normaliza por el swing—, y DRIFT_K es la magnitud.
//
// El costo sigue siendo scroll, y sube con él: a 1.55 la sección pide bastante
// más recorrido del que ocupa. Si empieza a sentirse larga, esta constante es
// lo primero que hay que bajar.
//
// ── Qué se sentía a 1.2 ─────────────────────────────────────────────────────
//
// Lo que se percibe no es el desvío sino su DERIVADA respecto del scroll: qué
// tan distinta es la velocidad de una card de la de la página. A 1.2 los
// desvíos son ±160 y ±200px sobre un scrub de ~1.300px, y como `sine.inOut`
// concentra el movimiento en el medio (pico ≈ pi/2 × la media), en el tramo
// central las cards van entre ~76% y ~124% de la velocidad del scroll. Ahí es
// donde se lee el destiempo, y es justo cuando están centradas en pantalla.
//
// El costo es scroll: el recorrido pasa de 647 a ~1.007px. La sección pide
// ~55% más de scroll que su altura de layout.
const DRIFT_K = 1.55;

// Aire mínimo entre dos cards que puedan alcanzarse, en px.
//
// Hoy no está haciendo nada: con las cuatro bandas disjuntas no hay ningún par
// que se cruce en horizontal, y `driftAmplitude` —que es donde se usa— ni
// siquiera llega a mirarlos. Se queda porque el reparto de bandas es una
// decisión de diseño que puede cambiar, y en cuanto dos cards vuelvan a
// compartir columna esto es lo que evita que se toquen.
const MIN_GAP = 24;

// Posición de cada card en el grid, en el MISMO orden que
// `OWN_YOUR_OWN_CARDS`. Se queda acá y no en el módulo de contenido porque es
// composición: en qué celda cae cada card y cuánto se separa de la anterior.
//
// Llevó también un `tint` por card mientras dos de las cuatro eran blancas y
// dos crema. Ahora las cuatro comparten fondo y la clase vive en el `<article>`.
//
// Clases literales y no template strings: Tailwind v4 no detecta clases
// construidas dinámicamente. Mismo criterio que el mapa WIDTH de Container.
//
// ── Por qué el margen superior es NEGATIVO ─────────────────────────────────
//
// Cada card sigue ocupando su propia fila, así que el paso vertical entre dos
// cards consecutivas es `alto de card + mt`. Con `mt` positivo el paso nunca
// puede ser menor que el alto de una card: por construcción solo cabe UNA card
// y pico en pantalla, y las cuatro pedían ~2.400px de scroll.
//
// Con `mt` negativo las filas se pisan y el paso baja a ~0.65–1.12 anchos de
// celda (la card mide ~1.65), o sea tres visibles a la vez.
//
// El techo es que el paso deje la tercera card dentro del viewport:
// `paso₁ + paso₂ + alto ≲ 100svh`. Con los valores de abajo eso da ~878px, o
// sea que por debajo de ~880px de alto de ventana la tercera card empieza a
// quedar cortada por el borde. Es el límite de subirlos más.
//
// Ojo: ese techo depende del ALTO de la card, así que ensancharlas lo empuja
// hacia arriba. Al pasar de 1.17 a 1.30 celdas de ancho el alto subió de ~1.59
// a ~1.65, y el salto largo tuvo que bajar de 1.40 a 1.12 para compensar. Los
// dos números se mueven juntos.
//
// Los tres pasos son DISTINTOS a propósito, y son lo que arma la composición en
// DOS GRUPOS: 0.65 → 1.12 → 0.75. Data e Intelligence quedan casi a la par
// arriba, se abre un salto largo, y Assets y Traces vuelven a juntarse abajo.
// Las velocidades están elegidas para reforzar exactamente ese hueco del medio
// — ver la nota de SPEEDS.
//
// Pasos iguales dan un ritmo de escalera que se lee como una lista diagonal por
// más que las bandas de X estén desordenadas.
//
// ── Por qué los márgenes están en % y no en px ─────────────────────────────
//
// Un margen porcentual —también `margin-top`— se resuelve contra el ANCHO del
// bloque contenedor, que para un grid item es su celda. O sea: escala con lo
// mismo que escala la card. Eso es exactamente lo que la nota de arriba pedía y
// `svh` no podía dar; con los márgenes en px, cada valor solo estaba afinado
// para un ancho de ventana y el paso se descolocaba en el resto.
//
// La unidad de acá abajo es entonces "anchos de celda": el `-mt-[100%]` de la
// fila 2 es el alto de la card (~1.65 celdas) menos el paso deseado (0.65), y
// `ml`/`mr` desplazan y ensanchan en esa misma escala.
//
// ── Los pares ml/mr hacen DOS cosas ────────────────────────────────────────
//
// Ancho de la card = celda × (1 − ml − mr), y su borde izquierdo se corre `ml`.
// En las cuatro `ml + mr = −30%`, o sea todas miden 1.30 celdas (~334px a ancho
// máximo). La SUMA es el tamaño, la diferencia es el desplazamiento: para
// mover una card sin cambiarle el ancho hay que tocar las dos.
//
// ── El reparto: cuatro bandas, en desorden ─────────────────────────────────
//
// Las bandas de X son cuatro y no se pisan: izquierda, centro-izquierda,
// centro-derecha, derecha. La banda de cada card es fija; lo que las desordena
// es a QUÉ FILA va cada una — centro-izquierda, derecha, izquierda,
// centro-derecha, bajando— así que el recorrido sale del medio, se va al borde
// derecho, cruza la pantalla entera hasta el izquierdo y vuelve. Nunca es una
// diagonal.
//
// Las bandas tampoco están equiespaciadas: los huecos entre cards vecinas son
// ~95 / 67 / 77px a ancho máximo. Espaciarlas parejo devuelve la lectura de
// fila, que es justo lo que se quiere evitar; pero apretar UNO de los huecos
// mucho más que los otros —hubo una versión con 60px contra vecinos de 140—
// empareja ese par visualmente y rompe el reparto en cuatro. La variación tiene
// que ser chica.
//
// Los huecos se achicaron al ensanchar las cards: el ancho útil no cambió, así
// que cada punto de ancho sale del aire entre bandas. A 1.30 celdas queda poco
// margen — ensancharlas más pide reacomodar los cuatro `ml` a la vez, o las
// bandas se empiezan a pisar y el destiempo se acota por colisión.
//
// ── Cuidado: el `mt` es de la FILA, no de la card ──────────────────────────
//
// Cada `-mt` es el paso que separa esa fila de la ANTERIOR. Reordenar las cards
// no es solo mover su `row-start`: hay que reasignar también los `-mt` a la
// fila que pasan a ocupar, o el ritmo vertical se desarma sin que nada falle.
//
// Ojo con una consecuencia que no se ve en el layout: con las cuatro bandas
// disjuntas ningún par de cards puede chocar, así que el desvío queda sin
// límite por colisión y solo lo acota `DRIFT_K` — ver la nota de esa constante
// antes de subirla.
const CARD_LAYOUT = [
  {
    // Data — columnas 4-6, fila 1. Arriba del todo, justo debajo del
    // encabezado. Cruza el título por delante.
    place: "lg:col-start-4 lg:col-span-3 lg:row-start-1 lg:mt-[18%]",
  },
  {
    // Traces — columnas 7-9, fila 2.
    //
    // `mt` POSITIVO, el único de los cuatro: en el prototipo esta card arranca
    // por debajo de donde termina Data, no encabalgada sobre ella. Es el paso
    // largo de la composición.
    place: "lg:col-start-7 lg:col-span-3 lg:row-start-2 lg:mt-[12%]",
  },
  {
    // Assets — columnas 1-3, fila 3. Pega al borde izquierdo del Container.
    //
    // El salto más corto de los tres: en el prototipo Assets asoma cuando
    // Traces todavía está entera en pantalla. Se solapan en vertical y no pasa
    // nada — viven en columnas opuestas (1-3 contra 7-9) y `driftOffsets` no
    // acota los pares que no se cruzan en horizontal.
    place: "lg:col-start-1 lg:col-span-3 lg:row-start-3 lg:-mt-[101%]",
  },
  {
    // Intelligence — columnas 10-12, fila 4. Pega al borde derecho.
    //
    // Es la ÚLTIMA fila, y eso no es cosmético: el `end` del ScrollTrigger se
    // calcula con `cards[cards.length - 1]`, o sea con el índice 3 de este
    // array. Si alguna vez la última fila la ocupa otra card, ese cálculo hay
    // que mover con ella.
    place: "lg:col-start-10 lg:col-span-3 lg:row-start-4 lg:-mt-[27%]",
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
        scrollTrigger: {
          trigger: stage,
          start: REVEAL.start,
          once: true,
          markers: DEBUG_MARKERS,
        },
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

      // ── Reservar el sobrante del desvío ────────────────────────────────
      //
      // El desvío es un `transform`, y un transform NO ocupa lugar en el flujo:
      // el grid sigue midiendo lo que las cards ocupan en su posición de
      // layout. Una card con desvío POSITIVO baja fuera de esa caja, se sale de
      // la sección y aterriza encima de la siguiente — que entra a sangre y en
      // negro, así que se ve.
      //
      // Con desvíos chicos el `pb` del Container lo absorbía por casualidad. No
      // es una constante que se pueda elegir: el desvío escala con el paso del
      // layout y con `DRIFT_K`, así que cualquier número fijo se queda corto en
      // cuanto se toca uno de los dos. Acá se calcula de lo ya medido.
      //
      // Va como padding del grid y no como margen de la sección para que no
      // toque el área de filas: el título sticky abarca `grid-row: 1/-1` y su
      // recorrido se mide contra el content box, que el padding no mueve.
      stage.style.paddingBottom = "0px";
      const stageBottom = stage.getBoundingClientRect().bottom + window.scrollY;
      let overflow = 0;
      for (let i = 0; i < boxes.length; i++) {
        overflow = Math.max(
          overflow,
          boxes[i].bottom + offsets[i] - stageBottom,
        );
      }
      stage.style.paddingBottom = `${Math.ceil(overflow)}px`;
      // Cuánto dura pegado el encabezado: hoy es el `mb-[800px]` fijo del
      // propio JSX (ver el comentario ahí), no algo que este efecto mida —
      // el encabezado vive en el mismo grid que el título, con el mismo
      // mecanismo de sticky-por-grid-row, así que no necesita una pista
      // propia cuya altura haya que calcular en JS.
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
    // de la última card (Traces) — layout + transform — alcanza el borde
    // inferior del título pegado. Ahí las cards se congelan en su desvío
    // final y el scroll normal se lleva todo; el `sine.inOut` ya pone la
    // velocidad del desvío en cero en ese borde, así que la salida del
    // scroll lock es una rampa, no un corte.
    //
    // La cuenta cierra sola sea cual sea la velocidad o la posición de
    // partida, y no es iterativa: en el frame final la curva vale 1 por
    // definición, o sea que el desvío es exactamente el de `offsets` completo.
    // Basta con resolver
    //     layoutTop(Traces) − scroll + drift = titleBottom
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
    //
    // Y además concentra: la velocidad pico del desvío es pi/2 veces la media,
    // y cae en el medio del scrub, que es donde las cards están centradas en
    // pantalla. Una curva lineal repartiría el mismo desvío parejo y el
    // destiempo se notaría MENOS justo donde se mira. No cambiarla por `none`
    // buscando "más movimiento": da lo contrario, además del corte en seco.
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
        // Número y no `true`: `scrub: true` ata el desvío al scroll 1:1, o sea
        // que las cards son una función pura de la posición de la página y el
        // efecto se siente rígido — la card no se mueve, la página la arrastra.
        //
        // Con un número, GSAP persigue el progreso del scroll con ese tiempo de
        // catch-up en segundos. La card queda ligeramente atrás al empezar a
        // scrollear y sigue acomodándose ~0.8s después de soltar, que es de
        // donde sale la sensación de peso y de que responde. Es la parte
        // "interactiva" del efecto; la diferencia de velocidades sola no la da.
        //
        // 0.8 y no más: por encima de ~1.5 el retraso deja de leerse como
        // inercia y empieza a leerse como lag. El sitio ya corre Lenis, que
        // suaviza el scroll por su lado, así que los dos se suman.
        scrub: 0.8,
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
      { y: (i: number) => offsets[i], ease: "sine.inOut", duration: 1 },
    );

    return () => {
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: "transform" });
      for (const card of cards) card.style.willChange = "auto";
      // La reserva de `measure` es un estilo inline, así que sobrevive al
      // desmontaje del efecto: sin esto, un cambio de breakpoint a mobile deja
      // el hueco de una animación que ya no corre.
      stage.style.paddingBottom = "";
    };
  });

  return (
    // z-[1]: el stacking context propio de la sección. En ab7 el valor importaba
    // porque arriba venía QuantumBars con `z-[2]`, y si algo de las barras invadía
    // este territorio las barras ganaban. ab10 no monta QuantumBars, así que hoy no
    // compite con nadie — se queda porque el borde inferior del gris se anima y un
    // stacking context explícito es lo que evita que ese borde quede a merced del
    // orden del documento.
    //
    // Nada de overflow-hidden en ningún ancestro: convertiría a este elemento en
    // el contenedor de scroll del título sticky y dejaría de pegarse, en
    // silencio.
    <section
      ref={rootRef}
      // Las medidas de la escena pegada, declaradas una vez acá para que el
      // encabezado y el título no las repitan cada uno por su lado.
      style={
        {
          // Dónde se planta el encabezado. Reserva la banda del header, que es
          // `fixed`: sin ella se pega debajo y queda medio tapado.
          "--own-head-top": "calc(var(--site-header-block) + 2rem)",
          // Dónde cae el título en el viewport, de 0 (borde de arriba) a 1
          // (borde de abajo).
          //
          // 0.5 sería el centro matemático, y no es el que se ve centrado: el
          // line-box de `--text-display` reserva el espacio de las descendentes
          // —que en "Own Your Own" solo usa la "y"— así que la mancha de tinta
          // queda por encima del centro de su propia caja. Corregir ESE sesgo
          // pide bajar del 0.5; este 0.65 va en la otra dirección y es una
          // decisión de composición, no una corrección óptica: planta el titular
          // en el tercio bajo para que las cards lo crucen por arriba.
          "--own-title-anchor": "0.65",
          // Cuánto alto se le reserva al encabezado: su peor caso más aire.
          //
          // Es UNA constante y no dos porque gobierna dos cosas que tienen que
          // coincidir o el encabezado y el título se pisan: el PISO del título
          // pegado (`--own-title-floor`) y dónde NACE el título en el flujo. Ese
          // segundo uso es nuevo — antes el título nacía a 150px del borde del
          // grid, con el encabezado naciendo a 0 y midiendo hasta 21rem, así que
          // se solapaban en el flujo desde el primer frame y el cruce se veía
          // durante toda la entrada de la sección, en cualquier tamaño de
          // ventana. El piso solo cubría el tramo pegado; el tramo de ANTES no
          // lo cubría nadie.
          //
          // 21rem es el alto que puede llegar a tener el encabezado en el peor
          // caso (a 1024px, que es donde el título aparece, su párrafo ocupa más
          // líneas), más aire. No se mide en JS a propósito: esta sección no
          // calcula posiciones — ver la nota de arriba del archivo.
          "--own-head-block": "21rem",
          // Piso del título: por debajo de esto no puede subir, pase lo que
          // pase con el tamaño de la ventana.
          //
          // Hace falta porque el encabezado y el título se anclan con unidades
          // que ESCALAN DISTINTO. El encabezado se pega a una distancia FIJA
          // del top (`--own-head-top`); el título, a una FRACCIÓN del viewport
          // (`100svh * anchor`). Al bajar el alto de ventana el título sube
          // hacia el encabezado, que no se mueve — y al ENSANCHARLA es peor,
          // porque `--text-display` crece con su clamp en `vw` y se le resta la
          // mitad, empujándolo más arriba todavía. Ventana ancha y poco alta es
          // la combinación que los hace chocar, y es de lo más común: un
          // monitor panorámico, o media pantalla.
          //
          "--own-title-floor": "calc(var(--own-head-top) + var(--own-head-block))",
          // Cuánto arrancan las cards POR DEBAJO del título. Sin esto, la
          // primera card (Data) nace a la misma altura que el título y lo tapa
          // desde el primer frame: la escena empieza con el cruce ya ocurrido,
          // y no se llega a leer qué es lo que las cards cruzan.
          //
          // Va en `svh` a pesar de que el resto de las distancias de esta
          // sección van en px o en % del layout —ver la nota de los márgenes de
          // las cards—, y es por lo que mide: no es un hueco entre dos cajas,
          // es cuánto scroll pasa entre que el título se planta y llega la
          // primera card. Eso es distancia de VIEWPORT, y `svh` es su unidad.
          //
          // Lleva `--own-head-block` sumado desde que el título nace por debajo
          // del encabezado en vez de a 150px del borde del grid: el lead es
          // padding del grid y las cards cuelgan de él, así que sin la suma el
          // título se les habría acercado 21rem y la escena empezaría con la
          // primera card ya encima. Sumándolo, la distancia título↔card sigue
          // siendo exactamente los 38svh de siempre y lo único que se mueve es
          // dónde empieza todo.
          "--own-card-lead": "calc(var(--own-head-block) + 38svh)",
        } as React.CSSProperties
      }
      className="relative z-[1] bg-cream text-foreground"
    >
      {/* El `pb` es aire real, no compensación: separa la sección del corte con
          la siguiente (que es negra y entra a sangre). Lo que compensa el
          desvío de las cards es el `paddingBottom` que el efecto le escribe al
          grid — ver `measure`. No confundir los dos: subir este `pb` para tapar
          un desborde de animación esconde el bug para un tamaño de ventana y lo
          deja intacto en el resto.

          El gap del Container ya solo separa DOS hijos —el grid de la escena
          y el título de mobile—, y en desktop ese hueco no existe: el título es
          `lg:hidden`, y un elemento oculto no genera caja ni gap. */}
      <Container className="flex flex-col gap-24 pb-32 pt-32 lg:gap-36">
        {/* El grid manda: su altura es la de las cards y sus márgenes, así que
            no hay ninguna altura declarada que pueda quedarse corta o larga.
            El encabezado y el título viven DENTRO de este mismo grid, los dos
            como items que abarcan `grid-row: 1/-1` — el mismo mecanismo, no
            uno cada uno. Antes el encabezado tenía su propia "pista" aparte
            (un div hermano con `padding-bottom` + un margen negativo acá para
            cancelarlo) para controlar cuánto duraba pegado; en la práctica el
            sticky no enganchaba ahí — Chrome no restituía el `position:sticky`
            de un descendiente cuando lo único que cambiaba era una custom
            property escrita por JS en un ancestro, sin cambio de clase ni de
            atributo que disparara la invalidación. Metiendo el encabezado en
            el MISMO grid que ya pega a "Own Your Own" correctamente, evita el
            problema en vez de perseguirlo: los dos usan el patrón que ya
            funciona. */}
        <div
          data-own-stage
          className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0 lg:pt-[var(--own-card-lead)]"
        >
          {/* El encabezado ocupa las cuatro filas igual que el título de abajo,
              y se pega DENTRO de esa celda por el mismo motivo: `self-start`
              para que mida su contenido en vez de estirarse a la altura del
              grid entero, y `grid-row:1/-1` para que el rectángulo donde puede
              vivir el sticky sea el grid completo.

              `mb-[800px]` es lo que lo hace soltarse ANTES que el título
              (`mb-[200px]`, más abajo): el título sube hacia arriba al
              soltarse, y si el encabezado siguiera clavado ahí arriba se
              cruzarían. 600px de margen extra sobre el del título es el
              mismo colchón que antes calculaba `HEAD_RELEASE` en JS — acá
              alcanza con un número fijo porque ya no hay una pista propia
              cuyo alto haya que medir.

              `marginTop` cancela el `--own-card-lead` que `pt` le agrega al
              grid (empuja a TODOS los items, no solo a las cards) — el
              encabezado no quiere ese aire de entrada, quiere aparecer ya
              en su lugar desde el primer frame. El título sí lo quiere en
              parte (ver su nota de abajo), por eso su cancelación es
              distinta. */}
          <div
            data-own-head
            className="z-0 col-span-full grid grid-cols-1 gap-24 lg:mb-[800px] lg:grid-cols-2 lg:[grid-row:1/-1] lg:self-start lg:sticky"
            style={{
              top: "var(--own-head-top)",
              marginTop: "calc(-1 * var(--own-card-lead))",
            }}
          >
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
              programmable access keys with quantum-safe signing, so you get
              the ease of a web login with the guarantees of true self
              custody. Trade, stake, and move value across 30+ chains without
              ever handing your assets to an exchange.
            </p>
          </div>

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

            Ese `top` no es el centro exacto: lleva la corrección óptica de
            `--own-title-anchor`, declarada en la `<section>`.

            Los márgenes recortan el tramo pegado por sus dos puntas. Van como
            margen y no como padding a propósito: el padding agranda el
            elemento pegado y se llevaría al `h3` con él, moviendo también la
            posición congelada. El margen mueve el rectángulo en el que el
            sticky puede vivir —el área de grid del item, encogida por sus
            propios márgenes— y deja el anclaje intacto.

            `mt` es la entrada, y desde que existe `--own-card-lead` vive en
            el `style` de abajo en vez de acá: el lead es padding del grid y
            empujaría también al título, así que el margen tiene que restarlo.
            Sin ese descuento el título nacería a la altura de la card Assets
            —la única sin `mt` propio, y por lo tanto también pegada al techo
            del grid— y las dos entrarían juntas. Lo que el margen deja después
            del descuento es `--own-head-block`: el título nace justo debajo del
            encabezado, no encima.

            `mb` es la salida: el título se despega cuando su borde inferior
            alcanza el fondo del grid menos este margen, así que estos 200px
            son —literalmente— cuánta card queda por debajo cuando el título
            empieza a subir. Sin él quedaría clavado hasta el último píxel de
            la última card.

            Ambos en px y no en `svh`, por lo mismo que los márgenes de las
            cards: `svh` escala con el alto de la ventana y las cards con el
            ancho. (Las cards ya pasaron a % de su celda, que es la versión
            buena de esa misma idea; acá el % no sirve porque el contenedor de
            este item es todo el grid, no una celda de card.) */}
          <div
            data-own-title
            className="z-[1] hidden lg:mb-[200px] lg:block lg:sticky lg:col-start-4 lg:col-span-6 lg:self-start lg:[grid-row:1/-1]"
            style={{
              // Un punto del viewport —cuál, lo dice `--own-title-anchor`—
              // menos media altura del propio título. `--text-display` es su
              // alto porque su line-height es 1.
              //
              // Se mide contra el viewport ENTERO y no contra el hueco bajo
              // el encabezado, porque para cuando el título llega a pegarse
              // el encabezado ya se soltó: su pista se agota antes. Medirlo
              // contra un hueco que a esa altura ya no existe lo dejaba
              // innecesariamente bajo.
              // `max()` y no el cálculo pelado: en ventanas cómodas gana el
              // ancla del viewport y la composición es la de siempre; en las
              // bajas gana el piso y el título deja de treparse encima del
              // encabezado. No hay breakpoint de por medio — la transición
              // entre los dos regímenes es continua.
              top: "max(calc(100svh * var(--own-title-anchor) - var(--text-display) / 2), var(--own-title-floor))",
              // El `--own-card-lead` que baja a las cards es padding del
              // grid, así que empujaría también al título —es un item más de
              // ese grid—. Este margen negativo lo cancela y deja al título
              // naciendo a `--own-head-block` del borde del grid: justo por
              // DEBAJO del encabezado, que nace a 0 y mide como mucho eso.
              //
              // Eran 150px, y ese era el bug: el encabezado ocupa hasta 21rem,
              // así que a 150px los dos se solapaban en el flujo desde el
              // primer frame. Como comparten las columnas 7-9 del grid, el
              // párrafo del encabezado y el titular gigante se leían encima
              // durante toda la entrada de la sección — antes de que ninguno de
              // los dos hubiera llegado a pegarse, que es cuando el `top` y el
              // `--own-title-floor` recién empiezan a separarlos.
              //
              // Sin variante `lg:` porque no la necesita: en mobile el
              // elemento es `hidden`, y un elemento oculto no tiene margen
              // que aplicar.
              marginTop: "calc(var(--own-head-block) - var(--own-card-lead))",
            }}
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
              //
              // `self-start` es imprescindible, por el mismo motivo que en el
              // título y el encabezado: un grid item se estira por defecto a la
              // altura de su celda, y acá las filas son MÁS ALTAS que las cards.
              // No porque el contenido lo pida, sino porque el título y el
              // encabezado abarcan `grid-row: 1/-1` y son mucho más altos que
              // cualquier card: ese sobrante se reparte entre las cuatro filas,
              // y sin `self-start` cada card lo rellena con un hueco muerto
              // debajo de su párrafo.
              //
              // Sin variante `lg:`: en mobile cada card ya es la única de su
              // fila y la fila mide su contenido, así que no cambia nada ahí.
              // El tinte es el MISMO para las cuatro, así que vive acá y no en
              // `CARD_LAYOUT`: un campo por card que siempre vale lo mismo
              // invita a que alguien lo desempareje sin querer.
              //
              // `bg-card-tint/50` (#eae9e6 al 50% sobre el crema de la sección,
              // ≈ #efefec) las deja un escalón por debajo del fondo. Data y
              // Assets llevaban `bg-white/50`, que compone ≈ #fafaf8 — más CLARO
              // que el fondo, y por eso se leían como manchas blancuzcas en vez
              // de como cards.
              className={`z-[2] self-start rounded-3xl bg-card-tint/50 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-md ${CARD_LAYOUT[i].place}`}
            >
              {/* `sizes` es obligatorio en cuanto la imagen es fluida: con solo
                `width`, Next genera el srcset pero el navegador asume que ocupa
                el 100% del viewport y baja la variante más grande. La card vive
                en `lg:col-span-2` de un grid de 12 y se ensancha un 30% con sus
                márgenes, o sea ~19vw en desktop y ancho completo en móvil. */}
              <Image
                src={card.src}
                alt=""
                // 381x401 = el tamaño intrínseco de los glifos de
                // `public/prototype/ab10/`. Next escribe estos dos valores como
                // atributos del <img> y de ahí sale su `aspect-ratio`: con
                // `h-auto w-full`, un par que no coincida con el archivo
                // deforma el arte. Los PNG anteriores eran 290x267 (apaisados) y
                // estos son verticales, así que había que moverlos con ellos.
                width={381}
                height={401}
                sizes="(min-width: 1024px) 19vw, 100vw"
                className="block h-auto w-full rounded-xl"
              />
              {/* Sin padding lateral propio ni `py`: los 24px de la card
                (`p-6`) ya envuelven a los dos hijos por igual, y duplicarlos acá
                metía al texto más adentro que a la imagen — que es lo que hacían
                el `px-3 lg:px-2.5` y el `py-7 lg:py-4` anteriores, calibrados
                para cuando la card llevaba `p-2.5`. Lo único que queda es el
                `pt`, que es la separación imagen→texto. */}
              <div className="flex flex-col gap-3 pt-6">
                {/* `text-h3-serif` y no `text-h4 lg:text-label-lg`.
                  
                  Dos cosas cambian de una vez y van juntas: la familia pasa a
                  Kepler y el nivel sube dos escalones. El rol serif a esta
                  altura de la escala no existía —había display, h1, h2 y body,
                  nada entre h2 y body— y se acaba de agregar en globals.css;
                  escribirlo como `font-serif text-h3` acá habría sido el mismo
                  parche de cuatro clases que esos roles existen para evitar.

                  El `lg:` se fue a propósito. Antes el título ENCOGÍA en
                  desktop (`text-h4` móvil → `text-label-lg`, que es body): el
                  rótulo de la card terminaba del mismo tamaño que su cuerpo y
                  solo se distinguía por el peso. Ahora es un titular en las
                  dos anchuras y el clamp de `--text-h3` hace la transición. */}
                <h4 className="text-h3-serif italic">{card.title}</h4>
                {/* Sin `lg:text-body-sm`: el cuerpo se queda en `text-body` en
                  todas las anchuras. Ese encogido venía de cuando la card era
                  `col-span-2` y el texto se le iba a tres líneas; con las
                  columnas de ahora ya no hace falta apretarlo. */}
                <p className="text-body text-foreground/75 text-pretty">
                  {card.body}
                </p>
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
