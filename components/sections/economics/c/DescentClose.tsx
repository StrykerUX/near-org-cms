"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CENTER } from "@/components/sections/economics/economicsContent";

// §5 of variant C — one asset, three jobs, and the page's exhale.
//
// ── White, and only here, and at the very end ─────────────────────────────
// A and B spend their single white section on the products. C cannot: its
// products are a full-bleed split, and a split needs two grounds that already
// mean something on this page. So the lift is saved for the close — which is
// also where it does the most, because the descent has just spent five screens
// alternating cream and ink and this is the first ground that is neither.
//
// ── Three columns, and the forward line set larger than any of them ───────
// The three roles are equal in standing, so they get identical columns; nothing
// is emphasised over the others and nothing is boxed. Then the page's last
// sentence — the only one about what has not happened yet — is set at
// `text-statement`, larger than the section's own heading. That inversion is
// the close: the page stops describing the system and points past it.

export default function DescentClose() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section ref={rootRef} className="bg-background py-[14svh]">
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

        <div className="mt-24 grid-ds gap-y-16">
          {CENTER.roles.map((r) => (
            <div key={r.id} data-reveal className="col-span-12 md:col-span-6 lg:col-span-4">
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <p className="mt-5 text-caption-mono text-gray-intermediate">{r.index}</p>
              <h3 className="mt-8 max-w-[12ch] text-h2 text-pretty">{r.role}</h3>
              <p className="mt-6 max-w-[32ch] text-body text-ink-soft text-pretty">{r.body}</p>
              <p className="mt-6 max-w-[30ch] text-body-sm-mono text-green-ink text-pretty">
                {r.reinforces}
              </p>
            </div>
          ))}
        </div>

        <p
          data-reveal
          className="mt-24 max-w-[64ch] text-body-lg text-ink-soft text-pretty"
        >
          {CENTER.body}
        </p>

        <div data-reveal className="mt-20">
          <p className="max-w-[18ch] text-statement text-balance">{CENTER.forward}</p>
          <CtaPill href={CENTER.cta.href} tone="filled" external className="mt-14">
            {CENTER.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
