import ChainHero from "@/components/sections/chain/ChainHero";
import WhyItMatters from "@/components/sections/chain/WhyItMatters";
import CapabilityStack from "@/components/sections/chain/CapabilityStack";
import ProofBand from "@/components/sections/chain/ProofBand";
import CompletePicture from "@/components/sections/chain/CompletePicture";
import ForwardTurn from "@/components/sections/chain/ForwardTurn";
import BuildersCta from "@/components/sections/chain/BuildersCta";

// The composition of /chain-abstraction. The header and footer are NOT here:
// `app/(motion)/layout.tsx` mounts both for every page in the group.
//
// The order is the copy deck's: position → promise → proof, then the four
// capabilities, then the evidence, then the convergence and the forward turn.
// The one thing to preserve if sections get reordered is the progression of
// ground: cream, cream, ink, cream, cream, WHITE, ink. The two dark sections
// are the page's hard cuts and land on its two least convenient claims — how it
// works, and who it is for next. The white one is the opposite gesture: it is
// the page's only lift, and it is where the argument stops and the section
// breathes. Putting anything between `ForwardTurn` and `BuildersCta`, or moving
// it off white, costs the page its exhale.
export default function ChainAbstractionView() {
  return (
    <main className="flex flex-col bg-cream">
      <ChainHero />
      <WhyItMatters />
      <CapabilityStack />
      <ProofBand />
      <CompletePicture />
      <ForwardTurn />
      <BuildersCta />
    </main>
  );
}
