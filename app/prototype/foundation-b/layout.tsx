import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/homepage-a/layout.tsx: el provider va acá y
// no en app/prototype/, para que /prototype y /prototype/components —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// Las tres variantes de esta página lo necesitan por el mismo motivo: sus
// secciones miden contra el viewport, y sin el refresh coordinado del provider
// quedan ancladas a la altura del primer paint (antes de que carguen las
// fuentes).
export default function FoundationBLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
