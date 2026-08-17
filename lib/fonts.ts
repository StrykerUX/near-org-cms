import localFont from "next/font/local";

// ── Geist, la sans del ADMIN ─────────────────────────────────────────────────
// Se declara acá y no se importa de `geist/font/sans` por una sola razón:
// `preload: false`.
//
// El paquete `geist` exporta la fuente ya instanciada, sin opciones, así que su
// loader emite `<link rel="preload" as="font">` en TODA página que tenga la
// variable en el árbol — y la variable vive en el `<html>` del layout raíz. O sea
// que cada página de marketing y cada post del blog precargaban 69KB de una
// fuente que solo usa `.admin-wrapper` (ver app/globals.css). Declarándola con
// next/font/local apuntando al mismo .woff2 del paquete, el `@font-face` sigue
// disponible para /admin y el preload desaparece del camino crítico público.
//
// El precio es la ruta a node_modules, que es frágil si `geist` reorganiza su
// dist. Si el build falla acá, es eso: comprobar
// `node_modules/geist/dist/fonts/geist-sans/`.
export const geistSans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  display: "swap",
  preload: false,
  weight: "100 900",
});

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

// ── PP Neue Montreal Mono, la monoespaciada ───────────────────────────────────
// Antes `--font-mono` no apuntaba a ninguna fuente propia: caía en
// `ui-monospace, Menlo` del sistema, así que los eyebrows, las fechas y los tags
// del blog rendían distinto en macOS, Windows y Linux. Los originales ya estaban
// en el repo desde el fork, sin usar.
//
// Solo DOS faces, contra las cuatro de la sans. Casi todos los usos de
// `font-mono` van en peso normal; los que no, se combinan con `text-eyebrow`,
// que es weight 500. Sin esa segunda face el navegador sintetiza el peso, y en
// una monoespaciada eso se nota más que en una proporcional porque engorda el
// trazo sin poder ensanchar el avance. Itálicas no van: no hay un solo uso.
//
// Ojo con lo de abajo si se compara con la sans: acá va `Regular`, no `Book`.
// No es una inconsistencia — es que en esta familia el 400 nominal existe de
// verdad, así que no hay por qué repetir el 350-declarado-400 de la sans.
// "Corregirlo" a Book por simetría daría un mono más liviano que su propio peso.
export const montrealMono = localFont({
  src: [
    {
      path: "../assets/fonts/montreal-mono/PPNeueMontrealMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/montreal-mono/PPNeueMontrealMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-montreal-mono",
  display: "swap",
});

// ── Kepler Std, la serif de acento ─────────────────────────────────────────────
// Antes venía de un kit de Typekit cargado con un <link> en el <head>, que la
// servía con `font-display: auto` — o sea bloqueando el paint hasta ~3s, y con un
// round-trip extra (DNS + TLS + el CSS del kit) antes de que el woff2 pudiera
// siquiera empezar a bajar. Acá next/font emite el @font-face inline y el
// <link rel="preload"> solo.
//
// Va CONDENSED en todos sus usos. Kepler Std trae condensed solo en Display y
// Subhead —no existe un master de texto condensado—, así que `--font-kepler`
// usa Condensed Subhead. No es un parche por falta de opción: alimenta escalas
// de 34 a 88px, y el master de texto está dibujado para 9–13pt mientras Subhead
// lo está para ~14–24pt. Es mejor encaje del que había.
//
// Dos familias y no una porque los masters ópticos son dibujos distintos, no
// dos tamaños del mismo. Cuál usa cada escala lo decide `--font-serif` /
// `--font-display` en app/globals.css.
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
// `preload: false` acá y NO en `keplerDisplay`, y la diferencia importa:
//
// El master Display es el que pinta `<Accent display>`, que está en el titular del
// hero de las dos páginas del rebuild — o sea dentro del LCP. Precargarlo es
// exactamente para lo que existe el preload.
//
// El master Subhead, en cambio, no aparece hasta la segunda sección
// (`text-body-serif` en ProofMarquee) y de ahí hacia abajo. Precargarlo son 77KB
// compitiendo por ancho de banda con el hero, para texto que el lector todavía no
// ve. Sin preload, el navegador lo pide al descubrir el texto que lo usa; el
// `display: "swap"` + `adjustFontFallback` de abajo es lo que evita que ese cambio
// se vea como un salto de layout.
export const kepler = localFont({
  src: [
    {
      path: "../assets/fonts/kepler/KeplerStd-CnSubh.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/kepler/KeplerStd-CnItSubh.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-kepler",
  display: "swap",
  preload: false,
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
  // Métricas del fallback ajustadas a la serif, no a Arial (el default de
  // next/font/local): con display:"swap" es lo que evita que el texto salte de
  // tamaño cuando la fuente real reemplaza a la de sistema.
  adjustFontFallback: "Times New Roman",
});

export const keplerDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/kepler/KeplerStd-CnDisp.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/kepler/KeplerStd-CnItDisp.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-kepler-display",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});
