"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { GreenCube, IsoFrame, WireCube, isoAt } from "@/components/sections/protocol-labs/isoKit";
import { CAPABILITIES, HERO } from "@/components/sections/protocol-labs/protocolContent";

// H5 · Index — prueba FUERA, con movimiento mínimo y funcional.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// En el lugar donde las otras variantes ponen las seis cifras, esta pone el
// ÍNDICE de la página: las seis capacidades del protocolo, numeradas, y cada una
// un enlace real a su bloque.
//
// El razonamiento es de uso, no de estilo. Esta página es larga y densa, y una
// parte grande de quien la abre no viene a que lo convenzan: viene por una de
// las seis cosas —resharding, el shard privado, chain signatures— y hoy no tiene
// forma de llegar sin recorrerla entera. Un índice arriba es lo que más ayuda a
// ese lector, y no le quita nada al otro.
//
// Es también la única variante donde el hero ADMITE que la página es larga en
// vez de disimularlo. Ese es el riesgo: un índice puede leerse como documentación
// y bajarle la temperatura a una página de marketing.
//
// ── El movimiento ──────────────────────────────────────────────────────────
//
// Uno solo, y sirve para algo: al recorrer una línea, su cubo pasa de alambre a
// lleno. Es el mismo cubo con el que está dibujado todo el material isométrico
// del sitio, así que la fila anticipa el lenguaje de las figuras que vienen
// abajo. No hay entrada animada ni nada más: en un índice, el movimiento que no
// indica estado es ruido.
//
// El estado se enciende por CSS (`group-hover` / `group-focus-within`), así que
// funciona con teclado y sin JavaScript.

const iso = isoAt(16, 20);

export default function H5Index() {
  return (
    <section className="flex min-h-svh flex-col bg-cream pt-[var(--site-header-block)] text-foreground">
      <Container className="grid-ds flex-1 items-center gap-y-16 py-20">
        <div className="col-span-full flex flex-col gap-8 lg:col-span-6">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">{HERO.eyebrow}</p>
          <h1 className="text-h1 text-balance">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
          <p className="max-w-[34ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>

        <nav
          aria-label="Protocol capabilities"
          className="col-span-full lg:col-start-8 lg:col-span-5"
        >
          <p className="pb-3 uppercase text-micro-mono text-gray-intermediate">
            {CAPABILITIES.length} capabilities
          </p>
          <ul>
            {CAPABILITIES.map((cap) => (
              <li key={cap.id}>
                <a
                  href={`#${cap.id}`}
                  className="group/idx flex items-center gap-4 border-t border-rule py-4 transition-colors duration-500 hover:border-ink"
                >
                  <span className="uppercase text-micro-mono text-gray-intermediate">
                    {cap.index}
                  </span>
                  {/* Dos cubos superpuestos y no uno que cambia de clase: son
                      dos dibujos distintos (alambre y lleno) y hacerlos aparecer
                      por opacidad los cruza en el mismo lugar, sin salto. */}
                  <span aria-hidden="true" className="relative size-5 shrink-0">
                    <IsoFrame
                      viewBox="0 0 32 32"
                      className="absolute inset-0 h-full w-full transition-opacity duration-300 group-hover/idx:opacity-0 group-focus-within/idx:opacity-0"
                    >
                      <WireCube iso={iso} s={9} className="stroke-ink/45" />
                    </IsoFrame>
                    <IsoFrame
                      viewBox="0 0 32 32"
                      className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover/idx:opacity-100 group-focus-within/idx:opacity-100"
                    >
                      <GreenCube iso={iso} s={9} />
                    </IsoFrame>
                  </span>
                  <span className="text-h4">{cap.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
