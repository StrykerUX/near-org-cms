import NavPill from "@/components/sections/NavPill";
import HeroBanner from "@/components/sections/HeroBanner";
import QuantumRevealHeading from "@/components/sections/QuantumRevealHeading";
import ProofStats from "@/components/sections/ProofStats";
import VideoStory from "@/components/sections/VideoStory";
import StackShowcase from "@/components/sections/StackShowcase";
import FeatureCards from "@/components/sections/FeatureCards";
import ClosingCta from "@/components/sections/ClosingCta";
import TestimonialCards from "@/components/sections/TestimonialCards";
import CustomerStory from "@/components/sections/CustomerStory";
import LatestUpdates from "@/components/sections/LatestUpdates";
import OutroWordmark from "@/components/sections/OutroWordmark";

// Draft de la landing nueva de NEAR — secciones individuales compuestas para
// revisión visual conjunta en /prototype/homepage. Sin datos reales, sin
// conexión al CMS (ver el plan de esta sesión). CustomerStory se reusa tal
// cual del prototipo existente: su copy ya coincide con la captura.
export default function PrototypeHomepageView() {
  return (
    <main className="flex flex-col">
      <HeroBanner nav={<NavPill />} />
      <QuantumRevealHeading />
      <ProofStats />
      <VideoStory />
      <StackShowcase />
      <FeatureCards />
      <ClosingCta />
      <TestimonialCards />
      <CustomerStory />
      <LatestUpdates />
      <OutroWordmark />
    </main>
  );
}
