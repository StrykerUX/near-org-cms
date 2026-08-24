import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que el resto de `(motion)`: el provider lo trae cada ruta y no
// el layout del grupo, porque los dos providers del repo crean su propia
// instancia de Lenis y anidarlos daría dos hijacks del scroll sobre la misma
// página. El porqué largo está en `app/(motion)/layout.tsx`.
export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
