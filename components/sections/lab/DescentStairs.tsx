"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { createVideoScrub } from "@/components/primitives/motion/videoScrub";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "@/components/sections/home-v2/heroGeometry";
import { BARS_STATEMENT } from "@/components/sections/home-v2/homeV2Content";
import { descentFn, type CurveKey } from "./descentCurves";
import DescentDebug, { useDescentReadout } from "./DescentDebug";

// ── La escalera que se dibuja de los bordes al centro ────────────────────────
//
// Lo que cambia respecto al original, y es TODO lo que cambia:
//
// Hoy el `core` —el bloque gris uniforme de cada columna— crece en las SIETE
// columnas a la vez, en el 12% inicial del recorrido. Como todas suben juntas, el
// borde superior del gris es una línea horizontal recta de borde a borde: la "barra
// gris abajo". Recién después entran los escalones y esa línea se va rompiendo.
//
// Acá cada COLUMNA COMPLETA se revela en su turno —escalón superior, bloque central y
// escalón inferior a la vez, como la única figura que son—, de los extremos al centro.
// El borde superior del gris nunca es recto: nace con forma de escalón y se cierra
// hacia el centro. La banda plana no existe en ningún frame.
//
// Y el statement no espera quieto a que el hero se retire: sube montado en el último
// turno, que es el de la columna central — el valle, lo último en cerrarse.
//
// ── Lo que esto rompe, y de ahí las dos variantes ─────────────────────────────
// El core era la TAPA: creciendo primero y en todo el ancho, era lo que impedía ver
// el fondo de la página por debajo del hero. Si ahora crece por turnos, en las
// columnas que todavía no subieron no hay nada de gris, y esa franja está por debajo
// del fondo del hero, donde no hay imagen.
//
// Las dos variantes son dos respuestas a "qué se ve en esos huecos":
//
//   · `extended` — la imagen del hero se estira hacia abajo, así detrás del gris
//     siempre hay montaña y los huecos muestran imagen. El hero sigue saliendo a la
//     velocidad del scroll.
//   · `sticky`   — el hero se queda pegado mientras la escalera se dibuja, así su
//     imagen cubre toda la zona hasta que la figura está completa. Más control, pero
//     el track añade scroll a la página y todo lo que viene después espera.

export type Backdrop = "extended" | "sticky";

/**
 * Qué se le hace a la figura de la escalera.
 *
 * ── El error que `grow` arrastra, y por qué existen los otros dos ────────────
 * `grow` anima el TAMAÑO de las piezas (acá con clip-path; antes con scaleY). Animar
 * el tamaño obliga a pasar por estados en los que la silueta todavía no existe: el
 * `core` es la pieza más grande y la que cubre la juntura, así que crece primero, y
 * mientras crece ES UN RECTÁNGULO. La banda gris plana del arranque no es un problema
 * de timing — es el estado intermedio inevitable de escalar un rectángulo. Mover
 * cuándo aparece no la elimina, y eso costó cinco intentos.
 *
 * `static` y `slide` parten de la figura COMPLETA desde el primer frame, así que no
 * hay ningún estado sin forma:
 *
 *  · `static` — no se anima nada. El scroll descubre la escalera, que ya tiene su
 *    silueta. Desde el primer píxel asoma el borde escalonado.
 *  · `slide`  — cada columna arranca algo más abajo y SUBE a su sitio, en turnos de
 *    los extremos al centro. Hay movimiento, pero lo que se mueve es la posición de
 *    una figura ya formada: no puede degenerar en rectángulo.
 */
export type Figure = "grow" | "static" | "slide";

const u = (n: number) => `calc(var(--u) * ${n})`;

// Las 7 columnas: `offset + height` suma siempre 1.5, así que todas terminan a la
// misma altura. La central va sin escalón — es el valle, el punto más bajo de la V.
const COLUMNS: ({ offset: number; height: number } | null)[] = [
  { offset: 0, height: 1.5 },
  { offset: 0.5, height: 1 },
  { offset: 1, height: 0.5 },
  null,
  { offset: 1, height: 0.5 },
  { offset: 0.5, height: 1 },
  { offset: 0, height: 1.5 },
];

