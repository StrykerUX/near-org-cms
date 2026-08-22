import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// Sección 1 — el hero de la página.
//
// Copiado de `hero-labs/H4Cut` al ganar la comparación de ocho variantes, y
// copiado y no importado por la regla del laboratorio: desde acá deja de moverse
// con el lab. El razonamiento de las ocho está en `../hero-labs/README.md`.
//
// ── Lo que se conserva de H4 y lo que se dejó ir ───────────────────────────
//
// De H4 queda su composición: el titular a la izquierda ocupando siete columnas,
// el cuerpo y la salida en las cuatro de la derecha alineados a la base del h1, y
// —la decisión importante— **las seis cifras fuera del hero**. El hero afirma; la
// prueba llega entera en el primer movimiento del lector, abriendo la sección
// siguiente (`ScaleClaim` con `proof="top"`).
//
// Lo que ya NO está es el mecanismo que le daba nombre. H4 medía 78svh para que
// la franja de cifras asomara cortada por el borde inferior de la pantalla: el
// hero anunciaba lo que venía sin gastar una flecha ni un "scroll" en versalitas.
// Con el hero a pantalla completa ese anuncio desaparece — la primera pantalla ya
// no dice que hay más, y el lector tiene que suponerlo.
//
// Es una decisión tomada, no un olvido. Vale registrar qué se cambió por qué:
// se gana la presencia de un hero de altura completa —el formato de
// `/quantum-security`, de `/blockchain` y de la homepage, así que también se gana
// consistencia con el resto del sitio— y se pierde la única variante de las ocho
// que resolvía el paso al contenido sin un elemento extra.
//
// Si alguna vez el arranque se siente cerrado, ese es el motivo, y `H4Cut` en
// `hero-labs/` sigue teniendo la versión con el corte.
//
// ── Sin animación de entrada ───────────────────────────────────────────────
//
// Server component, y a propósito. El hero aparece entero, como cualquier
// documento. De las ocho variantes, esta era la que apostaba a que la primera
// pantalla no necesita presentarse.
export default function Hero() {
  return (
    <section className="flex min-h-svh flex-col bg-cream pt-[var(--site-header-block)] text-foreground">
      <Container className="grid-ds flex-1 items-center gap-y-10 py-12">
        <div className="col-span-full flex flex-col gap-7 lg:col-span-7">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">{HERO.eyebrow}</p>
          <h1 className="text-h1 text-balance">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
        </div>

        {/* El cuerpo y la salida bajan al pie de su columna en vez de seguir al
            titular: el bloque queda alineado con la base del h1 y el hueco entre
            los dos deja respirar la mitad superior de la pantalla. */}
        <div className="col-span-full flex flex-col gap-7 lg:col-start-9 lg:col-span-4 lg:self-end lg:pb-2">
          <p className="max-w-[36ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
