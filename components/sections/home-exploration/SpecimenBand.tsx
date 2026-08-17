import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

// La sección de relleno a cada lado de una transición del laboratorio.
//
// No es una sección de marketing y no pretende serlo: existe para que cada
// transición se vea CON una sección arriba y otra abajo, que es la única forma de
// juzgarla. Un bloque de transición mirado solo se ve siempre bien; lo que falla
// es la juntura con el color vecino.
//
// ── Por qué casi no tiene texto ──────────────────────────────────────────────
//
// Lo tuvo. Cada banda llevaba título y párrafo explicando la prueba, y el
// resultado fue que la explicación quedaba lejos de donde uno la busca (arriba del
// grupo) y encima competía con lo único que la banda tiene que mostrar: SU COLOR.
// La copy se mudó a `LabDivider`, que es el que abre cada prueba; acá quedó un
// caption que nombra el color, para poder verificar de un vistazo que coincide con
// el `from`/`to` de la transición vecina. Ese es el único error de uso posible del
// componente, así que se deja escrito en pantalla.
//
// Por qué mide 55svh: tiene que ser lo bastante alta para que el recorrido del
// ScrollTrigger de la transición entre completo —la entrada arranca con el bloque
// ENTERO en pantalla, o sea que necesita al menos el alto del bloque por encima
// (ver la invariante del recorrido en `PixelTransition`)— y lo bastante baja para
// que las cinco pruebas se puedan recorrer de una pasada comparando.
export type SpecimenBandProps = {
  /** Color de fondo. Tiene que coincidir con el `from`/`to` de la transición vecina. */
  bg: string;
  /** Color del texto. Lo elige quien llama, no la sección — `bg` puede ser claro u oscuro. */
  fg: string;
  /** Qué papel juega esta banda y con qué color. `Sección de abajo · stone` */
  caption: string;
};

export default function SpecimenBand({ bg, fg, caption }: SpecimenBandProps) {
  return (
    <section
      className="flex min-h-[55svh] items-center"
      style={{ backgroundColor: bg, color: fg }}
    >
      <Container>
        <Eyebrow className="opacity-40">{caption}</Eyebrow>
      </Container>
    </section>
  );
}
