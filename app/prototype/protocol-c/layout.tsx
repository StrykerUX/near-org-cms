import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Esta alternativa no tiene ninguna sección pegada, pero sí trece reveals
// atados a ScrollTrigger —uno por entrada del ensayo, más los de cada sección—
// y varios bloques cuyo alto depende del swap de fuentes: `--text-mural` y
// `serif-poster` cambian de tamaño cuando Kepler termina de cargar. Sin el
// refresh coordinado del provider, esos triggers quedan medidos contra el primer
// paint y los últimos disparan fuera de pantalla.
export default function ProtocolLabCLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
