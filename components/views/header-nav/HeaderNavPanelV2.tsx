import Image from "next/image";
import { NavLink, type Entry, type Group } from "@/components/site/SiteHeader";

// Forked copy of SiteHeader's NavGroup/NavPanel — NOT reused directly like
// LINKS/NavLink/MobileMenu are, because this is exactly where the change
// under test lives (the icon badge's hover color) and SiteHeader.tsx isn't
// touched until this is approved. Everything else here is byte-for-byte the
// original; diff against SiteHeader.tsx to see the one line that changed.
function NavGroup({ group }: { group: Group }) {
  return (
    <div className="flex flex-col gap-1">
      {group.label && (
        <p className="mb-1 px-3 text-body-sm text-white/45">{group.label}</p>
      )}
      {group.items.map((item) => (
        <NavLink
          key={item.label}
          href={item.href}
          className="group/item flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.09]"
        >
          {/* Was `group-hover/item:bg-white group-hover/item:text-black`
              (inverts to solid white). Per feedback, the badge's hover
              background should be the dropdown panel's own color
              (--q-nav-bg) instead — the icon stays white since it's already
              white at rest and a dark-on-dark badge needs a light icon. */}
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.06] text-white transition-colors duration-200 group-hover/item:bg-[var(--q-nav-bg)]"
          >
            <item.icon className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-label uppercase text-white">{item.label}</span>
            <span className="text-caption text-white/55">{item.desc}</span>
          </span>
        </NavLink>
      ))}
    </div>
  );
}

// The old iso-*.png art was opaque and drawn ON a cream ground, so `bg-cream`
// + `object-cover` (crop-to-fill) was invisible/seamless. The new
// menu-tab-*.png set is 500x500 (square) with an alpha channel — `bg-cream`
// now shows through as an unwanted patch, and `object-cover` crops a square
// image into a landscape box (real content gets cut off, not just a shape
// mismatch). `bg-[var(--q-nav-bg)]` matches the dark panel instead of
// standing out, and `object-contain` shows the whole image, letterboxed,
// never cropped or stretched.
function HeroImage({ hero, className }: { hero: string; className: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-[var(--q-nav-bg)] ${className}`}>
      <Image src={hero} alt="" width={500} height={500} sizes="240px" className="h-full w-full object-contain" />
    </div>
  );
}

// The VISIBLE dropdown box is `data-q-surface` in HeaderNavMockV2.tsx, not
// this component — it has the background/rounded corners/shadow, and it's a
// plain block div with no width of its own, so it always fills 100% of its
// parent (the nav-width wrapper) no matter how narrow a width NavPanel
// declares for ITS OWN content inside it. Capping NavPanel's width alone
// left an empty strip of dark box padding out to the full nav width instead
// of actually shrinking the box. `panelWidth` is applied to `data-q-surface`
// itself from the mock — this is the "natural size, cap only once the nav
// is narrower than that" rule (`min(Npx,100%)`, `100%` resolving against
// the nav's own definite, `w-full`-wrapper-derived width).
export function panelWidth(link: Entry): string {
  const groups = link.groups ?? [];
  if (groups.length >= 3) return "w-[min(1199px,100%)]";
  if (groups.length === 2) return "w-[min(1004px,100%)]";
  return "w-[min(720px,100%)]";
}

export function NavPanel({ link }: { link: Entry }) {
  const groups = link.groups ?? [{ label: "", items: link.items ?? [] }];

  // Resources (3 groups) and About (2 groups) used to fall into the same
  // single grid as Products/Stack (1 group): groups + hero all sharing one
  // 2-column grid, which left the last group squeezed into the image's own
  // 268px column instead of getting its own room. Split those into their
  // own shape instead: every group gets its own column, all in one row (one
  // `grid-cols-N` for N groups — 3 side by side for Resources, 2 for
  // About), and the hero sits in a separate flex item pinned at the box's
  // right edge, same fixed 268x184 size as the single-group panels below
  // (not stretched to the grid's height). Width itself now comes from
  // `data-q-surface` (see `panelWidth` above) — this just fills it, and
  // `repeat(auto-fit,minmax(...))` reflows the columns once that shrinks.
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
