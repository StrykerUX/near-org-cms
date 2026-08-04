import BannerHost from "@near/cms-core/components/site/BannerHost";
import LenisProvider from "@/components/site/providers/LenisProvider";
import AnalyticsScripts from "@/components/site/AnalyticsScripts";
import SiteFooter from "@/components/site/SiteFooter";
import { getActiveBanners } from "@/lib/queries/banners";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const banners = await getActiveBanners();

  return (
    <LenisProvider>
      <AnalyticsScripts />
      <BannerHost banners={banners} slot="top" />
      {children}
      <SiteFooter />
      <BannerHost banners={banners} slot="bottom" />
    </LenisProvider>
  );
}