// ── El reparto ───────────────────────────────────────────────────────────────
// Un turno por anillo, de los extremos al centro. Tres decisiones, y las tres salieron
// de ver fallar la versión anterior:
//
// 1. TODAS LAS COLUMNAS SUBEN A LA MISMA VELOCIDAD. Las columnas no miden lo mismo:
//    con u=276px y un bloque de 1353px, la exterior recorre 1353px y la central 526px
//    — un factor de 2.6. Dándoles la misma duración, la exterior sube 2.6 veces más
//    rápido, y eso es lo que se lee como "los escalones son más altos de lo que
//    deberían": no es su tamaño, es su velocidad. La duración de cada una es ahora
//    proporcional a su recorrido.
//
// 2. CADA COLUMNA SUBE LINEAL. Con una curva agresiva por columna, el 57% final de la
//    altura se recorría en el 27% final del tiempo: la columna parecía quieta y de
//    golpe se disparaba fuera de la pantalla. Ese salto es lo que hacía parecer que
//    una terminaba mucho antes de que arrancara la siguiente.
//
// 3. LA CURVA GOBIERNA LA SECUENCIA, NO CADA COLUMNA. "el bezier de columnas empiece
//    lento y después rápido" se aplica al reloj de la escena entera: los primeros
//    pares se toman su tiempo y los últimos se encadenan rápido. Cada columna, por
//    dentro, sube a velocidad pareja.

/** fps del mp4 del hero. Medido con ffprobe; ver HeroVideo.tsx. */
const FPS = 24;

/** Píxeles que sube una columna por unidad de timeline. Fija el ritmo de todas. */
const COLUMN_SPEED = 4200;

// A qué fracción de la pantalla releva un par al siguiente. El relevo es por POSICIÓN
// y no por tiempo: así se ve igual en cualquier ventana. Con las columnas subiendo
// lineal, la conversión de altura a tiempo es directa — ya no hace falta invertir una
// curva.
const HANDOFF_VH = 0.5;

/** Cuánto recorrido queda después del último turno, para que el cierre respire. */
const TAIL = 0.12;

// De cuánto sube el statement, en fracción de su propia altura, y con qué curva.
// Sube montado en el último turno: arranca cuando arranca el core de la columna
// central y termina con él.
const TEXT_RISE = 0.35;

// Cuánto se estira la imagen por debajo del hero en la variante `extended`. Tiene
// que cubrir la franja de la escalera (u*1.5) más el aire del statement, o los
// huecos que aún no subieron muestran fondo de página en vez de montaña.
const ART_OVERHANG = 3.5;

// Cuánto más abajo arranca una columna en el modo `slide`, en unidades de `--u`.
// Tiene que ser poco: es un acomodo, no una entrada desde fuera de pantalla. Con
// mucho, el borde superior baja tanto que la silueta deja de leerse como escalera.
const SLIDE_OFFSET = 0.75;

// Recorrido extra del track en la variante `sticky`, en svh.
//
// Baja de 90 a 70 por lo mismo que la curva de abajo: con 90svh y la curva `c` había
// que scrollear 416px antes de ver asomar la escalera. El recorrido sigue siendo amplio
// (815px en una ventana de 1164) — lo que se acorta es la espera, no la secuencia.
const STICKY_TRAVEL = "70svh";

// La curva del CONJUNTO: la secuencia de columnas arranca lenta y se encadena rápido.
// No se aplica a cada columna (ver el punto 3 del reparto), sino al progreso del
// timeline completo — el mismo mecanismo que el resto del laboratorio.
//
// Se reutiliza la familia medida de `descentCurves`.
//
// ── Por qué NO es la curva más marcada ──────────────────────────────────────
// Medido: cuánto scroll hace falta para que el primer par asome (llegue al 20% de su
// recorrido), con un track de 70svh en una ventana de 1164px:
//
//   curva   vel. inicial   scroll hasta verla
//     c        0.01×            324px
//     e        0.25×            206px    ←
//     f        0.41×            171px
//
// Toda bezier con el primer control point en y=0 arranca con velocidad CERO, y eso se
// paga en espera: con `c` había que scrollear más de 400px antes de que pasara nada
// visible.
//
// `e` es el punto elegido: arranca a 0.25× y termina a 1.95×, así que acelera casi 8
// veces — bastante más contraste que `f` (5×) — y aun así se mueve desde el primer
// píxel. Es el arranque más marcado que se puede tener sin volver a la espera de `c`.
const SEQUENCE_CURVE: CurveKey = "e";

