import Hero from "@/components/sections/analytics-labs/a/Hero";
import CoreStats from "@/components/sections/analytics-labs/a/CoreStats";
import DualCards from "@/components/sections/analytics-labs/a/DualCards";
import ToolsIndex from "@/components/sections/analytics-labs/a/ToolsIndex";
import Products from "@/components/sections/analytics-labs/a/Products";

// Proposal A · Ledger — /prototype/analytics/a
//
// The page as a DOCUMENT. High density, 1px rules, square corners, tables
// instead of card grids, and no animation at all. The section-by-section
// reasoning lives in each file; the comparative summary is in
// `components/sections/analytics-labs/README.md`.
//
// Every component is a server component: A ships no JavaScript of its own, and
// that is part of its thesis rather than an economy.
export default function AnalyticsAView() {
  return (
    <main className="flex flex-col bg-cream text-foreground">
      <Hero />
      <CoreStats />
      <DualCards />
      <ToolsIndex />
      <Products />
    </main>
  );
}
