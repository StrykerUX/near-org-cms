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
// Acá es una sección normal de una pantalla: el icono apoyado en la baseline y
// el texto entrando línea por línea CUANDO LA SECCIÓN LLEGA, con un
// ScrollTrigger de solo lectura, `once: true`. Al volver a subir, el texto está
// ahí, quieto y entero. Sin JS o con `prefers-reduced-motion`, también.
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

const PALETTE = {
  "--statement-accent": "#5cb946",
  /* Las dos paradas del degradé del acento. Van de claro a oscuro y las dos
     sobre el mismo verde: sobre crema, el tramo claro es el límite de lo que
     todavía se lee, así que el degradé baja hacia el oscuro en vez de subir —
     el promedio de contraste mejora respecto del color plano que había. */
  "--statement-accent-lo": "#6cc24a",
  "--statement-accent-hi": "#2e7d32",
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
 * El degradé va sobre el texto con `bg-clip-text`, y `box-decoration-break:
 * clone` es lo que lo hace sobrevivir al quiebre de línea: sin él, un tramo
 * partido en dos reparte UN degradé entre los dos fragmentos y el segundo
 * arranca donde terminó el primero, con un salto de color en medio de la
 * palabra. Con clone, cada línea recibe el degradé entero.
 */
function Accented({ children }: { children: React.ReactNode }) {
  return (
    // ds-exempt: corrección óptica de x-height y su interlineado, en `em`
    <em className="bg-[linear-gradient(160deg,var(--statement-accent-lo)_0%,var(--statement-accent-hi)_100%)] bg-clip-text font-serif text-[1.09em] leading-[0.86] text-transparent [box-decoration-break:clone]">
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
      let tl: gsap.core.Timeline | null = null;
      let cancelled = false;

      // Igual que el statement vivo: el split espera a que las fuentes midan
      // (parte por LÍNEAS y una línea es geometría de fuente), y el flag cubre
      // el cleanup que corre antes de que la promesa resuelva — StrictMode lo
      // hace en cada mount de dev.
      const prepare = () => {
        if (cancelled || split) return;
        split = SplitText.create(copy, { type: "lines", mask: "lines" });
        const lines = split.lines;
        gsap.set(lines, { autoAlpha: 0, yPercent: 110 });

        tl = gsap.timeline({
          scrollTrigger: { trigger: scope, start: "top 55%", once: true },
        });
        tl.to(lines, {
          autoAlpha: 1,
          yPercent: 0,
          stagger: 0.14,
          duration: 0.85,
          ease: "power2.out",
        });
        // Si la sección YA está en cuadro cuando el split termina (recarga a
        // media página), el trigger nuevo tiene que evaluarse contra el layout
        // vigente o el texto queda apagado hasta el próximo scroll.
        ScrollTrigger.refresh();
      };

      if (document.fonts?.ready) document.fonts.ready.then(prepare).catch(prepare);
      else prepare();

      return () => {
        cancelled = true;
        tl?.scrollTrigger?.kill();
        tl?.kill();
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
