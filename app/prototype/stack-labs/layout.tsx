import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// UN layout para las cinco rutas del laboratorio: son hermanas bajo esta
// carpeta y comparten el provider en vez de declarar cinco copias.
//
// Mismo criterio que los demás labs: el provider va acá y no en
// `app/prototype/`, para que `/prototype` y `/prototype/components` —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// Acá es obligatorio: tres de las cinco variantes montan un track sticky cuya
// altura se mide contra el viewport, y el ensamble se dimensiona en unidades de
// pantalla. Sin el refresh coordinado, todo queda anclado a la medición del
// primer paint.
export default function StackLabsLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
