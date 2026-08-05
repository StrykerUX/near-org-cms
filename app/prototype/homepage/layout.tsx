import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Layout scopeado a esta única sub-ruta: /prototype y /prototype/components
// son rutas hermanas bajo app/prototype/, no hijas de este layout, así que
// siguen sin Lenis/ScrollTrigger exactamente como antes.
export default function HomepageDraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
