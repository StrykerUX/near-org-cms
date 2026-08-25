"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import {
  DUR,
  EASE,
  STAGGER,
} from "@/components/sections/homepage-shared/motion";
import StackAssembly, {
  type StackStop,
} from "@/components/sections/homepage-shared/stackAssembly";
import StackFlow from "@/components/sections/homepage-shared/StackFlow";
import StackCursorTag from "@/components/sections/homepage-shared/StackCursorTag";
import { useStackScene } from "@/components/sections/homepage-shared/useStackScene";
import {
  AI_BLOCK,
  INTENTS_BLOCK,
  NEARCOM_BLOCK,
  PROTOCOL_BLOCK,
  STACK_NOTES,
  STACK_PIECES,
  STACK_INTRO as INTRO,
} from "@/components/sections/homepage-shared/nearStackContent";

// El stack de ab10: el ensamble isométrico al centro y las cuatro capas escritas
// en las cuatro esquinas, cada una pegada a la pieza de la que habla.
//
// Es la variante **C · Anchors** de `components/sections/stack-labs/`, con la
// ficha rehecha según el prototipo. Copiada y no importada, igual que
// `ProofDatum`: el lab es un laboratorio y su contenido puede cambiar o
// borrarse sin aviso.
//
// ── Por qué la posición del texto significa algo ────────────────────────────
//
// Es la diferencia conceptual con las otras variantes del lab: acá el texto no
// vive en una lista aparte, está anclado a su capa.
//
// Las cuatro esquinas siguen el orden de lectura, y ese orden es el del stack de
// ADENTRO HACIA AFUERA: arriba a la izquierda el núcleo (Protocol), después el
// primer anillo (Intents), después el segundo (NEAR AI), y al final —abajo a la
// derecha, donde la lectura termina— la cáscara (near.com), que es lo único que
// el usuario final toca.
//
// Es al revés de como estaba en el lab, que abría por la cáscara. Las dos
// lecturas se sostienen; esta gana porque el arte se construye igual: la columna
// central primero y las capas envolviéndola.
//
// ── Qué cambia respecto del lab ─────────────────────────────────────────────
//
//  1. **El titular viaja con la escena.** El lab abre con "The NEAR Stack"
//     centrado arriba, y por un tiempo acá vivió AFUERA, en una sección propia
//     (`StackIntro`) inmediatamente anterior. El problema de eso era de lectura,
//     no de layout: el titular se leía una vez y se iba con el scroll, así que
//     cuando el arte terminaba de armarse ya no quedaba a la vista qué era lo
//     que se estaba mirando.
//
//     Ahora está DENTRO del sticky, arriba del arte y en `text-h2`. La objeción
//     que lo había echado afuera —que un bloque de texto le come el alto a las
//     cuatro fichas— valía para un titular en el MEDIO y a escala de `h1`;
//     arriba y dos escalones más chico, lo que descuenta es mucho menor, y el
//     arte cede ese alto en vez de las fichas (ver el `shrink-0`).
//  2. **La ficha es otra cosa.** El lab tenía rótulo + nombre + párrafo. Acá
//     lleva cuatro registros tipográficos que hacen cuatro trabajos distintos:
//     el nombre en mono a escala de heading, una regla con el destino externo,
//     el cuerpo en sans, y —abajo— las piezas de la capa y las capacidades del
//     stack en mono.
//  3. **La alineación es especular.** Las dos fichas de la derecha alinean a la
//     derecha, contra el borde. Es lo que deja el arte respirando en el centro
//     en vez de tener cuatro bloques mirando todos para el mismo lado.
//
// ── El halo ─────────────────────────────────────────────────────────────────
//
// Un radial verde muy contenido detrás del ensamble. No es decoración: sobre
// negro plano el arte flota en el vacío, y un objeto que no está EN ningún
// sitio se lee como un recorte pegado encima.
//
// ── Recorrido: 200svh ────────────────────────────────────────────────────────
//
// Cada parada enciende una capa Y su ficha, a la vez: pieza y texto son la
// misma unidad. `position: sticky` y un ScrollTrigger de SOLO LECTURA, nunca
// `pin: true` — el porqué está en components/sections/README.md.

const TRAVEL = "200svh";

export type StackAnchorsProps = {
  /**
   * Si el encabezado entra solo al plantarse la escena.
   *
   * `false` cuando algo ANTES ya trajo el título en pantalla — la obertura
   * (`StackOverture`) lo hace: nace grande sobre crema y termina exactamente en
   * esta posición y a este tamaño, y esta sección lo releva sin que se note.
   * Con la entrada encendida, ese relevo se ve como un parpadeo: el título de
   * la obertura se va y el de acá aparece desde cero en el mismo punto.
   */
  headEntrance?: boolean;
  /**
   * La escena llega y se va CONTENIDA EN UNA CAJA.
   *
   * Con `frame`, la escena no ocupa la pantalla de entrada: sube desde abajo
   * recortada a una tarjeta de esquinas blandas, se abre a pantalla completa
   * justo al plantarse, y al salir se vuelve a cerrar. Es el gesto del hero de
   * `homepage-tuck` leído al revés — allá el hero se guarda en una caja, acá la
   * caja se abre.
   *
   * Reemplaza a la cortina y a la obertura: el negro ya no llega tapando ni
   * subiendo, llega DENTRO de algo. Los dos tramos de la caja pasan mientras la
   * sección entra y sale, así que no le roban un solo píxel al tiempo en que la
   * escena está plantada.
   *
   * Con `frame` el ensamble además deja de recorrer sus paradas con el scroll y
   * pasa a recorrerlas por reloj — ver `stops` en `useStackScene`, unas líneas
   * más abajo.
   */
  frame?: boolean;
  /**
   * El fondo deja de ser negro plano y pasa a ser el shader del hero,
   * recalibrado: la luz nace abajo al centro y sube. Ver `StackFlow`.
   *
   * Reemplaza al halo —un radial verde muy contenido detrás del ensamble, que
   * estaba ahí para que el arte no flotara en el vacío—. El flujo hace ese
   * trabajo mejor y además dice algo: el stack se apoya en algo que asciende.
   */
  flow?: boolean;
  /**
   * Solo se ve la ficha de la capa ACTIVA; las otras tres no están.
   *
   * Es la respuesta al audit de carga cognitiva, aplicada sin mover un solo
   * elemento de sitio. Cuatro fichas simultáneas son ~350 palabras y 24
   * etiquetas compitiendo en una pantalla; con una sola, el lector lee lo que
   * el arte está mostrando y nada más.
   *
   * Y resuelve el contraste de raíz. El mecanismo anterior —dejar las tres
   * inactivas en `cream/25` a `cream/45`— da entre 2.1:1 y 3.2:1 sobre `--ink`,
   * muy por debajo del 4.5:1 de AA, y subirlas hasta que pasen elimina la
   * distinción que justificaba atenuarlas. Ausente no tiene contraste que
   * cumplir, y la que está presente va a su valor pleno.
   *
   * Se apoya en `on()`, que ya calculaba exactamente esto para decidir a qué
   * tinte pintar cada ficha: solo una es verdadera a la vez, y contempla tanto
   * la parada del recorrido como el hover. Lo que cambia es la consecuencia —
   * antes era menos tinta, ahora es estar o no estar.
   */
  soloActive?: boolean;
};

