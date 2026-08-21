"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LINKS, MobileMenu } from "@/components/site/SiteHeader";
import { NavPanel } from "./HeaderNavPanel";

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
// Change under test: the four menu tabs open on click instead of on hover.
// The real header opens on `onMouseEnter` and closes on `onMouseLeave`/a
// pointer-exits-the-live-column check in `onMouseMove` — none of that hover
// wiring is below. Click behavior instead:
//   - click a closed tab -> opens its panel
//   - click the SAME tab again -> closes it
//   - click a DIFFERENT tab while one is open -> switches directly
//   - click anywhere outside the tabs/panel, or press Escape -> closes
//
// Deliberately NOT reproduced (out of scope for this specific change, and
// this is still `fixed`-free / embedded in a page, so it doesn't need it):
// the scroll-retraction of the bar and the dark-section ink flip. The
// open/close morph below is a plain CSS transition, not the real header's
// GSAP height-morph between panels.
export default function HeaderNavMock() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active) return;

    function onPointerDown(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActive(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  return (
    <div data-q-nav className="relative w-full">
      <div className="mx-auto w-full max-w-[1780px] px-4 pt-6 sm:px-6 lg:px-[60px]">
        <nav
          ref={navRef}
          data-q-surface
          data-tone="light"
          className="group/nav relative mx-auto flex w-full max-w-[1240px] items-center justify-between gap-3 h-16 rounded-[var(--q-nav-radius)] pl-5 pr-2 transition-colors duration-300 text-white md:gap-10 md:pl-7 md:pr-3"
        >
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
            <div className="hidden items-center self-stretch md:flex">
              {LINKS.map((link) => (
                <div key={link.label} className="group/menu flex items-center self-stretch px-4">
                  <button
                    type="button"
                    aria-expanded={active === link.label}
                    onClick={() => setActive(active === link.label ? null : link.label)}
                    className="relative flex cursor-pointer items-center gap-1 text-eyebrow uppercase text-white"
                  >
                    {link.label}
                    {/* In the real header, hovering a tab is what opens it
                        (onMouseEnter sets `active`), so the underline
                        appearing on hover was just a side effect of that —
                        the same JS state drove both. Here hover no longer
                        opens anything (click does), so the underline needs
                        its own hover reaction: `group-hover/menu` lights it
                        on hover regardless of click state, and the `active`
                        check keeps it lit once the panel is actually open —
                        it only fully turns off once neither is true. */}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1.5 left-0 right-0 h-px origin-left bg-[linear-gradient(90deg,var(--cta-lime),var(--cta-mint),var(--cta-deep))] transition-transform duration-300 group-hover/menu:scale-x-100 ${
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
              aria-controls="header-nav-mock-mobile"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex size-10 items-center justify-center rounded-[calc(var(--q-nav-radius)-var(--q-nav-pad)/2)] text-white md:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* Plain CSS open/close (opacity + a small rise), not the real
              header's GSAP height-morph — see the file comment. */}
          <div
            className={`absolute left-1/2 top-full z-50 w-max -translate-x-1/2 pt-2.5 transition-[opacity,transform] duration-200 ${
              active ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            <div
              data-q-surface
              className="overflow-hidden rounded-[var(--q-nav-radius)] shadow-[0_28px_70px_-14px_rgba(0,0,0,0.55)]"
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
              id="header-nav-mock-mobile"
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
