"use client";

import Image from "next/image";
import Container from "@/components/primitives/Container";
import Grid from "@/components/primitives/Grid";
import Accent from "@/components/primitives/Accent";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { DIAGRAMS, type DiagramKey } from "@/components/sections/protocol/spineDiagrams";

/**
 * The protocol, as six equal claims on one spine.
 *
 * This replaces the featured/compact split, which ranked three of these
 * sections above the other three on no authority but mine — the doc treats
 * them as peers and so does this. Each card carries the same weight, the same
 * frame and the same amount of the page.
 *
 * The mechanic: cards alternate either side of a centre spine and sit CLOSED
 * — a numbered header and a footer fact, nothing more. Exactly one card is
 * open at a time, and it is whichever one the reading line is currently on.
 * Opening it reveals a diagram that animates the claim; scrolling past closes
 * it again and opens the next.
 *
 * Why that is worth the machinery: six full-width feature blocks is a spec
 * sheet you skim. This makes the page spend its attention one claim at a
 * time, and it makes the illustrations earn their place — they only run while
 * someone is actually looking at them.
 *
 * Geometry is the site grid, not arithmetic: 5 columns, a 2-column channel
 * for the spine, 5 columns. Load the page with `?grid` to see it.
 */

type Item = {
  key: DiagramKey;
  title: string;
  body: string;
  fact: string;
  cta?: { label: string; href: string };
};

const ITEMS: Item[] = [
  {
    key: "nightshade",
    title: "Nightshade 3.0",
    body: "The newest protocol upgrade decouples consensus from execution, adds multi-contract atomic interactions, and introduces a private shard for confidential transactions.",
    fact: "Stateless validation",
  },
  {
    key: "resharding",
    title: "Dynamic resharding",
    body: "A shard splits automatically when it hits its state-size threshold, validated by state witnesses, with no vote and no human intervention.",
    fact: "No vote, no downtime",
    cta: { label: "Learn more", href: "https://near.org/blog/introducing-dynamic-resharding" },
  },
  {
    key: "speed",
    title: "Speed. Scale. Access.",
    body: "600ms blocks and 1.2s finality. Global contracts deploy once and run network-wide. In-memory state removes database latency from the hot path.",
    fact: "600ms blocks · 1.2s finality",
  },
  {
    key: "private-shard",
    title: "Private Shard",
    body: "Transactions are shielded from public view, with selective disclosure for compliance-readiness. The foundation for Confidential Intents.",
    fact: "Confidential by default",
  },
  {
    key: "quantum",
    title: "Quantum-safe accounts",
    body: "Accounts are decoupled from cryptography, so upgrading to quantum-safe keys takes a single key rotation. FIPS-204 (ML-DSA), NIST-approved.",
    fact: "FIPS-204 (ML-DSA)",
    cta: { label: "Read the deep-dive", href: "https://near.org/blog/making-near-protocol-post-quantum-safe" },
  },
  {
    key: "chain-signatures",
    title: "Chain Signatures",
    body: "Through threshold MPC, a single NEAR account signs and triggers native transactions across Bitcoin, Ethereum, Solana and more, with no bridge contracts.",
    fact: "30+ chains, no bridge",
  },
];

/** The reading line. Cards open as their slot crosses it. */
const LINE = "55%";

