import { GridOverlay } from "@/components/primitives/Grid";
import HeroX from "@/components/sections/hero-x/HeroX";
import AiScale from "@/components/sections/protocol/AiScale";
import ProtocolSpine from "@/components/sections/protocol/ProtocolSpine";
import DeveloperBlock from "@/components/sections/protocol/DeveloperBlock";
import EcosystemStretch from "@/components/sections/protocol/EcosystemStretch";
import ContentGallery from "@/components/sections/protocol/ContentGallery";
import ClosingCta from "@/components/sections/protocol/ClosingCta";

// Composition for /protocol (was /prototype/protocol until the sitemap gave
// it its real URL). Content from the sitemap doc's Protocol
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
      <main>
        {/* La apertura común de las nueve páginas del sitio. Reemplaza a
            `protocol/ProtocolHero`, que sigue en el árbol y ya
            no la monta nadie — se conserva a la espera de que el hero X se
            juzgue con las nueve páginas delante. El porqué del preset de
            esta página está en `hero-x/heroXPresets.ts`. */}
        <HeroX page="protocol" />
        <AiScale />
        <ProtocolSpine />
        <DeveloperBlock />
        <EcosystemStretch />
        <ContentGallery />
        <ClosingCta />
      </main>
      <GridOverlay />
    </>
  );
}
