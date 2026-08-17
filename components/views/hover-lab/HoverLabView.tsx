"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CTA_VARIANTS, type CtaVariant, type Layer } from "./CtaVariants";
import { CTA_VARIANTS_PLUS, HoverLabDefs } from "./CtaVariantsPlus";
import { LINK_VARIANTS, type LinkVariant } from "./FooterLinkVariants";
import { LINK_VARIANTS_PLUS } from "./FooterLinkVariantsPlus";
import "./hoverLab.css";
import "./hoverLabPlus.css";

// La página del hover lab: 39 tratamientos para el CTA del header y 28 para los
// links del footer, cada uno en su contexto real y comparables lado a lado.
//
// ── Por qué está montado así ────────────────────────────────────────────────
//
// Un hover no se puede juzgar en una grilla de botones sueltos sobre blanco. El
// CTA del header vive en una barra negra de 64px, a diez píxeles de cuatro tabs
// y un wordmark, y su trabajo es destacar SIN taparlos; un link de footer vive
// en una columna de nueve iguales, y su trabajo es dejarse elegir. Por eso cada
// tarjeta reconstruye su contexto en vez de mostrar el elemento aislado, y por
// eso el switch de ground existe: el header real cambia de tono al cruzar una
// sección oscura (`data-nav-dark`), y varias variantes se caen en uno de los
// dos estados.
//
// El filtro es por CAPA y no por "tipo de efecto" porque la pregunta que hay
// que poder contestar mirando esto es cuánta maquinaria estamos dispuestos a
// mantener por un hover — no qué tan lindo se ve.
//
// Nada de acá toca los componentes del sitio. Ver la cabecera de hoverLab.css.

const LAYERS: Layer[] = ["CSS", "JS", "GSAP", "WebGL"];

// La copy de la página va en INGLÉS, como todo el frontend público — los
// comentarios del código siguen en español, como el resto del repo.
type Filter = "All" | Layer;
type Ground = "cream" | "ink";

// Las 27 + 12 y las 16 + 12, en un solo catálogo cada una. La numeración de las
// tarjetas sale de estos arrays, así que la 28 es la 28 con cualquier filtro
// puesto.
const ALL_CTA = [...CTA_VARIANTS, ...CTA_VARIANTS_PLUS];
const ALL_LINKS = [...LINK_VARIANTS, ...LINK_VARIANTS_PLUS];

/** El color de cada capa ordena de más barato a más caro. No es decoración: es
 *  el eje con el que hay que desempatar cuando dos variantes se ven parecido. */
const LAYER_STYLE: Record<Layer, { light: string; dark: string }> = {
  CSS: {
    light: "bg-cta-deep/10 text-cta-deep ring-cta-deep/25",
    dark: "bg-cta-lime/15 text-cta-lime ring-cta-lime/25",
  },
  JS: {
    light: "bg-amber-400/15 text-amber-700 ring-amber-600/25",
    dark: "bg-amber-400/15 text-amber-300 ring-amber-300/25",
  },
  GSAP: {
    light: "bg-fuchsia-400/15 text-fuchsia-700 ring-fuchsia-600/25",
    dark: "bg-fuchsia-400/15 text-fuchsia-300 ring-fuchsia-300/25",
  },
  WebGL: {
    light: "bg-sky-400/15 text-sky-700 ring-sky-600/25",
    dark: "bg-sky-400/15 text-sky-300 ring-sky-300/25",
  },
};

function StackChips({ stack, ground }: { stack: Layer[]; ground: Ground }) {
  return (
    <span className="flex flex-wrap items-center gap-1">
      {stack.map((layer) => (
        <span
          key={layer}
          className={`rounded-full px-2 py-0.5 text-caption ring-1 ring-inset ${
            LAYER_STYLE[layer][ground === "ink" ? "dark" : "light"]
          }`}
        >
          {layer}
        </span>
      ))}
    </span>
  );
}

/** La tarjeta común a las dos secciones: número, nombre, capas, el ejemplo en
 *  su contexto, la nota de criterio y dónde está el código. La referencia al
 *  archivo es literal a propósito — es lo que evita que la demo se
 *  desincronice de las fuentes. */