export default function ProtocolSpine() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    // BOTH conditions, deliberately. `gsap.matchMedia()` only runs the
    // callback while at least one of its queries matches — with
    // `no-preference` alone, a reader who asked for reduced motion runs NONE
    // of this, so the disarmed branch below never executes and the diagrams
    // sit at whatever their JSX start styles were (several of them: invisible).
    mm.add({ motionOk: MQ.motion, reduced: MQ.reduce }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean; reduced: boolean };
      const cards = q("[data-card]");

      // Diagram timelines are built once per card and only ever played while
      // that card is open. Six looping animations running at once off-screen
      // is exactly the kind of thing that makes a page feel heavy.
      const timelines = cards.map((card) => {
        const key = card.dataset.diagram as DiagramKey;
        return DIAGRAMS[key].build(card);
      });

      if (!motionOk) {
        // Disarmed: every card sits open. Nothing is behind an interaction
        // that a reader cannot perform.
        gsap.set(q("[data-body]"), { height: "auto" });
        gsap.set(q("[data-bracket-line]"), { scaleY: 1 });
        // …and each diagram is fast-forwarded to its resolved state. Several
        // of them START blank — an undrawn arc, a key at zero opacity — so
        // leaving the timelines parked at zero would have shown someone who
        // asked for less motion six half-empty frames.
        timelines.forEach((tl) => {
          tl.progress(1);
          tl.pause();
        });
        return () => timelines.forEach((tl) => tl.kill());
      }

      gsap.set(q("[data-body]"), { height: 0 });
      gsap.set(q("[data-bracket-line]"), { scaleY: 0, transformOrigin: "top" });

      cards.forEach((card, i) => {
        const slot = card.parentElement;
        if (!slot) return;
        const body = card.querySelector("[data-body]");
        const line = card.querySelector("[data-bracket-line]");

        ScrollTrigger.create({
          // The SLOT is the trigger, never the card: the card's height is the
          // thing being animated, and a trigger that re-measures itself
          // mid-animation oscillates.
          trigger: slot,
          start: `top ${LINE}`,
          end: `bottom ${LINE}`,
          onToggle: (self) => {
            const open = self.isActive;
            gsap.to(body, {
              height: open ? "auto" : 0,
              duration: open ? 0.62 : 0.42,
              ease: open ? "power3.out" : "power2.in",
            });
            gsap.to(line, {
              scaleY: open ? 1 : 0,
              duration: open ? 0.5 : 0.3,
              delay: open ? 0.12 : 0,
              ease: "power2.out",
            });
            card.dataset.open = open ? "true" : "false";
            if (open) timelines[i].restart();
            else timelines[i].pause(0);
          },
        });
      });

      // Progress down the spine, scrubbed across the whole list.
      const list = q("[data-list]")[0];
      if (list) {
        gsap.fromTo(
          q("[data-spine-fill]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: list,
              start: `top ${LINE}`,
              end: `bottom ${LINE}`,
              scrub: 0.4,
            },
          }
        );
      }

      gsap.from(q("[data-spine-head]"), {
        autoAlpha: 0,
        y: 26,
        duration: 0.9,
        stagger: 0.1,
        ease: EASE_OUT,
        scrollTrigger: { trigger: scope, start: "top 78%" },
      });

      return () => timelines.forEach((tl) => tl.kill());
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} data-nav-dark className="relative overflow-hidden bg-ink text-cream">
      {/* The section opens on a real image and then resolves into flat ink for
          the cards. It is the same subject the diagrams draw — a lattice of
          shards with a few lit — so the generated art reads as the wide shot
          and the diagrams as the close-ups, rather than as two unrelated
          visual systems sharing a page. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[78svh]">
        <Image
          src="/prototype/protocol/shard-field.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Bottom scrim: resolves to the flat section colour before the first
            card, so nothing sits on top of texture. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,16,16,0.15)_0%,rgba(16,16,16,0.5)_46%,var(--ink)_94%)]" />
        {/* Left scrim: the heading is always on near-flat ground. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--ink)_0%,rgba(16,16,16,0.82)_26%,rgba(16,16,16,0.2)_62%,transparent_100%)]" />
      </div>

      <Container className="relative pb-16 pt-32 lg:pb-24 lg:pt-40">
        <Grid as="header" className="mb-24 lg:mb-32">
          <div className="col-span-12 lg:col-span-7">
            <p data-spine-head className="text-eyebrow text-cream/50">
              The protocol
            </p>
            <h2 data-spine-head className="mt-5 text-h1 text-balance">
              Six capabilities,
              <br />
              <Accent>one protocol</Accent>
            </h2>
            <p data-spine-head className="mt-7 max-w-[46ch] text-body-lg text-cream/60 text-pretty">
              No headline feature and five footnotes. Each of these is load-bearing,
              and each one is live.
            </p>
          </div>
        </Grid>

        <div className="relative">
          {/* The spine. Its two-column channel is the grid's, so the cards
              never have to know where it is. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 lg:block"
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,var(--rule)_0_2px,transparent_2px_7px)] opacity-25" />
            <div
              data-spine-fill
              className="absolute inset-0 origin-top bg-[linear-gradient(to_bottom,var(--cta-deep),var(--cta-mint))]"
            />
          </div>

          <ol data-list className="relative">
            {ITEMS.map((item, i) => {
              const { Art } = DIAGRAMS[item.key];
              const right = i % 2 === 1;
              return (
                <Grid
                  as="li"
                  key={item.key}
                  // A tall, FIXED slot per card. It is what makes "one card
                  // open at a time" true by construction: consecutive slots
                  // tile the scroll, so the reading line is always inside
                  // exactly one of them.
                  className="min-h-[72svh] content-center lg:min-h-[82svh]"
                >
                  <article
                    data-card
                    data-diagram={item.key}
                    data-open="false"
                    className={`group/card relative col-span-12 border border-cream/12 bg-cream/[0.028] backdrop-blur-[2px] transition-colors duration-500 data-[open=true]:border-cream/25 lg:col-span-5 ${
                      right ? "lg:col-start-8" : "lg:col-start-1"
                    }`}
                  >
                    {/* The bracket: number box down to the footer fact. It
                        draws itself as the card opens, which is the small
                        detail that makes opening feel mechanical rather than
                        like a div growing. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-14 left-[34px] top-14 w-px"
                    >
                      <span
                        data-bracket-line
                        className="absolute inset-0 origin-top bg-cta-deep/50"
                      />
                      <span className="absolute bottom-0 left-0 h-px w-4 bg-cta-deep/50" />
                    </span>

                    <header className="flex h-14 items-center gap-4 border-b border-cream/10 px-5">
                      <span className="grid size-7 shrink-0 place-items-center border border-cream/30 font-mono text-caption text-cream/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-mono text-label text-cream">{item.title}</h3>
                    </header>

                    <div data-body className="overflow-hidden">
                      {/* Every open card is EXACTLY the same size: fixed body
                          height, the diagram taking whatever the copy leaves,
                          and a reserved slot for the link whether or not this
                          one has a link. Six claims that matter equally should
                          not be sized by how long their sentence ran or
                          whether an outbound URL exists. */}
                      <div className="flex h-[27rem] flex-col px-5 pb-6 pt-6">
                        <div className="ml-10 min-h-0 flex-1 text-cream">
                          <Art />
                        </div>
                        <p className="ml-10 mt-6 max-w-[52ch] text-body-sm text-cream/60 text-pretty">
                          {item.body}
                        </p>
                        <div className="ml-10 mt-5 h-9">
                          {item.cta && (
                            <a
                              href={item.cta.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-q-arrow-host
                              className="flex w-fit items-center gap-3 text-label text-cream"
                            >
                              <ArrowCircle />
                              {item.cta.label}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <footer className="flex h-14 items-center gap-3 border-t border-cream/10 px-5 pl-[66px]">
                      <span className="font-mono text-caption text-cream/45">{item.fact}</span>
                    </footer>
                  </article>
                </Grid>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
