export type EmptyStateProps = {
  message: string;
  symbol?: string;
};

export default function EmptyState({ message, symbol = "✦" }: EmptyStateProps) {
  return (
    <div className="text-center py-24 text-[#e1e1e1]">
      <p className="text-5xl mb-4">{symbol}</p>
      <p className="font-mono text-content-muted" style={{ fontSize: "var(--font-size-body)" }}>
        {message}
      </p>
    </div>
  );
}
