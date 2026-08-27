"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import {
  EASE_OUT,
  REVEAL,
  DEBUG_MARKERS,
} from "@/components/primitives/motion/motionTokens";
import { OWN_YOUR_OWN_CARDS as CARDS } from "@/components/sections/homepage-shared/homepageUpdateContent";

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

// ── El parallax ─────────────────────────────────────────────────────────────
//
// Cuánto MÁS RÁPIDO que la página sube cada card, en fracción de la velocidad
// del scroll y en el orden de `OWN_YOUR_OWN_CARDS`.
//
// `0.45` quiere decir que mientras la página recorre 1000px, la card recorre
// 1450: sube un 45% más rápido. `0.06` es casi la velocidad de la página.
//
// ── Por qué reemplaza al mecanismo anterior ────────────────────────────────
//
// Acá vivía un sistema de «destiempo» que derivaba el desvío de cada card del
// LAYOUT: medía el hueco entre cards, calculaba la amplitud máxima con la que
// ninguna alcanzaba a otra, y repartía ese margen entre cuatro velocidades
// centradas en su media.
//
// Era correcto y era imposible de calibrar, por una razón que costó varias
// pasadas encontrar: lo que se percibe es **desvío dividido por recorrido de
// scroll**, y en aquel diseño esas dos magnitudes no estaban relacionadas por
// nada. La amplitud venía del hueco entre cards; el recorrido, de dónde quedaba
// el título pegado. Con un recorrido de varias pantallas y un hueco de un par
// de cientos de píxeles, las cuatro cards terminaban yendo al 90–110% de la
// velocidad de la página: se separaban al final, pero en ningún momento se veía
// a una moverse distinto de otra.
//
// Estos números no tienen ese problema porque SON la unidad que se percibe. No
// hay media que los centre, ni normalización, ni amplitud derivada de nada:
// `0.45` se ve como un 45%.
//
// ── Las cuatro suben ───────────────────────────────────────────────────────
//
// Ninguna baja, y eso no es tímido: una card que baja se sale de la sección por
// abajo y aterriza sobre la siguiente, que entra a sangre y en negro. El
// mecanismo anterior necesitaba reservar ese sobrante con un `paddingBottom`
// calculado en JS; con las cuatro subiendo, el problema no existe.
//
// Lo que sí queda es hueco al pie del grid mientras las cards suben. Es lo que
// hace el parallax en cualquier sitio que lo use, y la sección tiene aire de
// sobra ahí.
const PARALLAX = [0.10, 0, 0.18, 0.54] as const;

/**
 * El índice de Traces. Su factor NO sale de la tabla de arriba — el 0 está de
 * relleno para que la tabla siga teniendo cuatro entradas.
 */
const TRACES = 1;

/**
 * Dónde termina Traces respecto de Data, en fracción del alto de Data.
 *
 * 0.15 quiere decir que al final del recorrido el borde superior de Traces
 * queda a un 15% del alto de Data por debajo del de Data: las dos se solapan un
 * 85%, y Traces **nunca la pasa**.
 *
 * Es la segunda palanca de su velocidad y actúa al revés que la separación
 * inicial: bajar este número lleva a Traces MÁS ARRIBA sobre Data, o sea le
 * exige más recorrido en el mismo scroll.
 *
 * ── Su rango es corto, y conviene saberlo ─────────────────────────────────
 *
 * Todo el recorrido del ratio vale `altoDeData / R` de factor — con la
 * geometría de esta sección, unos 0.15. Ir de 0.6 al piso 0 sube el factor de
 * 0.34 a 0.43 y ahí se acabó: el piso es 0 porque debajo Traces pasaría a Data,
 * que es lo que este mecanismo existe para impedir.
 *
 * La separación inicial (`mt` en `CARD_LAYOUT`) no tiene ese techo. Cuando haga
 * falta más velocidad, ésa es la palanca con recorrido; el ratio es el ajuste
 * fino.
 *
 * ── Por qué esto se calcula y no se estima ────────────────────────────────
 *
 * Es un objetivo GEOMÉTRICO, y con parallax la posición final de una card es
 * `−factor × recorrido`: depende del alto de la sección y del viewport. Un
 * factor elegido a ojo cumple el objetivo en una pantalla y lo falla en la de
 * al lado — en una se quedan lejos, en otra Traces pasa de largo y se cruzan,
 * que es justo lo que no tiene que pasar.
 *
 * Despejando de
 *
 *     (topT − fT·R) − (topD − fD·R) = 0.6 · altoDeData
 *
 * sale el factor que lo cumple, y se recalcula en cada refresh. Ver
 * `tracesFactor`.
 */
