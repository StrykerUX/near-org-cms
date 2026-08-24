import Hero from "@/components/sections/analytics-labs/c/Hero";
import CoreStats from "@/components/sections/analytics-labs/c/CoreStats";
import DualCards from "@/components/sections/analytics-labs/c/DualCards";
import ToolsMural from "@/components/sections/analytics-labs/c/ToolsMural";
import Products from "@/components/sections/analytics-labs/c/Products";

// Proposal C · Editorial — /prototype/analytics/c
//
// The page as READING. Large scale, plenty of air, one idea per screen, nothing
// boxed (no frames, no cards) and the only one of the three that reveals on
// entry. The hero background is the real revenue series, not a texture.
export default function AnalyticsCView() {
  return (
    <main className="flex flex-col bg-cream text-foreground">
      <Hero />
      <CoreStats />
      <DualCards />
      <ToolsMural />
      <Products />
    </main>
  );
}
