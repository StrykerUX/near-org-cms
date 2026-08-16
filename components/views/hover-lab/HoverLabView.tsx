"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CTA_VARIANTS, type Tech } from "./CtaVariants";
import { LINK_VARIANTS } from "./FooterLinkVariants";
import "./hoverLab.css";

// La página del hover lab: 27 tratamientos para el CTA del header y 16 para
// los links del footer, cada uno en su contexto real y comparables lado a lado.
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
// Nada de acá toca los componentes del sitio. Ver la cabecera de hoverLab.css.

const TECHS: Tech[] = ["CSS", "CSS + JS", "JS", "GSAP"];

type Filter = "Todo" | Tech;
type Ground = "cream" | "ink";

/** El chip de tecnología. El color no es decorativo: ordena de más barato
 *  (CSS) a más caro (GSAP), que es el eje con el que hay que elegir cuando dos
 *  variantes se ven parecido. */
const TECH_STYLE: Record<Tech, string> = {
  CSS: "bg-cta-lime/20 text-cta-deep ring-cta-deep/25",
  "CSS + JS": "bg-cta-mint/20 text-cta-deep ring-cta-deep/25",
  JS: "bg-amber-400/15 text-amber-700 ring-amber-600/25",
  GSAP: "bg-fuchsia-400/15 text-fuchsia-700 ring-fuchsia-600/25",
};

const TECH_STYLE_DARK: Record<Tech, string> = {
  CSS: "bg-cta-lime/15 text-cta-lime ring-cta-lime/25",
  "CSS + JS": "bg-cta-mint/15 text-cta-mint ring-cta-mint/25",
  JS: "bg-amber-400/15 text-amber-300 ring-amber-300/25",
  GSAP: "bg-fuchsia-400/15 text-fuchsia-300 ring-fuchsia-300/25",
};

function TechChip({ tech, ground }: { tech: Tech; ground: Ground }) {
  const style = ground === "ink" ? TECH_STYLE_DARK[tech] : TECH_STYLE[tech];
  return (
    <span className={`rounded-full px-2 py-0.5 text-caption ring-1 ring-inset ${style}`}>
      {tech}
    </span>
  );
}

/** La tarjeta común a las dos secciones: número, nombre, chip, el ejemplo en su
 *  contexto, la nota de criterio y el selector con el que encontrarlo en el
 *  código. El selector es literal a propósito — es la única forma de que la
 *  demo no se desincronice de los archivos. */
function Card({
  n,
  name,
  tech,
  note,
  selector,
  ground,
  children,
}: {
  n: number;
  name: string;
  tech: Tech;
  note: string;
  selector: string;
  ground: Ground;
  children: ReactNode;
}) {
  const surface =
    ground === "ink"
      ? "border-white/10 bg-white/[0.035]"
      : "border-black/[0.08] bg-white";
  const muted = ground === "ink" ? "text-cream/55" : "text-gray-600";

  return (
    <article className={`flex flex-col overflow-hidden rounded-2xl border ${surface}`}>
      <header className="flex items-center gap-3 px-5 pt-4">
        <span className={`text-caption tabular-nums ${muted}`}>
          {String(n).padStart(2, "0")}
        </span>
        <h3 className="text-label">{name}</h3>
        <span className="ml-auto">
          <TechChip tech={tech} ground={ground} />
        </span>
      </header>

      <div className="px-5 py-5">{children}</div>

      <div className="mt-auto flex flex-col gap-2 px-5 pb-5">
        <p className={`text-body-sm text-pretty ${muted}`}>{note}</p>
        <code className={`font-mono text-caption ${ground === "ink" ? "text-cream/35" : "text-gray-400"}`}>
          {selector}
        </code>
      </div>
    </article>
  );
}

/** La barra del header, reconstruida. Los tabs no son relleno: son la razón por
 *  la que un hover demasiado grande en el CTA no funciona — hay cuatro
 *  etiquetas compitiendo a diez píxeles de distancia. */
