import HeroTuck from "@/components/sections/homepage-tuck/HeroTuck";
import StatementPlain from "@/components/sections/homepage-fold/StatementPlain";
import OwnYourOwn from "@/components/sections/homepage-shared/OwnYourOwn";
import StackAnchors from "@/components/sections/homepage-shared/StackAnchors";
import ProofRoster from "@/components/sections/homepage-tuck/ProofRoster";
import BelongsNewsletter from "@/components/sections/homepage-shared/BelongsNewsletter";
import TestimonialDeck from "@/components/sections/homepage-tuck/TestimonialDeck";
import GetIntoNear from "@/components/sections/homepage-tuck/GetIntoNear";
import CustomerStories from "@/components/sections/homepage-shared/CustomerStories";
import UpdatesList from "@/components/sections/homepage-shared/UpdatesList";

// /prototype/homepage-d — homepage-c con las seis pruebas en índice.
//
// Es la MISMA página que `HomepageCView`, sección por sección, con un solo
// cambio: donde aquella monta `ProofLedger` —la cifra gigante contra un eje—
// esta monta `ProofRoster`, donde lo que se lee es el verbo y la cifra aparece
// al pasar por encima.
//
// Que todo lo demás sea idéntico es lo que hace útil la comparación: cualquier
// diferencia entre las dos rutas es de ESA sección, por construcción. Si algún
// día hay que cambiar el resto de la página, se cambia en las dos o la
// comparación deja de medir nada.
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
export default function HomepageDView() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroTuck />
      {/* `topAir` porque acá arriba no hay crema al aire: está la tarjeta en
          la que el hero se guarda. Pegada a su borde, la frase se leía como el
          pie de esa tarjeta. En `homepage-b` la sección va sin aire — el
          porqué de las dos está en el prop. */}
      <StatementPlain topAir />
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
      {/* El único cambio contra `homepage-c`. Las seis pruebas dejan de
          encabezarse con su cifra y se encabezan con su verbo —Last, Scale,
          Connect…—; la cifra queda debajo, disponible al pasar por encima.

          Va en crema y no en el negro de la referencia de la que sale, por dos
          motivos: el stack cierra su caja negra sobre el papel justo encima
          —en negro, ese gesto se queda sin fondo contra el que recortarse— y
          porque esta ruta se mide contra `homepage-c`, que tiene la sección en
          crema. Cambiar el tono a la vez que la estructura habría dejado dos
          variables moviéndose juntas. La nota larga está en el componente. */}
      <ProofRoster />
      <CustomerStories />
      {/* Oculta: `PressCarousel` — la cinta de citas de prensa con logos
          (Venice, Abound, Brave, Zodl). Sale de esta ruta y sigue montada en
          `HomepageBView`. Para traerla de vuelta: importar
          `@/components/sections/homepage-shared/PressCarousel` y montarla acá.

          ⚠️ Ojo si vuelve: `TestimonialDeck`, más abajo, es la MISMA idea
          —testimonios de terceros— con otro acomodo. Las dos en la misma
          página se leen como el mismo bloque contado dos veces. */}
      <BelongsNewsletter />
      {/* El único tramo oscuro del final. Va después del newsletter porque es
          el cambio de VOZ: hasta acá la página viene hablando de NEAR en
          primera persona, y esto es lo que dijeron otros. La card de adelante
          del mazo y la cita gigante de la izquierda son la misma persona — el
          porqué está en el componente. */}
      <TestimonialDeck />
      {/* Y el cierre: las tres puertas de entrada. Va inmediatamente después
          del mazo porque es la contrapartida — ahí hablan otros, acá se le
          pide algo al visitante, y entre las dos cosas no debería haber nada.
          Vuelve al cream después del único tramo oscuro del final. */}
      <GetIntoNear />
      {/* Oculta: `LatestUpdates` — "The latest from NEAR", las tres cards de
          blog. Sale de esta ruta y sigue montada en `HomepageAView`. Para
          traerla de vuelta: importar
          `@/components/sections/LatestUpdates` y montarla acá. */}
      <UpdatesList />
    </main>
  );
}
