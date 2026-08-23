import Hero from "@/components/sections/homepage-a/Hero";
import AgentEconomy from "@/components/sections/homepage-a/AgentEconomy";
import OwnYourOwn from "@/components/sections/homepage-a/OwnYourOwn";
import StackAnchors from "@/components/sections/homepage-a/StackAnchors";
import ProofDatum from "@/components/sections/homepage-a/ProofDatum";
import BelongsNewsletter from "@/components/sections/homepage-a/BelongsNewsletter";
import CustomerStories from "@/components/sections/homepage-a/CustomerStories";
import PressCarousel from "@/components/sections/homepage-a/PressCarousel";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

// La composición de /prototype/homepage-a.
//
// Nació como clon exacto de HomepageAb9View —ab9 queda intacta como rollback— y
// desde entonces divergió: ver `components/sections/homepage-a/README.md`
// para qué cambió en cada sección y por qué. Este archivo solo decide el ORDEN;
// todo lo demás vive en las secciones.
//
// Sobre el orden: `Hero` y `AgentEconomy` NO son intercambiables con el resto.
// Están solapados por diseño —el hero no cuesta scroll y el statement arranca en
// el mismo punto del documento— y comparten una secuencia disparada por el
// primer gesto. Cualquier cosa metida entre los dos rompe el efecto.
export default function HomepageAView() {
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
