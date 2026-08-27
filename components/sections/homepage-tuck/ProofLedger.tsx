"use client";

import type { ReactNode } from "react";

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

// Las seis pruebas de NEAR leídas como un balance: seis asientos, la cifra de
// cada uno alineada contra un eje y su argumento a la derecha, separados por
// un punteado.
//
// Reemplaza a `homepage-shared/ProofDatum` SOLO en esta ruta. Aquella versión
// —un eje horizontal con seis fichas alternadas arriba y abajo— sigue viva y
// montada en `homepage-b`; acá se cambia la estructura, no el dato.
//
// ── El eje es la sección ────────────────────────────────────────────────────
//
// Las seis cifras terminan sobre una misma vertical invisible al 49% del
// bloque. No hay línea dibujada ahí, y no hace falta: seis renglones que
// terminan en el mismo punto CREAN la vertical, y esa vertical es lo que
// convierte a seis datos sueltos en una serie que se lee de arriba abajo.
//
// Alineadas a la izquierda —como en la versión anterior de esta misma
// sección— «100%» y «$24+» arrancan juntas y terminan donde les toca, así que
// cada renglón parece de un ancho distinto y la comparación entre pruebas se
// pierde. Contra un eje, lo único que varía es cuánto se extiende cada cifra
// hacia la izquierda, que es exactamente lo que un balance quiere mostrar.
//
// ── La cifra es UNA línea ───────────────────────────────────────────────────
//
// Numeral, signo y palabra sobre la misma base y terminando en el mismo eje:
// «100 % uptime», «1.0 Million TPS», «$24 + Billion». Todo en sans, todo del
// mismo color, y lo que sigue al numeral a 0.575 de su cuerpo.
//
// ── Estuvo en dos renglones, y volvió ─────────────────────────────────────
//
// Vale saber por qué, porque el intento anterior era razonable: en una línea la
// cifra crecía hacia la derecha hasta chocar con el cuerpo, así que el numeral
// tenía que achicarse para que entrara la palabra; apiladas, las dos podían ser
// grandes. Lo que ese razonamiento daba por sentado es que el numeral TENÍA que
// ser grande.
//
// El artboard dice que no. Con el numeral a 8cqw en vez de 12.5 la frase entera
// entra en el 49%, y lo que se gana es más que lo que se pierde: seis renglones
// de una línea se leen como una tabla —el ojo baja por el eje y compara—
// mientras que seis bloques de dos líneas se leen como seis fichas. La
// comparación entre pruebas es todo lo que esta sección hace.
//
// Con eso desapareció también el reparto por `id` que la prueba de TPS
// necesitaba para partir «million TPS» entre los dos renglones: en una línea la
// copy se usa tal cual sale del módulo.
//
// ── El rótulo pasó a ser píldora, y cambió de dueño ────────────────────────
//
// Antes «Built to last» era una línea suelta ARRIBA del numeral, o sea que se
// leía como su antetítulo: parte de la cifra. Ahora es una etiqueta con borde
// que encabeza el PÁRRAFO de la derecha, que es lo que de verdad clasifica —
// «Built to last» es el título del argumento, no del número.
//
// ── Las seis van en una sola lista ──────────────────────────────────────────
//
// Cuatro de las pruebas son NÚMEROS y dos son CUALIDADES (quantum-ready,
// confidential). La versión anterior las separaba: las dos últimas cerraban en
// pareja, a media caja, porque el renglón de cifra medía una pantalla entera y
// meterlas en él las habría hecho fingir que tenían número.
//
// Con el asiento de dos columnas esa separación dejó de hacer falta. Una prueba
// sin cifra entra sin disfrazarse: pone una palabra donde las otras ponen un
// número, casi al mismo cuerpo —ver el `em` de su `data-gloss`— y el punteado
// la separa igual que a todas. Que las seis compartan eje es lo que
// las hace una sola serie.
//
// ── La proporción es el diseño, y por eso todo mide en `cqw` ───────────────
//
// El artboard fija relaciones, no píxeles: el eje al 49% del bloque, la cifra
// a 8cqw, lo que la sigue a 0.575 de la cifra. Escritas en `vw` esas relaciones
// aguantan hasta que el `Container` topa en su `max-width` (1780px) y el texto
// sigue creciendo — de ahí para arriba el renglón se descompone.
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
// La retícula de dos columnas no cabe a 375px, así que abajo de `lg` el
// argumento baja debajo de la cifra. Y el EJE SE CAE con ella: con una sola
// columna, alinear a la derecha deja el numeral pegado al borde de la pantalla
// y la píldora arrancando en el otro. Lo que sobrevive del diseño es el
// punteado, que es lo que sigue diciendo que esto es una lista de pruebas y no
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
 *   1. el FILETE punteado se traza de izquierda a derecha — la estructura
 *      llega primero, y lo demás aterriza sobre algo que ya está. El primer
 *      asiento no lo tiene: arriba de él no hay nada que separar;
 *   2. la CIFRA cuenta desde 0 hasta su valor y, EN EL MISMO TRAMO, entran el
 *      eyebrow y el signo. Van con ella a propósito: la cifra sola contando es
 *      un widget, la cifra contando mientras se escribe lo que la califica es
 *      un renglón que se arma. El signo va acá y no con la glosa porque
 *      pertenece al número —"100 por ciento", "24 más"— y no a lo que se
 *      cuenta;
 *   3. al 70% de la cuenta se escribe la GLOSA: la palabra que dice qué se
 *      estuvo contando. La cifra sube sin nombre y la palabra la cierra;
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
 * Los números de abajo son las PROPORCIONES de la secuencia —cuánto dura el
 * filete contra la cuenta, dónde cae el cuerpo dentro de ella— y son lo que hay
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

