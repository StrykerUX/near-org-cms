import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";

// Índice del laboratorio de aperturas — /prototype/protocol-opening
//
// Seis maneras de abrir la página. Cada una es un TRÍO —hero, cifras y "Built
// for AI scale"— y no un hero suelto: la queja que las originó fue que el hero
// se veía plano, y un hero no se arregla solo si las dos secciones que le siguen
// lo dejan caer en el vacío.
//
// Lo que cambia entre ellas es la superficie y cómo se consume a lo largo de las
// tres secciones. Cuatro traen shader, una es SVG puro y una es texto en canvas.

const OPENINGS = [
  {
    id: "a",
    name: "Lattice",
    surface: "Shader · retícula isométrica en perspectiva",
    idea: "Las tres secciones son un descenso: el hero flota sobre una retícula que se pierde en la profundidad, las cifras bajan a apoyarse casi al ras, y para «Built for AI scale» la superficie se agotó y queda el papel limpio.",
    risk: "Es el eje de 30° de la marca llevado a superficie, pero una retícula en perspectiva vive muy cerca del cliché de la grilla en fuga. Lo que la salva o la hunde es la inclinación.",
  },
  {
    id: "b",
    name: "Shards",
    surface: "Shader · campo de Voronoi que deriva",
    idea: "La única superficie que explica en vez de acompañar: un espacio partido en regiones que se redistribuyen es, literalmente, el tema de la página. Las cifras se meten cada una dentro de una región dibujada.",
    risk: "Un Voronoi es un recurso reconocible. Si se lee como «efecto de shader» y no como la red, pierde justo lo que la hace distinta de las otras cinco.",
  },
  {
    id: "c",
    name: "Spectrum",
    surface: "Shader · bandas verticales en interferencia",
    idea: "Una sola idea formal atraviesa las tres secciones: la columna. Bandas de luz en el hero, seis columnas para las seis cifras, tres columnas anchas en «Built for AI scale». La superficie no se retira: se convierte en el layout.",
    risk: "Es la más cercana a lo que ya hace Sui. Gana en energía y se juega el parecido.",
  },
  {
    id: "d",
    name: "Stack",
    surface: "SVG · cuatro planos isométricos con paralaje",
    idea: "Sin WebGL. Usa el material que la marca ya tiene —planos y cubos— a un tamaño que nunca se le dio: 900px en vez de 20. Pregunta si hacía falta inventar una superficie o alcanzaba con dejar de usar el lenguaje propio en miniatura.",
    risk: "Sin la densidad de un shader puede leerse simple al lado de las otras. Si aun así se sostiene, gana por peso, por edición y por funcionar sin GPU.",
  },
  {
    id: "e",
    name: "Field",
    surface: "Canvas · retícula de caracteres con palabras escondidas",
    idea: "La superficie es texto: miles de celdas monoespaciadas donde están escritas SHARD, FINALITY, WITNESS, SIGNATURE entre ruido, encendidas por una onda diagonal lenta. Sale de la misma mono con la que está rotulada toda la página.",
    risk: "El campo de caracteres es un recurso muy usado en cripto. Lo que lo distingue acá es que las palabras son las de esta página y no ruido — y eso sólo funciona si se alcanzan a leer.",
  },
  {
    id: "f",
    name: "Horizon",
    surface: "Shader · degradé profundo con banda de luz y grano",
    idea: "La única cálida. Las otras cinco son geométricas o tipográficas; ésta aporta lo que la foto de amanecer aporta a la portada de Ondo. El trío progresa de noche a día: hero oscuro, cifras sobre la línea de luz, «Built for AI scale» en pleno día.",
    risk: "La más bonita y la menos argumentada: no dice nada del protocolo. Si la primera pantalla tiene que trabajar, no es ésta.",
  },
  {
    id: "g",
    name: "Field claro",
    surface: "Canvas · el mismo campo de E, sobre crema",
    idea: "La superficie de E recalibrada para fondo claro: gris de tinta en reposo y verde legible en el frente de la onda. Pregunta otra cosa que las demás — ¿hace falta que la página abra en oscuro? Es la única que abre en el color de la marca y no en el negro genérico de la categoría.",
    risk: "Vuelve al fondo que se veía plano. La diferencia tiene que venir entera del campo: si a este tono no pesa lo suficiente, es el hero de antes con textura encima.",
  },
] as const;

export default function ProtocolOpeningsIndexView() {
  return (
    <main className="bg-cream text-foreground">
      <Container className="flex flex-col gap-16 pb-28 pt-[calc(var(--site-header-block)+4rem)]">
        <div className="flex max-w-[68ch] flex-col gap-6">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">
            Protocol · apertura
          </p>
          <h1 className="text-h1 text-balance">
            Siete maneras de <Accent display>abrir la página</Accent>
          </h1>
          <p className="text-body-lg text-ink-soft text-pretty">
            Cada una es un trío completo — hero, las seis cifras y «Built for AI scale» — y no un
            hero suelto. El hero se veía plano, pero un hero no se arregla solo si las dos secciones
            que le siguen lo dejan caer en el vacío: lo que cambia acá es la superficie y cómo se
            consume a lo largo de las tres.
          </p>
          <p className="text-body text-gray-intermediate text-pretty">
            Sin logos ni assets: cuatro traen shader WebGL, una es SVG puro y dos son texto en
            canvas. Todas degradan a un cuadro fijo con{" "}
            <code className="text-caption-mono">prefers-reduced-motion</code> y a un color sólido si
            no hay WebGL2. Ninguna funde una sección con la siguiente: donde dos secciones comparten
            color, el corte lo marca un filete y no un degradé. Cada ruta monta además el acto
            oscuro debajo — cinco de las siete abren en oscuro, y si le comen el rango se ve ahí y
            en ningún otro lado.
          </p>
        </div>

        <div className="flex flex-col">
          {OPENINGS.map((o) => (
            <Link
              key={o.id}
              href={`/prototype/protocol-opening/${o.id}`}
              data-q-arrow-host
              className="grid-ds gap-y-5 border-t border-ink py-9 transition-colors duration-500 hover:bg-background"
            >
              <div className="col-span-full flex flex-col gap-2 lg:col-span-3">
                <span className="flex items-baseline gap-4">
                  <span className="uppercase text-micro-mono text-gray-intermediate">
                    {o.id.toUpperCase()}
                  </span>
                  <span className="text-h3">{o.name}</span>
                </span>
                <span className="text-body-sm text-gray-intermediate">{o.surface}</span>
              </div>

              <p className="col-span-full max-w-[58ch] text-body text-ink-soft text-pretty lg:col-span-5">
                {o.idea}
              </p>

              <p className="col-span-full max-w-[48ch] text-body-sm text-gray-intermediate text-pretty lg:col-span-3">
                {o.risk}
              </p>

              <span className="col-span-full lg:col-span-1 lg:justify-self-end">
                <ArrowCircle />
              </span>
            </Link>
          ))}
          <span aria-hidden="true" className="block h-px bg-ink" />
        </div>
      </Container>
    </main>
  );
}
