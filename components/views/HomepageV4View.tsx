import HeroVideo from "@/components/sections/home-v4/HeroVideo";
import QuantumBars from "@/components/sections/home-v4/QuantumBars";
import OwnYourOwn from "@/components/sections/home-v4/OwnYourOwn";
import NearStack from "@/components/sections/home-v4/NearStack";
import ProofStepper from "@/components/sections/home-v4/ProofStepper";
import BelongsNewsletter from "@/components/sections/home-v4/BelongsNewsletter";
import CustomerStories from "@/components/sections/home-v4/CustomerStories";

// Fork de HomepageV2View: v4 monta las secciones de home-v4/, que arrancan como
// copia de home-v2/ y van a divergir. v2 no se toca.
//
// Las cuatro de abajo siguen viniendo del catálogo compartido, igual que en v2:
// hoy son idénticas en las dos páginas, así que una copia en home-v4/ serían dos
// archivos iguales divergiendo en silencio. Si alguna diverge, se copia a
// home-v4/ EN ESE MOMENTO — ver components/sections/home-v4/README.md.
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

export default function HomepageV4View() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroVideo />
      <QuantumBars />
      <OwnYourOwn />
      <NearStack />
      <ProofStepper />
      <BelongsNewsletter />
      <CustomerStories />
      <TestimonialMarquee />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
