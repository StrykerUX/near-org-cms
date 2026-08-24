"use client";

import { ArrowRight } from "lucide-react";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  EVENTS,
  HERO,
  INSTRUMENT,
  INVOLVEMENT,
  LEGION,
  SOCIALS,
} from "@/components/sections/community/communityContent";

// §1 of the instrument — the front panel.
//
// ── This page routes, and the instrument says so first ────────────────────
// Every other page in this set opens by making a case. This one opens by
// pointing, and the whole reason to build it as an apparatus is that an
// apparatus can show its inputs on the front. So the hero ends in a four-row
// mono index — events, the Legion, channels, ways in — and a reader who arrived
// with a destination leaves the first screen in one click instead of scrolling
// four sections to find out the page has what they want.
//
// The four labels are the four sections' own eyebrows rather than new strings.
// That is not economy: an index that names a section something other than what
// the section calls itself is a second name to keep in sync, and it drifts on
// the first copy pass.
//
// The four targets are ids owned by the four sections of THIS variant. `#events`
// and `#get-involved` are also the targets of `HERO.primary`, `HERO.secondary`
// and `CLOSING.primary`, so renaming either breaks four links, not one.
//
// ── No scene, on purpose ──────────────────────────────────────────────────
// The panels further down are objects to be looked at; the hero is a control to
// be used. Nothing here has to finish playing before the page is usable, which
// is the one rule this page cannot trade for atmosphere.

const INDEX = [
  { id: "events", label: EVENTS.eyebrow, href: "#events" },
  { id: "legion", label: LEGION.eyebrow, href: "#legion" },
  { id: "channels", label: SOCIALS.eyebrow, href: "#channels" },
  { id: "involve", label: INVOLVEMENT.eyebrow, href: "#get-involved" },
] as const;

export default function NetHero() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 95%" });

  return (
    <section
      ref={rootRef}
      className="bg-ink pb-[10svh] pt-[calc(var(--site-header-block)+7svh)] text-cream"
    >
      <Container>
        <div className="grid-ds items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <div data-reveal>
              <Eyebrow className="text-white/40">{HERO.eyebrow}</Eyebrow>
            </div>
            <h1 data-reveal className="mt-6 max-w-[15ch] text-display text-balance">
              The people building the <Accent display>open web</Accent>
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p data-reveal className="max-w-[42ch] text-body-lg text-white/65 text-pretty">
              {HERO.sub}
            </p>
            <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
              <CtaPill href={HERO.primary.href} tone="solid">
                {HERO.primary.label}
              </CtaPill>
              <CtaPill href={HERO.secondary.href} tone="dark">
                {HERO.secondary.label}
              </CtaPill>
            </div>
          </div>
        </div>

        <nav aria-label={INSTRUMENT.index} data-reveal className="mt-20 lg:mt-28">
          <p className="text-micro-mono uppercase text-white/35">{INSTRUMENT.index}</p>
          {/* Four rows and not four pills: a pill is a call to action and there
              are already two of those above. This is a directory — the same
              hairline-and-mono register the panels use, so the hero reads as the
              first face of the instrument rather than as a nav bar. */}
          <ul className="mt-5 grid-ds gap-y-0">
            {INDEX.map((entry, i) => (
              <li key={entry.id} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <a
                  href={entry.href}
                  className="group flex items-baseline gap-4 border-t border-white/12 py-5 transition-colors hover:border-near-green-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-near-green-accent"
                >
                  <span className="text-micro-mono text-white/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-h4">{entry.label}</span>
                  <ArrowRight
                    className="size-4 shrink-0 text-white/35 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
