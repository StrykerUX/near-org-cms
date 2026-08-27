"use client";


import Image from "next/image";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { AGENT_ECONOMY as COPY } from "@/components/sections/homepage-shared/homepageUpdateContent";

// El statement, como sección PROPIA y siempre re-legible.
//
// En `homepage-shared` (y en la línea viva) esta frase vive dentro de la secuencia
// congelada del hero (`AgentEconomy`): el hero dispara, el scroll se traba ~2.2s
// y el icono viaja hasta el texto. Acá esa secuencia no existe — el hero tiene
// su propio gesto (`HeroFold`) y no le entrega nada a nadie— así que el
// statement necesita ser una sección que se sostenga sola.
//
// ── El texto se ENCIENDE, no entra ─────────────────────────────────────────
//
// La frase está siempre en su sitio y lo único que cambia es su opacidad:
// arranca tenue y se rellena palabra por palabra AL RITMO DEL SCROLL. No es una
// entrada —no ocurre y se acaba— sino un estado atado a la posición, y por eso
// va con `scrub` y no con `once`. Subir la deshace; bajar la vuelve a hacer.
//
// Reemplaza a una entrada por líneas con máscara (`autoAlpha` + `yPercent`,
// `once: true`) que sí ocurría una vez y se gastaba.
//
// **Es OPACIDAD y no color**, que es la otra forma de hacer esto. Los dos
// tramos en acento no tienen color propio: son `text-transparent` con un
// degradé recortado por `bg-clip-text`, así que un tween sobre `color` no los
// tocaría y la frase se encendería con dos agujeros verdes ya a pleno. La
// opacidad atenúa las dos voces por igual.
//
// **Y por LETRAS.** Con líneas el relleno avanza a saltos de renglón —seis
// pasos para seis líneas— y se lee como seis bloques que se prenden. Con
// palabras ya se lee, pero el frente de avance sigue siendo escalonado: la
// palabra entera cambia de golpe. Carácter por carácter el frente es continuo,
// que es lo que hace que parezca que algo se está RELLENANDO en vez de
// encendiéndose por partes.
//
// Sin JS o con `prefers-reduced-motion` la frase está entera y a pleno: la
// opacidad tenue la aplica el tween, no el CSS. Es la misma degradación que
// documenta `useScrollReveal` y por el mismo motivo — con el estado tenue en
// una clase, un fallo de JS dejaría la sección medio invisible para siempre.
//
// ⚠️ Lo que hay que mirar en el navegador es cómo se atenúa el ACENTO. SplitText
// envuelve cada palabra en un span, y el degradé de `<Accented>` se recorta
// contra el texto de todos sus descendientes: si la opacidad del span no llega
// a atenuarlo, el acento se ve a pleno desde el principio y los dos tramos
// verdes quedan fuera del barrido.
//
// El verde del acento es el mismo literal que en el statement vivo — hoja,
// tomado del gradiente del icono; no existe en los tokens (ver la nota de
// `AgentEconomy`).
/* ── El lockup ────────────────────────────────────────────────────────────────
 *
 * Esta sección se alineó con `homepage-shared/AgentEconomy`, que es donde la
 * frase ya tenía su forma resuelta: icono de NEAR a la izquierda anclado por
 * baseline, el cuerpo en voz corrida y UN solo acento —el que cierra— en sans
 * bold verde. Acá venía centrada, con la frase partida a mano en tres tramos y
 * DOS acentos en serif itálica.
 *
 * Lo que se fue, y por qué no vuelve:
 *
 *   · `PIVOT` / `CONNECTOR`. Partían el cuerpo para acentuar «the agent
 *     economy.» y para bajar el «and» con un `<br>`. Con la medida en `em` el
 *     reparto de líneas ya lo hace el `max-w`, y los quiebres a mano se pelean
 *     con él en cuanto cambia el copy.
 *   · El segundo acento. Dos tramos acentuados en una frase de seis líneas no
 *     marcan dos ideas, quitan énfasis al que importa: el que cierra.
 *   · La serif itálica y su corrección óptica de x-height. El acento deja de
 *     ser un cambio de VOZ y pasa a ser un cambio de PESO y color, que es lo
 *     que hace `AgentEconomy` — y con eso se van el `1.09em` y el
 *     `leading-[0.86]` que existían solo para compensarla.
 */

