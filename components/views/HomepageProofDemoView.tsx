import HeroVideo from "@/components/sections/home-ab7/HeroVideo";
import QuantumBars from "@/components/sections/home-ab7/QuantumBars";
import OwnYourOwn from "@/components/sections/home-ab7/OwnYourOwn";
import NearStackV2 from "@/components/sections/home-ab7/NearStackV2";
import BelongsNewsletter from "@/components/sections/home-ab7/BelongsNewsletter";
import CustomerStories from "@/components/sections/home-ab7/CustomerStories";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

import ProofDatum from "@/components/sections/proof-alt/ProofDatum";
import ProofIndex from "@/components/sections/proof-alt/ProofIndex";
import ProofColumns from "@/components/sections/proof-alt/ProofColumns";

// La homepage de ab7 con UNA sección cambiada: el `ProofStepper` (325svh de
// recorrido para cinco datos) sustituido por una de las tres candidatas.
//
// ── Esto es una COMPOSICIÓN, no un fork ─────────────────────────────────────
//
// Las nueve secciones que no cambian se importan de `home-ab7/` tal cual. No se
// copió ni un archivo.
//
// Es la diferencia con `home-ab6/` → `home-ab7/`, que sí son forks de carpeta:
// quince archivos duplicados, entre ellos `NearStackV2` (47KB), `QuantumBars`
// (33KB) y `OwnYourOwn` (32KB). El README de ab7 escribe el precio de eso —
// "un arreglo real en `home-ab6/` no llega solo acá"—, y tres demos más por esa
// vía serían cinco copias de cada sección divergiendo en silencio.
//
// La regla que sale de ahí, para la próxima demo: **si una demo necesita
// cambiar una sección compartida, a esa sección le falta una prop, no una
// copia.** Forkear la carpeta es la última opción, no la primera.
//
// ── Una view con una prop, y no tres views ──────────────────────────────────
//
// `HeroAltView` y `ProofAltView` escriben sus secciones a mano y no con un
// `.map()`, porque ahí la composición ES el contenido y tiene que leerse de un
// tirón. Acá no: las tres demos son la MISMA composición y la única variable es
// qué sección de prueba entra. Tres archivos idénticos salvo una línea
// divergirían en el primer ajuste al orden de las secciones, y entonces las
// demos ya no serían comparables — que es su único motivo de existir.
//
// El precio de esta decisión: si una demo llega a necesitar más de una
// diferencia, esto deja de servir y hay que partirlo en views de verdad. En ese
// momento, no antes.

export type ProofVariant = "datum" | "index" | "columns";

export type HomepageProofDemoViewProps = {
  proof: ProofVariant;
};

export default function HomepageProofDemoView({ proof }: HomepageProofDemoViewProps) {
  return (
    <main className="flex flex-col bg-cream">
      <HeroVideo />
      <QuantumBars />
      <OwnYourOwn />
      <NearStackV2 />

      {/* La única variable. Va exactamente donde estaba `ProofStepper`: después
          del negro del NEAR Stack y antes del stone de la newsletter, que es el
          contexto que decide si la sección funciona. */}
      {proof === "datum" && <ProofDatum />}
      {proof === "index" && <ProofIndex />}
      {proof === "columns" && <ProofColumns />}

      <BelongsNewsletter />
      <CustomerStories />
      <TestimonialMarquee />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
