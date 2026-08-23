import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Mismo criterio y misma necesidad que app/prototype/homepage-update/layout.tsx
// —esta ruta es su duplicado—: el provider va acá y no en app/prototype/, para
// que /prototype y /prototype/components sigan sin Lenis.
//
// No es opcional: Hero, OwnYourOwn y StackAnchors miden contra el viewport, y
// sin el refresh coordinado del provider quedan ancladas a la altura del primer
// paint (antes de que carguen la fuente y el SVG isométrico).
export default function HomepageELayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