/**
 * La opacidad de una palabra que todavía no se leyó.
 *
 * 0.18 y no 0.3: por encima del umbral de lectura cómoda el ojo lee el párrafo
 * entero de una y el barrido deja de notarse — pasa a ser un cambio de énfasis
 * en un texto que ya se leyó. Por debajo, hay que esperar a que la palabra
 * llegue, que es el punto.
 *
 * No baja más porque el acento verde va sobre crema y arranca con menos
 * contraste que la tinta: lo que en negro al 12% todavía se intuye, en este
 * verde desaparece, y la frase quedaría con dos agujeros.
 */
const DIM = 0.18;

/**
 * El ancho del frente de avance, en letras.
 *
 * Es la duración de cada carácter contra un stagger de 1, así que se lee
 * directo: catorce letras a medio encender en cualquier instante. Es lo que
 * separa un degradado que recorre la frase de un borde duro que la cruza.
 */
const FRONT = 14;

/**
 * El tramo de scroll en el que la frase se enciende entera.
 *
 * Arranca con el bloque a tres cuartos del viewport —o sea apenas asoma— y
 * termina cuando su borde inferior pasa el medio. Es un recorrido corto a
 * propósito: la frase mide seis líneas y son el titular de su sección, no un
 * texto largo. Estirarlo hasta que el bloque salga de cuadro dejaría la última
 * palabra encendiéndose cuando el lector ya está mirando la sección siguiente.
 */
const START = "top 78%";
const END = "bottom 55%";

const PALETTE = {
  "--statement-accent": "#5cb946",
} as React.CSSProperties;

export type StatementPlainProps = {
  /**
   * Un respiro arriba de la frase. Apagado por defecto.
   *
   * La sección nació SIN aire arriba, y el porqué está escrito largo abajo, en
   * el `<section>`: en `homepage-b` lo que queda encima es el lockup del
   * pliegue sobre el mismo crema, así que un hueco propio se sumaba al del hero
   * y dejaba casi dos pantallas vacías.
   *
   * En `homepage-c` lo de arriba no es crema al aire: es la tarjeta en la que
   * el hero se guarda, con su borde. Pegada a ese borde, la frase se lee como
   * el pie de la tarjeta en vez de como la sección siguiente — y ahí el hueco
   * sí separa dos cosas distintas.
   *
   * Va como prop y no como cambio a secas porque son las DOS rutas las que
   * montan esta sección, y el aire correcto depende de con qué limita arriba.
   */
  topAir?: boolean;
};

