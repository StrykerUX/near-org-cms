import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/homepage-update/layout.tsx: el provider vive
// en la ruta y no en app/prototype/, para que las rutas hermanas que no usan
// ScrollTrigger sigan sin Lenis.
//
// Esta alternativa no tiene ninguna sección pegada, pero sí siete bloques con
// reveals atados a ScrollTrigger. Sin el refresh coordinado del provider, esos
// triggers quedan medidos contra la altura del primer paint —antes de que
// carguen las fuentes— y en una página de siete secciones el error se acumula
// hasta que los últimos disparan fuera de pantalla.
export default function ProtocolLabALayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
