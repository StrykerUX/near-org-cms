import Link from "next/link";
import type { Metadata } from "next";
import Accent from "@/components/primitives/Accent";
import Meta from "@/components/primitives/Meta";

export const metadata: Metadata = {
  title: "Color — Design System",
  description:
    "The colour system rendered in the browser: four primitives, the eight semantic tokens that reference them, the utilities they generate, and the measured contrast of every pair the site uses.",
};

// ── Capa 0 ────────────────────────────────────────────────────────────────
// Los primitivos NO están expuestos como utilidades de Tailwind, y eso es
// deliberado: el código escribe roles, no valores. Por eso las muestras de esta
// página los leen con `var()` inline en vez de con una clase — es la única
// forma de pintarlos, y deja a la vista que no hay `bg-green-500` que escribir.
const PRIMITIVES: { token: string; figma: string; hex: string; absorbed: string }[] = [
  {
    token: "--green-500",
    figma: "green/500",
    hex: "#00DC8D",
    absorbed:
      "Absorbed five greens with separate jobs — the nav CTA, the brand, the buttons on cream, the only green that read as text on light, the ink-green field — plus the teal, the two sweep yellows and the deep stop of the CTA ramp.",
  },
  {
    token: "--cream-100",
    figma: "cream/100",
    hex: "#F5F4F1",
    absorbed:
      "Absorbed the page cream, the card tint and pure white. The site no longer has a white: cards share their surface with the page and are separated only by their border.",
  },
  {
    token: "--gray-300",
    figma: "gray/300",
    hex: "#E1E1E1",
    absorbed:
      "Absorbed every rule, divider and bar. It also carries subordinate text, but only on a dark ground — on light that role goes to the added gray/600.",
  },
  {
    token: "--gray-600",
    figma: "— (added)",
    hex: "#5F6669",
    absorbed:
      "The one addition to the file's four. Its text-secondary is gray/300, which on the page cream is 1.19:1 — not subordinate text, invisible text, across 228 places. This is 5.32:1, in the same cool hue the site already used for that role.",
  },
  {
    token: "--dark-900",
    figma: "dark/900",
    hex: "#262626",
    absorbed:
      "Absorbed the section black (#101010), the soft dark, the blue-grey dark and the ink-green field. It is also the face fill of the NearStack isometric SVG, whose back-face culling only reads as solid occlusion when fill and ground are exactly equal — both still come from here.",
  },
];

// ── Capa 1 ────────────────────────────────────────────────────────────────
// Los ocho del archivo, con sus destinos tal cual. Los nombres son los suyos
// menos el prefijo de grupo `color/` — que en CSS sería `--color-`, el
// namespace de Tailwind, donde un semántico colisiona con la clave del @theme
// que lo consume.
const SEMANTICS: {
  token: string;
  ref: string;
  utility: string;
  use: string;
  warn?: string;
}[] = [
  {
    token: "--sem-brand-primary",
    ref: "green/500",
    utility: "bg-brand · text-brand",
    use: "The brand green. The only green in the system.",
  },
  {
    token: "--sem-background-primary",
    ref: "cream/100",
    utility: "bg-surface",
    use: "The ground of the light page.",
  },
  {
    token: "--sem-background-secondary",
    ref: "cream/100",
    utility: "bg-surface-alt",
    use: "The second light surface.",
    warn:
      "Same value as primary, so there is no step between light surfaces. A tinted card no longer separates from the page by colour — only by its border.",
  },
  {
    token: "--sem-text-primary",
    ref: "dark/900",
    utility: "text-content",
    use: "Body and headings on light. 13.76:1 on cream.",
  },
  {
    token: "--sem-text-secondary-on-light",
    ref: "gray/600",
    utility: "text-content-muted",
    use: "Subordinate copy on the light page. 5.32:1 — AA with margin, and far enough from the primary (13.76:1) to still read as subordinate.",
  },
  {
    token: "--sem-text-secondary-on-dark",
    ref: "gray/300",
    utility: "text-content-dim",
    use: "The file's text-secondary, on the ground where its value works. 11.57:1 on the dark surface.",
  },
  {
    token: "--sem-text-on-brand",
    ref: "cream/100",
    utility: "text-on-brand",
    use: "Anything sitting on the brand green.",
    warn:
      "1.64:1 on the brand. The legible choice on this green is dark/900, at 8.38:1 — which is what every button on the site did before.",
  },
  {
    token: "--sem-border-default",
    ref: "gray/300",
    utility: "border-line",
    use: "Every rule and divider.",
    warn:
      "1.19:1 on cream, against a 3:1 floor for non-text elements. It is now the only thing separating a card from its page.",
  },
  {
    token: "--sem-surface-dark",
    ref: "dark/900",
    utility: "bg-surface-dark",
    use: "The dark section ground.",
  },
];

