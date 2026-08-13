import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Un layout para las doce rutas del laboratorio, en vez de uno por ruta. El catálogo de
// cuáles son y qué prueba cada una está en `components/sections/lab/README.md`.
//
// El provider es obligatorio acá por lo mismo que en /prototype/homepage-v2: hay
// ScrollTriggers que miden contra el viewport, y sin su refresh coordinado quedan
// anclados a la altura del primer paint — antes de que la fuente haga swap y de que
// el póster del hero decodifique.
export default function DescentLabLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
