import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";

// Índice del laboratorio de heroes — /prototype/protocol-heroes
//
// Empezó con ocho variantes para la primera pantalla de Protocol, comparando
// tres decisiones que cada una tomaba distinto: dónde vive la evidencia, qué se
// agranda, y si el hero se mueve. Quedaron dos, y no como empate:
//
//   · **H4 · Cut** ganó y se copió a `protocol-labs/a/Hero.tsx`. Vive en la
//     página, no acá — por eso su fila apunta a `/prototype/protocol-a` y no a
//     una ruta de este lab, que ya no existe.
//   · **H2 · Count** se conservó como la alternativa viva.
//
// Las otras seis (Ledger, Threshold, Index, Field, Mural, Terminal) y la
// `ProofBand` que tres de ellas usaban se borraron; están completas en el
// historial de git, antes de esta limpieza.
//
// La tabla es el resumen; el razonamiento de H2 está en su archivo, en
// `components/sections/protocol-labs/hero-labs/`.

const VARIANTS = [
  {
    id: "h4",
    name: "Cut",
    href: "/prototype/protocol-a",
    proof: "fuera · banda asomando",
    motion: "ninguno",
    thesis: "El hero mide el alto completo y la banda de cifras abre la sección siguiente.",
    note: "ELEGIDA — es el hero de /prototype/protocol-a, y se ve ahí. Nació a 78svh, con la banda asomando cortada por el borde del viewport en vez de una flecha que rebota; al pasar a pantalla completa se perdió ese asomo y el archivo lo deja anotado.",
  },
  {
    id: "h2",
    name: "Count",
    href: "/prototype/protocol-heroes/h2",
    proof: "dentro",
    motion: "los números cuentan al entrar",
    thesis: "Marcador a sangre en el borde inferior; el titular ya está, los números llegan.",
    note: "Pone el movimiento sobre el argumento y no sobre la decoración. Con reduced-motion las cifras salen en su valor final.",
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
            Dos primeras <Accent display>pantallas</Accent>
          </h1>
          <p className="text-body-lg text-ink-soft text-pretty">
            Las dos dicen lo mismo con las mismas palabras. Lo que cambia son dos decisiones: dónde
            vive la evidencia —dentro del hero o después— y si la pantalla se mueve. Eran ocho; seis
            se descartaron.
          </p>
          <p className="text-body text-gray-intermediate text-pretty">
            Cada variante se ve seguida de lo que va abajo en la página real — un hero se juzga por
            su juntura, no por su captura.
          </p>
        </div>

        <div className="flex flex-col">
          {VARIANTS.map((v) => (
            <Link
              key={v.id}
              href={v.href}
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
          , y su hero es <strong>H4 · Cut</strong>, copiado de acá al elegirse — desde ese momento
          dejó de moverse con este laboratorio, y su copia del lab se borró. Las superficies que se
          le pueden poner encima están en{" "}
          <Link href="/prototype/protocol-opening" className="underline underline-offset-4">
            /prototype/protocol-opening
          </Link>
          . La página publicada hoy es <code className="text-caption-mono">/blockchain</code>.
        </p>
      </Container>
    </main>
  );
}
