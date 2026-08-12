"use client";

import Image from "next/image";
import {
  IconInterface, IconIntents, IconAgents,
  IconLayers, IconAbstraction, IconQuantum,
  IconDocs, IconSolutions,
  IconResearch, IconBlog, IconAnalytics,
  IconBrand, IconContact, IconCareers,
  IconHistory, IconRoadmap, IconEconomics,
  IconFoundation, IconCommunity, IconGovernance,
} from "@/components/sections/quantum/navIcons";
import { useState, useRef, useLayoutEffect } from "react";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// The quantum rebuild's nav pill. It differs from `home-v2/NavPillV2` in the
// three ways that matter — frosted light background instead of solid black,
// full width with separated groups instead of shrink-to-fit, and ink that
// inverts over dark sections — so it is its own file, not a variant. See the
// rule in `components/sections/home-v2/README.md`: two folders holding the same
// file diverge in silence.
//
// The retract gesture IS the same as NavPillV2's, because in the original it
// comes from `effects.js` (NearFx), which both pages load.

// Order is deliberate and not alphabetical: Developers first because it is the
// most-used, About last because it is the least. Every one of them is a
// dropdown, hence the chevron on each.
// The site's real menu, transcribed from the Navigation tab of
// "near.org - sitemap" (Google Doc, owner hector.martinez@nearsp.com).
//
// Two shapes live here on purpose. Products and Stack are FLAT — a single list
// of destinations. Resources and About are GROUPED, with a labelled column per
// group. That is not decoration: it is why the panel is a grid whose column
// count comes from the data rather than a fixed number.
//
// `href` is "#" throughout. The destinations exist in the sitemap tab, but
// wiring them is a separate job and half of them are redirects that do not
// resolve yet — a wrong link is worse than an obvious placeholder.
type Leaf = {
  label: string;
  desc: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
type Group = { label: string; items: Leaf[] };
// `hero` is the isometric still shown beside the menu — the same art family
// as the Beyond-accounts cards, black-ground with one lit element, which is
// why it sits on the dark panel without a seam.
type Entry = { label: string; hero: string; items?: Leaf[]; groups?: Group[] };

/** One labelled column of menu entries, each with its icon slot. */
function NavGroup({ group }: { group: Group }) {
  return (
    <div className="flex flex-col gap-1">
      {group.label && (
        // Sentence case, not the uppercase eyebrow used on the bar: in the
        // reference the group label is quieter than the items it heads, and
        // uppercasing it makes it compete with them.
        <p className="mb-1 px-3 text-body-sm text-white/45">{group.label}</p>
      )}
      {group.items.map((item) => (
        <a
          key={item.label}
          href="#"
          className="group/item flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.09]"
        >
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.06] text-white transition-colors duration-200 group-hover/item:bg-white group-hover/item:text-black"
          >
            <item.icon className="size-5" />
          </span>
          <span className="flex flex-col">
            <span className="whitespace-nowrap text-label uppercase text-white">{item.label}</span>
            <span className="whitespace-nowrap text-caption text-white/55">{item.desc}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

/** The body of one menu. Rendered for every entry; only one is visible. */
function NavPanel({ link }: { link: Entry }) {
  // Flat entries become a single unlabelled column so both shapes go through
  // the same grid. Column A takes the first two groups; column B leads with the
  // hero and picks up the rest — which reproduces the reference for Resources
  // (Build and Learn left, hero above Connect right) and still does the
  // sensible thing for a flat menu.
  const groups = link.groups ?? [{ label: "", items: link.items ?? [] }];
  const colA = groups.slice(0, 2);
  const colB = groups.slice(2);
  return (
    <div className="grid w-[720px] grid-cols-[1fr_268px] content-start items-start gap-x-8 gap-y-7 p-6">
      <NavGroup group={colA[0]} />
      {/* The isometric still. `bg-cream` is the exact ground the art is drawn
          on (#F5F4F1), so the PNG's ground and the plate are the same value and
          the seam disappears. */}
      <div className="h-[184px] w-full overflow-hidden rounded-xl bg-cream">
        <Image
          src={link.hero}
          alt=""
          width={1200}
          height={750}
          sizes="268px"
          className="h-full w-full object-cover"
        />
      </div>
      {colA.slice(1).map((g, i) => (
        <NavGroup key={g.label || `a${i}`} group={g} />
      ))}
      {colB.map((g, i) => (
        <NavGroup key={g.label || `b${i}`} group={g} />
      ))}
    </div>
  );
}

const LINKS: Entry[] = [
  {
    label: "Products",
    hero: "/prototype/quantum/iso-22.png",
    items: [
      { label: "near.com", desc: "One interface, 30+ chains, confidential by default", icon: IconInterface },
      { label: "Intents", desc: "The universal liquidity layer for onchain markets", icon: IconIntents },
      { label: "NEAR AI", desc: "Confidential, verifiable inference and agents", icon: IconAgents },
    ],
  },
  {
    label: "Stack",
    hero: "/prototype/quantum/iso-07-light.png",
    items: [
      { label: "Protocol", desc: "The settlement layer for the agent economy", icon: IconLayers },
      { label: "Chain Abstraction", desc: "How NEAR connects any chain", icon: IconAbstraction },
      { label: "Quantum Security", desc: "Quantum-adaptable from day one", icon: IconQuantum },
    ],
  },
  {
    label: "Resources",
    hero: "/prototype/quantum/iso-16-light.png",
    groups: [
      {
        label: "Build",
        items: [
          { label: "Docs", desc: "Build on NEAR", icon: IconDocs },
          { label: "Solutions", desc: "Explore use cases", icon: IconSolutions },
        ],
      },
      {
        label: "Learn",
        items: [
          { label: "Research", desc: "White paper and protocol work", icon: IconResearch },
          { label: "Blog", desc: "News and deep dives", icon: IconBlog },
          { label: "Analytics", desc: "Live onchain metrics", icon: IconAnalytics },
        ],
      },
      {
        label: "Connect",
        items: [
          { label: "Brand", desc: "Logos and guidelines", icon: IconBrand },
          { label: "Contact", desc: "Connect with the team", icon: IconContact },
          { label: "Careers", desc: "Build the agent economy", icon: IconCareers },
        ],
      },
    ],
  },
  {
    label: "About",
    hero: "/prototype/quantum/iso-07-light.png",
    groups: [
      {
        label: "Fundamentals",
        items: [
          { label: "History", desc: "From 2017 to now", icon: IconHistory },
          { label: "Roadmap", desc: "What ships next", icon: IconRoadmap },
          { label: "Economics", desc: "Revenue, buybacks, supply", icon: IconEconomics },
        ],
      },
      {
        label: "Ecosystem",
        items: [
          { label: "NEAR Foundation", desc: "Supporting a decentralized ecosystem", icon: IconFoundation },
          { label: "Community", desc: "Validators, builders, Legion, and events", icon: IconCommunity },
          { label: "Governance", desc: "House of Stake", icon: IconGovernance },
        ],
      },
    ],
  },
];

// Extra clearance below the pill as it retracts, so no edge stays peeking.
const HIDE_MARGIN = 12;

export default function NavPillQuantum() {
  const [active, setActive] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const prev = useRef<string | null>(null);
  const shownPrev = useRef<string | null>(null);

  // How much of its final height the panel is cut on at, and shrunk to before
  // being cut off. One constant for both so opening and closing are mirror
  // images rather than two numbers that drift apart.
  const OPEN_FROM = 0.8;

  // How far left of the Products tab the pointer may stray before the menu
  // closes. Only enough to absorb an overshoot — past that the pointer is
  // heading for the logo or the empty middle of the bar, not the menu.
  const LEFT_SLACK = 50;

  // `active` is INTENT (which tab the pointer is on); `shown` is what is
  // actually rendered. They differ during a close: the content has to stay
  // mounted while the box shrinks, or the panel empties on the first frame and
  // the shrink plays over a blank box — which reads as an instant cut even
  // though the height really is animating.
  const [shown, setShown] = useState<string | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const was = prev.current;
    prev.current = active;

    if (active) {
      setShown(active);
      return;
    }
    if (!was || !box) return;

    gsap.killTweensOf(box);
    const from = box.offsetHeight;
    gsap
      .timeline()
      .to(box, { height: from * OPEN_FROM, duration: 0.13, ease: "none" })
      .set(box, { autoAlpha: 0 })
      .call(() => setShown(null));
  }, [active]);

  // Height morph. Runs off `shown`, so it only fires once the new content is
  // committed and can be measured.
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    // Reset on close, or the NEXT open sees a stale "was showing" and takes the
    // morph branch — animating from whatever height the last panel closed at
    // instead of cutting on at 80% and growing.
    if (!shown) {
      shownPrev.current = null;
      return;
    }
    const inner = box.firstElementChild as HTMLElement | null;
    if (!inner) return;

    const target = inner.offsetHeight;
    const wasShowing = shownPrev.current;
    shownPrev.current = shown;

    gsap.killTweensOf(box);

    if (!wasShowing) {
      // Opening is the close run backwards: it CUTS ON at 80% — already
      // opaque, already clipped — and grows in. No fade: a fade would obscure
      // the growth, which is the thing being shown.
      gsap.set(box, { height: target * OPEN_FROM, autoAlpha: 1 });
      // Slightly gentler overshoot than the menu-to-menu morph: this grows
      // from 80%, not from another panel's height, so the same value reads as
      // a much bigger kick.
      gsap.to(box, { height: target, duration: 0.32, ease: "back.out(0.6)" });
      return;
    }

    gsap.set(box, { autoAlpha: 1 });
    gsap.fromTo(
      box,
      { height: box.offsetHeight },
      { height: target, duration: 0.34, ease: "back.out(0.77)" }
    );
  }, [shown]);

  const rootRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const mm = gsap.matchMedia();
    const nav = scope.querySelector<HTMLElement>("[data-nav]");

    // ── ink over dark sections ───────────────────────────────────────────
    // Runs ALWAYS, reduced-motion included: this is not an animation, it is
    // legibility. Without it the 72%-black label sits on a mid-grey frosted
    // panel while the pill crosses the `--ink-slate` section.
    //
    // Fidelity note: the original has all of this wiring (the `data-nav-dark`
    // attribute on sections, the logo filter, the link colours) but its
    // `apply()` writes the light values down both branches, so the flip never
    // actually happens. It is restored here, because an attribute with no
    // effect is clearly a bug rather than a decision.
    let raf = 0;
    let tone: string | null = null;

    const measure = () => {
      raf = 0;
      if (!nav) return;
      const r = nav.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      // The DOM is queried on every measurement rather than once on mount: the
      // dark sections are siblings of this component, not descendants, so they
      // may not exist yet when it mounts.
      const dark = Array.from(document.querySelectorAll("[data-nav-dark]")).some((sec) => {
        const sr = sec.getBoundingClientRect();
        return sr.top <= mid && sr.bottom >= mid;
      });
      const next = dark ? "dark" : "light";
      if (next === tone) return;
      tone = next;
      nav.dataset.tone = next;
    };

    // A data-attribute is written instead of calling setState: this reacts to
    // every scroll event, and re-rendering React per event to change two
    // colours is exactly what the rest of the toolkit avoids.
    const onScrollTone = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScrollTone, { passive: true });
    window.addEventListener("resize", onScrollTone);

    // ── 1:1 retraction with the gesture ──────────────────────────────────
    mm.add(MQ.motion, () => {
      // quickSetter and not gsap.to(): this runs on every scroll event, and a
      // tween per event would mean instantiating hundreds of objects a second
      // to write one property.
      //
      // `top` and NOT `y`. This looks like the wrong choice — transform is the
      // cheap property to animate — but a transform on this element makes it a
      // BACKDROP ROOT, and every `backdrop-filter` inside it then samples only
      // what is within this element rather than the page behind it. Since the
      // bar and all four dropdown panels live in here, animating `y` silently
      // reduced their blur to a no-op: the CSS was correct and did nothing.
      // Same trap applies to `will-change: transform`, which is why the root no
      // longer carries it.
      const setTop = gsap.quickSetter(scope, "top", "px") as (v: number) => void;

      let last = window.scrollY;
      let offset = 0;

      const onScroll = () => {
        const y = window.scrollY;
        const delta = y - last;
        last = y;

        const hidden = -(scope.offsetHeight + HIDE_MARGIN);
        offset = Math.min(0, Math.max(hidden, offset - delta));
        // Always visible at the very top: without this, a negative scroll
        // bounce on iOS can leave it hidden at the top of the page.
        if (y <= 2) offset = 0;

        setTop(offset);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        setTop(0);
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollTone);
      window.removeEventListener("resize", onScrollTone);
      mm.revert();
    };
  }, []);

  return (
    // pointer-events-none on the wrapper and auto on the pill: the wrapper spans
    // the full viewport width and without this would swallow clicks meant for
    // whatever is underneath (the hero occupies that same band, and its canvas
    // listens for the pointer).
    <div
      ref={rootRef}
      data-q-nav
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      <Container className="pt-6">
        <nav
          onMouseLeave={() => setActive(null)}
          // The bar is wider than the tabs, so `onMouseLeave` alone leaves the
          // menu open while the pointer sits on the logo, the empty middle, or
          // Get started. Close once the pointer is past either end of the tab
          // range — 100px of slack on the left so a small overshoot off
          // Products does not snap it shut, and none on the right, where the
          // next thing along is the Get started button.
          onMouseMove={(e) => {
            const tabs = tabsRef.current;
            const box = boxRef.current;
            if (!tabs || !box || !active) return;
            const t = tabs.getBoundingClientRect();
            const p = box.getBoundingClientRect();
            // The live column: the tab range with its slack, UNIONED with the
            // open panel's own span. The panel is centred and much wider than
            // the tabs, so its left edge sits well left of Products — without
            // the union this rule fired while the pointer was inside the
            // dropdown, which is the one place it must never fire. Everything
            // in this column, from the top of the frame down, holds it open.
            const left = Math.min(t.left - LEFT_SLACK, p.left);
            const right = Math.max(t.right, p.right);
            if (e.clientX < left || e.clientX > right) setActive(null);
          }}
          data-nav
          data-q-surface
          data-tone="light"
          // No border: the frosted panel carries its own edge against the page.
          // Near-black rather than a light fill, so the type is light in both
          // states and the tone flip never has to swap it.
          // The alpha is high because the composite is what the eye judges, not
          // the declared colour: rgba(10,10,10) at 0.68 over the cream page
          // resolves to #555 — a mid grey. 0.9 lands it at #1f1f1f, which reads
          // as near-black while the blur still picks up what passes underneath.
          // The flip earns its keep by holding that appearance constant: the
          // same alpha over the `--ink-slate` section would be indistinguishable
          // from the ground, so that state eases off to keep an edge.
          // Shape: a rounded-corner bar, taking the card language from
          // BeyondAccounts / InTheNews rather than staying a pill.
          // The bar is ~53px tall, so its PILL radius is only ~26px — which is
          // why the cards' own rounded-3xl (24px) was never an option here: it
          // would have been a pill by another name. 14px is a little over half
          // of that, so the corner reads as a deliberate radius rather than as
          // a not-quite-pill.
          // `relative` is load-bearing: it makes the BAR the positioning
          // ancestor for the dropdown panels, which is what centres them on
          // the bar instead of under each trigger.
          className="group/nav pointer-events-auto relative mx-auto flex w-full max-w-[1240px] items-center justify-between gap-10 h-16 rounded-[var(--q-nav-radius)] pl-7 pr-3 transition-colors duration-300 text-white"
        >
          {/* The bar sits 24px below the top of the frame, and that strip is
              outside the nav — so moving up into it fired `onMouseLeave` and
              closed the menu. This is a descendant of the nav that reaches up
              to y=0, so the whole column above the bar counts as inside.
              `-top-6` mirrors the Container's `pt-6`; they have to move
              together. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -top-6 h-6"
          />

          <a href="#" className="flex items-center">
            {/* The wordmark is a black SVG flipped to white with a filter, rather
                than shipping a second copy of the asset. The fluid height is
                inline — it is an image, not text, so no typographic scale role
                applies to it. */}
            <Image
              src="/prototype/v2/near-wordmark.svg"
              alt="NEAR"
              width={80}
              height={21}
              // Always inverted now: the wordmark asset is black and the pill
              // is charcoal in both states.
              className="block w-auto brightness-0 invert"
              style={{ height: "clamp(1rem, 0.92rem + 0.35vw, 1.3rem)" }}
              priority
            />
          </a>

          <div className="flex items-center gap-10 self-stretch">
            <div ref={tabsRef} className="hidden items-center self-stretch md:flex">
              {LINKS.map((link) => (
                // The trigger is now just a label: there is ONE panel for the
                // whole bar (below), so moving between tabs morphs a single
                // container instead of cross-fading four independent ones.
                <div
                  key={link.label}
                  onMouseEnter={() => setActive(link.label)}
                  className="group/menu flex items-center self-stretch px-4"
                >
                  <a
                    href="#"
                    className="relative flex items-center gap-1 text-eyebrow uppercase text-white"
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1.5 left-0 right-0 h-px origin-left bg-[linear-gradient(90deg,var(--cta-lime),var(--cta-mint),var(--cta-deep))] transition-transform duration-300 ${
                        active === link.label ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </div>
              ))}
            </div>

            {/* The reference's translucent glass chip: #d9d9d9 at 20% over the
                black bar, radius 8. This REPLACES the green travelling-gradient
                CTA — `[data-q-cta-sweep]` still exists in globals.css and is
                unused here, so the sweep can be restored without rewriting it. */}
            <a
              href="#"
              data-q-cta
              data-q-cta-sweep
              className="inline-flex h-10 w-fit items-center gap-2 rounded-[calc(var(--q-nav-radius)-var(--q-nav-pad)/2)] border border-transparent px-5 text-label"
            >
              Get started
            </a>
          </div>

          {/* ONE panel for the whole bar. Positioned against the nav so it
              stays centred, and `top-full` keeps the 10px gap correct however
              tall the bar becomes. */}
          <div
            className={`absolute left-1/2 top-full z-50 w-max -translate-x-1/2 pt-2.5 ${
              active ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div
              ref={boxRef}
              data-q-surface
              style={{ opacity: 0, visibility: "hidden" }}
              className="overflow-hidden rounded-[var(--q-nav-radius)] shadow-[0_28px_70px_-14px_rgba(0,0,0,0.55)]"
            >
              {/* The active panel is the only one in flow; it defines the
                  height. The others sit absolutely on top at opacity 0, so the
                  swap is a cross-fade with nothing reflowing. */}
              <div className="relative">
                {LINKS.map((link) => (
                  <div
                    key={link.label}
                    aria-hidden={shown !== link.label}
                    className={
                      shown === link.label
                        ? "opacity-100"
                        : "pointer-events-none absolute inset-0 opacity-0"
                    }
                  >
                    <NavPanel link={link} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
}
