import type { ReactNode } from "react";

// Mapa literal — nunca construir la clase con un template string, Tailwind
// v4 no detecta clases generadas dinámicamente (mismo criterio que
// components/primitives/Container.tsx).
const VARIANT = {
  light: "bg-background text-foreground hover:bg-background/90",
  dark: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  // Draft del prototipo "homepage" — near-green es un token estimado de la
  // captura, no de marca definitiva (ver globals.css).
  brand: "bg-near-green text-black hover:bg-near-green-dark",
} as const;

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: keyof typeof VARIANT;
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
  const classes = `inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-body-sm font-medium transition-colors ${VARIANT[variant]} ${className}`;

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
