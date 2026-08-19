import SiteFooter from "@/components/site/SiteFooter";
import { LABS } from "@/components/sections/footer-labs/footerLabContent";
import FooterLabShell from "./FooterLabShell";

// 01 · Veil. El shell aporta la ficha y el relleno; lo único propio de la ruta
// es la VARIANTE que le pasa al footer de producción — no hay sección propia.
//
// El spec se toma por índice y no por `find(...)`: `LABS` es un literal en un
// orden que la ficha ya muestra, así que un `find` sumaría un `!` de non-null
// a cambio de nada.
export default function FooterLabVeilView() {
  return (
    <FooterLabShell spec={LABS[0]}>
      <SiteFooter variant={LABS[0].variant} />
    </FooterLabShell>
  );
}
