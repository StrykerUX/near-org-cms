import ReviewWidget from "@/components/site/ReviewWidget";
import SiteHeader from "@/components/site/SiteHeader";

// Páginas de marketing con coreografía de scroll.
//
// ── Por qué no viven bajo `(site)` ──────────────────────────────────────────
//
// `app/(site)/layout.tsx` monta `LenisProvider`, que **omite
// `ScrollTrigger.refresh()` a propósito**: su docblock explica que el refresh
// mueve `window.scrollY` para re-medir, y eso desincroniza el scroll virtual de
// Lenis y lo congela en páginas largas. Ahí mismo dice cuál es la salida — las
// páginas que sí usan ScrollTrigger montan `PrototypeMotionProvider`, que
// re-ancla Lenis después de cada refresh.
//
// Los dos providers crean su propia instancia de Lenis, así que anidarlos daría
// DOS hijacks del scroll sobre la misma página. De ahí que este grupo exista:
// las páginas animadas necesitan el chrome del sitio pero NO el provider de
// `(site)`, y cada una trae el suyo en su propio `layout.tsx`.
//
// Un grupo entre paréntesis no aparece en la URL, así que `/blockchain` sale
// igual desde acá que desde cualquier otro sitio.
//
// Tampoco monta `SiteFooter`: estas páginas traen su propio footer dentro de la
// view (`PrototypeFooter`), que es parte de su composición y no chrome.
//
// Converger los dos providers en uno sigue siendo trabajo pendiente y anotado en
// los dos archivos. El día que pase, este grupo puede desaparecer.
export default function MotionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <ReviewWidget />
    </>
  );
}