const TRACES_END_RATIO = 0.15;

/**
 * Dónde termina la sección, expresado como dónde está la ÚLTIMA card cuando eso
 * pasa: fracción del viewport en la que cae su borde superior.
 *
 * 0.5 = a media pantalla. De ahí para abajo ya no entra contenido nuevo —las
 * cuatro cards se leyeron— y lo que queda es crema vacía hasta que la sección
 * siguiente asoma. Este número la trae a ese punto.
 *
 * Bajarlo acorta más (la card tiene que subir más para que se dé por cerrada);
 * subirlo deja más aire al final.
 */
const RELEASE_ANCHOR = 0.5;

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
// límite por colisión y solo lo acota `SPREAD` — ver la nota de esa constante
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
    // `mt` POSITIVO, el único de los cuatro: arranca por debajo de donde Data
    // termina, no encabalgada sobre ella. Es el paso largo de la composición, y
    // es lo que le da a Traces distancia que recorrer.
    //
    // ── Acá también se regula su VELOCIDAD ────────────────────────────────
    //
    // Y esto no es obvio, así que conviene tenerlo claro antes de tocar el
    // número. El destino de Traces está fijo —termina al 60% del alto de Data,
    // ver `TRACES_END_RATIO`— y su factor se despeja de ahí:
    //
    //     fT = fD + [ (topT − topD) − ratio·altoDeData ] / R
    //
    // O sea que **cuanto más lejos arranca, más rápido sube**: tiene más
    // distancia que cubrir en el mismo recorrido. Separarla es la palanca de su
    // parallax, y no hay un factor que ajustar en paralelo — se recalcula solo.
    //
    // 12% → 22% → 38% → 43% → 57% → 70% → 85%, subiendo para marcar más el
    // efecto. Los `%` van contra el ANCHO del grid, así que 85% son ~1410px de
    // separación en desktop: casi tres veces el alto de una card, y con eso el
    // factor de Traces llega a ~0.63.
    //
    // Los dos últimos saltos salieron de pedir más velocidad —+20% y +15%— y
    // los dos tuvieron que darse acá: el ratio ya no tiene recorrido para
    // tanto, su rango entero vale unos 0.15 de factor. Ver la nota de
    // `TRACES_END_RATIO`. El factor de Traces queda en ~0.50, o sea que sube a
    // vez y media la velocidad de la página contra el 0.10 de Data.
    //
    // ⚠️ A esta separación el hueco entre las dos filas es grande al ARRANCAR, y
    // la sección puede leerse partida en dos bloques antes de que el parallax lo
    // cierre. Es el techo de composición del que hablaba la nota de más arriba,
    // y a 57% estamos dentro de él.
    //
    // El techo lo pone la composición, no la aritmética: pasado cierto punto
    // Traces arranca tan abajo que deja un hueco entre las dos filas y la
    // sección se lee partida antes de que el parallax la cierre.
    place: "lg:col-start-7 lg:col-span-3 lg:row-start-2 lg:mt-[85%]",
  },
  {
    // Assets — columnas 1-3, fila 3. Pega al borde izquierdo del Container.
    //
    // El `mt` era `-101%` y volvió casi ahí después de varias pasadas: `-85%`,
    // un tirón de ~1410px hacia arriba. Sigue siendo la única con margen
    // negativo, y la que arranca más alta de las cuatro.
    //
    // Se solapa en vertical con Traces y no pasa nada: viven en columnas
    // opuestas, la 1-3 contra la 7-9, así que no se pisan por más que se
    // crucen.
    //
    // ── Acá el `mt` NO cambia la velocidad ────────────────────────────────
    //
    // A diferencia del de Traces, que se despeja de un destino y por eso mover
    // su margen mueve su factor. Assets tiene el suyo fijo en la tabla
    // (`PARALLAX[2] = 0.18`), así que esto es composición pura: cambia dónde
    // arranca y nada más. Las dos cosas se ajustan por separado.
    place: "lg:col-start-1 lg:col-span-3 lg:row-start-3 lg:-mt-[85%]",
  },
  {
    // Intelligence — columnas 10-12, fila 4. Pega al borde derecho.
    //
    // El `mt` fue `-27%` → `-45%` → `-30%` → `-12%` → `+6%` → `+25%`. Cruzó a
    // POSITIVO en el penúltimo salto: dejó de tirar hacia arriba y ahora empuja
    // ~415px hacia abajo. Es la tercera con margen positivo, junto a Data y
    // Traces.
    //
    // Arranca la más abajo de todas y de ahí sube a 0.56, así que es la que más
    // distancia recorre después de Traces — y con solo 0.07 de diferencia entre
    // las dos, las dos cierran la sección casi al mismo ritmo.
    //
    // Su factor sube a la vez, de 0.06 a 0.54 — era la más lenta de las cuatro,
    // casi pegada a la velocidad de la página, y pasa a ser la segunda más
    // rápida, justo por detrás de Traces. Las
    // dos cosas van juntas y no se estorban: acá el `mt` es composición pura y
    // el factor sale de la tabla, así que se ajustan por separado. (En Traces
    // no: allá el margen mueve el factor — ver su nota.)
    place: "lg:col-start-10 lg:col-span-3 lg:row-start-4 lg:mt-[112%]",
  },
] as const;