function NavBar({ ground, children }: { ground: Ground; children: ReactNode }) {
  return (
    <div
      // Los dos tonos reales del header: #0a0a0a sobre página clara y #16191a
      // sobre una sección oscura (ver `[data-q-surface]` en globals.css).
      //
      // El mismo valor va a `--hv-nav-bg`, que es lo que el anillo cónico (06)
      // usa para tapar el centro del gradiente. Sin esto, con la barra en su
      // tono claro el anillo dejaría un recuadro casi negro adentro.
      style={
        {
          backgroundColor: ground === "ink" ? "#16191a" : "#0a0a0a",
          "--hv-nav-bg": ground === "ink" ? "#16191a" : "#0a0a0a",
        } as React.CSSProperties
      }
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
        const active =
          ground === "ink" ? "bg-cream text-ink" : "bg-ink text-cream";
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

export default function HoverLabView() {
  const [filter, setFilter] = useState<Filter>("Todo");
  const [ground, setGround] = useState<Ground>("cream");

  const dark = ground === "ink";
  const ctas = CTA_VARIANTS.filter((v) => filter === "Todo" || v.tech === filter);
  const links = LINK_VARIANTS.filter((v) => filter === "Todo" || v.tech === filter);

  return (
    <main
      className={`hv-root min-h-screen transition-colors duration-300 ${
        dark ? "bg-ink text-cream" : "bg-cream text-ink"
      }`}
    >
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
            {CTA_VARIANTS.length} tratamientos de hover para el CTA del header y{" "}
            {LINK_VARIANTS.length} para los links del footer, cada uno en su
            contexto real: la barra negra con sus tabs, y la columna del footer
            en sus dos paletas.
          </p>
          <p className={`text-body-sm text-pretty ${dark ? "text-cream/55" : "text-gray-600"}`}>
            Es una demo aislada.{" "}
            <code className="font-mono text-caption">SiteHeader</code> y{" "}
            <code className="font-mono text-caption">SiteFooter</code> siguen
            exactamente como estaban — el header y el footer que se ven arriba y
            abajo de esta página son los de producción, sin tocar. Todo lo de
            acá vive en{" "}
            <code className="font-mono text-caption">components/views/hover-lab/</code>.
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
            <span className="text-caption uppercase opacity-50">Técnica</span>
            <Toggle
              options={["Todo", ...TECHS] as const}
              value={filter}
              onChange={setFilter}
              ground={ground}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-caption uppercase opacity-50">Fondo</span>
            <Toggle
              options={["cream", "ink"] as const}
              value={ground}
              onChange={setGround}
              ground={ground}
            />
          </div>
          <p className={`text-caption ${dark ? "text-cream/45" : "text-gray-500"}`}>
            {ctas.length + links.length} variantes visibles
          </p>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="mt-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 text-pretty">CTA del header</h2>
            <p className={`max-w-3xl text-body text-pretty ${dark ? "text-cream/70" : "text-gray-700"}`}>
              El botón vive en una barra de 64px, pegado a los tabs y a la
              hamburguesa. Los tres criterios para elegir: que se lea en los dos
              tonos de barra, que no compita con los tabs, y que el ancho no
              cambie — la barra es un layout flex y cualquier variación de ancho
              corre a la hamburguesa de al lado.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {ctas.map((v) => (
              <Card
                key={v.id}
                n={CTA_VARIANTS.indexOf(v) + 1}
                name={v.name}
                tech={v.tech}
                note={v.note}
                selector={
                  v.tech === "CSS"
                    ? `[data-v="${v.id}"] · hoverLab.css`
                    : `[data-v="${v.id}"] · CtaVariants.tsx`
                }
                ground={ground}
              >
                {/* El número de la tarjeta sale del catálogo y no del índice
                    del map: filtrando por técnica, la 23 sigue siendo la 23. */}
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
            <h2 className="text-h2 text-pretty">Links del footer</h2>
            <p className={`max-w-3xl text-body text-pretty ${dark ? "text-cream/70" : "text-gray-700"}`}>
              Otro problema: no hay que llamar la atención, hay que dejarse
              elegir entre nueve iguales. Todo lo que mueva la caja hace temblar
              la columna cuando el puntero la recorre en diagonal, y el footer
              real existe en dos paletas — cream sobre negro en el takeover de
              desktop, tinta sobre cream en mobile — así que ninguna variante
              puede depender de un color fijo. Todas leen{" "}
              <code className="font-mono text-caption">--hv-fg</code> /{" "}
              <code className="font-mono text-caption">--hv-dim</code>: el
              switch de fondo cambia el ground, no las variantes.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {links.map((v) => (
              <Card
                key={v.id}
                n={LINK_VARIANTS.indexOf(v) + 1}
                name={v.name}
                tech={v.tech}
                note={v.note}
                selector={
                  v.tech === "CSS"
                    ? `[data-v="${v.id}"] · hoverLab.css`
                    : `[data-v="${v.id}"] · FooterLinkVariants.tsx`
                }
                ground={ground}
              >
                <FooterPlate ground={ground}>
                  <v.Comp />
                </FooterPlate>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Cómo portar la que gane ───────────────────────────────────── */}
        <section
          className={`mt-24 rounded-2xl border p-8 ${
            dark ? "border-white/10 bg-white/[0.035]" : "border-black/[0.08] bg-white"
          }`}
        >
          <h2 className="text-h3 text-pretty">Cuando una gane</h2>
          <ol
            className={`mt-5 flex list-decimal flex-col gap-3 pl-5 text-body-sm text-pretty ${
              dark ? "text-cream/70" : "text-gray-700"
            }`}
          >
            <li>
              Si es CSS puro, su regla se muda a{" "}
              <code className="font-mono text-caption">app/globals.css</code>{" "}
              junto a las otras{" "}
              <code className="font-mono text-caption">[data-q-cta-*]</code>, y
              el botón de{" "}
              <code className="font-mono text-caption">SiteHeader</code> cambia
              de atributo. Nada más.
            </li>
            <li>
              Si trae JS o GSAP, el CTA deja de ser un{" "}
              <code className="font-mono text-caption">{"<a>"}</code> suelto y
              pasa a ser un componente propio en{" "}
              <code className="font-mono text-caption">components/site/</code>.
              El header ya es cliente, así que no cambia nada de eso.
            </li>
            <li>
              Reduced motion no es opcional: el estado final tiene que llegar
              igual, sin recorrido. Las de CSS lo resuelven con la media query
              del final de{" "}
              <code className="font-mono text-caption">hoverLab.css</code>, las
              de GSAP con{" "}
              <code className="font-mono text-caption">gsap.matchMedia()</code>.
            </li>
            <li>
              Los links del footer se aplican en{" "}
              <code className="font-mono text-caption">LinkColumns</code>, que
              ya recibe <code className="font-mono text-caption">dark</code> y
              es el único lugar donde se define{" "}
              <code className="font-mono text-caption">linkClass</code>.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
