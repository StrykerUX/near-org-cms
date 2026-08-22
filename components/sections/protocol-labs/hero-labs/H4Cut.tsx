import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// H4 · Cut — prueba FUERA, sin movimiento propio.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// El hero mide 78svh y no una pantalla completa. Ese 22% que falta es todo el
// mecanismo: la banda de cifras que viene abajo asoma CORTADA por el borde
// inferior del viewport, así que la primera pantalla ya muestra que hay más y
// dónde está.
//
// Es la alternativa a los tres recursos con los que se resuelve normalmente lo
// mismo —una flecha que rebota, un "scroll" en versalitas, un degradado— y es
// mejor que los tres por la misma razón: no agrega un elemento para anunciar el
// contenido, deja que el contenido se anuncie solo. Es un patrón viejo y
// probado; en el repo, la homepage lo usa dejando que el fondo del hero sobresalga
// por abajo en vez de morir en un corte recto.
//
// ── Lo que hay que juzgar ──────────────────────────────────────────────────
//
// El número. A 78svh el corte cae sobre la primera línea de las cifras en un
// portátil de 800px y sobre la segunda en un monitor de 1200 — o sea que lo que
// asoma no es lo mismo en las dos pantallas. Si la banda tiene que asomar SIEMPRE
// por su primera línea, esto no puede ser un porcentaje: tiene que medirse contra
// el alto de la banda, y eso ya es JavaScript. Vale la pena solo si el gesto
// convence.
//
// Sin `"use client"`: no hay animación de entrada tampoco. El hero aparece
// entero, como cualquier documento.
export default function H4Cut() {
  return (
    <section
      // 78svh y no `min-h`: el hero tiene que poder ser MÁS CORTO que la
      // pantalla, que es justo lo que un `min-h-svh` impide.
      className="flex h-[78svh] flex-col bg-cream pt-[var(--site-header-block)] text-foreground"
    >
      <Container className="grid-ds flex-1 items-center gap-y-10 py-12">
        <div className="col-span-full flex flex-col gap-7 lg:col-span-7">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">{HERO.eyebrow}</p>
          <h1 className="text-h1 text-balance">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
        </div>

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
