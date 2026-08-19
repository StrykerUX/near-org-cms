"use client";

import { useCallback, useRef } from "react";
import Accent from "@/components/primitives/Accent";
import { gsap } from "@/components/primitives/motion/gsapClient";
import SectionCut, { clamp01 } from "@/components/sections/transition-labs/SectionCut";

// ── K · Chapter ──────────────────────────────────────────────────────────────
//
// El corte deja de ser un tránsito y pasa a ser ESTRUCTURA: en medio del cambio
// de fondo aparece el rótulo del capítulo —«02 · The NEAR Stack»— con su regla,
// se lee, y se va hacia arriba.
//
// Es el único de los siete que sirve a la página entera y no a este corte: con
// un rótulo en cada frontera, el lector que scrollea rápido sabe siempre en qué
// parte del documento está, y la página gana un índice que no existía. Los
// otros seis son un efecto; este es un sistema.
//
// Es el único que gasta el presupuesto grande del laboratorio —90svh netos
// contra los 20 de los demás— y lo gasta en una pausa: sin ella el rótulo se ve
// pasar y no se lee. El scroll acá compra información, no un cambio de color.
//
// ── Las tres fases ──────────────────────────────────────────────────────────
//
// 0.00–0.22  el fondo rueda a negro
// 0.22–0.50  el rótulo entra: el número primero, la regla se abre después
// 0.50–0.72  se queda quieto — un rótulo que nunca está en reposo no se lee
// 0.72–1.00  se va hacia arriba y el velo se retira: detrás ya está la sección
//
// La pausa del medio es la parte que más fácil se olvida y la que decide si el
// rótulo se lee o solo se ve pasar.
//
// ── Todo por props ──────────────────────────────────────────────────────────
//
// `index` y `title` son lo único que cambia entre un corte y otro. La regla que
// se abre y los tiempos son iguales en todos: si cada capítulo entrara distinto,
// el recurso dejaría de leerse como una serie.

export type CutChapterProps = {
  index: string;
  title: string;
  accent?: string;
};

export default function CutChapter({
  index = "02",
  title = "The NEAR",
  accent = "Stack",
}: Partial<CutChapterProps>) {
  const inkRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const draw = useCallback((p: number) => {
    const ink = inkRef.current;
    const card = cardRef.current;
    const num = numRef.current;
    const rule = ruleRef.current;
    const ttl = titleRef.current;
    if (!ink || !card || !num || !rule || !ttl) return;

    // El velo entra rápido y se RETIRA al final: el rótulo necesita fondo propio
    // para leerse, pero el tramo tiene que terminar dejando ver la sección, no
    // un negro que la anuncia.
    gsap.set(ink, { opacity: clamp01(p / 0.22) * (1 - clamp01((p - 0.86) / 0.14)) });

    const inn = clamp01((p - 0.22) / 0.28);
    const out = clamp01((p - 0.72) / 0.28);

    // El número llega primero y el título detrás: leído en ese orden, el rótulo
    // dice "capítulo dos" y después "de qué". Al revés es un titular con un
    // número al lado.
    gsap.set(num, { autoAlpha: inn, y: (1 - inn) * 28 });
    gsap.set(rule, { scaleX: inn });
    gsap.set(ttl, { autoAlpha: clamp01((inn - 0.25) / 0.75), y: (1 - inn) * 40 });

    // La salida es del bloque entero: el rótulo no se desarma, se va.
    gsap.set(card, { autoAlpha: 1 - out, y: -out * 90 });
  }, []);

  // `to="transparent"`: es el único que NO empieza con el velo puesto —el fondo
  // entra en el primer 22%—, así que el piso de destino lo dejaría negro desde
  // el primer frame y se comería la entrada. Acá el velo hace de piso.
  return (
    <SectionCut travel="230svh" lead="40svh" to="transparent" draw={draw}>
      <div ref={inkRef} aria-hidden="true" className="absolute inset-0 bg-ink opacity-0" />

      <div className="absolute inset-0 flex items-center justify-center px-[60px]">
        <div ref={cardRef} className="flex w-full max-w-[62rem] flex-col gap-6 text-cream">
          <div ref={numRef} className="text-caption-mono uppercase text-cta-mint">
            chapter {index}
          </div>
          {/* La regla se abre desde la izquierda: es la que da la sensación de
              que el rótulo se está ESCRIBIENDO y no apareciendo. */}
          <div ref={ruleRef} className="h-px w-full origin-left scale-x-0 bg-cream/25" />
          <div ref={titleRef} className="text-display text-pretty">
            {title} <Accent display>{accent}</Accent>
          </div>
        </div>
      </div>
    </SectionCut>
  );
}