/* ── La entrada del titular ───────────────────────────────────────────────────
 *
 * «Own Your Own» se pega y las cards lo atraviesan. Hasta acá llegaba ya
 * dibujado: el sticky lo dejaba quieto en su sitio y no pasaba nada más.
 *
 * Ahora se ARMA al llegar. Cada letra gira sobre su eje horizontal y aparece a
 * la vez, escalonadas de izquierda a derecha, y el disparo es el instante en
 * que el título toca su tope y se pega.
 *
 * ── Desde opacidad 0 y no desde una opacidad baja ──────────────────────────
 *
 * Es la diferencia con el statement de más arriba, que se rellena desde 0.18
 * con el scroll. Allá el texto es un párrafo que se lee y lo que se anima es la
 * LECTURA, así que tiene que estar presente desde antes. Acá es un titular que
 * se monta: si estuviera insinuado al 20% dejaría de aparecer y pasaría a
 * encenderse, que es otro gesto.
 *
 * ── Por qué gira, y sobre qué eje ──────────────────────────────────────────
 *
 * `rotateX` — cada letra cae hacia el lector desde su propio borde superior.
 * Sobre `rotateY` (girar como una puerta) las letras anchas barren mucho
 * horizontal y se pisan con sus vecinas a mitad del giro; sobre X el barrido es
 * vertical y el ancho de la letra no cambia, así que la palabra nunca se
 * amontona.
 *
 * `transformPerspective` va por elemento y no como `perspective` en el padre a
 * propósito: en el padre, la distancia al punto de fuga crece con la posición
 * de cada letra y las de las puntas giran con más deformación que las del
 * medio. Por elemento, las tres palabras giran igual.
 *
 * ── No es scrub, pero tampoco se gasta ─────────────────────────────────────
 *
 * El statement de arriba avanza con el scroll porque es una lectura. Esto no:
 * ocurre de una, al llegar, porque es la sección plantándose. Con scrub el
 * titular se armaría y desarmaría mientras las cards lo cruzan, que es justo el
 * tramo en el que tiene que estar quieto.
 *
 * Pero se REARMA cada vez que la sección vuelve a entrar. No es una intro que
 * se consume: es lo que el titular hace al llegar, y subir a releer y volver a
 * bajar tiene que mostrarlo armándose igual que la primera vez.
 *
 * Eso son DOS triggers y no uno, y es el mismo patrón que `ProofLedger`
 * documenta para sus seis renglones. El motivo es que los dos límites no caen
 * en el mismo punto del scroll:
 *
 *   · el que REPRODUCE dispara cuando el título toca su tope y se pega;
 *   · el que REBOBINA espera a que el título haya salido ENTERO de cuadro por
 *     abajo (`top bottom`).
 *
 * Colgar el rebobinado del primero —un `reset` en el cuarto verbo de
 * `toggleActions`— lo dispararía en su propio `start`, o sea con el título
 * todavía a la vista: el lector que sube ve el titular desarmarse delante suyo.
 * Con el segundo trigger el rebobinado sigue siendo instantáneo y sigue sin
 * verse, que es lo que se busca.
 */
