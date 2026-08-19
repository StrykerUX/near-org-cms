import FooterAscend from "@/components/sections/footer-labs/FooterAscend";
import { LABS } from "@/components/sections/footer-labs/footerLabContent";
import FooterLabShell from "./FooterLabShell";

// 03 · Ascend. El shell aporta la ficha y el relleno; lo único propio de esta ruta
// es el footer que monta.
//
// El spec se toma por índice y no por `find(...)`: `LABS` es un literal en un
// orden que la ficha ya muestra, así que un `find` sumaría un `!` de non-null
// a cambio de nada.
export default function FooterLabAscendView() {
  return (
    <FooterLabShell spec={LABS[2]}>
      <FooterAscend />
    </FooterLabShell>
  );
}
