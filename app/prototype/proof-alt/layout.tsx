import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/hero-alt/layout.tsx: el provider va acá y no
// en app/prototype/, para que /prototype y /prototype/components —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// Acá hace falta porque las tres versiones miden su geometría contra el
// viewport: la entrada en diagonal ordena los bloques por su caja, el shader de
// la 02 dimensiona su buffer, y el desfase de la 03 se lee del cruce de la
// sección. Sin el refresh coordinado del provider, las tres quedan ancladas a la
// medición del primer paint — antes del swap de fuentes, que es justo lo que
// mueve la altura de una composición hecha de titulares.
export default function ProofAltLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
