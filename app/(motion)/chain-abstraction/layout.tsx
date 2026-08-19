import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Same reasoning as the quantum-security layout next door: the provider lives
// on the route and not on the group, and it is NOT optional here.
//
// Four things on this page measure themselves against the viewport — the hero's
// collapse field, `CapabilityStack`'s sticky track, the growth line's drawn
// path and the convergence in `CompletePicture`. Without the provider's
// coordinated `ScrollTrigger.refresh()` they stay pinned to the first paint's
// height, i.e. before the font swap resizes every heading on the page.
export default function ChainAbstractionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
