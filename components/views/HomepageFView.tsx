import HeroFold from "@/components/sections/homepage-fold/HeroFold";
import StatementPlain from "@/components/sections/homepage-fold/StatementPlain";
import OwnYourOwn from "@/components/sections/homepage-e/OwnYourOwn";
import InkCurtain from "@/components/sections/homepage-e/InkCurtain";
import StackAnchors from "@/components/sections/homepage-e/StackAnchors";
import ProofDatum from "@/components/sections/homepage-e/ProofDatum";
import BelongsNewsletter from "@/components/sections/homepage-e/BelongsNewsletter";
import CustomerStories from "@/components/sections/homepage-e/CustomerStories";
import PressCarousel from "@/components/sections/homepage-e/PressCarousel";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/homepage-e/UpdatesList";

// /prototype/homepage-f — el pliegue del hero, variante `mask`.
//
// De la cintura para abajo es EXACTAMENTE `homepage-e`: monta sus secciones sin
// copiarlas, porque no es otra línea de diseño sino la misma con otro hero. Un
// ajuste en cualquiera de esas secciones se ve acá también, que es lo que se
// quiere mientras las tres se comparen entre sí.
//
// Lo único propio son las dos primeras secciones, y van juntas por necesidad:
// `HeroFold` no congela el scroll ni dispara ninguna secuencia, así que el
// statement no puede seguir siendo el `AgentEconomy` de la línea viva —que
// espera un evento del hero y sin él se queda invisible—. `StatementPlain` es
// esa misma frase como sección que se sostiene sola.
export default function HomepageFView() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroFold contain="mask" />
      <StatementPlain />
      <OwnYourOwn />
      <InkCurtain direction="down" />
      <StackAnchors />
      <InkCurtain direction="up" span={45} />
      <ProofDatum />
      <CustomerStories />
      <PressCarousel />
      <BelongsNewsletter />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
