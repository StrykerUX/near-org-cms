"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import MediaFrame from "@/components/primitives/MediaFrame";
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
//
// ── The captures, and why they go in the middle of each half ──────────────
// This page spends four full screens drawing a mechanism and never shows one
// thing that exists. These two do exist, they have interfaces, and the half
// that names them is the only place on the page where evidence beats drawing.
// Each `MediaFrame` sits between the name block and the body — the halves are
// `justify-between`, so the middle is the one position that does not fight the
// two blocks already anchored to the top and the bottom edge, and it is also
// what stops a very tall column from being a name at the top and a paragraph at
// the bottom with a screen of nothing in between.
//
// The frames take their tone from the ground they are on, so the registration
// marks stay at the same weight on both sides of the seam — a light frame on
// ink would be the one hard-edged rectangle on a page that has none.
//
// The two proportions are different because the two products are: Intents is a
// route across chains, which is a wide, horizontal thing, so it gets the 5/2
// strip; NEAR AI is a console, which is not. Matching them would have made the
// split symmetrical, and the split is the one place the page abandons its grid
// precisely to stop being symmetrical.

// Keyed by product id and not by index: the halves alternate ground by
// position, but the brief for a capture belongs to the product.
const SHOTS = {
  intents: {
    label:
      "NEAR Intents — wide strip of a cross-chain swap: the stated intent, the route between chains, and settlement",
    spec: "2500×1000 · PNG @2x",
    ratio: "5/2",
  },
  ai: {
    label:
      "NEAR AI — agent console: one agent running in a confidential environment, with its execution proof",
    spec: "1600×1200 · PNG @2x",
    ratio: "4/3",
  },
} as const;

const HALVES = [
  { ground: "bg-ink text-cream", body: "text-white/70", rule: "bg-white/20", link: "border-white/30 hover:border-white text-cream", claim: "text-near-green-accent", frame: "dark" },
  { ground: "bg-cream text-ink", body: "text-ink-soft", rule: "bg-rule", link: "border-foreground/30 hover:border-foreground text-ink", claim: "text-green-ink", frame: "light" },
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
                <MediaFrame
                  label={SHOTS[p.id].label}
                  spec={SHOTS[p.id].spec}
                  ratio={SHOTS[p.id].ratio}
                  tone={t.frame}
                />
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
