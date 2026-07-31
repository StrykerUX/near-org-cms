import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typography — Design System",
  description: "The typographic guidelines for the new design system: type scale, pairing rules, hierarchy, and accessibility non-negotiables.",
};

function Accent({
  display,
  children,
}: {
  display?: boolean;
  children: string;
}) {
  return (
    <span
      className={`${display ? "font-display" : "font-serif"} italic tracking-normal text-[1.18em]`}
    >
      {children}
    </span>
  );
}

function Meta({ children }: { children: string }) {
  return (
    <p className="font-mono text-caption text-muted-foreground">{children}</p>
  );
}

const SCALE: {
  role: string;
  cls: string;
  px: string;
  weight: number;
  leading: number;
  accent: "display" | "serif" | null;
  sample: string;
}[] = [
  { role: "Display", cls: "text-display", px: "56–128px", weight: 500, leading: 1, accent: "display", sample: "Building" },
  { role: "H1", cls: "text-h1", px: "44–88px", weight: 500, leading: 1.05, accent: "display", sample: "A new chapter for" },
  { role: "H2", cls: "text-h2", px: "34–60px", weight: 500, leading: 1.1, accent: "serif", sample: "Typography built for" },
  { role: "H3", cls: "text-h3", px: "26–40px", weight: 500, leading: 1.15, accent: "serif", sample: "Every size in this scale carries" },
  { role: "H4", cls: "text-h4", px: "21–28px", weight: 500, leading: 1.25, accent: null, sample: "Card titles wrap onto more than one line when the content runs long" },
  { role: "Body Large", cls: "text-body-lg", px: "19–22px", weight: 400, leading: 1.5, accent: null, sample: "This is the lead paragraph style, used for introductions and standout copy that needs more presence than regular body text without becoming a heading." },
  { role: "Body", cls: "text-body", px: "16–18px", weight: 400, leading: 1.6, accent: null, sample: "This is the standard body copy style, set at a comfortable size with a generous line-height for long-form reading. It should hold up equally well in a blog post, a product description, or a full page of documentation." },
  { role: "Body Small", cls: "text-body-sm", px: "14–16px", weight: 400, leading: 1.5, accent: null, sample: "Secondary text and dense UI metadata still need to stay legible even when several lines wrap beneath each other." },
  { role: "Caption", cls: "text-caption", px: "13–14px", weight: 400, leading: 1.4, accent: null, sample: "Caption text sits below supporting media and should stay legible across two or three lines of wrapped copy." },
  { role: "Eyebrow", cls: "text-eyebrow", px: "13–14px", weight: 500, leading: 1.2, accent: null, sample: "EYEBROW LABEL SPANNING MULTIPLE WORDS TO SHOW WRAPPING BEHAVIOR" },
];

const ACCENT_WORD: Record<string, string> = {
  Display: "what's next for the world",
  H1: "the open web we're building together",
  H2: "clarity across every surface we design",
  H3: "a clear sense of purpose and intention",
};

export default function BrandPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-24 px-5 py-16 sm:px-10 sm:py-24">
      <Link
        href="/"
        className="text-body-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Home
      </Link>

      {/* 1. Hero */}
      <section className="flex flex-col gap-6">
        <p className="text-eyebrow uppercase text-muted-foreground">
          Design system · Typography
        </p>
        <h1 className="text-display font-medium">
          The voice of the{" "}
          <Accent display>brand</Accent>
        </h1>
        <p className="text-body-lg text-foreground max-w-2xl">
          This page is the living reference for how type works across the
          site — not a PDF that goes stale, but the actual scale, rules and
          fonts rendered in the browser.
        </p>
      </section>

      {/* 2. The scale */}
      <section className="flex flex-col gap-10">
        <h2 className="text-h2 font-medium">The scale</h2>
        <div className="flex flex-col gap-10">
          {SCALE.map((role) => (
            <div key={role.role} className="flex flex-col gap-2 border-b border-border pb-8 last:border-0">
              <p className={role.cls}>
                {role.accent ? (
                  <>
                    {role.sample}{" "}
                    <Accent display={role.accent === "display"}>
                      {ACCENT_WORD[role.role]}
                    </Accent>
                  </>
                ) : (
                  role.sample
                )}
              </p>
              <Meta>
                {`${role.role} · ${role.cls} · ${role.px} · weight ${role.weight} · line-height ${role.leading}`}
              </Meta>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Rules */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium">Rules</h2>
        <p className="text-body text-foreground max-w-2xl">
          Montreal carries the system — body, UI, and the default for every
          heading. Kepler is the accent: a serif reserved for one word or
          short phrase inside a headline, always italic, never in body copy.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-body-sm">
          <code className="font-mono">{`<span className="font-serif italic tracking-normal text-[1.18em]">
  accent
</span>`}</code>
        </pre>
        <ul className="flex flex-col gap-2 text-body text-foreground">
          <li>
            <span className="font-medium">Do</span> — one accent per
            headline, 1–4 words. <code className="font-mono text-body-sm">font-display</code>{" "}
            for Display/H1, <code className="font-mono text-body-sm">font-serif</code>{" "}
            for H2–H4.
          </li>
          <li>
            <span className="font-medium">Don&rsquo;t</span> — more than one
            accent, accent in body copy, or bold combined with the accent.
          </li>
          <li>
            <span className="font-medium">Weight</span> — Regular (400) for
            body/UI. Medium (500) default for headings. Bold (700) only for
            CTAs, standout figures, active nav.
          </li>
          <li>
            <span className="font-medium">Hierarchy</span> — the visual role
            is decoupled from the HTML tag; the document outline (
            <code className="font-mono text-body-sm">h1 → h2 → h3</code>)
            stays correct no matter how large something looks.
          </li>
          <li>
            <span className="font-medium">Always fluid</span> — every size
            above is <code className="font-mono text-body-sm">clamp()</code>,
            never a fixed rem/px value or a separate breakpoint class.
          </li>
          <li>
            <span className="font-medium">Accessibility floor</span> — rem
            units, nothing below ~13px, line-height ≥ 1.5 on body copy, no
            skipped heading levels, no fixed-height text containers.
          </li>
        </ul>
      </section>

      {/* 4. Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium">Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 font-medium">Role</th>
                <th scope="col" className="py-2 pr-4 font-medium">Tailwind class</th>
                <th scope="col" className="py-2 pr-4 font-medium">CSS variable</th>
              </tr>
            </thead>
            <tbody>
              {SCALE.map((role) => (
                <tr key={role.role} className="border-b border-border">
                  <td className="py-2 pr-4">{role.role}</td>
                  <td className="py-2 pr-4 font-mono">{role.cls}</td>
                  <td className="py-2 pr-4 font-mono">{`--${role.cls}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
