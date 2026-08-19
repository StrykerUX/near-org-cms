import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// UN layout para las tres demos, y ese es el motivo de que vivan bajo la misma
// carpeta: `/prototype/homepage-proof/datum`, `/index` y `/columns` son rutas
// hermanas, así que comparten este provider en vez de declarar tres copias.
//
// Mismo criterio que los demás labs: el provider va acá y no en
// `app/prototype/`, para que `/prototype` y `/prototype/components` —rutas
// hermanas, no hijas— sigan sin Lenis ni ScrollTrigger.refresh().
//
// Estas tres lo necesitan de verdad: montan la homepage entera, con el scrub de
// vídeo del hero, dos tracks sticky y varios canvas cuyo tamaño se mide contra
// el viewport.
export default function HomepageProofLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
