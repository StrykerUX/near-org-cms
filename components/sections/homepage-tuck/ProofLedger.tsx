"use client";

import Container from "@/components/primitives/Container";
import {
  gsap,
  ScrollTrigger,
  SplitText,
} from "@/components/primitives/motion/gsapClient";
import {
  DEBUG_MARKERS,
  EASE_OUT,
} from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import {
  formatLedgerValue,
  LEDGER_NOTES,
  LEDGER_ROWS,
  type LedgerRow,
} from "@/components/sections/homepage-tuck/proofLedgerContent";

// Las seis pruebas de NEAR leídas como un balance: una columna de renglones,
// cada uno colgado de su propia plica, con la cifra a la izquierda y el cuerpo
// alineado a la derecha del bloque.
//
// Reemplaza a `homepage-shared/ProofDatum` SOLO en esta ruta. Aquella versión
// —un eje horizontal con seis fichas alternadas arriba y abajo— sigue viva y
// montada en `homepage-b`; acá se cambia la estructura, no el dato.
//
// ── Qué cambia respecto del eje alternado ───────────────────────────────────
//
// El eje horizontal pone a las seis pruebas al mismo nivel y las hace competir:
// seis cifras del mismo cuerpo, tres arriba y tres abajo, sin nada que diga por
// dónde empezar. El ledger las ORDENA. Cada prueba ocupa un renglón entero, la
// cifra crece hasta ser la estructura del renglón y el ojo baja de una en una
// en vez de barrer de izquierda a derecha.
//
// Y separa dos clases de prueba que el eje trataba igual. Cuatro de las seis
// son NÚMEROS (100%, 1.0 millón, $24 mil millones, 30) y dos son CUALIDADES
// (quantum-ready, confidential). En el eje las dos últimas fingían ser cifras
// —el mismo cuerpo, la misma ficha, con una palabra donde iba el número— y se
// leían como el dato que faltaba. Acá cierran abajo en pareja, a media caja
// cada una, al cuerpo de la glosa y no al del numeral: ya no fingen.
//
// ── La proporción es el diseño, y por eso todo mide en `cqw` ───────────────
//
// El artboard fija relaciones, no píxeles: la glosa es una fracción del
// numeral, la columna del cuerpo el 19.1% del bloque, la sangría de la plica el
// 5%. Escritas en `vw` esas relaciones aguantan hasta que el `Container` topa
// en su `max-width` (1780px) y el texto sigue creciendo — de ahí para arriba el
// renglón se descompone.
//
// En `cqw` se miden contra el BLOQUE, que es lo que el diseño mide, así que
// cuando el Container deja de crecer el renglón entero deja de crecer con él.
// Por eso el `@container` de más abajo no es decoración: sin ese elemento, cada
// `cqw` resuelve contra el viewport y vuelve exactamente el problema que evita.
//
// El mismo razonamiento —y la misma unidad— que `--text-mural`; está escrito
// largo en app/globals.css.
//
// ── El corte a móvil ────────────────────────────────────────────────────────
//
// La retícula de dos columnas (cifra | cuerpo) no cabe a 375px, así que abajo
// de `lg` el cuerpo baja debajo de la cifra y la pareja de cierre se apila.
// La plica NO se pierde en el camino: es lo único que sobrevive entero de la
// composición, y es lo que sigue diciendo que esto es una lista de pruebas y no
// seis párrafos seguidos.

