"use client";

import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import ColumnRule from "@/components/sections/solutions-a/ColumnRule";
import SolutionMark from "@/components/sections/solutions-a/SolutionMark";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { SOLUTIONS } from "@/components/sections/solutions/solutionsContent";

// §3 — las cinco soluciones, como un registro.
//
// ── Esto reemplazó a una escena pegada, y el motivo importa ───────────────
//
// La primera versión de esta sección era un índice PEGADO: la lista quieta a la
// izquierda, los cuerpos haciendo crossfade a la derecha, cinco beats de 76svh
// cada uno. En papel sonaba bien. En pantalla fallaba por dos lados a la vez, y
// los dos son fatales para esta propuesta:
//
// 1. **Contradecía la tesis.** A sostiene que el lector llega con su caso de uso
//    decidido y que el trabajo de la página es dejarlo llegar rápido. Y después
//    le cobraba CINCO PANTALLAS de scroll para enseñarle cinco párrafos. Un
//    directorio que se recorre como una presentación no es un directorio.
// 2. **Se veía vacía.** El contenido de un beat vive centrado en un contenedor
//    de 100svh, así que al entrar en la sección lo primero que aparece es media
//    pantalla de crema, y el texto llega bastante después de haber «tocado» la
//    sección. Con cinco beats, eso pasaba cinco veces.
//
// Lo que hay ahora son cinco filas densas que se leen de corrido. Todo el
// contenido de la sección es visible en dos pantallas en vez de cinco, y no hay
// un solo instante en que la sección esté en cuadro sin nada que leer.
//
// ── Por qué una tabla y no cards ──────────────────────────────────────────
//
// Porque el dato es tabular: cinco entradas con los mismos cuatro campos
// (nombre, quién lo usa, qué hace, a dónde va). Una card mete cada entrada en su
// propia caja y obliga al ojo a entrar y salir cinco veces; una fila con filete
// deja los cinco campos alineados en columna, que es lo que permite COMPARAR dos
// soluciones sin releerlas. Comparar es exactamente lo que hace alguien que
// todavía no sabe cuál de las cinco es la suya.
//
// El precedente en el repo es el registro numerado de `protocol-labs` —las
// capacidades como filas de un solo índice— que se descartó allá por otras
// razones y acá es justo lo que la página pide.

export default function SolutionsTable() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // Un timeline POR FILA. La tabla mide más de una pantalla, así que con un
    // trigger compartido las últimas filas animarían fuera de vista y el lector
    // llegaría a filas ya terminadas — que es el defecto que esta propuesta
    // arrastraba en todas sus secciones.
    const timelines = q("[data-row]").map((row) => {
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: row, start: "top 90%", toggleActions: "play none none none", markers: DEBUG_MARKERS },
      });

      const pick = (sel: string) => row.querySelectorAll(sel);

      // El filete barre y el contenido lo sigue. Es la misma gramática de trazo
      // que usan el hero y la franja de cifras: la fila se DIBUJA antes de
      // llenarse.
      tl.from(pick("[data-row-rule]"), { scaleX: 0, duration: 0.5 }, 0).from(
        pick("[data-row-item]"),
        { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.06 },
        0.15
      );

      return tl;
    });

    return () => {
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    };
  });

  return (
    <section ref={rootRef} className="relative bg-cream pb-28 pt-20">
      {/* La retícula sigue: es la textura de A y lo que hace que hero, cifras y
          tabla se lean como un mismo sistema y no como tres bloques pegados. */}
      <ColumnRule />

      <Container className="relative">
        <p className="text-caption-mono uppercase text-gray-intermediate">
          What the world is building
        </p>

        <div className="mt-12">
          {SOLUTIONS.map((s, i) => (
            <article key={s.id} id={s.id} data-row>
              <div
                data-row-rule
                className="h-px w-full origin-left bg-rule"
                aria-hidden="true"
              />

              {/* Cuatro campos en columna, alineados entre las cinco filas.
                  Esa alineación es la razón de ser del layout: permite leer
                  hacia abajo una sola columna —«¿quién usa cuál?»— sin tener que
                  atravesar cinco párrafos.

                  El reparto no deja columnas huecas (1 · 2–5 · 6–11 · 12), y eso
                  no es tacañería: en una TABLA una columna vacía se lee como un
                  campo que a esta fila le falta, no como aire. Las primeras
                  medidas dejaban las columnas 5 y 11 en blanco y las cinco filas
                  se veían agujereadas. */}
              <div className="grid-ds items-start gap-y-6 py-10">
                <div data-row-item className="col-span-2 lg:col-span-1">
                  <span className="text-caption-mono text-gray-intermediate">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div data-row-item className="col-span-10 lg:col-span-4">
                  <h3 className="max-w-[16ch] text-h3 text-pretty">{s.title}</h3>
                  {/* La evidencia debajo del nombre y en mono. Sale del cuerpo,
                      que ya la menciona; puesta acá es lo que el ojo encuentra
                      sin leer el párrafo, y es lo que decide una elección. Dos
                      de las cinco no tienen nombres en el copy y se quedan sin
                      pie — inventar un cliente para emparejar la columna es
                      exactamente lo que esta página no puede hacer. */}
                  {s.evidence.length > 0 && (
                    <p className="mt-4 max-w-[26ch] text-caption-mono text-gray-intermediate">
                      {s.evidence.join(" · ")}
                    </p>
                  )}
                </div>

                <div data-row-item className="col-span-12 lg:col-span-6 lg:col-start-6">
                  <p className="max-w-[54ch] text-body text-ink-soft text-pretty">{s.body}</p>
                  <a
                    href={s.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 border-b border-ink/25 pb-1 text-label text-ink transition-colors hover:border-ink"
                  >
                    {s.link.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>

                {/* La marca cierra la fila contra el borde derecho. Sin ella el
                    cuerpo termina a dos tercios y las cinco filas se leen como
                    renglones que no llegan al final de su caja — el mismo
                    defecto que el índice del hero tenía antes de su flecha. */}
                <div
                  data-row-item
                  className="hidden lg:col-span-1 lg:col-start-12 lg:flex lg:justify-end"
                >
                  <SolutionMark id={s.id} className="size-14 text-ink/30" />
                </div>
              </div>
            </article>
          ))}

          {/* El filete de cierre: sin él la última fila queda abierta y la tabla
              se lee cortada en vez de terminada. */}
          <div data-row>
            <div data-row-rule className="h-px w-full origin-left bg-rule" aria-hidden="true" />
          </div>
        </div>
      </Container>
    </section>
  );
}
