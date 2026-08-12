"use client";

import type { ReactNode } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/sections/quantum/CtaPill";
import NearMark from "@/components/sections/quantum/NearMark";

// "The quantum threat, and NEAR's answer" — three pairs of facing cards (what
// happens on most chains ← → what happens on NEAR), with a green disc between
// them acting as the hinge.
//
// The original carries TWO versions of this section behind an `sc-if`, and the
// file contradicts itself about which one is live: the props schema selects
// "Paired rows (original)" while the `sc-if` placeholder marks the other. This
// one — the paired rows — was ported by explicit decision. The other
// (`data-stack-root`: four numbered rows opening one at a time, each with its
// own animated isometric SVG) is NOT ported; it is in the source HTML if it is
// ever wanted.
//
// `pin: true` → `position: sticky`: this repo forbids the pin, because its
// pin-spacer fights Lenis, feeds back into PrototypeMotionProvider's
// ResizeObserver, and leaves ghost spacers under StrictMode. The full reasoning
// is in `components/sections/ProofStats.tsx`.

// How much scroll the hold lasts. The original uses `innerHeight * 1.8`; here
// it is declared in CSS and the track height derives from it, so nothing needs
// measuring.
const TRAVEL = "180svh";

function DuelRow({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    // The disc's hover is triggered by the whole ROW (`data-q-arrow-host`), not
    // by the disc: the gesture belongs to the pair of cards, not to the
    // ornament between them.
    <div
      data-duel-row
      data-q-arrow-host
      className="grid items-stretch gap-6 lg:grid-cols-[1fr_64px_1fr]"
    >
      <div data-duel-l className="rounded-2xl border border-white/20 bg-white/5 px-6 py-5">
        {left}
      </div>

      <div
        data-duel-n
        className="order-last flex justify-center self-center justify-self-center lg:order-none"
      >
        {/* Not `ArrowCircle`: that one brings its own bg/size, sized for sitting
            inside a "read more" link. Here the disc is the hinge of the pair,
            and on mobile it rotates 90° to point at the card below. */}
        <span
          data-q-arrow
          aria-hidden="true"
          className="relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-near-green-accent text-black max-lg:rotate-90"
        >
          <svg
            data-q-arrow-out
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
          <svg
            data-q-arrow-in
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>

      <div
        data-duel-r
        className="relative overflow-hidden rounded-2xl bg-white px-6 py-5 text-foreground"
      >
        {right}
      </div>
    </div>
  );
}

