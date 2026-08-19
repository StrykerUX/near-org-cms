import SiteFooter from "@/components/site/SiteFooter";
import { LABS } from "@/components/sections/footer-labs/footerLabContent";
import FooterLabShell from "./FooterLabShell";

// 02 · Compact. Ver la nota de `FooterLabVeilView`.
export default function FooterLabCompactView() {
  return (
    <FooterLabShell spec={LABS[1]}>
      <SiteFooter variant={LABS[1].variant} />
    </FooterLabShell>
  );
}
