import { ArrowDown } from "lucide-react";

interface BrandLogoCardProps {
  svgSrc: string;
  pngSrc: string;
  alt: string;
  previewBg: string;
  imgClassName?: string;
  name: string;
  description: string;
  nudgeDown?: boolean;
}

export default function BrandLogoCard({ svgSrc, pngSrc, alt, previewBg, imgClassName = "h-[26px]", name, description, nudgeDown = true }: BrandLogoCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#CAC8C8] bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-5 py-8 min-h-[144px]" style={{ background: previewBg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={svgSrc} alt={alt} className={`${imgClassName} ${nudgeDown ? "translate-y-[5px]" : ""}`} />
      </div>
      <div className="flex items-stretch justify-between gap-2 px-3.5 py-2.5 border-t border-black/10">
        <span className="flex flex-col justify-center gap-px min-w-0 flex-1">
          <b className="[font-size:var(--font-size-body)] font-medium truncate">{name}</b>
          <span className="[font-size:var(--font-size-body)] text-black/45 truncate">{description}</span>
        </span>
        <span className="flex gap-1.5 shrink-0">
          <a
            href={svgSrc}
            download
            className="flex items-center justify-center gap-1 font-mono text-[0.875rem] tracking-[0.06em] uppercase text-black/60 border border-black/15 rounded-xl px-3 whitespace-nowrap hover:text-[#0072C9] hover:border-[#0072C9] transition-colors"
          >
            <span>SVG</span>
            <ArrowDown className="w-3 h-3" />
          </a>
          <a
            href={pngSrc}
            download
            className="flex items-center justify-center gap-1 font-mono text-[0.875rem] tracking-[0.06em] uppercase text-black/60 border border-black/15 rounded-xl px-3 whitespace-nowrap hover:text-[#0072C9] hover:border-[#0072C9] transition-colors"
          >
            <span>PNG</span>
            <ArrowDown className="w-3 h-3" />
          </a>
        </span>
      </div>
    </div>
  );
}