/* ── La entrada ───────────────────────────────────────────────────────────────
 *
 * UN TRIGGER POR RENGLÓN, y no uno para la sección entera.
 *
 * Esta sección mide varias pantallas de alto: con un solo trigger al 75% del
 * viewport, los renglones tercero a sexto terminan de animarse mucho antes de
 * que nadie llegue a verlos, y lo que el visitante encuentra al bajar es texto
 * quieto. Cada renglón es su propia escena y espera su turno.
 *
 * Dentro de cada renglón el orden es el del diseño, y es una secuencia y no un
 * escalonado:
 *
 *   1. la PLICA se traza de arriba abajo — la estructura llega primero, y lo
 *      demás aterriza sobre algo que ya está;
 *   2. la CIFRA cuenta desde 0 hasta su valor y, EN EL MISMO TRAMO, entran el
 *      eyebrow y el signo. Van con ella a propósito: la cifra sola contando es
 *      un widget, la cifra contando mientras se escribe lo que la califica es
 *      un renglón que se arma. El signo va acá y no con la glosa porque
 *      pertenece al número —"100 por ciento", "24 más"— y no a lo que se
 *      cuenta;
 *   3. al 70% de la cuenta se escribe la GLOSA: la palabra en itálica que dice
 *      qué se estuvo contando. La cifra sube sin nombre y la palabra la cierra;
 *   4. y al 85%, el CUERPO de la derecha, renglón por renglón.
 *
 * Los dos últimos caen dentro del último tercio de la cuenta a propósito. Ahí
 * el `power2.out` ya frenó y el número casi no cambia, así que hay lugar para
 * que entre otra cosa sin competirle — y el renglón termina de armarse en un
 * solo movimiento en vez de en tres actos con pausas en medio.
 *
 * Y NO SE GASTA. Cada renglón se rearma cada vez que vuelve a entrar por abajo,
 * así que subir a releer y bajar otra vez lo muestra armándose igual que la
 * primera. Eso son DOS triggers por renglón y no uno —el que reproduce y el que
 * rebobina— porque los dos límites no caen en el mismo punto del scroll; está
 * escrito largo abajo, donde se crean.
 */

/**
 * Cuánto más rápido corre todo. 1.5 = un 50% por encima de los tiempos escritos
 * abajo.
 *
 * Va como `timeScale` del timeline y no repartido entre las siete constantes.
 * Los números de abajo son las PROPORCIONES de la secuencia —cuánto dura la
 * plica contra la cuenta, dónde cae el cuerpo dentro de ella— y son lo que hay
 * que poder leer y ajustar. Multiplicados uno por uno para cambiar la
 * velocidad, esas proporciones quedan enterradas en decimales y el próximo
 * ajuste global vuelve a tocar siete lugares en vez de uno.
 */
const SPEED = 1.5;

/**
 * Dónde tiene que estar el tope del renglón para que la escena arranque.
 *
 * Medido desde arriba del viewport, así que MÁS ALTO es más tarde: al 78% la
 * secuencia empezaba con el renglón ya bien adentro de la pantalla y se sentía
 * a destiempo — el visitante llegaba antes que la animación. Al 88% arranca
 * apenas el renglón asoma por abajo.
 *
 * No puede irse hasta `bottom` (100%): ahí se juntaría con el límite del
 * rebobinado, que vive en ese borde, y un temblor de scroll dejaría al renglón
 * rearmándose y reproduciéndose en loop. El 12% que queda en medio es esa
 * histéresis.
 */
const START = "top 88%";

/** Cuánto tarda la plica en cruzar el alto del renglón. */
const RULE = 0.8;

/**
 * Cuándo arranca la cifra.
 *
 * Menor que `RULE` a propósito: la plica todavía está bajando cuando el numeral
 * empieza a contar. Esperar a que termine parte el renglón en dos tiempos
 * muertos; solaparlas hace que una empuje a la otra.
 */
const FIGURE_AT = 0.45;

/** Cuánto dura la cuenta. */
const COUNT = 1.5;

/**
 * En qué punto de la cuenta entran la glosa y el cuerpo, como FRACCIÓN de lo
 * que dura la cuenta.
 *
 * Son fracciones y no tiempos en segundos para que sigan atadas a `COUNT`:
 * mover la duración de la cuenta las mueve con ella en vez de dejarlas donde
 * estaban. Y en este orden —primero la palabra, después el párrafo— porque la
 * glosa cierra la cifra y el cuerpo explica el conjunto: leído al revés, el
 * párrafo llega a explicar algo que todavía no terminó de decirse.
 *
 * Las dos caen en el último tercio, que es donde el `power2.out` ya frenó y el
 * número casi no cambia. Antes de ahí compiten con la cuenta; después de ahí
 * el renglón se parte en actos con pausas en medio (`GLOSS_AT` estuvo en 1 y se
 * notaba: la cifra frenaba, silencio, y recién entonces la palabra).
 */
