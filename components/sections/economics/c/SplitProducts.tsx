"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { PRODUCTS } from "@/components/sections/economics/economicsContent";

// §4 of variant C — the two engines, split to the bleed.
//
// ── Why the halves are full-bleed and the rest of the page is not ──────────
// Everything above this sits inside the page's `Container` and its twelve
// columns. Here the grid is abandoned and the screen is cut in two, edge to
// edge, with a different ground on each side. That is the only moment on the
// page where the layout itself changes register, and it lands on the only
// section that stops describing a mechanism and names two things that exist.
//
// The seam is the composition. There is no rule between the halves, no gap and
// no rounded corner: two grounds meeting on a hard vertical line is a stronger
// separator than any border, and it costs nothing but the decision to let the
// colours touch.
//
// ── Ink on the left, cream on the right ───────────────────────────────────
// Not decorative. The page has been alternating cream and ink for four panels
// and has just resolved to cream at the return; the split re-opens that
// alternation horizontally instead of vertically, and then the closing section
// leaves both. Reversing the two halves loses the join to the panel above.
//
// Below `lg` the halves stack, which turns the seam into a horizontal one —
// still two grounds meeting, and still no border.

const HALVES = [
  { ground: "bg-ink text-cream", body: "text-white/70", rule: "bg-white/20", link: "border-white/30 hover:border-white text-cream", claim: "text-near-green-accent" },
  { ground: "bg-cream text-ink", body: "text-ink-soft", rule: "bg-rule", link: "border-foreground/30 hover:border-foreground text-ink", claim: "text-green-ink" },
] as const;

export default function SplitProducts() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section ref={rootRef}>
      <div className="bg-cream pb-[8svh] pt-[12svh]">
        <Container>
          <div data-reveal>
            <Eyebrow className="text-gray-intermediate">{PRODUCTS.eyebrow}</Eyebrow>
            <h2 className="mt-10 max-w-[14ch] text-statement text-balance">
              {PRODUCTS.headline}
            </h2>
          </div>
        </Container>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {PRODUCTS.items.map((p, i) => {
          const t = HALVES[i % HALVES.length];
          return (
            <article
              key={p.id}
              {...(i === 0 ? { "data-nav-dark": "" } : {})}
              className={`flex flex-col justify-between gap-16 px-5 py-[10svh] sm:px-10 lg:min-h-svh lg:px-16 ${t.ground}`}
            >
              <div data-reveal>
                <p className="text-caption-mono opacity-60">{p.index}</p>
                <h3 className="mt-8 text-h1 text-balance">{p.name}</h3>
                <p className={`mt-6 max-w-[22ch] text-h3-serif italic text-pretty ${t.claim}`}>
                  {p.claim}
                </p>
              </div>

              <div data-reveal>
                <div className={`h-px w-full ${t.rule}`} aria-hidden="true" />
                <p className={`mt-8 max-w-[44ch] text-body text-pretty ${t.body}`}>{p.body}</p>
                <Link
                  href={p.href}
                  className={`mt-8 inline-flex items-center gap-2 border-b pb-1 text-label transition-colors ${t.link}`}
                >
                  {p.linkLabel}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="bg-cream pb-[12svh] pt-[10svh]">
        <Container>
          <p
            data-reveal
            className="max-w-[46ch] text-body-lg text-ink-soft text-pretty lg:ml-auto"
          >
            {PRODUCTS.tieBack}
          </p>
        </Container>
      </div>
    </section>
  );
}
