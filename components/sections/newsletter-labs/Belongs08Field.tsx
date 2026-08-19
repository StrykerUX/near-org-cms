import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 08 · Field ───────────────────────────────────────────────────────────────
//
// Verde de marca de borde a borde y el wordmark en negativo. La única de las
// ocho que convierte esta banda en el PUNTO DE PARADA de la página en vez de un
// descanso entre dos secciones claras.
//
// ── Lo que hay que sopesar al mirarla ───────────────────────────────────────
//
// Es, de lejos, la que más se ve. Y esta sección es un formulario de newsletter:
// la pregunta no es si destaca —destaca— sino si MERECE destacar tanto en una
// página donde compite con el hero, el stack y las pruebas. Si la respuesta es
// que sí, esta es. Si es que no, la 05 hace lo mismo un 80% más callado.
//
// ── Todo en tinta, y no en crema ────────────────────────────────────────────
//
// `--near-green` es un verde CLARO, no un verde profundo. La primera pasada
// puso el titular y el párrafo en crema —el reflejo de "fondo de color ⇒ texto
// claro"— y el resultado era ilegible: crema sobre ese verde no llega ni a 2:1.
// Con tinta encima, el mismo verde sostiene el bloque entero sin tocar el color.
//
// El wordmark tampoco va invertido por lo mismo: en negativo desaparecía.
//
// ── El campo se queda blanco ────────────────────────────────────────────────
//
// La píldora de producción es clara con texto oscuro, y sobre el verde se lee
// como un objeto que FLOTA — que es exactamente lo que se busca acá.
export default function Belongs08Field() {
  return (
    <section className="bg-near-green py-24 text-ink lg:py-32">
      <Container className="flex flex-col items-center gap-9 text-center">
        <h2 className="flex flex-col items-center text-display text-ink text-pretty">
          <Wordmark height="clamp(2.8rem, 2rem + 4.4vw, 6.4rem)" className="mb-1" />
          <Accent display>{BELONGS_COPY.claim}</Accent>
        </h2>

        <p className="max-w-[44ch] text-body-lg text-ink/75 text-pretty">{BELONGS_COPY.body}</p>

        <div className="w-full max-w-[34rem]">
          <ShineField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </Container>
    </section>
  );
}
