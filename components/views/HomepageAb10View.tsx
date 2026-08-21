import Hero from "@/components/sections/home-ab10/Hero";
import AgentEconomy from "@/components/sections/home-ab10/AgentEconomy";
import OwnYourOwn from "@/components/sections/home-ab10/OwnYourOwn";
import StackAnchors from "@/components/sections/home-ab10/StackAnchors";
import ProofDatum from "@/components/sections/home-ab10/ProofDatum";
import BelongsNewsletter from "@/components/sections/home-ab10/BelongsNewsletter";
import CustomerStories from "@/components/sections/home-ab10/CustomerStories";
import PressCarousel from "@/components/sections/home-ab10/PressCarousel";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

// Clon exacto de HomepageAb9View — punto de partida de la rama
// tweaks/layout-and-sticky-changes. ab9 queda intacta como rollback; los
// cambios de layout y sticky de esta rama se documentan acá a medida que
// entren.
export default function HomepageAb10View() {
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
