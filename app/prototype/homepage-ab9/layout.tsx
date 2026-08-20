import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/homepage-ab7/layout.tsx: el provider va acá y
// no en app/prototype/, para que /prototype y /prototype/components —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// No es opcional para esta ruta: HeroVideo, OwnYourOwn, NearStackV2 y
// ProofStepper miden contra el viewport, y sin el refresh coordinado del
// provider quedan ancladas a la altura del primer paint (antes de que carguen
// la fuente, el video y el SVG isométrico). QuantumBars ya no está en la lista
// porque ab9 no la monta.
export default function HomepageAb9Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
