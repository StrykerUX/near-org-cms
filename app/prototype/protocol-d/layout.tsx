import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// El provider no es opcional: D monta `Assembly`, la sección pegada de B, cuyo
// recorrido lo define el alto de sus seis bloques de texto — y ese alto cambia
// cuando cargan las fuentes. Sin el refresh coordinado del provider, los seis
// triggers quedan medidos contra el primer paint y el beat cambia varios cientos
// de píxeles antes de que su texto llegue a la línea de lectura.
export default function ProtocolLabDLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
