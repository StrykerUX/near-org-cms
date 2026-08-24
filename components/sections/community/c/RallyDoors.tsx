import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import MediaFrame from "@/components/primitives/MediaFrame";
import StageSection from "@/components/sections/shells/stage/Section";
import { INVOLVEMENT, MEDIA } from "@/components/sections/community/communityContent";

// §6 of the stage — four doors, each one a photograph of somebody doing it.
//
// ── Why four pictures and not four paragraphs ─────────────────────────────
// Four headings over four two-line paragraphs in four identical columns is one
// thing said four times: the eye takes the shape in once and moves on without
// registering that hosting a meetup and shipping a pull request are nothing
// alike. Four photographs of four visibly different activities do the
// differentiating before a word is read, which is the only job asked of them.
//
// The commissions live in `MEDIA.ways`, keyed by the same `id` as the door, so a
// fifth way in cannot be added without somebody deciding what its picture is —
// the build stops until they do.
//
// ── The card is local, and the shared one was tried first ─────────────────
// `stage/Card` puts its art in a white, padded box: a sheet of paper for a
// drawing, which is right for the channel marks two sections up. A photograph in
// that box is a letterboxed picture floating on a mat, and the day the real
// asset lands it stays small in the middle of a card it should be filling.
//
// So the media here runs flush to the card's inner radius and the shell is
// rebuilt from the same tokens — the same radius, the same tint, the same hover.
// The card shape is the shared vocabulary; what changes is that the figure is a
// photograph and photographs are not matted. Documented rather than silently
// diverged: if `Card` ever grows a flush art mode, this file goes away.
//
// ── One link per door, never one shared CTA ───────────────────────────────
// This is the page's routing block. A single button underneath would make the
// reader pick a door and only then find out where it goes.
//
// `id="get-involved"` is the target of `HERO.primary` and `CLOSING.primary` —
// renaming it breaks two links on this page.
export default function RallyDoors() {
  return (
    <StageSection
      id="get-involved"
      tone="tint"
      eyebrow={INVOLVEMENT.eyebrow}
      title={INVOLVEMENT.headline}
    >
      {/* Two by two and not the row of four A uses. This is the variant where
          the photographs carry the argument, and at four across the reserved
          frame is about 250px wide — a picture that small differentiates
          nothing, and its written commission takes a quarter of it. Halving the
          count doubles the picture. */}
      <ul className="grid-ds gap-y-10">
        {INVOLVEMENT.ways.map((w) => {
          const external = w.href.startsWith("http");
          const shell =
            "group flex h-full flex-col rounded-[1.75rem] bg-background p-5 transition-colors hover:bg-stone/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:p-6";

          const inner = (
            <>
              {/* `overflow-hidden` on the wrapper and not on the frame: the
                  frame draws its registration marks at the edges of its own box,
                  and rounding them off is what makes the reserved area read as a
                  plan rather than as a broken image. */}
              <div className="overflow-hidden rounded-[1.25rem]">
                <MediaFrame
                  label={MEDIA.ways[w.id].label}
                  spec={MEDIA.ways[w.id].spec}
                  ratio="4/3"
                />
              </div>
              <p className="mt-7 text-caption-mono text-gray-intermediate">{w.index}</p>
              <h3 className="mt-4 max-w-[22ch] text-h3-serif italic text-ink text-pretty">
                {w.title}
              </h3>
              <p className="mt-3 max-w-[42ch] text-body text-ink-soft text-pretty">
                {w.body}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-7 text-label text-ink underline-offset-4 group-hover:underline">
                {w.linkLabel}
                {external && <ArrowUpRight className="size-4" aria-hidden="true" />}
              </span>
            </>
          );

          return (
            <li key={w.id} className="col-span-12 sm:col-span-6">
              {external ? (
                <a
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shell}
                >
                  {inner}
                </a>
              ) : (
                <Link href={w.href} className={shell}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </StageSection>
  );
}
