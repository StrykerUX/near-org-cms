import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

// La sección de relleno entre dos transiciones del laboratorio.
//
// No es una sección de marketing y no pretende serlo: existe para que cada
// transición se vea CON una sección arriba y otra abajo, que es la única forma de
// juzgarla. Un bloque de transición mirado solo se ve siempre bien; lo que falla
// es la juntura con el color vecino.
//
// Por qué mide 62svh: tiene que ser lo bastante alta para que el recorrido del
// ScrollTrigger de la transición entre completo (ver la invariante del recorrido
// en `PixelTransition`), y lo bastante baja para que las cinco pruebas quepan en
// una página que se pueda recorrer de una pasada comparando.
export type SpecimenBandProps = {
  /** Color de fondo. Tiene que coincidir con el `from`/`to` de la transición vecina. */
  bg: string;
  /** Color del texto. Lo elige quien llama, no la sección — `bg` puede ser claro u oscuro. */
  fg: string;
  eyebrow: string;
  title: string;
  note: string;
};

export default function SpecimenBand({ bg, fg, eyebrow, title, note }: SpecimenBandProps) {
  return (
    <section
      className="flex min-h-[62svh] items-center"
      style={{ backgroundColor: bg, color: fg }}
    >
      <Container>
        <Eyebrow className="opacity-50">{eyebrow}</Eyebrow>
        <h2 className="text-h2 mt-4 max-w-[20ch]">{title}</h2>
        <p className="text-body mt-5 max-w-[58ch] opacity-70">{note}</p>
      </Container>
    </section>
  );
}
