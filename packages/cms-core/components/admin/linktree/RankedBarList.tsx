export default function RankedBarList({
  title,
  items,
  emptyLabel = "No data yet",
}: {
  title: string;
  items: { label: string; value: number }[];
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <div className="border border-border rounded-xl bg-card p-4 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate max-w-[70%]">{item.label}</span>
                <span className="text-muted-foreground font-mono text-xs">{item.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
