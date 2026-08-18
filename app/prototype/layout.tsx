import PrototypeFooterSlot from "@/components/site/PrototypeFooterSlot";
import ReviewWidget from "@/components/site/ReviewWidget";
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
//
// El footer NO se monta directo: pasa por `PrototypeFooterSlot`, que lo omite
// en las rutas que no lo llevan (hoy, solo el lab de heroes). Ver ahí el porqué
// y cuándo conviene cambiar el enfoque por route groups.
export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      {/* El footer va por un slot y no directo: hay rutas de prototipo que no
          lo llevan, y un layout hijo no puede quitar lo que este pone. La lista
          y el razonamiento están en `PrototypeFooterSlot`. */}
      <PrototypeFooterSlot />
      <ReviewWidget />
    </>
  );
}
