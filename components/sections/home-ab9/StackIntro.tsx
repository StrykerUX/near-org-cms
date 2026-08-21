import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { STACK_INTRO as COPY } from "@/components/sections/home-ab9/nearStackContent";

// El titular del stack, en su propia sección justo encima de `StackAnchors`.
//
// ── Por qué es una sección aparte y no el encabezado de la otra ─────────────
//
// En el laboratorio, esta misma copy vivía DENTRO de la variante, centrada
// arriba del arte. Ahí estorbaba: `StackAnchors` reparte cuatro fichas en las
// cuatro esquinas de un viewport pegado, y un quinto bloque de texto en el
// medio les come el alto a las cuatro justo donde son más frágiles.
//
// Afuera no cuesta nada. La sección de anclas mantiene su viewport completo
// para el arte, y el titular se lee ANTES —en scroll normal, sin competir con
// nada— que es como se lee un titular.
//
// El fondo es el mismo `bg-ink` que la vecina, a propósito: las dos se leen
// como un solo tramo negro de la página, y la juntura entre ellas no existe
// visualmente. Si esta llevara otro fondo, el titular se vería como una franja
// pegada encima del stack en vez de como su entrada.
export default function StackIntro() {
  return (
    <section className="bg-ink pb-8 pt-28 text-cream lg:pb-12 lg:pt-40">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-h1 text-balance">
          {COPY.lead} <Accent display>{COPY.accent}</Accent>
        </h2>
        <p className="max-w-[42ch] text-body-lg text-cream/70 text-balance">
          {COPY.sub}
        </p>
      </Container>
    </section>
  );
}
