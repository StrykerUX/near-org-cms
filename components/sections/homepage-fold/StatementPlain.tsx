"use client";


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
/**
 * El tramo del cuerpo que se lee como acento, y no como parte de la frase
 * corrida.
 *
 * Se saca por búsqueda del contenido compartido en vez de escribirlo dos veces:
 * `AGENT_ECONOMY.body` es la fuente, y duplicar la frase acá dejaría dos copias
 * que se separan la primera vez que alguien corrija una y no la otra. Si el
 * copy cambia y la frase deja de estar, el `split` no encuentra nada y la
 * sección cae a la versión de un solo acento — se ve peor, no se rompe.
 */
const PIVOT = "the agent economy.";

/** La conjunción que cierra el cuerpo y arrastra al acento a su propia línea. */
const CONNECTOR = "and";

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

/**
 * Los dos tramos en acento.
 *
 * `font-serif italic` y no un token `text-*-serif`: el tamaño ya lo pone el
 * `text-h2` del párrafo, y un token completo lo pisaría con el suyo. Lo que
 * cambia acá es la VOZ —la frase pasa de dicha a citada— y eso es familia e
 * inclinación, no escala.
 *
 * El `1.09em` es corrección ÓPTICA, no un cambio de escala. Kepler tiene la
 * altura de x más baja que Montreal, así que al mismo `font-size` sus
 * minúsculas se ven un cuerpo más chicas y el acento parece hundido dentro de
 * la frase. El factor lo devuelve a la misma altura aparente. Va en `em` a
 * propósito: se mide contra el tamaño heredado, así que sigue al token del
 * párrafo en vez de fijar un cuerpo propio.
 *
 * Y el `leading-[1]` es la contrapartida obligatoria. Un inline más grande
 * arrastra su propio interlineado, y medido daba 69px en las líneas con acento
 * contra 58 en las demás: el bloque quedaba con los renglones a dos distancias
 * distintas según llevaran serif o no. Fijándolo, la caja del acento vuelve a
 * medir lo mismo que la del sans.
 *
 * `0.86` y no `1`: fijarlo en el propio tamaño del acento deja todavía 8px de
 * diferencia, porque la caja de línea también se corre al alinear dos fuentes
 * con líneas base distintas. El valor sale de medir, no de una proporción.
 *
 * Y no `0` —el atajo habitual para esto— porque el degradé se recorta contra la
 * caja del inline: con altura cero no hay caja sobre la que pintarlo y el texto
 * queda transparente sobre nada.
 *
 * El acento es el verde de marca PLANO. Tenía un degradé recortado con
 * `bg-clip-text` —de un verde claro a uno oscuro, para que el promedio de
 * contraste sobre crema mejorara— y con él se fueron sus dos acompañantes:
 * `bg-clip-text` no tiene nada que recortar sin degradé, y
 * `box-decoration-break: clone` existía solo para que un tramo partido en dos
 * renglones no repartiera UN degradé entre los dos fragmentos.
 *
 * ⚠️ El verde de marca sobre crema es 1.64:1. El degradé que se fue era la
 * compensación de eso; el acento ahora se apoya en la bastardilla y el cuerpo,
 * no en el contraste.
 */
function Accented({ children }: { children: React.ReactNode }) {
  return (
    // ds-exempt: corrección óptica de x-height y su interlineado, en `em`
    <em className="text-brand font-serif text-[1.09em] leading-[0.86]">
      {children}
    </em>
  );
}

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
  // El cuerpo, partido en los dos tramos que quedan en voz corrida. `rest`
  // llega `undefined` si el pivote ya no está en el copy — ahí el primer
  // acento no se dibuja y la frase sigue entera, que es la degradación que se
  // quiere.
  const [lead, rest] = COPY.body.split(PIVOT);

  // Y el "and" final se separa del resto para bajar con el acento: es la
  // conjunción que lo introduce, y dejarla colgando al final de la línea
  // anterior parte la última idea en dos renglones que no se leen juntos.
  //
  // Por `lastIndexOf` y no por un corte fijo: la conjunción es la última
  // palabra del cuerpo, y buscarla desde el final es lo único que sigue
  // funcionando si la frase de antes cambia de largo. Si el copy deja de
  // terminar así, `cut` da -1 y el renglón se arma como antes.
  const body = rest?.trimStart() ?? "";
  const cut = body.lastIndexOf(` ${CONNECTOR}`);
  const middle = cut >= 0 ? body.slice(0, cut) : body;
  const connector = cut >= 0 ? body.slice(cut + 1) : "";

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
        <div>
          {/* Sin el flex ni el `w-fit` que había acá: existían para poner el
              icono de NEAR a la izquierda de la frase, alineado por baseline.
              Fuera el icono, un flex de un solo hijo con `gap` es andamiaje que
              no sostiene nada — el `mx-auto` sobre el propio bloque de texto
              hace el mismo centrado. */}
          {/* `text-h2` y no `text-manifesto`: el rol que le corresponde en la
              escala. `--text-manifesto` no es un escalón del ruleset sino una
              medida de contenedor (`3.4cqw`), hecha para un bloque cuyo cuerpo
              se negocia con su caja; esta frase es el titular de su sección y
              se mide contra el viewport como los demás.
              
              El tope de los dos es el mismo (3.75rem), así que en pantalla
              grande el tamaño no cambia — lo que cambia es el tramo medio, que
              deja de depender de cuánto mide el `Container`.
              
              La caja mide 15.5em, y el medio punto no es indecisión: 17 dejaba
              las líneas largas, 15 quebraba de más y 16 seguía ancha.
              
              `text-balance` reparte el texto entre las líneas en vez de llenar
              cada una hasta el borde, así que la última deja de ser un resto
              corto. Trabaja POR BLOQUE, y el `<br>` de abajo parte la frase en
              dos: cada oración se balancea sola, que es lo que se quiere.
              
              ⚠️ Los navegadores dejan de balancear pasado un número de líneas
              (Chrome, alrededor de seis) por costo de cálculo. Este bloque está
              justo en ese límite, así que el ancho de arriba no es solo estética
              — si crece y una de las dos mitades pasa el tope, el balanceo se
              apaga solo y en silencio. */}
          <h2 data-statement-copy className="mx-auto max-w-[15.5em] text-center text-h2 text-balance">
            {lead}
            <Accented>{PIVOT}</Accented>
            {/* El único quiebre puesto a mano de toda la frase, y va acá porque
                acá termina una oración: el primer acento cierra la idea de qué
                es NEAR, y lo que sigue es otra. Sin el salto, el punto cae a
                mitad de línea y las dos ideas se leen como una sola tirada.
                
                `trimStart` sobre el resto porque el espacio que separaba las
                oraciones en el string quedaría al principio del renglón nuevo —
                invisible en el markup y visible como una sangría de un espacio
                en la línea centrada. */}
            <br />
            {middle}
            {/* El segundo quiebre: baja el "and" junto con el acento que
                introduce, para que la última idea entre entera en un renglón. */}
            {connector ? <br /> : null}
            {connector}{connector ? " " : null}
            <Accented>{COPY.accent}</Accented>
          </h2>
        </div>
      </Container>
    </section>
  );
}
