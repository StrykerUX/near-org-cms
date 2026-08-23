import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// El provider es obligatorio: cada combo monta la página entera, incluido el
// acto — una sección pegada cuyo recorrido lo define el alto de sus seis bloques
// de texto. Sin el refresh coordinado del provider, esos umbrales quedan medidos
// contra el primer paint, antes del swap de fuentes, y caen desplazados.
export default function ProtocolComboLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
