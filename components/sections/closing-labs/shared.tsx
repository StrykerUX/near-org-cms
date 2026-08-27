"use client";

import type { ReactNode } from "react";

import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import {
  formatLedgerValue,
  type LedgerRow,
} from "@/components/sections/homepage-tuck/proofLedgerContent";
import type { GetIntoRowId } from "@/components/sections/homepage-tuck/getIntoNearContent";

// Las piezas que las cinco direcciones comparten.
//
// Son cinco y ninguna es un "componente de UI": son los cuatro DEVICES que
// aparecen repetidos en las referencias (el contador que arranca en cero, el
// texto que se enciende palabra por palabra, el glifo de rótulo, las marcas de
// esquina) más el disco de flecha, que ya existía en la línea viva.
//
// Viven acá y no en `components/primitives/` a propósito: un primitivo es algo
// que el sitio entero puede usar, y esto es el vocabulario de UN laboratorio.
// Si una dirección gana, lo suyo se promueve; mientras tanto no le debe nada al
// resto del repo.

/* ── El contador ──────────────────────────────────────────────────────────────
 *
 * Las cuatro referencias cuentan desde cero (armory: `0ms → 6ms`; spartan:
 * `$0M → $5M`), y las dos lo hacen con el ANCHO FINAL ya reservado: `0ms` ocupa
 * lo mismo que `6ms`, `$0M` lo mismo que `$5M`. Sin eso el rótulo que va pegado
 * a la derecha se corre en cada salto y el bloque late.
 *
 * Acá el relleno ya estaba resuelto: `formatLedgerValue` rellena con ceros a la
 * izquierda contra el valor final (`000 → 100`, `$00 → $24`). Este componente
 * es lo único que faltaba — el tween que lo recorre.
 *
 * Reescribe `textContent` en cada cuadro, así que el numeral NO puede llevar
 * hijos: cualquier `<span>` adentro lo borra el primer frame. Es la misma
 * restricción documentada en `ProofLedger`, y por eso el signo y la glosa van
 * SIEMPRE como hermanos y nunca dentro.
 */
export type CounterProps = {
  row: Pick<LedgerRow, "value" | "decimals" | "prefix">;
  className?: string;
};

