"use client";

import Image from "next/image";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { getLenis } from "@/components/site/providers/lenisInstance";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import HeroFoliage from "@/components/sections/homepage-shared/HeroFoliage";

// El hero que se pliega: el paisaje entero se comprime hasta caber en el mark
// de NEAR, y el mark ocupa el lugar de la palabra «your».
//
//   Own your world.   →   Own ⬡ world.
//
// ── El gesto, en tres tiempos ───────────────────────────────────────────────
//
//   1. **La compresión.** El campo de follaje —que hasta ahora era el fondo a
//      sangre— se encoge hacia el hueco de «your». Lo que va dejando libre es
//      el crema de la página: el hero no se funde a otro color, se RETIRA hacia
//      el objeto.
//   2. **El flip.** «your» gira sobre su eje vertical y se va. Detrás ya está
//      el objeto, en su sitio y a su tamaño.
//   3. **La recomposición.** El hueco se contrae del ancho de la palabra al de
//      un cuadrado, y `Own` y `world.` se cierran sobre él.
//
// Todo scrubbed y reversible: el lector lo maneja con el dedo y puede volver a
// mirarlo subiendo. **No hay scroll-jack** — el hero de la línea viva congela el
// scroll ~2.2s para contar su secuencia una sola vez. Ese cambio se lleva puesta
// la coreografía que el hero le entregaba al statement (`heroSequence` +
// `AgentEconomy`), y por eso estas variantes montan `StatementPlain`.
//
// ── `contain`: las dos variantes ────────────────────────────────────────────
//
//   `mask`  — **el logo ES el recipiente.** El paisaje queda recortado por la
//             silueta: no hay caja, el objeto tiene la forma del mark y la N
//             está calada, dejando ver el crema por el hueco.
//   `frame` — **una caja con el paisaje adentro, y el logo encima.** El encuadre
//             se cierra a un cuadrado de esquinas blandas y el mark aparece
//             dentro, en crema sólido sobre el follaje.
//
// Era la única diferencia entre `/prototype/homepage-f` y `/prototype/homepage-b`;
// desde que `f` se borró (2026-08-23) `mask` no lo monta nadie.
//
// ── Dos decisiones estructurales que sostienen todo ─────────────────────────
//
// **1. El paisaje es HIJO del hueco.** Vive dentro del `<span>` que ocupa el
// lugar de «your», sacado de flujo y centrado sobre él. Podría haber sido un
// hermano posicionado con coordenadas calculadas —y así estaba escrito
// primero—, pero eso tiene un modo de fallo que no se puede parchear: en el
// paso 3 el hueco se contrae, el titular está centrado, y al recomponerse la
// línea el hueco SE MUEVE. Un destino calculado en el refresh apunta a donde el
// hueco estaba, y el objeto aterriza al lado de su sitio — cerca, que es peor
// que lejos, porque se lee como un bug de un píxel. Colgado del hueco, el
// layout lo arrastra solo y el problema no existe.
//
// Por eso el tween anima el ORIGEN y no el destino: el estado final es
// «centrado sobre el hueco, sin desplazamiento» —cero cálculo— y lo que se
// calcula es de dónde viene, que es el centro del viewport.
//
// **2. La caja del paisaje no cambia nunca.** La compresión es un `transform`, y
// un transform no toca el layout: el `clientWidth` del canvas sigue siendo el
// del viewport, así que `HeroFoliage` no re-mide ni re-renderiza a otra
// resolución. Arranca nítido a pantalla completa y termina como un objeto de
// ~60px con sobre-resolución, con una sola instancia de WebGL y sin un redibujo
// extra. Animar `width`/`height` haría lo contrario: dispararía el
// `ResizeObserver` del shader en cada frame del scroll.

/** Cuánto scroll cuesta el pliegue, por defecto. */
const TRAVEL = "130svh";

/** Lado del objeto final, en `em` del titular. Por defecto. */
const CHIP_EM = 1.04;

/**
 * Cuánto baja el objeto respecto de la línea de base, por cada `em` que mida de
 * más. Un cuarto del excedente lo centra ópticamente contra la altura de caja
 * del titular; con más, se hunde por debajo de la línea.
 */
const CHIP_DROP = 0.28;

const MARK_SRC = "/prototype/homepage-fold/near-mark.svg";

