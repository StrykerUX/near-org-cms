"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CtaPill from "@/components/primitives/CtaPill";
import { SCHEMES } from "@/components/sections/quantum-security-labs/labContent";
import {
  LIVE_TODAY_POINTS as POINTS,
  EXTERNAL_LINKS,
} from "@/components/sections/quantum-security-copy/quantumContent";

// ── H3 · §What's live today ────────────────────────────────────────────────
// Copy on the left, evidence on the right, in the uneven two-column split
// `chain-ab-propuesta-b`'s `Proof` uses: `lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`.
//
// The `minmax(0,…)` is not decoration — that page's own note explains it and it
// applies here for the same reason: a grid track's automatic minimum is its
// content, so a figure with `overflow-visible` can push the track past its
// fraction unless the floor is pinned at 0.
//
// **The three bullets are an editorial list, not three columns.** Same call as
// this proposal's proof strip: `gap` does the separating, no rules, and each
// point reads as a line rather than as a tile. H2 steps them into a staircase
// instead — the two devices say different things about the same three items,
// which is what the pair is for.
//
// **The scheme list is the figure and it is the section's actual claim.** The
// one thing this section asserts that no other does is *agility*: the protocol
// held two signature schemes before ML-DSA, so the post-quantum one extends a
// list rather than replacing one. That is a claim about a LIST, so it is drawn
// as one — three rules of decreasing length, the newest one green. No axis and
// no numbers, because there is nothing here to measure and a chart with a scale
// would invite reading a duration off it.
//
// The bar lengths are a ranking (how long each scheme has been part of the
// protocol, oldest longest), kept coarse on purpose. Their source and their
// limits are in `labContent.ts`.
const BAR = ["w-full", "w-[74%]", "w-[40%]"] as const;

export default function LiveToday() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 86%", stagger: 0.1 });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col gap-5">
          <Eyebrow className="text-ink-soft">Live today</Eyebrow>
          <h2 className="max-w-[20ch] text-pretty text-h2">
            Post-quantum signing, <Accent>live on mainnet</Accent>
          </h2>
        </div>

        <div
          ref={ref}
          className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16"
        >
          {/* ── the copy and the three points ────────────────────────────── */}
          <div className="flex flex-col gap-8">
            <p data-reveal className="max-w-[48ch] text-pretty text-body-lg text-ink-soft">
              NEAR supports FIPS-204 (ML-DSA), a NIST-approved lattice-based post-quantum
              signature scheme, at the protocol level. Any account holder rotates to
              quantum-safe keys through the NEAR CLI.
            </p>

            <dl className="flex flex-col gap-7">
              {POINTS.map((p) => (
                <div key={p.title} data-reveal className="flex flex-col gap-2">
                  <dt className="text-pretty text-h3">{p.title}</dt>
                  <dd className="max-w-[48ch] text-pretty text-body text-foreground/75">
                    {p.body}
                  </dd>
                </div>
              ))}
            </dl>

            <div data-reveal className="pt-2">
              <CtaPill href={EXTERNAL_LINKS.rotateKeysCli} tone="filled" external>
                Rotate your keys with the NEAR CLI
              </CtaPill>
            </div>
          </div>

          {/* ── the scheme list ──────────────────────────────────────────── */}
          <figure data-reveal className="flex flex-col gap-6 lg:pt-2">
            <figcaption className="uppercase text-caption-mono text-gray-intermediate">
              Signature schemes the protocol accepts:
            </figcaption>
            <ul className="flex flex-col gap-8">
              {SCHEMES.map((s, i) => (
                <li key={s.name} className="flex flex-col gap-3">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className={`text-h3 ${s.pq ? "" : "text-gray-intermediate"}`}>
                      {s.name}
                    </span>
                    <span className="text-body text-gray-intermediate">— {s.family}</span>
                    {s.pq ? (
                      <span className="uppercase text-caption-mono text-green-ink">
                        post-quantum
                      </span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-1 rounded-full ${BAR[i]} ${
                      s.pq ? "bg-near-green-accent" : "bg-foreground/20"
                    }`}
                  />
                </li>
              ))}
            </ul>
            <p className="max-w-[40ch] text-pretty text-caption-mono text-gray-intermediate">
              Length is order of adoption, oldest longest — not a duration.
            </p>
          </figure>
        </div>
      </Container>
    </section>
  );
}
