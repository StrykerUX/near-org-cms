import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";

// Índice del laboratorio de heroes — /prototype/protocol-heroes
//
// Ocho variantes para la primera pantalla de la página Protocol. Lo que se
// compara no es "cuál se ve mejor" sino tres decisiones que cada una toma
// distinto: dónde vive la evidencia, qué se agranda, y si el hero se mueve.
//
// La tabla de abajo es el resumen; el razonamiento completo de cada una está en
// su archivo, en `components/sections/protocol-labs/hero-labs/`.

const VARIANTS = [
  {
    id: "h1",
    name: "Ledger",
    proof: "dentro",
    motion: "ninguno",
    thesis: "Las seis cifras en columna, como asientos de un registro.",
    note: "El único hero del sitio sin una sola animación. La quietud es el argumento: lo que lleva cinco años corriendo no necesita presentarse moviéndose.",
  },
  {
    id: "h2",
    name: "Count",
    proof: "dentro",
    motion: "los números cuentan al entrar",
    thesis: "Marcador a sangre en el borde inferior; el titular ya está, los números llegan.",
    note: "Pone el movimiento sobre el argumento y no sobre la decoración. Con reduced-motion las cifras salen en su valor final.",
  },
  {
    id: "h3",
    name: "Threshold",
    proof: "fuera · barra pegada",
    motion: "el hero se despide con el scroll",
    thesis: "El hero declara y no argumenta: frase, línea y salida.",
    note: "La evidencia llega en el primer movimiento y se queda pegada bajo el nav un tramo. Riesgo: quien no scrollea no ve una cifra.",
  },
  {
    id: "h4",
    name: "Cut",
    proof: "fuera · banda asomando",
    motion: "ninguno",
    thesis: "El hero mide 78svh y la banda de cifras asoma cortada por el borde.",
    note: "El corte reemplaza a la flecha que rebota: no agrega un elemento para anunciar el contenido, deja que el contenido se anuncie.",
  },
  {
    id: "h5",
    name: "Index",
    proof: "fuera · banda",
    motion: "el cubo se enciende al recorrer",
    thesis: "En el lugar de las cifras, el índice de la página: las seis capacidades, enlazadas.",
    note: "La única que admite que la página es larga. Ayuda al lector que viene por una de las seis; riesgo de leerse como documentación.",
  },
  {
    id: "h6",
    name: "Field",
    proof: "dentro",
    motion: "el campo de shards, continuo",
    thesis: "Continuidad con lo publicado: el mismo campo generativo de /blockchain.",
    note: "Las cifras cuelgan a los costados del titular. A juzgar: si el fondo con textura se come seis datos chicos.",
  },
  {
    id: "h7",
    name: "Mural",
    proof: "fuera · banda",
    motion: "ninguno",
    thesis: "Se agranda la CATEGORÍA, no la afirmación: «agent economy» cruzando la página.",
    note: "Apuesta sobre qué pelea pelea la página. Depende de la banda de abajo: sola es un cartel sin argumento.",
  },
  {
    id: "h8",
    name: "Terminal",
    proof: "dentro · status line",
    motion: "el sheen recorriendo el titular",
    thesis: "El único hero oscuro; las cifras como lecturas de un sistema encendido.",
    note: "Cambia el ritmo de la página entera: con el hero en negro, el acto deja de ser una irrupción y hay que rehacer la alternancia detrás.",
  },
] as const;

export default function ProtocolHeroesIndexView() {
  return (
    <main className="bg-cream text-foreground">
      <Container className="flex flex-col gap-16 pb-28 pt-[calc(var(--site-header-block)+4rem)]">
        <div className="flex max-w-[64ch] flex-col gap-6">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">
            Protocol · hero variants
          </p>
          <h1 className="text-h1 text-balance">
            Ocho primeras <Accent display>pantallas</Accent>
          </h1>
          <p className="text-body-lg text-ink-soft text-pretty">
            Todas dicen lo mismo con las mismas palabras. Lo que cambia son tres decisiones: dónde
            vive la evidencia (dentro del hero o después), qué elemento se agranda, y si la pantalla
            se mueve. Cuatro llevan las seis cifras dentro y cuatro las sacan; cinco tienen
            movimiento propio y tres no.
          </p>
          <p className="text-body text-gray-intermediate text-pretty">
            Cada variante se ve sola y seguida de lo que va abajo en la página real — un hero se
            juzga por su juntura, no por su captura.
          </p>
        </div>

        <div className="flex flex-col">
          {VARIANTS.map((v) => (
            <Link
              key={v.id}
              href={`/prototype/protocol-heroes/${v.id}`}
              data-q-arrow-host
              className="grid-ds gap-y-5 border-t border-ink py-9 transition-colors duration-500 hover:bg-background"
            >
              <div className="col-span-full flex items-baseline gap-5 lg:col-span-3">
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  {v.id.toUpperCase()}
                </span>
                <span className="text-h3">{v.name}</span>
              </div>

              <p className="col-span-full max-w-[46ch] text-body text-ink-soft text-pretty lg:col-span-4">
                {v.thesis}
              </p>

              <p className="col-span-full max-w-[48ch] text-body-sm text-gray-intermediate text-pretty lg:col-span-3">
                {v.note}
              </p>

              <div className="col-span-full flex flex-col gap-1 lg:col-span-2">
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  Proof · {v.proof}
                </span>
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  Motion · {v.motion}
                </span>
              </div>

              <span className="col-span-full lg:hidden">
                <ArrowCircle />
              </span>
            </Link>
          ))}
          <span aria-hidden="true" className="block h-px bg-ink" />
        </div>

        <p className="max-w-[64ch] text-body-sm text-gray-intermediate text-pretty">
          La estructura elegida para la página está en{" "}
          <Link href="/prototype/protocol-a" className="underline underline-offset-4">
            /prototype/protocol-a
          </Link>
          , y su hero es una novena composición que no está en esta lista: titular a la izquierda
          y las seis cifras abajo a la derecha, cada una con su regla. La página publicada hoy es{" "}
          <code className="text-caption-mono">/blockchain</code>.
        </p>
      </Container>
    </main>
  );
}