export default function StackAnchors({
  headEntrance = true,
  frame = false,
  soloActive = false,
  flow = false,
}: StackAnchorsProps = {}) {
  // `stops: !frame` — con caja, el recorrido cambia de MOTOR, no desaparece.
  //
  // Las siete paradas son las mismas y en el mismo orden; lo que las sirve es
  // un reloj que arranca al terminar el build-in, no la posición del scroll.
  //
  // Dos razones, y la segunda es la que importa. Una: la caja que se abre al
  // plantarse y se cierra al salir ya es la narrativa de la sección, y las
  // paradas contaban una segunda sobre la misma barra de scroll. La otra:
  // colgado del scroll, la velocidad del paseo la ponía la rueda del lector, y
  // un gesto de trackpad se comía las siete paradas en dos cuadros — el arte no
  // se recorría, parpadeaba. Con reloj, cada parada dura lo que tiene que
  // durar y el recorrido se ve entero siempre.
  //
  // El hover no pasa por el recorrido, así que sigue completo: capas,
  // segmentos de AI y los seis cubos de la columna con su split.
  //
  // Fuera de `frame` (homepage-a, homepage-b) el recorrido sigue colgado del
  // scroll, como estaba.
  const {
    rootRef,
    stageRef,
    stage,
    stop,
    hover,
    enhanced,
    goTo,
    stageProps,
    tagRef,
  } = useStackScene({ stops: !frame });
  // Solo `frame` salta la entrada del contenido, y `soloActive` NO.
  //
  // Estuvieron los dos, y era un error con síntoma claro: en `soloActive` la
  // escena entera aparecía de golpe al plantarse, sin ninguna entrada.
  //
  // El motivo por el que `soloActive` estaba en la lista era real pero dejó de
  // aplicar: al principio la clase de presencia vivía en el CONTENEDOR de la
  // ficha, el mismo elemento que la entrada anima, y el `opacity` inline de
  // GSAP le ganaba a la clase. Cuando el encabezado se separó del cuerpo, esa
  // clase se mudó al div del cuerpo — un elemento distinto—, así que animar el
  // contenedor ya no pisa nada: las dos opacidades se multiplican, que es
  // justo lo que se quiere.
  const headRef = useSceneEntrance(headEntrance, frame);
  const frameRef = useFrameReveal(frame);

  // La ficha se enciende cuando su capa es la parada activa, cuando el puntero
  // está sobre su pieza, o siempre en el fallback sin escena.
  const on = (key: StackStop | "ai") => {
    if (!enhanced) return true;
    // Un cubo de la columna partida es la capa `protocol`: no tiene `key`
    // propia, se identifica por índice.
    if (hover?.kind === "cube") return key === "protocol";
    if (hover)
      return hover.key === key || (key === "ai" && hover.kind === "seg");
    if (key === "ai")
      return stop === "ai" || AI_BLOCK.subs.some((s) => s.key === stop);
    return stop === key;
  };

  return (
    <>
      <section
        ref={rootRef}
        style={{ "--travel": TRAVEL } as React.CSSProperties}
        // Con `frame`, el fondo NO va en la sección: va en el hijo, que es lo
        // que se recorta. Pintado acá se vería alrededor de la caja y no
        // habría caja que ver. El crema de la sección es el que asoma por los
        // márgenes mientras la escena entra y sale.
        className={`group/anchors relative text-cream data-[mode=track]:h-[calc(var(--travel)+100svh)] ${
          frame ? "bg-cream" : "bg-ink"
        }`}
      >
        <div
          data-stack-frame
          className={`relative overflow-hidden group-data-[mode=track]/anchors:sticky group-data-[mode=track]/anchors:top-0 group-data-[mode=track]/anchors:h-svh ${
            frame ? "bg-ink" : ""
          }`}
        >
          {/* Sin `flow`, el fondo de la escena es el negro de la sección y
              nada más.

              Acá vivía un halo radial verde —un `radial-gradient` centrado,
              a media opacidad, sobredimensionado con `inset` negativo para que
              su borde cayera fuera de cuadro. Se cayó por dos motivos que
              apuntaban al mismo lado: aparecía de golpe con el destape (no
              tiene por qué animar, es fondo, no contenido) y no aportaba
              encuadre — el arte ya trae toda la luz verde que la escena
              necesita, y el halo solo la repetía más floja. */}
          {flow ? (
            /* El flujo. Va `inset-0`: el shader llena su caja y su parada más
               oscura ya es prácticamente el fondo de la sección, así que no hay
               borde que disimular. */
            <StackFlow className="pointer-events-none absolute inset-0" />
          ) : null}

          {/* Dos envoltorios, y cada uno hace UNA cosa.

              `data-stack-inner` mide lo mismo que la caja y es lo que se ENCOGE
              al cerrarse (ver `useFrameReveal`). Tiene que ser del tamaño de la
              caja y no del contenido: el `scale` va con origen al centro, y el
              centro de un bloque más alto que la pantalla cae fuera de cuadro.

              `data-stack-reel` es el contenido, que SÍ es más alto que la caja
              —la escena ocupa una pantalla y el pie va debajo— y se desplaza
              hacia arriba con el scroll. Es lo que hace que gobernanza y
              economía estén DENTRO del mismo negro y aun así haya que
              scrollear para llegar a ellas.

              El fondo (`StackFlow`) queda afuera de los dos a propósito: es
              fondo. Desplazándolo con el carrete se despegaría del filo, y
              encogiéndolo con el cierre dejaría un borde de crema entre el
              shader y la caja. */}
          <div data-stack-inner className="relative h-full">
            <div data-stack-reel className="relative">
              <Container
                // El `pb` extra es solo de `frame`, y ahora el que respira contra
                // el filo es el borde inferior de las dos fichas de abajo.
                //
                // Con caja, ese borde es un FILO redondeado a 34px, no el borde de
                // la pantalla: los 40px del `py-10` alcanzaban cuando abajo no
                // había nada, y contra un filo se leen como contenido pegado. Sin
                // caja no hay filo contra el que respirar y este aire solo le
                // comería alto al arte.
                //
                // `pb-*` gana sobre `py-*` sin depender del orden en el string:
                // Tailwind emite las utilidades de un solo lado después de las de
                // eje, siempre.
                // `h-svh` en modo track y no `h-full`: el padre dejó de ser la
                // caja —ahora hay un carrete en medio, más alto que ella— así que
                // un porcentaje resolvería contra el contenido y la escena crecería
                // con el pie que tiene debajo. Lo que la escena tiene que medir es
                // UNA PANTALLA, y eso se dice `h-svh`. Fuera de track sigue siendo
                // alto automático, igual que antes.
                className={`pointer-events-none relative flex flex-col py-10 group-data-[mode=track]/anchors:h-svh group-data-[mode=track]/anchors:pt-[calc(var(--site-header-block)+1rem)] ${
                  frame ? "pb-16 lg:pb-24" : ""
                }`}
              >
                {/* El titular del stack, DENTRO de la escena pegada.

                Vivía en su propia sección (`StackIntro`) justo encima, y por eso
                se leía una vez y se iba con el scroll: cuando el arte se armaba,
                el lector ya no tenía a la vista qué era lo que estaba mirando.
                Acá viaja con el sticky y se queda mientras dura la escena.

                `shrink-0` para que sea el arte —que está en el `flex-1` de
                abajo— el que ceda alto, y no el titular. El razonamiento viejo
                de `StackIntro` (que un bloque de texto en el medio le come el
                alto a las cuatro fichas) sigue siendo cierto para el MEDIO; acá
                está arriba y en `text-h2` en vez de `text-h1`, así que lo que
                descuenta es bastante menos. */}
                <div
                  data-stack-head
                  ref={headRef}
                  className="shrink-0 pb-6 text-center lg:pb-8"
                >
                  <h2 data-stack-line className="text-h2 text-balance">
                    {INTRO.lead} <Accent>{INTRO.accent}</Accent>
                  </h2>
                  {/* Sin `mt`: el aire entre titular y subtítulo ya lo pone el
                  interlineado del `text-h2`, que a esta escala son ~14px de
                  descuelgue bajo la última línea. El `mt-3` que había acá se
                  sumaba a eso y separaba los dos como si fueran bloques
                  distintos, cuando son una sola entrada. */}
                  <p
                    data-stack-line
                    data-stack-sub
                    className="mx-auto max-w-[42ch] text-body text-cream/70 text-balance"
                  >
                    {INTRO.sub}
                  </p>
                </div>

                {/* El área de anclaje: el arte centrado y las cuatro fichas en las
                esquinas. `min-h-0` para que el arte pueda encogerse dentro del
                sticky en vez de desbordarlo. */}
                <div className="relative min-h-0 flex-1">
                  {/* `h-[88%]` y no `h-full`: el ensamble isométrico va algo más
                  chico que su caja. Fue 80% mientras el pie de
                  gobernanza/economía compartía la pantalla con la escena; con
                  el pie fuera del reparto hay alto de sobra y el ensamble se
                  queda con una parte.

                  El tamaño se toca ACÁ, en el alto del stage, y no con un
                  `scale()` sobre el arte: el `w-auto` del SVG deriva su ancho de
                  este alto, así que la pieza sigue midiendo lo que ocupa de
                  verdad. Un `scale` la dejaría reservando el espacio del tamaño
                  original —y las cuatro fichas de las esquinas se anclan contra
                  esta caja, así que se habrían quedado separadas del arte. El
                  centrado no se toca: `left-1/2 top-1/2` con las traslaciones
                  sigue centrando la caja, mida lo que mida. */}
                  <div
                    data-stack-art
                    ref={stageRef}
                    {...stageProps}
                    className="pointer-events-auto absolute left-1/2 top-1/2 h-[88%] -translate-x-1/2 -translate-y-1/2"
                  >
                    <StackAssembly
                      stage={stage}
                      hover={hover}
                      className="h-full w-auto"
                    />
                    <StackCursorTag ref={tagRef} hover={hover} />
                  </div>

                  {/* Sin `pieces`: las del protocolo son los cubos de la columna, y
                  cada uno se cuenta solo al pasar el puntero. Ver el docblock de
                  `STACK_PIECES`. */}
                  <Anchor
                    side="left"
                    leaf={PROTOCOL_BLOCK}
                    on={on("protocol")}
                    solo={soloActive}
                    onSelect={() => goTo("protocol")}
                    className="left-0 top-0"
                  />
                  <Anchor
                    side="right"
                    leaf={INTENTS_BLOCK}
                    pieces={STACK_PIECES.intents}
                    on={on("intents")}
                    solo={soloActive}
                    onSelect={() => goTo("intents")}
                    className="right-0 top-0"
                  />
                  {/* Las dos de abajo no se apoyan en el borde: `bottom-[7%]`.
                  
                  Con el cuerpo reservando su espacio aunque no se vea, una
                  ficha anclada al borde inferior empuja su encabezado hasta
                  media altura, y los cuatro títulos —que son lo único
                  permanente de las fichas— quedan repartidos como dos arriba y
                  dos casi en el centro. Subidas, los cuatro forman un marco
                  alrededor del arte en vez de un bloque desbalanceado. */}
                  <Anchor
                    side="left"
                    leaf={{ ...AI_BLOCK, body: AI_BLOCK.intro }}
                    pieces={STACK_PIECES.ai}
                    on={on("ai")}
                    solo={soloActive}
                    onSelect={() => goTo("ai")}
                    className="bottom-[7%] left-0"
                  />
                  <Anchor
                    side="right"
                    leaf={NEARCOM_BLOCK}
                    on={on("nearcom")}
                    solo={soloActive}
                    onSelect={() => goTo("nearcom")}
                    className="bottom-[7%] right-0"
                  />
                </div>

                {/* Ancla del recorte. Un nodo vacío y no un ref sobre la sección
                porque el ref de la sección ya es de `useStackScene`, y dos
                hooks escribiendo sobre el mismo elemento se pisan el
                `gsap.context`. Desde acá se llega a los dos por `closest`. */}
                <span ref={frameRef} aria-hidden="true" className="hidden" />
              </Container>

              {/* El pie, DEBAJO de la escena y dentro del mismo negro.
                  
                  Solo con caja: sin ella el carrete no se desplaza —no hay
                  tramo de scroll que lo mueva— y estas dos notas quedarían
                  fuera de cuadro para siempre. Ahí van en su propia sección,
                  más abajo.

                  El aire de arriba es grande a propósito. Al llegar acá el
                  lector viene de una pantalla llena; si el filete apareciera
                  pegado al borde inferior de la escena, las notas se leerían
                  como el pie de las cuatro fichas y no como lo que son — otra
                  cosa, dentro de la misma caja. */}
              {frame && (
                <Container className="pb-[clamp(96px,15svh,208px)] pt-[clamp(72px,12svh,160px)]">
                  <StackNotes />
                </Container>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* El pie FUERA de la escena — solo SIN caja.

          Hermano de la `<section>` de arriba y no un bloque más adentro de
          ella: en modo track esa sección tiene alto FIJO (`--travel` + 100svh),
          y un hijo puesto después del sticky se le sale por abajo sin que nada
          lo muestre nunca.

          Con caja el pie sí va adentro, y por eso existe el carrete: el
          contenido de la caja se desplaza con el scroll en vez de crecer la
          sección. Ver `useFrameReveal`. */}
      {/* Gobernanza y economía, en su propia sección. Ver su docblock. */}
      {!frame && <StackNotesSection />}
    </>
  );
}

/* ── La entrada de la escena ─────────────────────────────────────────────── */

/**
 * La escena se ARMA cuando se planta: primero el encabezado, después las cuatro
 * fichas, una detrás de otra.
 *
 * Todo esto vive DENTRO del sticky, así que su posición en pantalla no cambia
 * con el scroll y no puede ser su propio trigger: el disparo se mide contra la
 * `<section>`, que es la que se mueve. De ahí el `closest`.
 *
 * `top top` —y no un punto anterior— porque la sección llega TAPADA: lo que
 * haya delante (la cortina, o la obertura) cubre el viewport hasta el instante
 * exacto en que el borde superior de la escena alcanza el techo. Cualquier
 * entrada disparada antes ocurre detrás del negro, y el lector se encuentra
 * todo ya puesto.
 *
 * ── Por qué las fichas también ──────────────────────────────────────────────
 *
 * Antes solo entraba el encabezado, y con la cortina delante casi no se notaba:
 * el negro subía tapando y detrás aparecía la escena entera de una vez, pero el
 * corte quedaba disimulado por el propio movimiento del panel.
 *
 * Con la obertura eso dejó de funcionar. La obertura entrega una pantalla negra
 * con UN título y nada más, y en el frame siguiente están las cuatro fichas,
 * sus cuarenta etiquetas y el pie: el salto de densidad es enorme y se lee como
 * que la página cargó algo tarde.
 *
 * Escalonadas, la escena se arma delante del lector — que además es lo que la
 * columna ya venía haciendo por su lado (ver el build-in de `useStackScene`,
 * que corre en el mismo punto). Las dos cosas dejan de ir cada una por su lado.
 *
 * `enabled` gobierna SOLO el TITULAR: cuando algo anterior ya lo trajo en
 * pantalla —la obertura lo hace, y termina dejándolo exactamente en esta
 * posición— repetir su entrada acá lo haría parpadear. El subtítulo y las
 * fichas entran siempre; nadie las trae de antes.
 */
function useSceneEntrance(enabled: boolean, frame: boolean) {
  return useGsapContext<HTMLDivElement>(
    (_self, scope) => {
      const section = scope.closest("section");
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Sin `enabled`, el TITULAR llega relevado de la obertura y no debe
        // animar: repetir su entrada acá lo haría parpadear justo en el punto en
        // que la obertura lo deja quieto. Pero el subtítulo no viaja en ese
        // relevo —la obertura solo lleva el `h2`—, así que estaba quedando fuera
        // de todo y apareciendo de golpe con el destape. Entra él solo.
        const lines = Array.from(
          scope.querySelectorAll<HTMLElement>(
            enabled ? "[data-stack-line]" : "[data-stack-sub]",
          ),
        );
        // Con caja, las fichas y el arte NO entran acá: los maneja el scrub de la
        // apertura (`useFrameReveal`), atados al mismo recorrido que el encuadre.
        //
        // Repartirlos entre dos triggers parecía equivalente y no lo es: este es
        // un `once` sobre una posición, y el de la caja es un scrub sobre un
        // rango. Cualquier cosa que evalúe el `once` antes de tiempo —una recarga
        // a media página, un salto de posición, un refresh con la sección ya
        // dentro del rango— muestra el contenido mientras la caja todavía se está
        // abriendo, que es exactamente lo que la caja viene a evitar. Colgados
        // del mismo scrub, el orden no puede romperse.
        const cards = frame
          ? []
          : Array.from(
              section.querySelectorAll<HTMLElement>("[data-stack-card]"),
            );
        // El arte va aparte de las fichas: su caja está centrada con dos
        // `translate` de la hoja de estilos, y un `y` de GSAP los pisaría — el
        // ensamble saltaría media pantalla en el primer frame. Solo opacidad.
        const art = frame
          ? null
          : section.querySelector<HTMLElement>("[data-stack-art]");
        if (lines.length === 0 && cards.length === 0) return;

        // `set` + `to`, nunca `from` con stagger: un `.from()` escalonado deja
        // aplicado el estado inicial SOLO del primer elemento y el resto arranca
        // visible. Documentado con su síntoma en `useFrameReveal`.
        //
        // La curva es `EASE.out` — la del sistema de motion de esta página, la
        // misma que usan todas las demás entradas.
        //
        // El timeline arranca en pausa y lo gobierna un trigger propio, y no el
        // `once` de `enterTimeline`: acá la entrada tiene que poder REARMARSE al
        // subir, y un `once` solo sabe ocurrir una vez. Ver el gate más abajo.

        // El aire antes de la entrada, en TIEMPO y no en recorrido de scroll.
        //
        // Fue un `start` corrido 140px y no podía quedarse así: el punto donde la
        // escena se destapa y el punto donde la entrada arranca tienen que ser el
        // mismo, o el tramo intermedio queda con la escena a la vista y todavía
        // invisible. El aire sigue estando —el título aterriza limpio sobre el
        // negro antes de que entre nada— pero ahora lo pone el timeline.
        const ENTER_DELAY = 0.26;

        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: EASE.out, duration: DUR.base },
        });
        if (lines.length) {
          gsap.set(lines, { autoAlpha: 0, y: 18 });
          tl.to(
            lines,
            { autoAlpha: 1, y: 0, stagger: STAGGER, duration: DUR.slow },
            ENTER_DELAY,
          );
        }
        // Las fichas arrancan con el encabezado ya en camino, no después de que
        // termine: esperarlo deja un hueco muerto de medio segundo con la
        // pantalla casi vacía. El escalonado entre ellas es más largo que el de
        // los renglones del encabezado porque son cuatro bloques enteros — al
        // ritmo de un renglón se leerían como una sola cosa apareciendo de a
        // partes.
        if (cards.length) {
          gsap.set(cards, { autoAlpha: 0, y: 24 });
          tl.to(
            cards,
            { autoAlpha: 1, y: 0, stagger: STAGGER * 1.6, duration: DUR.slow },
            ENTER_DELAY + 0.18,
          );
        }
        // El arte, primero de todo lo que no es texto: es el centro de la escena
        // y lo que el encabezado acaba de anunciar. Su propio build-in —los seis
        // cubos subiendo— arranca en este mismo punto y se monta encima de este
        // fade, así que lo que se ve es la columna construyéndose mientras
        // aparece, no dos cosas seguidas.
        if (art) {
          gsap.set(art, { autoAlpha: 0 });
          tl.to(art, { autoAlpha: 1, duration: DUR.slow }, ENTER_DELAY + 0.06);
        }

        // El tramo que este trigger vigila NO es la escena: es lo que pasa
        // JUSTO ANTES de que se vea.
        //
        //   start "top bottom" — la sección asoma por el borde inferior
        //   end   "top top"    — la sección se pega arriba: el destape
        //
        // Así los dos bordes caen donde hacen falta. `onLeave` (cruzar el end
        // bajando) es exactamente el instante del destape, y `onLeaveBack`
        // (cruzar el start subiendo) es un punto en el que la sección está
        // ENTERA fuera de cuadro — el único lugar seguro para rebobinar sin que
        // se vea desaparecer nada.
        //
        // El rango es de un viewport, y la obertura ocupa la pantalla durante
        // todo ese tramo, así que el rebobinado siempre ocurre a cubierto.
        const play = () => {
          if (tl.progress() === 0 && !tl.isActive()) tl.play();
        };
        const reset = () => {
          if (tl.progress() !== 0 || tl.isActive()) tl.pause(0);
        };

        // Rebobinar es reversible SOLO cuando el encabezado viene de afuera.
        //
        // `enabled === false` significa literalmente que algo delante ya trajo el
        // título a esta posición: la obertura. Y eso es justo lo que hace seguro
        // rearmar la entrada al subir — mientras el lector está por encima del
        // destape, la obertura le está tapando la escena, así que el rebobinado
        // es invisible y al volver a bajar la entrada se ve de nuevo.
        //
        // Sin obertura delante (`enabled === true`, el resto de las rutas) no hay
        // nada que garantice esa cobertura: la sección se despega y sigue a la
        // vista mientras sube. Ahí la entrada se queda como estaba, una sola vez,
        // porque rebobinarla haría desaparecer lo que el lector está mirando.
        const rewinds = !enabled;

        // El refresh INICIAL es el único que puede saltar al final: si la página
        // nace con la sección ya pasada —recarga a media página, llegada por
        // ancla— nadie debe ver una entrada que ya debería haber ocurrido. Los
        // refreshes posteriores no deciden nada.
        let armed = false;

        const gate = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "top top",
          markers: DEBUG_MARKERS,
          onLeave: play,
          // Volver a entrar al rango por arriba = el lector subió por encima del
          // destape. Con la obertura cubriendo, se rearma para la próxima bajada.
          onEnterBack: () => {
            if (rewinds) reset();
          },
          onLeaveBack: () => {
            if (rewinds) reset();
          },
          onRefresh: (self) => {
            if (armed) return;
            armed = true;
            if (self.progress >= 1) tl.progress(1).pause();
          },
        });

        return () => {
          gate.kill();
          tl.kill();
          gsap.set([...lines, ...cards, ...(art ? [art] : [])], {
            clearProps: "all",
          });
        };
      });

      return () => mm.revert();
    },
    [enabled, frame],
  );
}

