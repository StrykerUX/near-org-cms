import ReviewWidget from "@/components/site/ReviewWidget";
import SiteFooter from "@/components/site/SiteFooter";
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
// Un grupo entre paréntesis no aparece en la URL, así que `/protocol` sale
// igual desde acá que desde cualquier otro sitio.
//
// El `SiteFooter` SÍ se monta acá, igual que en `(site)` y en `/prototype`.
// Antes no: cada view traía el suyo (`PrototypeFooter`), y esa decisión es la
// que terminó en cinco footers divergentes. Es chrome, no composición.
//
// Queda FUERA del `PrototypeMotionProvider`, que se monta un nivel más abajo, y
// eso no lo afecta — por el mismo motivo que al header: usa ScrollTrigger, que
// es global y no un contexto de React. De hecho le conviene, porque el
// `refresh()` coordinado del provider re-mide también su umbral.
//
// Converger los dos providers en uno sigue siendo trabajo pendiente y anotado en
// los dos archivos. El día que pase, este grupo puede desaparecer.
export default function MotionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <ReviewWidget />
    </>
  );
}
