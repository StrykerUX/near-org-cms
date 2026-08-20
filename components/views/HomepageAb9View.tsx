import HeroVideo from "@/components/sections/home-ab9/HeroVideo";
import OwnYourOwn from "@/components/sections/home-ab9/OwnYourOwn";
import NearStackV2 from "@/components/sections/home-ab9/NearStackV2";
import ProofStepper from "@/components/sections/home-ab9/ProofStepper";
import BelongsNewsletter from "@/components/sections/home-ab9/BelongsNewsletter";
import CustomerStories from "@/components/sections/home-ab9/CustomerStories";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

// Fork de HomepageAb7View. ab9 = ab7 SIN ESCALERAS, en dos movimientos:
//
//  1. Fuera `QuantumBars`, la sección entera —no solo su animación—, y con ella
//     la copy que pintaba (`BARS_STATEMENT`), su geometría (`stairGeometry.ts`)
//     y la unidad de la juntura con el hero (`heroGeometry.ts`, que solo existía
//     para que las dos encastraran).
//  2. Fuera las dos `StairTransition` que encerraban la banda de
//     `BelongsNewsletter`. La banda corta recto contra sus vecinas.
//
// El PRIMITIVO no se tocó: `StairTransition` sigue en `components/primitives/` y
// lo siguen montando ab6, ab7, home-v4 y los newsletter-labs. El detalle de qué
// quedó colgando y qué no está en `components/sections/home-ab9/README.md`.
//
// ab7 queda intacta como rollback, y el resto del orden es el suyo tal cual.
export default function HomepageAb9View() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroVideo />
      <OwnYourOwn />
      <NearStackV2 />
      <ProofStepper />
      <BelongsNewsletter />
      <CustomerStories />
      <TestimonialMarquee />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
