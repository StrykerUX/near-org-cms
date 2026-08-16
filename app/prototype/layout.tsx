import ReviewWidget from "@/components/site/ReviewWidget";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

// Este layout monta las piezas de chrome que van sobre TODAS las páginas de
// prototipo — el header del sitio, el footer y el widget de revisión — y que no
// pueden venir del layout de `(site)`, porque estas rutas no cuelgan de él.
//
// El header vivía antes en cada view (`HomepageV2View`, `ProtocolView`, …), que
// es la razón de que `/prototype` se hubiera hecho uno inline propio y
// `/prototype/components` no tuviera ninguno. El footer venía del mismo lugar y
// con el mismo resultado: cuatro copias divergentes del mismo archivo.
//
// Deliberadamente no trae ningún provider: `homepage-v2` y `quantum-security`
// montan `PrototypeMotionProvider` en su propio layout, y `/prototype` y
// `/prototype/components` tienen que seguir sin Lenis ni ScrollTrigger. Subir
// el provider acá les cambiaría el comportamiento de scroll a las dos.
//
// Que el header quede FUERA de `PrototypeMotionProvider` (que se monta un nivel
// más abajo) no lo afecta: usa ScrollTrigger, que es global y no un contexto de
// React, y sus efectos corren con el árbol entero ya commiteado — así que su
// `querySelectorAll("[data-nav-dark]")` sigue viendo todas las secciones.
// Que el footer quede sin provider en `/prototype` y `/prototype/components`
// tampoco lo afecta: su ScrollTrigger no depende de Lenis, y las mediciones que
// necesita las rehace por su cuenta (ver el ResizeObserver de `SiteFooter`).
export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <ReviewWidget />
    </>
  );
}
