import HeroTuck from "@/components/sections/homepage-tuck/HeroTuck";
import StatementPlain from "@/components/sections/homepage-fold/StatementPlain";
import OwnYourOwn from "@/components/sections/homepage-shared/OwnYourOwn";
import StackAnchors from "@/components/sections/homepage-shared/StackAnchors";
import ProofLedger from "@/components/sections/homepage-tuck/ProofLedger";
import BelongsNewsletter from "@/components/sections/homepage-shared/BelongsNewsletter";
import CustomerStories from "@/components/sections/homepage-shared/CustomerStories";
import PressCarousel from "@/components/sections/homepage-shared/PressCarousel";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/homepage-shared/UpdatesList";

// /prototype/homepage-c — el hero que se recoge.
//
// Dos gestos, y son el mismo leído en las dos direcciones:
//
//   El hero    ocupa la pantalla entera y se GUARDA en una caja (`HeroTuck`).
//   El stack   llega dentro de una caja y se ABRE a pantalla entera
//              (`StackAnchors frame`).
//
// Ninguno de los dos usa iconos, palabras que se transformen ni cortinas: lo
// único que se mueve es el encuadre. El stack conserva todo lo demás igual que
// en la línea viva — su propio encabezado, sus seis paradas y su pie.
export default function HomepageCView() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroTuck />
      <StatementPlain />
      <OwnYourOwn />
      {/* El stack, tal cual la línea viva —su propio encabezado, sus seis
          paradas, su pie— pero CONTENIDO EN UNA CAJA. Sube desde abajo
          recortado a una tarjeta, se abre a pantalla completa al plantarse, y
          al salir se vuelve a cerrar.
          
          Es el hero de esta misma ruta leído al revés: allá el hero se guarda
          en una caja, acá la caja se abre. Y por eso no hay cortina ni obertura
          en ninguna de las dos puntas — el gesto ES la transición.

          `headEntrance={false}` porque acá el encabezado no entra al plantarse
          la escena: ya está visible durante toda la apertura —es lo único que
          se ve— y lo que hace en ese tramo es subir a su sitio. De eso se
          encarga el modo `frame`. */}
      <StackAnchors frame headEntrance={false} />
      {/* Las seis pruebas van en LEDGER acá y no en el eje alternado de
          `homepage-shared/ProofDatum`, que sigue montado en `homepage-b`. Es
          una columna de renglones: cifra a la izquierda, cuerpo alineado a la
          derecha del bloque, y las dos pruebas sin número cerrando en pareja.
          El porqué de la estructura está en el propio componente. */}
      <ProofLedger />
      <CustomerStories />
      <PressCarousel />
      <BelongsNewsletter />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
