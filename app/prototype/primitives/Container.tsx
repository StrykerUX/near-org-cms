import type { ElementType, ReactNode } from "react";

export default function Container({
  as: Tag = "div",
  children,
  className = "",
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag className={`mx-auto w-full max-w-[1780px] px-[60px] ${className}`}>
      {children}
    </Tag>
  );
}
