import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/hero-alt/layout.tsx: el provider va acá y no
// en app/prototype/, para que /prototype y /prototype/components —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// Acá hace falta por partida doble: la página monta diez secciones de 100svh o
// más, dos tracks sticky y dos contextos de canvas cuyo tamaño se mide contra el
// viewport. Sin el refresh coordinado del provider, todos quedan anclados a la
// altura del primer paint — antes del swap de fuentes, que es justo lo que mueve
// la altura de las diez.
export default function ProofAltLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
