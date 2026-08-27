import Link from "next/link";
import type { Metadata } from "next";
import Accent from "@/components/primitives/Accent";
import Meta from "@/components/primitives/Meta";

export const metadata: Metadata = {
  title: "Typography — Design System",
  description: "The typographic guidelines for the new design system: the three families that ship, the type scale, the mono roles, pairing rules, hierarchy, and accessibility non-negotiables.",
};

// Las tres familias que sirve lib/fonts.ts, con los pesos que efectivamente
// entran al bundle — no los que la familia trae. Es la diferencia que importa:
// pedir un weight que no está acá se lo inventa el navegador sintetizándolo.
const FAMILIES: {
  name: string;
  token: string;
  faces: string;
  role: string;
  sample: string;
  cls: string;
}[] = [
  {
    name: "PP Neue Montreal",
    token: "--font-sans",
    faces: "Book (400) · BookItalic · Medium (500) · Bold (700)",
    role: "Carries the system: body, UI, and the default for every heading.",
    sample: "The quick brown fox jumps over the lazy dog",
    cls: "text-h3",
  },
  {
    name: "PP Neue Montreal Mono",
    token: "--font-mono",
    faces: "Regular (400) · Medium (500)",
    role:
      "Data, labels and code — anything read as a value rather than as prose. Same x-height as the sans, so the two align on a shared baseline.",
    sample: "0123456789 · --text-caption · 1.4rem",
    cls: "text-body-sm-mono",
  },
  {
    name: "Kepler Std Condensed",
    token: "--font-serif / --font-display",
    faces: "Subhead (400) + italic · Display (400) + italic",
    role:
      "The accent: one word or phrase inside a heading, never a paragraph. Two optical masters, picked by scale.",
    sample: "The quick brown fox jumps over the lazy dog",
    cls: "text-h2-serif",
  },
];

