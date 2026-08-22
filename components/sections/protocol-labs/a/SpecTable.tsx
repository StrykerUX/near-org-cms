"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import { SPEC_MARKS } from "@/components/sections/protocol-labs/a/specMarks";
import { CAPABILITIES } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa A · secciones 4 a 9 — LA pieza de esta dirección.
//
// ── Qué se está probando acá ────────────────────────────────────────────────
//
// La página viva resuelve estas seis capacidades con una espina de cards que se
// abren de a una: exactamente una visible a la vez, y el scroll es lo que las
// abre. Es una decisión legítima y tiene un costo — para comparar la tercera con
// la quinta hay que volver a recorrerlas, y quien llegó buscando UNA de las seis
// tiene que pasar por las otras cinco.
//
// A apuesta lo contrario: **las seis abiertas, siempre**. Una tabla de
// especificación de seis filas de ancho completo, con la figura de cada una a la
// derecha. Se puede escanear en diagonal, comparar dos filas sin scrollear dos
// veces, y buscar con Cmd+F — que en una página de protocolo no es un detalle,
// es cómo la lee la mitad de su público.
//
// Lo que se pierde y hay que mirar de frente: no hay momento. Ninguna de las
// seis tiene un instante propio, y una página sin ningún momento se olvida. La
// alternativa B existe justamente para probar la apuesta opuesta.
//
// ── El orden es el del doc, sin reagrupar ──────────────────────────────────
//
// La página viva reordena (junta 4/7/9 en un acto y 5/6/8 en una fila compacta)
// porque seis bloques consecutivos a ancho completo son una ficha técnica y no
// una página. En una tabla esa objeción no aplica: una ficha técnica es
// precisamente lo que esto quiere ser, y en una tabla el orden del doc es el
// único que no le pide al lector que adivine el criterio.
//
// ── La única fila oscura ───────────────────────────────────────────────────
//
// La celda de figura del Private Shard va en negro. No es un destaque
// jerárquico —las seis son pares, y esa es la tesis— sino literal: es la única
// cuyo contenido no se puede ver. Que el resto de la fila siga en blanco es
// justamente lo que lo hace legible como propiedad de ESA capacidad y no como
// "esta es la importante".

// Rótulos de la cabecera. Son chrome de la tabla, no copy de marca: describen
// qué hay en cada columna, igual que el encabezado de cualquier ficha técnica.
const HEAD = ["Ref.", "Capability", "What it does", "Figure"] as const;

export default function SpecTable() {
  const ref = useScrollReveal<HTMLDivElement>({
    build: ({ tl, q }) => {
      q("[data-row]").forEach((row, i) => {
        const at = i * 0.12;
        const rule = row.querySelector("[data-rule]");
        if (rule) tl.from(rule, { scaleX: 0, duration: 0.55, ease: "power2.out" }, at);
        tl.from(
          row.querySelectorAll("[data-cell]"),
          { autoAlpha: 0, y: 14, duration: 0.55, stagger: 0.05 },
          at + 0.08
        );
      });
    },
    start: "top 88%",
  });

  return (
    <section className="bg-background text-foreground">
      <Container className="py-8 lg:pb-28">
        {/* La cabecera solo existe en desktop: en móvil la tabla se convierte en
            una pila de fichas y unos rótulos de columna sobre una pila describen
            algo que ya no está ahí. */}
        <div className="hidden grid-ds border-b border-ink pb-3 lg:grid">
          <span className="uppercase text-micro-mono text-gray-intermediate">{HEAD[0]}</span>
          <span className="col-span-4 uppercase text-micro-mono text-gray-intermediate">
            {HEAD[1]}
          </span>
          <span className="col-span-4 uppercase text-micro-mono text-gray-intermediate">
            {HEAD[2]}
          </span>
          <span className="col-span-3 uppercase text-micro-mono text-gray-intermediate">
            {HEAD[3]}
          </span>
        </div>

        <div ref={ref}>
          {CAPABILITIES.map((cap) => {
            const Mark = SPEC_MARKS[cap.id];
            const dark = cap.id === "private-shard";
            return (
              <article
                key={cap.id}
                data-row
                // `group/row` con nombre y no `group` pelado: dentro de la fila
                // hay un enlace que trae su propio `data-q-arrow-host`, y dos
                // grupos anónimos anidados hacen que `group-hover` resuelva
                // contra el más cercano sin avisar.
                className="group/row relative grid-ds items-start gap-y-6 py-9 transition-colors duration-500 hover:bg-cream/70"
              >
                <span
                  data-rule
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left bg-rule"
                />

                <span
                  data-cell
                  className="col-span-full uppercase text-micro-mono text-gray-intermediate lg:col-span-1"
                >
                  {cap.index}
                </span>

                <div data-cell className="col-span-full flex flex-col gap-2 lg:col-span-4">
                  <h3 className="text-h3 text-pretty">{cap.name}</h3>
                  <p className="max-w-[34ch] text-body-sm text-gray-intermediate text-pretty">
                    {cap.subhead}
                  </p>
                </div>

                <div data-cell className="col-span-full flex flex-col gap-5 lg:col-span-4">
                  <p className="max-w-[52ch] text-body text-ink-soft text-pretty">{cap.body}</p>
                  {cap.link && (
                    <a
                      href={cap.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-q-arrow-host
                      className="flex w-fit items-center gap-3 text-label"
                    >
                      <ArrowCircle />
                      {cap.link.label}
                    </a>
                  )}
                </div>

                <div
                  data-cell
                  className={`col-span-full overflow-hidden rounded-xl lg:col-span-3 ${
                    dark ? "bg-ink" : "bg-cream/60"
                  }`}
                >
                  <Mark />
                </div>
              </article>
            );
          })}
          {/* La regla de cierre: sin ella la última fila queda abierta y la
              tabla se lee cortada en vez de terminada. */}
          <span aria-hidden="true" className="block h-px bg-ink" />
        </div>
      </Container>
    </section>
  );
}
