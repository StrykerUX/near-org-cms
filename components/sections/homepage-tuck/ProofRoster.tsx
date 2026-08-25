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
} from "@/components/sections/homepage-tuck/proofLedgerContent";

// Las seis pruebas como un índice de capacidades: «Built to» + la palabra, y la
// cifra escondida hasta que alguien la busca.
//
// Es la versión de `/prototype/homepage-d`, y el contraste con `ProofLedger`
// —la de `homepage-c`, misma copy— es el punto entero de que las dos existan.
//
// ── La cifra deja de ser el titular ─────────────────────────────────────────
//
// En el ledger el número ES la estructura del renglón: mide 14cqw, ocupa media
// pantalla y lo primero que se lee de cada prueba es «100». Acá el número no se
// ve. Lo que se lee es un verbo —Last, Scale, Connect, Reach, Resist, Privacy—
// y la cifra aparece recién al pasar por encima.
//
// El cambio es de argumento, no de acomodo. El ledger dice «mirá estos seis
// números»; el índice dice «esto es lo que NEAR hace» y guarda el número como
// la PRUEBA de esa afirmación, disponible para quien la pida. Una lista de seis
// verbos se recorre en dos segundos; seis cifras gigantes, no.
//
// El precio está declarado y es serio: **la cifra en hover no existe para
// quien no tiene mouse**. Por eso abajo de `lg` se muestra siempre, en flujo, y
// por eso el cuerpo de la derecha —que dice el mismo dato en palabras— nunca se
// esconde. La cifra es un refuerzo, nunca la única vía al dato.
//
// ── De dónde salen las palabras ─────────────────────────────────────────────
//
// De partir el `eyebrow` de la copy por su último espacio: «Built to last» da
// «Built to» + «last». No hay un campo nuevo y no hay una segunda lista de seis
// palabras que mantener sincronizada con la primera — que es lo que pasaría el
// día que alguien corrija un eyebrow y se olvide de su gemelo.
//
// La partición es segura porque los seis eyebrows tienen la misma forma
// (`Built to <verbo>`), y si algún día uno deja de tenerla el renglón sigue
// funcionando: el prefijo queda más largo y la palabra sigue siendo la última.
// Lo único que no sobrevive es un eyebrow de una sola palabra, y ahí la caída
// es a prefijo vacío — no a un renglón roto.
//
// ── El fondo es claro, y no como la referencia ─────────────────────────────
//
// La referencia de la que sale esta composición es un tramo oscuro, y la
// primera versión lo copió. Está en crema por dos motivos, y ninguno es de
// gusto:
//
// **El stack.** Esta sección cae inmediatamente después, y el stack termina
// cerrando su caja negra sobre el papel de la página. Con la sección en negro,
// esa caja se cierra contra un fondo que ya es negro y el gesto —que es la
// mitad de lo que la ruta propone— se queda sin el contraste que lo hace
// visible. En crema el cierre se lee entero.
//
// **La comparación.** `homepage-d` existe para medirse contra `homepage-c`, que
// tiene esta misma sección en crema. Cambiar el fondo A LA VEZ que la
// estructura habría dejado dos variables moviéndose juntas: cualquier
// preferencia entre las dos rutas se explicaría por el tono tanto como por la
// composición, y no habría forma de saber cuál pesó. Con las dos en papel, lo
// único que cambia es cómo se organiza la prueba.
//
// Lo que se pierde es el contraste de la referencia, donde la serif recortada
// contra negro pesa más. Se compensa con el master DISPLAY de Kepler —astas
// finas, contraste alto— que es lo que le da presencia a la palabra sobre papel
// sin necesidad de invertir la página. Ver `serif-roster` en app/globals.css.

/** El texto que aparece al pasar por encima: la cifra completa, en una línea. */
function proofOf(row: (typeof LEDGER_ROWS)[number]) {
  return `${formatLedgerValue(row)}${row.unit} ${row.gloss}`;
}

/** «Built to last» → `["Built to", "Last"]`. Ver la nota de la cabecera. */
function splitEyebrow(eyebrow: string): [string, string] {
  const at = eyebrow.lastIndexOf(" ");
  if (at === -1) return ["", eyebrow];
  const word = eyebrow.slice(at + 1);
  return [eyebrow.slice(0, at), word.charAt(0).toUpperCase() + word.slice(1)];
}

