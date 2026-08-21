"use client";

// Frozen snapshot of the real header's nav bar exactly as it looked BEFORE
// this whole prototype's changes got ported into SiteHeader.tsx — a backup
// so "how it was before" stays viewable on this page instead of only living
// in git history. Never edit this file: it's a record, not a mock.
//
// Structurally a clone of HeaderNavMockV2.tsx (hover-to-open was already the
// real header's mechanism, so nothing to revert there), except:
//   - panel content comes from HeaderNavPanelOriginal (old images, old
//     bg-cream/object-cover hero treatment, old white-invert icon hover,
//     old 720px/2-row group layout, no responsive width capping)
//   - hero images are hardcoded to the OLD iso-*.png paths instead of
//     reading `link.hero` off the live LINKS export, since LINKS itself
//     gets repointed at the new menu-tab-*.png set as part of the port

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LINKS, MobileMenu } from "@/components/site/SiteHeader";
import { NavPanel } from "./HeaderNavPanelOriginal";

const ORIGINAL_HERO: Record<string, string> = {
  Products: "/prototype/quantum/iso-22.png",
  Stack: "/prototype/quantum/iso-07-light.png",
  Resources: "/prototype/quantum/iso-16-light.png",
  About: "/prototype/quantum/iso-07-light.png",
};

export default function HeaderNavOriginal() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const LEFT_SLACK = 50;

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
              className="absolute left-1/2 inline-flex h-10 w-fit -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-[calc(var(--q-nav-radius)-var(--q-nav-pad)/2)] border border-transparent px-4 text-label md:static md:translate-x-0 md:px-5"
            >
              Get started
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="header-nav-original-mobile"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex size-10 items-center justify-center rounded-[calc(var(--q-nav-radius)-var(--q-nav-pad)/2)] text-white md:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <div
            className={`absolute left-1/2 top-full z-50 w-max -translate-x-1/2 pt-2.5 transition-[opacity,transform] duration-200 ${
              active ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            <div
              ref={boxRef}
              data-q-surface
              className="overflow-hidden rounded-[var(--q-nav-radius)] shadow-[0_28px_70px_-14px_rgba(0,0,0,0.55)]"
            >
              {active &&
                (() => {
                  const link = LINKS.find((l) => l.label === active)!;
                  return <NavPanel link={{ ...link, hero: ORIGINAL_HERO[link.label] ?? link.hero }} />;
                })()}
            </div>
          </div>

          {mobileOpen && (
            <div
              id="header-nav-original-mobile"
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
