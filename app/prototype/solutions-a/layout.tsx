import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que `app/prototype/chain-ab-propuesta-a/layout.tsx`: el
// provider va acá y no en `app/prototype/`, para que `/prototype` y
// `/prototype/components` —rutas hermanas, no hijas— sigan sin Lenis ni
// `ScrollTrigger.refresh()`.
//
// No es opcional para esta ruta. Las secciones cambian de suelo con `sticky
// bottom-0` y todas las entradas son ScrollTriggers medidos contra la posición
// de su sección. Sin el refresh coordinado anclan contra la altura del primer
// paint —o sea antes de que terminen de cargar la fuente y los ocho logotipos
// de `BuilderWall`— y al scrollear el progreso ya viene adelantado: las
// entradas se disparan fuera de cuadro.
export default function SolutionsALayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
