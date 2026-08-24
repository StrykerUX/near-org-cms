import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que el resto de la familia: el provider va acá y no en
// `app/prototype/`, para que `/prototype` y `/prototype/components` —rutas
// hermanas, no hijas— sigan sin Lenis ni `ScrollTrigger.refresh()`.
//
// No es opcional: sin el refresh coordinado, los triggers de las secciones
// anclan contra la altura del primer paint —antes de que carguen la fuente y los
// logotipos del muro— y disparan con su contenido todavía fuera de cuadro. El
// síntoma es una sección que se ve terminada al llegar, sin haber animado.
export default function SolutionsBLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
