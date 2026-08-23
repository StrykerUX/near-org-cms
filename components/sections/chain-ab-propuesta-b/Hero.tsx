"use client";

import Container from "@/components/primitives/Container";
import Accent from "@/components/primitives/Accent";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { HERO_B } from "@/components/sections/chain-abstraction-proposals/content";
import { CHAINS } from "@/components/sections/chain/chainContent";

// ── El campo de chains — grid denso con las cajas de texto recortadas ──────
// Cuarta variante: título arriba a la izquierda, texto abajo a la derecha.
// Dos intentos anteriores (dos rectángulos sueltos en las esquinas libres;
// después una franja diagonal ascendente conectándolas) dejaban partes
// grandes del lienzo vacías porque ninguno de los dos cubría TODO el
// espacio libre, solo una porción angosta de él. Pedido explícito: que no
// quede vacío en ningún lado, y está bien repetir chains si hacen falta
// más de las 35 reales para llenar el espacio.
//
// Esta versión vuelve a un grid que cubre el lienzo COMPLETO (con margen
// de borde) y recorta las dos cajas de texto por DESCARTE: si el centro de
// una celda cae en la caja del título o del párrafo, esa celda simplemente
// no se usa. Nunca por EMPUJE (la alternativa que se probó primero, antes
// de esta sesión, para el problema original de "las chains encima del
// texto") — empujar cada celda hacia el borde más cercano las amontona ahí
// mismo; descartar dejar el resto del grid, sin tocar, ya cubre parejo
// todo lo que no es texto.
const JITTER = 0.32;

const MARGIN = { x0: 6, y0: 8, x1: 94, y1: 92 }; // mismo margen de borde de siempre
// El grid manda cuántas chains hay: `CELLS` lo recorre entero y descarta
// las celdas cuyo centro cae en `TITLE_BOX`/`TEXT_BOX`, así que el total
// visible es COLS×ROWS menos lo descartado. Con 16×11 quedaban 95
// etiquetas y el campo se leía como una pared de texto; con 12×8 quedan
// 52, y las cajas de descarte de más abajo bajan eso a 42 — pedido
// explícito de buscar el punto donde no se sienta ni tan vacío ni tan
// lleno. Cubre el mismo lienzo (mismo margen), solo que más aireado; para
// volver a densificar, subir estos dos números y nada más.
const COLS = 12;
const ROWS = 8;

// Cajas a evitar. Aproximan dónde caen el título, la barra de nav y el
// párrafo — se reajustan a ojo si hace falta, mismo criterio que toda
// esta sección. Segunda pasada sobre ellas: bajar la densidad del grid no
// alcanzó, porque las etiquetas que molestaban no eran las del medio del
// lienzo sino las que rozaban el texto por afuera del borde de estas
// cajas. Las tres se agrandaron hasta que dejan de aparecer:
//
//  · `TITLE_BOX` de x1 69 a 73 — las dos que caían pegadas al borde
//    derecho del titular (a la altura de "Disappears.").
//  · `HEADER_BOX`, nueva — la esquina de arriba a la derecha, donde tres
//    etiquetas quedaban a la misma altura que la píldora de nav.
//  · `TEXT_BOX` de x0 55 a 40 y de y0 74 a 70 — el párrafo de abajo a la
//    derecha se comía tres etiquetas por su flanco izquierdo.
//
// Entre las tres sacan 10 (52 → 42): las 8 marcadas más `ATOM` y `DOT`,
// que caen dentro del mismo ensanche del párrafo.
type Rect = { x0: number; y0: number; x1: number; y1: number };
const TITLE_BOX: Rect = { x0: 0, y0: 0, x1: 73, y1: 50 };
const HEADER_BOX: Rect = { x0: 60, y0: 0, x1: 100, y1: 17 };
const TEXT_BOX: Rect = { x0: 40, y0: 70, x1: 100, y1: 100 };

const inside = (x: number, y: number, r: Rect) => x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1;

const round = (n: number) => Math.round(n * 1e4) / 1e4;

const CELLS: { x: number; y: number }[] = [];
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const idx = row * COLS + col;
    const jx = Math.sin(idx * 12.9898) * 0.5;
    const jy = Math.sin(idx * 78.233) * 0.5;
    const tx = (col + 0.5 + jx * 2 * JITTER) / COLS;
    const ty = (row + 0.5 + jy * 2 * JITTER) / ROWS;
    const x = round(MARGIN.x0 + tx * (MARGIN.x1 - MARGIN.x0));
    const y = round(MARGIN.y0 + ty * (MARGIN.y1 - MARGIN.y0));
    if (inside(x, y, TITLE_BOX) || inside(x, y, HEADER_BOX) || inside(x, y, TEXT_BOX)) continue;
    CELLS.push({ x, y });
  }
}