// Los roles que cambian de FAMILIA no pueden vivir como token `--text-*`: un
// token del @theme no aporta font-family. Van como @utility en globals.css, y
// por eso se listan aparte de SCALE — comparten su tamaño con el token sans que
// nombran, pero son una clase distinta, no una variante que se pueda componer.
const MONO_ROLES: { cls: string; from: string; use: string; sample: string }[] = [
  {
    cls: "text-body-sm-mono",
    from: "--text-body-sm",
    use: "Inline code, and UI text that is a value.",
    sample: "text-wrap: balance",
  },
  {
    cls: "text-caption-mono",
    from: "--text-caption",
    use: "Dates, counters, file paths, table cells.",
    sample: "components/primitives/Meta.tsx",
  },
  {
    cls: "text-eyebrow-mono",
    from: "--text-eyebrow",
    use: "Section labels, where the wide tracking is the role.",
    sample: "DESIGN SYSTEM",
  },
];

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
    <main className="mx-auto flex w-full max-w-[1720px] flex-col gap-24 px-5 pt-[calc(var(--site-header-block)+4rem)] pb-16 sm:px-10 sm:pb-24">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link
          href="/"
          className="text-body-sm text-muted-foreground hover:text-foreground transition-colors text-pretty"
        >
          ← Home
        </Link>
        <Link
          href="/design-system/color"
          className="text-body-sm text-muted-foreground hover:text-foreground transition-colors text-pretty"
        >
          Colour →
        </Link>
      </div>

      {/* 1. Hero */}
      <section className="flex flex-col gap-6">
        <p className="text-eyebrow uppercase text-muted-foreground text-pretty">
          Design system · Typography
        </p>
        <h1 className="text-display text-pretty">
          The voice of the{" "}
          <Accent display>brand</Accent>
        </h1>
        <p className="text-body-lg text-foreground max-w-2xl text-pretty">
          This page is the living reference for how type works across the
          site — not a PDF that goes stale, but the actual scale, rules and
          fonts rendered in the browser.
        </p>
      </section>

      {/* 2. The families */}
      <section className="flex flex-col gap-10">
        <h2 className="text-h2 text-pretty">The families</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          Three families, all self-hosted and subset — nothing is fetched from a
          third party. The weights listed are the ones that actually ship: ask
          for one that isn&rsquo;t here and the browser synthesises it, which
          thickens the stroke without redrawing it.
        </p>
        <div className="flex flex-col gap-10">
          {FAMILIES.map((family) => (
            <div
              key={family.name}
              className="flex flex-col gap-3 border-b border-border pb-8 last:border-0"
            >
              <p className={`${family.cls} text-pretty`}>{family.sample}</p>
              <p className="text-body text-foreground max-w-2xl text-pretty">
                <span className="text-label-lg">{family.name}</span> —{" "}
                {family.role}
              </p>
              <Meta>{`${family.token} · ${family.faces}`}</Meta>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The scale */}
      <section className="flex flex-col gap-10">
        <h2 className="text-h2 text-pretty">The scale</h2>
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

      {/* 4. Mono roles */}
      <section className="flex flex-col gap-10">
        <h2 className="text-h2 text-pretty">Mono roles</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          Each one packs family, size and tracking into a single class. They are
          not a variant you compose — writing{" "}
          {/* ds-exempt: la clase se NOMBRA acá, no se aplica */}
          <code className="text-body-sm-mono">font-mono</code> next to a scale
          token leaves the sans tracking on a monospaced face, which fights the
          uniform advance that is the whole point of one.
        </p>
        <div className="flex flex-col gap-10">
          {MONO_ROLES.map((role) => (
            <div
              key={role.cls}
              className="flex flex-col gap-2 border-b border-border pb-8 last:border-0"
            >
              <p className={`${role.cls} ${role.cls === "text-eyebrow-mono" ? "uppercase" : ""}`}>
                {role.sample}
              </p>
              <p className="text-body text-foreground max-w-2xl text-pretty">
                {role.use}
              </p>
              <Meta>{`${role.cls} · size from ${role.from}`}</Meta>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Rules */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 text-pretty">Rules</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          Montreal carries the system — body, UI, and the default for every
          heading. Kepler is the accent: a serif reserved for one word or
          short phrase inside a headline, always italic, never in body copy.
          Montreal Mono is for values, not prose: a date, a class name, a
          count — anything the reader scans rather than reads.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-body-sm">
          <code className="text-caption-mono">{`<Accent>accent</Accent>          // dentro de H2–H4
<Accent display>accent</Accent>  // dentro de Display/H1`}</code>
        </pre>
        <ul className="flex flex-col gap-2 text-body text-foreground">
          <li className="text-pretty">
            <span className="text-label-lg">Do</span> — one accent per
            headline, 1–4 words. <code className="text-body-sm-mono">accent-display</code>{" "}
            for Display/H1, <code className="text-body-sm-mono">accent-serif</code>{" "}
            for H2–H4 — both wrapped by <code className="text-body-sm-mono">Accent</code>,
            never hand-written.
          </li>
          <li className="text-pretty">
            <span className="text-label-lg">Don&rsquo;t</span> — more than one
            accent, accent in body copy, or bold combined with the accent.
          </li>
          <li className="text-pretty">
            <span className="text-label-lg">Weight</span> — Regular (400) for
            body/UI. Medium (500) default for headings. Bold (700) only for
            CTAs, standout figures, active nav.
          </li>
          <li className="text-pretty">
            <span className="text-label-lg">Hierarchy</span> — the visual role
            is decoupled from the HTML tag; the document outline (
            <code className="text-body-sm-mono">h1 → h2 → h3</code>)
            stays correct no matter how large something looks.
          </li>
          <li className="text-pretty">
            <span className="text-label-lg">Always fluid</span> — every size
            above is <code className="text-body-sm-mono">clamp()</code>,
            never a fixed rem/px value or a separate breakpoint class.
          </li>
          <li className="text-pretty">
            <span className="text-label-lg">Accessibility floor</span> — rem
            units, nothing below ~13px, line-height ≥ 1.5 on body copy, no
            skipped heading levels, no fixed-height text containers.
          </li>
        </ul>
      </section>

      {/* 6. Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 text-pretty">Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 text-label">Role</th>
                <th scope="col" className="py-2 pr-4 text-label">Tailwind class</th>
                <th scope="col" className="py-2 pr-4 text-label">CSS variable</th>
              </tr>
            </thead>
            <tbody>
              {SCALE.map((role) => (
                <tr key={role.role} className="border-b border-border">
                  <td className="py-2 pr-4 text-pretty">{role.role}</td>
                  <td className="py-2 pr-4 text-caption-mono">{role.cls}</td>
                  <td className="py-2 pr-4 text-caption-mono">{`--${role.cls}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
