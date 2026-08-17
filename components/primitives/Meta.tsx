export default function Meta({ children }: { children: string }) {
  return (
    <p className="text-caption-mono text-muted-foreground text-pretty">
      {children}
    </p>
  );
}
