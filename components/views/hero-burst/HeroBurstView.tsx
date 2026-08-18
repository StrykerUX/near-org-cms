"use client";

import Accent from "@/components/primitives/Accent";
import HeroBurstGL from "@/components/views/hero-burst/HeroBurstGL";

export default function HeroBurstView() {
  return (
    <main className="flex flex-col bg-cream">
      {/* El hero del mockup: burst simétrico con horizonte al centro, texto
          negro encima. El header fijo del layout pasa por encima del canvas
          — igual que en el mock. */}
      <section className="relative flex h-svh flex-col items-center justify-center overflow-hidden text-center">
        <HeroBurstGL />
        <div className="relative z-[1] flex flex-col items-center gap-8 px-6">
          <h1 className="text-display text-pretty text-black">
            Own your
            <br />
            <Accent display>world.</Accent>
          </h1>
          <p className="max-w-xl text-body-lg text-black/80 text-pretty">
            Move cross-chain, trade perps, hold RWAs, stay confidential, and
            access all of DeFi from your own wallet.
          </p>
          <div className="flex items-center gap-6 text-label text-black">
            <span className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-near-green" />
              Start Developing
            </span>
            <span aria-hidden="true" className="h-5 w-px bg-black/30" />
            <span>
              Learn More <span aria-hidden="true">↓</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pista de scroll: existe solo para SENTIR la aceleración del burst al
          scrollear — flick fuerte y volvé arriba. */}
      <section className="flex h-[240svh] flex-col items-center gap-[60svh] bg-cream pt-[30svh] text-center text-body text-black/40">
        <p>scroll runway — flick hard, then glide back up</p>
        <p>the burst above accelerates with your scroll velocity</p>
        <p>and settles back to its idle drift</p>
      </section>
    </main>
  );
}
