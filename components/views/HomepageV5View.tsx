import HeroVideo from "@/components/sections/home-v4/HeroVideo";
import QuantumBars from "@/components/sections/home-v4/QuantumBars";
import OwnYourOwn from "@/components/sections/home-v4/OwnYourOwn";
import NearStackV2 from "@/components/sections/home-v4/NearStackV2";
import ProofStepper from "@/components/sections/home-v4/ProofStepper";
import BelongsNewsletter from "@/components/sections/home-v4/BelongsNewsletter";
import CustomerStories from "@/components/sections/home-v4/CustomerStories";

// Fork de HomepageV4View con UNA divergencia: NearStackV2, la iteración del
// stack con anillos continuos detrás de la columna (copias de fondo sin
// máscara — ver el comentario en NearStackV2.tsx). v4 queda intacta como
// rollback; el resto de las secciones son las MISMAS instancias que en v4,
// no copias.
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

export default function HomepageV5View() {
  return (
    <main className="flex flex-col bg-cream">
      {/* Asset v2: art-glass slabs (hero-descent-19) — 1440p all-intra para el
          scrub (24fps/192f/8s, mismos números que el original), poster del
          frame 1 exacto. El default de HeroVideo sigue siendo el clip viejo
          (v4 intacta); el 1080p convive en public/ como fallback liviano. */}
      <HeroVideo
        subheading={false}
        src="/prototype/v2/hero-descent-v2.mp4"
        poster="/prototype/v2/hero-descent-v2-poster.jpg"
      />
      <QuantumBars />
      <OwnYourOwn />
      <NearStackV2 />
      <ProofStepper />
      <BelongsNewsletter />
      <CustomerStories />
      <TestimonialMarquee />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
