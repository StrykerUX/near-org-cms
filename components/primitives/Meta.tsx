export default function Meta({ children }: { children: string }) {
  return (
    <p className="font-mono text-caption text-muted-foreground text-pretty">
      {children}
    </p>
  );
}