// Labels cíclicos sobre `CHAINS` (35 nombres reales) — hacen falta más
// celdas que nombres, así que se repiten. Como el label sale del índice DEL
// GRID (no al revés), una misma chain solo vuelve a aparecer después de dar
// toda una vuelta a la lista — nunca pegada a su propia repetición.
const FIELD = CELLS.map((p, i) => ({
  label: CHAINS[i % CHAINS.length],
  x: p.x,
  y: p.y,
  opacity: round(0.18 + Math.abs(Math.sin(i * 4.17)) * 0.42),
  phase: round((i * 0.61) % (Math.PI * 2)),
  period: 8 + (i % 5) * 1.6,
  // La mitad del campo solo en desktop — un grid así de denso en un
  // lienzo angosto de teléfono es una pared de texto, no un campo.
  dense: i % 2 === 1,
}));

const PULL_TAU = 0.2;
const MAX_FRAME_S = 0.05;

// ── El encendido de izquierda a derecha, en loop ────────────────────────────
// Tercera vuelta sobre este efecto: la luciérnaga (lotes al azar
// apagándose/prendiendo sueltos por todo el campo) se pidió sacar del
// todo — pedido explícito: "se ve como árbol de navidad, no luciérnaga".
// Se queda SOLO el barrido ascendente, pero ahora en loop: al llegar al
// máximo (todas prendidas) empiezan a apagarse, y vuelven a aparecer en
// el mismo orden ascendente — un solo tween con `yoyo:true` en vez de dos
// sistemas separados (barrido + luciérnaga). `yoyo` reproduce el MISMO
// tween al revés en cada repetición: como tiene `stagger` ascendente, la
// pasada inversa apaga en orden DESCENDENTE (derecha→izquierda) — se lee
// como que la ola se repliega por donde vino, no como parpadeo al azar.
// `repeatDelay` dos veces por ciclo (yoyo hace ida y vuelta): una pausa
// con todo prendido y otra con todo apagado antes de invertir.
const REVEAL_STEP = 0.028; // delay entre una chain y la siguiente en el barrido
const REVEAL_DURATION = 0.7;
const REVEAL_HOLD = 1.6; // pausa en cada extremo (todo prendido / todo apagado)

