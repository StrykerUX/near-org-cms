import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que las otras páginas de `(motion)`: el provider lo trae cada
// ruta, no el layout del grupo, porque los dos providers del repo crean su
// propia instancia de Lenis y anidarlos daría dos hijacks del scroll sobre la
// misma página. El porqué largo está en `app/(motion)/layout.tsx`.
export default function FoundationALayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
