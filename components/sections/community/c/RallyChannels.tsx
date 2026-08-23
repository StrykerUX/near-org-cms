import { ArrowUpRight } from "lucide-react";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import {
  CHANNEL_GROUPS,
  SOCIALS,
} from "@/components/sections/community/communityContent";

// §5 of the Rally — eight channels, edited into three answers.
//
// ── This is the variant that edits instead of listing ──────────────────────
// `a/` and `b/` both render all eight channels flat, in a grid and in a table.
// That is the correct default: it is complete, it is neutral, and it makes the
// reader do the sorting. And the sorting is not hard — but it is a decision the
// reader has to make eight times, on a page whose whole promise is that you find
// your door in ten seconds.
//
// Three groups make the decision once. A reader who wants help goes to "Talk to
// someone" and stops reading; they never have to evaluate whether LinkedIn is
// where you ask a question. The cost is that the page now has an opinion about
// what each channel is for, and the opinion can be wrong — which is why the
// grouping lives in `CHANNEL_GROUPS` in the content module, next to the channels
// themselves, and not as structure hard-coded into this file.
//
// The per-channel one-liner (`body` in the content module) is deliberately NOT
// rendered here — the group note already answers "what would I come here for",
// and repeating it eight times is the flat list creeping back in under the
// headings. It is still in the content module, and `a/` and `b/` still show it.
//
// The membership is by `id`, so `SOCIALS.channels` stays the one list: a channel
// cannot be edited in one place and stale in the other, and adding a ninth
// channel without grouping it makes it disappear from THIS layout only, loudly,
// rather than showing up half-described in all three.
//
// No logos, for the reason spelled out in `a/HubChannels`.
//
// The white ground is the page's one lift and it is spent here rather than on
// the Legion, which is `c/`'s whole inversion: the Legion is separated by
// position, not by ground.
const BY_ID = new Map(SOCIALS.channels.map((c) => [c.id, c]));

export default function RallyChannels() {
  return (
    <section className="bg-background pb-[14svh] pt-[14svh]">
      <Container>
        <div className="grid-ds items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-gray-intermediate">{SOCIALS.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-[16ch] text-h1 text-pretty">{SOCIALS.headline}</h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[34ch] text-body text-ink-soft text-pretty">{SOCIALS.sub}</p>
          </div>
        </div>

        <div className="mt-16 grid-ds gap-y-14">
          {CHANNEL_GROUPS.map((group) => (
            <div key={group.id} className="col-span-12 lg:col-span-4">
              <div className="border-t border-rule pt-6">
                <h3 className="text-h3 text-pretty">{group.label}</h3>
                <p className="mt-3 max-w-[30ch] text-body-sm text-gray-intermediate text-pretty">
                  {group.note}
                </p>
              </div>

              <ul className="mt-8">
                {group.channelIds.map((id) => {
                  const channel = BY_ID.get(id);
                  // Defensive, and cheap: a typo in `channelIds` should drop one
                  // row, not take the page down at render.
                  if (!channel) return null;
                  return (
                    <li key={channel.id} className="border-b border-rule first:border-t">
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline justify-between gap-4 py-5 transition-colors hover:bg-black/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                      >
                        <span>
                          <span className="block text-h4">{channel.name}</span>
                          <span className="mt-1 block text-caption-mono text-gray-intermediate">
                            {channel.handle}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="size-4 shrink-0 text-gray-intermediate transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
