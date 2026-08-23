import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// El provider es obligatorio: cada apertura monta el acto debajo, que es una
// sección pegada cuyo recorrido lo define el alto de sus seis bloques de texto.
// La apertura D además ata cuatro capas de paralaje al scroll con scrub. Sin el
// refresh coordinado del provider, todo eso queda medido contra el primer paint
// —antes del swap de fuentes— y los umbrales caen desplazados.
export default function ProtocolOpeningLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