export default function StatementPlain({ topAir = false }: StatementPlainProps = {}) {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const copy = scope.querySelector<HTMLElement>("[data-statement-copy]");
      if (!copy) return;

      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;
      let cancelled = false;

      // El split espera a que las fuentes midan y el flag cubre el cleanup que
      // corre antes de que la promesa resuelva — StrictMode lo hace en cada
      // mount de dev.
      const prepare = () => {
        if (cancelled || split) return;
        // `chars,words` y no `chars` a secas: sin los envoltorios de palabra,
        // cada carácter es su propio inline-block y el navegador puede quebrar
        // la línea DENTRO de una palabra. Con las dos capas, el quiebre vuelve
        // a caer entre palabras y las letras se animan igual.
        split = SplitText.create(copy, { type: "chars,words" });
        const chars = split.chars;

        // `gsap.set` + `.to()`, y NUNCA un `.from()`/`fromTo` con stagger.
        //
        // Éste fue el bug: un stagger dentro de un tween scrubbeado aplica el
        // estado inicial SOLO al primer elemento. El resto se queda en su valor
        // del DOM —opacidad 1— hasta que el scrub los alcanza, así que la frase
        // llegaba ya encendida salvo la primera palabra, que era lo único que
        // se veía rellenarse.
        //
        // Es la razón por la que todos los staggers del repo se escriben así
        // (ver `ProofLedger`, tres veces): el `set` toca a los N elementos de
        // una y el `to` los recorre.
        gsap.set(chars, { opacity: DIM });

        tween = gsap.to(chars, {
          opacity: 1,
          // La duración de CADA letra, contra un stagger de 1 entre una y la
          // siguiente. El cociente de los dos es lo único que hay que mirar:
          // son cuántas letras están a medio encender en un momento dado, o sea
          // el ancho del frente de avance.
          //
          // Con la duración por defecto (0.5) el frente medía media letra:
          // cada carácter pasaba de tenue a pleno de un tirón y el barrido se
          // leía como una fila de interruptores. A 14 el frente cubre unas dos
          // o tres palabras, así que en cualquier instante hay un degradado
          // recorriendo la frase en vez de un borde duro.
          //
          // No conviene subirlo mucho más: pasado el largo de una línea el
          // frente deja de leerse como un frente y la frase entera empieza a
          // subir de opacidad a la vez.
          duration: FRONT,
          // La curva es de cada letra, no del conjunto. `power1.inOut` le quita
          // las dos puntas al fundido —arranca y termina sin escalón— que es lo
          // que hace que el degradado se vea continuo y no como catorce pasos.
          ease: "power1.inOut",
          // El REPARTO de los arranques, en cambio, va lineal: es lo que sigue
          // al scroll. Con una curva acá, media frase se encendería en el
          // primer cuarto del recorrido y el resto repartiría lo que queda.
          //
          // El `each: 1` no es un segundo: dentro de un tween scrubbeado GSAP
          // normaliza la duración total, así que lo que importa es la
          // proporción contra `FRONT`.
          stagger: { each: 1, ease: "none" },
          scrollTrigger: {
            trigger: scope,
            start: START,
            end: END,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        // Si la sección YA está en cuadro cuando el split termina (recarga a
        // media página), el trigger nuevo tiene que evaluarse contra el layout
        // vigente o el texto queda a medio encender hasta el próximo scroll.
        ScrollTrigger.refresh();
      };

      if (document.fonts?.ready) document.fonts.ready.then(prepare).catch(prepare);
      else prepare();

      return () => {
        cancelled = true;
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
        gsap.set(copy, { clearProps: "opacity,visibility" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      // Sin aire arriba, y sin `min-h` con el contenido centrado dentro.
      //
      // El statement venía de `min-h-[88svh] items-center py-24`: casi una
      // pantalla de alto con la frase flotando en el medio. Eso funcionaba
      // cuando lo anterior era un hero a sangre —el aire lo separaba de la
      // imagen—, pero acá lo que queda arriba es el lockup del pliegue sobre
      // crema, o sea el MISMO fondo. Sumados el hueco de abajo del hero y este
      // de arriba, entre una cosa y la otra quedaban casi dos pantallas de
      // crema vacío, y la frase se leía como si perteneciera a otra página.
      //
      // Queda el `pb`, que sí separa: lo que sigue es `OwnYourOwn`, que trae su
      // propio encabezado.
      className={`relative overflow-hidden bg-cream pb-24 text-foreground lg:pb-32 ${
        topAir ? "pt-12 lg:pt-20" : ""
      }`}
      style={PALETTE}
    >
      <Container>
        {/* Sin `@container`: era la mitad del acuerdo con `--text-manifesto`,
            que mide su cuerpo en `cqw`. Con la frase en `text-h2` —un rol de la
            escala, medido contra el viewport— no hay nada que consultarle al
            contenedor, y dejarlo declarado invitaría a creer que algo depende
            de él. */}
        {/* El lockup: icono y frase como una sola pieza.

            `items-baseline` y no `items-center`: el glifo se apoya en la línea
            base de la primera línea, que es lo que lo hace leer como parte del
            texto y no como una viñeta al costado.

            `mx-auto w-fit` centra el CONJUNTO en el ancho del `Container` sin
            tocar la alineación interna, que se queda a la izquierda.
            `justify-center` no serviría: el `<h2>` es un flex item que se
            estira hasta sus 17em aunque la línea más larga mida menos, así que
            centraría la caja y no el texto. */}
        <div className="mx-auto flex w-fit items-baseline gap-[0.52em] text-h2">
          {/* El glifo va en NEGRO y no en el degradé lima→verde, y el asset
              vive en `public/near-icon-black.svg`: la variante negra ya no es de
              un prototipo, es la que usa la home.

              `width`/`height` son 800 porque ese es el viewBox del archivo, no
              porque se pinte a ese tamaño: Next los usa para la relación de
              aspecto, y el tamaño real lo ponen las clases en `em`.
              Desalineados con el viewBox, el `<img>` reserva una caja de
              proporción equivocada durante el layout. `unoptimized` porque el
              optimizador de Next rasteriza, y servir el SVG tal cual es lo
              único que conserva el vector. */}
          <Image
            src="/near-icon-black.svg"
            alt=""
            aria-hidden="true"
            width={800}
            height={800}
            unoptimized
            // El `translate-y` baja el glifo hasta centrarlo en la banda de
            // MAYÚSCULAS de la primera línea, y el valor sale de las métricas,
            // no del ojo: alineado por baseline, la caja del icono se apoya en
            // ella y sube 1.07em, mientras las mayúsculas de Montreal llegan a
            // 0.715em (cap-height 715 — ver lib/fonts.ts). O sea que sobresalía
            // 0.355em por arriba y nada por abajo. Bajarlo la mitad de esa
            // diferencia lo deja con el mismo aire arriba que abajo respecto de
            // «NEAR».
            //
            // Va en `em` para que siga al cuerpo del titular, y como transform
            // para que no toque el layout: la línea base del texto no se mueve.
            className="h-[1.07em] w-[1.07em] shrink-0 translate-y-[0.18em]"
          />
          {/* `text-h2` y no `text-manifesto`: el rol que le corresponde en la
              escala. `--text-manifesto` no es un escalón del ruleset sino una
              medida de contenedor (`3.4cqw`), hecha para un bloque cuyo cuerpo
              se negocia con su caja; esta frase es el titular de su sección y
              se mide contra el viewport como los demás.
              
              El tope de los dos es el mismo (3.75rem), así que en pantalla
              grande el tamaño no cambia — lo que cambia es el tramo medio, que
              deja de depender de cuánto mide el `Container`.

              El `max-w` va en **em**, y esa unidad es el punto entero: en em la
              medida de línea escala con el font-size, así que el reparto en
              líneas —y sobre todo dónde cae el acento, que tiene que cerrar la
              última— es el mismo en cualquier viewport. 17em son ~38
              caracteres, un poco más que la línea más larga
              ("Quantum-resistant and confidential").

              Sin `text-balance` y sin quiebres a mano: los dos existían para la
              versión centrada, donde la última línea corta se notaba. Acá la
              frase está alineada a la izquierda y el reparto lo fija la medida,
              que es lo que mantiene el acento en su renglón. */}
          <h2 data-statement-copy className="max-w-[17em]">
            {COPY.body}{" "}
            {/* El acento pesa MÁS que el cuerpo dentro de la misma frase, y eso
                no es un rol tipográfico nuevo que merezca su token: es el
                contraste interno del statement y vive con él. Mismo tratamiento
                que en `AgentEconomy`.

                El verde es `--statement-accent` (#5cb946), verde hoja tomado del
                gradiente del icono para que el acento y el glifo se lean como la
                misma cosa. NO es el verde de marca: `--sem-brand-primary` es un
                mint que al lado de este icono se lee como otro color, y sobre
                crema da 1.64:1 contra los 3.4:1 de éste. */}
            {/* ds-exempt: acento más pesado que su propia frase */}
            <strong className="font-bold text-[color:var(--statement-accent)]">
              {COPY.accent}
            </strong>
          </h2>
        </div>
      </Container>
    </section>
  );
}
