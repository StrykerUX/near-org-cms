"use client";

import Image from "next/image";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { STACK_INTRO as INTRO } from "@/components/sections/homepage-shared/nearStackContent";

// La obertura del stack: el título llega antes que la sección, sobre crema, y
// el negro lo alcanza ahí.
//
// ── Qué reemplaza ───────────────────────────────────────────────────────────
//
// A la cortina (`InkCurtain direction="down"`). Aquella resolvía el corte
// haciendo subir un panel negro sobre una pantalla vacía: correcto, pero el
// gesto no decía nada — era un cambio de color con buena curva.
//
// ── El motivo, y por qué rima con el hero ───────────────────────────────────
//
// En el hero el titular se queda QUIETO y lo que cambia es el mundo alrededor:
// el paisaje se comprime y va dejando ver el crema. Acá pasa lo mismo al revés:
// el título se queda quieto y el fondo se da vuelta debajo de él.
//
// Y hay una segunda rima, que es la que cierra el gesto: el título **cambia de
// rol**. Nace grande y solo en el centro de la pantalla, y termina siendo el
// encabezado de la escena — el mismo nodo cumpliendo dos funciones, igual que
// `your` dejó de ser una palabra para volverse un objeto.
//
// ── La inversión, y por qué son DOS títulos ─────────────────────────────────
//
// El texto no cambia de color: se INVIERTE por donde el negro ya pasó.
//
//     The NEAR Stack     ← negro sobre crema
//     The NEAR ███ck     ← el negro va llegando; lo que cruzó, es blanco
//     ███████████████    ← blanco sobre negro
//
// Eso se consigue con dos copias del título, una encima de la otra y en la
// misma posición exacta: la de abajo en tinta, y la de arriba en crema pero
// DENTRO del panel negro. Como el panel se recorta, su copia del texto se
// recorta con él, y la inversión sale sola en el borde del recorte — sin
// máscaras de texto, sin `mix-blend-mode` y sin un solo cálculo por frame.
//
// Es la razón de que el markup repita la frase. Un solo título con el color
// animado daría un cambio de estado plano: se lee como apagar una luz, no como
// que algo pasó por encima.

/** Cuánto scroll cuesta la obertura. */
const TRAVEL = "90svh";

/**
 * Cuánto más grande nace el título respecto del tamaño que tiene como
 * encabezado.
 *
 * Va como escala y no como cambio de `font-size`: el estado FINAL se declara en
 * `text-h2` —el mismo token que usa el encabezado de `StackAnchors`— y lo que
 * se anima es un transform. Así el texto aterriza nítido y en su tamaño real,
 * en vez de quedar en un valor interpolado que no es ninguno de los dos.
 */
const BIRTH_SCALE = 2.4;

const MARK_SRC = "/prototype/homepage-fold/near-mark.svg";

export type StackOvertureProps = {
  /**
   * Cómo llega el negro.
   *
   * `bleed` — **se desborda del texto.** El negro nace en la línea del título y
   *           se abre hacia arriba y hacia abajo hasta llenar la pantalla. El
   *           hero mete el mundo dentro de un objeto; esto es el reverso — un
   *           objeto suelta el mundo.
   * `brush` — **lo trae el objeto del hero.** El cuadro que quedó en
   *           `Own ⬡ world.` baja cruzando la pantalla y deja el negro detrás,
   *           como un pincel. Es la variante que ata las dos secciones de forma
   *           literal: el mismo objeto es quien trae la noche.
   * `cut`   — **sin transición.** El fondo se da vuelta en un frame, seco, como
   *           pasar la página de una revista. Va en contra de todo lo demás,
   *           que es suave; puede ser justo lo que lo haga destacar o puede
   *           leerse como un error de carga. Está acá para poder mirarlo.
   */
  mode: "bleed" | "brush" | "cut";
  /** Cuánto scroll cuesta. */
  travel?: string;
};

