import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// El provider es obligatorio: la página monta el acto, que es una sección pegada
// cuyo recorrido lo define el alto de sus seis bloques de texto. Sin el refresh
// coordinado, esos umbrales quedan medidos contra el primer paint —antes del
// swap de fuentes— y caen desplazados.
export default function ProtocolCLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
