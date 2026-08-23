import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";

// Índice del laboratorio de aperturas — /prototype/protocol-opening
//
// Tres maneras de abrir la página. Cada una es un TRÍO —hero, cifras y "Built
// for AI scale"— y no un hero suelto: la queja que las originó fue que el hero
// se veía plano, y un hero no se arregla solo si las dos secciones que le siguen
// lo dejan caer en el vacío.
//
// Lo que cambia entre ellas es la superficie y cómo se consume a lo largo de las
// tres secciones. Una trae shader y dos son texto en canvas.
//
// Eran siete. A · Lattice (retícula isométrica en fuga), B · Shards (Voronoi),
// D · Stack (planos SVG con paralaje) y F · Horizon (degradé cálido con grano)
// se borraron junto con sus shaders. Las tres que quedan son las que siguen en
// carrera; el resto está en el historial de git, antes de esta limpieza.

const OPENINGS = [
  {
    id: "c",
    name: "Spectrum",
    surface: "Shader · bandas verticales en interferencia",
    idea: "Una sola idea formal atraviesa las tres secciones: la columna. Bandas de luz en el hero, seis columnas para las seis cifras, tres columnas anchas en «Built for AI scale». La superficie no se retira: se convierte en el layout.",
    risk: "Es la más cercana a lo que ya hace Sui. Gana en energía y se juega el parecido.",
  },
  {
    id: "e",
    name: "Field",
    surface: "Canvas · retícula de caracteres con palabras escondidas",
    idea: "La superficie es texto: miles de celdas monoespaciadas donde están escritas SHARD, FINALITY, WITNESS, SIGNATURE entre ruido, encendidas por una onda diagonal lenta. Sale de la misma mono con la que está rotulada toda la página.",
    risk: "El campo de caracteres es un recurso muy usado en cripto. Lo que lo distingue acá es que las palabras son las de esta página y no ruido — y eso sólo funciona si se alcanzan a leer.",
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
            Tres maneras de <Accent display>abrir la página</Accent>
          </h1>
          <p className="text-body-lg text-ink-soft text-pretty">
            Cada una es un trío completo — hero, las seis cifras y «Built for AI scale» — y no un
            hero suelto. El hero se veía plano, pero un hero no se arregla solo si las dos secciones
            que le siguen lo dejan caer en el vacío: lo que cambia acá es la superficie y cómo se
            consume a lo largo de las tres.
          </p>
          <p className="text-body text-gray-intermediate text-pretty">
            Sin logos ni assets: una trae shader WebGL y dos son texto en canvas. Todas degradan
            a un cuadro fijo con{" "}
            <code className="text-caption-mono">prefers-reduced-motion</code> y a un color sólido si
            no hay WebGL2. Ninguna funde una sección con la siguiente: donde dos secciones comparten
            color, el corte lo marca un filete y no un degradé. Cada ruta monta además el acto
            oscuro debajo — dos de las tres abren en oscuro, y si le comen el rango se ve ahí y en
            ningún otro lado.
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
