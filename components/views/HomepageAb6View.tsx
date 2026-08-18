import HeroVideo from "@/components/sections/home-ab6/HeroVideo";
import QuantumBars from "@/components/sections/home-ab6/QuantumBars";
import OwnYourOwn from "@/components/sections/home-ab6/OwnYourOwn";
import NearStack from "@/components/sections/home-ab6/NearStack";
import ProofStepper from "@/components/sections/home-ab6/ProofStepper";
import BelongsNewsletter from "@/components/sections/home-ab6/BelongsNewsletter";
import CustomerStories from "@/components/sections/home-ab6/CustomerStories";

// Fork de HomepageV4View: ab6 monta las secciones de home-ab6/, que arrancan como
// copia de home-v4/ y van a divergir. v4 no se toca.
//
// Las cuatro de abajo siguen viniendo del catálogo compartido, igual que en v4:
// hoy son idénticas en las dos páginas, así que una copia en home-ab6/ serían dos
// archivos iguales divergiendo en silencio. Si alguna diverge, se copia a
// home-ab6/ EN ESE MOMENTO — ver components/sections/home-ab6/README.md.
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

export default function HomepageAb6View() {
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
