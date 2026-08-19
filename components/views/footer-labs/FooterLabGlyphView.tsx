import FooterGlyph from "@/components/sections/footer-labs/FooterGlyph";
import { LABS } from "@/components/sections/footer-labs/footerLabContent";
import FooterLabShell from "./FooterLabShell";

// 02 · Glyph. El shell aporta la ficha y el relleno; lo único propio de esta ruta
// es el footer que monta.
//
// El spec se toma por índice y no por `find(...)`: `LABS` es un literal de
// seis entradas en un orden que la ficha ya muestra, así que un `find` sumaría
// un `!` de non-null a cambio de nada.
export default function FooterLabGlyphView() {
  return (
    <FooterLabShell spec={LABS[1]}>
      <FooterGlyph />
    </FooterLabShell>
  );
}
