import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Link from "next/link";
import { TRIGGER_VARIANTS } from "@/components/sections/mural-labs/muralContent";
import MuralRamp from "@/components/sections/mural-labs/MuralRamp";
import MuralRise from "@/components/sections/mural-labs/MuralRise";
import MuralSplit from "@/components/sections/mural-labs/MuralSplit";
import MuralCascade from "@/components/sections/mural-labs/MuralCascade";
import MuralTypeset from "@/components/sections/mural-labs/MuralTypeset";
import MuralBands from "@/components/sections/mural-labs/MuralBands";
import MuralKern from "@/components/sections/mural-labs/MuralKern";
import MuralFlare from "@/components/sections/mural-labs/MuralFlare";
import MuralGallery from "./MuralGallery";

// Las ocho que corren con timeline propia.
//
// El orden de este array TIENE que coincidir con el de `TRIGGER_VARIANTS`, que
// se deriva del catálogo por `family`. Está escrito a mano y no generado desde
// un mapa id→componente por lo mismo que el lab de heroes: un `.map()` dejaría
// la correspondencia entre ficha y bloque implícita en dos listas separadas, y
// esta vista existe para que se pueda leer de un tirón.
const BLOCKS = [
  MuralRamp,
  MuralRise,
  MuralSplit,
  MuralCascade,
  MuralTypeset,
  MuralBands,
  MuralKern,
  MuralFlare,
];

export default function MuralTriggeredView() {
  return (
    <main className="flex flex-col bg-cream">
      <Container as="header" className="pt-[calc(var(--site-header-block)+3rem)] pb-16">
        <Link href="/prototype/mural-lab" className="text-label underline underline-offset-4">
          ← Mural lab
        </Link>
        <Eyebrow className="mt-6 text-gray-intermediate">Familia trigger · 8 variantes</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[20ch]">El scroll solo dice cuándo</h1>
        <p className="text-body-lg mt-6 max-w-[64ch] text-muted-foreground">
          Ocho tratamientos con timeline propia: el scroll decide cuándo
          empiezan y cuándo se deshacen, pero entre esos dos puntos las
          duraciones y las curvas son siempre las mismas. Scrollear rápido no
          acelera nada.
        </p>
        <p className="text-body-sm mt-4 max-w-[64ch] text-gray-intermediate">
          Todas se revierten al volver hacia arriba, y a mayor velocidad de la
          que entraron. La 08 rasteriza el texto a una textura WebGL.
        </p>
      </Container>

      <MuralGallery specs={TRIGGER_VARIANTS} blocks={BLOCKS} />
    </main>
  );
}
