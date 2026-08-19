import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import {
  SCROLL_VARIANTS,
  TRIGGER_VARIANTS,
  type MuralVariantSpec,
} from "@/components/sections/mural-labs/muralContent";

// El índice del lab: catorce variantes, dos rutas.
//
// La división no es por cantidad sino por la única distinción que estructura la
// comparación: **quién lleva el tiempo**. Mezcladas en una lista se terminarían
// comparando cosas que no compiten — una escena con curvas propias contra una
// que no puede tenerlas, porque su curva es el gesto del lector.
//
// Y hay un motivo técnico que empuja en la misma dirección: catorce bloques en
// una página son ~28 viewports y hasta tres contextos WebGL vivos a la vez.
// Chrome corta alrededor de dieciséis por página y empieza a descartar los más
// viejos sin avisar.

function Row({ spec, base }: { spec: MuralVariantSpec; base: string }) {
  return (
    <li>
      <Link
        href={`${base}#${spec.id}`}
        className="group grid gap-x-8 gap-y-3 border-t border-rule py-7 transition-colors hover:bg-stone/25 sm:grid-cols-[auto_11rem_1fr]"
      >
        <span className="text-caption text-gray-intermediate">{spec.index}</span>
        <span className="text-h4 group-hover:underline">
          {spec.title}
          {spec.gl && (
            <span className="text-caption ml-3 align-middle uppercase text-gray-intermediate">
              WebGL
            </span>
          )}
        </span>
        <span>
          <span className="text-caption uppercase text-gray-intermediate">{spec.technique}</span>
          <span className="text-body-sm mt-2 block max-w-[70ch] text-muted-foreground">
            {spec.bet}
          </span>
        </span>
      </Link>
    </li>
  );
}

export default function MuralLabIndexView() {
  return (
    <main className="bg-cream text-foreground">
      <Container as="header" className="pt-[calc(var(--site-header-block)+3rem)] pb-16">
        <Eyebrow className="text-gray-intermediate">Mural lab · 14 animaciones</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[20ch]">Una sección, catorce maneras de entrar</h1>
        <p className="text-body-lg mt-6 max-w-[64ch] text-muted-foreground">
          La Section #2 del diseño de Caro, catorce veces. El bloque es el mismo
          en todas —misma copy, mismo layout, mismo degradado— y lo único que
          cambia es la animación. Si el bloque cambiara, la comparación mediría
          dos cosas a la vez.
        </p>
        <p className="text-body-sm mt-4 max-w-[64ch] text-gray-intermediate">
          Tres de las catorce rasterizan el texto a una textura WebGL. Ese texto
          deja de ser texto en pantalla —no se selecciona ni se traduce— aunque
          el DOM real se conserva debajo para el árbol de accesibilidad. El
          detalle está en <code>MuralGl.tsx</code>.
        </p>
      </Container>

      <Container as="section" className="pb-20">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h2 className="text-h4">Trigger — la timeline lleva el tiempo</h2>
          <Link
            href="/prototype/mural-lab/triggered"
            className="text-label underline underline-offset-4"
          >
            Ver las 8 →
          </Link>
        </div>
        <p className="text-body-sm mt-2 max-w-[70ch] text-muted-foreground">
          El scroll decide cuándo empiezan y cuándo se deshacen. Entre esos dos
          puntos, duraciones y curvas propias — scrollear rápido no acelera nada.
        </p>
        <ul className="mt-8 border-b border-rule">
          {TRIGGER_VARIANTS.map((spec) => (
            <Row key={spec.id} spec={spec} base="/prototype/mural-lab/triggered" />
          ))}
        </ul>
      </Container>

      <Container as="section" className="pb-32">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h2 className="text-h4">Scroll — el progreso es el scroll</h2>
          <Link
            href="/prototype/mural-lab/scroll"
            className="text-label underline underline-offset-4"
          >
            Ver las 6 →
          </Link>
        </div>
        <p className="text-body-sm mt-2 max-w-[70ch] text-muted-foreground">
          Reversibles sin escribir la reversa e imposibles de desincronizar, con
          el ritmo puesto por el gesto de cada lector.
        </p>
        <ul className="mt-8 border-b border-rule">
          {SCROLL_VARIANTS.map((spec) => (
            <Row key={spec.id} spec={spec} base="/prototype/mural-lab/scroll" />
          ))}
        </ul>
      </Container>
    </main>
  );
}
