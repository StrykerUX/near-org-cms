import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio que app/prototype/homepage-v2/layout.tsx: el provider va acá
// y no en app/prototype/, para que /prototype y sus rutas hermanas sin motion
// no se vean afectadas. Necesario para este lab en particular: los dos
// carruseles se prueban contra Lenis real, no contra scroll nativo sin más.
export default function CarouselSectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
