import ReviewWidget from "@/components/site/ReviewWidget";

// Este layout existe solo para montar el widget de revisión sobre todas las
// páginas de prototipo — que son justo las que el equipo tiene que comentar
// (`homepage-v2`, `protocol`, `quantum-security`) y que NO cuelgan del layout
// de `(site)`.
//
// Deliberadamente no trae ningún provider: `homepage-v2` y `quantum-security`
// montan `PrototypeMotionProvider` en su propio layout, y `/prototype` y
// `/prototype/components` tienen que seguir sin Lenis ni ScrollTrigger. Subir
// el provider acá les cambiaría el comportamiento de scroll a las dos.
export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ReviewWidget />
    </>
  );
}