/**
 * Reparto de los cuatro turnos: cuándo arranca cada uno y cuánto dura.
 *
 * La altura de una columna sale de su escalón: `H - 2·u·offset`, porque la muesca
 * superior y la inferior son simétricas. La central no tiene escalón, así que su
 * offset efectivo es 1.5 — es el valle, la columna más corta.
 *
 * El relevo se acumula: cada turno arranca cuando el anterior alcanzó
 * `HANDOFF_VH` de la pantalla, no en un múltiplo fijo.
 */
function planTurns(barsHeight: number, unitPx: number, viewportHeight: number) {
  const offsets = [0, 0.5, 1, 1.5]; // por anillo; el último es el valle
  const target = HANDOFF_VH * viewportHeight;

  const turns: { at: number; duration: number }[] = [];
  let at = 0;

  for (const offset of offsets) {
    const travel = Math.max(1, barsHeight - 2 * unitPx * offset);
    const duration = travel / COLUMN_SPEED;
    turns.push({ at, duration });

    // Cuánto de ESTE turno hace falta para que su borde llegue a la altura de relevo.
    // Lineal, así que es una regla de tres; y topado a su propia duración, porque una
    // columna más corta que el objetivo releva recién al terminar.
    at += Math.min(duration, (target / travel) * duration);
  }

  return turns;
}

