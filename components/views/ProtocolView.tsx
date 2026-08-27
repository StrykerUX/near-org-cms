import { GridOverlay } from "@/components/primitives/Grid";
import HeroX from "@/components/sections/hero-x/HeroX";
import ProofRow from "@/components/sections/protocol-labs/ProofRow";
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

            La franja de cifras de arriba es OTRA sección del lab —`ProofRow`—
            y entra con ella. Estuvo un momento fuera con el argumento de que
            `ProtocolSpine` ya publicaba esas seis cifras en su encabezado; el
            argumento era falso en el único sentido que importa: ahí el `<p>`
            que las llevaba se quedaba en `opacity: 0` —su revelado no dispara
            dentro de esa sección pegada— así que las cifras estaban en el DOM
            y no las veía nadie. El lede se retiró y las cifras vuelven a tener
            su sección, que es de donde habían salido. */}
        <ProofRow />
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
