import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// La home vive en un grupo anidado —`(home)`— y no directamente en la raíz de
// `(motion)`, por una razón concreta: el provider lo trae cada RUTA y nunca el
// layout del grupo.
//
// Si el provider se montara en `app/(motion)/layout.tsx` envolvería también a
// las nueve páginas que ya traen el suyo, y ahí habría dos instancias de Lenis
// haciendo hijack del mismo scroll. El porqué largo está en aquel archivo.
//
// Pero la home ES la raíz del grupo: no tiene una carpeta propia donde poner su
// layout. Un route group anidado se la da sin aparecer en la URL — `(home)`
// resuelve a `/` igual que si el `page.tsx` colgara de `(motion)` directamente.
//
// Y el provider acá NO es opcional. La home monta el stack (`StackAnchors` en
// modo `frame`), el hero que se recoge y el ledger, y las tres escenas se miden
// contra el viewport: sin el `ScrollTrigger.refresh()` coordinado del provider
// quedan clavadas en la altura del primer pintado, o sea antes de que el
// intercambio de fuente cambie el alto de cada titular de la página.
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
