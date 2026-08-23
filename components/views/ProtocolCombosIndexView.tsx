import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";

// Índice de los combos — /prototype/protocol-combo
//
// Cinco heroes sobrevivieron a los laboratorios y ninguno eligió lo que va
// debajo: las secciones 2 y 3 venían heredadas de la variante que las trajo. Acá
// cada hero se monta con una propuesta nueva para esas dos secciones, y la
// página sigue completa hasta el cierre — porque lo que hay que ver es qué le
// hacen al acto, no cómo se ven en una captura.

const COMBOS = [
  {
    id: "stair",
    hero: "C · Spectrum",
    name: "Stair",
    shape: "Seis escalones en diagonal",
    idea: "El trío de C es vertical tres pantallas seguidas. Acá las cifras bajan en escalera, cruzando la dirección del campo: la superficie es el fondo, no el molde. Cada escalón se lleva media pantalla de ancho.",
    risk: "La escalera impone un orden de lectura, y eso obliga a decidir qué cifra va primera. Si el orden actual no es el mejor argumento, se nota más que en una fila de seis.",
  },
  {
    id: "layerflow",
    hero: "C · layout claro",
    name: "Layerflow",
    shape: "Carriles paralelos · motor del hero de la home",
    idea: "El motor del hero de la homepage —punto de fuga, campo estirado, rampa de cinco tonos, grano— con el eje perpendicular al flujo partido en nueve capas. Cada una tiene su velocidad, su textura y su fase, así que las estrías no se continúan de una a la siguiente: carriles procesando en paralelo. Es el titular («the settlement layer») y la sección 3 («more shards, more throughput») dibujados.",
    risk: "Tiene mucho más recorrido tonal que Haze y eso es lo que le da presencia, pero también lo que puede pelearle al titular. La juntura entre capas se marca con luz y no con línea justamente para no meter un contorno en el fondo; si aun así las capas no se leen como capas, es follaje con rayas.",
  },
  {
    id: "mural",
    hero: "E · Field",
    name: "Mural",
    shape: "Seis franjas a escala de cartel",
    idea: "E es un campo de caracteres y su sección de números es «el momento en que el texto del fondo se vuelve texto de verdad» — pero lo resolvía a cuerpo de nota, el tamaño del ruido. Acá cada cifra ocupa una franja entera y las propiedades bajan a mono.",
    risk: "Invierte la jerarquía: la página pasa a sostenerse en sus números y no en su discurso. Si las tres propiedades se sienten abandonadas, la apuesta falló.",
  },
] as const;

export default function ProtocolCombosIndexView() {
  return (
    <main className="bg-cream text-foreground">
      <Container className="flex flex-col gap-16 pb-28 pt-[calc(var(--site-header-block)+4rem)]">
        <div className="flex max-w-[68ch] flex-col gap-6">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">
            Protocol · hero + secciones 2 y 3
          </p>
          <h1 className="text-h1 text-balance">
Tres maneras de <Accent display>abrir esta página</Accent>
          </h1>
          <p className="text-body-lg text-ink-soft text-pretty">
            Los heroes que sobrevivieron a los laboratorios llegaron con sus secciones 2 y 3
            heredadas — las trajo la variante que los trajo, nadie las eligió. Acá cada uno se monta
            con una propuesta propia para esas dos secciones: las seis cifras y «Built for AI
            scale». <strong>stair</strong> y <strong>layerflow</strong> comparten composición entera y
            cambian una sola variable, la superficie, para que la comparación mida el fondo y no
            otra cosa.
          </p>
          <p className="text-body text-gray-intermediate text-pretty">
            Eran siete. Se descartaron Ledger, Sustained, Haze y Board — están en el historial de
            git. Cada ruta trae la página <strong>entera</strong> y no las tres primeras
            pantallas, porque el riesgo de estas propuestas no es cómo se ven sino qué le hacen al
            acto — el bloque oscuro que es el centro de la página, y que una apertura demasiado
            fuerte deja sin efecto. Eso sólo se ve al llegar.
          </p>
        </div>

        <div className="flex flex-col">
          {COMBOS.map((c) => (
            <Link
              key={c.id}
              href={`/prototype/protocol-combo/${c.id}`}
              data-q-arrow-host
              className="grid-ds gap-y-5 border-t border-ink py-9 transition-colors duration-500 hover:bg-background"
            >
              <div className="col-span-full flex flex-col gap-2 lg:col-span-3">
                <span className="text-h3">{c.name}</span>
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  {c.hero}
                </span>
                <span className="uppercase text-micro-mono text-gray-intermediate">{c.shape}</span>
              </div>

              <p className="col-span-full max-w-[58ch] text-body text-ink-soft text-pretty lg:col-span-5">
                {c.idea}
              </p>

              <p className="col-span-full max-w-[48ch] text-body-sm text-gray-intermediate text-pretty lg:col-span-3">
                {c.risk}
              </p>

              <span className="col-span-full lg:col-span-1 lg:justify-self-end">
                <ArrowCircle />
              </span>
            </Link>
          ))}
          <span aria-hidden="true" className="block h-px bg-ink" />
        </div>

        <p className="max-w-[68ch] text-body-sm text-gray-intermediate text-pretty">
          Los heroes se importan de donde ya viven —{" "}
          <Link href="/prototype/protocol-a" className="underline underline-offset-4">
            /prototype/protocol-a
          </Link>
          ,{" "}
          <Link href="/prototype/protocol-heroes" className="underline underline-offset-4">
            /prototype/protocol-heroes
          </Link>{" "}
          y{" "}
          <Link href="/prototype/protocol-opening" className="underline underline-offset-4">
            /prototype/protocol-opening
          </Link>{" "}
          — así que ajustar uno allá lo ajusta acá. Lo que existe sólo en este laboratorio son las
          cinco propuestas de secciones 2 y 3.
        </p>
      </Container>
    </main>
  );
}
