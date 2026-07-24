import SiteHeader from "@/components/site/SiteHeader";
import BrandPillLink from "@/components/site/brand/BrandPillLink";
import BrandLogoCard from "@/components/site/brand/BrandLogoCard";
import CopyableSwatch from "@/components/site/brand/CopyableSwatch";

const LOGO_KIT_ZIP = "https://cms-image-exposer.near.ai/uploads/0c5b0796-9e79-4eef-8fd6-91503a1e23df.zip";
const BRAND_GUIDELINES_PDF = "https://cms-image-exposer.near.ai/uploads/1d5604a3-d67a-4fdc-8c08-5816190c6d7d.pdf";

const SECTION_LINKS = [
  { href: "#logos", label: "Logos" },
  { href: "#color", label: "Color" },
  { href: "#type", label: "Type" },
  { href: "#about", label: "About" },
];

const PRIMARY_LOGOS = [
  { file: "primary-color", label: "color", sub: "ink + blue · light", bg: "#FDFDFD" },
  { file: "primary-black", label: "black", sub: "ink · light", bg: "#FDFDFD" },
  { file: "primary-white", label: "white", sub: "knockout · dark", bg: "#000000" },
  { file: "primary-white-color", label: "white-color", sub: "white + blue · dark", bg: "#000000" },
];

const SECONDARY_LOGOS = [
  { file: "secondary-color", label: "color", sub: "ink + blue · light", bg: "#FDFDFD" },
  { file: "secondary-black", label: "black", sub: "ink · light", bg: "#FDFDFD" },
  { file: "secondary-white", label: "white", sub: "knockout · dark", bg: "#000000" },
  { file: "secondary-white-color", label: "white-color", sub: "white + blue · dark", bg: "#000000" },
];

const TERTIARY_LOGOS = [
  { file: "tile-color", label: "tile-color", sub: "blue + white", bg: "#4A4F57" },
  { file: "tile-black", label: "tile-black", sub: "ink + white", bg: "#4A4F57" },
  { file: "tile-white", label: "tile-white", sub: "white + ink", bg: "#4A4F57" },
  { file: "tile-white-color", label: "tile-white-color", sub: "white + blue", bg: "#4A4F57" },
];

const PRIMARY_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "Off-White", hex: "#EEEEEB" },
  { name: "Blue", hex: "#0091FD", note: "primary" },
];

const SECONDARY_COLORS = [
  { name: "Dark Grey", hex: "#272727" },
  { name: "Grey", hex: "#A7A7A7" },
  { name: "Sky", hex: "#83DCFF" },
];

const GREYSCALE = ["#525252", "#858585", "#A7A7A7", "#B4B4B4", "#D5D5D5", "#E6E6E6", "#EEEEEB", "#FDFDFD"];

const GRADIENTS = [
  { name: "Blue → Sky", value: "linear-gradient(135deg,#0091FD 0%,#83DCFF 100%)", label: "#0091FD · #83DCFF" },
  { name: "Black → Deep Blue", value: "linear-gradient(135deg,#000000 0%,#2385C7 100%)", label: "#000000 · #2385C7" },
];

