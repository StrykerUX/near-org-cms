"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { GreenCube, IsoFrame, isoAt } from "@/components/sections/protocol-labs/isoKit";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// COMBO H2 · Sustained — el título se queda, la evidencia desfila.
//
// ── El problema que resuelve, que es propio de H2 ──────────────────────────
//
// H2 · Count trae las seis cifras DENTRO del hero, contando al entrar. Eso deja
// a la sección siguiente sin su contenido habitual: volver a poner las mismas
// seis cifras dos pantallas después es repetir, y repetir le quita fuerza al
// marcador del hero — que era justamente lo que la variante apostaba.
//
// Acá las cifras no se repiten: se DESARROLLAN. Cada una vuelve con la frase que
// explica por qué importa, que en el hero no cabía. El hero da el dato pelado y
// esta sección dice qué significa; son dos momentos de la misma prueba y no dos
// versiones de la misma franja.
//
// ── El mecanismo: una columna pegada y otra que corre ─────────────────────
//
// A la izquierda, el h2 de "Built for AI scale" queda **pegado** mientras la
// columna derecha desfila con las seis lecturas y después con las tres
// propiedades. La pregunta se queda a la vista mientras pasan las respuestas.
//
// Eso funde las secciones 2 y 3 en un solo bloque, a propósito: es la única de
// las cinco propuestas donde la evidencia y la explicación ocurren AL MISMO
// TIEMPO en la pantalla, en vez de una después de la otra.
//
// ── Sticky de CSS, nunca `pin: true` ──────────────────────────────────────
//
// `position: sticky` dentro de una columna de grid. El pin de ScrollTrigger
// mueve el elemento a un contenedor propio, recalcula alturas y pelea con Lenis;
// sticky no toca el layout y funciona con el JS apagado. Es la regla del
// toolkit de motion del repo, no una preferencia de este archivo.
//
// El `top` es `--site-header-block` más aire: el header es fijo, así que un
// sticky a `top-0` se mete debajo del nav.
//
// En móvil no hay dos columnas, así que no hay nada que pegar: el título va
// arriba y las lecturas debajo, en orden. `lg:sticky` y no `sticky`.

const iso = isoAt(16, 20);

export default function SustainedScale() {
  const rail = useScrollReveal<HTMLDivElement>({ y: 22, stagger: 0.07 });

  return (
    <section className="bg-background text-foreground">
      <Container className="grid-ds gap-y-16 py-24 lg:py-32">
        {/* ── La columna pegada ──────────────────────────────────────────── */}
        <div className="col-span-full flex flex-col gap-7 lg:col-span-5 lg:sticky lg:top-[calc(var(--site-header-block)+3rem)] lg:self-start">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">
            Qué sostiene cada número
          </p>
          <h2 className="text-h2 text-pretty">
            {AI_SCALE.title.lead}
            <br />
            <Accent>{AI_SCALE.title.accent}</Accent>
          </h2>
          <p className="max-w-[38ch] text-body-lg text-ink-soft text-pretty">{AI_SCALE.body}</p>
        </div>

        {/* ── La columna que corre ───────────────────────────────────────── */}
        <div ref={rail} className="col-span-full flex flex-col lg:col-start-7 lg:col-span-6">
          {/* Las seis lecturas. El valor va chico y en mono, no grande: acá ya
              se vieron a tamaño de marcador en el hero, y repetir la escala
              sería repetir el momento. Lo nuevo es la frase. */}
          <dl className="flex flex-col">
            {PROOF.map((stat) => (
              <div
                key={stat.id}
                data-reveal
                className="flex flex-col gap-2 border-t border-rule py-6 first:border-t-ink"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="uppercase text-micro-mono text-gray-intermediate">
                    {stat.label}
                  </dt>
                  <dd className="text-h4-mono tabular-nums text-green-ink">{stat.value}</dd>
                </div>
                {stat.note && (
                  <dd className="max-w-[46ch] text-body-sm text-gray-intermediate text-pretty">
                    {stat.note}
                  </dd>
                )}
              </div>
            ))}
          </dl>

          {/* Las tres propiedades cierran la MISMA columna, sin cambiar de
              sección. Llevan el cubo como viñeta —la pieza del acto que viene
              después— y el borde superior de tinta las separa del bloque de
              lecturas sin abrir un bloque nuevo. */}
          <ul className="mt-14 flex flex-col gap-8 border-t border-ink pt-8">
            {AI_SCALE.points.map((p) => (
              <li key={p.title} data-reveal className="flex gap-4">
                <IsoFrame viewBox="0 0 32 32" className="mt-1 size-5 shrink-0">
                  <GreenCube iso={iso} s={9} />
                </IsoFrame>
                <div className="flex flex-col gap-2">
                  <h3 className="text-h4">{p.title}</h3>
                  <p className="max-w-[44ch] text-body text-ink-soft text-pretty">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
