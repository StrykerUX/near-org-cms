import HeroVideo from "@/components/sections/home-ab9/HeroVideo";
import AgentEconomy from "@/components/sections/home-ab9/AgentEconomy";
import OwnYourOwn from "@/components/sections/home-ab9/OwnYourOwn";
import StackAnchors from "@/components/sections/home-ab9/StackAnchors";
import ProofDatum from "@/components/sections/home-ab9/ProofDatum";
import BelongsNewsletter from "@/components/sections/home-ab9/BelongsNewsletter";
import CustomerStories from "@/components/sections/home-ab9/CustomerStories";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/UpdatesList";

// Fork de HomepageAb7View. ab9 = ab7 SIN ESCALERAS, en dos movimientos:
//
//  1. Fuera `QuantumBars`, la sección entera —no solo su animación—, y con ella
//     su geometría (`stairGeometry.ts`) y la unidad de la juntura con el hero
//     (`heroGeometry.ts`, que solo existía para que las dos encastraran). En su
//     lugar, después del hero, va `AgentEconomy`: la misma frase sobre un card
//     negro con un campo de caracteres detrás, sin nada encastrado a la vecina.
//  2. Fuera las dos `StairTransition` que encerraban la banda de
//     `BelongsNewsletter`. La banda corta recto contra sus vecinas.
//  3. Fuera `ProofStepper`, y en su lugar `ProofDatum`: seis pruebas colgando
//     de un eje que cruza el ancho, alternando arriba y abajo, en vez de cinco
//     pasando de a una por un carril sticky de 325svh. Es la versión B del
//     laboratorio `sections/proof-alt/`, copiada acá con las fichas casi al
//     doble de ancho — el detalle está en el archivo.
//  4. Fuera `NearStackV2`, y en su lugar `StackAnchors`: el mismo ensamble
//     isométrico, pero con las cuatro capas escritas en las cuatro esquinas,
//     ancladas a la pieza de la que hablan, en vez de en una columna al lado.
//     Es la variante C del laboratorio `sections/stack-labs/`, con la ficha
//     rehecha según el prototipo.
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
      <AgentEconomy />
      <OwnYourOwn />
      <StackAnchors />
      <ProofDatum />
      <BelongsNewsletter />
      <CustomerStories />
      <TestimonialMarquee />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
