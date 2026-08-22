import Hero from "@/components/sections/homepage-update/Hero";
import AgentEconomy from "@/components/sections/homepage-update/AgentEconomy";
import OwnYourOwn from "@/components/sections/homepage-update/OwnYourOwn";
import StackAnchors from "@/components/sections/homepage-update/StackAnchors";
import ProofDatum from "@/components/sections/homepage-update/ProofDatum";
import BelongsNewsletter from "@/components/sections/homepage-update/BelongsNewsletter";
import CustomerStories from "@/components/sections/homepage-update/CustomerStories";
import PressCarousel from "@/components/sections/homepage-update/PressCarousel";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

// Clon exacto de HomepageAb9View — punto de partida de la rama
// tweaks/layout-and-sticky-changes. ab9 queda intacta como rollback; los
// cambios de layout y sticky de esta rama se documentan acá a medida que
// entren.
export default function HomepageUpdateView() {
  return (
    <main className="flex flex-col bg-cream">
      <Hero />
      <AgentEconomy />
      <OwnYourOwn />
      <StackAnchors />
      <ProofDatum />
      <BelongsNewsletter />
      <CustomerStories />
      <PressCarousel />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
