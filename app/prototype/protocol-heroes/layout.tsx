import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// El provider cubre el índice y las ocho variantes. Tres de ellas lo necesitan
// de verdad: H3 ata el hero al scroll con scrub, H6 monta el canvas del campo de
// shards, y la banda de cifras en modo pegado mide su recorrido contra el
// viewport. Sin el refresh coordinado del provider, esas mediciones quedan
// tomadas contra el primer paint —antes del swap de fuentes— y los umbrales
// caen desplazados.
//
// Va acá y no en app/prototype/ para que las rutas hermanas sigan sin Lenis, que
// es el criterio de todas las demás rutas de prototipo.
export default function ProtocolHeroesLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
