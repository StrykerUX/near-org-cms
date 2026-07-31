const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

export default function SiteFooter() {
  return (
    <footer className="relative bg-[#575757] text-white">
      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-[100px]">

        {/* Mobile logo */}
        <div className="flex lg:hidden pt-16 pb-6">
          <span className="text-white text-eyebrow uppercase">Site</span>
        </div>

        {/* Mobile nav */}
        <div className="flex flex-col gap-3 py-8 lg:hidden">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-pretty text-white/50 [font-size:var(--font-size-body)] hover:text-white/80 transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex min-h-[320px]">
          <div className="w-[22%] shrink-0 flex flex-col items-start justify-center pr-8">
            <span className="text-white text-eyebrow uppercase">Site</span>
          </div>
          <div className="w-[50%] flex ml-auto">
            <div className="flex-1 flex flex-col justify-start pt-10 pb-10 px-8 border-l border-r border-white/15">
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <a key={link.label} href={link.href} className="text-pretty text-body text-white/50 hover:text-white/80 transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="hidden lg:block w-[22%] shrink-0" />
          <div className="flex-1 border-t border-white/15" />
        </div>

        <p className="text-caption text-white/35 pt-4 pb-8 lg:py-8">© 2026. All Rights Reserved.</p>

      </div>
    </footer>
  );
}
