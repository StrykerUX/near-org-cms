import NavPillV2 from "@/components/sections/home-v2/NavPillV2";
import HeroVideo from "@/components/sections/home-v2/HeroVideo";
import QuantumBars from "@/components/sections/home-v2/QuantumBars";
import OwnYourOwn from "@/components/sections/home-v2/OwnYourOwn";
import NearStack from "@/components/sections/home-v2/NearStack";
import ProofStepper from "@/components/sections/home-v2/ProofStepper";
import BelongsNewsletter from "@/components/sections/home-v2/BelongsNewsletter";
import CustomerStories from "@/components/sections/home-v2/CustomerStories";

// Cuatro secciones se COMPARTEN con /prototype/homepage en vez de duplicarse:
// el rebuild las dejó exactamente iguales, así que una copia en home-v2/ sería
// dos archivos idénticos divergiendo en silencio. Si alguna diverge, se copia a
// home-v2/ EN ESE MOMENTO — ver components/sections/home-v2/README.md.
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";
import PrototypeFooter from "@/components/sections/PrototypeFooter";

export default function HomepageV2View() {
  return (
    <>
      {/* Fuera del <main>: es fixed, no participa del flujo. */}
      <NavPillV2 />

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
        <PrototypeFooter />
      </main>
    </>
  );
}