export default function Hero() {
  // Scope 1: el campo de tickers — encendido de izquierda a derecha al
  // cargar + wander idle + gravedad de puntero, en un loop de `gsap.ticker`.
  const fieldRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };
      const drifts = q("[data-ticker-drift]");
      if (!motionOk) return;

      const setX = drifts.map((el) => gsap.quickSetter(el, "x", "px"));
      const setY = drifts.map((el) => gsap.quickSetter(el, "y", "px"));
      const cur = drifts.map(() => ({ x: 0, y: 0 }));

      let elapsed = 0;
      let visible = true;
      const update = (_time: number, deltaMs: number) => {
        if (!visible) return;
        const dt = Math.min(deltaMs / 1000, MAX_FRAME_S);
        elapsed += dt;
        const k = 1 - Math.exp(-dt / PULL_TAU);

        for (let i = 0; i < drifts.length; i++) {
          const f = FIELD[i];
          const tx = Math.sin(elapsed / f.period + f.phase) * 6;
          const ty = Math.cos(elapsed / f.period + f.phase) * 6;

          const c = cur[i];
          c.x += (tx - c.x) * k;
          c.y += (ty - c.y) * k;
          setX[i](c.x);
          setY[i](c.y);
        }
      };

      gsap.ticker.add(update);

      // Aparece y desaparece con la MISMA trayectoria diagonal (mismo
      // orden `appearOrder`, por `x`) — no un orden distinto para cada
      // sentido. Una versión con un orden propio para desaparecer (por
      // `y`) se probó antes, pero eso es un barrido vertical de verdad,
      // sin relación con la diagonal de la aparición; lo pedido es
      // reusar ESA misma diagonal para las dos direcciones.
      const appearOrder = drifts.map((_, i) => i).sort((a, b) => FIELD[a].x - FIELD[b].x);
      const appearDrifts = appearOrder.map((i) => drifts[i]);
      const appearOpacity = appearOrder.map((i) => FIELD[i].opacity);

      // `gsap.set` a 0 primero para no depender de que el inline style de
      // React "gane" la carrera contra el primer paint.
      gsap.set(drifts, { opacity: 0 });
      const wave = gsap.timeline({ repeat: -1, repeatDelay: REVEAL_HOLD });
      wave
        .to(appearDrifts, {
          opacity: (i) => appearOpacity[i],
          duration: REVEAL_DURATION,
          ease: EASE_OUT,
          stagger: REVEAL_STEP,
        })
        .to(
          appearDrifts,
          { opacity: 0, duration: REVEAL_DURATION, ease: EASE_OUT, stagger: REVEAL_STEP },
          `+=${REVEAL_HOLD}`,
        );

      const track = scope.closest("section") ?? scope;
      onViewportToggle(track, (v) => {
        visible = v;
        if (v) wave.play();
        else wave.pause();
      });

      return () => {
        gsap.ticker.remove(update);
        wave.kill();
        gsap.killTweensOf(drifts);
      };
    });

    return () => mm.revert();
  }, []);

  // Scope 2: título y subtítulo entran juntos al cargar, sin scroll. Acá no
  // hay reemplazo por scroll: los dos textos conviven siempre, uno abajo a
  // la izquierda y el otro abajo a la derecha.
  const introRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    const heading = q("[data-hero-heading]")[0];
    const items = q("[data-hero-item]");

    if (!motionOk) {
      gsap.set(items, { clearProps: "all" });
      return;
    }

    if (!heading) return;

    SplitText.create(heading, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) => {
        allowDescenders(self.lines);
        return gsap.from(self.lines, {
          yPercent: 110,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1,
          ease: EASE_OUT,
        });
      },
    });

    gsap.from(items, { y: 32, autoAlpha: 0, duration: 0.9, delay: 0.7, ease: EASE_OUT });
  }, []);

  return (
    <section
      ref={introRef}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-cream"
    >
      {/* Sin gradiente de fondo, y ahí está la diferencia con la propuesta
          B: esa hereda un blob verde radial anclado arriba a la izquierda
          (lo que quedó de `GradientMesh tone="light"` después de descartar
          su segundo blob gris, que caía justo detrás del párrafo). Acá el
          cream va plano de punta a punta — pedido explícito — así que el
          único elemento sobre el fondo es el campo de chains. */}
      <div ref={fieldRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        {FIELD.map((t, i) => (
          <span
            key={i}
            data-ticker
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${t.dense ? "hidden lg:block" : ""}`}
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
          >
            <span
              data-ticker-drift
              className="block whitespace-nowrap text-caption-mono uppercase text-foreground"
              style={{ opacity: t.opacity }}
            >
              {t.label}
            </span>
          </span>
        ))}
      </div>
      {/* Título arriba a la izquierda y texto abajo a la derecha: dos
          bloques en esquinas opuestas, no una fila compartida — por eso son
          dos `Container` en flujo normal (`justify-between` de la sección
          los separa a los extremos), no uno solo con `items-end`. */}
      <Container className="relative pt-44">
        {/* Sin `max-w` en el `<h1>` a propósito: "The Chain Disappears."
            entera en un renglón (pedido explícito) necesita el ancho que
            necesite a este tamaño de fuente (`text-display`, hasta 8rem) —
            con un `max-w` puesto se corta antes de tiempo y vuelve a partir
            en dos líneas ("The Chain" / "Disappears."), que es justo lo que
            no se quiere. El `<Container>` de afuera sigue poniendo el techo
            real (`max-w-[1780px]`). */}
        <h1 data-hero-heading className="text-display text-pretty">
          <div className="lg:whitespace-nowrap">The Chain Disappears.</div>
          <div className="mt-4 lg:mt-6">
            <Accent display>You don&apos;t.</Accent>
          </div>
        </h1>
      </Container>
      <Container className="relative flex justify-end pb-20">
        {/* `max-w-md` (28rem) dejaba a "never does." solo en su propio
            renglón. `text-justify` estira cada línea salvo la última
            ("...never does.") para que ambos bordes, izquierdo y derecho,
            queden parejos. Antes había un `<br/>` a mano después de "...one
            system." para que esa oración quedara sola en su renglón — pero
            un salto forzado cuenta como "última línea" para `justify`
            también, así que esa línea 1 quedaba sin estirar igual que la
            verdadera última, y las líneas del medio (2-3) sí se estiraban:
            el resultado se veía desparejo (líneas del medio sobresaliendo
            más que la primera y la última). Sacar el `<br/>` deja que
            `text-justify` estire TODAS las líneas salvo la última, que es
            el pedido. Sin `hyphens-auto`: sin partir palabras, el espaciado
            entre palabras se estira un poco más de lo que haría con
            guiones, trade-off ya aceptado. El bloque entero sigue clavado
            abajo a la derecha (lo pone el `justify-end` del `Container`),
            esto solo cambia cómo se alinea el TEXTO adentro de esa caja. */}
        <div data-hero-item className="max-w-2xl">
          <p className="text-body-lg text-justify text-foreground/70">{HERO_B.sub}</p>
        </div>
      </Container>
    </section>
  );
}
