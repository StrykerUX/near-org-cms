import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { EX_COPY } from "@/components/sections/ex/exContent";

// Los tres tratamientos del párrafo que aparece por dentro de la «o».
//
// Los tres consumen el MISMO progreso del gesto que abre el agujero: no hay un
// timeline aparte ni un `ScrollTrigger` propio. El párrafo no se anima cuando
// entra en pantalla — se revela a medida que la «o» crece, porque son la misma
// acción contada dos veces.
//
// Cada uno devuelve un `apply(pr)` que ExHero llama en su `onUpdate`, con `pr`
// ya normalizado a la ventana de lectura, y un `revert()` para el cleanup.
//
// Por qué el escalonado no es un `stagger` de GSAP: un stagger corre con su
// propio reloj, y acá el reloj es el scroll. Cada palabra/línea/carácter tiene
// su ventana dentro de `pr` y se resuelve leyendo, no reproduciéndose.

export type ExNextMode =
  /** EX1 · las líneas suben desde su máscara, una tras otra. */
  | "lines"
  /** EX2 · el párrafo se enciende palabra por palabra, como quien lee. */
  | "read"
  /** EX3 · cada carácter resuelve desde ruido ASCII. */
  | "scramble";

export type ExNextReveal = {
  apply: (pr: number) => void;
  revert: () => void;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * La ventana del elemento `i` dentro del progreso global.
 *
 * `overlap` alto = todos avanzan casi juntos (el texto entra como bloque);
 * bajo = uno termina antes de que empiece el siguiente (se lee como una lista).
 * En el medio está lo que parece lectura.
 */
const gate = (i: number, n: number, pr: number, overlap: number) => {
  const span = 1 - overlap;
  const start = n > 1 ? (i / (n - 1)) * span : 0;
  return clamp01((pr - start) / overlap);
};

/** Ruido determinista: mismo scroll, mismos glifos. Sin `Math.random`. */
const noise = (i: number, f: number) => {
  const x = Math.sin(i * 127.1 + f * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Del más vacío al más denso, igual que el atlas del fondo de EX3: el párrafo
// resuelve desde el mismo alfabeto con el que está hecho su fondo.
//
// Sin `%` ni `@`, que están en el atlas pero acá no: cada carácter dibuja
// dentro del ancho de la letra que va a reemplazar, y esos dos son tan anchos
// que se salen de su casilla y pisan al vecino.
const GLYPHS = ".:-=+*#";

const ACCENTS = new Set<string>(EX_COPY.next.accents);

/** Para comparar contra `accents`: minúsculas y sin puntuación de borde. */
const normalize = (s: string) =>
  s.toLowerCase().replace(/^[^\p{L}\p{N}-]+|[^\p{L}\p{N}-]+$/gu, "");

export function buildExNextReveal(
  el: HTMLElement,
  mode: ExNextMode,
): ExNextReveal {
  if (mode === "lines") {
    // `mask: "lines"` envuelve cada línea en su propio `overflow: hidden`. Sin
    // eso, una línea que sube desde abajo se ve pisar a la de arriba.
    const split = new SplitText(el, { type: "lines", mask: "lines" });
    const lines = split.lines as HTMLElement[];
    const setY = lines.map((l) => gsap.quickSetter(l, "yPercent"));

    gsap.set(lines, { yPercent: 115 });

    return {
      apply: (pr) => {
        for (let i = 0; i < lines.length; i++) {
          const t = gate(i, lines.length, pr, 0.55);
          // Cúbica de salida: la línea llega y frena, no aterriza de golpe.
          setY[i]((1 - (1 - Math.pow(1 - t, 3))) * 115);
        }
      },
      revert: () => split.revert(),
    };
  }

  if (mode === "read") {
    const split = new SplitText(el, { type: "words" });
    const words = split.words as HTMLElement[];
    const setAlpha = words.map((w) => gsap.quickSetter(w, "opacity"));
    const accent = words.map((w) =>
      ACCENTS.has(normalize(w.textContent ?? "")),
    );

    // El acento se pinta una sola vez, en el markup: hacerlo por frame sería
    // escribir el mismo color 60 veces por segundo.
    words.forEach((w, i) => {
      if (accent[i]) w.style.color = "var(--color-green-ink)";
    });
    gsap.set(words, { opacity: 0.12 });

    return {
      apply: (pr) => {
        for (let i = 0; i < words.length; i++) {
          // 0.28 y no 0.7: con una ventana ancha las 27 palabras avanzan casi
          // en fase y el resultado es un fundido del párrafo entero — que es
          // exactamente lo que NO es este tratamiento. Estrecha, se ve el
          // frente de lectura corriendo por el texto.
          const t = gate(i, words.length, pr, 0.28);
          // No arranca en 0: el párrafo entero está ahí desde el principio, en
          // gris muy bajo, y lo que avanza es la LECTURA. Apareciendo palabra
          // por palabra desde la nada, el bloque cambiaría de tamaño y el ojo
          // no tendría dónde apoyarse.
          setAlpha[i](0.1 + 0.9 * t);
        }
      },
      revert: () => {
        words.forEach((w) => (w.style.color = ""));
        split.revert();
      },
    };
  }

  // scramble
  const split = new SplitText(el, { type: "words,chars" });
  const chars = split.chars as HTMLElement[];
  const real = chars.map((c) => c.textContent ?? "");
  // Qué se está mostrando en cada uno: escribir `textContent` solo cuando el
  // glifo cambió de verdad. Sin esta guarda son cientos de escrituras al DOM
  // por frame para dejar todo igual.
  const shown = real.slice();

  // El ancho de cada carácter se congela ANTES de tocar nada. La fuente es
  // proporcional y los glifos de ruido no miden lo que las letras, así que sin
  // esto cada frame recalcula el wrap: el párrafo entero se sacude y cambia de
  // cantidad de líneas mientras resuelve. Midiendo todo primero y escribiendo
  // después se evita además un thrash de layout por carácter.
  const widths = chars.map((c) => c.getBoundingClientRect().width);
  chars.forEach((c, i) => {
    c.style.display = "inline-block";
    c.style.width = `${widths[i]}px`;
    c.style.textAlign = "center";
  });

  gsap.set(chars, { opacity: 0 });
  const setAlpha = chars.map((c) => gsap.quickSetter(c, "opacity"));

  return {
    apply: (pr) => {
      // El ruido avanza con el SCROLL, no con el reloj: parando el gesto, el
      // scramble se congela. Un scramble que sigue temblando quieto se lee como
      // un bug, no como un efecto.
      const frame = Math.floor(pr * 420);

      for (let i = 0; i < chars.length; i++) {
        // Misma razón que en `read`, con más margen: son ~170 caracteres, y
        // el ruido ya da movimiento aunque la ventana no sea tan estrecha.
        const t = gate(i, chars.length, pr, 0.38);
        setAlpha[i](t <= 0 ? 0 : 1);

        const next =
          t >= 1
            ? real[i]
            : GLYPHS[Math.floor(noise(i, frame) * GLYPHS.length)];
        if (next !== shown[i]) {
          chars[i].textContent = next;
          shown[i] = next;
        }
      }
    },
    revert: () => {
      chars.forEach((c, i) => {
        c.textContent = real[i];
        c.style.display = "";
        c.style.width = "";
        c.style.textAlign = "";
      });
      split.revert();
    },
  };
}