function Card({
  n,
  name,
  stack,
  note,
  source,
  ground,
  children,
}: {
  n: number;
  name: string;
  stack: Layer[];
  note: string;
  source: string;
  ground: Ground;
  children: ReactNode;
}) {
  const surface =
    ground === "ink" ? "border-white/10 bg-white/[0.035]" : "border-black/[0.08] bg-white";
  const muted = ground === "ink" ? "text-cream/55" : "text-gray-600";

  return (
    <article className={`flex flex-col overflow-hidden rounded-2xl border ${surface}`}>
      {/* `items-center` y no `items-start`: con cuatro chips de capa el grupo
          de la derecha puede pasar a dos líneas, y centrarlo mantiene el
          número y el nombre en la misma línea óptica que en las tarjetas de
          una sola capa. */}
      <header className="flex items-center gap-3 px-5 pt-4">
        <span className={`text-caption tabular-nums ${muted}`}>
          {String(n).padStart(2, "0")}
        </span>
        <h3 className="text-label">{name}</h3>
        <span className="ml-auto">
          <StackChips stack={stack} ground={ground} />
        </span>
      </header>

      <div className="px-5 py-5">{children}</div>

      <div className="mt-auto flex flex-col gap-2 px-5 pb-5">
        <p className={`text-body-sm text-pretty ${muted}`}>{note}</p>
        <code className={`text-caption-mono ${ground === "ink" ? "text-cream/35" : "text-gray-400"}`}>
          {source}
        </code>
      </div>
    </article>
  );
}

/** La barra del header, reconstruida. Los tabs no son relleno: son la razón por
 *  la que un hover demasiado grande en el CTA no funciona — hay cuatro
 *  etiquetas compitiendo a diez píxeles de distancia. */
