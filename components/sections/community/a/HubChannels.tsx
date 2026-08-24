import { ArrowUpRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { SOCIALS } from "@/components/sections/community/communityContent";

// §5 of the Hub — eight channels as a directory, not as eight buttons.
//
// ── Why there are no logos ─────────────────────────────────────────────────
// The genre default is a grid of tiles, each with the platform's mark. It was
// not taken here, and the reason is arithmetic rather than taste: of these eight
// destinations `lucide-react` ships marks for two (GitHub, LinkedIn) and one
// stale one (the pre-rename Twitter bird). Discord, Telegram, Reddit, Farcaster
// and YouTube would each need an improvised glyph, and a row where two logos are
// real, one is out of date and five are inventions reads as broken in a way no
// amount of alignment fixes. Shipping the real marks means eight foreign logos
// at eight different optical weights, which is the same problem `ProofBand`'s
// ecosystem strip solved by setting names in type instead.
//
// So the tile becomes a directory entry: the platform's NAME does the
// recognising (nobody needs a picture to identify "Discord"), the handle sits
// under it in mono because a handle is a piece of data, and one line says what
// that channel is actually for. That last line is the part a logo grid cannot
// carry, and it is the part that answers "which of these eight do I want".
//
// One arrow, repeated, is the only glyph — a shared affordance rather than eight
// competing identities.
export default function HubChannels() {
  return (
    <section className="bg-cream pb-[14svh] pt-[14svh]">
      <Container>
        <div className="grid-ds items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-gray-intermediate">{SOCIALS.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-[18ch] text-h1 text-pretty">{SOCIALS.headline}</h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[34ch] text-body text-ink-soft text-pretty">{SOCIALS.sub}</p>
          </div>
        </div>

        <ul className="mt-14 grid-ds gap-y-0">
          {SOCIALS.channels.map((c) => (
            <li key={c.id} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col border-t border-rule pb-8 pt-5 transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-h4">{c.name}</span>
                  <ArrowUpRight
                    className="size-4 text-gray-intermediate transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-2 text-caption-mono text-gray-intermediate">{c.handle}</span>
                <span className="mt-4 max-w-[26ch] text-body-sm text-ink-soft text-pretty">
                  {c.body}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
