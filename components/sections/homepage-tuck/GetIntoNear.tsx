"use client";

import Link from "next/link";
import { useId } from "react";

import Container from "@/components/primitives/Container";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import {
  DEBUG_MARKERS,
  EASE_OUT,
} from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import {
  GET_INTO_ROWS,
  GET_INTO_TITLE,
  type GetIntoRowId,
} from "@/components/sections/homepage-tuck/getIntoNearContent";

// Las tres puertas de entrada, como tres renglones blancos sobre el papel de la
// página. Cierra la ruta: después del mazo de testimonios —donde hablan
// otros— esto es lo único que le pide algo al visitante.
//
// ── La barra ES la sección ─────────────────────────────────────────────────
//
// Cada renglón lleva una barra de color que no informa nada: no es un progreso,
// no es una métrica, no tiene escala. Es el único gesto que la fila tiene, y
// por eso ocupa el tercio central —más ancho que el nombre de la puerta— en vez
// de ser un adorno al costado. Lo que hace es dar TEMPERATURA a cada puerta:
// tres verdes distintos, tres entradas distintas.
//
// Y son verdes muestreados, no inventados. El artboard tiene tres barras con
// bandas verticales visibles —una rampa de baja resolución escalada— y esas
// bandas son lo que las distingue entre sí; una interpolación limpia de dos
// colores las volvería tres barras iguales con distinto tono. Cómo se
// reconstruyeron está escrito arriba de `RAMPS`.
//
// ── Todo mide en `cqw`, igual que `ProofLedger` ────────────────────────────
//
// El artboard fija PROPORCIONES: la barra empieza al 22.1% del renglón y mide
// el 31.9%, el cuerpo arranca al 58.8%, el disco cierra a 3.8% del borde. En
// `vw` esas relaciones aguantan hasta que el `Container` topa en su
// `max-width` (1780px) y de ahí para arriba el renglón se descompone solo. En
// `cqw` se miden contra el BLOQUE, que es lo que el diseño mide.
//
// Por eso el `@container` de más abajo no es decoración: sin ese elemento cada
// `cqw` resuelve contra el viewport y vuelve exactamente el problema que evita.
//
// ── El corte es `xl` y no `lg` ─────────────────────────────────────────────
//
// La retícula de cuatro columnas tiene un punto de quiebre propio, y no cae en
// el breakpoint de siempre. La columna del nombre es el 15.6% del renglón, pero
// el nombre está en `text-h4`, que baja con su `clamp` MUCHO más despacio que
// el renglón: a 1416px "Trade on NEAR" mide 180px en una columna de 190, y a
// 1024 mide 170 en una de 132. Entre medio la fila se estrangula —el cuerpo
// cae a tres líneas y se sale de la caja— así que abajo de 1280 el renglón se
// apila: nombre y disco arriba, barra al medio, cuerpo abajo.
//
// El `minmax(min-content, 15.6%)` de la primera columna es el seguro para lo
// que queda entre 1280 y 1440: la columna crece si el nombre no entra, y lo
// que cede es el `1fr` del cuerpo. Sin eso, "Integrate NEAR" parte en dos
// líneas y el renglón entero se desarma.

/**
 * Las tres rampas, reconstruidas del artboard.
 *
 * ── De dónde salen los números ─────────────────────────────────────────────
 *
 * Las barras del artboard son una imagen de ~15 columnas escalada a 415px, así
 * que tienen bandas verticales de 28px con bordes DUROS. Se muestreó el color
 * medio de cada banda (promediando en vertical, y descartando 2px de cada lado
 * para no comerse el antialias del borde) y esos quince colores son los que
 * están acá.
 *
 * ── Por qué la mitad izquierda es suave y la derecha no ────────────────────
 *
 * Porque en el artboard también lo es: midiendo salto a salto, los cortes solo
 * aparecen a partir del 37% — antes de eso la imagen viene interpolada. Así que
 * los seis primeros colores van puestos en el CENTRO de su banda (el gradiente
 * los interpola y la transición queda continua) y del séptimo en adelante van
 * con sus dos bordes (`c 36.96% 43.72%`), que es como se escribe una banda
 * plana en CSS.
 *
 * Un solo `linear-gradient` hace las dos cosas, y eso importa: con dos capas
 * —una suave abajo, una dura enmascarada arriba— habría que mantener
 * sincronizados el punto de corte del mask y el de los stops.
 *
 * ── El arranque casi blanco no es un error ─────────────────────────────────
 *
 * Las tres empiezan en un blanco teñido (#F8FEFD, #FBFBF9, #FDFFFB) sobre una
 * caja blanca, así que el arranque de la píldora es invisible y la barra parece
 * materializarse a un cuarto de su recorrido. Es del artboard, y es lo que hace
 * que la barra se lea como algo que ENTRA por la derecha en vez de como un
 * bloque de color apoyado en el medio del renglón.
 */