type Verdict = "pass" | "fail" | "non-text";

const VERDICT_LABEL: Record<Verdict, string> = {
  pass: "AA body",
  fail: "Below the floor",
  "non-text": "Below the non-text floor",
};

// Ratios WCAG medidos sobre los valores de la capa 0, no estimados. El piso AA
// es 4.5:1 para cuerpo normal, 3:1 para texto grande y para elementos no
// textuales — bordes, iconos, límites de controles.
const CONTRAST: { pair: string; ratio: number; verdict: Verdict; note: string }[] = [
  { pair: "dark-900 on cream-100", ratio: 13.76, verdict: "pass", note: "text-content on bg-surface." },
  { pair: "cream-100 on dark-900", ratio: 13.76, verdict: "pass", note: "The same pair inverted." },
  { pair: "gray-300 on dark-900", ratio: 11.57, verdict: "pass", note: "text-content-dim, the role on its own ground." },
  { pair: "green-500 on dark-900", ratio: 8.38, verdict: "pass", note: "The brand as text on a dark surface." },
  { pair: "dark-900 on green-500", ratio: 8.38, verdict: "pass", note: "Not what the file specifies for text-on-brand, but the legible pairing." },
  { pair: "cream-100 on green-500", ratio: 1.64, verdict: "fail", note: "text-on-brand, as the file specifies it." },
  { pair: "green-500 on cream-100", ratio: 1.64, verdict: "fail", note: "The brand is not a text colour on light." },
  { pair: "gray-600 on cream-100", ratio: 5.32, verdict: "pass", note: "text-content-muted on the light page — the added step." },
  { pair: "gray-300 on cream-100", ratio: 1.19, verdict: "fail", note: "What the file's text-secondary would have been on light. Not used." },
  { pair: "gray-300 on cream-100", ratio: 1.19, verdict: "non-text", note: "border-line on the light page." },
];

// Los alias con los que está escrito el sitio, agrupados por el rol al que
// caen. La columna de la derecha es lo que se perdió al colapsarlos.
const LEGACY: { role: string; aliases: string; lost: string }[] = [
  {
    role: "brand-primary",
    aliases:
      "--near-green · --near-green-accent · --near-green-dark · --green-ink · --near-teal · --sweep · --sweep-solid · --cta-deep",
    lost:
      "Eight tones into one, and --green-ink — which existed because the brand green does not reach 3:1 on white — is no longer distinct from the green that did not reach it. The CTA ramp is not among them: only its deep stop follows the brand, because a gradient flattened to one colour is not a simpler gradient, it is no gradient.",
  },
  {
    role: "background-primary / secondary",
    aliases: "--cream · --card-tint",
    lost: "The page ground and the card tint became the same surface.",
  },
  {
    role: "text-primary",
    aliases: "--ink · --ink-soft",
    lost: "#101010 and #323232 both rise to dark/900.",
  },
  {
    role: "surface-dark",
    aliases: "--ink-slate · --ink-deep",
    lost: "The blue-grey dark and the ink-green field lose their hue.",
  },
  {
    role: "border-default",
    aliases: "--rule · --stone · --bar",
    lost: "Three weights of line collapse into one.",
  },
  {
    role: "text-secondary",
    aliases: "--gray-intermediate · --gray-blue",
    lost:
      "228 uses of subordinate text on light. --gray-intermediate had replaced --gray-blue precisely on contrast grounds (4.34:1 against 2.81:1); both now point at the added gray/600, at 5.32:1.",
  },
];

