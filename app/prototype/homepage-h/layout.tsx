import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que las otras rutas del prototipo: el provider va acá y no en
// app/prototype/, para que /prototype y /prototype/components sigan sin Lenis.
//
// No es opcional: el pliegue del hero mide contra el viewport en cada refresh, y
// sin el refresh coordinado del provider queda calibrado contra la altura del
// primer paint — antes de que carguen la fuente y el SVG isométrico.
export default function HomepageHLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
