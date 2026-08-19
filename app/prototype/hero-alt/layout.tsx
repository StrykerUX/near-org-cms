import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/homepage-ab7/layout.tsx: el provider va acá y
// no en app/prototype/, para que /prototype y /prototype/components —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// Acá es todavía menos opcional que en las homepages: la página monta cinco
// heroes de 100svh y cinco tracks sticky, más tres contextos de canvas cuyo
// tamaño se mide contra el viewport. Sin el refresh coordinado del provider,
// todos quedan anclados a la altura del primer paint — antes de que carguen las
// fuentes, que es justo de lo que dependen los dos canvas que rasterizan texto.
export default function HeroAltLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
