import FooterReveal from "@/components/sections/footer-labs/FooterReveal";
import { LABS } from "@/components/sections/footer-labs/footerLabContent";
import FooterLabShell from "./FooterLabShell";

// 04 · Reveal. El shell aporta la ficha y el relleno; lo único propio de esta ruta
// es el footer que monta.
//
// El spec se toma por índice y no por `find(...)`: `LABS` es un literal de
// seis entradas en un orden que la ficha ya muestra, así que un `find` sumaría
// un `!` de non-null a cambio de nada.
export default function FooterLabRevealView() {
  return (
    <FooterLabShell spec={LABS[3]}>
      <FooterReveal />
    </FooterLabShell>
  );
}
