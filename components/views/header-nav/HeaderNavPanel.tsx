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
          <span className="flex flex-col">
            <span className="whitespace-nowrap text-label uppercase text-white">{item.label}</span>
            <span className="whitespace-nowrap text-caption text-white/55">{item.desc}</span>
          </span>
        </NavLink>
      ))}
    </div>
  );
}

export function NavPanel({ link }: { link: Entry }) {
  const groups = link.groups ?? [{ label: "", items: link.items ?? [] }];
  const colA = groups.slice(0, 2);
  const colB = groups.slice(2);
  return (
    <div className="grid w-[720px] grid-cols-[1fr_268px] content-start items-start gap-x-8 gap-y-7 p-6">
      <NavGroup group={colA[0]} />
      {/* The old iso-*.png art was opaque and drawn ON a cream ground, so
          `bg-cream` + `object-cover` (crop-to-fill) was invisible/seamless.
          The new menu-tab-*.png set is 500x500 (square) with an alpha
          channel — `bg-cream` now shows through as an unwanted patch, and
          `object-cover` crops a square image into this landscape box (real
          content gets cut off, not just a shape mismatch). `bg-[var(--q-nav-bg)]`
          matches the dark panel instead of standing out, and `object-contain`
          shows the whole image, letterboxed, never cropped or stretched. */}
      <div className="h-[184px] w-full overflow-hidden rounded-xl bg-[var(--q-nav-bg)]">
        <Image
          src={link.hero}
          alt=""
          width={500}
          height={500}
          sizes="268px"
          className="h-full w-full object-contain"
        />
      </div>
      {colA.slice(1).map((g, i) => (
        <NavGroup key={g.label || `a${i}`} group={g} />
      ))}
      {colB.map((g, i) => (
        <NavGroup key={g.label || `b${i}`} group={g} />
      ))}
    </div>
  );
}
