"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { BELONGS_COPY } from "@/components/sections/newsletter-labs/BelongsParts";
import { SlabField } from "@/components/sections/newsletter-labs/NewsletterFields";

// ── 10 · Ascii ───────────────────────────────────────────────────────────────
//
// El wordmark deja de ser un SVG y pasa a estar DIBUJADO con caracteres. Al
// entrar en cuadro, la rejilla llega hecha ruido y se resuelve en la palabra.
//
// ── Por qué esto no es un gimmick gratis ────────────────────────────────────
//
// El resto de la homepage habla de infraestructura, nodos y ejecución. Un
// wordmark hecho de caracteres monoespaciados dice eso mismo con la forma en vez
// de con palabras, y lo dice en la única sección donde el logo aparece a tamaño
// grande sin competir con nada.
//
// El riesgo: es también el gesto que peor envejece. Un ASCII que se resuelve se
// disfruta la primera vez; la décima, el lector solo quiere el campo. Por eso el
// scramble es corto (~1.2s en total) y no se repite.
//
// ── El wordmark ASCII es contenido, no decoración ───────────────────────────
//
// Va en un `<pre>` con `aria-hidden` y al lado un `<span class="sr-only">` con
// la palabra: para el árbol de accesibilidad el heading dice "NEAR belongs to
// you", igual que en las otras siete. Un lector de pantalla leyendo cinco filas
// de bloques sería ruido puro.
//
// ── El grano de la rejilla es fijo, no fluido ───────────────────────────────
//
// `text-caption-mono` y no un tamaño relativo al viewport: el dibujo depende de
// que cada carácter ocupe exactamente lo mismo, y una escala fluida cambia el
// interlineado antes que el avance — las filas se separan y la palabra se abre.
// A cambio, en pantallas anchas el bloque no crece: es un dibujo, no un titular.

// El wordmark, fila por fila. Cada letra ocupa 6 columnas y van separadas por
// dos espacios, así que las cinco filas miden exactamente 30 caracteres — si una
// difiere, la palabra se tuerce.
const ASCII_NEAR = [
  "██  ██   ████    ████   ██ ██ ",
  "███ ██  ██  ██  ██  ██  ███  █",
  "██ ███  ██████  ██████  ██    ",
  "██  ██  ██      ██  ██  ██    ",
  "██  ██   ████   ██  ██  ██    ",
] as const;

// Los glifos por los que pasa un bloque antes de resolverse. Todos de ancho
// completo en monoespaciada: con caracteres de otro avance, la rejilla late.
const NOISE = "░▒▓█+*·:=#%@";

// Cuántos glifos falsos pasan por cada bloque, y cuánto dura el ciclo.
const FLICKERS = 5;
const FLICKER_TIME = 0.05;

export default function Belongs10Ascii() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const cells = q("[data-cell]");
    if (cells.length === 0) return;

    // Sembrado y no `Math.random()`: `useMotionScope` reconstruye la escena al
    // cruzar los 1024px o al cambiar `prefers-reduced-motion` en vivo, y con
    // azar puro la segunda corrida mostraría otro ruido — un parpadeo que se
    // lee como bug.
    const rand = createSeededRandom();

    const tl = gsap.timeline({
      scrollTrigger: { trigger: scope, start: "top 75%", once: true, markers: DEBUG_MARKERS },
    });

    cells.forEach((cell) => {
      const final = cell.dataset.cell ?? "";
      // El retardo por celda es sembrado y no proporcional a su posición: una
      // ola de izquierda a derecha se leería como un barrido, y esto tiene que
      // leerse como una señal que se ESTABILIZA.
      const at = rand() * 0.55;

      const state = { step: 0 };
      let written = -1;
      tl.to(
        state,
        {
          step: FLICKERS,
          duration: FLICKERS * FLICKER_TIME,
          ease: "none",
          snap: { step: 1 },
          onUpdate: () => {
            const step = Math.round(state.step);
            if (step === written) return;
            written = step;
            cell.textContent =
              step >= FLICKERS ? final : NOISE[Math.floor(rand() * NOISE.length)];
          },
          // Forzado también al completar: si la pestaña se va a segundo plano,
          // GSAP puede saltar al final sin pasar por el último `onUpdate` y la
          // celda quedaría en un glifo falso PARA SIEMPRE — la timeline es
          // `once: true`.
          onComplete: () => {
            cell.textContent = final;
          },
        },
        at
      );
    });

    tl.from(cells, { autoAlpha: 0, duration: 0.3, stagger: { amount: 0.4, from: "random" } }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      cells.forEach((cell) => {
        cell.textContent = cell.dataset.cell ?? "";
      });
      gsap.set(cells, { clearProps: "all" });
    };
  });

  return (
    <section ref={rootRef} className="bg-stone py-24 text-ink lg:py-32">
      <Container className="flex flex-col items-center gap-9 text-center">
        <h2 className="flex flex-col items-center gap-3">
          <span className="sr-only">NEAR belongs to you.</span>

          {/* Un `<span>` por bloque: el scramble necesita un nodo por celda para
              escribirle su glifo. Los espacios también van en span —con
              `whitespace-pre` para que no colapsen— porque si no, el índice de
              las celdas dejaría de coincidir con la rejilla. */}
          <pre
            aria-hidden="true"
            className="text-caption-mono whitespace-pre text-ink [font-variant-ligatures:none]"
          >
            {ASCII_NEAR.map((row, y) => (
              <span key={y} className="block">
                {[...row].map((ch, x) => (
                  <span key={x} data-cell={ch}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </pre>

          <span aria-hidden="true" className="text-h1">
            <Accent>{BELONGS_COPY.claim}</Accent>
          </span>
        </h2>

        <p className="max-w-[46ch] text-body text-ink/70 text-pretty">{BELONGS_COPY.body}</p>

        {/* El bloque, no la píldora: en una composición hecha de caracteres
            monoespaciados, una píldora redondeada se lee como un widget pegado
            encima. El precio, igual que en la 02 y la 06, es que pierde el
            glyph-shine. */}
        <div className="w-full max-w-[30rem]">
          <SlabField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </Container>
    </section>
  );
}
