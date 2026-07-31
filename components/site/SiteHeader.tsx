"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import GetInTouchModal from "@/components/site/GetInTouchModal";

const NAV_LINKS = [{ href: "/blog", label: "BLOG" }];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative py-8 text-eyebrow uppercase text-white/80">
      <div className="flex items-center justify-between">
        <a href="/" className="text-white">
          Site
        </a>

        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-pretty hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden relative z-50 flex items-center justify-center w-8 h-8 border border-white/40 rounded-full text-white/80 hover:text-white hover:border-white/70 transition-colors cursor-pointer"
          >
            {menuOpen ? <XIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
          </button>

          <GetInTouchModal />
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="md:hidden fixed inset-0 z-40 cursor-default"
          />
          <nav
            id="mobile-nav-menu"
            className="md:hidden absolute right-0 top-full z-50 flex flex-col items-start gap-4 rounded-2xl border border-white/15 bg-[#3a3a3a] px-6 py-5 shadow-xl shadow-black/30"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-pretty hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