export type HeroFoldProps = {
  /** Ver el docblock: quién contiene al paisaje. */
  contain: "mask" | "frame";
  /**
   * Cómo la palabra le entrega el lugar al objeto.
   *
   * `flip` — «your» gira sobre su eje vertical y el objeto se asienta con un
   *          contra-giro corto, como si viniera del otro lado de una ficha.
   * `fade` — la palabra se desvanece y el objeto aparece. Nada rota.
   *
   * El intercambio es el momento en que el gesto se explica, y las dos lecturas
   * son legítimas: el flip cuenta una sustitución (esto se convierte en
   * aquello), el fade cuenta una revelación (esto estaba detrás). El flip pide
   * más atención; el fade se lleva mejor con un recorrido corto, donde una
   * rotación no llega a leerse y solo se percibe como un parpadeo.
   */
  exchange?: "flip" | "fade";
  /** Cuánto scroll cuesta el pliegue. Menos = más rápido. */
  travel?: string;
  /**
   * El lado del objeto final, en `em` del titular.
   *
   * 1 lo deja del alto de una mayúscula y el lockup se lee como una palabra
   * más; por encima de 1.3 el objeto pasa a ser una PIEZA metida en la frase, y
   * hay que bajarlo respecto de la línea de base para que no se descuelgue por
   * arriba (de eso se encarga el `vertical-align` del hueco, que se deriva de
   * este mismo número).
   */
  chip?: number;
  /**
   * El primer gesto hacia abajo completa el pliegue solo.
   *
   * Sin esto, el pliegue es puro scrub: avanza y retrocede con el dedo, y el
   * lector puede dejarlo a mitad. Con esto, el primer scroll hacia abajo lo
   * termina y el primero hacia arriba lo desarma — la página viaja sola de
   * punta a punta del tramo, en los dos sentidos.
   *
   * No es un scroll-jack: lo que se anima es la posición de scroll, no un
   * timeline con reloj propio. Los detalles están en el bloque de motion.
   */
  autoplay?: boolean;
};