const GLOSS_AT = 0.7;
const BODY_AT = 0.85;

/**
 * El respiro de la glosa EN LOS RENGLONES SIN CIFRA.
 *
 * Solo lo usan "Quantum-ready" y "Confidential": ahí la glosa no cierra un
 * conteo, es el titular de la prueba, y esperar no tendría a qué. En los
 * renglones con cifra este valor no se usa — ahí manda `GLOSS_AT`.
 */
const GLOSS_LEAD = 0.18;

/**
 * Lo que dura el par de cierre en el lugar donde los otros cuentan.
 *
 * "Quantum-ready" y "Confidential" no tienen cifra, así que no hay contador que
 * mida el segundo tiempo. Ocupa el mismo lugar en la secuencia —`BODY_AT` se
 * aplica sobre este valor igual que sobre `COUNT`—, así que las dos pruebas
 * llevan el mismo ritmo que las cuatro de arriba aunque su segundo tiempo sea
 * más corto.
 */
const GLOSS_BEAT = 0.85;

/** Entre letra y letra de la glosa y del eyebrow. */
const CHAR = 0.022;

export default function ProofLedger() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const rows = q("[data-row]");
    if (rows.length === 0) return;

    // El contador tiene que empezar en cero ANTES del primer cuadro, no cuando
    // el trigger dispara. El HTML llega del servidor con la cifra final —tiene
    // que llegar así: sin JS, o con el motion apagado, el dato es el dato— y si
    // el reset viviera dentro del timeline, el renglón mostraría el valor real
    // hasta que el scroll lo alcanza y ahí volvería a 0. Un parpadeo hacia
    // atrás, que es peor que no animar.
    const counters = q("[data-count]");
    const readCounter = (el: HTMLElement) => ({
      value: Number(el.dataset.count),
      decimals: Number(el.dataset.decimals),
      prefix: el.dataset.prefix ?? "",
    });
    // Formatea con la MISMA función que usó el servidor para pintar la cifra
    // final, ceros a la izquierda incluidos. Repetir el formato acá sería
    // repetir la regla del relleno en dos archivos, y el día que una prueba
    // cambie de cifra solo se actualizaría uno.
    const write = (el: HTMLElement, at: number) =>
      (el.textContent = formatLedgerValue(readCounter(el), at));
    counters.forEach((el) => write(el, 0));

    const timelines: gsap.core.Timeline[] = [];
    // Los triggers de rearmado, que no cuelgan de ningún timeline y por eso se
    // guardan aparte para poder matarlos al desmontar.
    const resets: ScrollTrigger[] = [];
    let splits: SplitText[] = [];
    let cancelled = false;

    // El split espera a que las fuentes midan. Partir por LÍNEAS es geometría
    // de fuente —dónde cae cada quiebre depende de la métrica real— y partir
    // por CARACTERES hereda el problema: con la de respaldo cada letra queda
    // envuelta en un span del ancho equivocado y el reflow deja la línea rota.
    const build = () => {
      if (cancelled || timelines.length) return;

      rows.forEach((row) => {
        // Se busca ANTES del timeline porque el `onLeaveBack` de más abajo lo
        // necesita en su closure.
        const counter = row.querySelector<HTMLElement>("[data-count]");

        const tl = gsap.timeline({
          defaults: { ease: EASE_OUT },
          scrollTrigger: {
            trigger: row,
            start: START,
            // Este trigger SOLO reproduce. El rebobinado vive en el suyo,
            // abajo, y la razón es que las dos cosas no ocurren en el mismo
            // punto del scroll.
            toggleActions: "play none none none",
            markers: DEBUG_MARKERS,
          },
        });
        // El único lugar donde se toca la velocidad. Escala tiempos Y desfases
        // a la vez, así que la secuencia se comprime entera sin descolocarse.
        tl.timeScale(SPEED);
        timelines.push(tl);

        // ── El rearmado, y por qué es un trigger aparte ────────────────────
        //
        // El renglón se rearma cada vez que vuelve a entrar por abajo: no es
        // una intro que se gasta, es el comportamiento del renglón.
        //
        // Lo que no puede es rearmarse A LA VISTA. Con el rebobinado colgado
        // del trigger de arriba —un `reset` en el cuarto verbo de
        // `toggleActions`— el disparo cae en su `start`, o sea con el tope del
        // renglón todavía dentro de la pantalla. El visitante que sube ve el
        // bloque apagarse de golpe delante suyo.
        //
        // Este segundo trigger mueve ESE límite, y solo ese: `top bottom` es el
        // borde inferior del viewport, así que el rebobinado espera a que el
        // renglón haya salido entero de cuadro. Sigue siendo instantáneo y
        // sigue sin verse — que era la idea desde el principio.
        resets.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top bottom",
            onLeaveBack: () => {
              tl.pause(0);
              // El texto de la cifra NO es una propiedad animada: es lo que el
              // `onUpdate` del contador escribe. Rebobinar el tween solo
              // arrastra al DOM si GSAP renderiza el cuadro 0 y dispara el
              // callback. Escribirlo acá lo vuelve un hecho en vez de una
              // consecuencia — si no, el renglón vuelve a entrar con la cifra
              // final puesta y "cuenta" de 100 a 100.
              if (counter) write(counter, 0);
            },
            markers: DEBUG_MARKERS,
          }),
        );

        /* 1 · la plica */
        const rule = row.querySelector<HTMLElement>("[data-rule]");
        // Es un `<span>` posicionado y no el `border-l` del artículo porque un
        // borde no se puede escalar: `scaleY` sobre el artículo arrastraría al
        // texto con él.
        if (rule)
          tl.from(rule, { scaleY: 0, duration: RULE, ease: "power2.out" }, 0);

        /* 2 · la cifra, con el eyebrow y el signo */
        let beat = GLOSS_BEAT;
        // Dónde cae la glosa. Sin cifra que esperar, entra pegada al resto;
        // con cifra, espera al 70% del conteo — ver el paso 3 de la secuencia
        // allá arriba.
        let glossAt = FIGURE_AT + GLOSS_LEAD;

        if (counter) {
          beat = COUNT;
          glossAt = FIGURE_AT + COUNT * GLOSS_AT;
          // El contador corre sobre un objeto suelto y escribe el resultado en
          // el DOM. No puede correr sobre el elemento: reescribir `textContent`
          // en cada cuadro borraría cualquier span que un split hubiera creado
          // adentro — por eso el numeral es lo ÚNICO de este renglón que no se
          // parte en letras.
          const proxy = { v: 0 };
          tl.to(
            proxy,
            {
              v: readCounter(counter).value,
              duration: COUNT,
              ease: "power2.out",
              onUpdate: () => write(counter, proxy.v),
            },
            FIGURE_AT,
          );
          tl.from(counter, { autoAlpha: 0, y: 18, duration: 0.6 }, FIGURE_AT);
        }

        const eyebrow = row.querySelector<HTMLElement>("[data-eyebrow]");
        if (eyebrow) {
          const s = SplitText.create(eyebrow, { type: "chars" });
          splits.push(s);
          gsap.set(s.chars, { autoAlpha: 0, y: 8 });
          tl.to(
            s.chars,
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: CHAR },
            FIGURE_AT,
          );
        }

        const unit = row.querySelector<HTMLElement>("[data-unit]");
        if (unit)
          tl.from(
            unit,
            { autoAlpha: 0, y: 12, duration: 0.5 },
            FIGURE_AT + 0.12,
          );

        const gloss = row.querySelector<HTMLElement>("[data-gloss]");
        if (gloss) {
          const s = SplitText.create(gloss, { type: "chars" });
          splits.push(s);
          gsap.set(s.chars, { autoAlpha: 0, y: 16 });
          tl.to(
            s.chars,
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: CHAR * 1.4 },
            glossAt,
          );
        }

        /* 3 · el cuerpo, a media cuenta */
        const body = row.querySelector<HTMLElement>("[data-body]");
        if (body) {
          // `mask: "lines"` envuelve cada renglón en un contenedor con
          // `overflow: hidden`, así que sube DESDE DEBAJO de su propio hueco en
          // vez de aparecer flotando por encima del renglón anterior.
          const s = SplitText.create(body, { type: "lines", mask: "lines" });
          splits.push(s);
          gsap.set(s.lines, { autoAlpha: 0, yPercent: 100 });
          tl.to(
            s.lines,
            { autoAlpha: 1, yPercent: 0, duration: 0.6, stagger: 0.09 },
            FIGURE_AT + beat * BODY_AT,
          );
        }
      });

      // Si algún renglón YA está en cuadro cuando el split termina —una recarga
      // a media página—, los triggers nuevos tienen que evaluarse contra el
      // layout vigente o ese renglón queda apagado hasta el próximo scroll.
      ScrollTrigger.refresh();
    };

    if (document.fonts?.ready) document.fonts.ready.then(build).catch(build);
    else build();

    return () => {
      cancelled = true;
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
      timelines.length = 0;
      resets.forEach((st) => st.kill());
      resets.length = 0;
      // `revert()` y no `kill()`: SplitText no es un tween, es cirugía de DOM.
      // Sin revertir, un segundo mount —StrictMode lo hace en cada uno de dev—
      // splitea sobre spans ya splitteados y multiplica el árbol.
      splits.forEach((s) => s.revert());
      splits = [];
      // El contador dejó el DOM con el último valor que escribió. Si el desmonte
      // pasa a mitad de la cuenta —navegar mientras corre—, el próximo mount
      // arrancaría desde un número intermedio.
      counters.forEach((el) => write(el, readCounter(el).value));
    };
  }, []);

  return (
    <section
      ref={rootRef}
      // `bg-cream` y no `bg-background`: es el papel de esta página, el mismo
      // que usan la sección anterior y la siguiente. El aire de arriba es
      // grande porque esta sección es lo primero que se ve al salir del negro
      // del stack; llegar con el primer renglón pegado al borde lo convierte en
      // la continuación de la transición en vez de en un respiro.
      className="bg-cream py-32 text-ink lg:py-44"
    >
      <Container>
        {/* El contenedor de consulta. Todo lo que mide en `cqw` acá abajo
            resuelve contra el ancho de ESTE div; sin él, contra el viewport. */}
        <div className="@container">
          <div className="flex flex-col gap-16 lg:gap-[5.6cqw]">
            {LEDGER_ROWS.map((row) => (
              <LedgerLine key={row.id} row={row} />
            ))}

            {/* Las dos cualidades. Media caja cada una, y el aire de arriba es
                mayor que el que separa a los renglones de cifra: es un cambio
                de clase de prueba, no el siguiente ítem de la lista. */}
            <div className="grid gap-16 lg:mt-[1.9cqw] lg:grid-cols-2 lg:gap-x-[8%]">
              {LEDGER_NOTES.map((note) => (
                <article
                  key={note.id}
                  data-row
                  className="relative pt-5 lg:pt-[2cqw]"
                >
                  <Rule />
                  <div className="pl-6 lg:pl-[5cqw]">
                    <p data-eyebrow className="text-body text-ink-soft">
                      {note.eyebrow}
                    </p>
                    <p data-gloss className="gloss-serif mt-3 lg:mt-[1cqw]">
                      {note.gloss}
                    </p>
                    <p
                      data-body
                      className="mt-5 text-body-sm text-ink-soft text-pretty lg:mt-[1.6cqw]"
                    >
                      {note.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * La plica: la línea vertical de la que cuelga el renglón.
 *
 * Un `<span>` absoluto y no el `border-l` del artículo porque tiene que
 * escalarse al entrar, y un borde no se escala sin arrastrar al texto.
 */
function Rule() {
  return (
    <span
      data-rule
      aria-hidden="true"
      className="absolute inset-y-0 left-0 w-px origin-top bg-ink"
    />
  );
}

function LedgerLine({ row }: { row: LedgerRow }) {
  return (
    <article
      data-row
      // `relative` para la plica, que es un hijo absoluto y no un borde.
      //
      // Dos columnas y DOS FILAS, con la posición de cada pieza declarada. El
      // cuerpo va en la fila del numeral, no en la del eyebrow, porque el
      // diseño lo alinea con la cifra: la primera línea del párrafo arranca
      // donde arranca el número.
      //
      // Sale de la retícula y no de un `pt` calculado a mano. El desfase que
      // haría falta es la altura del eyebrow más su aire, o sea dos valores que
      // cambian solos —con el token de la escala, con una copy más larga que
      // quiebre a dos renglones— y que dejarían el párrafo desalineado sin que
      // nadie lo note. Puesto en la fila 2, la alineación es una consecuencia
      // de la estructura y no un número que hay que mantener.
      //
      // Por eso el aire entre el eyebrow y la cifra es `gap-y` de la retícula:
      // como `mt` del numeral empujaba a la cifra dentro de su fila y dejaba al
      // párrafo arriba, que es justo el desfase que esto viene a sacar.
      className="relative pt-5 lg:grid lg:grid-cols-[1fr_19.1%] lg:grid-rows-[auto_auto] lg:gap-x-[2%] lg:gap-y-[0.6cqw] lg:pt-[2cqw]"
    >
      <Rule />

      <p
        data-eyebrow
        className="pl-6 text-body text-ink-soft lg:col-start-1 lg:row-start-1 lg:pl-[5cqw]"
      >
        {row.eyebrow}
      </p>

      {/* `items-start` y no una línea de base compartida: en el diseño el signo
          y la glosa NO se apoyan en la base del numeral, van altos. El `pt` de
          cada uno es óptico y está en `em` de su propio cuerpo, así que se mueve
          con la escala en vez de quedarse fijo en un tamaño de pantalla. */}
      <p
        data-figure
        className="mt-1.5 flex items-start pl-6 text-ledger lg:col-start-1 lg:row-start-2 lg:mt-0 lg:pl-[5cqw]"
      >
        {/* Los tres tramos van en tinta, y el renglón entero con ellos. Hubo un
            momento en que la prueba de volumen llevaba acento verde —el numeral
            en `ink-deep`, el signo y la glosa en `green-ink`— y se fue: las seis
            pruebas son una serie que se lee de arriba abajo, y pintar una
            distinta la sacaba de la serie sin decir por qué esa. */}
        <span
          // `data-count` lleva el VALOR y no es una bandera: es a la vez el
          // selector que encuentra el motor y el destino de la cuenta.
          //
          // Los tres datos viajan en el DOM y no en un closure, y eso es lo que
          // deja que el motor de la entrada sea UNO para los seis renglones:
          // recorre `[data-row]` sin saber nada de la copy, y cada renglón le
          // dice desde su propio markup hasta dónde contar y cómo escribirlo.
          data-count={row.value}
          data-decimals={row.decimals}
          data-prefix={row.prefix ?? ""}
        >
          {formatLedgerValue(row)}
        </span>

        {row.unit ? (
          <span
            data-unit
            // `mr` acá + `ml` en la glosa = el aire entre el signo y la palabra.
            // Partido en dos para que la glosa lleve SIEMPRE el mismo `ml`:
            // cuando no hay signo, ese solo margen es el aire correcto contra el
            // numeral.
            className="text-gloss mr-[0.36em] ml-[0.14em] pt-[0.35em]"
          >
            {row.unit}
          </span>
        ) : null}

        <span data-gloss className="gloss-serif ml-[0.24em] pt-[0.35em]">
          {row.gloss}
        </span>
      </p>

      <p
        data-body
        className="mt-6 pl-6 text-body-sm text-ink-soft text-pretty lg:col-start-2 lg:row-start-2 lg:mt-0 lg:pl-0"
      >
        {row.body}
      </p>
    </article>
  );
}
