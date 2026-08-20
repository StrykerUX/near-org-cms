"use client";

// Exact duplicate of HeaderNavMock.tsx (+ its own copy of HeaderNavPanel as
// HeaderNavPanelV2) — the next round of header/nav changes lands here so the
// version already reviewed keeps working exactly as it is. Diff against
// HeaderNavMock.tsx to see what actually changed once this stops being a 1:1
// copy.

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LINKS, MobileMenu } from "@/components/site/SiteHeader";
import { NavPanel, panelWidth } from "./HeaderNavPanelV2";

// New hero art, one per tab — dropped in public/prototype/quantum/ in tab
// order (1: Products, 2: Stack, 3: Resources, 4: About). Kept as a local
// override instead of editing LINKS in SiteHeader.tsx: same reasoning as the
// icon hover color — this is the sandbox, the real header's images don't
// change until this is approved.
const MOCK_HERO: Record<string, string> = {
  Products: "/prototype/quantum/menu-tab-1.png",
  Stack: "/prototype/quantum/menu-tab-2.png",
  Resources: "/prototype/quantum/menu-tab-3.png",
  About: "/prototype/quantum/menu-tab-4.png",
};

// Faithful replica of the real SiteHeader's nav bar — NOT a copy that
// replaces it, NOT imported by any layout, still sitting in the page's own
// flow rather than `fixed`. `LINKS`/`NavPanel`/`MobileMenu` and every
// className/data-attribute below are copied straight from SiteHeader.tsx
// (the presentational pieces are exported from there for exactly this reuse)
// so this renders pixel-identical at rest — same `data-q-nav`/`data-q-surface`
// treatment (opaque #0a0a0a, no blur, the shared corner radius), same CTA
// gradient-sweep button, same mobile accordion.
//
// Back to hover-to-open, same gesture as the real header (HeaderNavMock.tsx,
// the OTHER mock, is the click-to-open one — this file un-does that change,
// per feedback, to compare hover against click side by side):
//   - hovering the wrapper (`onMouseEnter`, not the button) opens its panel
//   - leaving the bar (`onMouseLeave`) closes it
//   - `onMouseMove` keeps it open while the pointer is anywhere in the "live
//     column" — the tab range (+ LEFT_SLACK of overshoot room) UNIONED with
//     the open panel's own span, since the panel is wider than the tabs and
//     centered under the bar
//   - the button's `onClick` toggle stays too, same as the real header —
//     redundant with hover for a mouse, but it is what makes this operable
//     with a keyboard/on click-based devices
//   - Escape / click-outside are gone: those existed only to close a
//     CLICK-opened menu; hover already closes itself on `onMouseLeave`
export default function HeaderNavMockV2() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Same slack as the real header: only enough to absorb a small overshoot
  // past the first tab (Products) before the pointer is clearly headed for
  // the logo or the empty middle of the bar instead of the menu.
  const LEFT_SLACK = 50;

  // Ported straight from SiteHeader.tsx — the mobile accordion itself
  // (MobileMenu) is imported, not forked, but this wrapping behavior lived
  // on the real header's own mobileOpen state, so the mock needs its own
  // copy: Escape closes it, and the body's scroll is locked (via `overflow`
  // rather than a Lenis call, since not every page that mounts a header has
  // Lenis under it) while it's open.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <div data-q-nav className="relative w-full">
      <div className="mx-auto w-full max-w-[1780px] px-4 pt-6 sm:px-6 lg:px-[60px]">
        <nav
          ref={navRef}
          data-q-surface
          data-tone="light"
          onMouseLeave={() => setActive(null)}
          onMouseMove={(e) => {
            if (!active || !tabsRef.current) return;
            const tabs = tabsRef.current.getBoundingClientRect();
            const box = boxRef.current?.getBoundingClientRect();
            const left = Math.min(tabs.left, box?.left ?? tabs.left) - LEFT_SLACK;
            const right = Math.max(tabs.right, box?.right ?? tabs.right);
            const top = tabs.top;
            const bottom = box?.bottom ?? tabs.bottom;
            if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom) {
              setActive(null);
            }
          }}
          className="group/nav relative mx-auto flex w-full max-w-[1240px] items-center justify-between gap-3 h-16 rounded-[var(--q-nav-radius)] pl-5 pr-2 transition-colors duration-300 text-white md:gap-10 md:pl-7 md:pr-3"
        >
          <span aria-hidden="true" className="absolute inset-x-0 -top-6 h-6" />
          <Link href="/" className="flex items-center">
            <Image
              src="/prototype/v2/near-wordmark.svg"
              alt="NEAR"
              width={80}
              height={21}
              className="block w-auto brightness-0 invert"
              style={{ height: "clamp(1rem, 0.92rem + 0.35vw, 1.3rem)" }}
            />
          </Link>

          <div className="flex items-center gap-2 self-stretch md:gap-10">
            <div ref={tabsRef} className="hidden items-center self-stretch md:flex">
              {LINKS.map((link) => (
                <div
                  key={link.label}
                  onMouseEnter={() => setActive(link.label)}
                  className="group/menu flex items-center self-stretch px-4"
                >
                  <button
                    type="button"
                    aria-expanded={active === link.label}
                    onClick={() => setActive(active === link.label ? null : link.label)}
                    className="relative flex cursor-pointer items-center gap-1 text-eyebrow uppercase text-white"
                  >
                    {link.label}
                    {/* Hover sets `active` directly (onMouseEnter above), same
                        as the real header — the underline just reflects
                        `active`, no separate hover class needed here. */}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1.5 left-0 right-0 h-px origin-left bg-[linear-gradient(90deg,var(--cta-lime),var(--cta-mint),var(--cta-deep))] transition-transform duration-300 ${
                        active === link.label ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <a
              href="https://near.com"
              target="_blank"
              rel="noopener noreferrer"
              data-q-cta
              data-q-cta-sweep
              className="inline-flex h-10 w-fit items-center gap-2 whitespace-nowrap rounded-[calc(var(--q-nav-radius)-var(--q-nav-pad)/2)] border border-transparent px-4 text-label md:px-5"
            >
              Get started
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="header-nav-mock-v2-mobile"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex size-10 items-center justify-center rounded-[calc(var(--q-nav-radius)-var(--q-nav-pad)/2)] text-white md:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* Plain CSS open/close (opacity + a small rise), not the real
              header's GSAP height-morph — see the file comment.
              `w-full` (not `w-max`): pinned to the nav's own width so it
              can never render wider than the header bar. Combined with
              `left-1/2 -translate-x-1/2` that also makes its edges land
              exactly on the nav's edges, since they're now the same width
              centered on the same point. Resources/About size themselves
              down from their max-width as this shrinks with the viewport;
              see HeaderNavPanelV2.tsx. */}
          <div
            className={`absolute left-1/2 top-full z-50 w-full -translate-x-1/2 pt-2.5 transition-[opacity,transform] duration-200 ${
              active ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            <div
              ref={boxRef}
              data-q-surface
              className={`mx-auto overflow-hidden rounded-[var(--q-nav-radius)] shadow-[0_28px_70px_-14px_rgba(0,0,0,0.55)] ${
                active ? panelWidth(LINKS.find((l) => l.label === active)!) : ""
              }`}
            >
              {active &&
                (() => {
                  const link = LINKS.find((l) => l.label === active)!;
                  return <NavPanel link={{ ...link, hero: MOCK_HERO[link.label] ?? link.hero }} />;
                })()}
            </div>
          </div>

          {mobileOpen && (
            <div
              id="header-nav-mock-v2-mobile"
              data-q-surface
              className="absolute inset-x-0 top-full mt-2.5 max-h-[calc(100svh-var(--site-header-block)-1rem)] overflow-y-auto rounded-[var(--q-nav-radius)] shadow-[0_28px_70px_-14px_rgba(0,0,0,0.55)] md:hidden"
            >
              <MobileMenu onNavigate={() => setMobileOpen(false)} />
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
