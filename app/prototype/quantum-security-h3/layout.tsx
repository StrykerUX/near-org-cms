import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/quantum-security-copy/layout.tsx:
// ThreatSequence, FieldBreak, Roadmap y el campo de nodos del hero miden
// contra el viewport y necesitan el refresh coordinado del provider.
export default function QuantumSecurityH3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