const RAMPS: Record<GetIntoRowId, string> = {
  trade:
    "linear-gradient(90deg, #F8FEFD 0%, #F8FEFD 1.57%, #EDFDFA 6.52%, " +
    "#D6F9E5 13.29%, #A6F0B8 20.05%, #7AE88F 26.81%, #4DDD66 33.57%, " +
    "#41BB71 36.96% 43.72%, #3CA982 43.72% 50.48%, #26C38C 50.48% 57.25%, " +
    "#2ECA92 57.25% 64.01%, #4ACF97 64.01% 70.77%, #69DA9E 70.77% 77.54%, " +
    "#72DFA0 77.54% 84.30%, #77E4A2 84.30% 91.06%, #7EEAAC 91.06% 100%)",
  integrate:
    "linear-gradient(90deg, #FBFBF9 0%, #FBFBF9 1.57%, #F5F4EF 6.52%, " +
    "#DEF0DE 13.29%, #B0E5B1 20.05%, #87DC87 26.81%, #64D262 33.57%, " +
    "#7EB27C 36.96% 43.72%, #91AA9E 43.72% 50.48%, #72C6A3 50.48% 57.25%, " +
    "#66D1A5 57.25% 64.01%, #5FD4A3 64.01% 70.77%, #52D8A1 70.77% 77.54%, " +
    "#4AD9A3 77.54% 84.30%, #42DCA4 84.30% 91.06%, #3DE0A5 91.06% 100%)",
  build:
    "linear-gradient(90deg, #FDFFFB 0%, #FDFFFB 1.57%, #F9FFF4 6.52%, " +
    "#E5FADC 13.29%, #BAF1AE 20.05%, #93E983 26.81%, #66DE5C 33.57%, " +
    "#59BC6B 36.96% 43.72%, #46B77B 43.72% 50.48%, #1BD089 50.48% 57.25%, " +
    "#18DD8F 57.25% 64.01%, #2EE2A3 64.01% 70.77%, #3AE5AE 70.77% 77.54%, " +
    "#44E7B5 77.54% 84.30%, #47E8B7 84.30% 91.06%, #4AE8B8 91.06% 100%)",
};

/* ── La entrada ───────────────────────────────────────────────────────────────
 *
 * Un solo timeline para la sección entera, y no uno por renglón como en
 * `ProofLedger`. Allá cada prueba mide una pantalla y la de más abajo terminaba
 * de animarse antes de que nadie la viera; acá los tres renglones caben juntos
 * en cualquier viewport, así que un trigger por fila los dispararía a todos en
 * el mismo cuadro y el escalonado se perdería. Con un timeline, el escalonado
 * lo define el `stagger` y no la posición de scroll.
 *
 * El orden es el de la lectura: el titular sube por palabras, la teja entra
 * cuando la última palabra ya está puesta —cierra el renglón del encabezado, no
 * lo acompaña—, y recién ahí bajan los tres renglones.
 *
 * Y la BARRA se abre de izquierda a derecha con `clip-path`, no con `scaleX`.
 * Un `scaleX` estira el gradiente: las quince bandas empezarían aplastadas y se
 * irían ensanchando, que es exactamente la lectura que hay que evitar (la barra
 * no crece, se descubre). El `round 999px` del `inset` mantiene la cabeza
 * redondeada durante todo el recorrido, así que lo que avanza es una píldora y
 * no un rectángulo que se redondea al final.
 */
const BAR_HIDDEN = "inset(0 100% 0 0 round 999px)";
const BAR_SHOWN = "inset(0 0% 0 0 round 999px)";

