import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/(motion)/quantum-security/layout.tsx: ThreatSequence,
// FieldBreak, Roadmap y el word field miden contra el viewport y necesitan el
// refresh coordinado del provider.
export default function QuantumSecurityCopyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