export default function StackOverture({ mode, travel = TRAVEL }: StackOvertureProps) {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    // Sin motion: el estado final servido de entrada. Pantalla negra, título ya
    // en su sitio de encabezado. La sección siguiente empalma sin costura y no
    // hay ningún momento en que el lector vea texto negro sobre negro.
    mm.add(MQ.reduce, () => {
      const ink = q("[data-ov-ink]")[0];
      const title = q("[data-ov-title]")[0];
      if (!ink || !title) return;

      gsap.set(ink, { clipPath: "inset(0%)" });
      gsap.set(title, { scale: 1, y: 0 });
      gsap.set(q("[data-ov-brush]"), { autoAlpha: 0 });

      return () => gsap.set([ink, title, ...q("[data-ov-brush]")], { clearProps: "all" });
    });

    mm.add(MQ.motion, () => {
      const ink = q("[data-ov-ink]")[0];
      const titles = q("[data-ov-title]");
      const brush = q("[data-ov-brush]")[0];
      const stage = q("[data-ov-stage]")[0];
      if (!ink || !stage || titles.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          // `bottom bottom` y no `bottom top`, y la diferencia son casi mil
          // píxeles de gesto invisible.
          //
          // El hijo pegado deja de estarlo cuando el fondo de la sección
          // alcanza el fondo del viewport — a partir de ahí sube con el scroll
          // y se va de pantalla. `bottom top` estira el rango hasta que ese
          // fondo llega al TECHO, o sea un viewport entero más tarde: el
          // timeline seguía avanzando con el panel ya fuera de cuadro, y el
          // título terminaba su viaje donde nadie lo veía. En pantalla el
          // gesto se cortaba a mitad.
          //
          // Con `bottom bottom` el final del recorrido coincide con el último
          // frame en que la escena está pegada, que es también cuando la
          // sección siguiente toca el techo con su propio encabezado ya puesto
          // en esta misma coordenada. El relevo entre los dos títulos no se ve.
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      // ── 1. El negro llega ────────────────────────────────────────────────
      if (mode === "bleed") {
        // Sube desde el borde de abajo hasta llenar la pantalla.
        //
        // La primera versión lo abría desde la línea del título hacia los dos
        // lados —«el negro sale del texto»—, y es una idea más literal, pero
        // deja al título partido por la mitad durante todo el tramo: el ojo lee
        // dos medias frases de colores distintos en vez de una frase que se
        // invierte. Subiendo, el filo cruza el texto UNA vez y de lado a lado,
        // que es el gesto que la inversión necesita para leerse.
        //
        // Y es la misma dirección que el resto del sitio: el takeover del
        // footer y la cortina que esto reemplaza también suben.
        tl.fromTo(
          ink,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.55 },
          0
        );
      } else if (mode === "brush") {
        // El negro entra desde arriba y el objeto viaja pegado a su borde: lo
        // que se ve es el cuadro arrastrando la noche detrás de él.
        tl.fromTo(
          ink,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.55 },
          0
        );
        if (brush) {
          // Baja de arriba de la pantalla hasta abajo, siguiendo el filo del
          // recorte. La misma ease que el recorte y el mismo tramo: si se
          // desincronizan, el objeto deja de leerse como la CAUSA del negro y
          // pasa a ser un adorno que cae al mismo tiempo.
          tl.fromTo(
            brush,
            { yPercent: -140, autoAlpha: 1 },
            { yPercent: 100, ease: "power2.inOut", duration: 0.55 },
            0
          );
          tl.to(brush, { autoAlpha: 0, duration: 0.08 }, 0.5);
        }
      } else {
        // Seco. Sin interpolación: el recorte pasa de nada a todo en un frame.
        // `steps(1)` y no una duración corta — una duración corta sigue siendo
        // una transición, solo que rápida, y lo que se busca acá es que NO
        // haya transición.
        tl.fromTo(
          ink,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "steps(1)", duration: 0.02 },
          0.34
        );
      }

      // ── 2. El título toma su puesto ──────────────────────────────────────
      //
      // Las dos copias viajan juntas y con los mismos valores: son el mismo
      // título dibujado dos veces, y cualquier diferencia entre ellas se vería
      // como un fantasma en el borde de la inversión.
      //
      // Arranca DESPUÉS de que el negro terminó de llegar. Los dos a la vez se
      // pisan: el viaje distrae de la inversión, que es el momento que la
      // sección viene a construir.
      tl.fromTo(
        titles,
        { scale: BIRTH_SCALE, y: () => 0.34 * window.innerHeight },
        { scale: 1, y: 0, ease: "power2.inOut", duration: 0.4 },
        0.55
      );

      // ── El apagado ───────────────────────────────────────────────────────
      //
      // En cuanto la escena se despega, se apaga entera.
      //
      // Hace falta por el solape: la sección siguiente empieza un viewport
      // antes, así que cuando esta deja de estar pegada y sube, su panel negro
      // —liso, sin título ya, porque el título salió por arriba— sigue tapando
      // el encabezado del stack durante toda la salida. El lector ve el título
      // llegar a su sitio y desaparecer, y una pantalla de negro vacío antes de
      // que el stack aparezca.
      //
      // Apagarla en ese punto no se ve: la escena siguiente ya está pegada,
      // es del mismo negro, y su encabezado está en la coordenada exacta donde
      // este acaba de aterrizar.
      //
      // `onRefresh` además de `onToggle` por lo de siempre: una recarga a media
      // página nace con el rango ya pasado y nunca cruza nada.
      const sync = (self: ScrollTrigger) =>
        gsap.set(stage, { autoAlpha: self.isActive ? 1 : 0 });

      const gate = ScrollTrigger.create({
        trigger: scope,
        start: "top bottom",
        end: "bottom bottom",
        onToggle: sync,
        onRefresh: sync,
      });

      return () => {
        gate.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([ink, stage, ...titles, ...(brush ? [brush] : [])], { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, [mode]);

  return (
    <section
      ref={rootRef}
      style={{ "--ov-travel": travel } as React.CSSProperties}
      // ── El solape con la sección siguiente ────────────────────────────────
      //
      // `-mb-[100svh]`: la sección mide un viewport de más que su recorrido
      // —lo necesita, un sticky no se pega dentro de un contenedor de su misma
      // altura— y ese viewport de más se descuenta del flujo.
      //
      // Sin el descuento, entre «la obertura deja de estar pegada» y «la escena
      // del stack se pega» hay una pantalla entera de scroll, y durante toda
      // ella se ve el MISMO título dos veces: el de la obertura subiendo con el
      // scroll y el de la sección quieto en su sticky. Lo había tapado apagando
      // el de arriba, que funcionaba pero hacía desaparecer justo el título que
      // el gesto acababa de traer hasta su sitio.
      //
      // Con el solape, el relevo ocurre en un solo frame y en la misma
      // coordenada: la escena se pega exactamente cuando la obertura se
      // despega, y como pinta después en el documento, tapa lo que queda de
      // ella. El título nunca se va — el que se encoge es el que se queda, y el
      // que lo releva es idéntico y está en el mismo píxel.
      // `z-10` es la otra mitad del solape, y sin él lo empeora en vez de
      // arreglarlo: metida la sección siguiente un viewport antes, esta queda
      // ANTES en el documento y por lo tanto DEBAJO en el orden de pintado —
      // la escena del stack se ve por encima de la obertura durante todo el
      // tramo, con sus fichas y su encabezado a la vista mientras el negro
      // todavía está subiendo. Con la capa explícita, la obertura tapa lo que
      // viene hasta que se despega y sube.
      // Sin fondo propio: lo pinta el hijo pegado, que es el que se apaga.
      //
      // Con `bg-cream` acá, la SECCIÓN sigue pintando aunque su contenido esté
      // apagado — y como el solape la deja superpuesta a la escena del stack
      // con `z-10` encima, lo que tapaba era la escena entera. Se veía el
      // encabezado del stack desaparecer y volver una pantalla después, sin
      // ninguna causa visible.
      // `pointer-events-none`, y es la TERCERA pieza del solape.
      //
      // El mismo `-mb-[100svh]` + `z-10` que deja a esta sección tapando el
      // primer viewport del stack la deja también capturándole el puntero, y
      // eso no se ve: la escena de abajo se pinta bien —el hijo pegado ya se
      // apagó— pero no responde. El arte no toma hover y las fichas de NEAR
      // Protocol y NEAR Intents no se pueden clicar, sin nada en pantalla que
      // explique por qué.
      //
      // Se puede apagar entera porque acá no hay nada con lo que interactuar:
      // dos copias de un título y dos paneles de color. Es una transición.
      className="pointer-events-none relative z-10 -mb-[100svh] h-[calc(var(--ov-travel)+100svh)]"
    >
      {/* `overflow-hidden` sobre el hijo pegado y nunca sobre la sección: un
          ancestro con overflow distinto de `visible` se vuelve el contenedor de
          scroll del sticky y este deja de pegarse, en silencio. */}
      <div data-ov-stage className="sticky top-0 h-svh overflow-hidden bg-cream">
        {/* Capa 1 — el mundo claro. El título en tinta, en su sitio final. */}
        <Overlay>
          <h2 data-ov-title className="text-h2 text-balance text-ink">
            {INTRO.lead} <Accent>{INTRO.accent}</Accent>
          </h2>
        </Overlay>

        {/* Capa 2 — el mundo oscuro, recortado. Lleva SU PROPIA copia del
            título, en crema y en la misma posición exacta que la de abajo. Lo
            que se ve del texto claro es exactamente lo que el recorte deja ver
            del negro: la inversión es el borde del recorte, no un cambio de
            color. */}
        <div data-ov-ink className="absolute inset-0 bg-ink">
          <Overlay>
            <h2 data-ov-title className="text-h2 text-balance text-cream">
              {INTRO.lead} <Accent>{INTRO.accent}</Accent>
            </h2>
          </Overlay>
        </div>

        {/* El pincel, solo en `brush`. Es el mismo objeto del hero —mismo mark,
            mismas esquinas blandas— y por eso no lleva el shader: a esta escala
            y en movimiento no se distinguiría, y una segunda instancia de WebGL
            para eso no se paga. */}
        {mode === "brush" && (
          <div
            data-ov-brush
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 z-[1] flex size-[clamp(88px,9vw,148px)] -translate-x-1/2 items-center justify-center rounded-[23%] bg-[linear-gradient(150deg,#d7ecb0_0%,#5f9a63_55%,#12321f_100%)] opacity-0"
          >
            <Image
              src={MARK_SRC}
              alt=""
              aria-hidden="true"
              width={800}
              height={800}
              unoptimized
              className="h-[40%] w-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * La caja del título, idéntica en las dos capas.
 *
 * Existe para que la posición se declare UNA vez. Las dos copias tienen que
 * coincidir al píxel —si no, el borde de la inversión muestra un fantasma de la
 * otra— y dos bloques de clases repetidas a mano divergen en la primera
 * edición.
 *
 * El `pt` es el del encabezado de `StackAnchors`: la reserva del header fijo
 * más su aire. Con él, cuando el título termina su viaje queda exactamente
 * donde el de la sección siguiente ya está, y el relevo entre los dos no se ve.
 */
function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <Container className="absolute inset-x-0 top-0 pt-[calc(var(--site-header-block)+1rem)] text-center">
      {children}
    </Container>
  );
}
