import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que los demás prototipos: el provider va acá y no en
// `app/prototype/`, para que `/prototype` y `/prototype/components` —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// EX2 lo necesita de verdad: la apertura de la O mide la posición de una letra
// contra el viewport, y esa medida cambia con el ancho de la ventana y otra vez
// cuando Kepler termina de cargar. Sin el refresh coordinado, el círculo queda
// centrado donde estaba la O antes del swap de fuentes.
export default function Ex2Layout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
