import Hero from "@/components/sections/homepage-e/Hero";
import AgentEconomy from "@/components/sections/homepage-e/AgentEconomy";
import OwnYourOwn from "@/components/sections/homepage-e/OwnYourOwn";
import StackAnchors from "@/components/sections/homepage-e/StackAnchors";
import InkCurtain from "@/components/sections/homepage-e/InkCurtain";
import ProofDatum from "@/components/sections/homepage-e/ProofDatum";
import BelongsNewsletter from "@/components/sections/homepage-e/BelongsNewsletter";
import CustomerStories from "@/components/sections/homepage-e/CustomerStories";
import PressCarousel from "@/components/sections/homepage-e/PressCarousel";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/homepage-e/UpdatesList";

// La composición de /prototype/homepage-e.
//
// Duplicado de `HomepageUpdateView` del 2026-08-22 —la línea viva queda intacta
// como referencia y rollback—. Al nacer es idéntico: mismas secciones, mismo
// orden. Ver `components/sections/homepage-e/README.md`. Este archivo solo
// decide el ORDEN; todo lo demás vive en las secciones.
//
// Sobre el orden: `Hero` y `AgentEconomy` NO son intercambiables con el resto.
// Están solapados por diseño —el hero no cuesta scroll y el statement arranca en
// el mismo punto del documento— y comparten una secuencia disparada por el
// primer gesto. Cualquier cosa metida entre los dos rompe el efecto.
export default function HomepageEView() {
  return (
    <main className="flex flex-col bg-cream">
      <Hero />
      <AgentEconomy />
      <OwnYourOwn />
      {/* Las dos cortinas encierran el único tramo oscuro de la página: el
          negro sube tapando el crema, y al salir el crema sube tapando el
          negro. Son hermanas de las secciones que separan y no parte de ellas —
          `StackAnchors` mide su recorrido con un ScrollTrigger sobre su propia
          altura, y meterle el tramo adentro le estiraría las seis paradas. */}
      <InkCurtain direction="down" />
      <StackAnchors />
      <InkCurtain direction="up" span={45} />
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
