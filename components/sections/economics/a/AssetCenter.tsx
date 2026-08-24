"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CENTER } from "@/components/sections/economics/economicsContent";

// §5 of variant A — one asset, three jobs, and the close.
//
// Back on cream, which is the point: the page opened on cream, cut to ink for
// the loop, lifted to white for the products, and lands where it started. The
// return is the same gesture the ring makes, at the scale of the whole page.
//
// ── `reinforces` is set apart from `body` ──────────────────────────────────
// Each role has a definition and a consequence, and the consequence is the half
// that does the arguing ("more usage means more settlement in NEAR"). Run
// together as one paragraph the two blur into a description. Split — body in
// ink-soft, consequence under its own rule in the page's green — the three
// columns read as three claims rather than three glossary entries.

export default function AssetCenter() {
  const rootRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={rootRef} className="bg-cream py-[14svh]">
      <Container>
        <div data-reveal>
          <Eyebrow className="text-gray-intermediate">{CENTER.eyebrow}</Eyebrow>
        </div>

        <div className="mt-12 grid-ds gap-y-10">
          <h2 data-reveal className="col-span-12 max-w-[16ch] text-h1 text-pretty lg:col-span-6">
            {CENTER.headline}
          </h2>
          <p
            data-reveal
            className="col-span-12 max-w-[46ch] text-body-lg text-ink-soft text-pretty lg:col-span-5 lg:col-start-8"
          >
            {CENTER.intro}
          </p>
        </div>

        <div className="mt-24 grid-ds gap-y-14">
          {CENTER.roles.map((r) => (
            <div key={r.id} data-reveal className="col-span-12 md:col-span-6 lg:col-span-4">
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <p className="mt-5 text-caption-mono text-gray-intermediate">{r.index}</p>
              <h3 className="mt-7 max-w-[14ch] text-h3 text-pretty">{r.role}</h3>
              <p className="mt-4 max-w-[34ch] text-body text-ink-soft text-pretty">{r.body}</p>
              <p className="mt-6 max-w-[30ch] text-body-sm-mono text-green-ink text-pretty">
                {r.reinforces}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 grid-ds gap-y-12">
          <p
            data-reveal
            className="col-span-12 max-w-[54ch] text-body-lg text-ink-soft text-pretty lg:col-span-6"
          >
            {CENTER.body}
          </p>

          <div data-reveal className="col-span-12 lg:col-span-5 lg:col-start-8">
            {/* The forward line is the only sentence on the page about what has
                not happened yet, so it is the only one set in the serif. */}
            <p className="max-w-[22ch] text-h2-serif italic text-pretty">{CENTER.forward}</p>
            <CtaPill href={CENTER.cta.href} tone="filled" external className="mt-10">
              {CENTER.cta.label}
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  );
}