/* ── La caja que se abre ─────────────────────────────────────────────────── */

/** Cuánto margen le queda a la caja cerrada, en % del viewport. */
const FRAME_TUCK = { y: 11, x: 6 } as const;

/** El radio de la caja, en px. Constante: el ENCUADRE nunca se escala. */
const FRAME_RADIUS = 34;

/**
 * Cuánto se encoge el CONTENIDO mientras la caja se cierra al salir.
 *
 * Es exactamente lo que le queda de alto a la caja cerrada
 * (`1 - 2 × FRAME_TUCK.y`), y se deriva y no se escribe a mano porque las dos
 * cosas tienen que moverse juntas: subir el margen de la caja sin bajar esto
 * vuelve a cortar el contenido, en silencio.
 *
 * Va contra el eje Y y no contra el X —que cierra menos, 6%— porque el corte
 * que se ve es VERTICAL: el pie de gobernanza/economía queda partido a mitad
 * de renglón. Con 0.78 uniforme el bloque entra holgado en los dos ejes; con
 * un `scaleX`/`scaleY` distintos calzaría exacto contra el filo y el texto
 * saldría deformado un 11%.
 */
const FRAME_SCALE = 1 - (2 * FRAME_TUCK.y) / 100;

/**
 * La escena entra y sale metida en una caja, y se abre a pantalla completa
 * mientras está plantada.
 *
 * ── Los dos tramos, y por qué no le roban recorrido a las paradas ───────────
 *
 * El ensamble reparte sus seis paradas sobre la sección ENTERA (`top top` →
 * `bottom bottom`, ver `useStackScene`). Si la apertura de la caja gastara
 * parte de ese rango, las paradas se apretarían y el arte pasaría de largo.
 *
 * Por eso los dos tramos caen FUERA de ese rango, en los únicos momentos en
 * que la escena existe pero todavía no está pegada:
 *
 *   abre   `top bottom` → `top top`     mientras la sección sube a plantarse
 *   cierra `bottom bottom` → `bottom top`  mientras se despega y se va
 *
 * En el medio —todo el tiempo que la escena está quieta y el lector recorre el
 * stack— la caja está abierta del todo y no hay nada animándose.
 *
 * ── Por qué `clip-path` ─────────────────────────────────────────────────────
 *
 * Mismo motivo que en el hero de `homepage-tuck`: un `scale` encogería el
 * CONTENIDO —el arte y las cuatro fichas se verían lejos, ilegibles— y lo que
 * se quiere es que el encuadre se cierre sobre una escena que no cambia de
 * tamaño. Además `inset()` no toca el layout, así que ni el sticky ni los
 * ScrollTrigger del ensamble se enteran.
 *
 * ── La excepción: el contenido SÍ se encoge, y solo al salir ────────────────
 *
 * La doctrina de arriba vale para el ENCUADRE, y vale entera mientras la caja
 * se abre: ahí lo único visible es el titular, el arte todavía no entró, y no
 * hay nada que se pueda ver cortado.
 *
 * Al cerrar es al revés. La escena está completa —titular, arte, cuatro fichas
 * y el pie de gobernanza/economía— y el filo de la caja avanza por encima:
 * lo que se ve no es una escena guardándose sino un párrafo TAJEADO a mitad de
 * renglón. Un texto cortado no se lee como un encuadre, se lee como un bug.
 *
 * Así que el bloque de contenido baja a `FRAME_SCALE` con el mismo scrub y la
 * misma curva que el clip: la caja se cierra y lo que hay adentro se va con
 * ella. El fondo (`StackFlow`) queda afuera del encogido a propósito — es
 * fondo, y encogerlo abriría una banda de crema entre el shader y el filo.
 *
 * El arte sigue sin verse "lejos" porque este tramo dura lo que la sección
 * tarda en irse de pantalla: para cuando el encogido se nota, la escena ya está
 * saliendo.
 */
