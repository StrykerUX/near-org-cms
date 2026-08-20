import Image from "next/image";
import { NavLink, type Entry, type Group } from "@/components/site/SiteHeader";

// Frozen snapshot of SiteHeader's NavGroup/NavPanel exactly as they were
// BEFORE the header-nav prototype's changes got ported into the real header
// — taken right before that port, so this page keeps a working backup of
// "how it looked before" instead of that state only living in git history.
// Never edit this file: it's a record, not a mock to iterate on.
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
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.06] text-white transition-colors duration-200 group-hover/item:bg-white group-hover/item:text-black"
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
      <div className="h-[184px] w-full overflow-hidden rounded-xl bg-cream">
        <Image
          src={link.hero}
          alt=""
          width={1200}
          height={750}
          sizes="268px"
          className="h-full w-full object-cover"
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