/** Cuánto tarda el filete en cruzar el ancho del renglón. */
const RULE = 0.8;

/**
 * Cuándo arranca la cifra.
 *
 * Menor que `RULE` a propósito: el filete todavía se está trazando cuando el numeral
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

        /* 1 · el filete */
        const rule = row.querySelector<HTMLElement>("[data-rule]");
        // Es un `<span>` posicionado y no el `border-t` del artículo porque un
        // borde no se puede escalar: `scaleX` sobre el artículo arrastraría al
        // texto con él.
        //
        // `scaleX` y no `scaleY`: el filete dejó de ser la plica vertical de la
        // que colgaba el renglón y pasó a ser el punteado horizontal que lo
        // separa del anterior. Se dibuja de izquierda a derecha, que es la
        // dirección en la que se lee la fila que abre.
        //
        // El primer renglón no lo tiene —arriba de él no hay nada que separar—
        // así que el `if` no es defensivo: es la mitad de los casos.
        if (rule)
          tl.from(rule, { scaleX: 0, duration: RULE, ease: "power2.out" }, 0);

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
      className="bg-cream py-28 text-ink lg:py-36"
    >
      <Container>
        {/* El contenedor de consulta. Todo lo que mide en `cqw` acá abajo
            resuelve contra el ancho de ESTE div; sin él, contra el viewport. */}
        <div className="@container">
          {/* Las seis en UNA lista y no cuatro más dos. En la versión anterior
              las dos cualidades cerraban aparte, en pareja y a media caja,
              porque el renglón de cifra medía una pantalla y meterlas en él las
              habría hecho fingir que tenían número.

              Acá el renglón es un asiento con dos columnas fijas y la cifra
              ocupa la izquierda, así que una prueba SIN cifra entra sin
              disfrazarse: pone una palabra donde las otras ponen un número, al
              cuerpo que le corresponde, y el punteado la separa igual que a
              todas. Que las seis compartan el mismo eje es lo que hace que se
              lean como una sola serie. */}
          <div className="flex flex-col">
            {LEDGER_ROWS.map((row, i) => (
              <FigureLine key={row.id} row={row} first={i === 0} />
            ))}

            {LEDGER_NOTES.map((note) => (
              <RegisterRow
                key={note.id}
                eyebrow={note.eyebrow}
                body={note.body}
                figure={
                  // Sin cifra, la palabra ocupa su lugar — y por eso hereda su
                  // escala en vez de tener una propia. El `em` es relativo al
                  // `text-ledger` del padre, así que el día que el numeral
                  // cambie de tamaño estas dos se mueven con él: la proporción
                  // entre una cifra y una cualidad no puede quedar escrita en
                  // dos lugares.
                  //
                  // 0.9 y no 1 porque «Quantum-ready» tiene trece caracteres:
                  // al cuerpo exacto del numeral se sale del eje. Era 0.56
                  // cuando el numeral medía 12.5cqw y ocupaba dos renglones;
                  // con el numeral en 8cqw y el renglón en una línea, la
                  // cualidad puede ir casi a la par — que es como se lee en el
                  // artboard, donde «Quantum-ready» pesa lo mismo que «30».
                  <p
                    data-figure
                    className="text-ledger flex flex-col items-start lg:items-end"
                  >
                    <span data-gloss className="text-[0.9em]">
                      {note.gloss}
                    </span>
                  </p>
                }
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * El filete punteado que abre cada asiento.
 *
 * Un `<span>` absoluto y no el `border-t` del artículo porque tiene que
 * dibujarse al entrar, y un borde no se escala sin arrastrar al texto.
 *
 * Es punteado y no continuo: una línea llena separa dos bloques —dice «acá
 * termina uno y empieza otro»—, y estas seis pruebas son UNA serie. El punteado
 * marca el renglón sin cortar la columna.
 */
function Rule() {
  return (
    <span
      data-rule
      aria-hidden="true"
      className="absolute inset-x-0 top-0 origin-left border-t border-dotted border-ink/30"
    />
  );
}

/**
 * El asiento: dos columnas, la cifra contra un eje y el cargo a su derecha.
 *
 * ── El eje ──────────────────────────────────────────────────────────────────
 *
 * Las seis cifras están alineadas a la DERECHA de la primera columna, así que
 * sus últimos caracteres caen sobre una misma vertical invisible al 49% del
 * bloque. Es lo que convierte a las seis en una serie: alineadas a la
 * izquierda, «100%» y «$24+» arrancan juntas y terminan en cualquier lado, y
 * cada renglón parece de un ancho distinto. Contra un eje, lo único que varía
 * es cuánto se extiende cada cifra hacia la izquierda — que es exactamente la
 * información que un balance quiere dar.
 *
 * En móvil el eje se cae y las cifras vuelven a la izquierda: con una columna
 * sola, alinear a la derecha deja el numeral pegado al borde de la pantalla y
 * el cuerpo arrancando en el otro.
 *
 * ── El aire vertical es `items-center` ──────────────────────────────────────
 *
 * La columna de la izquierda mide UN renglón de titular; la derecha, una
 * píldora y dos líneas de cuerpo, o sea más alto. Centrarlas es lo que hace que
 * el asiento se lea como una unidad: alineadas arriba, la cifra queda colgando
 * del borde y debajo de ella se abre un hueco del alto del párrafo.
 */
function RegisterRow({
  figure,
  eyebrow,
  body,
  first = false,
}: {
  figure: ReactNode;
  eyebrow: string;
  body: string;
  first?: boolean;
}) {
  return (
    <article
      data-row
      // `relative` para el filete, que es un hijo absoluto y no un borde.
      // El `py` subió de 3.4 a 5.6cqw cuando la cifra pasó a una sola línea.
      // No es más aire: es EL MISMO paso entre filetes que antes daban el
      // padding más el segundo renglón. El artboard pone las punteadas cada
      // ~19.5cqw, y con el renglón midiendo 8, lo que queda para repartir arriba
      // y abajo son esos 5.6 — bajarlo apretaría la serie contra sí misma.
      className="relative grid gap-7 py-12 lg:grid-cols-[minmax(0,49%)_minmax(0,1fr)] lg:items-center lg:gap-x-[5.8%] lg:py-[5.6cqw]"
    >
      {first ? null : <Rule />}

      {figure}

      <div className="flex flex-col items-start gap-4 lg:gap-[1.2cqw]">
        {/* La píldora. El rótulo dejó de ser una línea suelta arriba del
            numeral y pasó a ser una etiqueta con borde, y el cambio no es
            decorativo: arriba del numeral el rótulo se leía como su antetítulo
            —parte de la cifra— y acá encabeza el PÁRRAFO, que es lo que de
            verdad clasifica. «Built to last» es el título del argumento, no del
            número.

            `w-fit` para que la píldora mida el texto y no la columna: a ancho
            completo dejaría de ser una etiqueta para ser una barra. */}
        <p
          data-eyebrow
          className="text-body-sm w-fit rounded-full border border-ink/40 px-4 py-1.5"
        >
          {eyebrow}
        </p>

        {/* El `mb` no es aire suelto: el asiento va `items-center`, así que un
            margen abajo del párrafo SUBE el bloque entero contra la cifra. Es
            lo que hace el artboard — la píldora arranca un poco por encima del
            tope del numeral en vez de quedar clavada a su mitad.

            En `cqw` como todo lo demás de la sección, para que se mueva con el
            bloque y no con el viewport. */}
        <p
          data-body
          className="text-body-sm mb-2 max-w-[64ch] text-ink-soft text-pretty lg:mb-[0.7cqw]"
        >
          {body}
        </p>
      </div>
    </article>
  );
}

function FigureLine({ row, first }: { row: LedgerRow; first: boolean }) {
  return (
    <RegisterRow
      first={first}
      eyebrow={row.eyebrow}
      body={row.body}
      figure={
        <p
          data-figure
          // `items-baseline`: el numeral y lo que lo sigue comparten la línea de
          // base, no la caja. Con `items-center` o `items-end` el `%` y la
          // palabra —que miden 0.575 del numeral— quedan flotando a media altura
          // o colgando por debajo de los dígitos; sobre la base se leen como una
          // sola frase, que es lo que son.
          //
          // `flex-wrap` es la red: «$24 + Billion» al cuerpo del numeral entra
          // justo en el 49%, y una fuente de respaldo un poco más ancha lo
          // desbordaría. Envuelto se ve apretado; sin envolver, roto.
          className="text-ledger flex flex-wrap items-baseline gap-x-[0.22em] lg:justify-end lg:text-right"
        >
          <span
            // `data-count` lleva el VALOR y no es una bandera: es a la vez el
            // selector que encuentra el motor y el destino de la cuenta.
            //
            // Los tres datos viajan en el DOM y no en un closure, y eso es lo
            // que deja que el motor de la entrada sea UNO para los seis
            // renglones: recorre `[data-row]` sin saber nada de la copy, y cada
            // renglón le dice desde su propio markup hasta dónde contar y cómo
            // escribirlo.
            data-count={row.value}
            data-decimals={row.decimals}
            data-prefix={row.prefix ?? ""}
          >
            {formatLedgerValue(row)}
          </span>

          {/* El signo y la palabra: dos elementos porque entran en tiempos
              distintos —el signo con la cuenta, la palabra al 70% de ella— pero
              UN solo cuerpo, `text-gloss`, porque en la línea son un solo gesto.

              Fueron dos tamaños mientras la composición tuvo dos renglones: el
              signo medía en `em` del numeral y se quedaba pegado a él, la
              palabra se iba abajo en serif. Con todo en una línea esa distinción
              no tiene dónde apoyarse. */}
          {row.unit ? (
            <span data-unit className="text-gloss">
              {row.unit}
            </span>
          ) : null}

          <span data-gloss className="text-gloss">
            {row.gloss}
          </span>
        </p>
      }
    />
  );
}
