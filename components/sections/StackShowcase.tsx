"use client";

import { ArrowRight } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import ZigguratDivider from "@/components/primitives/ZigguratDivider";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

const PILLS = ["Confidential", "Cross-Chain", "Permissionless", "Earn", "Perps", "RWA"];

// Reemplazo del cubo isométrico reutilizado 5 veces para armar una cruz
// explotada — aproximación geométrica de public/near-stack.svg (monocromo en
// el original), recoloreado en gradiente verde/teal porque no existe un
// asset de marca a color todavía (ver plan: placeholder documentado).
function IsoCube({ x, y, scale = 1, gradient = true }: { x: number; y: number; scale?: number; gradient?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M 0,-40 L 40,-20 L 0,0 L -40,-20 Z" fill={gradient ? "url(#isoGradient)" : "none"} stroke="white" strokeOpacity="0.25" />
      <path d="M -40,-20 L 0,0 L 0,40 L -40,20 Z" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.15" />
      <path d="M 40,-20 L 0,0 L 0,40 L 40,20 Z" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.15" />
    </g>
  );
}

function IsoGraphic() {
  const svgRef = useGsapContext<SVGSVGElement>((_self, scope) => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const tween = gsap.to(scope, {
        y: -10,
        rotateZ: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center",
      });
      pauseOffscreen(tween, scope);
    });
    return () => mm.revert();
  }, []);

  return (
    <svg ref={svgRef} viewBox="-140 -100 280 220" className="mx-auto w-64 sm:w-80" data-reveal="iso">
      <defs>
        <linearGradient id="isoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--near-green)" />
          <stop offset="100%" stopColor="var(--near-teal)" />
        </linearGradient>
      </defs>
      <IsoCube x={0} y={0} scale={1.15} />
      <IsoCube x={-80} y={-45} gradient={false} />
      <IsoCube x={80} y={-45} />
      <IsoCube x={-80} y={45} />
      <IsoCube x={80} y={45} gradient={false} />
    </svg>
  );
}

export default function StackShowcase() {
  const rootRef = useScrollReveal<HTMLDivElement>({
    build: ({ tl, q }) => {
      tl.from(q("[data-reveal='eyebrow']"), { autoAlpha: 0, y: 12, duration: 0.6 })
        .from(q("[data-reveal='heading']"), { autoAlpha: 0, y: 32 }, "-=0.35")
        .from(q("[data-reveal='body']"), { autoAlpha: 0, y: 24 }, "-=0.6")
        .from(q("[data-reveal='pill']"), { autoAlpha: 0, y: 16, scale: 0.96, stagger: 0.06 }, "-=0.5")
        // Sin rotateZ acá: el SVG ya tiene su propio loop idle de
        // y/rotateZ (ver IsoGraphic) — animar la misma propiedad desde dos
        // tweens distintos a la vez los hace pelear por el valor cada frame.
        .from(q("[data-reveal='iso']"), { autoAlpha: 0, scale: 0.92, duration: 1.2 }, 0.1);
    },
  });

  return (
    <section className="bg-[#101010] text-white">
      <Container className="flex flex-col gap-16 py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-h1 font-medium text-pretty">The NEAR Stack</h2>
          <p className="max-w-xl text-body-lg text-white/60 text-pretty">
            Open infrastructure{" "}
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-white/40 to-near-teal align-middle" />{" "}
            powering the{" "}
            <span className="inline-flex size-5 rotate-45 items-center justify-center bg-near-green align-middle" />{" "}
            agent economy
          </p>
        </div>

        <div ref={rootRef} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col gap-3 text-center lg:text-left">
            <div data-reveal="eyebrow">
              <Eyebrow className="text-white/50">The NEAR Stack</Eyebrow>
            </div>
            <h3 data-reveal="heading" className="text-h2 font-medium text-pretty">
              Sovereignty,
              <br />
              <Accent>end to end.</Accent>
            </h3>
          </div>

          <IsoGraphic />

          <div className="flex flex-col gap-4">
            <span className="text-caption text-white/40">01</span>
            <h4 data-reveal="body" className="text-h4 font-medium">near.com</h4>
            <p data-reveal="body" className="text-body-sm text-white/60 text-pretty">
              The only onchain account you need. Fully confidential swaps,
              transfers, deposits, and withdrawals. Trade perps, earn yield,
              and hold RWAs across 30+ chains, all from one account, your
              assets in your control. The way crypto should work.
            </p>
            <div className="flex flex-wrap gap-2">
              {PILLS.map((pill) => (
                <span
                  key={pill}
                  data-reveal="pill"
                  className="rounded-full border border-white/15 px-3 py-1 text-caption text-white/70"
                >
                  {pill}
                </span>
              ))}
            </div>
            <a href="#" className="mt-2 flex items-center gap-2 text-body-sm font-medium hover:text-near-green">
              Visit near.com
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </Container>

      <ZigguratDivider from="#101010" to="var(--background)" />
    </section>
  );
}
