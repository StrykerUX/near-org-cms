"use client";

import { toast } from "sonner";

interface CopyableSwatchProps {
  value: string;
  label: string;
  hexLabel: string;
  height?: string;
  sublabel?: string;
  className?: string;
}

export default function CopyableSwatch({ value, label, hexLabel, height = "110px", sublabel, className = "" }: CopyableSwatchProps) {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard unavailable — still show the toast so the user sees the value
    }
    toast(`Copied  ${value}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`text-left cursor-pointer rounded-2xl overflow-hidden border border-[#CAC8C8] bg-white ${className}`}
    >
      <div style={{ height, background: value }} className="border-b border-black/5" />
      <div className="px-4 py-3 flex items-baseline justify-between gap-2">
        <span className="[font-size:var(--font-size-body)] font-medium">
          {label} {sublabel && <span className="text-black/40 font-normal">· {sublabel}</span>}
        </span>
        <span className="font-mono [font-size:var(--font-size-body)] text-black/55">{hexLabel}</span>
      </div>
    </button>
  );
}