type RosterEntry = { id: string; eyebrow: string; body: string; proof: string };

const ENTRIES: readonly RosterEntry[] = [
  ...LEDGER_ROWS.map((row) => ({
    id: row.id,
    eyebrow: row.eyebrow,
    body: row.body,
    proof: proofOf(row),
  })),
  // Las dos sin cifra entran a la MISMA lista y no aparte, que es lo contrario
  // de lo que hacía la versión anterior del ledger. Acá pueden: lo que el
  // renglón muestra es un verbo, y las seis pruebas tienen uno. Lo que aparece
  // al pasar por encima es lo único que cambia — una cifra en cuatro, una
  // cualidad en dos.
  ...LEDGER_NOTES.map((note) => ({
    id: note.id,
    eyebrow: note.eyebrow,
    body: note.body,
    proof: note.gloss,
  })),
];

/* ── La entrada ───────────────────────────────────────────────────────────────
 *
 * Es la MISMA gramática que `ProofLedger` en `homepage-c`, y lo es a propósito:
 * las dos rutas son la misma página con esta sección cambiada, así que si una
 * entra de otra manera la comparación empieza a medir el movimiento además de
 * la composición.
 *
 * De ahí salen las tres decisiones, que están explicadas largo allá:
 *
 *   · **Un trigger por renglón, no uno para la sección.** La sección mide más
 *     de una pantalla: con un solo trigger, los últimos renglones terminan de
 *     animarse antes de que nadie llegue a verlos.
 *   · **Dentro del renglón es una SECUENCIA, no un escalonado.** El filete
 *     primero —la estructura llega antes que lo que se apoya en ella—, después
 *     el rótulo, después el verbo, y el cuerpo cuando el verbo ya está.
 *   · **No se gasta.** Cada renglón se rearma al volver a entrar por abajo, y
 *     eso son DOS triggers y no uno: el que reproduce dispara en `START`, el que
 *     rebobina espera a que el renglón salga ENTERO de cuadro (`top bottom`).
 *     Con el rebobinado colgado del primero, el renglón se apagaba delante de
 *     quien estaba subiendo.
 *
 * ── Lo único que NO se anima ────────────────────────────────────────────────
 *
 * La cifra de hover. Y no es un olvido: su visibilidad la gobiernan dos clases
 * (`lg:opacity-0` / `lg:group-hover:opacity-100`), y un `autoAlpha` de GSAP
 * escribe `opacity` INLINE, que le gana a cualquier clase. La cifra quedaría
 * encendida para siempre y el hover dejaría de existir, sin error.
 *
 * Por eso el verbo se anima en su `<span>` y no en el `<p>` que los contiene a
 * los dos: la opacidad de un padre multiplica a la de sus hijos, así que animar
 * el párrafo arrastraría a la cifra igual.
 */

/** Cuánto más rápido corre todo. Mismo valor que `ProofLedger`. */
const SPEED = 1.5;

/** Dónde entra cada renglón. Mismo punto que `ProofLedger`. */
const START = "top 88%";

/**
 * Lo que tarda el filete en cruzar el ancho del renglón.
 *
 * Es lo más largo de la secuencia y con diferencia, y esa es la idea: el filete
 * cruza casi 1500px y todo lo demás recorre unas decenas. A la misma duración,
 * la línea se lee como un destello y las palabras como un gesto — que es
 * exactamente al revés de lo que la sección quiere decir.
 *
 * Ojo con leer este número solo: el timeline corre a `SPEED`, así que 1.6 acá
 * son 1.07 segundos de reloj.
 */
const RULE = 1.6;


/**
 * Los tres desfases de la secuencia, en la misma unidad que `RULE`.
 *
 * El rótulo entra con el filete todavía trazándose —son las dos piezas de
 * estructura del renglón y llegan juntas— y el verbo espera a que el trazo haya
 * pasado de largo: es lo que la fila viene a decir, y entrando antes se lo dice
 * a un renglón que todavía se está dibujando.
 *
 * Los tres se movieron cuando el filete pasó de 0.8 a 1.25. Están escritos como
 * posiciones absolutas y no como `"-=0.2"` justamente para esto: leídos así se
 * ve de un vistazo dónde cae cada pieza dentro del trazo, y recalibrar es mover
 * tres números que se comparan entre sí. En relativo habría que simular la
 * secuencia en la cabeza para saber en qué momento entra cada cosa.
 *
 * El cuerpo cae en el último tercio del verbo. Ahí el `power3.out` ya frenó y
 * hay lugar para que entre otra cosa sin competirle; más tarde, el renglón se
 * parte en dos actos con un silencio en medio.
 */
