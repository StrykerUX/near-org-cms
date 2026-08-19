import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Link from "next/link";
import { SCROLL_VARIANTS } from "@/components/sections/mural-labs/muralContent";
import MuralScrub from "@/components/sections/mural-labs/MuralScrub";
import MuralWeave from "@/components/sections/mural-labs/MuralWeave";
import MuralZoom from "@/components/sections/mural-labs/MuralZoom";
import MuralRipple from "@/components/sections/mural-labs/MuralRipple";
import MuralPeel from "@/components/sections/mural-labs/MuralPeel";
import MuralMelt from "@/components/sections/mural-labs/MuralMelt";
import MuralGallery from "./MuralGallery";

// Las seis atadas al scroll. Mismo criterio de orden que la vista hermana.
const BLOCKS = [MuralScrub, MuralWeave, MuralZoom, MuralRipple, MuralPeel, MuralMelt];

export default function MuralScrollView() {
  return (
    <main className="flex flex-col bg-cream">
      <Container as="header" className="pt-[calc(var(--site-header-block)+3rem)] pb-16">
        <Link href="/prototype/mural-lab" className="text-label underline underline-offset-4">
          ← Mural lab
        </Link>
        <Eyebrow className="mt-6 text-gray-intermediate">Familia scroll · 6 variantes</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[20ch]">El progreso es el scroll</h1>
        <p className="text-body-lg mt-6 max-w-[64ch] text-muted-foreground">
          Seis tratamientos donde el avance de la animación ES la posición del
          scroll: reversibles sin escribir la reversa, imposibles de
          desincronizar, y con el ritmo puesto por el gesto de cada lector en
          vez de por el diseño.
        </p>
        <p className="text-body-sm mt-4 max-w-[64ch] text-gray-intermediate">
          La 12 es la excepción dentro de la familia: reacciona a la VELOCIDAD
          del scroll y no a su posición. Dos de las seis usan WebGL.
        </p>
      </Container>

      <MuralGallery specs={SCROLL_VARIANTS} blocks={BLOCKS} />
    </main>
  );
}