export default function BrandPage() {
  return (
    <div className="relative w-full font-sans bg-[#EEEEEB] text-[#101010]">

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-[#EEEEEB] min-h-[640px] flex flex-col">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/backgrounds/NEARAI_BG_3DLOGO_white_S.jpg"
            alt=""
            className="w-full h-full object-cover object-right"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(238,238,235,0.9)_0%,rgba(238,238,235,0)_70%)] pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(190deg,rgba(39,39,39,0.5)_0%,rgba(39,39,39,0)_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col flex-1 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
          <SiteHeader />

          <div className="flex flex-col flex-1 justify-center py-14 lg:py-20 max-w-[880px]">
            <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-[#0072C9] mb-8">
              NEAR AI · Brand guidelines V 2.0
            </div>
            <h1 className="font-medium [font-size:var(--font-size-h1)] leading-[1.05] tracking-tight text-[#101010] mb-7">
              The NEAR AI brand,
              <br />
              on one page.
            </h1>
            <p className="[font-size:var(--font-size-body)] leading-relaxed text-[#101010] font-medium max-w-[52ch] mb-4 text-balance">
              Confidential, verifiable AI infrastructure for a user-owned AI economy, and the marks, color, and type that carry it.
            </p>
            <p className="[font-size:var(--font-size-body)] leading-relaxed text-black/55 max-w-[66ch] mb-10 text-balance">
              Everything below is the working essential. The complete system (logo construction, layout ratios, the full palette) is one download away.
            </p>
            <div className="flex flex-wrap gap-3.5 items-center mb-10">
              <BrandPillLink href={BRAND_GUIDELINES_PDF} target="_blank" rel="noopener noreferrer" label="Download full guidelines" badge="PDF" variant="solid" />
              <BrandPillLink href="#logos" label="Jump to assets ↓" variant="dark" />
            </div>
            <div className="flex flex-wrap gap-6">
              {SECTION_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/45 hover:text-black transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">

        {/* ===================== LOGOS ===================== */}
        <section id="logos" className="py-20 border-t border-black/10">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
            <div>
              <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-[#0072C9] mb-3.5">01 / Logo system</div>
              <h2 className="font-medium [font-size:var(--font-size-h2)] tracking-[-0.02em]">Three lockups, one system.</h2>
            </div>
            <p className="[font-size:var(--font-size-body)] text-black/55 max-w-[36ch] leading-snug">
              SVG and PNG, transparent, fixed palette. Use the color marks for hero and marketing; monochrome for dense UI.
            </p>
          </div>

          {/* Primary */}
          <div className="flex flex-wrap items-baseline gap-3.5 mb-4">
            <span className="font-mono text-[0.875rem] tracking-[0.3em] text-[#0072C9]">01 / PRIMARY</span>
            <h3 className="font-medium [font-size:var(--font-size-body)] tracking-[-0.01em]">Wordmark: &ldquo;NEAR AI&rdquo;</h3>
            <span className="[font-size:var(--font-size-body)] text-black/40 w-full sm:w-auto sm:ml-auto">Default. Most horizontal placements. Min width 120px.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
            {PRIMARY_LOGOS.map((logo) => (
              <BrandLogoCard
                key={logo.file}
                svgSrc={`/branding/logos/primary/${logo.file}.svg`}
                pngSrc={`/branding/logos/primary/${logo.file}.png`}
                alt="NEAR AI"
                previewBg={logo.bg}
                imgClassName="h-[22px] sm:h-[26px] lg:h-[30px]"
                name={logo.label}
                description={logo.sub}
              />
            ))}
          </div>

          {/* Secondary */}
          <div className="flex flex-wrap items-baseline gap-3.5 mb-4">
            <span className="font-mono text-[0.875rem] tracking-[0.3em] text-[#0072C9]">02 / SECONDARY</span>
            <h3 className="font-medium [font-size:var(--font-size-body)] tracking-[-0.01em]">Lockup: &ldquo;N + AI&rdquo;</h3>
            <span className="[font-size:var(--font-size-body)] text-black/40 w-full sm:w-auto sm:ml-auto">Tighter horizontal space. Min width 90px.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
            {SECONDARY_LOGOS.map((logo) => (
              <BrandLogoCard
                key={logo.file}
                svgSrc={`/branding/logos/secondary/${logo.file}.svg`}
                pngSrc={`/branding/logos/secondary/${logo.file}.png`}
                alt="N AI"
                previewBg={logo.bg}
                imgClassName="h-[36px] sm:h-[42px] lg:h-[49px]"
                name={logo.label}
                description={logo.sub}
              />
            ))}
          </div>

          {/* Tertiary */}
          <div className="flex flex-wrap items-baseline gap-3.5 mb-4">
            <span className="font-mono text-[0.875rem] tracking-[0.3em] text-[#0072C9]">03 / TERTIARY</span>
            <h3 className="font-medium [font-size:var(--font-size-body)] tracking-[-0.01em]">Tile: icon</h3>
            <span className="[font-size:var(--font-size-body)] text-black/40 w-full sm:w-auto sm:ml-auto">Self-contained. Any background. Never add a plate. Min 32px.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {TERTIARY_LOGOS.map((logo) => (
              <BrandLogoCard
                key={logo.file}
                svgSrc={`/branding/logos/tertiary/${logo.file}.svg`}
                pngSrc={`/branding/logos/tertiary/${logo.file}.png`}
                alt="N tile"
                previewBg={logo.bg}
                imgClassName="h-[64px] w-[64px] sm:h-[76px] sm:w-[76px] lg:h-[87px] lg:w-[87px]"
                name={logo.label}
                description={logo.sub}
                nudgeDown={false}
              />
            ))}
          </div>

          {/* Spec strip */}
          <div className="flex flex-wrap gap-9 p-5 lg:p-6 border border-[#CAC8C8] rounded-2xl bg-white">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40">Clear space</span>
              <span className="[font-size:var(--font-size-body)] font-medium">22% of logo height, all sides</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40">Min width</span>
              <span className="[font-size:var(--font-size-body)] font-medium">wordmark 120 · lockup 90 · tile 32px</span>
            </div>
            <div className="flex flex-col gap-1.5 ml-auto items-start">
              <span className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40">All assets</span>
              <BrandPillLink href={LOGO_KIT_ZIP} download label="Download all logos" variant="solid" />
            </div>
          </div>
        </section>

        {/* ===================== COLOR ===================== */}
        <section id="color" className="py-20 border-t border-black/10">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-11">
            <div>
              <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-[#0072C9] mb-3.5">02 / Color</div>
              <h2 className="font-medium [font-size:var(--font-size-h2)] tracking-[-0.02em]">A neutral base. One decisive blue.</h2>
            </div>
            <p className="[font-size:var(--font-size-body)] text-black/55 max-w-[34ch] leading-snug">
              Click any swatch to copy its hex. Blue guides attention; it never overwhelms.
            </p>
          </div>

          <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-3.5">Primary</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">
            {PRIMARY_COLORS.map((c) => (
              <CopyableSwatch key={c.hex} value={c.hex} label={c.name} hexLabel={c.hex} sublabel={c.note} height="110px" />
            ))}
          </div>

          <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-3.5">Secondary</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">
            {SECONDARY_COLORS.map((c) => (
              <CopyableSwatch key={c.hex} value={c.hex} label={c.name} hexLabel={c.hex} height="92px" />
            ))}
          </div>

          <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-3.5">Greyscale ramp</div>
          <div className="grid grid-cols-2 lg:grid-cols-8 gap-2.5 mb-9">
            {GREYSCALE.map((hex) => (
              <CopyableSwatch key={hex} value={hex} label="" hexLabel={hex} height="64px" />
            ))}
          </div>

          <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-3.5">
            Gradients <span className="normal-case tracking-normal">· emphasis only</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GRADIENTS.map((g) => (
              <CopyableSwatch key={g.name} value={g.value} label={g.name} hexLabel={g.label} height="96px" />
            ))}
          </div>
        </section>

        {/* ===================== TYPE ===================== */}
        <section id="type" className="py-20 border-t border-black/10">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-11">
            <div>
              <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-[#0072C9] mb-3.5">03 / Typography</div>
              <h2 className="font-medium [font-size:var(--font-size-h2)] tracking-[-0.02em]">One family. Hierarchy by weight.</h2>
            </div>
            <p className="[font-size:var(--font-size-body)] text-black/55 max-w-[34ch] leading-snug">
              Regular is the workhorse. Medium for headings and emphasis. Bold for short headings only.
            </p>
          </div>

          {/* Primary specimen */}
          <div className="border border-[#CAC8C8] rounded-2xl overflow-hidden bg-white mb-4 grid grid-cols-1 md:grid-cols-[minmax(220px,350px)_1fr]">
            <div className="p-9 md:border-r border-black/10 flex flex-col justify-between gap-6">
              <div className="font-medium text-[6rem] sm:text-[9.375rem] leading-[0.9] tracking-[-0.03em]">Aa</div>
              <div>
                <div className="font-medium text-[1.5rem] tracking-[-0.01em]">PP Neue Montreal</div>
                <div className="text-[0.875rem] text-black/45 mt-1">Primary typeface · all text</div>
              </div>
            </div>
            <div className="p-9 flex flex-col gap-6">
              <div>
                <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-2">Regular · 400 · workhorse</div>
                <div className="font-normal text-[1.125rem] tracking-[-0.01em]">Confidential, verifiable AI infrastructure.</div>
              </div>
              <div>
                <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-2">Medium · 500 · headings &amp; emphasis</div>
                <div className="font-medium text-[1.125rem] tracking-[-0.01em]">A user-owned AI economy.</div>
              </div>
              <div>
                <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-2">Bold · 700 · short headings only</div>
                <div className="font-bold text-[1.125rem] tracking-[-0.01em]">Nothing leaks out.</div>
              </div>
            </div>
          </div>

          {/* Mono */}
          <div className="border border-[#CAC8C8] rounded-2xl overflow-hidden bg-white grid grid-cols-1 md:grid-cols-[minmax(220px,350px)_1fr]">
            <div className="p-9 md:border-r border-black/10 flex flex-col justify-between gap-6">
              <div className="font-mono font-normal text-[6rem] sm:text-[9.375rem] leading-[0.9] tracking-[-0.03em]">Aa</div>
              <div>
                <div className="font-medium text-[1.5rem] tracking-[-0.01em]">PP Neue Montreal Mono</div>
                <div className="text-[0.875rem] text-black/45 mt-1">Light 300 · Regular 400 · technical text</div>
              </div>
            </div>
            <div className="p-9 flex flex-col gap-6">
              <div>
                <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-2">Numerals &amp; glyphs</div>
                <div className="font-mono text-[1.125rem] tracking-[-0.01em]">0123456789 &amp; #01</div>
              </div>
              <div>
                <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-2">Eyebrows &amp; labels · uppercase</div>
                <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/55">&gt;&gt; Client key pair · attestation · how it works</div>
              </div>
              <div>
                <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-black/40 mb-2">Regular · 400 · minor secondary text</div>
                <div className="font-mono font-normal text-[1.125rem] leading-relaxed text-black/55 max-w-[62ch]">
                  Used for blocks of minor secondary text: captions, metadata, and short technical notes set in regular weight for quiet, legible detail.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== ABOUT ===================== */}
        <section id="about" className="py-20 pb-24 border-t border-black/10">
          <div className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-[#0072C9] mb-5">04 / About NEAR AI</div>
          <p className="font-medium [font-size:var(--font-size-h2)] leading-[1.12] tracking-[-0.02em] max-w-[880px] text-pretty mb-12">
            Confidential, verifiable AI infrastructure for a <span className="text-[#0072C9]">user-owned AI economy.</span>
          </p>

          <p className="[font-size:var(--font-size-body)] leading-relaxed text-black/60 max-w-[68ch]">
            NEAR AI is an artificial intelligence research, engineering, and product development company committed to
            building an AI future owned by everyone. Founded by AI pioneer and former Google Research team member
            Illia Polosukhin, NEAR AI&rsquo;s confidential and verifiable AI infrastructure empowers developers and
            enterprises to deploy AI models with full control over their data. With hardware-backed private
            inference via a simple API, NEAR AI Cloud runs sensitive AI workloads securely and at scale. NEAR AI
            Private Chat brings the same guarantees to everyday questions and research. Serving over 100 million
            users across platforms such as Brave Nightly, OpenMind, and Phala, NEAR AI is proven infrastructure for
            transforming sensitive data into secure intelligence.
          </p>

          {/* Download CTA */}
          <div className="mt-16 rounded-[2rem] overflow-hidden relative bg-gradient-to-br from-black to-[#2385C7]">
            <div className="relative p-10 lg:p-12 flex flex-wrap items-center justify-between gap-8">
              <div>
                <h3 className="font-medium [font-size:var(--font-size-h3)] tracking-[-0.02em] text-white mb-3">
                  Download the complete logo kit.
                </h3>
                <p className="[font-size:var(--font-size-body)] text-white/70 max-w-[44ch]">
                  Every lockup, every color variant, in SVG and PNG — packaged as a single download.
                </p>
              </div>
              <div className="flex flex-col gap-3.5 items-start">
                <BrandPillLink href={LOGO_KIT_ZIP} download label="Download logo kit" variant="light" />
                <span className="font-mono text-[0.875rem] tracking-[0.3em] uppercase text-white/55">SVG + PNG</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
