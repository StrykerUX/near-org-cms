"use client";

import { useRef } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import {
  createWordField,
  type WordFieldHandle,
} from "@/components/sections/quantum-security-copy/wordField";

// The close of the dark stretch: a centred sentence, and beneath it a field of
// crypto vocabulary in which the letters landing on the NEAR mark's silhouette
// are lit. All of the field's mechanism lives in `wordField.ts`.

export default function MathStatement() {
  const fieldRef = useRef<HTMLDivElement>(null);

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      // ── word field ──────────────────────────────────────────────────────
      // Built on the client and not during render: the row and column counts
      // come from measuring the host, and which letters light up comes from
      // rasterising the mark against that measurement. None of it exists on the
      // server. Since the field is purely aria-hidden, nothing is lost.
      let field: WordFieldHandle | null = null;
      if (fieldRef.current) {
        field = createWordField(fieldRef.current, scope, { motionOk });
      }

      // ── sentence ────────────────────────────────────────────────────────
      const statement = q("[data-statement]")[0];
      if (statement && motionOk) {
        SplitText.create(statement, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            // "migration" ends in a g whose tail fell outside the line mask.
            allowDescenders(self.lines);
            return gsap.from(self.lines, {
              yPercent: 115,
              autoAlpha: 0,
              stagger: 0.14,
              duration: 0.9,
              ease: EASE_OUT,
              scrollTrigger: { trigger: statement, start: "top 74%", once: true },
            });
          },
        });
      }

      return () => field?.destroy();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-cream text-foreground">
      {/* The field's host. The type is sized in vw so the weave SCALES with the
          window: the number of columns then stays roughly constant, which is
          what keeps the implied NEAR mark the same size relative to the section
          at every viewport. The clamp stops it going illegibly fine on a phone
          or absurdly coarse on a 5K display.
          `wordField.ts` no longer assumes these values — it measures the real
          character advance and line height off this element — so changing them
          here is safe.
          The mask is inline for the usual reason: the `;` inside the gradient
          would break a shorthand declaration list. */}
      <div
        ref={fieldRef}
        aria-hidden="true"
        // Los roles mono fijan un font-size, y el de acá se mide, no se lee.
        // ds-exempt: decorative monospace weave, its metrics are geometry
        className="absolute inset-x-0 bottom-0 h-[70%] overflow-hidden font-mono whitespace-pre text-black/15"
        style={{
          fontSize: "clamp(10px, 0.72vw, 17px)",
          lineHeight: 1.54,
          letterSpacing: "0.12em",
          WebkitMaskImage:
            "linear-gradient(to top,#262626 0%,#262626 26%,rgba(0,0,0,0.55) 52%,rgba(0,0,0,0) 96%)",
          maskImage:
            "linear-gradient(to top,#262626 0%,#262626 26%,rgba(0,0,0,0.55) 52%,rgba(0,0,0,0) 96%)",
        }}
      />

      {/* `isolate` bounds the stacking context: without it the absolute field
          above would sit over the sentence as soon as anything created a new
          one. */}
      <Container className="relative isolate flex justify-center py-[calc((100vw/7)*1.4)]">
        {/* Copy de Lawrence (2026-08-17). El acento serif cae en "Only NEAR" —
            la palabra de contraste, como antes lo era "Not every chain". Va por
            <Accent> (accent-serif, 1em × 1.18): text-h1-serif-inline fija a
            Kepler en el tamaño NOMINAL del h1 sin la compensación óptica del
            sistema y el acento quedaba ~18% chico. */}
        <h2 data-statement className="max-w-[30ch] text-center text-h1 text-balance">
          Every blockchain will have to upgrade its cryptography.{" "}
          {/* leading-[0] en el wrapper: el acento a 1.18em no debe AGRANDAR su
              línea (es lo que hacía el line-height: 0 de text-h1-serif-inline).
              Va en un wrapper y no en un selector descendiente del h2 porque
              SplitText envuelve cada línea en spans y los colapsaría. */}
          {/* ds-exempt: anula el line-height del wrapper, no ajusta la escala — ver arriba */}
          <span className="leading-[0]">
            <Accent>Only NEAR</Accent>
          </span>{" "}
          was architected from day one to become quantum-safe in a single transaction,
          not a full migration.
        </h2>
      </Container>
    </section>
  );
}
