"use client";

import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { diagonalReveal } from "@/components/sections/proof-alt/diagonalReveal";
import ProofComposition from "@/components/sections/proof-alt/ProofComposition";

// ── 01 · Cadence ─────────────────────────────────────────────────────────────
//
// La versión quieta. Entra una vez, en diagonal, y después no se mueve nunca
// más: ni loop de fondo, ni parallax, ni nada colgado del scroll.
//
// Es la que hay que batir. Una sección de homepage se ve una vez y de paso, y
// todo lo que siga moviéndose después del primer segundo compite con el
// contenido que viene abajo. Si la 02 o la 03 no ganan claramente contra esto,
// la respuesta correcta es esta.
//
// La entrada vive en `diagonalReveal.ts` porque la 02 usa exactamente la misma
// —es esta con una capa de fondo— y lo que se compara entre las dos es esa capa
// y nada más.

export default function CadenceStack() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    // Sin animación con reduced-motion: la composición ya está completa en el
    // markup y los `from()` de GSAP son lo único que la esconde. No hacer nada
    // ES la degradación correcta.
    if (!motionOk) return;

    const blocks = q("[data-block]");
    if (blocks.length === 0) return;

    const reveal = diagonalReveal(scope, blocks);
    return () => reveal.kill();
  });

  return (
    // `bg-background` (blanco puro) y no cream: esta sección entra justo después
    // del negro de NEAR Stack, y el blanco es el corte más limpio que tiene la
    // página. El cream lo retoma la sección siguiente.
    <section ref={rootRef} className="flex min-h-svh items-center bg-background py-24 text-ink">
      <ProofComposition />
    </section>
  );
}