function useFrameReveal(enabled: boolean) {
  return useGsapContext<HTMLElement>(
    (_self, scope) => {
      if (!enabled) return;

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // El scope es un ancla vacía dentro de la sección; el elemento que se
        // recorta y la sección contra la que se mide son sus ancestros.
        const section = scope.closest("section");
        const box = section?.querySelector<HTMLElement>("[data-stack-frame]");
        if (!section || !box) return;

        const shut = `inset(${FRAME_TUCK.y}% ${FRAME_TUCK.x}% round ${FRAME_RADIUS}px)`;
        const open = "inset(0% 0% round 0px)";
        const head = section.querySelector<HTMLElement>("[data-stack-head]");

        // Mientras la caja crece, lo único que se ve es el encabezado — y no en
        // su sitio definitivo, sino más abajo, con aire alrededor.
        //
        // Es lo que le da sentido al tramo. Una caja que se abre sobre la escena
        // completa es solo un encuadre agrandándose: el contenido ya estaba y el
        // gesto no aporta nada. Con el título solo y descolgado, la caja llega
        // ANUNCIANDO, y lo que anuncia aparece cuando termina de abrirse.
        //
        // El desplazamiento va en fracción del viewport y no en px: es distancia
        // de PANTALLA —cuánto respira el título dentro de la caja— y tiene que
        // valer lo mismo en un portátil que en un monitor grande.
        const openTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
            markers: DEBUG_MARKERS,
          },
        });

        openTl.fromTo(
          box,
          { clipPath: shut },
          { clipPath: open, ease: "power2.inOut", duration: 1 },
          0,
        );

        if (head) {
          // Sube al final del tramo, no durante: mientras la caja crece el
          // título se queda donde está, y solo cuando el encuadre ya casi llenó
          // la pantalla se acomoda arriba para dejarle sitio a la escena. Los dos
          // a la vez se leen como una sola cosa deslizándose.
          openTl.fromTo(
            head,
            { y: () => 0.17 * window.innerHeight },
            { y: 0, ease: "power2.inOut", duration: 0.45 },
            0.55,
          );
        }

        // Y detrás del título, la escena. Entra cuando la caja ya casi terminó de
        // abrirse y el encabezado va camino a su sitio: el orden es caja →
        // título en su lugar → contenido, y los tres cuelgan del mismo scrub, así
        // que no hay forma de que se adelanten entre sí.
        const cards = Array.from(
          section.querySelectorAll<HTMLElement>("[data-stack-card]"),
        );
        // El arte va aparte: su caja está centrada con dos `translate` de la hoja
        // de estilos, y un `y` de GSAP los pisaría — el ensamble saltaría media
        // pantalla en el primer frame. Solo opacidad.
        const art = section.querySelector<HTMLElement>("[data-stack-art]");

        // ⚠️ Nada de esto puede terminar después de 1, y el stagger cuenta.
        //
        // Un timeline scrubbed reparte su duración TOTAL sobre el rango de
        // scroll, y esa total es el final del último tween — stagger incluido.
        // Con un escalonado que empujaba el cierre a 1.28, los 800px del tramo
        // pasaban a cubrir 1.28 de timeline: el clip (que dura 1) terminaba de
        // abrirse al 78% del scroll y las fichas empezaban a aparecer al 53%, con
        // la caja todavía a media pantalla. Los números se leían bien y el
        // resultado era otro.
        //
        // Con 6 fichas y 0.03 de escalonado, la última arranca en 0.83 y cierra
        // en 0.99. El total sigue siendo 1 y las posiciones significan lo que
        // dicen.
        // ⚠️ `set` + `to`, y NUNCA `from` con stagger.
        //
        // Un `.from()` con `stagger` dentro de un timeline scrubbed solo deja
        // aplicado el estado inicial del PRIMER elemento: los demás arrancan con
        // sus valores naturales hasta que su sub-tween empieza. El síntoma es
        // exactamente lo que se ve — una ficha correctamente oculta y las otras
        // cinco a plena vista mientras la caja todavía se abre, que es el bug que
        // este bloque existe para evitar.
        //
        // Con el estado inicial declarado a mano y un `.to()` encima, no hay nada
        // implícito: las seis empiezan ocultas, avanzan escalonadas, y al
        // retroceder el scrub vuelven al estado del `set`.
        if (art) {
          gsap.set(art, { autoAlpha: 0 });
          openTl.to(art, { autoAlpha: 1, duration: 0.2 }, 0.62);
        }
        if (cards.length) {
          gsap.set(cards, { autoAlpha: 0, y: 24 });
          openTl.to(
            cards,
            { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.16 },
            0.68,
          );
        }

        // El bloque de contenido de la escena — todo menos el fondo. Se encoge
        // con la caja al salir; ver la nota del hook.
        const inner = section.querySelector<HTMLElement>("[data-stack-inner]");

        /* ── El carrete ───────────────────────────────────────────────────────
         *
         * Dentro de la caja hay más alto del que se ve: la escena ocupa una
         * pantalla y el pie de gobernanza/economía va debajo. Este tramo lo
         * sube, así que las dos notas están en el MISMO negro y aun así hay que
         * scrollear para llegar a ellas.
         *
         * ── El recorrido, y por qué empieza tarde ────────────────────────────
         *
         * De `top top-=1 pantalla` a `bottom bottom`: arranca cuando la escena
         * ya lleva una pantalla plantada y termina justo cuando la caja empieza
         * a cerrarse. Antes de eso no se mueve nada — el visitante tiene una
         * pantalla entera para mirar el ensamble armarse y recorrer sus siete
         * paradas, que es lo que la sección viene a mostrar.
         *
         * El `start` va como función y no como `"top top-=100%"` para no
         * depender de contra qué resuelve ese porcentaje. `innerHeight` no deja
         * lugar a dudas, e `invalidateOnRefresh` lo vuelve a leer al
         * redimensionar.
         *
         * ── La distancia se MIDE, no se declara ──────────────────────────────
         *
         * `scrollHeight - clientHeight` es exactamente lo que sobra del
         * contenido: al final del tramo el fondo del carrete queda a ras del
         * fondo de la caja, ni un píxel de más. Escrita a mano, la distancia se
         * desincroniza en cuanto el pie cambie de largo —otra nota, un párrafo
         * más, otro breakpoint— y el síntoma sería texto cortado por el filo o
         * un hueco negro al final.
         *
         * `ease: "none"` porque esto NO es una animación: es scroll. Cualquier
         * curva haría que el contenido se moviera a distinta velocidad que la
         * rueda, que es la definición de scroll roto.
         */
        const reel = section.querySelector<HTMLElement>("[data-stack-reel]");
        const reelTl =
          reel && box
            ? gsap.fromTo(
                reel,
                { y: 0 },
                {
                  y: () => -Math.max(0, reel.scrollHeight - box.clientHeight),
                  ease: "none",
                  scrollTrigger: {
                    trigger: section,
                    start: () => `top top-=${window.innerHeight}`,
                    end: "bottom bottom",
                    scrub: true,
                    invalidateOnRefresh: true,
                    markers: DEBUG_MARKERS,
                  },
                }
              )
            : null;

        const shutTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
            markers: DEBUG_MARKERS,
          },
        });

        shutTl.fromTo(
          box,
          { clipPath: open },
          {
            clipPath: shut,
            ease: "power2.inOut",
            duration: 1,
            // `immediateRender: false` o este `from` se aplica al construir el
            // timeline y pisa al de arriba: la caja nacería abierta y el tramo de
            // apertura no tendría nada que abrir.
            immediateRender: false,
          },
          0,
        );

        if (inner) {
          // Misma posición, misma duración y misma curva que el clip: los dos
          // cuelgan del mismo scrub, así que el filo de la caja y el borde del
          // contenido llegan juntos a cada cuadro. Con easings distintos el texto
          // adelantaría o atrasaría al filo y volvería a asomar cortado en el
          // medio del recorrido.
          //
          // `transformOrigin` al centro (el que ya trae GSAP) porque el `inset`
          // cierra hacia el centro por los cuatro lados.
          shutTl.fromTo(
            inner,
            { scale: 1 },
            {
              scale: FRAME_SCALE,
              ease: "power2.inOut",
              duration: 1,
              immediateRender: false,
            },
            0,
          );
        }

        return () => {
          openTl.scrollTrigger?.kill();
          openTl.kill();
          shutTl.scrollTrigger?.kill();
          shutTl.kill();
          reelTl?.scrollTrigger?.kill();
          reelTl?.kill();
          gsap.set(
            [
              box,
              ...(head ? [head] : []),
              ...(inner ? [inner] : []),
              ...(reel ? [reel] : []),
              ...cards,
              ...(art ? [art] : []),
            ],
            { clearProps: "clipPath,transform,opacity,visibility" },
          );
        };
      });

      return () => mm.revert();
    },
    [enabled],
  );
}

