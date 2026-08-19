import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que `app/prototype/hero-alt/layout.tsx`: el provider va acá y
// no en `app/prototype/`, para que `/prototype` y `/prototype/components`
// —rutas hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// Las seis rutas del lab lo necesitan por el mismo motivo que el lab de heroes:
// todas miden contra el fondo del documento o contra el viewport, y ese fondo
// se sigue moviendo después del primer paint (swap de fuentes, decodificación
// de imágenes). Sin el refresh coordinado del provider, cada trigger queda
// anclado a la altura que el documento tenía antes de terminar de cargar y los
// seis footers arrancan su animación en el punto equivocado.
//
// El índice también pasa por acá y no lo usa. Cuesta un provider inerte y
// evita un layout más; el día que moleste, se baja a las seis carpetas.
export default function FooterLabsLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