export default function ColorPage() {
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
          href="/design-system"
          className="text-body-sm text-muted-foreground hover:text-foreground transition-colors text-pretty"
        >
          ← Typography
        </Link>
      </div>

      {/* 1. Hero */}
      <section className="flex flex-col gap-6">
        <p className="text-eyebrow uppercase text-muted-foreground text-pretty">
          Design system · Colour
        </p>
        <h1 className="text-display text-pretty">
          Four colours, and{" "}
          <Accent display>one place they live</Accent>
        </h1>
        <p className="text-body-lg text-foreground max-w-2xl text-pretty">
          The design file was adopted literally: four primitives, eight semantic
          tokens, and every colour on the site routed through them. Changing the
          palette is moving a value in layer 0 — never a find-and-replace across
          the sections.
        </p>
      </section>

      {/* 2. The three layers */}
      <section className="flex flex-col gap-10">
        <h2 className="text-h2 text-pretty">The three layers</h2>
        <div className="flex flex-col gap-8">
          {[
            {
              n: "Layer 0 · Primitives",
              d: "The four raw values from the design file. Not exposed as Tailwind utilities on purpose — code writes roles, not values. The only place a hex appears.",
            },
            {
              n: "Layer 1 · Semantic tokens",
              d: "The eight roles, written as references to a primitive. These are the names from the design file, and they are what new code should reach for.",
            },
            {
              n: "Layer 2 · Legacy aliases",
              d: "The names the site is already written with — around 1900 uses. None declares a hex, and none has a value of its own any more: all 21 fall onto the eight roles.",
            },
          ].map((layer) => (
            <div
              key={layer.n}
              className="flex flex-col gap-2 border-b border-border pb-8 last:border-0"
            >
              <p className="text-h4 text-pretty">{layer.n}</p>
              <p className="text-body text-foreground max-w-2xl text-pretty">
                {layer.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Primitives */}
      <section className="flex flex-col gap-10">
        <h2 className="text-h2 text-pretty">Primitives</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The site had around seventeen tones before this. What each primitive
          absorbed is written next to it — not to mourn it, but because that is
          what someone needs to read the day they wonder why two things the
          design used to separate now look the same.
        </p>
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRIMITIVES.map((p) => (
            <div key={p.token} className="flex flex-col gap-3">
              <div
                className="aspect-4/3 w-full rounded-xl border border-border"
                style={{ backgroundColor: `var(${p.token})` }}
              />
              <div className="flex flex-col gap-1">
                <p className="text-label text-pretty">{p.figma}</p>
                <Meta>{`${p.token} · ${p.hex}`}</Meta>
              </div>
              <p className="text-caption text-muted-foreground text-pretty">
                {p.absorbed}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Semantic tokens */}
      <section className="flex flex-col gap-10">
        <h2 className="text-h2 text-pretty">Semantic tokens</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          Eight roles, with the destinations the design file gives them and no
          deviations. Four carry a contrast warning; they are here as the file
          defines them, and the warning is written next to each so that nobody
          has to rediscover it by measuring.
        </p>
        <div className="flex flex-col gap-8">
          {SEMANTICS.map((t) => (
            <div
              key={t.token}
              className="flex flex-col gap-3 border-b border-border pb-8 last:border-0"
            >
              <div className="flex items-start gap-4">
                <div
                  className="mt-1 size-10 shrink-0 rounded-lg border border-border"
                  style={{ backgroundColor: `var(${t.token})` }}
                />
                <div className="flex flex-col gap-1">
                  <p className="text-h4 text-pretty">
                    {t.token.replace("--sem-", "")}
                  </p>
                  <Meta>{`→ ${t.ref} · ${t.utility}`}</Meta>
                </div>
              </div>
              <p className="text-body text-foreground max-w-3xl text-pretty">
                {t.use}
              </p>
              {t.warn ? (
                <p className="text-body-sm text-muted-foreground max-w-3xl border-l-2 border-border pl-4 text-pretty">
                  <span className="text-label">Below the contrast floor</span> —{" "}
                  {t.warn}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Utilities, rendered */}
      <section className="flex flex-col gap-10">
        <h2 className="text-h2 text-pretty">The utilities, rendered</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The class names do not repeat the token names, and that is not a style
          preference. <code className="text-body-sm-mono">--color-</code> is
          Tailwind&rsquo;s own namespace, so a semantic token declared there
          collides with the key that consumes it — and{" "}
          <code className="text-body-sm-mono">--color-text-primary</code> would
          generate the class{" "}
          <code className="text-body-sm-mono">text-text-primary</code>.
        </p>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          Both panels below are live. The subordinate role is split by ground:
          the light panel uses the added gray/600 step, the dark one the
          file&rsquo;s gray/300.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6">
            <p className="text-eyebrow uppercase text-content-muted">
              On a light surface
            </p>
            <p className="text-h4 text-content text-pretty">
              bg-surface · text-content
            </p>
            <p className="text-body text-content-muted text-pretty">
              text-content-muted carries the subordinate line here, at 5.32:1.
            </p>
            <span className="w-fit rounded-full bg-brand px-4 py-2 text-label text-on-brand">
              bg-brand · text-on-brand
            </span>
            <div className="h-px w-full bg-line" />
            <Meta>border-line · bg-line</Meta>
          </div>
          <div className="flex flex-col gap-3 rounded-xl bg-surface-dark p-6">
            <p className="text-eyebrow uppercase text-content-dim">
              On a dark surface
            </p>
            <p className="text-h4 text-surface text-pretty">bg-surface-dark</p>
            <p className="text-body text-content-dim text-pretty">
              text-content-dim is the same role on the ground the file&rsquo;s
              value was made for — 11.57:1.
            </p>
            <span className="w-fit rounded-full bg-brand px-4 py-2 text-label text-on-brand">
              bg-brand · text-on-brand
            </span>
          </div>
        </div>
      </section>

      {/* 6. Contrast */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 text-pretty">Measured contrast</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          WCAG ratios computed against the layer 0 values, not estimated. The AA
          floor is 4.5:1 for normal body copy, 3:1 for large text and for
          non-text elements such as borders and control boundaries.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 text-label">Pair</th>
                <th scope="col" className="py-2 pr-4 text-label">Ratio</th>
                <th scope="col" className="py-2 pr-4 text-label">Verdict</th>
                <th scope="col" className="py-2 pr-4 text-label">Where it applies</th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST.map((c) => (
                <tr key={`${c.pair}-${c.note}`} className="border-b border-border">
                  <td className="py-2 pr-4 text-caption-mono">{c.pair}</td>
                  <td className="py-2 pr-4 text-caption-mono">{c.ratio.toFixed(2)}</td>
                  <td className="py-2 pr-4 text-pretty">{VERDICT_LABEL[c.verdict]}</td>
                  <td className="py-2 pr-4 text-pretty">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. What the aliases absorbed */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 text-pretty">What collapsed into what</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The 21 legacy names still resolve, so nothing in the existing code had
          to be rewritten. They all fall onto the eight roles.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 text-label">Role</th>
                <th scope="col" className="py-2 pr-4 text-label">Aliases</th>
                <th scope="col" className="py-2 pr-4 text-label">What it cost</th>
              </tr>
            </thead>
            <tbody>
              {LEGACY.map((l) => (
                <tr key={l.role} className="border-b border-border">
                  <td className="py-2 pr-4 text-caption-mono">{l.role}</td>
                  <td className="py-2 pr-4 text-caption-mono">{l.aliases}</td>
                  <td className="py-2 pr-4 text-pretty">{l.lost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Rules */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 text-pretty">Rules</h2>
        <ul className="flex flex-col gap-2 text-body text-foreground">
          <li className="text-pretty">
            <span className="text-label-lg">New code writes roles</span> —{" "}
            <code className="text-body-sm-mono">bg-surface</code>,{" "}
            <code className="text-body-sm-mono">text-content</code>,{" "}
            <code className="text-body-sm-mono">border-line</code>. The legacy
            names still resolve, but they say what a colour is rather than what
            it is for.
          </li>
          <li className="text-pretty">
            <span className="text-label-lg">A new tone enters through layer 0</span>{" "}
            — if a role has to become distinguishable again, the step is added
            there and the semantic token is repointed. Never a loose hex in a
            section.
          </li>
          <li className="text-pretty">
            <span className="text-label-lg">Animated colours are the exception</span>{" "}
            — GSAP interpolates colours, not declarations, so a{" "}
            <code className="text-body-sm-mono">var()</code> never resolves as a
            tween target. Those stay as literals, and anything animated by more
            than one scene lives in{" "}
            <code className="text-body-sm-mono">motionColors.ts</code>, which
            mirrors layer 0 by hand.
          </li>
          <li className="text-pretty">
            <span className="text-label-lg">Check the prefix before trusting a new key</span>{" "}
            — two theme tokens that share a prefix can make Tailwind emit the
            short one and silently drop the long one. This repo has already been
            bitten by it. Verify against the emitted CSS, not against intuition.
          </li>
          <li className="text-pretty">
            <span className="text-label-lg">Two things sit outside the system</span>{" "}
            — the CMS admin, which runs on the shadcn tokens and its own dark
            mode, and the artwork: the hero foliage ramp, the terrain and relief
            scenes, and{" "}
            <code className="text-body-sm-mono">stackArt.generated.tsx</code>.
            Their multi-stop gradients are pictures, not surfaces — flattening
            them to the brand green does not simplify them, it erases them. What
            follows the brand inside a scene is the stop that WAS the brand
            green, and nothing else.{" "}
            <code className="text-body-sm-mono">--destructive</code> also keeps
            its red: the palette has no error colour, and a destructive action
            painted brand green is a button that lies.
          </li>
        </ul>
      </section>
    </main>
  );
}
