import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/homepage-update/layout.tsx: el provider va
// acá y no en app/prototype/, para que /prototype y /prototype/components —
// rutas hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// No es opcional para esta ruta: sin el refresh coordinado, las tres
// escenas con scrub (`StickyScrollCapabilities`, más los `scrollTrigger` de
// `Proof`) quedan ancladas a la altura del primer paint, ANTES de que
// terminen de cargar la fuente y las imágenes de `WhyItMatters`
// (`next/image`, debajo de la escena sticky en el DOM). El síntoma sin este
// layout: el trigger de `StickyScrollCapabilities` mide su "top" contra un
// documento más corto del que termina siendo, así que al hacer scroll el
// progreso ya viene adelantado — el diagrama y el texto llegan medio
// dibujados/a mitad de camino ANTES de que la sección visualmente toque el
// borde superior del viewport, en vez de arrancar en cero justo ahí.
export default function ChainAbHomepageRefined4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
