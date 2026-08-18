import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/homepage-ab6/layout.tsx: el provider va acá y
// no en app/prototype/, para que /prototype y /prototype/components —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// No es opcional para esta ruta: las cinco transiciones miden su recorrido contra
// el viewport y las bandas de relleno están en `svh`, así que sin el refresh
// coordinado del provider quedarían ancladas a la altura del primer paint (antes
// del swap de fuentes, que cambia el alto de cada banda).
export default function HomepageExplorationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
