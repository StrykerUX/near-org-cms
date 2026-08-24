import { ArrowUpRight } from "lucide-react";

import StageCard from "@/components/sections/shells/stage/Card";
import StageSection from "@/components/sections/shells/stage/Section";
import ChannelMarks from "@/components/sections/community/c/ChannelMarks";
import {
  CHANNEL_GROUPS,
  SOCIALS,
} from "@/components/sections/community/communityContent";

// §5 of the stage — eight channels, answered in three.
//
// ── Editing instead of listing ────────────────────────────────────────────
// A prints all eight flat, as a directory, which is the right shape for a
// directory. This variant sorts them first. A reader knows they want help, or
// want to read the code, or want to follow along; a flat list of eight makes
// them infer which destination answers that, and `CHANNEL_GROUPS` answers it
// before a single handle is read.
//
// The per-channel line is gone here — it is on the page in A, and here the
// group's own note does that work for two or three channels at once. What is
// left under each card is the name and the handle, which is all the reader needs
// once they know which of the three questions they are in.
//
// ── Three drawn marks, and still no platform logo ─────────────────────────
// The card carries a figure, so each group gets one — and a family is the one
// thing on this page that CAN have a mark, because nobody owns a symbol for
// "talk to someone" and there is nothing to falsify. Eight platform logos would
// be two real marks, one stale one and five inventions. The reasoning and the
// three drawings are in `ChannelMarks`.
//
// ── Why the shared `Card` stops at the card ───────────────────────────────
// `Card` takes one `body` string and at most one `href`, which is the correct
// shape for a unit that leads one place. A group leads two or three places, so
// the destinations cannot live inside it — the card carries the ANSWER (mark,
// label, note) and the channels hang under it as a short list of links.
//
// The alternative was a private card in this folder with children. That is how a
// repo ends up with two cards that drift apart, and it would cost the one thing
// the shared shell buys: the four C variants looking like one family.
//
// A server component: links and a CSS hover.
export default function RallyChannels() {
  return (
    <StageSection eyebrow={SOCIALS.eyebrow} title={SOCIALS.headline} intro={SOCIALS.sub}>
      <div className="grid-ds gap-y-12">
        {CHANNEL_GROUPS.map((group) => {
          const channels = SOCIALS.channels.filter((c) =>
            (group.channelIds as readonly string[]).includes(c.id)
          );

          return (
            <div key={group.id} className="col-span-12 lg:col-span-4">
              <StageCard
                art={<ChannelMarks id={group.id} />}
                title={group.label}
                body={group.note}
                accent={group.id === "talk"}
              />

              <ul className="mt-8">
                {channels.map((c) => (
                  <li key={c.id}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-4 border-t border-rule py-4 transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      <span className="text-h4">{c.name}</span>
                      <span className="flex items-baseline gap-3">
                        <span className="text-caption-mono text-gray-intermediate">
                          {c.handle}
                        </span>
                        <ArrowUpRight
                          className="size-4 shrink-0 self-center text-gray-intermediate transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </StageSection>
  );
}