/* ── El pie: gobernanza y economía ────────────────────────────────────────── */

// El pie salió de la escena.
//
// Vivía adentro en pantallas altas y afuera en las bajas, con un umbral de
// 900px de alto de ventana decidiendo cuál. Era un parche razonable mientras el
// pie se consideraba parte de la escena: la escena reparte una pantalla entre
// el titular, el arte y el pie, y el arte se lleva lo que sobra — por debajo de
// ese alto no sobraba lo suficiente y el ensamble quedaba tan chico que las
// cuatro fichas se le acercaban hasta tocarlo.
//
// Ahora va afuera SIEMPRE, y el umbral desaparece. Gobernanza y economía no son
// capas del stack —no tienen pieza en el arte, no entran en el recorrido de las
// seis paradas, no son una de las cuatro fichas— y meterlas en la misma
// pantalla las hacía parecer un quinto elemento del mismo orden. Afuera se leen
// por lo que son: dos notas que cierran el tema.
//
// Y el arte gana el alto que ocupaban, en todas las ventanas.
//
// ── Con caja el pie sigue adentro, pero DEBAJO ─────────────────────────────
//
// En modo `frame` no puede irse afuera: el montaje de afuera es una sección
// hermana con su propio `bg-ink` a sangre, y fuera del recorte aparece como una
// banda negra pegada bajo la caja, que la deja de leerse como caja.
//
// Pero tampoco comparte pantalla con la escena, que era el otro extremo. Va
// dentro del mismo negro y una pantalla más abajo: el carrete de
// `useFrameReveal` sube el contenido de la caja con el scroll, así que la
// escena ocupa el viewport entero y estas dos notas se alcanzan scrolleando,
// sin salir del recorte.
//
// ── El acomodo: una regla y dos extremos ───────────────────────────────────
//
// Un filete cruza el bloque entero y debajo cuelgan las dos notas, una contra
// cada borde y alineadas hacia afuera. No es una retícula de dos columnas
// centrada: son dos extremos, y el filete es lo que dice que pertenecen al
// mismo renglón.
//
// La medida de línea se mantiene corta (~38ch) aunque el bloque sea ancho. Es
// lo que hace que se lean como dos NOTAS al pie y no como dos columnas de
// texto corrido; con la línea larga, los dos párrafos se tocan en el medio y el
// espacio que los separa deja de existir.

