import Accent from "@/components/primitives/Accent";
import Eyebrow from "@/components/primitives/Eyebrow";
import { ROADMAP_HEADER } from "./roadmapContent";

// Identical in both layouts (rm-head in the source comp) — one shared piece
// instead of two copies of the same headline/copy/CTA.
export default function RoadmapHeader({ titleId }: { titleId: string }) {
  return (
    <header className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-16">
      <div>
        <Eyebrow className="mb-2 text-ink/70">{ROADMAP_HEADER.eyebrow}</Eyebrow>
        <h2 id={titleId} className="text-h2 text-ink text-pretty">
          NEAR&rsquo;s post-quantum <Accent>roadmap</Accent>
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-h3 text-ink text-pretty">{ROADMAP_HEADER.lede}</p>
        {/* text-body (16-18px), not text-body-lg (19-22px) — measured at
            22px on a wide screen, feedback wants it at 18px. */}
        {ROADMAP_HEADER.copy.map((paragraph) => (
          <p key={paragraph} className="max-w-[60ch] text-body text-ink/80 text-pretty">
            {paragraph}
          </p>
        ))}
        {/* Custom gradient CTA, not the shared Button primitive: its palette
            doesn't have this comp's local lime->green (see the plan's open
            color question), and Button doesn't forward `style`. Structural
            classes below are copied from Button.tsx's own "light" shape. */}
        <a
          href="#"
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-label text-ink transition-[filter,transform] hover:brightness-[1.06] hover:-translate-y-px"
          style={{ backgroundImage: "linear-gradient(100deg, var(--rm-green-light) 0%, var(--rm-green-deep) 100%)" }}
        >
          {ROADMAP_HEADER.ctaLabel}
        </a>
      </div>
    </header>
  );
}
