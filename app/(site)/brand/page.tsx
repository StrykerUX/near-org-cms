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
    <p className="font-mono text-caption text-muted-foreground text-pretty">{children}</p>
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
  { role: "Display", cls: "text-display", px: "56–128px", weight: 500, leading: 1, accent: "display", sample: "We're building quietly, with real intention," },
  { role: "H1", cls: "text-h1", px: "44–88px", weight: 500, leading: 1.05, accent: "display", sample: "A new chapter for the way people build, connect, and" },
  { role: "H2", cls: "text-h2", px: "34–60px", weight: 500, leading: 1.1, accent: "serif", sample: "Typography built to bring real clarity, focus, and" },
  { role: "H3", cls: "text-h3", px: "26–40px", weight: 500, leading: 1.15, accent: "serif", sample: "Every size in this scale was considered carefully, with real intention and craft," },
  { role: "H4", cls: "text-h4", px: "21–28px", weight: 500, leading: 1.25, accent: null, sample: "Card titles wrap onto more than one line when the content runs long, and the layout still needs to hold up gracefully without breaking the grid, even inside a narrow column where space is limited and every word has to earn its place." },
  { role: "Body Large", cls: "text-body-lg", px: "19–22px", weight: 400, leading: 1.5, accent: null, sample: "While other chains fork, fail, or fall behind, NEAR runs quietly at enterprise scale. Zero downtime. Sub-second finality. This is performance you can build on." },
  { role: "Body", cls: "text-body", px: "16–18px", weight: 400, leading: 1.6, accent: null, sample: "Verifiable privacy is a prerequisite for user-owned AI. Most prompts today run through third-party inference providers that can access your inputs at runtime: your financial data, medical questions, product ideas, business strategy, internal research. All that information is exposed during execution." },
  { role: "Body Small", cls: "text-body-sm", px: "14–16px", weight: 400, leading: 1.5, accent: null, sample: "Trade across 35+ chains and 150+ assets from one account. Toggle on Confidential Mode to execute inside a private shard. No manual gas juggling or bridging required. Powered by NEAR Intents." },
  { role: "Caption", cls: "text-caption", px: "13–14px", weight: 400, leading: 1.4, accent: null, sample: "Sub-second finality and zero downtime, measured across two years of continuous enterprise-scale operation." },
  { role: "Eyebrow", cls: "text-eyebrow", px: "13–14px", weight: 500, leading: 1.2, accent: null, sample: "EYEBROW LABEL SPANNING MULTIPLE WORDS TO SHOW HOW UPPERCASE TRACKED TEXT WRAPS ACROSS SEVERAL LINES" },
];

const ACCENT_WORD: Record<string, string> = {
  // Non-breaking space glues the last two words so they can't orphan onto
  // their own line — text-wrap: pretty is a hint, not a guarantee, and has
  // no effect at all in browsers that don't support it.
  Display: "something the world hasn't seen",
  H1: "grow together across the open web",
  H2: "warmth to every surface we design",
  H3: "a clear and deliberate sense of purpose in mind",
};

export default function BrandPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1720px] flex-col gap-24 px-5 py-16 sm:px-10 sm:py-24">
      <Link
        href="/"
        className="text-body-sm text-muted-foreground hover:text-foreground transition-colors text-pretty"
      >
        ← Home
      </Link>

      {/* 1. Hero */}
      <section className="flex flex-col gap-6">
        <p className="text-eyebrow uppercase text-muted-foreground text-pretty">
          Design system · Typography
        </p>
        <h1 className="text-display font-medium text-pretty">
          The voice of the{" "}
          <Accent display>brand</Accent>
        </h1>
        <p className="text-body-lg text-foreground max-w-2xl text-pretty">
          This page is the living reference for how type works across the
          site — not a PDF that goes stale, but the actual scale, rules and
          fonts rendered in the browser.
        </p>
      </section>

      {/* 2. The scale */}
      <section className="flex flex-col gap-10">
        <h2 className="text-h2 font-medium text-pretty">The scale</h2>
        <div className="flex flex-col gap-10">
          {SCALE.map((role) => (
            <div key={role.role} className="flex flex-col gap-2 border-b border-border pb-8 last:border-0">
              <p className={`${role.cls} text-pretty`}>
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
        <h2 className="text-h2 font-medium text-pretty">Rules</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
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
          <li className="text-pretty">
            <span className="font-medium">Do</span> — one accent per
            headline, 1–4 words. <code className="font-mono text-body-sm">font-display</code>{" "}
            for Display/H1, <code className="font-mono text-body-sm">font-serif</code>{" "}
            for H2–H4.
          </li>
          <li className="text-pretty">
            <span className="font-medium">Don&rsquo;t</span> — more than one
            accent, accent in body copy, or bold combined with the accent.
          </li>
          <li className="text-pretty">
            <span className="font-medium">Weight</span> — Regular (400) for
            body/UI. Medium (500) default for headings. Bold (700) only for
            CTAs, standout figures, active nav.
          </li>
          <li className="text-pretty">
            <span className="font-medium">Hierarchy</span> — the visual role
            is decoupled from the HTML tag; the document outline (
            <code className="font-mono text-body-sm">h1 → h2 → h3</code>)
            stays correct no matter how large something looks.
          </li>
          <li className="text-pretty">
            <span className="font-medium">Always fluid</span> — every size
            above is <code className="font-mono text-body-sm">clamp()</code>,
            never a fixed rem/px value or a separate breakpoint class.
          </li>
          <li className="text-pretty">
            <span className="font-medium">Accessibility floor</span> — rem
            units, nothing below ~13px, line-height ≥ 1.5 on body copy, no
            skipped heading levels, no fixed-height text containers.
          </li>
        </ul>
      </section>

      {/* 4. Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">Reference</h2>
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
                  <td className="py-2 pr-4 text-pretty">{role.role}</td>
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
