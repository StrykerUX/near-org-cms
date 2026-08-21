"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import { useLoopCarousel, buildLoopCells } from "./useLoopCarousel";
import { PRESS_ITEMS, type PressTone } from "./carouselSectionsContent";

// Puerto de las cards de TestimonialMarquee (logo + comillas + cita +
// nombre/puesto), montado sobre el motor de esta carpeta (drag/snap loop,
// no el marquee de auto-scroll) y con los TRES tonos originales de
// PressCarousel (gradiente verde / gris / negro) — hex exactos pedidos,
// no tokens del repo: no hay --green-2/--near-green-* que calcen.
const TONE_CARD: Record<PressTone, string> = {
  green: "bg-[linear-gradient(155deg,#BBEF7F_0%,#37C142_100%)] text-ink",
  gray: "bg-[#E1E1E1] text-ink",
  dark: "bg-[#1e1e1e] text-white",
};

const TONE_QUOTE: Record<PressTone, string> = {
  green: "text-ink/30",
  gray: "text-ink/30",
  dark: "text-white/30",
};

const cells = buildLoopCells(PRESS_ITEMS);

export default function PressCarousel() {
  const { containerRef, trackRef, rootProps } = useLoopCarousel<HTMLDivElement>(PRESS_ITEMS.length);

  return (
    <section
      className="overflow-hidden bg-cream py-[clamp(40px,7vh,96px)] text-foreground"
      aria-roledescription="carousel"
      aria-label="Blockchain quantum security in the news"
    >
      <h2 className="whitespace-nowrap px-[clamp(24px,5vw,105px)] text-left text-h2 lg:mx-auto lg:text-center">
        Blockchain quantum security <Accent>in the news</Accent>
      </h2>

      <div className="mt-[clamp(28px,5vh,64px)]" />

      <div
        ref={containerRef}
        {...rootProps}
        aria-label="Cards de prensa. Usa las flechas para navegar."
        className="relative w-full cursor-grab touch-pan-y select-none overflow-hidden py-[clamp(8px,1.4vh,18px)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <div ref={trackRef} className="flex items-stretch gap-[clamp(16px,2vw,36px)]">
          {cells.map(({ item, key, logical, hidden }) => {
            const dark = item.tone === "dark";

            return (
              <article
                key={key}
                data-cell
                data-logical={logical}
                data-active={logical === 0}
                aria-hidden={hidden || undefined}
                className={`relative flex min-h-[clamp(150px,16vw,270px)] flex-[0_0_min(78vw,400px)] flex-col gap-2 overflow-hidden rounded-[clamp(16px,1.6vw,26px)] p-[clamp(20px,2.2vw,40px)] lg:flex-[0_0_clamp(280px,33vw,560px)] ${TONE_CARD[item.tone]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <Image
                    src={item.logo.src}
                    alt=""
                    width={item.logo.width}
                    height={item.logo.height}
                    className={`w-auto ${item.logo.src.includes("venice") ? "h-9" : "h-[27px]"} ${dark ? "brightness-0 invert" : "brightness-0"}`}
                  />
                  <span aria-hidden="true" className={`shrink-0 select-none text-h1 ${TONE_QUOTE[item.tone]}`}>
                    &rdquo;
                  </span>
                </div>

                <p className="max-w-[46ch] text-body-sm text-pretty">{item.body}</p>

                <div className="mt-auto">
                  <p className="text-label">{item.name}</p>
                  <p className={`text-body-sm ${dark ? "text-white/50" : "text-ink/60"}`}>{item.role}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
