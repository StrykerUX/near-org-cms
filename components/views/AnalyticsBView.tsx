import Hero from "@/components/sections/analytics-labs/b/Hero";
import DualCards from "@/components/sections/analytics-labs/b/DualCards";
import ToolsGrouped from "@/components/sections/analytics-labs/b/ToolsGrouped";
import Products from "@/components/sections/analytics-labs/b/Products";

// Proposal B · Signal — /prototype/analytics/b
//
// The page as an INSTRUMENT. Hero and figures on a single screen, two ambient
// figures demoted to a strip, a pair of cards with opposite tonal value, tools
// grouped by task, and the audience seam marked with a full-bleed band.
//
// **There is no §2 component:** the figures live inside the hero, on purpose.
// That is B's structural difference from A and C, and it is argued in
// `b/Hero.tsx`.
export default function AnalyticsBView() {
  return (
    <main className="flex flex-col bg-white text-foreground">
      <Hero />
      <DualCards />
      <ToolsGrouped />
      <Products />
    </main>
  );
}
