import { GridOverlay } from "@/components/primitives/Grid";
import NavPillQuantum from "@/components/sections/quantum/NavPillQuantum";
import PrototypeFooter from "@/components/sections/PrototypeFooter";
import ProtocolHero from "@/components/sections/protocol/ProtocolHero";
import AiScale from "@/components/sections/protocol/AiScale";
import ProtocolSpine from "@/components/sections/protocol/ProtocolSpine";
import DeveloperBlock from "@/components/sections/protocol/DeveloperBlock";
import EcosystemStretch from "@/components/sections/protocol/EcosystemStretch";
import ContentGallery from "@/components/sections/protocol/ContentGallery";
import ClosingCta from "@/components/sections/protocol/ClosingCta";

// Composition for /prototype/protocol. Content from the sitemap doc's Protocol
// tab; direction in docs/protocol-page-brief.md.
//
// The order below is the doc's, with one regrouping: sections 4/7/9 are pulled
// together into the dark act and 5/6/8 into the compact row, because six
// consecutive full-width feature blocks is a spec sheet rather than a page.
// Nothing is cut and nothing is reworded.
//
// Pacing — the property the quantum page has and the first draft of this one
// did not. Light and dark alternate; loud and quiet alternate; nothing loud
// follows anything loud:
//
//   hero          loud    cream + field
//   ai scale      medium  white
//   (la franja de proof ya no es sección: sus cifras viven como texto
//   secundario en el encabezado del acto oscuro — ver ProtocolSpine)
//   FEATURED ACT  loud    DARK, sticky, three beats
//   compact row   quiet   cream
//   developers    medium  white + dark editor
//   ecosystem     quiet   cream
//   gallery       medium  white
//   CLOSING       loud    DARK + field
export default function ProtocolView() {
  return (
    <>
      <NavPillQuantum />
      <main>
        <ProtocolHero />
        <AiScale />
        <ProtocolSpine />
        <DeveloperBlock />
        <EcosystemStretch />
        <ContentGallery />
        <ClosingCta />
      </main>
      <PrototypeFooter />
      <GridOverlay />
    </>
  );
}
