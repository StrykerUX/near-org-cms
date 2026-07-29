import type { ReactNode } from "react";

// Mimics an iPhone 15 (390×844pt, Dynamic Island), scaled 1.3x for a more legible preview.
export default function IPhonePreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[390px] aspect-[390/844] rounded-[57px] border-[8px] border-neutral-900 bg-neutral-900 shadow-2xl overflow-hidden">
      <div className="absolute left-1/2 top-[13px] -translate-x-1/2 w-[117px] h-[29px] rounded-full bg-black z-10" />
      <div className="w-full h-full overflow-y-auto rounded-[47px]">
        {children}
      </div>
    </div>
  );
}
