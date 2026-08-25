import HeroX from "@/components/sections/hero-x/HeroX";
import EcosystemDirectory from "@/components/sections/ecosystem/EcosystemDirectory";
import EcosystemClose from "@/components/sections/ecosystem/EcosystemClose";

// La composición de /ecosystem, en la dirección «escenario».
//
// Tres bloques y no más: es lo que el contenido REAL alcanza a sostener. La
// página existe porque el cierre de la Foundation prometía este link y daba 404,
// y llenarla de secciones inventadas para que pareciera terminada habría sido
// cambiar un 404 honesto por una página que afirma cosas que nadie dijo.
//
// El progreso de fondo es superficie → tinte → blanco: el terreno con shader
// abre, el directorio se apoya en el tinte que las celdas necesitan para no
// desaparecer (sobre blanco puro un `MediaFrame` claro pierde su borde), y el
// cierre se queda con el único blanco.
export default function EcosystemView() {
  return (
    <main className="flex flex-col bg-cream">
      {/* La apertura común de las nueve páginas del sitio. Reemplaza a
          `ecosystem/EcosystemHero`, que sigue en el árbol y ya
          no la monta nadie — se conserva a la espera de que el hero X se
          juzgue con las nueve páginas delante. El porqué del preset de
          esta página está en `hero-x/heroXPresets.ts`. */}
      <HeroX page="ecosystem" />
      <EcosystemDirectory />
      <EcosystemClose />
    </main>
  );
}
