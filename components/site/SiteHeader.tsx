"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IconInterface, IconIntents, IconAgents,
  IconLayers, IconAbstraction, IconQuantum,
  IconDocs, IconSolutions,
  IconResearch, IconBlog, IconAnalytics,
  IconBrand, IconContact, IconCareers,
  IconHistory, IconRoadmap, IconEconomics,
  IconFoundation, IconCommunity, IconGovernance,
} from "@/components/site/navIcons";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// El header del sitio. UNO solo, montado por los layouts (`app/(site)/layout.tsx`
// y `app/prototype/layout.tsx`) — ninguna página ni view lo importa.
//
// Vive en `components/site/` y no en `components/sections/` a propósito: el
// allowlist de imports de `components/sections/**` prohíbe importar
// `@/components/site/*` porque el chrome compartido se compone desde afuera.
// Un header que montan los layouts es chrome, no una sección.
//
// Nació como `sections/quantum/NavPillQuantum.tsx`, montado a mano por cada
// view. Esa era la razón de que `/`, `/brand` y `/prototype/components`
// quedaran sin header: no había forma de olvidarse de importarlo salvo
// olvidándose, y tres páginas se olvidaron.
//
// El gesto de retracción viene del original (`effects.js` / NearFx).

// Order is deliberate and not alphabetical: Developers first because it is the
// most-used, About last because it is the least. Every one of them is a
// dropdown, hence the chevron on each.
// The site's real menu, transcribed from the Navigation tab of
// "near.org - sitemap" (Google Doc, owner hector.martinez@nearsp.com).
//
// Two shapes live here on purpose. Products and Stack are FLAT — a single list
// of destinations. Resources and About are GROUPED, with a labelled column per
// group. That is not decoration: it is why the panel is a grid whose column
// count comes from the data rather than a fixed number.
//
// Los `href` salen del sitemap de near.org (Figma 0_2026_NEAR_Website, nodo
// 247-64). Hasta que existieron los destinos esto era `"#"` fijo, con el
// criterio de que un link equivocado es peor que un placeholder obvio.
//
// Un `href` que empieza con `http` se trata como externo y se abre en pestaña
// nueva. Se detecta por el valor y no con una bandera aparte: dos fuentes para
// el mismo hecho es como se llega a un link externo sin `rel="noopener"`.
export type Leaf = {
  label: string;
  desc: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const isExternal = (href: string) => href.startsWith("http");

/**
 * Un link del menú, que elige solo entre `next/link` y `<a>`.
 *
 * Los internos TIENEN que ir por `Link` o cada entrada del menú provoca una
 * carga completa de la página en vez de una navegación de cliente — el linter de
 * Next lo marca, pero solo en los `href` que son literales, así que los que
 * salen de `LINKS` pasaban sin que nadie se enterara.
 *
 * Los externos no pueden ir por `Link` (no hay ruta que prefetchear) y llevan
 * `rel="noopener noreferrer"`, que con `target="_blank"` no es opcional: sin él
 * la página destino recibe una referencia a esta por `window.opener`.
 */
export function NavLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
export type Group = { label: string; items: Leaf[] };
// `hero` is the isometric still shown beside the menu — the same art family
// as the Beyond-accounts cards, black-ground with one lit element, which is
// why it sits on the dark panel without a seam.
export type Entry = { label: string; hero: string; items?: Leaf[]; groups?: Group[] };

/** One labelled column of menu entries, each with its icon slot. */
export function NavGroup({ group }: { group: Group }) {
  return (
    <div className="flex flex-col gap-1">
      {group.label && (
        // Sentence case, not the uppercase eyebrow used on the bar: in the
        // reference the group label is quieter than the items it heads, and
        // uppercasing it makes it compete with them.
        <p className="mb-1 px-3 text-body-sm text-white/45">{group.label}</p>
      )}
      {group.items.map((item) => (
        <NavLink
          key={item.label}
          href={item.href}
          className="group/item flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.09]"
        >
          {/* Badge hover goes to the panel's own background (--q-nav-bg)
              instead of inverting to solid white — the icon is already
              white at rest, so a dark-on-dark badge keeps it legible
              without needing a text-color flip. */}
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.06] text-white transition-colors duration-200 group-hover/item:bg-[var(--q-nav-bg)]"
          >
            <item.icon className="size-5" />
          </span>
          {/* `min-w-0` + no `whitespace-nowrap`: Resources/About's columns can
              get narrower than a label/description's natural width once the
              panel has to shrink with a narrow viewport (see NavPanel below)
              — this lets them wrap instead of overflowing the column. */}
          <span className="flex min-w-0 flex-col">
            <span className="text-label uppercase text-white">{item.label}</span>
            <span className="text-caption text-white/55">{item.desc}</span>
          </span>
        </NavLink>
      ))}
    </div>
  );
}

