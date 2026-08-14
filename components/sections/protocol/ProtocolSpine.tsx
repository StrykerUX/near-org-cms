"use client";

import Image from "next/image";
import Container from "@/components/primitives/Container";
import Accent from "@/components/primitives/Accent";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { DIAGRAMS, type DiagramKey } from "@/components/sections/protocol/spineDiagrams";

/**
 * The protocol, as six equal claims on a horizontal shelf.
 *
 * Third form of this section. The first ranked three claims over the other
 * three on no authority; the second ran all six down a vertical centre spine.
 * This one lays the six cards side by side like books on a shelf: closed, a
 * card is a narrow spine with its title running vertically; open, it expands
 * horizontally into the full claim — diagram, copy, fact.
 *
 * The mechanic: the section is a tall scroll track with a sticky viewport
 * (sticky, never `pin: true` — repo rule, see sections/README.md). Track
 * progress divides into N+1 slices: the first shows the shelf fully closed —
 * you arrive and see all six spines — and each following slice opens exactly
 * one card. Scrolling cycles through all six, then the section unpins and the
 * page moves on. Reverse scroll walks back the same path.
 *
 * The cards stay DARK in both states (Lawrence's call, matched to the NEAR
 * Stack brand frames): closed is a hairline-bordered spine, open is a
 * slightly deeper panel (bg-ink-deep) with a brighter border — separation
 * comes from borders and gaps, not from inverting to light. The diagrams in
 * spineDiagrams.tsx draw cream hairlines + green cubes for the same ground.
 *
 * Fallback (mobile, or desktop with reduced motion): no track, no accordion —
 * the cards stack vertically, all open, diagrams fast-forwarded to their
 * resolved state. Nothing lives behind an interaction a reader cannot
 * perform. The `data-mode="accordion"` attribute on the section is what flips
 * the layout classes (`group-data-[mode=accordion]/spine:*`), so the DOM is
 * one structure with two dressings.
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

// Las cifras de prueba, absorbidas del viejo ProofGrid (sección aparte,
// eliminada): acá son texto secundario del encabezado — parte del lede, no
// pills ni una sección propia. Mismos seis pares figura/nota del doc.
const PROOF = [
  { figure: "100% uptime", note: "5+ years on mainnet" },
  { figure: "1M+ TPS", note: "publicly verifiable" },
  { figure: "600ms", note: "block time" },
  { figure: "1.2s", note: "finality" },
  { figure: "10 shards", note: "plus a private shard" },
  { figure: "<$0.002", note: "avg transaction fee" },
] as const;

export default function ProtocolSpine() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    // The three conditions together always match SOMETHING, so the callback
    // always runs and the fallback branch actually executes for readers with
    // reduced motion — see the matchMedia bug note in the page brief.
    mm.add(
      { motionOk: MQ.motion, reduced: MQ.reduce, isDesktop: MQ.desktop },
      (mctx) => {
        const { motionOk, isDesktop } = mctx.conditions as {
          motionOk: boolean;
          reduced: boolean;
          isDesktop: boolean;
        };
        const cards = q("[data-card]");

        // Diagram timelines are built once per card and only played while
        // that card is open — six looping animations at once is exactly what
        // makes a page feel heavy.
        const timelines = cards.map((card) => {
          const key = card.dataset.diagram as DiagramKey;
          return DIAGRAMS[key].build(card);
        });

        const accordion = motionOk && isDesktop;
        if (!accordion) {
          // Stacked fallback: every card open (dark panel), every diagram at
          // its resolved end state (several START blank — parked at zero
          // they'd show half-empty frames).
          cards.forEach((card) => (card.dataset.open = "true"));
          timelines.forEach((tl) => {
            tl.progress(1);
            tl.pause();
          });
          return () => {
            timelines.forEach((tl) => tl.kill());
            cards.forEach((card) => (card.dataset.open = "false"));
          };
        }

        // ── The shelf ────────────────────────────────────────────────────
        scope.dataset.mode = "accordion";
        const contents = q("[data-card-content]");
        gsap.set(contents, { autoAlpha: 0 });

        // -1 = shelf closed. The width animation is a flexGrow tween: closed
        // cards hold their fixed basis (the spine width, set in CSS), the
        // open one takes every remaining pixel. Tweening the grow factor is
        // what makes neighbours slide out of the way in the same motion.
        let active = -1;
        const setActive = (idx: number) => {
          if (idx === active) return;
          active = idx;
          cards.forEach((card, i) => {
            const open = i === idx;
            card.dataset.open = open ? "true" : "false";
            gsap.to(card, {
              flexGrow: open ? 1 : 0,
              duration: 0.65,
              ease: "power3.inOut",
              overwrite: "auto",
            });
            gsap.to(card.querySelector("[data-spine-label]"), {
              autoAlpha: open ? 0 : 1,
              duration: 0.3,
              delay: open ? 0 : 0.3,
              overwrite: "auto",
            });
            gsap.to(card.querySelector("[data-card-content]"), {
              autoAlpha: open ? 1 : 0,
              duration: 0.35,
              delay: open ? 0.28 : 0,
              overwrite: "auto",
            });
            if (open) timelines[i].restart();
            else timelines[i].pause(0);
          });
        };

        // Track progress → active card. N+1 slices: the first is the closed
        // shelf (you arrive and SEE the six spines before anything opens),
        // then one slice per card, then unpin.
        ScrollTrigger.create({
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) =>
            setActive(
              Math.min(ITEMS.length - 1, Math.floor(self.progress * (ITEMS.length + 1)) - 1)
            ),
          onLeaveBack: () => setActive(-1),
        });

        gsap.from(q("[data-spine-head]"), {
          autoAlpha: 0,
          y: 26,
          duration: 0.9,
          stagger: 0.1,
          ease: EASE_OUT,
          scrollTrigger: { trigger: scope, start: "top 78%" },
        });

        return () => {
          timelines.forEach((tl) => tl.kill());
          delete scope.dataset.mode;
          cards.forEach((card) => (card.dataset.open = "false"));
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    // Height ONLY in accordion mode: ~100svh of viewport plus seven scroll
    // slices. NO overflow-hidden here — an overflow ancestor silently kills
    // the sticky viewport (same trap as OwnYourOwn's title).
    <section
      ref={rootRef}
      data-nav-dark
      className="group/spine relative bg-ink text-cream data-[mode=accordion]:h-[480svh]"
    >
      {/* Opening backdrop — the wide shot the diagrams are close-ups of. It
          lives at the top of the TRACK, so it scrolls away naturally while
          the shelf stays pinned. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[78svh]">
        <Image
          src="/prototype/protocol/shard-field.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,16,16,0.15)_0%,rgba(16,16,16,0.5)_46%,var(--ink)_94%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--ink)_0%,rgba(16,16,16,0.82)_26%,rgba(16,16,16,0.2)_62%,transparent_100%)]" />
      </div>

      {/* The sticky viewport. In fallback mode these classes are inert and
          the section is normal flow. */}
      <div className="relative group-data-[mode=accordion]/spine:sticky group-data-[mode=accordion]/spine:top-0 group-data-[mode=accordion]/spine:flex group-data-[mode=accordion]/spine:h-svh group-data-[mode=accordion]/spine:flex-col group-data-[mode=accordion]/spine:justify-center">
        <Container className="w-full pb-16 pt-28 group-data-[mode=accordion]/spine:pb-0 group-data-[mode=accordion]/spine:pt-24">
          {/* Compact header: heading left, lede + proof right — it has to
              share a pinned viewport with the shelf. */}
          <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div>
              <p data-spine-head className="text-eyebrow text-cream/50">
                The protocol
              </p>
              {/* El heading retoma la promesa del hero ("The settlement layer
                  for the agent economy") — los diagramas son literalmente los
                  close-ups del plano general del hero, y el título lo dice. */}
              <h2 data-spine-head className="mt-4 text-h2 text-balance">
                The settlement layer,
                <br />
                <Accent>up close</Accent>
              </h2>
              {/* El copy de apoyo va PEGADO al título, como el subtítulo de
                  los frames del NEAR Stack — el título no queda suelto. */}
              <p
                data-spine-head
                className="mt-4 max-w-[44ch] text-body-sm text-cream/60 text-pretty"
              >
                No headline feature and five footnotes. Each of these is
                load-bearing, and each one is live.
              </p>
            </div>
            <div className="lg:max-w-[26rem] lg:text-right">
              {/* Las cifras de prueba como texto corrido secundario: parte del
                  encabezado, sin pills ni grid. */}
              <p data-spine-head className="text-caption text-cream/40">
                {PROOF.map((p, i) => (
                  <span key={p.figure} className="whitespace-nowrap">
                    <span className="text-cream/75">{p.figure}</span> {p.note}
                    {i < PROOF.length - 1 && <span aria-hidden="true"> · </span>}
                  </span>
                ))}
              </p>
            </div>
          </header>

          {/* The shelf. Fallback: a vertical stack of open cards. Accordion:
              one row, fixed height, spines + one expanded card. */}
          <div className="flex flex-col gap-5 group-data-[mode=accordion]/spine:h-[56svh] group-data-[mode=accordion]/spine:max-h-[36rem] group-data-[mode=accordion]/spine:flex-row group-data-[mode=accordion]/spine:gap-4">
            {ITEMS.map((item, i) => {
              const { Art } = DIAGRAMS[item.key];
              const nn = String(i + 1).padStart(2, "0");
              return (
                <article
                  key={item.key}
                  data-card
                  data-diagram={item.key}
                  data-open="false"
                  // Caja del sistema: rounded-3xl, SIEMPRE oscura (frames del
                  // NEAR Stack). La separación entre boxes sale de borde + gap,
                  // no de invertir a claro: cerrada es lomo con hairline,
                  // abierta es panel más profundo (ink-deep) con borde más
                  // presente. En accordion la base fija es el ancho del lomo;
                  // el flexGrow lo tuinea el efecto.
                  className="group/card relative overflow-hidden rounded-3xl border border-cream/12 bg-cream/[0.02] transition-colors duration-500 data-[open=true]:border-cream/25 data-[open=true]:bg-ink-deep group-data-[mode=accordion]/spine:min-w-0 group-data-[mode=accordion]/spine:[flex:0_0_4.25rem]"
                >
                  {/* El lomo (solo accordion): número arriba, título corriendo
                      en vertical como el lomo de un libro. aria-hidden — el
                      título accesible vive en el contenido. */}
                  <div
                    aria-hidden="true"
                    data-spine-label
                    className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-between py-6 group-data-[mode=accordion]/spine:flex"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md border border-cream/30 font-mono text-caption text-cream/70">
                      {nn}
                    </span>
                    <span className="whitespace-nowrap text-h4 text-cream [writing-mode:vertical-rl]">
                      {item.title}
                    </span>
                    <span className="size-7" />
                  </div>

                  {/* El contenido abierto. `min-w` fija el ancho de composición
                      para que el texto no refluya mientras la card se expande —
                      el overflow-hidden de la card recorta el resto. Tipo cream
                      sobre el panel oscuro; el link va en verde, como el
                      "Visit …" de los frames de referencia. */}
                  <div
                    data-card-content
                    className="flex h-full flex-col p-6 group-data-[mode=accordion]/spine:min-w-[34rem] group-data-[mode=accordion]/spine:opacity-0 lg:p-7"
                  >
                    <header className="flex items-center gap-4">
                      <span className="grid size-7 shrink-0 place-items-center rounded-md border border-cream/30 font-mono text-caption text-cream/70">
                        {nn}
                      </span>
                      <h3 className="text-h4 text-cream">{item.title}</h3>
                    </header>

                    <div className="min-h-[13rem] flex-1 pt-5">
                      <Art />
                    </div>

                    <p className="mt-4 max-w-[56ch] text-body-sm text-cream/65 text-pretty">
                      {item.body}
                    </p>

                    {/* Fila de cierre: link (si hay) y fact. Altura reservada
                        exista o no el link — seis claims iguales no se miden
                        por si tienen URL. */}
                    <div className="mt-5 flex h-9 items-center justify-between gap-4">
                      <div>
                        {item.cta && (
                          <a
                            href={item.cta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-q-arrow-host
                            className="flex w-fit items-center gap-3 text-label text-cta-mint"
                          >
                            <ArrowCircle />
                            {item.cta.label}
                          </a>
                        )}
                      </div>
                      <span className="whitespace-nowrap font-mono text-caption text-cream/45">
                        {item.fact}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </div>
    </section>
  );
}
