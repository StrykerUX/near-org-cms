"use client";

import Container from "@/components/primitives/Container";
import { SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import {
  enableScene,
  trackTimeline,
} from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { STATEMENT } from "@/components/sections/hero-alt/heroAltContent";

// ── 01 · Aperture · segunda sección ──────────────────────────────────────────
//
// Las lamas del hero sobreviven al corte. No son las MISMAS —son dos secciones
// independientes, y acoplarlas a nivel de módulo por trece divs sería el error
// que `heroGeometry.ts` documenta en la homepage— pero son las mismas trece
// columnas, con la misma alternancia de origen y el mismo gris.
//
// Lo que hacen acá es lo contrario que en el hero: allá se ABRÍAN desde el
// centro, acá se APLANAN contra el piso, del borde hacia adentro. El lector no
// tiene que reconocer que son las mismas; tiene que sentir que la página sigue
// hablando el mismo idioma.
//
// ── El track ────────────────────────────────────────────────────────────────
//
// `position: sticky` de CSS y un ScrollTrigger de SOLO LECTURA, nunca
// `pin: true` — regla del repo, razonamiento largo en sections/README.md.
// El recorrido se declara en CSS (`data-ap=on` enciende el alto) y acá solo se
// lee, así que sin JS la sección mide lo que mide su contenido y el statement
// se lee entero en flujo normal.

const LAMELLAS = 13;

// La silueta de partida, en fracción del alto del viewport. Es una V invertida:
// altas en los bordes, bajas en el centro, para que el statement —que va
// centrado— nazca sobre el tramo más despejado y no tenga que pelearle contraste
// a una columna llena.
function restingHeight(i: number): number {
  const mid = (LAMELLAS - 1) / 2;
  const fromCenter = Math.abs(i - mid) / mid;
  // Cuadrática y no lineal: con la recta, las columnas vecinas al centro
  // quedan casi tan bajas como la central y la V se lee como un plato.
  return 0.18 + 0.62 * fromCenter * fromCenter;
}

export default function ApertureBars() {
  const rootRef = useMotionScope<HTMLElement>(
    ({ q, scope, motionOk, isDesktop }) => {
      const lamellas = q("[data-ap2-lamella]");
      const copy = q("[data-ap2-copy]")[0];

      // Sin escena: las lamas se quedan en su silueta de reposo (que el JSX ya
      // pinta) y el statement en flujo. Es legible y no es un estado a medias.
      if (!motionOk || !isDesktop) return;

      const off = enableScene(scope, "ap");
      const tl = trackTimeline(scope, { scrub: 0.35 });

      // Las lamas se aplanan de AFUERA hacia adentro: la más alta es la que más
      // tiene que recorrer, así que arranca primero y las tres llegan al piso
      // juntas. Repartir el arranque y no la duración es lo que hace que el gesto
      // termine en un frente parejo en vez de en una cola.
      const mid = (LAMELLAS - 1) / 2;
      lamellas.forEach((lamella, i) => {
        const fromCenter = Math.abs(i - mid) / mid;
        tl.to(
          lamella,
          { scaleY: 0.06, ease: "none", duration: 0.55 },
          // El 0.45 de ventana es lo que queda del recorrido para repartir los
          // arranques; el 0.55 de duración lo completa hasta 1.
          0.45 * (1 - fromCenter),
        );
      });

      // El statement entra por líneas enmascaradas. `SplitText` con `mask: "lines"`
      // y `allowDescenders`, porque a la interlínea de los tokens de display la
      // caja de máscara corta la cola de las g y las y — permanentemente, no solo
      // durante la animación.
      // `onSplit` solo repara las máscaras y NO devuelve un tween: si devolviera
      // uno correría al montar y pelearía con el scrub del track por el mismo
      // `yPercent`. Quien anima estas líneas es la timeline de abajo, y una sola.
      const split = SplitText.create(copy, {
        type: "lines",
        mask: "lines",
        onSplit: (self) => {
          allowDescenders(self.lines);
        },
      });

      tl.from(
        split.lines,
        { yPercent: 110, ease: "power2.out", duration: 0.5, stagger: 0.08 },
        0.12,
      );

      return () => {
        split.revert();
        off();
      };
    },
  );

  return (
    <section
      ref={rootRef}
      // El alto solo existe con la escena encendida. `data-ap` lo escribe
      // `enableScene` y NO el JSX: declarado en los dos lados, el primer
      // re-render lo devolvería a vacío y el sticky se desarmaría en silencio.
      className="relative overflow-x-clip bg-cream text-foreground data-[ap=on]:h-[230svh]"
    >
      {/* El hijo pegado. `sticky` incondicional: sin la escena encendida la
          sección no tiene recorrido de sobra, así que no hay nada a lo que
          pegarse y el navegador lo trata como estático. No hace falta
          condicionarlo — y condicionarlo sería una segunda fuente para el mismo
          estado que ya lleva `data-ap`.

          El `overflow-hidden` va sobre el elemento PEGADO y no sobre la
          sección: en un ancestro convertiría a la sección en contenedor de
          scroll y el sticky dejaría de pegarse, sin dar ningún error. */}
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        {/* Las lamas, ancladas al piso del viewport pegado. `items-end` es lo
              que hace que crezcan hacia arriba desde el borde inferior; el
              `transformOrigin: bottom` de cada una es lo que hace que se
              aplanen contra él en vez de encogerse hacia su propio centro. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-end"
        >
          {Array.from({ length: LAMELLAS }, (_, i) => (
            <div key={i} className="relative h-full flex-1">
              <div
                data-ap2-lamella
                className="absolute inset-x-0 bottom-0 bg-bar"
                style={{
                  height: `${restingHeight(i) * 100}%`,
                  transformOrigin: "bottom",
                  opacity: 0.55,
                }}
              />
            </div>
          ))}
        </div>

        <Container className="relative z-[1]">
          <p
            data-ap2-copy
            className="mx-auto max-w-[22ch] text-center text-statement text-pretty"
          >
            {STATEMENT}
          </p>
        </Container>
      </div>
    </section>
  );
}
