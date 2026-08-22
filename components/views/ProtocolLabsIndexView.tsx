import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";

// Índice de comparación de las tres alternativas de la página Protocol.
//
// Existe porque comparar tres páginas largas abriendo tres pestañas obliga a
// recordar de qué iba cada una. Acá está escrito qué apuesta cada dirección,
// qué gana y qué arriesga — que es lo que hay que tener delante al mirarlas.
//
// Las tres montan EL MISMO contenido (`sections/protocol-labs/protocolContent`).
// Lo que cambia es la estructura y la jerarquía, así que cualquier diferencia
// que se vea entre ellas es una diferencia de diseño y no de redacción.

const ALTERNATIVES = [
  {
    letter: "A",
    name: "Datasheet",
    href: "/prototype/protocol-a",
    thesis: "La evidencia primero.",
    hierarchy:
      "El titular comparte pantalla con las seis cifras, y todo lo que sigue explica cómo se sostienen. Las seis capacidades van como tabla de especificación, las seis filas abiertas a la vez.",
    wins: "Se escanea en diagonal, se comparan dos capacidades sin volver a scrollear, y funciona con Cmd+F.",
    risks: "Ningún momento memorable: nada tiene un instante propio. Y una página casi enteramente clara puede leerse fría.",
  },
  {
    letter: "B",
    name: "The Machine",
    href: "/prototype/protocol-b",
    thesis: "La mecánica primero.",
    hierarchy:
      "Una sola pieza isométrica abre en reposo, atraviesa el acto central cambiando de estado con cada capacidad, y cierra completa. Las cifras aparecen como telemetría del objeto.",
    wins: "Máxima memorabilidad, y dice con la forma lo que el texto afirma: las seis capacidades son un sistema, no una lista.",
    risks: "El acto sostiene el 40% de la página con una sola pieza. Para volver a la tercera capacidad hay que recorrerlo otra vez.",
  },
  {
    letter: "C",
    name: "The Argument",
    href: "/prototype/protocol-c",
    thesis: "La tesis primero.",
    hierarchy:
      "Tipografía como estructura: la frase a escala de cartel, la premisa a escala de manifiesto, las seis capacidades como entradas de un ensayo. Las cifras van al margen, como aparato de datos.",
    wins: "Es la que menos se parece a la página de cualquier otro protocolo, y la que menos depende de JavaScript.",
    risks: "Seis palabras a escala mural seguidas pueden leerse como seis carteles en vez de seis capítulos.",
  },
  {
    letter: "D",
    name: "La mezcla",
    href: "/prototype/protocol-d",
    thesis: "Afirmar con datos, después demostrar.",
    hierarchy:
      "La selección hecha sobre A y B: hero con las seis cifras, ecosistema y apéndice de A; propiedades, acto pegado, developers y cierre de B. Importa las secciones de las dos en vez de copiarlas — si A o B cambian, D cambia con ellas.",
    wins: "El hero prueba antes de explicar y el acto explica sin repetir cifras; se queda con el escaneo de A y con el momento de B.",
    risks: "Conviven dos ejes de composición (A alinea a la izquierda, B centra) y la retícula de columnas aparece una sola vez, en el hero, sin volver en el cierre.",
  },
] as const;

export default function ProtocolLabsIndexView() {
  return (
    <main className="bg-cream text-foreground">
      <Container className="flex flex-col gap-16 pb-28 pt-[calc(var(--site-header-block)+4rem)]">
        <div className="flex max-w-[62ch] flex-col gap-6">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">
            Protocol · design alternatives
          </p>
          <h1 className="text-h1 text-balance">
            Cuatro estructuras para <Accent display>la misma página</Accent>
          </h1>
          <p className="text-body-lg text-ink-soft text-pretty">
            Las cuatro montan el mismo contenido, palabra por palabra, desde un único módulo. Lo
            que cambia es la jerarquía: qué se ve primero, qué sostiene el peso de la página y qué
            papel juegan las seis cifras de prueba. D es la selección hecha sobre A y B, y a
            diferencia de las otras tres no tiene secciones propias: las importa de las dos.
          </p>
        </div>

        <div className="flex flex-col">
          {ALTERNATIVES.map((alt) => (
            <Link
              key={alt.letter}
              href={alt.href}
              data-q-arrow-host
              className="grid-ds gap-y-6 border-t border-ink py-10 transition-colors duration-500 hover:bg-background"
            >
              <div className="col-span-full flex items-baseline gap-5 lg:col-span-3">
                <span className="text-h1-serif italic text-green-ink">{alt.letter}</span>
                <div className="flex flex-col gap-1">
                  <span className="text-h3">{alt.name}</span>
                  <span className="text-body-sm text-gray-intermediate">{alt.thesis}</span>
                </div>
              </div>

              <p className="col-span-full max-w-[52ch] text-body text-ink-soft text-pretty lg:col-span-4">
                {alt.hierarchy}
              </p>

              <div className="col-span-full flex flex-col gap-4 lg:col-span-4">
                <p className="flex flex-col gap-1">
                  <span className="uppercase text-micro-mono text-gray-intermediate">Gana</span>
                  <span className="max-w-[46ch] text-body-sm text-pretty">{alt.wins}</span>
                </p>
                <p className="flex flex-col gap-1">
                  <span className="uppercase text-micro-mono text-gray-intermediate">Arriesga</span>
                  <span className="max-w-[46ch] text-body-sm text-gray-intermediate text-pretty">
                    {alt.risks}
                  </span>
                </p>
              </div>

              <span className="col-span-full lg:col-span-1 lg:justify-self-end">
                <ArrowCircle />
              </span>
            </Link>
          ))}
          <span aria-hidden="true" className="block h-px bg-ink" />
        </div>

        <p className="max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
          Referencia: la página viva es <code className="text-caption-mono">/blockchain</code>, con
          sus secciones en <code className="text-caption-mono">components/sections/protocol/</code>.
          Ninguna de estas cuatro la importa ni la modifica.
        </p>
      </Container>
    </main>
  );
}
