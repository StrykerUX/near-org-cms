"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { HERO_SURFACE_FRAG } from "@/components/sections/protocol-labs/a/heroSurface";
import { hexToRgb } from "@/components/sections/protocol-labs/gl/color";
import GlSurface from "@/components/sections/protocol-labs/opening-labs/GlSurface";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// Sección 1 — el hero de la página.
//
// ── De dónde sale ─────────────────────────────────────────────────────────
//
// De `/prototype/protocol-combo/layerflow`, que ganó la comparación de combos.
// Copiado y no importado, por la regla del laboratorio: desde acá deja de
// moverse con él, y el lab queda como registro de dónde estaba el diseño.
//
// Reemplaza a la versión anterior —H4 · Cut, crema plano, sin superficie— que
// está en el historial de git. Lo que cambia no es sólo el fondo: el hero pasa a
// tener el layout de Spectrum (titular abajo a la izquierda, cuerpo y salida a
// la derecha, la mitad superior entera para la superficie) y las seis cifras
// vuelven a asomar por el borde inferior.
//
// ── El hero no lleva cifras ───────────────────────────────────────────────
//
// Las tuvo, asomando cortadas por el borde inferior: el hero medía
// `100svh + 7.5rem` y la fila entraba a opacidad baja, subiendo de a una al
// scrollear. Ahora son una sección propia (`ProofRow`), sin adornos y con su
// padding.
//
// El hero vuelve a medir exactamente una pantalla, y eso deja una consecuencia
// anotada: la primera pantalla no anuncia lo que sigue. Era lo que hacía el
// asomo —y antes que él, el corte a 78svh de H4— sin gastar una flecha ni un
// «scroll» en versalitas. Si el arranque se siente cerrado, es esto.
//
// El preset de la superficie. Arranca del que el hero de la home tiene horneado
// y se separa en tres puntos:
//
//   · **La paleta es clara.** La de la home va de un crema verdoso a un verde
//     casi negro; ésta recorre el mismo camino y se detiene mucho antes, porque
//     debajo hay un titular en tinta y seis cifras asomando. El tono más
//     profundo aparece sólo en la esquina superior derecha. Ni el primero es
//     blanco ni el último negro: esos dos topes son buena parte de por qué la
//     referencia se lee como película y no como degradé sintético.
//   · **La luz viene de abajo a la izquierda.** En la home entra por arriba; acá
//     el titular ocupa el tercio inferior izquierdo y necesita el papel más
//     limpio de la pantalla justo ahí.
//   · **El estirado es menor** (2.6 contra 3.4). La home disuelve las estrías en
//     un degradé casi liso en el lado lejano; acá hay que ver las CAPAS, y una
//     capa cuya textura se fundió deja de distinguirse de su vecina.
const SURFACE = {
  // Fuera del canvas a la derecha y algo por encima del centro: las estrías
  // apuntan hacia allá y barren la pantalla en diagonal.
  u_focus: [1.24, 0.62],
  u_scale: 3.1,
  u_curl: 1.25,
  u_curlScale: 1.05,
  u_blur: 2.6,
  u_detail: 0.68,
  u_detailFall: 1.35,
  u_contrast: 1.3,
  u_lift: 0.0,
  // ~35°: la sombra cierra arriba a la derecha, junto al foco, y la luz queda
  // abajo a la izquierda — debajo del titular.
  u_gradAngle: 0.62,
  u_gradSpread: 1.1,
  // Mayor que 1: aprieta la zona oscura contra su esquina y deja el grueso del
  // cuadro en los tonos claros.
  u_gradGamma: 1.55,
  u_gradMix: 0.36,
  u_grain: 0.032,
  // Lento. Es todo el movimiento que tiene la pantalla.
  u_drift: 0.035,

  // Nueve capas a lo ancho del campo. Menos y se leen como tres franjas
  // decorativas; más y el ancho de cada una baja del de sus propias estrías, con
  // lo que la estructura desaparece y vuelve a ser un solo campo.
  u_layers: 9.0,
  u_seam: 0.16,
  u_seamLift: 0.2,

  // Un nivel de 8 bits medido sobre el ÍNDICE de la rampa, no sobre el color:
  // el índice recorre 0..1 en cuatro tramos y cada tramo cubre la distancia
  // entre dos paradas, así que un nivel son ~0.006 y no 1/256.
  u_dither: 0.007,

  u_c0: hexToRgb("#f7f7ef"),
  u_c1: hexToRgb("#e6ecd2"),
  u_c2: hexToRgb("#c2d8b4"),
  u_c3: hexToRgb("#8fb894"),
  u_c4: hexToRgb("#4a7a63"),
};

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden pt-[var(--site-header-block)] text-foreground">
      <GlSurface
        fragment={HERO_SURFACE_FRAG}
        uniforms={SURFACE}
        tag="protocol-hero"
        fallback="#eef0e4"
        // Buffer a resolución plena, contra el 0.6 que trae `GlSurface`. Aquel
        // valor está calibrado para superficies SIN bordes —el follaje de la
        // home es blur puro y lo que se pierde al escalar no se ve— y ésta tiene
        // estructura: nueve capas con su juntura y estrías finas. A 0.6 cada
        // borde diagonal muestra escalones, y el grano se cuantiza en bloques de
        // dos píxeles, con lo que deja de hacer de dither y el degradé bandea.
        renderScale={1}
        // 1:1 con la pantalla. El tope de 1.75 obliga a un reescalado
        // FRACCIONARIO en cualquier display a dpr 2: la interpolación reparte
        // cada píxel del buffer entre uno y dos de pantalla según dónde caiga,
        // así que el suavizado no es uniforme y los bordes diagonales quedan
        // escalonados de forma irregular.
        maxDpr={2}
        className="absolute inset-0 z-0 h-full w-full"
      />

      {/* Velo de LEGIBILIDAD, plano y sólo al pie. El bloque de cuerpo y salida
          cae sobre la zona donde las estrías todavía tienen contraste. No llega
          al borde inferior con el color de la sección siguiente — eso sería un
          degradé de transición, y acá el corte entre secciones se ve. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 46%, rgba(247,247,239,0.55) 74%, rgba(247,247,239,0.72) 100%)",
        }}
      />

      <Container className="relative z-20 grid-ds items-end gap-y-8 pb-16">
        <div className="col-span-full flex flex-col gap-6 lg:col-span-7">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">{HERO.eyebrow}</p>
          <h1 className="text-h1 text-balance">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
        </div>
        <div className="col-span-full flex flex-col gap-6 lg:col-start-9 lg:col-span-4">
          <p className="max-w-[36ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>

    </section>
  );
}