const PREFIX_AT = 0.28;
const WORD_AT = 0.62;
const BODY_AT = 1.15;

/** Entre letra y letra del rótulo. El verbo usa un múltiplo — ver su paso. */
const CHAR = 0.024;

export default function ProofRoster() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const rows = q("[data-row]");
    if (rows.length === 0) return;

    const timelines: gsap.core.Timeline[] = [];
    const resets: ScrollTrigger[] = [];
    let splits: SplitText[] = [];
    let cancelled = false;

    // El split espera a que las fuentes midan. Partir por LÍNEAS es geometría
    // de fuente —dónde cae cada quiebre depende de la métrica real— y con la
    // de respaldo cada línea queda envuelta en un contenedor del ancho
    // equivocado, así que el reflow deja el bloque roto.
    const build = () => {
      if (cancelled || timelines.length) return;

      rows.forEach((row) => {
        const tl = gsap.timeline({
          defaults: { ease: EASE_OUT },
          scrollTrigger: {
            trigger: row,
            start: START,
            // Este trigger SOLO reproduce; el rebobinado vive en el suyo.
            toggleActions: "play none none none",
            markers: DEBUG_MARKERS,
          },
        });
        tl.timeScale(SPEED);
        timelines.push(tl);

        resets.push(
          ScrollTrigger.create({
            trigger: row,
            start: "top bottom",
            onLeaveBack: () => tl.pause(0),
            markers: DEBUG_MARKERS,
          }),
        );

        /* 1 · el filete, de izquierda a derecha */
        const rule = row.querySelector<HTMLElement>("[data-rule]");
        // El último renglón no lleva —las líneas separan, no encierran— así que
        // el `if` no es defensivo: es uno de cada seis.
        if (rule) {
          // `power2.out`, y la cuarta potencia se probó y se descartó: sobre
          // un recorrido de 1500px, `power4.out` mete el 90% del avance en los
          // primeros dos décimos y el resto lo repta. Eso no se lee como un
          // trazo largo, se lee como una línea que apareció de golpe y después
          // se quedó quieta — o sea, no se lee.
          //
          // La segunda potencia reparte el recorrido de forma que la punta se
          // ve avanzar durante la mayor parte del segundo que dura. Es más
          // lenta que la primera versión (1.07s contra 0.53) y esa es toda la
          // diferencia entre «hay una línea» y «se está dibujando una línea».
          //
          // Va desde el borde IZQUIERDO (`origin-left` en la clase) porque es
          // la dirección en que se lee el renglón que abre. Desde el centro
          // sería un gesto simétrico, y una lista no lo es.
          //
          // Y es SOLO el trazo: nada de fundido. Una línea que además se
          // enciende tiene dos cosas ocurriendo a la vez y deja de leerse como
          // un trazo — se lee como algo que aparece. Lo único que la línea hace
          // es crecer, y por eso se ve como una sola mano cruzando el renglón.
          tl.from(rule, { scaleX: 0, duration: RULE, ease: "power2.out" }, 0);
        }

        /* 2 · el rótulo, letra por letra */
        const prefix = row.querySelector<HTMLElement>("[data-prefix]");
        if (prefix) {
          const s = SplitText.create(prefix, { type: "chars" });
          splits.push(s);
          gsap.set(s.chars, { autoAlpha: 0, y: 8 });
          tl.to(
            s.chars,
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: CHAR },
            PREFIX_AT,
          );
        }

        /* 3 · el verbo, letra por letra */
        const word = row.querySelector<HTMLElement>("[data-word]");
        if (word) {
          // La MISMA gramática que el rótulo: partir en caracteres, encender y
          // subir un poco, escalonado. Las dos piezas de texto del renglón
          // entran igual, y eso es lo que hace que se lean como un solo gesto en
          // vez de como dos animaciones que coinciden.
          //
          // Los dos valores que no se copian son los que dependen del cuerpo:
          //
          //   · El `y` va en `em` y no en píxeles. El rótulo mide 12px y el
          //     verbo 88, así que los 8px que en uno son un empujón en el otro
          //     no se ven. En `em` el desplazamiento es el mismo GESTO a los dos
          //     tamaños, que es lo que se quiere copiar.
          //   · El stagger es más ancho porque las letras son más anchas: al
          //     ritmo del rótulo, siete letras de 88px se encienden casi juntas
          //     y el escalonado se pierde. Mismo criterio —y misma proporción—
          //     que la glosa de `ProofLedger`.
          //
          // Sin máscara, y por eso ya no hay nada que pueda recortar los
          // voladizos de la itálica. La caja de línea de `serif-roster` sigue
          // siendo 1.3 igual: el desbordamiento de Kepler contra `--text-h1`
          // existe con o sin animación, y la máscara solo lo hizo visible.
          const s = SplitText.create(word, { type: "chars" });
          splits.push(s);
          gsap.set(s.chars, { autoAlpha: 0, y: "0.14em" });
          tl.to(
            s.chars,
            { autoAlpha: 1, y: 0, duration: 0.55, stagger: CHAR * 1.6 },
            WORD_AT,
          );
        }

        /* 4 · el cuerpo, renglón por renglón */
        const body = row.querySelector<HTMLElement>("[data-body]");
        if (body) {
          const s = SplitText.create(body, { type: "lines", mask: "lines" });
          splits.push(s);
          gsap.set(s.lines, { autoAlpha: 0, yPercent: 100 });
          tl.to(
            s.lines,
            { autoAlpha: 1, yPercent: 0, duration: 0.6, stagger: 0.09 },
            BODY_AT,
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
    };
  }, []);

  return (
    <section ref={rootRef} className="bg-cream py-28 text-ink lg:py-36">
      <Container>
        {/* Sin filete arriba del primer renglón ni debajo del último: las líneas
            SEPARAN, no encierran. Con las dos puntas dibujadas la lista se lee
            como una tabla con marco —un objeto cerrado apoyado en la página— y
            lo que se quiere es que los seis renglones sean parte del papel. Son
            cinco líneas para seis renglones, que es exactamente cuántas
            separaciones hay.

            El que no lo lleva es el PRIMERO, y cada filete abre el renglón que
            lo sigue. Por qué no es lo mismo que ponerlo abajo del último está
            en `Rule`, y no es una cuestión de gusto: es lo que hace que el
            trazo ocurra dentro del viewport. */}
        <ul>
          {ENTRIES.map((entry, i) => {
            const [prefix, word] = splitEyebrow(entry.eyebrow);

            return (
              <li
                key={entry.id}
                data-row
                // `relative` para el filete, que es un hijo absoluto y no un
                // borde: un borde no se puede escalar sin arrastrar al texto.
                className="group relative grid items-center gap-x-8 gap-y-4 py-8 lg:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,24rem)] lg:gap-x-12 lg:py-9"
              >
                {i === 0 ? null : <Rule />}

                <p data-prefix className="text-caption-mono uppercase text-ink/45">
                  {prefix}
                </p>

                {/* `relative` + `w-fit`: la cifra cuelga del BORDE DERECHO de la
                    palabra, no de la columna. Colgada de la columna quedaría a
                    la misma distancia para «Last» que para «Confidential», y el
                    gesto se lee como algo que sale de la palabra.

                    La serif va en un `<span>` alrededor de la PALABRA y no en
                    el párrafo, aunque el párrafo no contenga nada más. Son dos
                    motivos y los dos muerden:

                    · Los tokens `--text-*` de la escala declaran cuerpo,
                      interlineado, tracking y peso, pero NO familia — así que un
                      `text-proof` dentro de un párrafo en serif sale en serif,
                      sin error y sin aviso.
                    · La entrada anima el verbo, y la opacidad de un padre
                      multiplica a la de sus hijos: animando el párrafo, la cifra
                      de hover se iría con él. */}
                <p className="relative w-fit">
                  <span data-word className="serif-roster">
                    {word}
                  </span>
                  <span
                    aria-hidden="true"
                    // Va en SANS y con su propio token, `--text-proof`: un
                    // cuerpo entre h3 y h2, y peso 400 en vez del 500 de la
                    // escala. No es un pie de la palabra —es la prueba de lo
                    // que la palabra afirma— y a cuerpo de nota al pie se leía
                    // como una aclaración opcional.
                    //
                    // El peso es la mitad del rol y por eso vive en el DS y no
                    // como un parche acá: al lado de una Kepler itálica, que es
                    // de contraste alto y aire ligero, una sans de palo grueso
                    // se lee como de otra página. El razonamiento largo está en
                    // el token, en app/globals.css.
                    //
                    // En sans y no en la serif del verbo porque son dos voces
                    // distintas —una afirma, la otra mide— y compartir familia
                    // las fundiría en una sola frase.
                    //
                    // El aire que las separa es grande por lo mismo, y llegó a
                    // `ml-24` en tres pasadas: a 32px las dos se leían como una
                    // frase con una palabra en cursiva, y a 56 todavía. 96px es
                    // algo más de un `em` del verbo — la distancia a la que dejan
                    // de ser un renglón y pasan a ser dos cosas puestas una al
                    // lado de la otra. La columna da de sobra: el verbo más largo
                    // («Connect») ocupa menos de un tercio de su celda.
                    //
                    // Va centrada contra la ALTURA de la palabra (`top-1/2` +
                    // `-translate-y-1/2`) y no apoyada en su línea de base.
                    // Sobre la base las dos se leen como una sola frase en dos
                    // familias, y no lo son. Centrada, la cifra queda al lado en
                    // vez de a continuación.
                    //
                    // El desplazamiento de entrada es solo horizontal, así que
                    // `-translate-y-1/2` está en los DOS estados: si estuviera
                    // solo en uno, el tween de `transform` movería la cifra en
                    // diagonal en vez de deslizarla.
                    //
                    // Visible SIEMPRE abajo de `lg` —donde no hay hover— y en
                    // flujo, debajo de la palabra. De `lg` para arriba se
                    // esconde, se vuelve absoluta y aparece al pasar por
                    // encima. Las dos clases van literales y no armadas con un
                    // template: Tailwind escanea el fuente y `lg:` + `opacity-0`
                    // en dos pedazos no es una clase que pueda emitir.
                    className="text-proof mt-4 block text-ink/70 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none lg:absolute lg:left-full lg:top-1/2 lg:ml-24 lg:mt-0 lg:-translate-y-1/2 lg:translate-x-[-0.8rem] lg:whitespace-nowrap lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100"
                  >
                    {entry.proof}
                  </span>
                </p>

                <p data-body className="text-body-sm text-ink-soft text-pretty">
                  {entry.body}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/**
 * El filete que ABRE cada renglón.
 *
 * Un `<span>` absoluto y no el `border-t` del `<li>` porque tiene que trazarse
 * de izquierda a derecha al entrar, y un borde no se escala sin arrastrar al
 * contenido de su caja.
 *
 * ── Por qué va arriba y no abajo, que es lo que parecía dar igual ──────────
 *
 * Visualmente da exactamente lo mismo: cinco líneas entre seis renglones, en
 * las mismas cinco posiciones. Lo que cambia es CUÁNDO se traza cada una, y ahí
 * la diferencia es entre verla y no verla.
 *
 * El trigger del renglón dispara en `top 88%`: cuando su borde superior llega a
 * tres cuartos largos del viewport. Con el filete abajo, en ese instante el
 * borde inferior del renglón está por DEBAJO del borde de la pantalla —el
 * renglón mide unos 200px y el umbral deja apenas 96 de margen—, así que el
 * trazo entero ocurría fuera de cuadro y para cuando el filete entraba ya
 * estaba completo. La animación corría perfecto y no la veía nadie.
 *
 * Arriba, el filete ESTÁ en el punto que dispara el trigger: se traza
 * exactamente donde el ojo lo tiene. Es la misma razón por la que `ProofLedger`
 * lo lleva arriba, y ahí se ve desde el primer día.
 *
 * El que se queda sin filete pasa a ser el PRIMERO en vez del último, y es lo
 * mismo por el otro lado: las líneas separan, no encierran.
 */
function Rule() {
  return (
    <span
      data-rule
      aria-hidden="true"
      className="absolute inset-x-0 top-0 origin-left border-t border-ink/15"
    />
  );
}
