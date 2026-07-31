import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "light" | "dark";
  icon?: ReactNode;
  className?: string;
};

export default function Button({
  children,
  href,
  variant = "light",
  icon,
  className = "",
}: ButtonProps) {
  const classes = `inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-body-sm font-medium transition-colors ${
    variant === "light"
      ? "bg-background text-foreground hover:bg-background/90"
      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
  } ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button type="button" className={classes}>
      {children}
      {icon}
    </button>
  );
}
