import FoundationHero from "@/components/sections/foundation/a/FoundationHero";
import Pillars from "@/components/sections/foundation/a/Pillars";
import Devolution from "@/components/sections/foundation/a/Devolution";
import Stiftung from "@/components/sections/foundation/a/Stiftung";
import Council from "@/components/sections/foundation/a/Council";
import Operations from "@/components/sections/foundation/a/Operations";
import Ecosystem from "@/components/sections/foundation/a/Ecosystem";
import Close from "@/components/sections/foundation/a/Close";

// Variant A of the NEAR Foundation page — «receding column». The header and
// the footer are NOT here: `app/prototype/layout.tsx` mounts both.
//
// The order is the copy deck's, and the thing to preserve if these are ever
// reordered is the STROKE, not the sections. `FoundationHero` lays one hairline
// across the full container, `Pillars` cuts it in three, and `Devolution` runs
// the same rule out to a tick — that is the page's whole argument, and it only
// works read in that order. `Close` carries what is left of it onto the ink.
//
// One ground change in the entire page, at the end. Cream is not a default
// here; it is what makes the single cut worth anything.
export default function FoundationAView() {
  return (
    <main className="flex flex-col bg-cream">
      <FoundationHero />
      <Pillars />
      <Devolution />
      <Stiftung />
      <Council />
      <Operations />
      <Ecosystem />
      <Close />
    </main>
  );
}
