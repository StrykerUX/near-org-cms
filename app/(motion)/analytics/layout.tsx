import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que el resto de `(motion)`: el provider lo trae cada ruta y no
// el layout del grupo, porque los dos providers del repo crean su propia
// instancia de Lenis y anidarlos daría dos hijacks del scroll sobre la misma
// página. El porqué largo está en `app/(motion)/layout.tsx`.
//
// Acá no es opcional por dos motivos a la vez: el hero se recoge con un
// `clip-path` atado al scroll, y las secciones de la propuesta C (`DualCards`,
// `Products`) son componentes cliente que se miden contra el viewport. Sin el
// `ScrollTrigger.refresh()` coordinado del provider las tres quedan clavadas en
// la altura del primer pintado.
export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