export default function ThreatDuel() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion, isDesktop: MQ.desktop }, (mctx) => {
      const { motionOk, isDesktop } = mctx.conditions as {
        motionOk: boolean;
        isDesktop: boolean;
      };

      const rows = q("[data-duel-row]");
      if (!rows.length) return;

      // No motion, or mobile: the cards fall into normal flow, already visible.
      // The attribute and not a plain breakpoint — with reduced motion on
      // desktop the content also has to fall into normal flow.
      if (!motionOk || !isDesktop) return;

      const host = scope as HTMLElement;
      host.dataset.duel = "on";

      const parts = rows.map((r) => ({
        l: r.querySelector<HTMLElement>("[data-duel-l]"),
        n: r.querySelector<HTMLElement>("[data-duel-n]"),
        r: r.querySelector<HTMLElement>("[data-duel-r]"),
      }));

      parts.forEach((p) => {
        if (p.l) gsap.set(p.l, { autoAlpha: 0, x: -32 });
        if (p.r) gsap.set(p.r, { autoAlpha: 0, x: 32 });
        if (p.n) gsap.set(p.n, { autoAlpha: 0, scale: 0.5 });
      });

      // A READ-ONLY ScrollTrigger over the track: `start`/`end` run end to end
      // of the section, and the sticky child is what actually holds still.
      // Never `pin: true`.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      parts.forEach((p, i) => {
        const at = 0.06 + i * 0.3;
        if (p.l) tl.to(p.l, { autoAlpha: 1, x: 0, duration: 0.11, ease: "power2.out" }, at);
        if (p.n)
          tl.to(
            p.n,
            { autoAlpha: 1, scale: 1, duration: 0.07, ease: "back.out(1.8)" },
            at + 0.1
          );
        if (p.r)
          tl.to(p.r, { autoAlpha: 1, x: 0, duration: 0.11, ease: "power2.out" }, at + 0.18);
      });

      // Dead tail out to 1: the last card finishes arriving at ~0.85, and
      // without this the scrub would reach the end of its travel before the end
      // of the track, leaving the section held with everything already in.
      tl.to({}, { duration: 0.06 }, 1);

      return () => {
        delete host.dataset.duel;
        const all = parts.flatMap((p) => [p.l, p.n, p.r]).filter(Boolean) as HTMLElement[];
        gsap.killTweensOf(all);
        gsap.set(all, { clearProps: "opacity,visibility,transform" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // No overflow-hidden here: an ancestor with overflow other than visible
    // becomes the sticky child's scroll container and it stops sticking. It goes
    // on the stuck child, which is allowed to have it.
    <section
      ref={rootRef}
      data-duel="off"
      data-nav-dark
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/duel relative bg-ink-slate text-white data-[duel=on]:h-[calc(100svh+var(--travel))]"
    >
      <div className="group-data-[duel=on]/duel:sticky group-data-[duel=on]/duel:top-0 group-data-[duel=on]/duel:flex group-data-[duel=on]/duel:h-svh group-data-[duel=on]/duel:items-center group-data-[duel=on]/duel:overflow-hidden">
        {/* The vertical padding is dropped once the sticky layout is on: the
            child is exactly one viewport tall there, so any padding comes
            straight off the space the three rows have to live in and the
            header gets clipped off the top. Same trade as ProofStepper. */}
        <Container className="flex w-full flex-col justify-center gap-14 py-24 group-data-[duel=on]/duel:py-0">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="flex flex-col gap-5">
              <Eyebrow className="text-white/45">The quantum threat</Eyebrow>
              <h2 className="text-h2 text-pretty">
                The quantum threat,
                <br />
                <Accent>and NEAR&rsquo;s answer</Accent>
              </h2>
            </div>

            <div className="flex flex-col gap-[18px]">
              <p className="max-w-[52ch] text-body text-white/65 text-pretty">
                On most chains, an address is derived from a keypair, so defending against
                quantum attack means migrating the address itself. NEAR accounts are
                decoupled from cryptography, so an account holder rotates to quantum-safe
                keys in a single transaction and keeps the same account.
              </p>
              <div className="flex flex-wrap items-center gap-x-9 gap-y-4">
                <CtaPill
                  href="https://near.org/blog/making-near-protocol-post-quantum-safe"
                  size="sm"
                  tone="dark"
                  external
                >
                  How NEAR is preparing for the quantum era
                </CtaPill>
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
          </div>

          <div className="flex flex-col gap-5">
            {/* The column labels. They disappear on mobile: the cards stack one
                above the other and "left/right" stops meaning anything — each
                card already carries its own eyebrow. */}
            <div className="hidden items-center gap-6 lg:grid lg:grid-cols-[1fr_64px_1fr]">
              <Eyebrow className="text-white/50">Most chains</Eyebrow>
              <span aria-hidden="true" />
              <p className="flex items-center gap-3 text-eyebrow uppercase text-near-green-accent">
                <span
                  aria-hidden="true"
                  className="flex size-[26px] shrink-0 items-center justify-center rounded-[7px] bg-near-green-accent text-black"
                >
                  <NearMark className="size-[15px]" />
                </span>
                On NEAR
              </p>
            </div>

            <DuelRow
              left={
                <>
                  <Eyebrow className="text-white/50">Public key exposed</Eyebrow>
                  {/* A key fingerprint is read in blocks, and at normal tracking
                      the groups of four run into each other. */}
                  {/* ds-exempt: key fingerprint, read in blocks */}
                  <p className="mb-1 mt-3 text-h4 tracking-[0.05em]">
                    secp256k1 : 4fA9 ···· c21B
                  </p>
                  <p className="text-caption text-white/45">
                    Every address that signs reveals its public key — and the address is
                    derived from it. It can be harvested today, attacked later.
                  </p>
                </>
              }
              right={
                <>
                  <Eyebrow className="text-gray-blue">Account, not keypair</Eyebrow>
                  <p className="mb-1 mt-3 text-h4">alice.near</p>
                  <p className="text-caption text-gray-blue">
                    A NEAR account is not derived from any key. Keys are attachments the
                    account holder can swap.
                  </p>
                </>
              }
            />

            <DuelRow
              left={
                <>
                  <Eyebrow className="text-white/50">The attack</Eyebrow>
                  <p className="mb-1 mt-3 text-h4">Shor&rsquo;s algorithm</p>
                  <p className="text-caption text-white/45">
                    A quantum computer reverses the exposed public key into the private key.
                    Escaping it means migrating every asset to a new address.
                  </p>
                </>
              }
              right={
                <>
                  <Eyebrow className="text-gray-blue">The upgrade</Eyebrow>
                  <div className="mb-1.5 mt-3 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center rounded-full border border-rule px-3.5 py-1 text-label text-gray-blue">
                      ed25519 key
                    </span>
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-blue"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    <span className="inline-flex items-center rounded-full bg-near-green-accent px-3.5 py-1 text-label text-black">
                      ML-DSA-65 · post-quantum
                    </span>
                  </div>
                  <p className="text-caption text-gray-blue">
                    Rotate to NIST-approved FIPS-204 keys through the NEAR CLI. Same account,
                    same history, every integration intact.
                  </p>
                </>
              }
            />

            <DuelRow
              left={
                <>
                  <Eyebrow className="text-white/50">What&rsquo;s at stake</Eyebrow>
                  <p className="mb-1 mt-2 text-h2">
                    <Accent display>$470B</Accent>
                  </p>
                  <p className="text-caption text-white/45">
                    of Bitcoin exposed to the quantum threat — Bloomberg
                  </p>
                </>
              }
              right={
                <>
                  {/* The watermark sits behind the text and bleeds past the
                      card; the overflow-hidden that crops it is on
                      `data-duel-r`. */}
                  <NearMark className="pointer-events-none absolute -bottom-12 -right-9 size-[200px] text-foreground opacity-[0.09]" />
                  <div className="relative">
                    <Eyebrow className="text-green-ink">Where NEAR is</Eyebrow>
                    <p className="mb-1 mt-2 text-h2">
                      Live <Accent display>today</Accent>
                    </p>
                    <p className="max-w-[34ch] text-caption text-gray-blue">
                      Post-quantum signing protects the balance in the account, on mainnet,
                      by default.
                    </p>
                  </div>
                </>
              }
            />
          </div>
        </Container>
      </div>
    </section>
  );
}
