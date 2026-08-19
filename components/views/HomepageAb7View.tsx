import HeroVideo from "@/components/sections/home-ab7/HeroVideo";
import QuantumBars from "@/components/sections/home-ab7/QuantumBars";
import OwnYourOwn from "@/components/sections/home-ab7/OwnYourOwn";
import NearStackV2 from "@/components/sections/home-ab7/NearStackV2";
import ProofStepper from "@/components/sections/home-ab7/ProofStepper";
import BelongsNewsletter from "@/components/sections/home-ab7/BelongsNewsletter";
import CustomerStories from "@/components/sections/home-ab7/CustomerStories";

// Fork de HomepageAb6View. ab7 = ab6 con DOS cambios, los dos tomados de v5:
//
//  1. El HERO usa el clip nuevo (art-glass slabs, `hero-descent-v2.mp4`) en vez
//     del descenso viejo. Es un cambio de ASSET y nada más: el HeroVideo de ab7
//     sigue siendo el de ab6 —con su bajada y su intro por SplitText—, no el de
//     v5, que además apaga el subheading. El fps del clip nuevo es el mismo
//     (24/1, 192 frames en 8s, medido con ffprobe), así que la constante `FPS`
//     y la calibración de `CHASE` no se tocaron.
//  2. El STACK es `NearStackV2` (track de 320svh, anillos continuos detrás de
//     la columna), el de v5, en lugar del `NearStack` de ab6 (460svh). El
//     NearStack viejo NO se copió a esta carpeta: ab7 no lo usa y v5/ab6 lo
//     conservan cada una por su lado.
//
// El resto —QuantumBars, OwnYourOwn (con su reparto de drift por grupo),
// ProofStepper, BelongsNewsletter, CustomerStories— es ab6 tal cual.
// ab6 queda intacta como rollback.
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

export default function HomepageAb7View() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroVideo />
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
