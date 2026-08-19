import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que los demás prototipos: el provider va acá y no en
// `app/prototype/`, para que `/prototype` y `/prototype/components` —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// Los tres drafts EX lo necesitan: la apertura de la «o» mide la posición de un
// trazado contra el viewport, y esa medida cambia con el ancho de la ventana.
export default function EX1Layout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
