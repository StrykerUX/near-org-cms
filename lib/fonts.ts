import localFont from "next/font/local";

// ── PP Neue Montreal, la sans del sistema ────────────────────────────────────
// Los 4 archivos son subsets generados por scripts/fonts/build-webfonts.py, no
// los del vendor: 195KB contra 324KB. Se descartan cirílico y griego, 204
// codepoints para los que el sitio no tiene ni contenido ni plan; si algún día
// aparecen, caen a la fuente de sistema en vez de no dibujarse. Todo el latín
// se queda, incluido el vietnamita y los diacríticos combinables — Montreal
// renderiza lo que escriben los editores en el CMS, no solo copy que
// controlamos nosotros. Los originales completos están en
// assets/fonts/_originals/.
//
// Ojo con `Book`: es weight 350 declarado como 400, y en la familia existe un
// `Regular` que sí es 400. Viene así del fork y es deliberado (Book es más
// liviana en texto corrido), pero es la clase de línea que alguien "corrige" sin
// darse cuenta de que engorda el sitio entero.
export const montreal = localFont({
  src: [
    {
      path: "../assets/fonts/montreal/PPNeueMontreal-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/montreal/PPNeueMontreal-BookItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/montreal/PPNeueMontreal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/montreal/PPNeueMontreal-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-montreal",
  display: "swap",
});

// ── Kepler Std, la serif de acento ─────────────────────────────────────────────
// Antes venía de un kit de Typekit cargado con un <link> en el <head>, que la
// servía con `font-display: auto` — o sea bloqueando el paint hasta ~3s, y con un
// round-trip extra (DNS + TLS + el CSS del kit) antes de que el woff2 pudiera
// siquiera empezar a bajar. Acá next/font emite el @font-face inline y el
// <link rel="preload"> solo.
//
// Dos familias y no una porque Kepler tiene masters ópticos distintos: el de
// texto está dibujado para 9–13pt y el Display para 24pt+. Cuál usa cada escala
// lo decide `--font-serif` / `--font-display` en app/globals.css.
//
// Las itálicas van declaradas de verdad, no sintetizadas: `accent-serif` y
// `accent-display` son `font-style: italic` y son el uso más visible de Kepler en
// todo el sitio. Sin la face real el navegador inclina la romana, que a 128px se
// nota (la `a` itálica de Kepler es de una sola panza; la romana, de dos).
//
// Los .woff2 salen de los OTF comprados vía scripts/fonts/build-webfonts.py — ver
// docs/fonts.md para por qué los OTF no están en el repo.
//
// El `fallback` va repetido y no extraído a una const: next/font lo lee en tiempo
// de compilación con su propio parser, que exige literales explícitos ("Font
// loader values must be explicitly written literals") y revienta el build si ve
// una referencia a una variable.
export const kepler = localFont({
  src: [
    {
      path: "../assets/fonts/kepler/KeplerStd-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/kepler/KeplerStd-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-kepler",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
  // Métricas del fallback ajustadas a la serif, no a Arial (el default de
  // next/font/local): con display:"swap" es lo que evita que el texto salte de
  // tamaño cuando la fuente real reemplaza a la de sistema.
  adjustFontFallback: "Times New Roman",
});

export const keplerDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/kepler/KeplerStd-Disp.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/kepler/KeplerStd-ItDisp.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-kepler-display",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});
