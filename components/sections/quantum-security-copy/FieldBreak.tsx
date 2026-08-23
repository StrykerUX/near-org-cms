"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { createVideoScrub } from "@/components/primitives/motion/videoScrub";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// The full-bleed break between "Beyond accounts" and the comparison: a quantum
// field that grows as you scroll past it, with one line of copy over the top.

// Measured off public/prototype/quantum/quantum-field-grow-scrub.mp4 by reading
// the mp4 atoms directly (145 samples over 6.0417s). Update by hand if the file
// is re-encoded — no browser API reports this.
const FPS = 24;

export default function FieldBreak() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const line = q("[data-break-line]")[0];
      const video = q("[data-break-video]")[0] as HTMLVideoElement | undefined;

      if (line) {
        gsap.from(line, {
          autoAlpha: 0,
          y: 40,
          duration: 1,
          ease: EASE_OUT,
          scrollTrigger: { trigger: scope, start: "top 55%", once: true },
        });
      }

      if (!video) return;

      const scrub = createVideoScrub(video, { fps: FPS });

      // Scrubbing starts the moment the section enters the frame, not when it
      // reaches the top: the growth reads as a response to the approach.
      ScrollTrigger.create({
        trigger: scope,
        start: "top bottom",
        end: "bottom 20%",
        scrub: true,
        invalidateOnRefresh: true,
        markers: DEBUG_MARKERS,
        onUpdate: (self) => scrub.setProgress(self.progress),
      });

      return () => scrub.destroy();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-cream text-foreground">
      <div className="relative h-[88vh] overflow-hidden">
        {/* No `autoPlay` and no `controls`: this is a texture the scroll drives.
            The poster is what shows with reduced-motion — the scrub never runs
            there, so the video would otherwise sit on a black first frame. */}
        <video
          data-break-video
          src="/prototype/quantum/quantum-field-grow-scrub.mp4"
          poster="/prototype/quantum/quantum-field.png"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-center"
        />

        <div className="absolute inset-x-0 top-0 pt-24">
          <Container>
            <p data-break-line className="text-h1">
              One rotation <Accent display>ahead.</Accent>
            </p>
          </Container>
        </div>
      </div>
    </section>
  );
}
