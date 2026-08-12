import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Three of the four concepts are scroll-driven, and two of them use a sticky
// track measured against the viewport, so this route needs the same coordinated
// ScrollTrigger refresh as /prototype/quantum-security.
export default function QuantumThreatConceptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
