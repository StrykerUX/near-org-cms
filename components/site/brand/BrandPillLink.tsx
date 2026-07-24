import { Plus } from "lucide-react";
import { AnchorHTMLAttributes } from "react";

interface BrandPillLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  badge?: string;
  variant?: "light" | "dark" | "solid";
}

export default function BrandPillLink({ label, badge, variant = "light", className = "", ...rest }: BrandPillLinkProps) {
  const styles = {
    light: "border border-white/30 text-white hover:bg-white/10",
    dark: "border border-[#101010]/25 text-[#101010] hover:bg-[#101010]/05",
    solid: "bg-[#0072C9] text-white border border-[#0072C9] hover:bg-[#0091FD] hover:border-[#0091FD]",
  }[variant];

  const iconBorder = {
    light: "border-white/30",
    dark: "border-[#101010]/25",
    solid: "border-white/35",
  }[variant];

  return (
    <a
      {...rest}
      className={`flex items-center gap-3 rounded-full pl-1.5 pr-6 py-1.5 whitespace-nowrap [font-size:var(--font-size-body)] transition-colors duration-200 ${styles} ${className}`}
    >
      <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 ${iconBorder}`}>
        <Plus className="w-4 h-4" />
      </div>
      {label}
      {badge && <span className="font-mono text-[0.875rem] tracking-[0.06em] opacity-70">{badge}</span>}
    </a>
  );
}