const TITLE_IN = {
  /** Desde dónde cae cada letra. Negativo: el borde de arriba viene hacia atrás. */
  rotateX: -92,
  /** La distancia al punto de fuga. Más bajo, más deformación. */
  perspective: 420,
  /** Lo que tarda una letra. */
  duration: 0.72,
  /** Entre una letra y la siguiente. */
  stagger: 0.035,
} as const;

export default function OwnYourOwn() {

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const cards = q("[data-own-card]");
    const stage = q("[data-own-stage]")[0];
    const title = q("[data-own-title]")[0];
    if (cards.length !== PARALLAX.length || !stage || !title) return;

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

    // ── El titular se arma al pegarse ──────────────────────────────────────
    //
    // El disparo es el `top` del propio sticky: cuando el borde superior del
    // título llega a ese punto del viewport, el navegador lo pega. Se lee del
    // estilo computado y no de una constante porque ese `top` es un `max()`
    // entre dos medidas del viewport (ver el `style` del elemento) — escrito a
    // mano acá, se desincroniza en el primer resize.
    //
    // `invalidateOnRefresh` para que el `start`, que es una función, se vuelva a
    // evaluar en cada re-medida.
    const titleSplit = SplitText.create(title, { type: "chars,words" });
    gsap.set(titleSplit.chars, {
      opacity: 0,
      rotateX: TITLE_IN.rotateX,
      transformPerspective: TITLE_IN.perspective,
      transformOrigin: "50% 0%",
    });

    const titleIn = gsap.to(titleSplit.chars, {
      opacity: 1,
      rotateX: 0,
      duration: TITLE_IN.duration,
      stagger: TITLE_IN.stagger,
      ease: EASE_OUT,
      scrollTrigger: {
        trigger: title,
        start: () => `top ${parseFloat(getComputedStyle(title).top)}px`,
        // Este trigger SOLO reproduce. El rebobinado vive en el suyo, abajo.
        toggleActions: "play none none none",
        invalidateOnRefresh: true,
        markers: DEBUG_MARKERS,
      },
    });

    const titleReset = ScrollTrigger.create({
      trigger: title,
      // El borde inferior del viewport: el rebobinado espera a que el título
      // haya salido entero de cuadro. Ver la nota de `TITLE_IN`.
      start: "top bottom",
      onLeaveBack: () => titleIn.pause(0),
      markers: DEBUG_MARKERS,
    });

    // ── El parallax ────────────────────────────────────────────────────────
    //
    // Un tween por card, todos con el MISMO trigger y el mismo rango, cada uno
    // con su factor. La posición de cada card es
    //
    //     y_i(t) = −PARALLAX[i] · rango · t
    //
    // o sea velocidad constante y propia durante todo el recorrido: la card
    // sube `PARALLAX[i]` veces más rápido que la página. Es la definición del
    // efecto, y el número es directamente lo que se ve.
    //
    // ── El rango va de punta a punta ───────────────────────────────────────
    //
    // `top bottom` → `bottom top`: desde que el grid asoma por abajo hasta que
    // termina de salir por arriba. Es el recorrido completo en el que las cards
    // están en pantalla, y es lo que hace que el factor signifique lo que dice
    // — con un rango más corto, la card recorre lo mismo en menos scroll y su
    // velocidad real deja de ser la declarada.
    //
    // Ese rango se mide en cada refresh (`invalidateOnRefresh` + `y` como
    // función), así que un resize o un cambio de alto lo reajustan solos.
    //
    // ── `ease: "none"`, y no es negociable ─────────────────────────────────
    //
    // Cualquier curva es un perfil temporal COMPARTIDO por las cuatro: las hace
    // acelerar y frenar a la vez, y eso domina lo que el ojo lee. Se percibe una
    // respiración de grupo en vez de cuatro velocidades — las cards se separan
    // sin que se vea a ninguna moverse distinto. Fue el segundo motivo por el
    // que el efecto no se leía.
    //
    // ── El scrub con retardo ───────────────────────────────────────────────
    //
    // Número y no `true`. Con `true` las cards son una función pura de la
    // posición de la página y el efecto se siente rígido: la card no se mueve,
    // la página la arrastra. Con un número, GSAP persigue el progreso con ese
    // catch-up en segundos, así que la card queda algo atrás al empezar a
    // scrollear y sigue acomodándose después de soltar.
    //
    // 0.6 y no más: por encima de ~1.5 deja de leerse como inercia y empieza a
    // leerse como lag, y el sitio ya corre Lenis suavizando por su lado.
    // El recorrido: desde que el grid asoma por abajo hasta que sale por
    // arriba. Es el mismo para las cuatro y se remide en cada refresh.
    const range = () => stage.offsetHeight + window.innerHeight;

    /** El top de layout de una card, sin el transform vigente. */
    const layoutTop = (card: HTMLElement) =>
      card.getBoundingClientRect().top - Number(gsap.getProperty(card, "y"));

    /**
     * El factor de Traces, despejado del objetivo en vez de elegido.
     *
     * Queremos que al final del recorrido
     *
     *     (topT − fT·R) − (topD − fD·R) = TRACES_END_RATIO · altoDeData
     *
     * o sea que Traces quede solapada un 40% sobre Data sin llegar a pasarla.
     * Despejando:
     *
     *     fT = fD + [ (topT − topD) − ratio·altoDeData ] / R
     *
     * Se evalúa en cada refresh, así que el objetivo se cumple en cualquier
     * viewport — que es el punto: con un factor fijo, la misma tabla deja a las
     * dos cards lejos en una pantalla y las cruza en otra.
     */
    const tracesFactor = () => {
      const data = cards[0];
      const gap = layoutTop(cards[TRACES]) - layoutTop(data);
      const target = TRACES_END_RATIO * data.getBoundingClientRect().height;
      return PARALLAX[0] + (gap - target) / range();
    };

    const factorFor = (i: number) =>
      i === TRACES ? tracesFactor() : PARALLAX[i];

    const parallax = cards.map((card, i) =>
      gsap.fromTo(
        card,
        { y: 0 },
        {
          // El signo: negativo sube. Las cuatro suben — ver la nota de
          // `PARALLAX` para por qué ninguna baja.
          y: () => -factorFor(i) * range(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
            markers: DEBUG_MARKERS,
            // `will-change` solo durante el recorrido. Estas cards llevan
            // además `backdrop-blur`, que ya fuerza su propia capa: fijo en el
            // className eran cuatro capas con filtro vivas toda la sesión para
            // una animación que ocupa dos pantallas de scroll.
            onToggle: (st) => {
              card.style.willChange = st.isActive ? "transform" : "auto";
            },
          },
        },
      ),
    );

    // ── El recorte de la cola ──────────────────────────────────────────────
    //
    // Debajo de la sección quedaban varias pantallas de crema vacía. Es
    // consecuencia directa del parallax: las cuatro cards SUBEN, así que al
    // final del recorrido el contenido visible está cientos de píxeles por
    // encima del fondo de su propia caja — y esa caja sigue midiendo lo que el
    // layout dice, porque un `transform` no toca el layout. Pasada la última
    // card no entra contenido nuevo y el lector scrollea nada.
    //
    // ── El punto no puede ser un trigger sobre la card ─────────────────────
    //
    // ScrollTrigger mide sus triggers con `getBoundingClientRect()`, que
    // incluye el `transform` que el parallax le está aplicando en ese instante:
    // la posición medida depende de dónde estaba la card al refrescar. La card
    // no tiene una posición, tiene una trayectoria.
    //
    // Así que se despeja de esa trayectoria. En coordenadas de documento, con
    // `s` la posición de scroll:
    //
    //     card en viewport(s) = docTop − s − f·(s − inicioDelRango)
    //
    // (el segundo término es la página moviéndose; el tercero, el parallax, que
    // avanza `f · rango` a lo largo de un rango que mide exactamente `rango` —
    // o sea `f` píxeles por píxel de scroll).
    //
    // Igualando al umbral Θ y despejando:
    //
    //     s = (docTop + f·inicioDelRango − Θ) / (1 + f)
    const LAST = cards.length - 1;

    const releaseScroll = () => {
      const scrolled = window.scrollY;
      const f = factorFor(LAST);
      const rangeStart =
        stage.getBoundingClientRect().top + scrolled - window.innerHeight;
      const card = cards[LAST];
      // El CENTRO de la card, no su borde: «la última card a media pantalla»
      // es dónde está la card, y una card mide ~650px — medir por el borde de
      // arriba la deja con medio cuerpo fuera de cuadro.
      const cardDocMid =
        layoutTop(card) + scrolled + card.getBoundingClientRect().height / 2;
      return (
        (cardDocMid + f * rangeStart - RELEASE_ANCHOR * window.innerHeight) /
        (1 + f)
      );
    };

    // ── Dónde va el recorte, que es lo que costó ──────────────────────────
    //
    // `margin-bottom` NEGATIVO **en el grid**, no en la `<section>`.
    //
    // En la sección no servía, y el porqué es la parte que se puede repetir: un
    // margen negativo no encoge la caja del elemento que lo lleva, mueve al
    // que viene DESPUÉS. La sección seguía midiendo lo mismo y su `bg-cream`
    // con `z-[1]` seguía pintando hasta el mismo píxel — encima de la sección
    // siguiente, que ahora venía subida y quedaba tapada. El documento se
    // acortaba y la cola se veía idéntica.
    //
    // En el grid sí: el margen entra en el alto del `Container`, o sea en el de
    // la sección, así que la crema **termina antes**.
    //
    // Y no hay bucle, que era el otro requisito: un margen no cuenta para
    // `offsetHeight` ni mueve el `top` del propio grid, así que ni `range()` ni
    // el punto de suelta cambian al aplicarlo. Con un `height` o un `padding`
    // sí lo habría — recortar movería el número que decide cuánto recortar.
    //
    // ── No es el `paddingBottom` que se fue ────────────────────────────────
    //
    // Aquel medía el desborde de un mecanismo que empujaba cards HACIA ABAJO y
    // reservaba sitio para que no aterrizaran sobre la sección siguiente: una
    // compensación de un efecto secundario. Éste declara una regla de
    // composición —la sección se acaba cuando se acabó de leer— y la resuelve
    // con la única medida que puede darla.
    //
    // Se recalcula en `refreshInit`, o sea antes de que ScrollTrigger mida
    // nada, así que el resto de la página se remide ya con el recorte puesto.
    const trimTail = () => {
      // Medir SIN el recorte vigente, o cada pasada recortaría sobre lo ya
      // recortado.
      stage.style.marginBottom = "";
      const bottomDoc = scope.getBoundingClientRect().bottom + window.scrollY;
      const target = releaseScroll() + window.innerHeight;
      // `min(0, …)`: esto acorta, nunca alarga. Si en alguna proporción de
      // ventana la sección ya termina antes de ese punto, se la deja como está
      // — estirarla metería el hueco que el recorte viene a sacar.
      stage.style.marginBottom = `${Math.min(0, target - bottomDoc)}px`;
    };

    ScrollTrigger.addEventListener("refreshInit", trimTail);
    trimTail();


    return () => {
      ScrollTrigger.removeEventListener("refreshInit", trimTail);
      stage.style.marginBottom = "";
      titleReset.kill();
      titleIn.scrollTrigger?.kill();
      titleIn.kill();
      // `revert()` y no `kill()`: SplitText no es un tween, es cirugía de DOM.
      // Sin revertir, el segundo mount —StrictMode lo hace en cada uno de dev—
      // splitea sobre spans ya splitteados y multiplica el árbol.
      titleSplit.revert();
      for (const tween of parallax) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
      gsap.set(cards, { clearProps: "transform" });
      for (const card of cards) card.style.willChange = "auto";
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
            // ⚠️ `top` y `mt` van como utilidades CON PUERTA `lg:` y no en un
            // `style` inline, y esa es toda la diferencia entre que la sección
            // funcione en móvil o no.
            //
            // El `mt` negativo cancela el `--own-card-lead` que el grid agrega
            // como `pt`. Pero ese padding es `lg:pt-[…]`, o sea que abajo de
            // `lg` NO EXISTE — y la cancelación, escrita inline, sí. El
            // resultado era un margen negativo suelto de ~530px que subía el
            // encabezado por encima de la sección anterior: en móvil, «Next gen
            // self custody» y su párrafo se dibujaban encima del statement.
            //
            // Un `style` inline no se puede condicionar por breakpoint, así que
            // la regla es al revés: si el valor que cancela vive detrás de una
            // puerta, su cancelación tiene que vivir detrás de la MISMA puerta.
            // `top` sigue el mismo criterio — solo significa algo junto al
            // `lg:sticky` que lo acompaña.
            className="z-0 col-span-full grid grid-cols-1 gap-24 lg:mb-[800px] lg:mt-[calc(-1*var(--own-card-lead))] lg:grid-cols-2 lg:[grid-row:1/-1] lg:self-start lg:sticky lg:top-[var(--own-head-top)]"
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
              // `bg-surface-raised/20` es el gris del sistema al 20% sobre el crema
              // de la sección, que compone ≈ #f1f0ee: las deja un escalón por
              // DEBAJO del fondo. Data y Assets llevaban `bg-white/50`, que
              // compone ≈ #fafaf8 —más CLARO que el fondo— y por eso se leían
              // como manchas blancuzcas en vez de como cards.
              //
              // La opacidad va acá y no en el token a propósito: el token es el
              // gris, y cuánto de él quiere cada superficie lo decide quien la
              // pinta.
              // El hover: la card se ASIENTA, no salta.
              //
              // Dos cosas mínimas y las dos dicen lo mismo —el objeto se
              // acerca—: la sombra se abre (de 1px difusa a 18px con
              // desplazamiento) y el tinte sube medio escalón para despegar la
              // card del crema.
              //
              // **Nada que toque `transform`.** Estas cards llevan un parallax
              // por scroll que escribe `y` inline en cada frame (ver `SPEEDS` y
              // el efecto de arriba); un `hover:-translate-y` de Tailwind es esa
              // MISMA propiedad, así que el tween lo pisa y el hover no se ve
              // —o peor, pelea con él—. Lo que se mueve en el hover es el glifo,
              // que no tiene tween encima.
              //
              // `duration-300` es `DUR.fast` de la gramática de esta página; va
              // como clase y no por GSAP porque es un cambio de ESTADO y el
              // navegador ya sabe interpolarlo — un tween por hover sería un
              // contexto de animación por card para no ganar nada.
              //
              // `motion-reduce:transition-none` y el hover se conserva igual:
              // quien pidió menos movimiento sigue viendo qué card está
              // señalando, solo que sin el trayecto.
              className={`group/card z-[2] self-start rounded-3xl bg-surface-raised/20 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.07)] backdrop-blur-md transition-[box-shadow,background-color] duration-300 ease-out hover:bg-surface-raised/35 hover:shadow-[0_10px_18px_rgba(0,0,0,0.10)] motion-reduce:transition-none ${CARD_LAYOUT[i].place}`}
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
                // El glifo acompaña el hover con la mitad del recorrido de la
                // card. Escala DENTRO de su caja —la card no cambia de tamaño—
                // así que ninguna vecina se mueve.
                className="block h-auto w-full rounded-xl transition-transform duration-300 ease-out group-hover/card:scale-[1.03] motion-reduce:transition-none"
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
