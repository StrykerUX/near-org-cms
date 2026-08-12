"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { box, pad, type IsoView } from "@/components/sections/quantum/concepts/isoBox";

// CONCEPT A — "Welded / Attached".
//
// The argument is structural, so show the structure. Two specimens in the
// page's existing isometric language:
//
//   left  — one solid. The address and the public key are the same object, so
//           there is nothing to swap; replacing the key replaces the thing.
//   right — two objects. A plinth (the account) and a plate that drops into it
//           (the key). The plate is replaceable; the plinth never moves.
//
// This keeps BOTH of the deck's headlines — §3 over the left, §4 over the right
// — which the shipped section drops.

const VIEW: IsoView = { cx: 230, cy: 168, s: 1 };

// Left specimen: one box, nothing else. Deliberately the simplest shape on the
// page — its whole job is to read as indivisible.
const WELD = box(-38, 38, -38, 38, -22, 34, VIEW);

// Right specimen: plinth, the key plate seated in it, and the replacement
// waiting alongside at the same height.
const PLINTH = box(-40, 40, -40, 40, -24, 6, VIEW);
const KEY_OLD = box(-26, 26, -26, 26, 8, 20, VIEW);
const KEY_NEW = box(-26, 26, -26, 26, 8, 20, { ...VIEW, cx: 372, cy: 150 });

const GROUND = pad(72, -24, VIEW);

const FACE_TOP = "#1b2225";
const FACE_SIDE = "#12171a";
const EDGE = "rgba(255,255,255,0.92)";

function Faces({
  faces,
  topFill = FACE_TOP,
}: {
  faces: { top: string; right: string; front: string };
  topFill?: string;
}) {
  return (
    <>
      <path d={faces.front} fill={FACE_SIDE} stroke={EDGE} strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={faces.right} fill={FACE_SIDE} stroke={EDGE} strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={faces.top} fill={topFill} stroke={EDGE} strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </>
  );
}

export default function ConceptWeld() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => SVGElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const oldKey = q("[data-key-old]")[0];
      const newKey = q("[data-key-new]")[0];
      if (!oldKey || !newKey) return;

      // The swap is the whole idea, so it is the only thing that moves. The
      // plinth is deliberately excluded — "the account does not move" is the
      // point being made.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope, start: "top 60%", once: true },
        defaults: { ease: EASE_OUT },
      });
      tl.to(oldKey, { y: -54, autoAlpha: 0, duration: 0.7 })
        .fromTo(
          newKey,
          { x: 0, y: 0 },
          { x: -142, y: 18, duration: 0.9, ease: "power2.inOut" },
          "-=0.35"
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink-slate text-white">
      <Container className="flex flex-col gap-16 py-40">
        <Eyebrow className="text-white/45">The quantum threat</Eyebrow>

        {/* The hairline between the columns is the section's only divider — the
            two halves are one argument, not two sections. */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-0">
          <div className="flex flex-col gap-8 lg:pr-20">
            <h2 className="text-h2 text-pretty">
              The quantum threat
              <br />
              <Accent>to blockchains</Accent>
            </h2>

            <div className="relative">
              <svg viewBox="0 0 460 300" className="block w-full" aria-hidden="true">
                <path d={GROUND} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <Faces faces={WELD} />
              </svg>
              {/* Both names point at the same solid. That is the entire claim of
                  this half, so it is said with labels rather than prose. */}
              <div className="absolute inset-x-0 top-[6%] flex items-center justify-center gap-3">
                <span className="rounded-full border border-white/25 px-3.5 py-1 text-caption text-white/75">
                  address
                </span>
                <span className="text-caption text-near-green-accent">=</span>
                <span className="rounded-full border border-white/25 px-3.5 py-1 text-caption text-white/75">
                  public key
                </span>
              </div>
              <p className="absolute inset-x-0 bottom-[4%] text-center font-mono text-caption text-white/40">
                one object · nothing to swap
              </p>
            </div>

            <p className="max-w-[46ch] text-body text-white/65 text-pretty">
              Most blockchains derive account ownership from elliptic-curve cryptography,
              which a quantum computer running Shor&rsquo;s algorithm could reverse to steal
              assets from any address with an exposed public key. Bloomberg puts as much as
              $470 billion of Bitcoin at risk to the quantum threat.
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

          <div className="flex flex-col gap-8 border-white/14 lg:border-l lg:pl-20">
            <h2 className="text-h2 text-pretty">
              A key rotation,
              <br />
              <Accent>not a migration</Accent>
            </h2>

            <div className="relative">
              <svg viewBox="0 0 460 300" className="block w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="conceptWeldGreen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--cta-lime)" />
                    <stop offset="45%" stopColor="var(--cta-mint)" />
                    <stop offset="100%" stopColor="var(--cta-deep)" />
                  </linearGradient>
                </defs>
                <path d={GROUND} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <Faces faces={PLINTH} />
                <g data-key-old>
                  <Faces faces={KEY_OLD} />
                </g>
                <g data-key-new>
                  <Faces faces={KEY_NEW} topFill="url(#conceptWeldGreen)" />
                </g>
              </svg>
              <div className="absolute inset-x-0 top-[6%] flex items-center justify-center gap-3">
                <span className="rounded-full border border-white/25 px-3.5 py-1 text-caption text-white/75">
                  alice.near
                </span>
                <span className="text-caption text-white/40">+</span>
                <span className="rounded-full bg-near-green-accent px-3.5 py-1 text-caption text-black">
                  ML-DSA-65
                </span>
              </div>
              <p className="absolute inset-x-0 bottom-[4%] text-center font-mono text-caption text-white/40">
                two objects · the key detaches
              </p>
            </div>

            <p className="max-w-[46ch] text-body text-white/75 text-pretty">
              On most chains, an address is derived from a keypair, so defending against
              quantum attack means migrating the address itself. NEAR accounts are decoupled
              from cryptography, so an account holder rotates to quantum-safe keys in a
              single transaction and keeps the same account.
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
