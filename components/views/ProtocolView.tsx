import { GridOverlay } from "@/components/primitives/Grid";
import HeroX from "@/components/sections/hero-x/HeroX";
import ScaleClaim from "@/components/sections/protocol-labs/ScaleClaim";
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
        {/* La segunda sección es la de `protocol-labs` y no
            `protocol/AiScale`, que decía lo mismo en tres columnas de texto
            con un filete arriba. Ésta lo dice en tres CARDS, cada una con su
            pieza isométrica, y el titular pasa a la columna izquierda con el
            cuerpo debajo en vez de repartirse en dos mitades.

            Se MONTA la del lab, no se copia. Es el mismo criterio que la home
            con `HomepageCView`: el mismo componente montado dos veces no puede
            divergir, que es lo único que la regla de «promover una variante»
            viene a evitar. Acá son cuatro montajes —`/protocol` y las tres
            propuestas— sobre la misma copy (`protocolContent.AI_SCALE`).

            ⚠️ La captura de `/prototype/protocol-a` que motivó el cambio trae
            además la franja de cifras de arriba (100% · 1M+ · 600ms · 1.2s ·
            10 · <$0.002). Ésa es OTRA sección del lab —`ProofRow`— y no entra:
            esta página ya publica esas mismas cifras más abajo, en
            `ProtocolSpine`. Montarla diría lo mismo dos veces en una pantalla
            y media. */}
        <ScaleClaim />
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
