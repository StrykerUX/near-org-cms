import type { ReactNode } from "react";

export default function Eyebrow({
  children,
  className = "text-muted-foreground",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`text-eyebrow uppercase ${className}`}>{children}</p>;
}
