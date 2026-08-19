import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que `app/prototype/footer-labs/layout.tsx` y que el lab de
// heroes: el provider va acá y no en `app/prototype/`, para que `/prototype` y
// `/prototype/components` —rutas hermanas, no hijas— sigan sin Lenis ni
// `ScrollTrigger.refresh()`.
//
// Esta ruta lo necesita por la 04, que es la única atada al scroll: sin el
// refresh coordinado, su trigger queda medido contra la altura que el documento
// tenía antes de que Kepler terminara de cargar — y a 153px, el swap de fuente
// mueve la página bastante.
export default function MuralLabLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