export default function GetIntoNear() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const [title] = q("[data-title]");
    const [tile] = q("[data-tile]");
    const rows = q("[data-row]");
    const bars = q("[data-bar]");

    // `mask: "words"` recorta cada palabra contra su propia caja, así que la
    // que sube entra por debajo de una línea invisible en vez de aparecer
    // flotando. Sin el mask, un `yPercent: 115` deja la palabra visible
    // pisando el renglón de arriba durante todo el tramo.
    const split = new SplitText(title, { type: "words", mask: "words" });

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: scope,
        start: "top 72%",
        toggleActions: "play none none none",
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(split.words, { yPercent: 115, duration: 0.9, stagger: 0.07 })
      .from(tile, { autoAlpha: 0, scale: 0.55, duration: 0.7 }, "-=0.45")
      .from(rows, { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.11 }, "-=0.3")
      // `immediateRender: true` explícito: un `fromTo` insertado en una
      // posición distinta de cero no renderiza su estado inicial hasta que le
      // toca el turno, y sin eso las tres barras se ven enteras mientras el
      // renglón todavía está entrando.
      .fromTo(
        bars,
        { clipPath: BAR_HIDDEN },
        {
          clipPath: BAR_SHOWN,
          duration: 1.15,
          stagger: 0.11,
          ease: "power2.inOut",
          immediateRender: true,
        },
        "<0.18"
      );

    return () => split.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="get-into-near"
      // `bg-cream` y no `bg-background`: es el papel de esta página. Y el aire
      // de arriba es el mismo que el de `ProofLedger` a propósito — las dos
      // llegan después de un tramo oscuro (el stack, el mazo) y necesitan el
      // mismo respiro para no leerse como la continuación de la transición.
      className="bg-cream py-32 text-ink lg:py-44"
    >
      <Container>
        {/* El contenedor de consulta. Todo lo que mide en `cqw` acá abajo
            resuelve contra el ancho de ESTE div; sin él, contra el viewport. */}
        <div className="@container">
          <header className="flex items-center justify-between gap-8">
            <h2 id="get-into-near" data-title className="text-h2">
              {GET_INTO_TITLE}
            </h2>
            <NearTile />
          </header>

          {/* 9.8cqw = los ~128px que el artboard deja entre la base del titular
              y el primer renglón, escritos como proporción del bloque. El
              `clamp` es lo que evita que a 1780px se convierta en un pozo. */}
          <ul className="mt-[clamp(48px,9.8cqw,150px)] flex flex-col gap-[clamp(10px,1.23cqw,18px)]">
            {GET_INTO_ROWS.map((row) => (
              <li key={row.id} data-row>
                <Link
                  href={row.href}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-5 rounded-[clamp(14px,1.38cqw,22px)] bg-white p-6 transition-[box-shadow,transform] duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_34px_-14px_rgba(16,16,16,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink xl:min-h-[clamp(64px,5.84cqw,88px)] xl:grid-cols-[minmax(min-content,15.6%)_33.96%_minmax(0,1fr)_auto] xl:gap-x-[5.25%] xl:gap-y-0 xl:p-0 xl:pl-[2.61%] xl:pr-[3.76%]"
                >
                  <h3 className="col-start-1 row-start-1 text-h4 xl:whitespace-nowrap">
                    {row.label}
                  </h3>

                  {/* La barra no dice nada que el texto no diga, así que sale
                      del árbol de accesibilidad entera. */}
                  <span
                    aria-hidden="true"
                    data-bar
                    style={{ backgroundImage: RAMPS[row.id] }}
                    className="col-span-2 col-start-1 row-start-2 h-[clamp(18px,1.92cqw,28px)] w-full rounded-full transition-[filter] duration-500 group-hover:brightness-[1.03] group-hover:saturate-[1.06] xl:col-span-1 xl:col-start-2 xl:row-start-1"
                  />

                  <p // Sin `text-balance`: el artboard reparte estas dos líneas
                      // desparejas a propósito —una larga y una corta— y
                      // balancearlas las deja de igual largo, que es otro
                      // ritmo. Acá la línea corta de abajo es el aire del
                      // renglón.
                      className="col-span-2 col-start-1 row-start-3 text-caption xl:col-span-1 xl:col-start-3 xl:row-start-1">
                    {row.body}
                  </p>

                  <ArrowDisc />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/**
 * El disco del final del renglón: círculo de contorno, flecha negra.
 *
 * No reusa `quantum/ArrowCircle` —que hace este mismo relevo de flechas— por
 * dos motivos: aquel es un disco VERDE MACIZO, que acá compite con la barra y
 * es lo único de color que el renglón no debería tener; y su regla vive en
 * `[data-q-arrow]` de globals.css, atada a ese fondo. El relevo en sí es la
 * misma idea, y está a propósito: la flecha no se mueve y vuelve, SALE y entra
 * otra —lo que se lee es continuidad, no un rebote.
 */
function ArrowDisc() {
  return (
    <span
      aria-hidden="true"
      className="relative col-start-2 row-start-1 grid aspect-square w-[clamp(34px,2.77cqw,46px)] shrink-0 place-items-center overflow-hidden rounded-full border border-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-cream xl:col-start-4"
    >
      <Arrow className="translate-x-0 group-hover:translate-x-[190%]" />
      <Arrow className="-translate-x-[190%] group-hover:translate-x-0" />
    </span>
  );
}

function Arrow({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      // `[grid-area:1/1]` y no `absolute`: las dos flechas comparten la única
      // celda del disco, así que quedan centradas por el `place-items-center`
      // del padre y no por un `inset-0 m-auto` que habría que mantener.
      className={`w-[45%] [grid-area:1/1] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
    >
      <path d="M4 12h15" />
      <path d="m12.5 5.5 7 6.5-7 6.5" />
    </svg>
  );
}

/** El contorno de la teja del logo, tal cual `public/branding/logos/tertiary/`. */
const TILE_PATH =
  "M 88.71,0 L 14.29,0 C 6.4,0 0,6.4 0,14.29 L 0,88.71 C 0,96.6 6.4,103 " +
  "14.29,103 L 88.71,103 C 96.6,103 103,96.6 103,88.71 L 103,14.29 C " +
  "103,6.4 96.6,0 88.71,0";

/** Y la N que se le recorta adentro. Mismo archivo, segundo path. */
const MARK_PATH =
  "M 75.22,21.36 C 72.99,21.36 70.91,22.52 69.74,24.42 L 57.14,43.13 C " +
  "56.73,43.75 56.9,44.58 57.51,44.99 C 58.01,45.32 58.68,45.28 59.13,44.89 " +
  "L 71.53,34.13 C 71.74,33.94 72.06,33.96 72.24,34.17 C 72.32,34.27 " +
  "72.37,34.39 72.37,34.51 L 72.37,68.19 C 72.37,68.47 72.15,68.69 " +
  "71.86,68.69 C 71.72,68.69 71.57,68.63 71.48,68.51 L 33.99,23.64 C " +
  "32.77,22.2 30.98,21.37 29.09,21.36 L 27.78,21.36 C 24.24,21.36 " +
  "21.36,24.24 21.36,27.78 L 21.36,75.21 C 21.36,78.76 24.24,81.63 " +
  "27.78,81.63 C 30.01,81.63 32.09,80.47 33.26,78.57 L 45.86,59.87 C " +
  "46.27,59.25 46.1,58.42 45.49,58.01 C 44.99,57.68 44.32,57.72 43.87,58.11 " +
  "L 31.47,68.86 C 31.26,69.05 30.94,69.03 30.76,68.82 C 30.68,68.73 " +
  "30.63,68.61 30.63,68.48 L 30.63,34.8 C 30.63,34.52 30.85,34.3 31.14,34.3 " +
  "C 31.28,34.3 31.43,34.36 31.52,34.47 L 69,79.36 C 70.22,80.8 72.01,81.63 " +
  "73.9,81.63 L 75.21,81.63 C 78.76,81.63 81.64,78.76 81.64,75.21 L " +
  "81.64,27.79 C 81.64,24.24 78.76,21.37 75.22,21.37 L 75.22,21.36";

/**
 * La teja verde de la esquina, con la N CALADA.
 *
 * Dos decisiones que no son obvias:
 *
 * 1. **La N es un agujero, no una forma blanca.** En el artboard el glifo tiene
 *    exactamente el color del papel (#F5F4F1), no blanco — está calado. Pintarlo
 *    de `--cream` daría el mismo píxel hoy y una mancha el día que la sección
 *    caiga sobre otro fondo. Con un `mask` el hueco es hueco.
 *
 * 2. **Es un `mask` y no `fill-rule="evenodd"` sobre los dos paths juntos.**
 *    Evenodd sobre una N —que se cruza consigo misma— invierte los tramos donde
 *    el contorno se solapa: la letra sale rota en vez de calada.
 *
 * El archivo original (`tertiary/tile-color.svg`) es AZUL: es la teja de NEAR
 * AI. El verde del artboard se muestreó de la imagen y va en el gradiente de
 * acá; los paths son los del archivo, sin tocar.
 */
function NearTile() {
  // `useId()` trae caracteres que no sirven en un `url(#…)` — `:` en React 18,
  // `«»` en 19. Se limpian, no se usan crudos.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const grad = `gin-ramp-${uid}`;
  const knock = `gin-knock-${uid}`;

  return (
    <svg
      data-tile
      aria-hidden="true"
      viewBox="0 0 103 103"
      className="w-[clamp(34px,3.38cqw,52px)] shrink-0"
    >
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0.45" y2="1">
          <stop offset="0" stopColor="#C9F193" />
          <stop offset="0.22" stopColor="#A2E472" />
          <stop offset="0.45" stopColor="#7BD265" />
          <stop offset="0.7" stopColor="#40BA42" />
          <stop offset="1" stopColor="#08A226" />
        </linearGradient>
        <mask id={knock}>
          <path d={TILE_PATH} fill="#fff" />
          <path d={MARK_PATH} fill="#000" />
        </mask>
      </defs>
      <rect
        width="103"
        height="103"
        fill={`url(#${grad})`}
        mask={`url(#${knock})`}
      />
    </svg>
  );
}
