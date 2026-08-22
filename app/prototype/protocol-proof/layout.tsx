import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Dos de las ocho variantes lo necesitan: P4 corre un marquee en loop y P7 tiene
// un ScrollTrigger que traza el eje al entrar en viewport. Sin el refresh
// coordinado del provider, ese trigger queda medido contra el primer paint —antes
// del swap de fuentes— y en una página con ocho bloques apilados el error se
// acumula hasta que dispara fuera de pantalla.
export default function ProtocolProofLabsLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
