import { ArrowUpRight } from "lucide-react";

import Panel from "@/components/sections/shells/instrument/Panel";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import {
  CHANNEL_GROUPS,
  INSTRUMENT,
  SOCIALS,
} from "@/components/sections/community/communityContent";

// §5 of the instrument — eight channels, sorted into the three questions people
// arrive with.
//
// ── Still no platform logos ───────────────────────────────────────────────
// The reason is arithmetic and it has not changed between variants: of these
// eight destinations `lucide-react` ships real marks for two, a stale one for a
// third, and nothing for Discord, Telegram, Reddit, Farcaster or YouTube. A row
// where two logos are real, one is out of date and five are invented reads as
// broken, and no alignment fixes it. The platform's NAME does the recognising —
// nobody needs a picture to identify "Discord" — the handle sits under it in
// mono because a handle is data, and one line says what the channel is for,
// which is the part a logo grid cannot carry.
//
// ── Three panels and not one list of eight ────────────────────────────────
// A prints the eight flat, as a directory, and that is correct for a directory.
// An instrument sorts before it lists: the reader knows they want help, or want
// to read code, or want to follow along, and `CHANNEL_GROUPS` answers that
// before they read a single handle. Three panels make the sorting visible —
// each group is a separate object with its own label in the corner, which is
// exactly what the panel shell is for.
//
// `slate` and not `ink` for these three: the page's two big panels are ink, and
// giving the repeated small ones a different ground is what keeps a row of three
// from reading as one panel that got cut into pieces.
//
// A server component: eight links and a CSS hover, nothing to run on the client.
export default function NetChannels() {
  return (
    <InstrumentSection
      id="channels"
      eyebrow={SOCIALS.eyebrow}
      title={SOCIALS.headline}
      intro={SOCIALS.sub}
    >
      <div className="grid-ds gap-y-8">
        {CHANNEL_GROUPS.map((group) => {
          const channels = SOCIALS.channels.filter((c) =>
            (group.channelIds as readonly string[]).includes(c.id)
          );

          return (
            <div key={group.id} className="col-span-12 lg:col-span-4">
              <Panel label={group.label} tone="slate" className="h-full">
                <div className="px-5 pb-8 pt-16 lg:px-7 lg:pt-20">
                  <p className="max-w-[30ch] text-body text-white/60 text-pretty">
                    {group.note}
                  </p>

                  <ul className="mt-10">
                    {channels.map((c) => (
                      <li key={c.id}>
                        <a
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col border-t border-white/12 py-5 transition-colors hover:border-near-green-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-near-green-accent"
                        >
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="text-h4">{c.name}</span>
                            <span className="flex items-baseline gap-3">
                              <span className="text-micro-mono uppercase text-white/40">
                                {c.handle}
                              </span>
                              <ArrowUpRight
                                className="size-4 shrink-0 self-center text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                aria-hidden="true"
                              />
                            </span>
                          </span>
                          <span className="mt-2 max-w-[28ch] text-body-sm text-white/55 text-pretty">
                            {c.body}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
            </div>
          );
        })}
      </div>

      {/* The three groups cover all eight exactly once (3 + 2 + 3), so there is
          no "everything else" panel to write — and if a ninth channel is ever
          added without being filed, this row is where it goes missing. Said out
          loud in `CHANNEL_GROUPS`, repeated here because this is the file that
          would quietly drop it. */}
      <p className="mt-10 text-micro-mono uppercase text-white/30">
        {INSTRUMENT.channels.meta}
      </p>
    </InstrumentSection>
  );
}