export default function HeroFold({
  contain,
  exchange = "flip",
  travel = TRAVEL,
  autoplay = false,
  chip = CHIP_EM,
}: HeroFoldProps) {
  const masked = contain === "mask";
  const flips = exchange === "flip";

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    const nodes = () => ({
      stage: q("[data-fold-stage]")[0],
      word: q("[data-fold-word]")[0],
      swap: q("[data-fold-swap]")[0],
      badge: q("[data-fold-badge]"),
    });

    // ── Sin motion: el lockup, ya armado ──────────────────────────────────
    //
    // No es «la misma página sin animación»: es el ESTADO FINAL servido de
    // entrada. El titular se lee `Own ⬡ world.` desde el primer frame y el
    // paisaje vive dentro del objeto. Dejarlo en el estado inicial —fondo a
    // sangre y la palabra «your»— sería mostrar un hero que promete un gesto
    // que nunca llega.
    mm.add(MQ.reduce, () => {
      const { stage, word, swap, badge } = nodes();
      if (!stage || !word || !swap) return;

      const side = chipSide(swap, chip);
      gsap.set(word, { autoAlpha: 0, position: "absolute" });
      gsap.set(swap, { width: side });
      gsap.set(stage, {
        xPercent: -50,
        yPercent: -50,
        scale: side / shortSide(stage),
        "--fold-veil": 0,
      });
      if (!masked) {
        gsap.set(stage, {
          "--fold-inset-x": `${insetX(stage)}px`,
          "--fold-inset-y": `${insetY(stage)}px`,
        });
        // Dividido por la escala final, igual que en el tween: el radio vive en
        // la caja sin escalar y el transform lo achica con ella. Por
        // `setProperty` y no por GSAP, por lo mismo que en el tween.
        stage.style.setProperty(
          "--fold-round",
          `${(roundPx(swap, chip) * shortSide(stage)) / side}px`
        );
      }
      gsap.set(badge, { autoAlpha: 1, scale: 1 });

      return () => gsap.set([stage, word, swap, ...badge], { clearProps: "all" });
    });

    mm.add(MQ.motion, () => {
      const { stage, word, swap, badge } = nodes();
      if (!stage || !word || !swap) return;

      // Los valores van como FUNCIONES, no como números. `invalidateOnRefresh`
      // las vuelve a llamar en cada re-medición, así que el pliegue sobrevive a
      // un resize, a un giro de pantalla y —el caso que de verdad importa— al
      // swap de fuentes: el hueco mide lo que mide la tipografía, y hasta que
      // Kepler no cargó, mide otra cosa.
      const tl = gsap.timeline({
        scrollTrigger: {
          // El trigger es la SECCIÓN, o sea el propio scope. No se busca con
          // `q()`: ese selector solo ve descendientes, y el track es el
          // ancestro de todo — pedírselo devuelve `undefined` y el timeline no
          // se crea nunca, en silencio.
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      // ── 1. La compresión ─────────────────────────────────────────────────
      //
      // De «centrado en el viewport, tamaño completo» a «centrado en el hueco,
      // tamaño de una palabra». El origen se calcula (`offsetFromSlot`), el
      // destino es cero — ver la decisión estructural 1 del docblock.
      //
      // `power2.inOut`: el paisaje arranca moviéndose poco —los primeros
      // píxeles de scroll son exploratorios, y un hero que salta al primer roce
      // se siente frágil— y frena contra el final, cuando ya es un objeto
      // acomodándose en su hueco.
      tl.fromTo(
        stage,
        {
          xPercent: -50,
          yPercent: -50,
          x: () => offsetFromSlot(swap).x,
          y: () => offsetFromSlot(swap).y,
          scale: 1,
        },
        {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: () => chipSide(swap, chip) / shortSide(stage),
          ease: "power2.inOut",
          duration: 0.58,
        },
        0
      );

      if (masked) {
        // El velo de la máscara.
        //
        // La máscara del mark está puesta DESDE EL PRIMER FRAME y aun así no
        // recorta nada al principio: son dos capas compuestas por unión
        // (`mask-composite: add`) —un rectángulo opaco que cubre todo, más la
        // silueta—. Mientras el rectángulo esté opaco la unión es «todo
        // visible»; al desvanecerlo queda solo el mark.
        //
        // Así y no aplicando la máscara de golpe a mitad de camino porque el
        // cambio tiene que ser CONTINUO: en los valores intermedios el paisaje
        // se disuelve hacia el crema por fuera de la silueta, que es justo el
        // gesto — el mundo se retira hacia el objeto.
        //
        // **Arranca en 0.32 y no antes**, y eso costó un pase. Con el velo
        // desvaneciéndose desde el principio, la silueta se materializa cuando
        // el paisaje todavía ocupa media pantalla: lo que el lector ve es una N
        // GIGANTE apareciendo de golpe con el titular encima, y después esa N
        // encogiéndose. Son dos sucesos donde tiene que haber uno. Retrasado,
        // el paisaje primero se encoge —sigue siendo un paisaje— y la forma del
        // logo se revela cuando el objeto ya casi tiene su tamaño final.
        tl.to(stage, { "--fold-veil": 0, ease: "power2.inOut", duration: 0.26 }, 0.32);
      } else {
        // El encuadre se cierra a un cuadrado de esquinas blandas.
        //
        // `clip-path: inset()` y no `width` + `border-radius`: `inset()` es
        // interpolable de punta a punta (incluido su `round`) y recortar no
        // toca el layout, así que el canvas sigue sin enterarse.
        // El recorte va en TRES variables y no en un solo `clip-path`, porque
        // el encuadre y el redondeo no pasan al mismo tiempo.
        //
        // Interpolando `inset(...)` de punta a punta, el `round` crece junto
        // con el cierre del encuadre: a mitad de camino la caja todavía mide
        // media pantalla y ya lleva un radio proporcional a ESA caja, o sea
        // ~450px. Se ve como una pastilla gigante, no como una caja que se
        // cierra. Separadas, el encuadre se cierra durante todo el gesto y las
        // esquinas se ablandan solo al final, cuando el objeto ya casi tiene su
        // tamaño.
        //
        // El ENCUADRE empieza tarde —a 0.26— por el mismo motivo que el velo de
        // la otra variante: cerrar a cuadrado mientras la caja todavía mide
        // media pantalla deja un recorte moviéndose en el medio del hero, con
        // el titular sobresaliendo por los lados. El REDONDEO, en cambio, va
        // primero; el porqué está en su propio tween.
        //
        // Y el radio va en **px**, no en `%`. Un porcentaje en `round` se
        // resuelve por eje —23% del ancho en horizontal, 23% del alto en
        // vertical— así que sobre una caja apaisada da esquinas ELÍPTICAS: el
        // objeto final se leía como un rectángulo con los lados rectos y las
        // puntas abombadas. En px las cuatro esquinas son iguales.
        tl.to(
          stage,
          {
            "--fold-inset-x": () => `${insetX(stage)}px`,
            "--fold-inset-y": () => `${insetY(stage)}px`,
            ease: "power2.inOut",
            duration: 0.32,
          },
          0.26
        );
        // El redondeo no se anima: se RECALCULA contra la escala en cada frame.
        //
        // El radio vive en la caja sin escalar, y el `transform` lo achica junto
        // con todo lo demás. O sea que un valor fijo en px da un redondeo
        // VISUAL que cambia todo el tiempo: el que se ve bien en el objeto
        // final —23% de su lado— es una curva descomunal cuando la caja todavía
        // mide media pantalla, y la caja grande se lee como una pastilla.
        //
        // Lo que tiene que quedar constante es el radio en píxeles de PANTALLA.
        // De ahí la división por la escala vigente: el valor css crece a medida
        // que la caja se achica, y las dos cosas se cancelan. Al final, con la
        // escala en su mínimo, el valor aterriza exactamente en el 23% del lado
        // del objeto, que es la proporción de diseño — no hay que animarlo
        // hasta ahí, llega solo.
        //
        // Va en un tween sin objetivo (`{}`) porque no anima ninguna propiedad:
        // solo necesita un `onUpdate` que corra durante todo el tramo en que la
        // escala cambia. Ese es su único trabajo.
        //
        // Se escribe con `setProperty` y no con `gsap.set`. GSAP gestiona las
        // custom properties a través de su propia cache de estilos, y en un
        // valor que se reescribe en cada frame desde fuera de un tween esa capa
        // no aporta nada y sí puede perder la escritura: la variable no llegaba
        // al elemento, y como el `clip-path` la interpola dentro de un
        // `inset(... round var(--fold-round))`, la declaración entera quedaba
        // inválida y el navegador la descartaba. El objeto se veía como un
        // rectángulo sin recortar ni redondear, que es un modo de fallo mucho
        // más ruidoso que su causa.
        const paintRound = () => {
          const sc = Number(gsap.getProperty(stage, "scale"));
          const r = roundPx(swap, chip) / (Number.isFinite(sc) && sc > 0 ? sc : 1);
          stage.style.setProperty("--fold-round", `${Number.isFinite(r) ? r : 0}px`);
        };
        paintRound();
        tl.to(
          {},
          {
            duration: 0.58,
            onUpdate: paintRound,
            // El scrub puede aterrizar en el final sin pasar por el tramo
            // animado —un salto de posición, una recarga a media página—, y ahí
            // `onUpdate` no corre. `onComplete`/`onReverseComplete` cubren las
            // dos puntas.
            onComplete: paintRound,
            onReverseComplete: paintRound,
          },
          0
        );
        // El mark entra cuando la caja ya casi terminó de cerrarse: primero se
        // entiende que hay un objeto, después quién es.
        // En `fade` el mark entra SOLO con opacidad. La escala de entrada es
        // parte de la misma familia que el flip —cosas que llegan desde otro
        // lado— y mezclarla con un intercambio por desvanecido deja el gesto
        // hablando dos idiomas en el mismo segundo.
        tl.fromTo(
          badge,
          flips ? { autoAlpha: 0, scale: 1.18 } : { autoAlpha: 0 },
          flips
            ? { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 0.2 }
            : { autoAlpha: 1, ease: "power1.out", duration: 0.2 },
          0.4
        );
      }

      // ── 2. El flip ───────────────────────────────────────────────────────
      //
      // «your» gira sobre su eje y se va a los 90°, que es donde una cara plana
      // deja de existir. No hay una segunda cara girando detrás: el objeto YA
      // está ahí desde el final de la compresión. Lo que lo hace leer como un
      // flip es el contra-giro corto de abajo — el objeto se asienta como si
      // viniera del otro lado.
      //
      // Dos caras de verdad pedirían una segunda instancia del shader, una por
      // cara, y el gesto no mejora lo suficiente como para pagar un segundo
      // contexto WebGL.
      tl.to(
        word,
        flips
          ? {
              rotationY: -90,
              autoAlpha: 0,
              transformPerspective: 900,
              ease: "power2.in",
              duration: 0.16,
            }
          : { autoAlpha: 0, ease: "power1.in", duration: 0.16 },
        0.24
      );
      // El contra-giro del objeto existe solo en `flip`: es la mitad que hace
      // que la sustitución se lea como una ficha dándose vuelta. En `fade` no
      // hay nada que girar — el objeto simplemente estaba ahí.
      if (flips) {
        tl.fromTo(
          stage,
          { rotationY: -16 },
          {
            rotationY: 0,
            transformPerspective: 6000,
            ease: "power2.out",
            duration: 0.18,
            // ⚠️ Los dos valores de acá abajo son la diferencia entre un
            // asentamiento y un objeto destrozado, y los dos costaron un pase.
            //
            // `immediateRender: false`: un `fromTo` aplica su `from` EN EL
            // ACTO, al construir el timeline — no cuando le toca el turno. Sin
            // esto, el paisaje nacía rotado 16° y se quedaba así todo el hero:
            // el gesto se veía como dos rotaciones (una al abrir la página,
            // otra acá) y la primera dejaba el fondo en diagonal.
            //
            // `transformPerspective: 6000` y no 900: la perspectiva se aplica
            // ANTES del `scale`, o sea sobre la caja de layout, que mide más de
            // 1900px. A 900px de distancia focal, una caja de ese tamaño girada
            // 16° se deforma como una cuchilla —el lado que se aleja se vuelve
            // una punta—. La distancia tiene que ser grande respecto del
            // objeto, no respecto de lo que se ve.
            immediateRender: false,
          },
          0.54
        );
      }

      // ── 3. La recomposición ──────────────────────────────────────────────
      //
      // El hueco pasa del ancho de «your» al del cuadrado y la línea se cierra
      // sola. Arranca apenas la palabra terminó de girar y mientras el paisaje
      // todavía se está comprimiendo — que es posible porque el objeto está
      // colgado del hueco: si el hueco se mueve, el objeto se mueve con él.
      //
      // El orden importa y costó un pase: con la palabra yéndose DESPUÉS de que
      // el objeto aterriza, los dos se pisan a mitad del gesto y se ve la N
      // cruzada con las letras de «your». La palabra tiene que haberse ido
      // antes de que llegue quien la reemplaza.
      //
      // Esto es lo único de todo el pliegue que toca el layout, y por eso es lo
      // último y lo más corto. Son unos pocos frames sobre un elemento de
      // texto, y es lo que evita que la frase SALTE a su forma final — que es
      // justo el remate del gesto, el peor lugar posible para un corte.
      tl.to(
        swap,
        { width: () => chipSide(swap, chip), ease: "power2.inOut", duration: 0.2 },
        0.4
      );

      // ── El tirón del primer scroll ───────────────────────────────────────
      //
      // Apenas la página se mueve unos píxeles desde el tope, el pliegue se
      // termina solo: Lenis lleva el scroll hasta el final del tramo y el
      // lockup queda armado.
      //
      // **No es un scroll-jack.** El hero de la línea viva resuelve esto
      // parando Lenis ~2.2s y reproduciendo un timeline con reloj propio:
      // durante ese rato la página NO se mueve por más que el lector insista.
      // Acá lo que se anima es la POSICIÓN DE SCROLL, con el mismo motor que
      // mueve la página siempre. El pliegue no se reproduce: se recorre, más
      // rápido que a mano. Al terminar, el lector está donde habría llegado
      // scrolleando, y subir lo desarma como cualquier otro tramo.
      //
      // ── El tirón, en los dos sentidos ────────────────────────────────────
      //
      // Hacia abajo completa el pliegue; hacia arriba lo desarma. En los dos
      // casos lo que se anima es la POSICIÓN DE SCROLL —con el mismo motor que
      // mueve la página siempre— y no un timeline con reloj propio. El pliegue
      // no se reproduce: se recorre, más rápido y más parejo que a mano.
      //
      // Que la vuelta exista no es simetría por prolijidad. Sin ella, subir a
      // releer el hero obliga a desandar 75svh a fuerza de rueda mientras el
      // tramo de bajada se hizo solo: el mismo camino cuesta distinto según la
      // dirección, y eso se siente como que la página se resiste.
      //
      // ── Cómo se detecta ─────────────────────────────────────────────────
      //
      // Un listener de `scroll` sobre la ventana, y nada más.
      //
      // La primera versión usó un `Observer` de GSAP sobre `wheel,touch`, que
      // es lo que hace el hero de la línea viva. Escucha el GESTO, y eso deja
      // afuera todas las otras formas de mover la página: las flechas, av-pág,
      // el espacio, arrastrar la barra. En un hero que define lo primero que el
      // lector ve, ese agujero no es aceptable. La segunda usó un ScrollTrigger
      // de posición: correcto, pero agrega una dependencia de más —cuándo
      // refresca, contra qué scroller mide, si Lenis le está reportando— para
      // responder "¿la página se movió seis píxeles?", que lo dice `scrollY`.
      const DEADZONE = 6;

      let last = window.scrollY;
      // El estado inicial se decide contra el FINAL del tramo, no contra cero.
      //
      // Al recargar, el navegador restaura la posición de scroll, y esa
      // posición puede caer en cualquier punto. Dando por «plegado» todo lo que
      // no fuera cero, una recarga a 30px arrancaba en el estado de llegada y
      // el primer reajuste del scroll —que va hacia arriba— disparaba la vuelta
      // sin que nadie hubiera tocado nada. Solo cuenta como plegado lo que ya
      // está en el final del tramo o más abajo.
      let folded = window.scrollY >= trackSpan(scope);
      // Mientras el tirón corre, sus propios eventos de scroll entran acá. Sin
      // este flag el primer frame del viaje se lee como "el lector se está
      // moviendo" y dispara el tirón contrario: los dos se pelean y la página
      // queda temblando entre las dos puntas.
      let moving = false;

      const GLIDE = 1.5;
      let unlock = 0;

      const glide = (to: number, onDone: () => void) => {
        // ⚠️ `getLenis()` se pide ACÁ, no al montar. Este setup corre en un
        // layout effect, y los layout effects de los hijos corren antes del
        // `useEffect` del padre — que es donde `PrototypeMotionProvider`
        // registra la instancia. Resuelto al montar, `getLenis()` devuelve
        // `null` y el tirón no ocurre nunca: sin error, sin warning, solo un
        // hero que se comporta como si `autoplay` no existiera.
        const lenis = getLenis();
        if (!lenis) return;

        moving = true;

        // Red de seguridad: si `onComplete` no llega, el candado se suelta
        // solo. No es defensa por si acaso — `scrollTo` avanza en el rAF de
        // Lenis, y hay estados en que ese rAF deja de correr con un viaje en
        // curso: una pestaña que pasa a segundo plano lo congela. Sin este
        // tope, el pliegue vuelve a primer plano con `moving` trabado en true y
        // el tirón no responde nunca más, en ninguna dirección.
        window.clearTimeout(unlock);
        unlock = window.setTimeout(() => {
          moving = false;
          last = window.scrollY;
        }, GLIDE * 1000 + 600);

        lenis.scrollTo(to, {
          duration: GLIDE,
          // Sin `lock`, cualquier movimiento del dedo durante el viaje lo
          // cancela y el pliegue queda a mitad — que es justo lo que este modo
          // viene a evitar. Es la única concesión, y dura segundo y medio.
          lock: true,
          // `inOut` y no `out`: arranca y frena con la misma calma. Una curva
          // de salida sola sirve cuando el movimiento responde a un golpe —el
          // objeto sale disparado y se acomoda—, pero acá el lector ya soltó el
          // gesto y lo que mira es un trayecto. Con `out` el primer tercio pasa
          // demasiado rápido para leerse; repartido, el pliegue se ve entero.
          easing: (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
          onComplete: () => {
            // El candado no se suelta en el mismo frame en que el viaje
            // termina. Lenis asienta la posición con un par de eventos más, y
            // uno de ellos puede retroceder una fracción de píxel: con el
            // candado ya abierto, ese retroceso se lee como «el lector está
            // subiendo» y dispara el tirón contrario en el acto. El pliegue
            // rebotaba solo, sin que nadie tocara nada.
            window.clearTimeout(unlock);
            unlock = window.setTimeout(() => {
              moving = false;
              last = window.scrollY;
              onDone();
            }, 120);
          },
        });
      };

      const onScroll = () => {
        const y = window.scrollY;
        const down = y > last;
        last = y;
        if (moving) return;

        const span = trackSpan(scope);
        if (span <= 0) return;

        // Adelante: el lector empieza a bajar desde el tope.
        if (!folded && down && y >= DEADZONE && y < scope.offsetTop + span) {
          folded = true;
          glide(scope.offsetTop + span, () => {});
          return;
        }

        // Atrás: sube y todavía está dentro del tramo.
        //
        // El umbral descuenta la zona muerta por el mismo motivo que el
        // candado de arriba: justo en el destino del viaje de ida, cualquier
        // asentamiento de una fracción de píxel cuenta como «subiendo». Hay que
        // haber retrocedido de verdad.
        if (folded && !down && y > 0 && y <= scope.offsetTop + span - DEADZONE) {
          folded = false;
          glide(scope.offsetTop, () => {});
        }
      };

      if (autoplay) {
        window.addEventListener("scroll", onScroll, { passive: true });
      }

      return () => {
        window.clearTimeout(unlock);
        window.removeEventListener("scroll", onScroll);
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([stage, word, swap, ...badge], { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, [masked, autoplay, chip]);

  return (
    <section
      ref={rootRef}
      data-fold-track
      style={{ "--fold-travel": travel } as React.CSSProperties}
      className="relative h-[calc(var(--fold-travel)+100svh)] bg-cream text-foreground"
    >
      {/* La escena pegada. `overflow-hidden` va acá —sobre el hijo pegado— y
          nunca sobre la sección: un ancestro con overflow distinto de `visible`
          se convierte en el contenedor de scroll del sticky y este deja de
          pegarse, en silencio. */}
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* Reserva del nav, que es `fixed` y no ocupa flujo. */}
        <div aria-hidden="true" className="h-[5.5rem] shrink-0" />

        <Container className="relative flex flex-1 flex-col items-center justify-center pb-28 pt-14 text-center text-display">
          {/* `isolate` crea el stacking context del titular: adentro, el
              paisaje se pinta en la capa 0 y las palabras en la 1. Sin él
              habría que mandar el paisaje a `z-[-1]`, que lo pondría por
              DETRÁS del crema de la sección — o sea, invisible.

              El titular no lleva `bg-clip-text`. El gradiente que tiene en la
              línea viva se fue con el fondo a sangre: acá la palabra del medio
              desaparece y el hueco se contrae, y un texto recortado contra un
              fondo es la peor base posible para eso — cada cambio de caja
              re-encuadra el degradé y las letras cambian de color solas a mitad
              del gesto. */}
          <h1 className="isolate text-[1.08em] text-pretty">
            <span className="relative z-[1]">Own</span>{" "}
            {/* El hueco. `inline-block` porque un `width` animado necesita una
                caja, y `align-baseline` para que el objeto se apoye en la misma
                línea que las letras en vez de flotar. El ancho inicial NO se
                declara: lo pone el contenido, o sea la palabra, medida con el
                tipo que de verdad se cargó. */}
            {/* `vertical-align` derivado del tamaño del objeto y no fijo en
                `baseline`: apoyado en la base, un objeto de más de un `em` se
                descuelga por arriba de las mayúsculas y el lockup se lee
                desalineado. Bajarlo un cuarto del excedente lo centra
                ópticamente contra la altura de caja del titular — a tamaño
                chico el excedente es cero y el valor cae en `0`, que es
                exactamente `baseline`. */}
            <span
              data-fold-swap
              className="relative inline-block"
              style={{ verticalAlign: `${-CHIP_DROP * Math.max(0, chip - 1)}em` }}
            >
              {/* La palabra sube exactamente lo que el hueco baja.
                  El `vertical-align` de arriba existe para el OBJETO —que mide
                  más de un `em` y apoyado en la base se descuelga por encima de
                  las mayúsculas—, pero desplaza el hueco entero, y «your» vive
                  adentro. Sin esta compensación la palabra queda más baja que
                  `Own` y `world.` durante todo el estado inicial, que es
                  justamente lo primero que se ve de la página.

                  `top` y no un `translate`: en la variante `flip` GSAP le
                  anima `rotationY` a este mismo elemento, y un transform de la
                  hoja de estilos lo pisaría el tween en el primer frame. */}
              <span
                data-fold-word
                className="relative z-[1] inline-block whitespace-nowrap"
                style={{ top: `${-CHIP_DROP * Math.max(0, chip - 1)}em` }}
              >
                your
              </span>

              {/* ── El paisaje ──────────────────────────────────────────────
                  Mide un viewport exacto y está centrado sobre el hueco. En
                  reposo el tween lo corre hasta el centro de la pantalla; al
                  plegarse vuelve a cero, que es su sitio natural.

                  `--fold-veil` es la opacidad de la capa rectangular de la
                  máscara, o sea «cuánto sigue sin recortar». Va como custom
                  property porque es lo único de una máscara que GSAP puede
                  interpolar: `mask-image` no es animable, pero un
                  `rgb(... / var(--x))` dentro de un gradiente sí. */}
              <span
                data-fold-stage
                aria-hidden="true"
                // El centrado sobre el hueco NO va como clase de Tailwind.
                    // GSAP escribe la propiedad `transform` COMPLETA en cada
                    // frame, así que un `-translate-x-1/2` de la hoja de estilos
                    // desaparece en el primer tween. Va como `xPercent`/`yPercent`
                    // —que GSAP compone con `x`/`y` en el mismo transform— y se
                    // deja puesto también en el estado de reposo.
                    className="pointer-events-none absolute left-1/2 top-1/2 z-0 block h-[130svh] w-[130vw] origin-center will-change-transform"
                style={
                  masked
                    ? ({
                        "--fold-veil": 1,
                        maskImage: `linear-gradient(rgb(0 0 0 / var(--fold-veil)), rgb(0 0 0 / var(--fold-veil))), url(${MARK_SRC})`,
                        WebkitMaskImage: `linear-gradient(rgb(0 0 0 / var(--fold-veil)), rgb(0 0 0 / var(--fold-veil))), url(${MARK_SRC})`,
                        maskSize: "100% 100%, contain",
                        WebkitMaskSize: "100% 100%, contain",
                        maskPosition: "center, center",
                        WebkitMaskPosition: "center, center",
                        maskRepeat: "no-repeat, no-repeat",
                        WebkitMaskRepeat: "no-repeat, no-repeat",
                        maskComposite: "add",
                        WebkitMaskComposite: "source-over",
                      } as React.CSSProperties)
                    : // El recorte se declara UNA vez acá y se maneja por sus
                      // tres variables. En reposo vale «sin recorte»: el
                      // encuadre completo, esquinas rectas. Ver el tween para
                      // por qué son tres y no un `clip-path` animado entero.
                      ({
                        "--fold-inset-x": "0px",
                        "--fold-inset-y": "0px",
                        "--fold-round": "0px",
                        clipPath:
                          "inset(var(--fold-inset-y) var(--fold-inset-x) round var(--fold-round))",
                      } as React.CSSProperties)
                }
              >
                <HeroFoliage className="h-full w-full" />

                {/* El mark encima del paisaje, solo en `frame`.
                    Mide una fracción del lado corto de la escena y se comprime
                    CON ella, así que al final ocupa esa misma fracción del
                    objeto sin que nadie calcule nada — 52 de 130svh, o sea
                    dos quintos del cuadro.

                    Ese es el techo razonable: por encima, el mark empieza a
                    tocar el redondeo de las esquinas y el objeto deja de
                    leerse como una caja CON un logo adentro para leerse como un
                    logo con un borde. */}
                {!masked && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Image
                      data-fold-badge
                      src={MARK_SRC}
                      alt=""
                      aria-hidden="true"
                      width={800}
                      height={800}
                      unoptimized
                      className="h-[52svh] w-auto opacity-0"
                    />
                  </span>
                )}
              </span>
            </span>{" "}
            <span className="relative z-[1]">
              <Accent display>world.</Accent>
            </span>
          </h1>
        </Container>
      </div>
    </section>
  );
}

/* ── Medidas ──────────────────────────────────────────────────────────────── */
//
// Ninguna se cachea: todas se llaman desde funciones de GSAP, que corren en
// cada `refresh`. El hueco mide lo que mide la tipografía, y entre el primer
// paint y el swap de fuentes eso cambia.

/** El lado del objeto final: `em` del tamaño de fuente del hueco. */
function chipSide(swap: HTMLElement, em: number): number {
  return em * parseFloat(getComputedStyle(swap).fontSize || "16");
}

/**
 * El lado corto de la escena — contra el que se mide la escala.
 *
 * El objeto es CUADRADO y el paisaje no: tanto la máscara (`contain`) como el
 * recorte (`inset`) se quedan con el cuadrado centrado del lado corto, así que
 * la escala se calcula contra ese lado y no contra el ancho. En un teléfono en
 * vertical el lado corto es el ancho, y por eso es un `min` y no `offsetHeight`.
 *
 * `offsetWidth/Height` y no `getBoundingClientRect`: los primeros son
 * PRE-transform, y este elemento está siendo transformado por el tween que hace
 * la pregunta.
 */
function shortSide(stage: HTMLElement): number {
  return Math.max(1, Math.min(stage.offsetWidth, stage.offsetHeight));
}

/* Las tres piezas del recorte de la variante `frame`. Ver el tween. */

/** Cuánto sobra a cada lado hasta dejar el cuadrado centrado. */
function insetX(stage: HTMLElement): number {
  return Math.max(0, (stage.offsetWidth - shortSide(stage)) / 2);
}

function insetY(stage: HTMLElement): number {
  return Math.max(0, (stage.offsetHeight - shortSide(stage)) / 2);
}

/**
 * El radio en píxeles de PANTALLA: 23% del lado del objeto final.
 *
 * Se mide contra el hueco y no contra la caja del paisaje a propósito. Es el
 * radio que el lector ve, y el que la caja tiene que conservar mientras se
 * comprime — el valor que va al css sale de dividirlo por la escala vigente.
 *
 * En px y no en `%`: un porcentaje en `round` se resuelve por eje, así que
 * sobre una caja apaisada da esquinas ELÍPTICAS.
 */
function roundPx(swap: HTMLElement, em: number): number {
  return 0.23 * chipSide(swap, em);
}

/**
 * El recorrido del pliegue en px: lo que el tramo mide de más que el viewport.
 *
 * Es exactamente el rango del ScrollTrigger (`top top` → `bottom bottom`), o
 * sea la posición en la que el timeline vale 1. Se calcula y no se guarda
 * porque `--fold-travel` está en `svh` y su valor en píxeles cambia con la
 * ventana.
 */
function trackSpan(scope: HTMLElement): number {
  return Math.max(0, scope.offsetHeight - window.innerHeight);
}

/**
 * Cuánto hay que correr el paisaje para que, estando anclado al hueco, quede
 * centrado en la PANTALLA. Es el estado inicial del pliegue.
 *
 * El hueco vive en el titular, que está centrado en el hero con padding
 * asimétrico: no cae exactamente en el centro del viewport, y sin esta
 * corrección el hero abriría con el paisaje desplazado y una franja de crema
 * asomando por un borde.
 */
function offsetFromSlot(swap: HTMLElement): { x: number; y: number } {
  const slot = swap.getBoundingClientRect();
  const slotCx = slot.left + slot.width / 2;
  const slotCy = slot.top + slot.height / 2;
  // `clientWidth/Height` del documento y no `window.innerWidth/Height`: los de
  // `window` INCLUYEN la barra de scroll, así que el centro salía ~14px a la
  // derecha del centro visual y el paisaje dejaba una franja de crema asomando
  // por el borde izquierdo del hero. Los del documento miden el área que el
  // lector ve de verdad.
  const doc = document.documentElement;
  return {
    x: doc.clientWidth / 2 - slotCx,
    y: doc.clientHeight / 2 - slotCy,
  };
}
