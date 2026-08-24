import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que el resto de `(motion)`: el provider lo trae cada ruta, no
// el layout del grupo. El porqué largo está en `app/(motion)/layout.tsx`.
export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