export default function DescentStairs({
  backdrop,
  figure = "grow",
  debug = false,
}: {
  backdrop: Backdrop;
  figure?: Figure;
  debug?: boolean;
}) {
  const readout = useDescentReadout(debug);
  const sticky = backdrop === "sticky";

  const rootRef = useMotionScope<HTMLDivElement>(({ q, motionOk }) => {
    if (!motionOk) return;
    // En `static` la figura no se anima, pero el resto del recorrido —el scrub del
    // vídeo, el velo, la entrada del statement— sí sigue vivo.

    const hero = q("[data-lab-hero]")[0];
    const track = q("[data-lab-track]")[0];
    const bars = q("[data-lab-bars]")[0];
    const video = q("[data-hero-bg]")[0] as HTMLVideoElement | undefined;
    const fade = q("[data-hero-topfade]")[0];
    const text = q("[data-lab-text]")[0];
    const slab = q("[data-lab-slab]")[0];
    const cols = q("[data-qbar-col]");
    if (!hero || !bars || cols.length !== COLUMNS.length) return;

    const cleanups: (() => void)[] = [];

    // La curva del conjunto se aplica al progreso del timeline, en el onUpdate.
    const ease = descentFn(SEQUENCE_CURVE);

    // ── La escalera, por turnos ──────────────────────────────────────────────
    //
    // El timeline se RECONSTRUYE en cada refresh, no se crea una vez: los turnos salen
    // de medir el bloque, la unidad y el viewport, así que un resize los cambia. Uno
    // construido al montar quedaría con el reparto de la ventana de entonces.
    let stairs = gsap.timeline({ paused: true });

    // ── Por qué `clip-path` y no `scaleY` ───────────────────────────────────
    // Cada columna son TRES piezas contiguas: el escalón superior, el bloque central
    // y el escalón inferior. Juntas forman una columna continua con una muesca arriba
    // y otra abajo.
    //
    // Escalarlas por separado no funciona —cada una crece desde su propio borde
    // inferior y se separan, así que en vez de una figura subiendo se ven tres bloques
    // flotando— y escalar el contenedor deformaría el escalón.
    //
    // `clip-path: inset(P% 0 0 0)` revela de abajo hacia arriba sin deformar nada: las
    // tres piezas aparecen como lo que son, una sola figura que emerge.
    const buildStairs = () => {
      stairs.kill();
      stairs = gsap.timeline({ paused: true });

      const turns = planTurns(
        bars.offsetHeight,
        window.innerWidth / COLUMNS.length,
        window.innerHeight
      );
      const last = turns[turns.length - 1];

      const unitPx = window.innerWidth / COLUMNS.length;

      cols.forEach((col, i) => {
        // 0 para el par exterior … 3 para la central.
        const ring = Math.min(i, cols.length - 1 - i);
        const turn = turns[ring];

        if (figure === "grow") {
          gsap.set(col, { clipPath: "inset(100% 0% 0% 0%)" });
          // `ease: "none"` a propósito: la columna sube a velocidad pareja y la curva
          // la pone el reloj de la escena.
          stairs.to(
            col,
            { clipPath: "inset(0% 0% 0% 0%)", duration: turn.duration, ease: "none" },
            turn.at
          );
          return;
        }

        // `static` y `slide`: la silueta está COMPLETA desde el primer frame. Nada de
        // clip, nada de escala — no hay estado intermedio en el que la columna sea un
        // rectángulo, que es de donde salía la banda gris.
        gsap.set(col, { clearProps: "clipPath" });

        if (figure === "slide") {
          // Arranca un poco más abajo y se acomoda en su turno. Lo que se mueve es la
          // POSICIÓN de una figura ya formada.
          gsap.set(col, { y: unitPx * SLIDE_OFFSET });
          stairs.to(col, { y: 0, duration: turn.duration, ease: "none" }, turn.at);
        }
      });

      // ── El statement sube con el escalón central ───────────────────────────
      //
      // En `sticky` no se anima el texto por separado: sube EL BLOQUE entero, y el
      // texto va dentro. Es lo que pedía "que el texto empiece a subir con ese escalón
      // central" — y de paso resuelve que el statement esperaba fuera de pantalla,
      // porque el anclaje deja el bloque asomando solo por su franja de escalones.
      //
      // Cuánto sube: lo justo para que el statement quede centrado en la ventana al
      // final del recorrido. Sale de medir, no de una constante — depende del alto del
      // bloque, que depende del texto.
      if (slab) {
        const rise =
          window.innerHeight / 2 -
          bars.offsetHeight / 2 -
          (window.innerHeight - (window.innerWidth / COLUMNS.length) * 1.5);
        gsap.set(slab, { y: 0 });
        stairs.to(
          slab,
          { y: rise, duration: last.duration + TAIL, ease: "none" },
          last.at
        );
      } else if (text) {
        // En `extended` el bloque está en flujo y lo sube el scroll: solo el texto
        // necesita su entrada.
        gsap.set(text, { yPercent: TEXT_RISE * 100, autoAlpha: 0 });
        stairs.to(
          text,
          { yPercent: 0, autoAlpha: 1, duration: last.duration, ease: "none" },
          last.at
        );
      }

      // Cola muerta: sin esto el timeline termina con el último turno y el recorrido de
      // scroll se reparte solo entre los cuatro.
      stairs.to({}, { duration: TAIL }, last.at + last.duration);
    };

    buildStairs();

    // ── El recorrido ─────────────────────────────────────────────────────────
    const scrub = video ? createVideoScrub(video, { fps: FPS }) : null;
    if (scrub) cleanups.push(scrub.destroy);

    const trigger = sticky ? (track ?? hero) : bars;

    const st = ScrollTrigger.create({
      trigger,
      // En `sticky` el recorrido es el del track. En `extended`, el mismo criterio
      // que el QuantumBars original: se compensa el solape con el hero para que el
      // progreso arranque en cero y no con las barras ya medio crecidas.
      start: sticky
        ? "top top"
        : () => {
            const top = trigger.getBoundingClientRect().top + window.scrollY;
            return `top+=${Math.max(0, window.innerHeight - top)} bottom`;
          },
      end: sticky ? "bottom bottom" : () => `+=${window.innerHeight * 1.6}`,
      invalidateOnRefresh: true,
      markers: DEBUG_MARKERS,
      onUpdate: (self) => {
        const p = self.progress;
        // La curva va acá, sobre el reloj de la escena: la secuencia de columnas
        // arranca lenta y se encadena rápido, mientras cada columna sube pareja.
        stairs.progress(ease(p));
        scrub?.setProgress(p);
        if (fade) gsap.set(fade, { opacity: Math.min(1, p * 2.5) });
        if (debug) {
          hero.dataset.labProgress = String(p);
          hero.dataset.labHold = "0";
        }
      },
      onRefresh: (self) => {
        buildStairs();
        stairs.progress(ease(self.progress));
      },
    });
    stairs.progress(ease(st.progress));

    return () => {
      for (const fn of cleanups) fn();
      stairs.progress(1);
      gsap.set(cols, { clearProps: "clipPath,transform" });
      if (slab) gsap.set(slab, { clearProps: "transform" });
    };
  }, [backdrop, debug]);

  const heroInner = (
    <>
      {/* El vídeo real, no un póster: el descenso de cámara es buena parte de lo que
          se siente, y sin él la comparación contra /real no vale.

          En `extended` se estira ART_OVERHANG unidades por debajo del hero para que
          los huecos de la escalera que aún no subieron muestren montaña y no fondo de
          página. En `sticky` no hace falta: el hero está pegado y cubre igual. */}
      <video
        data-hero-bg
        data-lab-art
        src="/prototype/v2/hero-descent.mp4"
        poster="/prototype/v2/hero-descent-poster.jpg"
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 w-full object-cover object-bottom"
        style={{ height: backdrop === "extended" ? `calc(100% + ${u(ART_OVERHANG)})` : "100%" }}
      />

      {/* Velo permanente: tapa con crema el 20% superior y lo suelta hacia abajo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] h-[82%] w-full"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--cream) 0%, var(--cream) 20%, transparent 100%)",
        }}
      />
      {/* Velo ligado al scroll. */}
      <div
        data-hero-topfade
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] h-[60%] w-full opacity-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--cream) 0%, rgba(245,244,241,0.9) 30%, transparent 100%)",
        }}
      />

      <div aria-hidden="true" className="h-[5.5rem] shrink-0" />

      <Container className="relative z-[2] flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-display text-balance">
          Own your <Accent display>world.</Accent>
        </h1>
        <p className="max-w-xl text-body-lg text-muted-foreground text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of
          DeFi from your own wallet.
        </p>
      </Container>
    </>
  );

  const barsBlock = (
    <section
      data-lab-bars
      style={
        {
          "--u": HERO_UNIT,
          ...(sticky ? {} : { marginTop: "calc(-1 * var(--u) * 1.5 - 2px)" }),
        } as React.CSSProperties
      }
      className="relative z-[2] text-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex">
          {COLUMNS.map((cap, i) => (
            <div key={i} data-qbar-col className="relative flex-1">
              <div
                data-qbar-core
                className="absolute inset-x-0 bg-bar"
                style={{ top: u(1.5), bottom: u(1.5) }}
              />
              {cap && (
                <>
                  <div
                    data-qbar-top
                    className="absolute inset-x-0 bg-bar"
                    style={{ top: u(cap.offset), height: `calc(${u(cap.height)} + 1px)` }}
                  />
                  <div
                    data-qbar-bottom
                    className="absolute inset-x-0 bg-bar"
                    style={{ bottom: u(cap.offset), height: `calc(${u(cap.height)} + 1px)` }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <Container className="relative py-[calc(var(--u)*2)]">
        <p data-lab-text className="text-h2 text-pretty">
          {BARS_STATEMENT}
        </p>
      </Container>
    </section>
  );

  return (
    <>
      {debug && (
        <DescentDebug
          approach={
            sticky
              ? "C · escalera por turnos, hero pegado"
              : "A · escalera por turnos, imagen estirada"
          }
          curve="power2.out por turno"
          readout={readout}
        />
      )}

      <div ref={rootRef}>
        {sticky ? (
          <section
            data-lab-track
            style={
              { "--u": HERO_UNIT, height: `calc(100svh + ${STICKY_TRAVEL})` } as React.CSSProperties
            }
            className="relative bg-cream text-foreground"
          >
            <div className="sticky top-0 h-svh overflow-hidden">
              <div data-lab-hero className="relative flex h-full flex-col">
                {heroInner}
              </div>
              {/* ── El anclaje, que es lo que estaba mal ────────────────────
                  Antes iba con `bottom-0`. El bloque de barras mide MÁS que la
                  pantalla (1353px contra 1164 en una ventana de 1930 de ancho), así
                  que anclado al fondo cubría todo el viewport al revelarse y el hero
                  desaparecía detrás: lo que se leía como "la escalera llega más
                  arriba" era el borde superior del bloque, que no tenía que estar ahí.

                  `top: 100svh - u*1.5` replica el `margin-top: -u*1.5` del original:
                  solo la franja de escalones (u*1.5) queda en pantalla, el core
                  arranca exactamente en el fondo del viewport y el statement espera
                  fuera, abajo. El hero se ve completo mientras la escalera se dibuja
                  en su borde inferior — que es la composición de la página real. */}
              <div
                data-lab-slab
                className="absolute inset-x-0"
                style={{ top: "calc(100svh - var(--u) * 1.5)" }}
              >
                {barsBlock}
              </div>
            </div>
          </section>
        ) : (
          <>
            <section
              data-lab-hero
              style={{ "--u": HERO_UNIT, height: "100svh" } as React.CSSProperties}
              className="relative flex flex-col bg-cream text-foreground"
            >
              {heroInner}
            </section>
            {barsBlock}
          </>
        )}

        <section className="bg-background py-40">
          <Container>
            <p className="text-body-lg text-muted-foreground">
              Sección siguiente. En la página real acá va OwnYourOwn.
            </p>
          </Container>
        </section>
      </div>
    </>
  );
}
