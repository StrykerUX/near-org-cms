"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { SCHEMES } from "@/components/sections/quantum-security-labs/labContent";
import {
  LIVE_TODAY_POINTS as POINTS,
  EXTERNAL_LINKS,
} from "@/components/sections/quantum-security-copy/quantumContent";

// ── H2 · §What's live today ────────────────────────────────────────────────
// The three bullets as the house's staircase: a hairline over each column, the
// columns stepped down (`lg:mt-0 / lg:mt-14 / lg:mt-28`). It is `WhyItMatters`
// from both chain proposals, unchanged in mechanism.
//
// **The staircase is not decoration here, it is the reading order.** These
// three are not three parallel features — they are a short argument in
// sequence: the protocol was already built for multiple signature types, so the
// new scheme lands at the account by default, so it is in production rather
// than in a demo. Level columns say "read in any order"; a staircase says
// "left to right, and each one leans on the last". The chain pages use the same
// device for the same reason.
//
// **The scheme rule is the figure.** Three horizontal rules of growing length,
// the third in green: the protocol accepted two schemes and now accepts three.
// That is the one thing this section claims that no other section does —
// agility — and it is a claim about a LIST, so a list is what it should look
// like. No axis and no numbers, because there is nothing here to measure.
//
// The rules are drawn on the reveal (`scaleX` from `origin-left`), the same
// gesture `chain/ProofBand` uses for its stat rules.
const STEP = ["lg:mt-0", "lg:mt-14", "lg:mt-28"] as const;
// The bar lengths are a ranking, not a measurement — how long each scheme has
// been part of the protocol, oldest longest. Kept coarse on purpose so nobody
// reads a duration off them.
const BAR = ["w-full", "w-[76%]", "w-[42%]"] as const;

export default function LiveToday() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 88%" });

  return (
    <section className="bg-background py-20 text-foreground lg:py-28">
      <Container className="flex flex-col gap-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-ink-soft">Live today</Eyebrow>
            <h2 className="text-pretty text-h2">
              Post-quantum signing,
              <br />
              <Accent>live on mainnet</Accent>
            </h2>
          </div>
          <div className="flex flex-col gap-6 lg:pt-2">
            <p className="max-w-[52ch] text-pretty text-body-lg text-ink-soft">
              NEAR supports FIPS-204 (ML-DSA), a NIST-approved lattice-based post-quantum
              signature scheme, at the protocol level. Any account holder rotates to
              quantum-safe keys through the NEAR CLI.
            </p>
            <CtaPill href={EXTERNAL_LINKS.rotateKeysCli} tone="filled" external>
              Rotate your keys with the NEAR CLI
            </CtaPill>
          </div>
        </div>

        <div ref={ref} className="flex flex-col gap-16">
          {/* ── the three points, stepped ─────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {POINTS.map((p, i) => (
              <div key={p.title} data-reveal className={`flex flex-col gap-5 ${STEP[i]}`}>
                <div className="h-px w-full bg-rule" aria-hidden="true" />
                <h3 className="text-pretty text-h3">{p.title}</h3>
                <p className="text-pretty text-body text-foreground/75">{p.body}</p>
              </div>
            ))}
          </div>

          {/* ── the scheme list ───────────────────────────────────────────── */}
          <figure data-reveal className="flex flex-col gap-4 border-t border-rule pt-8">
            <figcaption className="uppercase text-caption-mono text-gray-intermediate">
              Signature schemes the protocol accepts:
            </figcaption>
            <ul className="flex flex-col gap-5">
              {SCHEMES.map((s, i) => (
                <li key={s.name} className="flex flex-col gap-2">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className={`text-h4 ${s.pq ? "" : "text-gray-intermediate"}`}>
                      {s.name}
                    </span>
                    <span className="uppercase text-caption-mono text-gray-intermediate">
                      {s.family}
                    </span>
                    {s.pq ? (
                      <span className="uppercase text-caption-mono text-green-ink">
                        post-quantum
                      </span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-0.5 origin-left ${BAR[i]} ${
                      s.pq ? "bg-near-green-accent" : "bg-foreground/25"
                    }`}
                  />
                </li>
              ))}
            </ul>
          </figure>
        </div>
      </Container>
    </section>
  );
}
