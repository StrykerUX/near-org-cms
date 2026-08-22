import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// El provider no es opcional acá: T9 es una escena pegada de siete pantallas,
// T2, T6 y T10 atan tweens al scroll con scrub, y T3 y T10 montan el canvas del
// campo de shards. Todas miden contra el viewport, y sin el refresh coordinado
// del provider esas mediciones quedan tomadas contra el primer paint —antes del
// swap de fuentes— y los umbrales caen desplazados.
export default function ProtocolTransitionsLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
