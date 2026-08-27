import Link from "next/link";
import type { PillItem } from "@/components/sections/types";

export type FilterPillsProps = {
  items: PillItem[];
  allItem: PillItem;
};

function pillClassName(active: boolean) {
  return `px-4 py-2 rounded-full text-body-sm-mono transition ${
    active ? "bg-[#262626] text-white" : "bg-[#f5f4f1] text-[#e1e1e1] hover:bg-[#e1e1e1]"
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
