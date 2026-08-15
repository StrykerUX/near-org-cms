import { Toaster } from "sonner";
import BannerHost from "@near/cms-core/components/site/BannerHost";
import LenisProvider from "@/components/site/providers/LenisProvider";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ReviewWidget from "@/components/site/ReviewWidget";
import { getActiveBanners } from "@/lib/queries/banners";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const banners = await getActiveBanners();

  return (
    <LenisProvider>
      {/* Acá y no en cada página: el header es `fixed`, así que no participa
          del flujo y da igual dónde se monte en el árbol. Lo que importa es que
          se monte UNA vez — mientras cada view lo importaba a mano, tres
          páginas se quedaron sin él. */}
      <SiteHeader />
      <BannerHost banners={banners} slot="top" />
      {children}
      <SiteFooter />
      <BannerHost banners={banners} slot="bottom" />
      {/* Acá y no en el layout raíz: el único `toast()` del sitio público sale
          del formulario de contacto del header, que vive en esta sección. En el
          raíz se hidrataba también en /admin —que monta su propio Toaster— y en
          las rutas de /prototype, que no lo usan. */}
      <Toaster position="bottom-center" />
      {/* Se auto-descarta salvo que haya cookie de revisión — ver ReviewWidget. */}
      <ReviewWidget />
    </LenisProvider>
  );
}
