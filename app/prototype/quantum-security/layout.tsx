import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Same reasoning as app/prototype/homepage-v2/layout.tsx: the provider lives
// here and not in app/prototype/, so that /prototype and /prototype/components
// — sibling routes, not children — stay free of Lenis and ScrollTrigger.refresh().
//
// It is not optional for this route. RotationStatement's sticky track, FieldBreak's
// video scrub, the roadmap spine and the word field all measure against the
// viewport, and without the provider's coordinated refresh they stay pinned to
// the first paint's height — before the font swaps, before the 7 MB video
// reports its duration, and before the word field has built its rows.
export default function QuantumSecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
