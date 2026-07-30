"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@near/cms-core/components/ui/dialog";
import GetInTouchForm from "@/components/site/GetInTouchForm";

export default function GetInTouchModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [formKey, setFormKey] = useState(0);

  function handleOpenChange(val: boolean) {
    setOpen(val);
    if (!val) {
      setStep(1);
      setFormKey((k) => k + 1);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="border border-white/40 rounded-full px-4 py-1.5 text-white/80 hover:text-white hover:border-white/70 transition-colors cursor-pointer">
          GET IN TOUCH
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-md bg-white text-gray-900 overflow-hidden p-0 gap-0 rounded-2xl"
      >
        <DialogTitle className="sr-only">Get in touch</DialogTitle>

        {/* Header — 2 layers */}
        <div className="relative overflow-hidden min-h-[156px] flex flex-col justify-between p-5 bg-[#1d2e42] mx-3 mt-3 rounded-lg">

          {/* Layer 1: Gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d2e42] via-[#26405c] to-[#334f6a]" />

          {/* Layer 2: Noise with blur */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              filter: 'blur(0.6px)',
            }}
          />

          {/* Progress + close */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex gap-1.5 flex-1">
              <div className="h-0.5 flex-1 rounded-full bg-white/80" />
              <div className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                step === 2 ? "bg-white/80" : "bg-white/25"
              }`} />
            </div>
            <DialogClose asChild>
              <button
                type="button"
                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white transition-colors p-1.5 rounded-lg cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </DialogClose>
          </div>

          {/* Dynamic title */}
          <div className="relative z-10">
            <h2 className="text-white font-bold text-2xl leading-snug text-balance">
              Get in touch
            </h2>
          </div>
        </div>

        <GetInTouchForm
          key={formKey}
          onStepChange={setStep}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
