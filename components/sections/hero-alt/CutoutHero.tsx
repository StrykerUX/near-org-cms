"use client";

import Container from "@/components/primitives/Container";
import CutoutCanvas from "@/components/sections/hero-alt/CutoutCanvas";

// ── 06 · Cutout ──────────────────────────────────────────────────────────────
//
// El clip de v5 —`hero-descent-v2.mp4`, los art-glass slabs— pero visible SOLO
// dentro de los glifos del titular. El descenso pasa por dentro de las letras
// sobre crema liso, conducido por el scroll con el mismo `videoScrub` y el
// mismo fps medido que usa la homepage.
//
// ── Por qué esto y no lo que hace v5 ────────────────────────────────────────
//
// v5 pone el video a pantalla completa y el titular encima, y de ahí salen sus
// dos problemas: el clip tiene que verse nítido a 2560×1440 —de ahí los 19MB—
// y el titular necesita dos velos de crema para poder leerse contra él.
//
// Recortado al texto, ninguno de los dos existe. La imagen nunca se ve a
// pantalla completa, así que la nitidez que hace falta es mucho menor (el clip
// de 1080p que hoy está en `public/` sin usar alcanzaría de sobra), y el
// titular no compite con nada porque ES la imagen.
//
// ── Lo que cuesta ───────────────────────────────────────────────────────────
//
// El mismo trato que las versiones 04 y 05: lo que se ve no es texto. Va el
// `<h1>` real como `sr-only` para el árbol de accesibilidad y los buscadores, y
// el titular hay que partirlo en líneas a mano porque un canvas no hace wrap.
//
// A diferencia de la 04, acá el trato compra algo que también se puede medir:
// el hero deja de necesitar un asset de 19MB para verse bien.

const LINES = ["Own your", "world."] as const;

// El asset de v5, tal cual. El fps está medido con ffprobe sobre el archivo
// (24/1, 192 frames, 8.00s) y viaja con él: no hay forma de leerlo del
// navegador, y si el clip se re-encodea hay que actualizarlo a mano.
const SRC = "/prototype/v2/hero-descent-v2.mp4";
const POSTER = "/prototype/v2/hero-descent-v2-poster.jpg";
const FPS = 24;

// El respaldo que llena las letras hasta que el video decodifica su primer
// frame. Formato propio "offset color, offset color" — un `background-image` de
// CSS no se puede pasar a un canvas.
//
// Sin esto el titular es un agujero mientras el clip carga, y con 19MB ese
// "mientras" se nota.
const FILL = "0 #101010, 0.55 #1d3b32, 1 #00b96f";

// Tinte multiplicado sobre el frame. El clip son slabs de vidrio muy claros, y
// recortado a los glifos sobre crema el titular se quedaba en ~1.2:1 — "Own
// your", que es el tramo más brillante del descenso, directamente no se leía.
//
// Un gris verdoso y no un gris neutro: el neutro apaga el verde del clip y el
// titular queda de un gris sucio. Este mantiene el tiro de color del asset
// mientras baja el valor a algo que el crema pueda sostener.
const TINT = "#67766d";

export default function CutoutHero() {
  return (
    <section
      style={{ height: "100svh" }}
      className="relative flex flex-col overflow-hidden bg-cream text-foreground"
    >
      <CutoutCanvas
        lines={LINES}
        target="text"
        src={SRC}
        poster={POSTER}
        fps={FPS}
        fill={FILL}
        tint={TINT}
        fontScale={0.2}
      />

      <div aria-hidden="true" className="h-[var(--site-header-block)] shrink-0" />

      <Container className="relative z-[1] flex flex-1 flex-col items-center justify-end pb-16 text-center">
        {/* El titular real, para el árbol de accesibilidad y los buscadores. Lo
            que se ve es el recorte; esto es lo que ES. */}
        <h1 className="sr-only">Own your world.</h1>

        {/* La bajada sí va en el DOM y visible, y abajo: el titular recortado
            vive en el centro del viewport, que es donde el canvas lo dibuja. */}
        <p className="max-w-xl text-body-lg text-muted-foreground text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access
          all of DeFi from your own wallet.
        </p>
      </Container>
    </section>
  );
}
