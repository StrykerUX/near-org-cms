import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";

// Transcribed from the Footer tab of "near.org - sitemap" (Google Doc).
//
// Same four categories as the header, but WITHOUT the per-link descriptions —
// the doc lists those only under Navigation. Resources and About keep their
// sub-group labels (Build / Learn / Connect, Fundamentals / Ecosystem), which
// is why a column here is a list of SECTIONS rather than a flat list of links.
const GROUPS = [
  {
    title: "Products",
    sections: [{ label: "", links: ["near.com", "Intents", "NEAR AI"] }],
  },
  {
    title: "Stack",
    sections: [
      { label: "", links: ["Protocol", "Chain Abstraction", "Quantum Security"] },
    ],
  },
  {
    title: "Resources",
    sections: [
      { label: "Build", links: ["Docs", "Solutions"] },
      { label: "Learn", links: ["Research", "Blog", "Analytics"] },
      { label: "Connect", links: ["Brand", "Contact", "Careers"] },
    ],
  },
  {
    title: "About",
    sections: [
      { label: "Fundamentals", links: ["History", "Roadmap", "Economics"] },
      { label: "Ecosystem", links: ["NEAR Foundation", "Community", "Governance"] },
    ],
  },
];

const LEGAL = ["Privacy", "Terms of Use", "Cookie Policy"];

// The wordmark is the SVG and not the 1440px PNG that used to be here: it is
// displayed at 100% of the viewport width, so on anything wider than 1440 CSS
// px the raster was being upscaled — and on a 2× display it was resolving ~3840
// device px out of a 1440px source. Vector has no such ceiling.
//
// Its intrinsic ratio comes from the SVG's own viewBox (981 × 255 = 3.85:1),
// which is a slightly tighter crop than the PNG's 4.01:1 — the wordmark now
// sits marginally taller for a given width.
//
// The reference caps the container at 479px and hides the overflow, cutting the
// letterforms off mid-height. Here the wordmark is shown whole and edge to edge,
// with its feet on the bottom of the page — a deliberate departure from
// `Homepage.dc.html` / `Quantum Security.dc.html`.
//
// "Feet on the bottom" needs one correction, and it is the only subtle part of
// this file. The type is optically corrected: the flat stems of the "n" and the
// "r" stop at y = 404.43 in the SVG's own units, while the round "e" and "a"
// overshoot below them, down to 410.24, so the eye reads them all as sitting on
// one line. Aligning the box to the glyphs' true extent therefore leaves a
// visible sliver of page under the two flat letters. Cropping to the FLAT
// baseline instead — clipping the round letters' overshoot, which is what the
// eye already discounts — is what makes the wordmark look seated.
//
// Measured off the SVG with getBBox(), not guessed. Re-measure if the asset is
// ever redrawn.
const WORDMARK_W = 981; // viewBox width
const WORDMARK_H = 255; // viewBox height
const WORDMARK_FLAT_BASELINE = 404.43;
const WORDMARK_VIEWBOX_BOTTOM = 411;

// Expressed as a percentage of WIDTH on purpose: a percentage margin resolves
// against the containing block's width, so this one value crops the same
// proportion at every viewport size without any measurement at runtime.
const WORDMARK_CROP_PCT =
  ((WORDMARK_VIEWBOX_BOTTOM - WORDMARK_FLAT_BASELINE) / WORDMARK_W) * 100; // ≈0.67%

export default function PrototypeFooter() {
  return (
    <footer className="bg-cream text-foreground">
      <Container className="grid gap-16 pb-24 pt-24 lg:grid-cols-[1fr_auto] lg:gap-24">
        <p className="text-h2 text-pretty">
          Where money
          <br />
          <Accent>actually moves.</Accent>
        </p>

        <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4 lg:gap-x-16">
          {GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-label">{group.title}</h2>
              {/* A column is a list of SECTIONS. Products and Stack have one
                  unlabelled section, so they render as a plain list; Resources
                  and About have several, and each gets its sub-heading. */}
              <div className="mt-3 flex flex-col gap-5">
                {group.sections.map((section, i) => (
                  <div key={section.label || i} className="flex flex-col gap-1.5">
                    {section.label && (
                      <p className="text-caption uppercase text-gray-intermediate">
                        {section.label}
                      </p>
                    )}
                    <ul className="flex flex-col gap-1.5">
                      {section.links.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          ))}
        </div>
      </Container>

      {/* `isolate` bounds the blending group for the legal row below it.
          `overflow-hidden` is back, but doing the opposite job to the reference's:
          there it hid half the wordmark, here it trims only the round letters'
          overshoot. */}
      <div className="relative isolate overflow-hidden">
        {/* Full width, automatic height, pulled up by a negative bottom margin so
            the block ends on the flat baseline instead of on the overshoot. No
            `priority` on purpose — this is the end of the page, it should not
            compete with the hero. `unoptimized` because the source is already
            vector: routing an SVG through the image optimizer gains nothing and
            Next declines to rasterise it anyway. */}
        <Image
          src="/prototype/v2/near-wordmark.svg"
          alt="NEAR"
          width={WORDMARK_W}
          height={WORDMARK_H}
          unoptimized
          className="block h-auto w-full"
          style={{ marginBottom: `-${WORDMARK_CROP_PCT}%` }}
        />

        {/* El legal va ENCIMA del wordmark, y ahí hay un problema real: parte
            del texto cae sobre las letras negras y parte sobre el fondo claro,
            así que ningún color fijo se ve bien en los dos.
            `mix-blend-difference` lo resuelve invirtiendo contra lo que haya
            detrás, y con un GRIS de origen el resultado es gris en los dos
            casos —claro sobre el negro, oscuro sobre el cream— en vez del
            blanco/negro puro que daría un source blanco.
            `neutral-400` y no un gris más oscuro: bajo difference, un source
            medio (#737373) cae a ~4:1 de contraste contra los dos fondos,
            mientras este pasa AA en ambos (8.3:1 sobre negro, 6.9:1 sobre
            cream). */}
        <div className="absolute inset-x-0 bottom-6 mix-blend-difference">
          <Container className="flex flex-wrap items-center justify-end gap-x-8 gap-y-2 text-neutral-400">
            <p className="text-body-sm">© 2026 NEAR. All rights reserved.</p>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {LEGAL.map((item) => (
                <li key={item}>
                  <a href="#" className="text-body-sm transition-opacity hover:opacity-70">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </div>
    </footer>
  );
}
