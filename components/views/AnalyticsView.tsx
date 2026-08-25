import HeroX from "@/components/sections/hero-x/HeroX";
import CoreStats from "@/components/sections/analytics-labs/a/CoreStats";
import DualCards from "@/components/sections/analytics-labs/c/DualCards";
import ToolsIndex from "@/components/sections/analytics-labs/a/ToolsIndex";
import Products from "@/components/sections/analytics-labs/c/Products";
import Aperture from "@/components/sections/analytics-labs/a/Aperture";
import { EtpRows } from "@/components/sections/analytics-labs/a/Products";

// `/analytics` — la página real.
//
// ── De dónde sale ──────────────────────────────────────────────────────────
//
// De `AnalyticsMixView` (`/prototype/analytics/mix`), que es donde se armó la
// composición eligiendo sección por sección entre las propuestas A, B y C.
// COPIADA y no importada, por la regla del repo: el mix es un laboratorio y
// tiene que poder seguir moviéndose sin arrastrar a la página real.
//
// ── Los dos cambios contra el mix ──────────────────────────────────────────
//
// **§1 pasa a ser el hero común del sitio.** El mix monta `b/Hero`, que es una
// apertura propia de esta página; acá abre como las otras nueve.
//
// **§2 vuelve, y tiene que volver.** El hero de B contenía las cifras: montaba
// §1 y §2 en la misma pantalla —tres cifras promovidas más la tira ambiente— y
// por eso el mix deja el §2 vacío. El hero X no lleva ninguna cifra, así que
// sin un §2 esta página no enunciaría NINGUNA de las cinco del brief. Está
// escrito en la cabecera del mix, palabra por palabra: «If §1 is ever swapped
// for A or C, a §2 has to come back or the page states no figures at all».
//
// Se monta el de A y no el de C porque A muestra las CINCO y C promueve tres,
// dejando precio y shards en una nota al pie. Con el hero sin cifras, elegir C
// dejaría dos de las cinco sin enunciar en toda la página.
//
// ── El fondo cambió con el hero ────────────────────────────────────────────
//
// El mix corre sobre `bg-white` porque el hero de B abre en blanco. El hero X
// abre en crema, así que la página abre en crema: si no, el primer píxel debajo
// del hero es un corte de tono que nadie decidió.
//
// ── Lo que queda igual, y una costura conocida ─────────────────────────────
//
// §3+§4 (`c/DualCards`), §5 (`a/ToolsIndex`) y §6 (`c/Products` con la apertura
// de anillo y la tabla ETP de A) se montan tal cual.
//
// La costura de §5 viene heredada y sigue abierta: la pareja de C y la tabla de
// A son las dos `bg-cream`, así que las dos secciones se tocan sin nada en
// medio y se leen como un solo bloque largo. Arreglarlo es trabajo de
// composición sobre esta página —un cambio de fondo, un filete o aire— y no un
// cambio en ninguna de las dos secciones.
//
// `id="network-health"` vive dentro de `c/DualCards`. Ya no hay nada que lo
// enlace desde el hero —el indicador de estado de B se fue con él— pero el
// ancla se queda: es un destino válido y lo usan links de fuera de la página.
export default function AnalyticsView() {
  return (
    <main className="flex flex-col bg-cream text-foreground">
      <HeroX page="analytics" />

      {/* §2 — las CINCO cifras. Obligatorio desde que §1 dejó de llevarlas. */}
      <CoreStats />

      {/* §3 + §4 — la pareja de C, que es la que carga `id="network-health"`. */}
      <DualCards />

      {/* §5 — la tabla de herramientas de A. Ver la costura, arriba. */}
      <ToolsIndex />

      {/* §6 — la sección de C, rellenada desde A en dos ranuras. Las dos son
          slots de `c/Products`, así que la página propia de C no pasa ninguna y
          queda intacta.

          La figura va en `text-white/35` porque el fondo acá es `--ink`: el
          mismo valor que A usa sobre `--ink-slate`, así que las dos lecturas
          coinciden. */}
      <Products
        figure={<Aperture className="text-white/35" />}
        productList={<EtpRows />}
      />
    </main>
  );
}
