import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que los demás labs: el provider va acá y no en
// `app/prototype/`, para que `/prototype` y `/prototype/components` —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// Esta página lo necesita por dos motivos: el halo de la 05 se pausa con un
// ScrollTrigger de `pauseOffscreen`, y los cinco `ShineField` miden sus glifos
// contra el ancho real — sin el refresh coordinado, las máscaras quedan medidas
// contra el layout previo al swap de fuentes.
export default function NewsletterLabsLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