// The isometric stills are 500x500 with an alpha channel (the earlier set
// was opaque, baked onto the same cream the panel used to sit on) —
// `bg-[var(--q-nav-bg)]` matches the dark panel instead of a cream patch
// showing through, and `object-contain` shows the whole square undistorted
// instead of `object-cover` cropping it into a landscape box.
function HeroImage({ hero, className }: { hero: string; className: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-[var(--q-nav-bg)] ${className}`}>
      <Image src={hero} alt="" width={500} height={500} sizes="240px" className="h-full w-full object-contain" />
    </div>
  );
}

// The dropdown box (`data-q-surface`, rendered where this is used) has no
// width of its own — it fills whatever its wrapper gives it. `min(Npx,100%)`
// is what keeps it at its natural size while the nav has room to spare, and
// only shrinks it once the nav (which the wrapper is now pinned to) gets
// narrower than that.
export function panelWidth(link: Entry): string {
  const groups = link.groups ?? [];
  if (groups.length >= 3) return "w-[min(1199px,100%)]";
  if (groups.length === 2) return "w-[min(1004px,100%)]";
  return "w-[min(720px,100%)]";
}

/** The body of one menu. Rendered for every entry; only one is visible. */
export function NavPanel({ link }: { link: Entry }) {
  const groups = link.groups ?? [{ label: "", items: link.items ?? [] }];

  // Resources (3 groups) and About (2 groups) used to fall into the same
  // single 2-column grid as Products/Stack (1 group) — colA took the first
  // two groups, colB led with the hero and picked up the rest, which left
  // Resources' 3rd group (Connect) squeezed into the hero's own 268px
  // column instead of getting its own room. Every group gets its own column
  // now, all in one row, and the hero is a separate flex item pinned to the
  // box's right edge. `repeat(auto-fit,minmax(...))` is what makes that
  // survive `panelWidth` shrinking the box on a narrow viewport: columns
  // hold their target width while there's room for all of them side by
  // side, then drop to fewer per row — stacking, not overflowing — once
  // there isn't.
  if (groups.length > 1) {
    return (
      <div className="flex w-full flex-wrap items-start gap-x-8 gap-y-7 p-6">
        <div className="grid min-w-0 flex-1 content-start gap-x-8 gap-y-7 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {groups.map((g, i) => (
            <NavGroup key={g.label || `g${i}`} group={g} />
          ))}
        </div>
        <HeroImage hero={link.hero} className="h-[184px] w-[268px] shrink-0" />
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-[1fr_268px] content-start items-start gap-x-8 gap-y-7 p-6">
      <NavGroup group={groups[0]} />
      <HeroImage hero={link.hero} className="h-[184px] w-full" />
    </div>
  );
}

/**
 * El menú de teléfono: un acordeón sobre las MISMAS cuatro entradas de `LINKS`.
 *
 * Existe porque la barra esconde los tabs bajo `md` y no dejaba nada navegable
 * —el header viejo del blog sí tenía hamburguesa, así que sin esto el cambio
 * habría sido una regresión en teléfono.
 *
 * El `hero` de cada entrada no se dibuja: es un PNG de ~150KB para un ancho
 * donde no entra.
 */
export function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1 px-2 pb-6">
      {LINKS.map((link) => {
        const groups = link.groups ?? [{ label: "", items: link.items ?? [] }];
        const isOpen = open === link.label;
        return (
          <div key={link.label} className="border-b border-white/10 last:border-b-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : link.label)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-3 py-4 text-eyebrow uppercase text-white"
            >
              {link.label}
              <ChevronDown
                aria-hidden="true"
                className={`size-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* `grid-template-rows: 0fr → 1fr` y no `height: auto`: es la misma
                técnica que usa OwnYourOwn para expandir sin medir en JS. */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-4 pb-4">
                  {groups.map((group, i) => (
                    <div key={group.label || `g${i}`} className="flex flex-col gap-1">
                      {group.label && (
                        <p className="mb-1 px-3 text-body-sm text-white/45">{group.label}</p>
                      )}
                      {group.items.map((item) => (
                        <NavLink
                          key={item.label}
                          href={item.href}
                          onClick={onNavigate}
                          className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 active:bg-white/[0.09]"
                        >
                          <span
                            aria-hidden="true"
                            className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.06] text-white"
                          >
                            <item.icon className="size-5" />
                          </span>
                          <span className="flex flex-col">
                            <span className="text-label uppercase text-white">{item.label}</span>
                            <span className="text-caption text-white/55">{item.desc}</span>
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// La copy del menú vive acá y NO en `quantumContent.ts`, que es la regla del resto de la
// sección. La excepción tiene motivo: cada entrada lleva su `icon`, que es un componente
// de React, y ese módulo es de datos puros —strings y arrays, sin JSX— justamente para
// que el día que la copy venga de la base de datos la forma no cambie. Un árbol de
// componentes no puede cumplir eso.
//
// Al integrar, esto reemplazó a `quantumContent.NAV_LINKS`, que era la lista plana de
// cuatro etiquetas del nav viejo y quedó sin consumidores.
export const LINKS: Entry[] = [
  {
    label: "Products",
    hero: "/prototype/quantum/menu-tab-1.png",
    items: [
      { label: "near.com", href: "https://near.com", desc: "One interface, 30+ chains, confidential by default", icon: IconInterface },
      { label: "Intents", href: "https://intents.near.org", desc: "The universal liquidity layer for onchain markets", icon: IconIntents },
      { label: "NEAR AI", href: "https://near.ai", desc: "Confidential, verifiable inference and agents", icon: IconAgents },
    ],
  },
  {
    label: "Stack",
    hero: "/prototype/quantum/menu-tab-2.png",
    items: [
      { label: "Protocol", href: "/blockchain", desc: "The settlement layer for the agent economy", icon: IconLayers },
      { label: "Chain Abstraction", href: "/chain-abstraction", desc: "How NEAR connects any chain", icon: IconAbstraction },
      { label: "Quantum Security", href: "/quantum-security", desc: "Quantum-adaptable from day one", icon: IconQuantum },
    ],
  },
  {
    label: "Resources",
    hero: "/prototype/quantum/menu-tab-3.png",
    groups: [
      {
        label: "Build",
        items: [
          { label: "Docs", href: "https://docs.near.org/", desc: "Build on NEAR", icon: IconDocs },
          { label: "Solutions", href: "/solutions", desc: "Explore use cases", icon: IconSolutions },
        ],
      },
      {
        label: "Learn",
        items: [
          { label: "Research", href: "/research", desc: "White paper and protocol work", icon: IconResearch },
          { label: "Blog", href: "/blog", desc: "News and deep dives", icon: IconBlog },
          { label: "Analytics", href: "/analytics", desc: "Live onchain metrics", icon: IconAnalytics },
        ],
      },
      {
        label: "Connect",
        items: [
          { label: "Brand", href: "/brand", desc: "Logos and guidelines", icon: IconBrand },
          { label: "Contact", href: "/contact-us", desc: "Connect with the team", icon: IconContact },
          { label: "Careers", href: "https://job-boards.eu.greenhouse.io/nearfoundation", desc: "Build the agent economy", icon: IconCareers },
        ],
      },
    ],
  },
  {
    label: "About",
    hero: "/prototype/quantum/menu-tab-4.png",
    groups: [
      {
        label: "Fundamentals",
        items: [
          { label: "History", href: "/about", desc: "From 2017 to now", icon: IconHistory },
          { label: "Roadmap", href: "https://roadmap.near.org/", desc: "What ships next", icon: IconRoadmap },
          { label: "Economics", href: "/economics", desc: "Revenue, buybacks, supply", icon: IconEconomics },
        ],
      },
      {
        label: "Ecosystem",
        items: [
          { label: "NEAR Foundation", href: "/near-foundation", desc: "Supporting a decentralized ecosystem", icon: IconFoundation },
          { label: "Community", href: "/community", desc: "Validators, builders, Legion, and events", icon: IconCommunity },
          { label: "Governance", href: "https://houseofstake.org/", desc: "House of Stake", icon: IconGovernance },
        ],
      },
    ],
  },
];

// Extra clearance below the pill as it retracts, so no edge stays peeking.
const HIDE_MARGIN = 12;

// Where the pill's middle sits, as a percentage of viewport height. It is fixed
// at `top-6` with ~50px of pill, so its centre lands around 5% down. This is what
// decides which section the ink flip reads: the tone has to change when the pill
// crosses the boundary, not when the section's own midpoint does.
const PILL_BAND = 5;

export default function SiteHeader() {
  const [active, setActive] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const prev = useRef<string | null>(null);
  const shownPrev = useRef<string | null>(null);

  // Los cuatro paneles no se montan hasta la primera apertura. Cada uno trae su
  // PNG isométrico, y los tres distintos suman ~450KB que hasta ahora pagaban
  // solo las páginas de prototipo; como header global los pagaría también cada
  // post del blog, que es donde menos se justifica.
  //
  // `visibility: hidden` no evita la descarga —el navegador baja igual toda
  // imagen con caja— así que ocultarlos no alcanzaba: hay que no renderizarlos.
  // Una vez abierto el menú quedan los cuatro montados, así que el cross-fade
  // entre menús (que necesita a los cuatro en el DOM a la vez) no cambia.
  const [hasOpened, setHasOpened] = useState(false);

  // Menú de teléfono. Estado propio y no derivado de `active`: son dos gestos
  // distintos (hover sobre un tab / tap en la hamburguesa) y compartir el
  // estado haría que abrir uno cerrara el otro al cruzar el breakpoint.
  const [mobileOpen, setMobileOpen] = useState(false);

  // Escape para cerrar, y el scroll del body bloqueado mientras está abierto.
  // El bloqueo es `overflow: hidden` sobre `<body>` y no `lenis.stop()` porque
  // el header lo montan los layouts y no siempre hay Lenis debajo: `/blog` lo
  // desactiva a propósito y `/prototype/components` nunca lo tuvo. El overflow
  // funciona en los tres casos.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    // Se guarda el valor previo en vez de asumir "" — el layout de admin y el
    // modal de contacto también tocan esta propiedad, y pisarla a ciegas
    // desbloquearía un scroll que otro tenía bloqueado.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // How much of its final height the panel is cut on at, and shrunk to before
  // being cut off. One constant for both so opening and closing are mirror
  // images rather than two numbers that drift apart.
  const OPEN_FROM = 0.8;

  // How far left of the Products tab the pointer may stray before the menu
  // closes. Only enough to absorb an overshoot — past that the pointer is
  // heading for the logo or the empty middle of the bar, not the menu.
  const LEFT_SLACK = 50;

  // `active` is INTENT (which tab the pointer is on); `shown` is what is
  // actually rendered. They differ during a close: the content has to stay
  // mounted while the box shrinks, or the panel empties on the first frame and
  // the shrink plays over a blank box — which reads as an instant cut even
  // though the height really is animating.
  const [shown, setShown] = useState<string | null>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const was = prev.current;
    prev.current = active;

    if (active) {
      setShown(active);
      return;
    }
    if (!was || !box) return;

    gsap.killTweensOf(box);
    const from = box.offsetHeight;
    gsap
      .timeline()
      .to(box, { height: from * OPEN_FROM, duration: 0.13, ease: "none" })
      .set(box, { autoAlpha: 0 })
      .call(() => setShown(null));
  }, [active]);

  // Height morph. Runs off `shown`, so it only fires once the new content is
  // committed and can be measured.
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    // Reset on close, or the NEXT open sees a stale "was showing" and takes the
    // morph branch — animating from whatever height the last panel closed at
    // instead of cutting on at 80% and growing.
    if (!shown) {
      shownPrev.current = null;
      return;
    }
    const inner = box.firstElementChild as HTMLElement | null;
    if (!inner) return;

    const target = inner.offsetHeight;
    const wasShowing = shownPrev.current;
    shownPrev.current = shown;

    gsap.killTweensOf(box);

    if (!wasShowing) {
      // Opening is the close run backwards: it CUTS ON at 80% — already
      // opaque, already clipped — and grows in. No fade: a fade would obscure
      // the growth, which is the thing being shown.
      gsap.set(box, { height: target * OPEN_FROM, autoAlpha: 1 });
      // Slightly gentler overshoot than the menu-to-menu morph: this grows
      // from 80%, not from another panel's height, so the same value reads as
      // a much bigger kick.
      gsap.to(box, { height: target, duration: 0.32, ease: "back.out(0.6)" });
      return;
    }

    gsap.set(box, { autoAlpha: 1 });
    gsap.fromTo(
      box,
      { height: box.offsetHeight },
      { height: target, duration: 0.34, ease: "back.out(0.77)" }
    );
  }, [shown]);

  // ── 1:1 retraction with the gesture ────────────────────────────────────
  // Deps `[]` A PROPÓSITO, y esto es lo que lo separa del efecto de tono de más
  // abajo: la retracción no depende de la página. Volver a correrla en cada
  // navegación reiniciaría la posición de la píldora y re-registraría el
  // listener de `refresh`.
  const rootRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      // quickSetter and not gsap.to(): this runs on every scroll update, and a
      // tween per update would mean instantiating hundreds of objects a second
      // to write one property.
      //
      // `top` and NOT `y`. This looks like the wrong choice — transform is the
      // cheap property to animate — but a transform on this element makes it a
      // BACKDROP ROOT, and every `backdrop-filter` inside it then samples only
      // what is within this element rather than the page behind it. Since the
      // bar and all four dropdown panels live in here, animating `y` silently
      // reduced their blur to a no-op: the CSS was correct and did nothing.
      // Same trap applies to `will-change: transform`, which is why the root no
      // longer carries it.
      const setTop = gsap.quickSetter(scope, "top", "px") as (v: number) => void;

      // Hoisted out of the handler. Reading `offsetHeight` inside it forced a layout on
      // every scroll event — and immediately after writing `top`, which is the
      // read-after-write that makes it a forced synchronous reflow. Now that the
      // animated property is `top` rather than a transform, the write already touches
      // layout on its own, so keeping the read out of the handler matters MORE, not less.
      // The pill's height only changes when the viewport does, so it is measured
      // on refresh (which ScrollTrigger fires on resize) instead.
      let hidden = 0;
      const measureHeight = () => {
        hidden = -(scope.offsetHeight + HIDE_MARGIN);
      };
      measureHeight();
      ScrollTrigger.addEventListener("refresh", measureHeight);

      let last = 0;
      let offset = 0;

      // One ScrollTrigger over the whole document rather than a raw scroll
      // listener: it already batches into the shared ticker (so this write lands
      // in the same frame slot as every other GSAP write instead of interleaving
      // with them) and it already knows the scroll position without asking layout.
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          const delta = y - last;
          last = y;

          offset = Math.min(0, Math.max(hidden, offset - delta));
          // Always visible at the very top: without this, a negative scroll
          // bounce on iOS can leave it hidden at the top of the page.
          if (y <= 2) offset = 0;

          setTop(offset);
        },
      });
      last = st.scroll();

      return () => {
        ScrollTrigger.removeEventListener("refresh", measureHeight);
        setTop(0);
      };
    });

    return () => mm.revert();
  }, []);

  // ── ink over dark sections ─────────────────────────────────────────────
  //
  // Runs ALWAYS, reduced-motion included: this is not an animation, it is
  // legibility. Without it the near-black bar (#0a0a0a) sits invisible on the
  // `--ink-slate` section, and on the blog's #101010 hero.
  //
  // Fidelity note: the original has all of this wiring (the `data-nav-dark`
  // attribute on sections, the logo filter, the link colours) but its `apply()`
  // writes the light values down both branches, so the flip never actually
  // happens. It is restored here, because an attribute with no effect is
  // clearly a bug rather than a decision.
  //
  // ── Why ScrollTrigger and not a scroll listener ────────────────────────
  // This used to run `document.querySelectorAll("[data-nav-dark]")` plus one
  // getBoundingClientRect() per dark section on every animation frame of
  // scroll, to answer a question ScrollTrigger already tracks: is this band of
  // the viewport inside that element? One trigger per dark section with an
  // `onToggle` answers it with zero layout reads per frame, and it comes off
  // the same ticker Lenis is on.
  //
  // ── Por qué depende de `pathname` ──────────────────────────────────────
  // Las secciones oscuras son de la PÁGINA, no del header. Mientras el nav lo
  // montaba cada view, remontarlo al navegar rehacía esta consulta sola; ahora
  // que lo montan los layouts, el componente sobrevive a la navegación dentro
  // de `(site)` y de `/prototype`, así que hay que rehacerla a mano.
  //
  // Sin esto, entrar por una página sin secciones oscuras y navegar a una que
  // sí las tiene dejaba la barra en claro sobre fondo oscuro: se habían creado
  // cero triggers y nadie volvía a mirar.
  //
  // El `kill()` del cleanup NO es higiene, es la otra mitad del arreglo: sin él
  // esto pasa de un bug cosmético a una fuga real —un trigger más por sección
  // por navegación, cada uno reteniendo un nodo que ya salió del DOM.
  //
  // `useLayoutEffect` y no `useEffect` para que el tono quede aplicado antes
  // del primer paint de la página nueva; con `useEffect` se ve un frame de
  // barra clara antes de corregirse.
  const pathname = usePathname();

  useLayoutEffect(() => {
    const nav = rootRef.current?.querySelector<HTMLElement>("[data-nav]");
    if (!nav) return;

    // Se lee `isActive` de los triggers en vez de llevar un contador con los
    // deltas de `onToggle`. El contador funcionaba mientras esto corría una sola
    // vez por carga —siempre desde scroll 0, con todo inactivo— pero al rehacerse
    // en cada navegación arranca en 0 aunque el lector ya esté sobre una sección
    // oscura, y el primer `onToggle` que llegue lo dejaría en −1.
    //
    // De paso resuelve solo lo que el contador resolvía a mano: dos secciones
    // oscuras pueden solaparse sobre la banda de la píldora durante un relevo, y
    // `some()` sigue dando `dark` mientras cualquiera de las dos esté activa.
    const triggers: ScrollTrigger[] = [];
    const applyTone = () => {
      nav.dataset.tone = triggers.some((t) => t.isActive) ? "dark" : "light";
    };

    document.querySelectorAll<HTMLElement>("[data-nav-dark]").forEach((section) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          // The pill sits at the top of the viewport, so the band that matters
          // is a sliver at `top`. `PILL_BAND` is where its middle falls, as a
          // fraction of viewport height.
          start: `top ${PILL_BAND}%`,
          end: `bottom ${PILL_BAND}%`,
          onToggle: applyTone,
        })
      );
    });

    applyTone();

    return () => {
      triggers.forEach((t) => t.kill());
      // El tono vuelve a claro al desmontar: si la página siguiente no tiene
      // secciones oscuras, nadie lo escribiría y quedaría el valor de la
      // anterior pegado.
      nav.dataset.tone = "light";
    };
    // `rootRef` sale de un `useRef`, así que su identidad es estable y no
    // vuelve a disparar esto; va en la lista solo para no silenciar la regla.
  }, [pathname, rootRef]);

  return (
    // pointer-events-none on the wrapper and auto on the pill: the wrapper spans
    // the full viewport width and without this would swallow clicks meant for
    // whatever is underneath (the hero occupies that same band, and its canvas
    // listens for the pointer).
    <div
      ref={rootRef}
      data-q-nav
      // No `will-change: transform` here, even though the pill moves on every scroll
      // update: promoting this layer makes it a backdrop root and silently kills the
      // `backdrop-filter` on the bar and all four panels. Same reason the effect below
      // animates `top` and not `y`.
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      {/* Un div y no `<Container>`, que es lo que había: su escala `site` es
          `px-[60px]` FIJO en todos los breakpoints, y en un teléfono de 390px
          eso se come 120 — casi un tercio de la pantalla — dejando la barra tan
          angosta que "Get started" partía en dos líneas y se desbordaba.
          Container no tiene variante responsive de gutter y agregarle una
          afectaría a todas las secciones; el header es chrome y su respiro no
          tiene por qué ser el de una sección de contenido.

          El `max-w-[1240px]` de la barra sigue mandando en desktop, así que este
          padding solo actúa por debajo de ~1360px. */}
      <div className="mx-auto w-full max-w-[1780px] px-4 pt-6 sm:px-6 lg:px-[60px]">
        <nav
          onMouseLeave={() => setActive(null)}
          // The bar is wider than the tabs, so `onMouseLeave` alone leaves the
          // menu open while the pointer sits on the logo, the empty middle, or
          // Get started. Close once the pointer is past either end of the tab
          // range — 100px of slack on the left so a small overshoot off
          // Products does not snap it shut, and none on the right, where the
          // next thing along is the Get started button.
          onMouseMove={(e) => {
            const tabs = tabsRef.current;
            const box = boxRef.current;
            if (!tabs || !box || !active) return;
            const t = tabs.getBoundingClientRect();
            const p = box.getBoundingClientRect();
            // The live column: the tab range with its slack, UNIONED with the
            // open panel's own span. The panel is centred and much wider than
            // the tabs, so its left edge sits well left of Products — without
            // the union this rule fired while the pointer was inside the
            // dropdown, which is the one place it must never fire. Everything
            // in this column, from the top of the frame down, holds it open.
            const left = Math.min(t.left - LEFT_SLACK, p.left);
            const right = Math.max(t.right, p.right);
            if (e.clientX < left || e.clientX > right) setActive(null);
          }}
          data-nav
          data-q-surface
          data-tone="light"
          // No border: the frosted panel carries its own edge against the page.
          // Near-black rather than a light fill, so the type is light in both
          // states and the tone flip never has to swap it.
          // The alpha is high because the composite is what the eye judges, not
          // the declared colour: rgba(10,10,10) at 0.68 over the cream page
          // resolves to #555 — a mid grey. 0.9 lands it at #1f1f1f, which reads
          // as near-black while the blur still picks up what passes underneath.
          // The flip earns its keep by holding that appearance constant: the
          // same alpha over the `--ink-slate` section would be indistinguishable
          // from the ground, so that state eases off to keep an edge.
          // Shape: a rounded-corner bar, taking the card language from
          // BeyondAccounts / InTheNews rather than staying a pill.
          // The bar is ~53px tall, so its PILL radius is only ~26px — which is
          // why the cards' own rounded-3xl (24px) was never an option here: it
          // would have been a pill by another name. 14px is a little over half
          // of that, so the corner reads as a deliberate radius rather than as
          // a not-quite-pill.
          // `relative` is load-bearing: it makes the BAR the positioning
          // ancestor for the dropdown panels, which is what centres them on
          // the bar instead of under each trigger.
          className="group/nav pointer-events-auto relative mx-auto flex w-full max-w-[1240px] items-center justify-between gap-3 h-16 rounded-[var(--q-nav-radius)] pl-5 pr-2 transition-colors duration-300 text-white md:gap-10 md:pl-7 md:pr-3"
        >
          {/* The bar sits 24px below the top of the frame, and that strip is
              outside the nav — so moving up into it fired `onMouseLeave` and
              closed the menu. This is a descendant of the nav that reaches up
              to y=0, so the whole column above the bar counts as inside.
              `-top-6` mirrors the Container's `pt-6`; they have to move
              together. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -top-6 h-6"
          />

          <Link href="/" className="flex items-center">
            {/* The wordmark is a black SVG flipped to white with a filter, rather
                than shipping a second copy of the asset. The fluid height is
                inline — it is an image, not text, so no typographic scale role
                applies to it. */}
            <Image
              src="/prototype/v2/near-wordmark.svg"
              alt="NEAR"
              width={80}
              height={21}
              // Always inverted now: the wordmark asset is black and the pill
              // is charcoal in both states.
              className="block w-auto brightness-0 invert"
              style={{ height: "clamp(1rem, 0.92rem + 0.35vw, 1.3rem)" }}
              priority
            />
          </Link>

          <div className="flex items-center gap-2 self-stretch md:gap-10">
            <div ref={tabsRef} className="hidden items-center self-stretch md:flex">
              {LINKS.map((link) => (
                // The trigger is now just a label: there is ONE panel for the
                // whole bar (below), so moving between tabs morphs a single
                // container instead of cross-fading four independent ones.
                <div
                  key={link.label}
                  // `setHasOpened` acá y no en el efecto de `active`: es el
                  // gesto el que decide montar los paneles, y un setState
                  // dentro del efecto encadena un render de más por apertura.
                  onMouseEnter={() => {
                    setHasOpened(true);
                    setActive(link.label);
                  }}
                  className="group/menu flex items-center self-stretch px-4"
                >
                  {/* Un <button> y no un <a href="#">: esto abre un panel, no
                      navega a ningún lado, y como link mandaba al tope de la
                      página. El `onClick` además lo vuelve operable con teclado
                      — hasta ahora el menú solo se abría con el puntero. */}
                  <button
                    type="button"
                    aria-expanded={active === link.label}
                    onClick={() => setActive(active === link.label ? null : link.label)}
                    className="relative flex items-center gap-1 text-eyebrow uppercase text-white"
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1.5 left-0 right-0 h-px origin-left bg-[linear-gradient(90deg,var(--cta-lime),var(--cta-mint),var(--cta-deep))] transition-transform duration-300 ${
                        active === link.label ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* The reference's translucent glass chip: #d9d9d9 at 20% over the
                black bar, radius 8. This REPLACES the green travelling-gradient
                CTA — `[data-q-cta-sweep]` still exists in globals.css and is
                unused here, so the sweep can be restored without rewriting it. */}
            {/* Al mismo destino que la entrada near.com del menú: es el producto
                de entrada, y desde que vive en su propio dominio apuntar acá a
                `/nearcom` dejaba el CTA principal del sitio en una página vacía.
                El sitemap no fija el destino de este botón — si cambia, cambia
                junto con la entrada del menú. */}
            <a
              href="https://near.com"
              target="_blank"
              rel="noopener noreferrer"
              data-q-cta
              data-q-cta-sweep
              // En flujo normal en los dos breakpoints: pegado a la hamburguesa
              // en móvil (comparten el mismo grupo `flex ... gap-2`) y a los
              // tabs en desktop. Antes iba `absolute left-1/2 -translate-x-1/2`
              // en móvil para centrarlo en la barra entera — deliberado en su
              // momento, pero por feedback ahora debe ir junto al botón de
              // menú en vez de centrado.
              //
              // `whitespace-nowrap` es lo que arregla la rotura: la caja tiene
              // `h-10` fija, así que al partir "Get started" en dos líneas el
              // texto se desbordaba por arriba y por abajo del botón.
              className="inline-flex h-10 w-fit items-center gap-2 whitespace-nowrap rounded-[calc(var(--q-nav-radius)-var(--q-nav-pad)/2)] border border-transparent px-4 text-label md:px-5"
            >
              Get started
            </a>

            {/* Solo bajo `md`, que es donde los tabs de arriba se ocultan. */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="site-nav-mobile"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex size-10 items-center justify-center rounded-[calc(var(--q-nav-radius)-var(--q-nav-pad)/2)] text-white md:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* ONE panel for the whole bar. Positioned against the nav so it
              stays centred, and `top-full` keeps the 10px gap correct however
              tall the bar becomes. */}
          <div
            className={`absolute left-1/2 top-full z-50 w-full -translate-x-1/2 pt-2.5 ${
              active ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            {/* `w-full` above (not `w-max`) pins this to the nav's own width,
                and `panelWidth` below caps the box at whichever panel is
                `shown` (not `active` — the box stays mounted through the
                close morph, still showing the last panel, after `active`
                already went null) — same "natural size, only shrink once the
                nav is narrower than that" rule as HeaderNavPanelV2.tsx in
                the prototype this got ported from. */}
            <div
              ref={boxRef}
              data-q-surface
              style={{ opacity: 0, visibility: "hidden" }}
              className={`mx-auto overflow-hidden rounded-[var(--q-nav-radius)] shadow-[0_28px_70px_-14px_rgba(0,0,0,0.55)] ${
                shown ? panelWidth(LINKS.find((l) => l.label === shown)!) : ""
              }`}
            >
              {/* The active panel is the only one in flow; it defines the
                  height. The others sit absolutely on top at opacity 0, so the
                  swap is a cross-fade with nothing reflowing.

                  `hasOpened` los mantiene fuera del DOM hasta el primer hover
                  — ver el comentario de su declaración. */}
              <div className="relative">
                {hasOpened &&
                  LINKS.map((link) => (
                    <div
                      key={link.label}
                      aria-hidden={shown !== link.label}
                      className={
                        shown === link.label
                          ? "opacity-100"
                          : "pointer-events-none absolute inset-0 opacity-0"
                      }
                    >
                      <NavPanel link={link} />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* El panel de teléfono. Va DENTRO del `<nav>` para que herede su
              posicionamiento y quede sobre la barra, y se corta en `md`: si el
              viewport crece con el menú abierto, los tabs vuelven y este
              desaparece sin dejar el scroll bloqueado (el efecto sigue montado
              y limpia al cerrar). */}
          {mobileOpen && (
            <div
              id="site-nav-mobile"
              data-q-surface
              className="absolute inset-x-0 top-full mt-2.5 max-h-[calc(100svh-var(--site-header-block)-1rem)] overflow-y-auto rounded-[var(--q-nav-radius)] shadow-[0_28px_70px_-14px_rgba(0,0,0,0.55)] md:hidden"
            >
              <MobileMenu onNavigate={() => setMobileOpen(false)} />
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
