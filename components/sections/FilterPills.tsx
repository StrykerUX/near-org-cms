import Link from "next/link";
import type { PillItem } from "@/components/sections/types";

export type FilterPillsProps = {
  items: PillItem[];
  allItem: PillItem;
};

function pillClassName(active: boolean) {
  return `px-4 py-2 rounded-full text-sm font-mono transition ${
    active ? "bg-[#101010] text-white" : "bg-[#ECECEC] text-[#5A5A5A] hover:bg-[#CAC8C8]"
  }`;
}

export default function FilterPills({ items, allItem }: FilterPillsProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-10 flex flex-wrap gap-2">
      <Link href={allItem.href} className={pillClassName(allItem.active)}>
        {allItem.label}
      </Link>
      {items.map((item) => (
        <Link key={item.id} href={item.href} className={pillClassName(item.active)}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
