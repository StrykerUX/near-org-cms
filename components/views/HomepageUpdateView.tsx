import Hero from "@/components/sections/homepage-update/Hero";
import AgentEconomy from "@/components/sections/homepage-update/AgentEconomy";
import OwnYourOwn from "@/components/sections/homepage-update/OwnYourOwn";
import StackAnchors from "@/components/sections/homepage-update/StackAnchors";
import ProofDatum from "@/components/sections/homepage-update/ProofDatum";
import BelongsNewsletter from "@/components/sections/homepage-update/BelongsNewsletter";
import CustomerStories from "@/components/sections/homepage-update/CustomerStories";
import PressCarousel from "@/components/sections/homepage-update/PressCarousel";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

// La composición de /prototype/homepage-update.
//
// Nació como clon exacto de HomepageAb9View —ab9 queda intacta como rollback— y
// desde entonces divergió: ver `components/sections/homepage-update/README.md`
// para qué cambió en cada sección y por qué. Este archivo solo decide el ORDEN;
// todo lo demás vive en las secciones.
//
// Sobre el orden: `Hero` y `AgentEconomy` NO son intercambiables con el resto.
// Están solapados por diseño —el hero no cuesta scroll y el statement arranca en
// el mismo punto del documento— y comparten una secuencia disparada por el
// primer gesto. Cualquier cosa metida entre los dos rompe el efecto.
export default function HomepageUpdateView() {
  return (
    <main className="flex flex-col bg-cream">
      <Hero />
      <AgentEconomy />
      <OwnYourOwn />
      <StackAnchors />
      <ProofDatum />
      <CustomerStories />
      <PressCarousel />
      {/* El newsletter baja hasta acá: estaba entre `ProofDatum` y las historias
          de clientes, o sea partiendo en dos el tramo de prueba social. Ahora
          cierra ese tramo y le entrega el paso al blog. */}
      <BelongsNewsletter />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