function StackNotes() {
  return (
    <div>
      {/* El filete. Cruza el bloque entero y es lo único que ata las dos notas:
          sin él son dos textos sueltos en las esquinas opuestas de una banda
          negra. */}
      <span aria-hidden="true" className="block h-px w-full bg-cream/20" />

      <div className="mt-9 grid gap-12 sm:grid-cols-2 sm:gap-16 lg:mt-11">
        {STACK_NOTES.map((note, i) => {
          // La segunda nota se alinea hacia AFUERA, contra el borde derecho.
          // Es posicional a propósito y no un campo de la copy: la alineación
          // depende de en qué mitad del bloque cae la nota —dónde está su
          // borde— y eso lo sabe el layout, no el texto.
          const right = i % 2 === 1;
          return (
            <div
              key={note.label}
              className={`flex flex-col gap-3 ${right ? "sm:items-end sm:text-right" : ""}`}
            >
              <Eyebrow className="text-cream/70">{note.label}</Eyebrow>
              {/* `max-w` en `ch` y no en px: lo que tiene que quedar constante
                  es la medida de línea, no el ancho de la caja.

                  `cream/70` (~8.5:1) y no `/50` (~5.2:1). El 50% venía de
                  cuando esto era el pie DE LA ESCENA y tenía que ceder ante el
                  subtítulo del titular: pasaba AA por poco, y el escalón
                  siguiente (40%) ya caía a ~3.9:1. Fuera de la escena no
                  compite con nada. */}
              <p className="max-w-[38ch] text-body-sm text-cream/70 text-pretty">
                {note.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * El pie cuando la ventana es baja: debajo del gráfico, en el último scroll.
 *
 * Los dos montajes son el MISMO componente y se excluyen por media query de
 * `display`, no por opacidad ni por visibilidad: un `display: none` no lo lee
 * ningún lector de pantalla, así que el contenido nunca se anuncia dos veces
 * aunque esté dos veces en el árbol.
 *
 * `bg-ink` propio: la escena de arriba lo trae de su `<section>`, y esta es otra
 * — sin él, el pie caería sobre el fondo de la página y el negro se cortaría
 * justo donde termina el sticky.
 */
function StackNotesSection() {
  return (
    // El aire de abajo es un tercio del de arriba, y no por asimetría gratuita:
    // lo que sigue es el tramo negro de la transición, que YA es aire. Con el
    // padding completo, entre el último renglón y el revelado había medio
    // viewport de negro sin nada que mirar — y el gesto tiene que arrancar
    // apenas el texto sale, no un respiro después.
    //
    // No baja a cero porque sin motion no hay tramo, y esto es todo lo que
    // separa el último renglón de la sección siguiente.
    // El aire de abajo es el mismo que el de arriba de `ProofDatum`, la sección
    // que sigue: `py-32 lg:py-44`. Sin transición de salida, el corte entre los
    // dos fondos es un borde recto y a la vista, y lo que lo hace leerse como
    // una costura y no como un tropiezo es que el negro y el crema dejen el
    // mismo respiro a cada lado de la línea.
    //
    // ⚠️ Los dos números están acoplados a mano. Si el aire de `ProofDatum`
    // cambia, este tiene que cambiar con él o la costura se desbalancea sin que
    // nada avise.
    <section className="bg-ink pb-32 pt-24 text-cream lg:pb-44 lg:pt-32">
      <Container>
        <StackNotes />
      </Container>
    </section>
  );
}

/* ── Una ficha anclada ────────────────────────────────────────────────────── */

type AnchorLeaf = {
  name: string;
  body: string;
  link?: { label: string; href: string };
};

function Anchor({
  side,
  leaf,
  pieces,
  on,
  solo,
  onSelect,
  className,
}: {
  side: "left" | "right";
  leaf: AnchorLeaf;
  pieces?: readonly string[];
  on: boolean;
  /** Modo «solo la activa»: esta ficha está o no está, sin estados a media tinta. */
  solo: boolean;
  onSelect: () => void;
  className: string;
}) {
  const right = side === "right";

  // ── Las cuatro fichas se ven SIEMPRE al máximo, y eso es deliberado ───────
  //
  // Antes el cuerpo y el encabezado bajaban de tinte cuando la ficha no era la
  // parada activa: `text-cream/40` contra `/80`, la regla en `cream/25` contra
  // el mint. Tres de las cuatro estaban apagadas en todo momento, y como las
  // cuatro capas se leen a la vez —no es un acordeón, están todas escritas—,
  // lo que producía era una pantalla con tres bloques de texto en gris bajo y
  // uno legible.
  //
  // Cuál es la parada activa NO se pierde: lo dice el ARTE, que sigue
  // encendiendo la pieza que corresponde, y ahí es donde el lector está
  // mirando. Los tintes de las fichas solo lo repetían, y lo repetían
  // rompiendo el contraste de las otras tres.
  //
  // Queda `solo` intacto (`homepage-b`), que es otro trato: ahí el cuerpo de
  // las inactivas no está atenuado sino AUSENTE, y el encabezado es lo único
  // que distingue cuál está abierta.
  const head = solo ? on : true;

  // Solo el host, sin verbo.
  //
  // Fue "Visit near.ai" (el label largo del contenido), después "VISIT NEAR.AI"
  // en versalitas, y ahora el dominio pelado. Cada paso quitó una palabra que
  // no hacía falta: al lado de un nombre en mono, el verbo no dice nada que el
  // dominio no diga ya —un dominio ES una dirección adonde ir— y en cuatro
  // fichas se repite cuatro veces. Lo que queda es el dato.
  const visit = leaf.link ? leaf.link.href.replace(/^https?:\/\//, "") : null;

  return (
    <div
      data-stack-card
      className={`pointer-events-auto absolute w-[24rem] ${className} flex flex-col gap-3 ${
        right ? "items-end text-right" : "items-start"
      }`}
    >
      {/* Nombre y destino en la misma línea de base, en extremos opuestos, con
          la regla debajo cruzando la ficha entera. La regla es lo que convierte
          dos textos sueltos en un encabezado. */}
      <div className="w-full">
        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 ${
            right ? "flex-row-reverse" : ""
          }`}
        >
          {/* `whitespace-nowrap`: el nombre es una unidad y no parte nunca. Si
              no entra junto al destino, es el destino el que baja de línea
              —para eso el `flex-wrap` de arriba—; un "NEAR / Protocol" cortado
              en dos deja de leerse como el rótulo de la capa.

              El `text-left`/`text-right` tampoco es opcional: un <button> trae
              `text-align: center` del user-agent, así que no hereda la
              alineación de la ficha y su contenido se centra solo. */}
          <button
            type="button"
            onClick={onSelect}
            className={`cursor-pointer whitespace-nowrap text-h4-mono transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-mint ${
              right ? "text-right" : "text-left"
            }`}
          >
            {/* Los cuatro nombres van de un solo color. "NEAR.com" tenía la
                marca en `cta-mint` y el dominio en crema —era el único partido
                en dos— y con las cuatro fichas encendidas a la vez esa ficha
                pasaba a ser la destacada de la escena sin que nadie lo hubiera
                decidido: el verde es el color con el que el arte marca lo
                activo. Fuera de ahí, no marca nada. */}
            <span className={head ? "text-cream" : "text-cream/70"}>
              {leaf.name}
            </span>
          </button>

          {visit && (
            <span
              className={`whitespace-nowrap uppercase text-caption-mono transition-colors duration-300 ${
                head ? "text-cream/70" : "text-cream/60"
              }`}
            >
              {visit}
            </span>
          )}
        </div>

        <span
          aria-hidden="true"
          className={`mt-1.5 block h-px transition-colors duration-500 ${
            head ? "bg-cta-mint" : "bg-cream/25"
          }`}
        />
      </div>

      {/* ── El cuerpo ────────────────────────────────────────────────────────
          En modo `solo`, esto es lo único que aparece y desaparece: los cuatro
          ENCABEZADOS se quedan —el lector siempre sabe cuántas capas hay, cómo
          se llaman y a qué dominio van— y el detalle es solo el de la activa.

          `invisible`/`opacity-0` y NO `hidden`: el espacio se reserva igual.
          Las dos fichas de abajo están ancladas por su borde inferior, así que
          un cuerpo que desaparece del flujo les empujaría el encabezado hacia
          abajo — y los títulos, que son justamente lo que tiene que quedarse
          quieto, saltarían en cada parada.

          `aria-hidden` acá y no en la ficha entera: los nombres siguen
          anunciándose, que es exactamente lo que se ve. */}
      <div
        aria-hidden={solo && !on ? true : undefined}
        className={`flex flex-col gap-3 ${right ? "items-end" : "items-start"} ${
          solo
            ? `transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                on ? "visible opacity-100" : "invisible opacity-0"
              }`
            : ""
        }`}
      >
        <p className="text-body-sm text-cream/80 text-pretty">{leaf.body}</p>

        {/* Las piezas de la capa, separadas por un punto medio.
      
          Fueron viñetas cuadradas —un cuadrito antes de cada nombre— y la idea
          era marcarlas como enumeración sin gastar una viñeta redonda, que
          habría leído como lista de producto. El problema es que la solución
          era del mismo tipo que el problema: para decir «esto es una lista»
          dibujaba tres objetos, y tres objetos junto a un ensamble isométrico
          es exactamente lo que la sección no necesita.
      
          El punto medio hace el mismo trabajo con tipografía: separa sin
          existir como forma. Y lo que ya distingue estas piezas de las
          capacidades de abajo no es la decoración sino el registro — estas son
          nombres propios en sans, aquellas atributos en mono entre corchetes.
          Con esa diferencia hecha, la viñeta no aportaba nada.
      
          El separador va `aria-hidden` y en un `<span>` propio: la semántica de
          lista ya la dan `<ul>`/`<li>`, y un lector de pantalla que anuncie
          «punto medio» entre cada item está leyendo decoración. */}
        {pieces && (
          <ul
            className={`flex flex-wrap items-center gap-x-2.5 gap-y-1.5 ${
              right ? "justify-end" : ""
            }`}
          >
            {pieces.map((piece, i) => (
              <li key={piece} className="flex items-center gap-2.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-cream/40">
                    ·
                  </span>
                )}
                {/* El mismo crema que el cuerpo, no el pleno: con el peso en bold,
                  el blanco al 100% los sacaba del párrafo en vez de destacarlos
                  dentro de él. `cream/80` sigue en ~10:1 sobre `--ink`, así que
                  el peso hace el trabajo y el color no lo duplica. */}
                {/* ds-exempt: nombres de producto, más pesados que su enumeración */}
                <span className="text-body-sm font-bold text-cream/80">
                  {piece}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Acá iban las seis capacidades entre corchetes —[ CONFIDENTIAL ],
          [ CROSS-CHAIN ], …— repetidas idénticas en las cuatro fichas. La
          repetición ERA el mensaje (son propiedades del stack, no de una capa;
          el argumento sigue escrito en `STACK_CAPABILITIES`), pero en pantalla
          no se leía como una afirmación: se leía como el pie de cada ficha, y
          cuatro pies iguales pasan a ser textura. Se quitaron de estas dos
          rutas; la lista sigue exportada y `homepage-a` y `StackAtlas` la
          siguen montando. */}
      </div>
    </div>
  );
}
