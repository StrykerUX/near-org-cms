"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/sections/quantum/CtaPill";

// CONCEPT B — "The bill".
//
// Argument by sheer visual weight. The deck's claim is that one path costs an
// ecosystem-wide migration and the other costs one transaction; so show the
// invoice for each, at their true relative size, side by side.
//
// The left column is a ledger long enough that it never visibly ends. The right
// column is one line of shell. Nothing else needs saying — the asymmetry IS the
// argument, and it survives being read at a glance from across a room.
//
// Reuses the word-field's vocabulary already on the page (masked mono weave,
// slow drift, seeded generation) rather than inventing a fourth texture.

const COMMAND = "near account add-key alice.near --ml-dsa-65";

const KINDS = [
  "balance", "approval", "integration", "lp position", "allowance", "delegation",
  "subscription", "vesting", "escrow", "collectible", "stake", "bridge route",
  "multisig signer", "streaming pay", "oracle feed", "vault share",
];
const VENUES = [
  "uniswap-v3", "aave-v3", "safe-module", "curve", "lido", "eigenlayer", "morpho",
  "pendle", "gmx", "across", "cowswap", "1inch", "maker", "compound", "balancer",
];

// Deterministic so the server and the client render the same ledger — the same
// reason `wordField.ts` seeds its own LCG instead of calling Math.random().
function buildLedger(count: number) {
  let seed = 20260811;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const hex = (n: number) =>
    Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]).join("");

  return Array.from({ length: count }, () => {
    const kind = KINDS[Math.floor(rnd() * KINDS.length)];
    const venue = VENUES[Math.floor(rnd() * VENUES.length)];
    return `${kind.padEnd(15, " ")} 0x${hex(4)}…${hex(4)}  ${venue}`;
  });
}

// Two copies of the same set, so the drift can loop on -50% without a seam —
// same trick as the marquees.
const LEDGER = buildLedger(90);
const LEDGER_LOOP = [...LEDGER, ...LEDGER];

const DRIFT_SECONDS = 90;

export default function ConceptBill() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const track = q("[data-ledger]")[0];
      if (track) {
        pauseOffscreen(
          gsap.fromTo(
            track,
            { yPercent: 0 },
            { yPercent: -50, duration: DRIFT_SECONDS, ease: "none", repeat: -1 }
          ),
          scope
        );
      }

      const cmd = q("[data-command]")[0];
      const caret = q("[data-caret]")[0];
      if (cmd) {
        // Typed with a stepped clip rather than by mutating textContent: the
        // full string stays in the DOM the whole time, so it is selectable and a
        // screen reader reads it once, complete.
        gsap.fromTo(
          cmd,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.5,
            ease: `steps(${COMMAND.length})`,
            scrollTrigger: { trigger: cmd, start: "top 78%", once: true },
          }
        );
      }
      if (caret) {
        pauseOffscreen(
          gsap.to(caret, { autoAlpha: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" }),
          scope
        );
      }

      const reveals = q("[data-bill-reveal]");
      if (reveals.length) {
        gsap.from(reveals, {
          autoAlpha: 0,
          y: 20,
          duration: 0.8,
          stagger: 0.1,
          ease: EASE_OUT,
          scrollTrigger: { trigger: scope, start: "top 70%", once: true },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink text-white">
      <Container className="flex flex-col gap-20 py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-white/45">The quantum threat</Eyebrow>
            <h2 className="text-h2 text-pretty">
              A key rotation,
              <br />
              <Accent>not a migration</Accent>
            </h2>
          </div>
          <p className="max-w-[52ch] text-body text-white/65 text-pretty lg:pt-10">
            On most chains, an address is derived from a keypair, so defending against
            quantum attack means migrating the address itself. NEAR accounts are decoupled
            from cryptography, so an account holder rotates to quantum-safe keys in a single
            transaction and keeps the same account.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          {/* ── the bill ───────────────────────────────────────────────── */}
          <div data-bill-reveal className="flex flex-col gap-6">
            <div className="flex items-baseline justify-between gap-4 border-b border-white/14 pb-4">
              <Eyebrow className="text-white/50">What a migration touches</Eyebrow>
              <p className="text-h4 text-white/40">
                <Accent display>$470B</Accent>
              </p>
            </div>

            {/* The mask is what makes it read as "and so on, without end". A
                hard-cropped list reads as a list you could finish. */}
            <div
              className="relative h-[26rem] overflow-hidden"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom,rgba(0,0,0,0) 0%,#000 14%,#000 78%,rgba(0,0,0,0) 100%)",
                maskImage:
                  "linear-gradient(to bottom,rgba(0,0,0,0) 0%,#000 14%,#000 78%,rgba(0,0,0,0) 100%)",
              }}
            >
              <div data-ledger className="will-change-transform">
                {LEDGER_LOOP.map((line, i) => (
                  <p
                    key={i}
                    aria-hidden={i >= LEDGER.length}
                    className="whitespace-pre font-mono text-caption text-white/35"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <p className="max-w-[46ch] text-body text-white/60 text-pretty">
              Most blockchains derive account ownership from elliptic-curve cryptography,
              which a quantum computer running Shor&rsquo;s algorithm could reverse to steal
              assets from any address with an exposed public key.
            </p>

            <CtaPill
              href="https://near.org/blog/making-near-protocol-post-quantum-safe"
              size="sm"
              tone="dark"
              external
            >
              How NEAR is preparing for the quantum era
            </CtaPill>
          </div>

          {/* ── the receipt ────────────────────────────────────────────── */}
          <div data-bill-reveal className="flex flex-col gap-6">
            <div className="flex items-baseline justify-between gap-4 border-b border-near-green-accent/40 pb-4">
              <Eyebrow className="text-near-green-accent">What a rotation touches</Eyebrow>
              <p className="text-h4 text-white/40">
                <Accent display>1 tx</Accent>
              </p>
            </div>

            {/* Same height as the ledger, and almost all of it empty. The void is
                doing the work — shrink this box to fit its content and the
                comparison evaporates. */}
            <div className="flex h-[26rem] flex-col justify-center">
              <div className="rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-5">
                <p className="whitespace-pre-wrap break-words font-mono text-caption text-near-green-accent">
                  <span data-command className="inline-block">
                    {COMMAND}
                  </span>
                  <span data-caret aria-hidden="true" className="ml-0.5 inline-block">
                    ▌
                  </span>
                </p>
              </div>
              <ul className="mt-6 flex flex-col gap-2">
                {["Same account", "Same history", "Every integration intact"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-body text-white/70">
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-near-green-accent"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <p className="max-w-[46ch] text-body text-white/60 text-pretty">
              Bloomberg puts as much as $470 billion of Bitcoin at risk to the quantum
              threat — every one of those addresses is a line on the other side of this
              page.
            </p>

            <CtaPill
              href="https://docs.near.org/protocol/accounts-contracts/account-model"
              size="sm"
              tone="dark"
              external
            >
              How the NEAR account model works
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  );
}