function NavBar({ ground, children }: { ground: Ground; children: ReactNode }) {
  const bg = ground === "ink" ? "#16191a" : "#0a0a0a";
  return (
    <div
      // Los dos tonos reales del header: #0a0a0a sobre página clara y #16191a
      // sobre una sección oscura (ver `[data-q-surface]` en globals.css).
      //
      // El mismo valor va a `--hv-nav-bg`, que es lo que el anillo cónico (06)
      // usa para tapar el centro del gradiente. Sin esto, con la barra en su
      // tono claro el anillo dejaría un recuadro casi negro adentro.
      style={{ backgroundColor: bg, "--hv-nav-bg": bg } as React.CSSProperties}
      className="flex h-16 items-center justify-between gap-4 rounded-[20px] pl-5 pr-3"
    >
      <Image
        src="/prototype/v2/near-wordmark.svg"
        alt="NEAR"
        width={64}
        height={17}
        className="hidden h-[14px] w-auto brightness-0 invert sm:block"
      />
      <div className="hidden items-center gap-5 lg:flex">
        {["Products", "Stack"].map((t) => (
          <span key={t} className="text-eyebrow uppercase text-white/85">
            {t}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}

/** El plato del footer: cream o el negro del takeover, según el ground. */
function FooterPlate({ ground, children }: { ground: Ground; children: ReactNode }) {
  return (
    <div
      className="hv-links rounded-xl p-6"
      data-ground={ground === "ink" ? "dark" : "cream"}
      style={{ backgroundColor: ground === "ink" ? "#101010" : "#F5F4F1" }}
    >
      {children}
    </div>
  );
}

function Toggle<T extends string>({
  options,
  value,
  onChange,
  ground,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  ground: Ground;
}) {
  const shell = ground === "ink" ? "bg-white/[0.06]" : "bg-black/[0.05]";
  return (
    <div className={`inline-flex rounded-full p-1 ${shell}`}>
      {options.map((opt) => {
        const on = opt === value;
        const active = ground === "ink" ? "bg-cream text-ink" : "bg-ink text-cream";
        const idle = ground === "ink" ? "text-cream/65" : "text-gray-600";
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={on}
            className={`rounded-full px-3.5 py-1.5 text-caption transition-colors ${on ? active : idle}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/** Dónde vive cada variante. Las de CSS puro están enteras en su hoja; el resto
 *  reparte entre la hoja (el reposo) y el TSX (el gesto), y las de shader suman
 *  el fragment shader. */
function sourceOf(v: CtaVariant | LinkVariant, isCta: boolean, isPlus: boolean) {
  const sheet = isPlus ? "hoverLabPlus.css" : "hoverLab.css";
  const tsx = isCta
    ? isPlus
      ? "CtaVariantsPlus.tsx"
      : "CtaVariants.tsx"
    : isPlus
      ? "FooterLinkVariantsPlus.tsx"
      : "FooterLinkVariants.tsx";

  if (v.stack.includes("WebGL")) return `[data-v="${v.id}"] · ${tsx} + gl/shaders.ts`;
  if (v.stack.length === 1 && v.stack[0] === "CSS") return `[data-v="${v.id}"] · ${sheet}`;
  return `[data-v="${v.id}"] · ${tsx}`;
}

export default function HoverLabView() {
  const [filter, setFilter] = useState<Filter>("All");
  const [ground, setGround] = useState<Ground>("cream");

  const dark = ground === "ink";
  const keep = (v: CtaVariant | LinkVariant) => filter === "All" || v.stack.includes(filter);
  const ctas = ALL_CTA.filter(keep);
  const links = ALL_LINKS.filter(keep);

  return (
    <main
      className={`hv-root min-h-screen transition-colors duration-300 ${
        dark ? "bg-ink text-cream" : "bg-cream text-ink"
      }`}
    >
      {/* El filtro gooey y el gradiente SVG, una sola vez para toda la página. */}
      <HoverLabDefs />

      <div className="mx-auto w-full max-w-[1400px] px-6 pb-32 pt-[calc(var(--site-header-block)+3rem)] lg:px-12">
        <Link
          href="/prototype"
          className={`text-body-sm transition-colors ${
            dark ? "text-cream/55 hover:text-cream" : "text-gray-600 hover:text-ink"
          }`}
        >
          ← Prototype
        </Link>

        {/* Hero */}
        <header className="mt-10 flex max-w-3xl flex-col gap-5">
          <p className="text-eyebrow uppercase opacity-60">Demo · Interaction study</p>
          <h1 className="text-h1 text-pretty">Hover lab</h1>
          <p className="text-body-lg text-pretty opacity-80">
            {ALL_CTA.length} hover treatments for the header CTA and{" "}
            {ALL_LINKS.length} for the footer links, each one in its real
            context: the black bar with its tabs, and the footer column in both
            of its palettes. They run from a single CSS rule to a fragment
            shader, and every card says when it is worth climbing a step.
          </p>
          <p className={`text-body-sm text-pretty ${dark ? "text-cream/55" : "text-gray-600"}`}>
            This is a sandbox.{" "}
            <code className="text-caption-mono">SiteHeader</code> and{" "}
            <code className="text-caption-mono">SiteFooter</code> are
            untouched — the header and footer you see above and below this page
            are the production ones. Everything here lives in{" "}
            <code className="text-caption-mono">components/views/hover-lab/</code>.
          </p>
        </header>

        {/* Controles. Sticky porque la página es larga y el switch de ground es
            justamente lo que hay que poder tocar mientras se mira una variante
            concreta, sin volver arriba. */}
        <div
          className={`sticky top-[calc(var(--site-header-block)+0.5rem)] z-20 -mx-2 mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl px-4 py-3 backdrop-blur ${
            dark ? "bg-ink/80" : "bg-cream/85"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-caption uppercase opacity-50">Layer</span>
            <Toggle
              options={["All", ...LAYERS] as const}
              value={filter}
              onChange={setFilter}
              ground={ground}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-caption uppercase opacity-50">Ground</span>
            <Toggle
              options={["cream", "ink"] as const}
              value={ground}
              onChange={setGround}
              ground={ground}
            />
          </div>
          <p className={`text-caption ${dark ? "text-cream/45" : "text-gray-500"}`}>
            {ctas.length + links.length} variants shown
          </p>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="mt-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 text-pretty">Header CTA</h2>
            <p className={`max-w-3xl text-body text-pretty ${dark ? "text-cream/70" : "text-gray-700"}`}>
              The button lives in a 64px bar, right next to the tabs and the
              hamburger. Three criteria to pick one: it has to read in both bar
              tones, it must not compete with the tabs, and its width must not
              change — the bar is a flex layout, so any change in width shoves
              the hamburger sideways.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {ctas.map((v) => (
              <Card
                key={v.id}
                // El número sale del catálogo y no del índice del map:
                // filtrando por capa, la 34 sigue siendo la 34.
                n={ALL_CTA.indexOf(v) + 1}
                name={v.name}
                stack={v.stack}
                note={v.note}
                source={sourceOf(v, true, CTA_VARIANTS_PLUS.includes(v))}
                ground={ground}
              >
                <NavBar ground={ground}>
                  <v.Comp />
                </NavBar>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Footer links ──────────────────────────────────────────────── */}
        <section className="mt-24">
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 text-pretty">Footer links</h2>
            <p className={`max-w-3xl text-body text-pretty ${dark ? "text-cream/70" : "text-gray-700"}`}>
              A different problem: the job is not to draw attention, it is to be
              picked out of nine identical siblings. Anything that moves the box
              makes the column shudder as the pointer cuts across it, and the
              real footer exists in two palettes — cream on black in the desktop
              takeover, ink on cream on mobile — so no variant can depend on a
              fixed colour. They all read{" "}
              <code className="text-caption-mono">--hv-fg</code> /{" "}
              <code className="text-caption-mono">--hv-dim</code>: the
              ground switch changes the ground, not the variants.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {links.map((v) => (
              <Card
                key={v.id}
                n={ALL_LINKS.indexOf(v) + 1}
                name={v.name}
                stack={v.stack}
                note={v.note}
                source={sourceOf(v, false, LINK_VARIANTS_PLUS.includes(v))}
                ground={ground}
              >
                <FooterPlate ground={ground}>
                  <v.Comp />
                </FooterPlate>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Las notas que no caben en una tarjeta ─────────────────────── */}
        <section className="mt-24 grid gap-6 lg:grid-cols-2">
          <div
            className={`rounded-2xl border p-8 ${
              dark ? "border-white/10 bg-white/[0.035]" : "border-black/[0.08] bg-white"
            }`}
          >
            <h2 className="text-h3 text-pretty">The ten shader variants share one context</h2>
            <div
              className={`mt-5 flex flex-col gap-3 text-body-sm text-pretty ${
                dark ? "text-cream/70" : "text-gray-700"
              }`}
            >
              <p>
                Browsers allow 16 live WebGL contexts per browser and{" "}
                <strong>8 per origin</strong> on desktop (8 on Android). Going
                over doesn&rsquo;t fail visibly: the browser kills the oldest
                context, so the page degrades at random depending on where
                you&rsquo;ve scrolled.
              </p>
              <p>
                The fix isn&rsquo;t managing ten contexts better, it&rsquo;s not
                needing them. There is <strong>one</strong> pointer, so there is
                at most one effect running:{" "}
                <code className="text-caption-mono">gl/sharedGL.ts</code>{" "}
                keeps a single canvas and reparents it to the hovered element,
                switching programs. Shaders stay compiled and cached; at rest
                there is no canvas in the DOM and no callback on the ticker.
              </p>
              <p>
                The colours aren&rsquo;t in the GLSL either: they come from{" "}
                <code className="text-caption-mono">--cta-lime</code> and
                friends, read off <code className="text-caption-mono">:root</code>.
                A hex pasted into a shader would be a second source of truth for
                the palette.
              </p>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-8 ${
              dark ? "border-white/10 bg-white/[0.035]" : "border-black/[0.08] bg-white"
            }`}
          >
            <h2 className="text-h3 text-pretty">When one wins</h2>
            <ol
              className={`mt-5 flex list-decimal flex-col gap-3 pl-5 text-body-sm text-pretty ${
                dark ? "text-cream/70" : "text-gray-700"
              }`}
            >
              <li>
                If it&rsquo;s CSS only, its rule moves to{" "}
                <code className="text-caption-mono">app/globals.css</code>{" "}
                next to the other{" "}
                <code className="text-caption-mono">[data-q-cta-*]</code>{" "}
                and the button in{" "}
                <code className="text-caption-mono">SiteHeader</code>{" "}
                swaps one attribute. That&rsquo;s the whole port.
              </li>
              <li>
                With JS or GSAP, the CTA stops being a bare{" "}
                <code className="text-caption-mono">{"<a>"}</code> and
                becomes a component in{" "}
                <code className="text-caption-mono">components/site/</code>
                . The header is already a client component, so nothing changes
                there.
              </li>
              <li>
                With WebGL there&rsquo;s one more decision: <em>who</em> owns
                the context. On the real site the header is on every page, so
                the runtime would have to live in the layout, not in the button.
              </li>
              <li>
                Reduced motion isn&rsquo;t optional: the end state still has to
                arrive, just without the journey. CSS handles it with the media
                query at the bottom of each sheet, GSAP with{" "}
                <code className="text-caption-mono">gsap.matchMedia()</code>
                , and the shader by freezing{" "}
                <code className="text-caption-mono">uTime</code>.
              </li>
              <li>
                Footer links get applied in{" "}
                <code className="text-caption-mono">LinkColumns</code>,
                which already takes{" "}
                <code className="text-caption-mono">dark</code> and is the
                one place{" "}
                <code className="text-caption-mono">linkClass</code> is
                defined.
              </li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