export function Counter({ row, className = "" }: CounterProps) {
  const ref = useMotionScope<HTMLSpanElement>(
    ({ scope, motionOk }) => {
      if (!motionOk) return;

      const at = { n: 0 };
      const paint = () => {
        scope.textContent = formatLedgerValue(row, at.n);
      };
      paint();

      const tween = gsap.to(at, {
        n: row.value,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: paint,
        scrollTrigger: {
          trigger: scope,
          start: "top 88%",
          toggleActions: "play none none none",
          markers: DEBUG_MARKERS,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        // Al revertir (reduce-motion en vivo, cambio de breakpoint) el numeral
        // queda en el valor final y no a mitad de cuenta.
        scope.textContent = formatLedgerValue(row);
      };
    },
    [row.value, row.decimals, row.prefix],
  );

  // El servidor pinta el valor FINAL: sin JS la cifra se lee igual.
  return (
    <span ref={ref} className={className}>
      {formatLedgerValue(row)}
    </span>
  );
}

/* ── El texto que se enciende ─────────────────────────────────────────────────
 *
 * El device más repetido de las cuatro referencias: un párrafo que empieza
 * apagado y se enciende palabra por palabra AL RITMO DEL SCROLL. No es una
 * entrada —no ocurre y se acaba— sino un estado atado a la posición, y por eso
 * va con `scrub` y no con `toggleActions`.
 *
 * Los colores llegan como cadenas CSS y no como clases porque GSAP interpola
 * VALORES: `text-ink/20 → text-ink` son dos clases y el navegador no sabe pasar
 * de una a la otra. Con dos colores el tween es una interpolación y punto.
 *
 * Sin JS —o con `prefers-reduced-motion`— el párrafo se ve encendido: el color
 * apagado lo aplica el tween, no el CSS. Es la misma degradación que documenta
 * `useScrollReveal` y por el mismo motivo.
 */
export type WordRevealProps = {
  text: string;
  /** Color de la palabra apagada. Cadena CSS: `rgba(...)`, `#hex`, `var(...)`. */
  dim: string;
  /** Color de la palabra encendida. Tiene que ser el color del texto en reposo. */
  lit: string;
  className?: string;
  /** Dónde arranca el barrido. Por defecto el bloque a tres cuartos del alto. */
  start?: string;
  end?: string;
};

export function WordReveal({
  text,
  dim,
  lit,
  className = "",
  start = "top 75%",
  end = "bottom 55%",
}: WordRevealProps) {
  const ref = useMotionScope<HTMLParagraphElement>(
    ({ scope, motionOk }) => {
      if (!motionOk) return;

      const split = new SplitText(scope, { type: "words" });
      const tween = gsap.fromTo(
        split.words,
        { color: dim },
        {
          color: lit,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: scope,
            start,
            end,
            scrub: true,
            markers: DEBUG_MARKERS,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      };
    },
    [text, dim, lit, start, end],
  );

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}

/* ── El glifo rayado ──────────────────────────────────────────────────────────
 *
 * El rótulo de sección de armory no es un punto ni un guion: son cuatro barras
 * inclinadas, y funcionan porque NO significan nada. Un icono al lado de
 * "STATISTICS" promete una categoría; una trama promete solamente que ahí
 * empieza algo.
 *
 * Va en SVG y no como carácter porque los glifos de trama de Unicode (▨, ▧)
 * dependen de la fuente que los tenga, y las dos del sitio no los tienen.
 */
export function Hatch({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 8"
      className={`h-2 w-4 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M0 8 4.5 0M4 8 8.5 0M8 8 12.5 0M12 8 16.5 0" />
    </svg>
  );
}

/* ── Las marcas de esquina ────────────────────────────────────────────────────
 *
 * Alura le pone cuatro marcas distintas a cada card —`+`, `○`, `✦`, `□`— y ahí
 * está el detalle que las hace funcionar: son CUATRO SÍMBOLOS DISTINTOS, uno por
 * esquina, no el mismo cuatro veces. Cuatro cruces se leen como una mira; cuatro
 * marcas distintas se leen como las señas de registro de un pliego de imprenta,
 * que es lo que le da a la card el aire de pieza recortada.
 *
 * `aria-hidden` completo: no dicen nada que un lector de pantalla necesite.
 */
export function CornerGlyphs({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 select-none ${className}`}
    >
      <span className="text-micro-mono absolute left-3 top-2">+</span>
      <span className="text-micro-mono absolute right-3 top-2">○</span>
      <span className="text-micro-mono absolute bottom-2 left-3">✦</span>
      <span className="text-micro-mono absolute bottom-2 right-3">□</span>
    </span>
  );
}

/* ── El disco de flecha ───────────────────────────────────────────────────────
 *
 * El mismo de `GetIntoNear`, con una diferencia: acá la flecha gira 45° al
 * hover en vez de correrse. Es lo que hacen los tres templates con controles
 * circulares —el signo cambia de SENTIDO, no de posición— y sobre una fila que
 * ya se mueve entera, un desplazamiento más se pierde.
 */
export function ArrowDisc({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-current transition-transform duration-300 ease-out group-hover:rotate-45 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 ${className}`}
    >
      <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
      </svg>
    </span>
  );
}

/* ── Las tres rampas ──────────────────────────────────────────────────────────
 *
 * Copia de las de `homepage-tuck/GetIntoNear.tsx`, donde está escrito de dónde
 * salen los quince colores de cada una y por qué la mitad izquierda interpola y
 * la derecha va en bandas duras. Se copian y no se importan por la regla de
 * laboratorios: si el lab se borra, no se lleva nada de la línea viva.
 *
 * Las cinco direcciones las usan distinto —barra, filete, resplandor, texto
 * recortado— y esa es justamente la comparación: qué queda del gesto cuando
 * cambia de soporte.
 */
export const RAMPS: Record<GetIntoRowId, string> = {
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

/* ── El rótulo con filete ─────────────────────────────────────────────────────
 *
 * `ETIQUETA ————————— ⬭`, el rótulo de spartan. La línea no separa nada: mide.
 * Estira el rótulo hasta el borde de su columna y ahí lo remata con una píldora
 * vacía, así que la etiqueta deja de ser una palabra suelta arriba a la
 * izquierda y pasa a declarar el ancho del bloque que encabeza.
 */
export function RuleLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-4 ${className}`}>
      <span className="text-eyebrow-mono uppercase">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-current opacity-30" />
      <span
        aria-hidden="true"
        className="h-3 w-6 shrink-0 rounded-full border border-current opacity-60"
      />
    </p>
  );
}
