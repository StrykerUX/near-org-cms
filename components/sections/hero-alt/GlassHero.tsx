"use client";

import Container from "@/components/primitives/Container";
import GlassCanvas from "@/components/sections/hero-alt/GlassCanvas";

// ── 04 · Glass ───────────────────────────────────────────────────────────────
//
// El titular está DENTRO del vidrio, no delante. Es la única de las cinco donde
// el texto que se ve no es texto del DOM: se rasteriza a una textura y el
// shader lo refracta con el mismo campo de altura que dobla el fondo, con su
// aberración cromática en los bordes donde el gradiente es fuerte.
//
// La normal del vidrio sigue al puntero con inercia. No es un hover: es una
// lente que abulta la superficie donde está el cursor, así que el titular se
// deforma al pasarle por encima y vuelve solo.
//
// ── Lo que esta versión cuesta, dicho entero ────────────────────────────────
//
// El titular pintado NO es seleccionable, NO es traducible, NO lo lee un lector
// de pantalla y NO lo indexa nadie. Por eso el `<h1>` real está en el DOM como
// `sr-only`: el árbol de accesibilidad y los buscadores ven el titular
// completo, la pantalla ve la versión refractada.
//
// Esa duplicación es el trato de esta versión y hay que evaluarla como parte
// del diseño, no como un detalle de implementación. Si el trato no vale, la
// versión no vale — no hay forma de tener el efecto sin él.
//
// Y el trato tiene un tercer costo: el titular hay que partirlo en líneas a
// mano (LINES abajo). Un canvas 2D no hace wrap; con una traducción más larga,
// o una ventana angosta, las líneas no se reacomodan solas como haría el DOM.

// Las líneas del titular, ya partidas. El punto va en la segunda, como en el
// original.
const LINES = ["Own your", "world."] as const;

// `[fondo arriba, fondo abajo, tinta]`. El crema y la tinta son los del DS, en
// literal: el shader recibe números y un `var()` sin resolver llega vacío.
const PALETTE = ["#F5F4F1", "#d8d6d0", "#101010"] as const;

const FALLBACK = "linear-gradient(to bottom, #F5F4F1 0%, #d8d6d0 100%)";

export default function GlassHero() {
  return (
    <section
      style={{ height: "100svh" }}
      className="relative flex flex-col overflow-hidden bg-cream text-foreground"
    >
      <GlassCanvas lines={LINES} palette={PALETTE} fallback={FALLBACK} ior={1.15} />

      <div aria-hidden="true" className="h-[var(--site-header-block)] shrink-0" />

      <Container className="relative z-[1] flex flex-1 flex-col items-end justify-end pb-16 text-right">
        {/* El titular real, para el árbol de accesibilidad y para los
            buscadores. Lo que se ve es la textura; esto es lo que ES. */}
        <h1 className="sr-only">Own your world.</h1>

        {/* La bajada SÍ va en el DOM y visible. El canvas ya se lleva el
            titular, y llevarse también el cuerpo dejaría la sección entera sin
            un solo texto real — con el titular es un trato, con todo sería una
            imagen con forma de página.

            Va abajo a la derecha y no centrada: el centro es donde el vidrio
            tiene su lente y donde vive el titular refractado. Un párrafo ahí
            competiría con los dos. */}
        <p className="max-w-sm text-body-lg text-foreground/70 text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access
          all of DeFi from your own wallet.
        </p>
      </Container>
    </section>
  );
}
