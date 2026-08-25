import HeroX from "@/components/sections/hero-x/HeroX";
import GovernanceLayers from "@/components/sections/governance/GovernanceLayers";
import GovernanceDirection from "@/components/sections/governance/GovernanceDirection";
import GovernanceClose from "@/components/sections/governance/GovernanceClose";

// La composición de /governance, en la dirección «instrumento».
//
// Oscura de punta a punta, que es lo que define esa dirección, y con una sola
// excepción de encuadre: el remate sale del panel. La página encuadra todo lo
// que es mecanismo y deja fuera del marco lo único que es intención.
//
// `data-nav-dark` lo lleva el `<main>` y no cada sección: la página entera es
// oscura, así que un trigger alcanza donde si no harían falta cuatro.
export default function GovernanceView() {
  return (
    <main data-nav-dark className="flex flex-col bg-ink">
      {/* La apertura común de las nueve páginas del sitio. Reemplaza a
          `governance/GovernanceHero`, que sigue en el árbol y ya
          no la monta nadie — se conserva a la espera de que el hero X se
          juzgue con las nueve páginas delante. El porqué del preset de
          esta página está en `hero-x/heroXPresets.ts`. */}
      <HeroX page="governance" />
      <GovernanceLayers />
      <GovernanceDirection />
      <GovernanceClose />
    </main>
  );
}
