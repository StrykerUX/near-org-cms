import { hexToRgb } from "@/components/sections/protocol-labs/opening-labs/gl/color";
import { HAZE_FRAG } from "@/components/sections/protocol-labs/opening-labs/gl/haze";
import { LAYERFLOW_FRAG } from "@/components/sections/protocol-labs/opening-labs/gl/layerflow";
import HeroGl from "@/components/sections/protocol-labs/combo-labs/HeroGl";
import ProofPeek, { PROOF_PEEK } from "@/components/sections/protocol-labs/combo-labs/ProofPeek";
import StairScale from "@/components/sections/protocol-labs/combo-labs/StairScale";

// Los dos heroes claros de C, y la escalera que comparten.
//
// ── Qué pregunta esta familia ─────────────────────────────────────────────
//
// Si la página necesita abrir en oscuro, y con qué superficie. Las dos rutas
// montan la MISMA composición —el layout de Spectrum, la misma escalera clara
// debajo, la misma página entera detrás— y cambian una sola variable: el fondo.
// Es la única manera de que la comparación mida la superficie y no otra cosa.
//
// ── Por qué ninguna de las dos es el espectro ─────────────────────────────
//
// El espectro de doce columnas se probó en claro y no funciona. El problema no
// era el color ni la velocidad: era que la superficie TIENE ESTRUCTURA, y la
// estructura compite con el texto aunque esté al 8% de contraste. Esta primera
// pantalla ya carga un titular, un cuerpo, una salida y seis cifras asomando —
// no le sobra atención para doce elementos más.
//
// Las dos alternativas de acá quitan la estructura por caminos distintos: una
// la disuelve del todo, la otra la reduce a seis planos que casi no se mueven.
// Las dos toman el método del hero de la homepage —degradé maestro, campo de
// ruido que lo abolla, grano de película— para que el fondo de Protocol y el de
// la home pertenezcan a la misma familia.

// ── HAZE ───────────────────────────────────────────────────────────────────
//
// La rampa arranca en un crema apenas más claro que el papel y cierra en un
// verde profundo pero desaturado. La distancia entre los cuatro tonos es corta a
// propósito: lo que tiene que percibirse es que hay volumen, no que hay colores.
//
// `u_gradAngle` a 2.1 radianes (~120°) manda la luz desde arriba a la izquierda
// y deja la esquina inferior derecha como la zona más densa — justo debajo del
// bloque de cuerpo y CTA, que es donde el texto agradece un fondo con algo de
// peso.
const HAZE_UNIFORMS = {
  u_c0: hexToRgb("#f7f6f3"),
  u_c1: hexToRgb("#eceee7"),
  u_c2: hexToRgb("#d7e3d8"),
  u_c3: hexToRgb("#b9d2c4"),
  u_scale: 1.15,
  u_gradAngle: 2.1,
  u_gradSpread: 1.05,
  // Menor que 1: estira la zona clara. Sin esto la mitad de la pantalla queda en
  // el tono más denso y el hero deja de leerse como claro.
  u_gradGamma: 0.85,
  u_mix: 0.55,
  u_lift: 0.02,
  // Doce milésimas por segundo. El campo tarda más de un minuto en cambiar de
  // forma de manera perceptible, que es el registro que se busca: nada que se
  // pueda seguir con la vista.
  u_drift: 0.012,
  u_grain: 0.016,
};

// ── LAYERFLOW ──────────────────────────────────────────────────────────────
//
// El preset arranca del que el hero de la home tiene horneado y se separa en
// tres puntos, cada uno por un motivo:
//
//   · **La paleta es clara.** La de la home va de un crema verdoso a un verde
//     casi negro; ésta recorre el mismo camino pero se detiene mucho antes,
//     porque debajo hay un titular en tinta y seis cifras asomando. El último
//     tono aparece sólo en la esquina superior derecha, lejos de todo el texto.
//     Ni el primero es blanco ni el último negro: esos dos topes son buena parte
//     de por qué la referencia se lee como película y no como degradé sintético.
//   · **La luz viene de abajo a la izquierda.** En la home entra por arriba; acá
//     el titular ocupa el tercio inferior izquierdo y necesita el papel más
//     limpio de la pantalla justo ahí.
//   · **El estirado es menor.** La home lo lleva a 3.4 y disuelve las estrías en
//     un degradé casi liso en el lado lejano. Acá hay que ver las CAPAS, y una
//     capa cuya textura se fundió del todo deja de distinguirse de su vecina.
const LAYERFLOW_UNIFORMS = {
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

  // Un nivel de 8 bits medido sobre el índice, no sobre el color: ver la nota
  // del shader sobre por qué no es 1/256.
  u_dither: 0.007,

  // De la luz a la sombra. Mismo recorrido que la home, con el rango recortado
  // para que el texto en tinta se sostenga encima.
  u_c0: hexToRgb("#f7f7ef"),
  u_c1: hexToRgb("#e6ecd2"),
  u_c2: hexToRgb("#c2d8b4"),
  u_c3: hexToRgb("#8fb894"),
  u_c4: hexToRgb("#4a7a63"),
};

export function HazeHero() {
  return (
    <HeroGl
      fragment={HAZE_FRAG}
      uniforms={HAZE_UNIFORMS}
      tag="combo-haze"
      fallback="#f2f2ef"
      tone="light"
      peek={PROOF_PEEK}
      footer={<ProofPeek tone="light" />}
    />
  );
}

export function LayersHero() {
  return (
    <HeroGl
      fragment={LAYERFLOW_FRAG}
      uniforms={LAYERFLOW_UNIFORMS}
      tag="combo-layerflow"
      fallback="#eef0e4"
      tone="light"
      // Buffer a resolución plena, contra el 0.6 que trae `GlSurface`. Aquel
      // valor está calibrado para superficies sin bordes —el follaje de la home
      // es blur puro y lo que se pierde al escalar no se ve—, y ésta tiene
      // estructura: nueve capas con su juntura y estrías finas. A 0.6 cada borde
      // diagonal muestra escalones, y el grano se cuantiza en bloques de dos
      // píxeles, con lo que deja de hacer de dither y el degradé bandea.
      //
      // Cuesta 2.8x en píxeles. Se compensa en parte bajando una octava del
      // detalle fino, que a resolución plena caía por debajo del píxel.
      renderScale={1}
      // 1:1 con la pantalla. El 1.75 que trae `GlSurface` obliga a un reescalado
      // fraccionario en cualquier display a dpr 2 — la interpolación reparte
      // cada píxel del buffer entre uno y dos de pantalla según dónde caiga, así
      // que el suavizado no es uniforme y los bordes diagonales quedan
      // escalonados de forma irregular. Con 2 no hay resampling en absoluto.
      maxDpr={2}
      // Velo de legibilidad, plano y sólo al pie: esta superficie tiene mucho
      // más recorrido tonal que Haze, y el bloque de cuerpo y salida cae sobre
      // la zona donde las estrías todavía tienen contraste. No llega al borde
      // inferior con el color de la sección siguiente — sería el degradé de
      // transición que este laboratorio no usa.
      veil="linear-gradient(to bottom, transparent 0%, transparent 46%, rgba(247,247,239,0.55) 74%, rgba(247,247,239,0.72) 100%)"
      peek={PROOF_PEEK}
      footer={<ProofPeek tone="light" />}
    />
  );
}

// Lo que va debajo del hero en las dos claras: «Built for AI scale», y nada más.
//
// ── Por qué NO va la escalera de cifras ───────────────────────────────────
//
// Porque las cifras ya aparecieron. Los dos heroes llevan `ProofPeek` al pie —
// las seis cortadas por el borde de la pantalla, subiendo de a una al
// scrollear—, así que la escalera las mostraba por segunda vez a dos pantallas
// de distancia.
//
// De las dos salidas posibles se tomó ésta: el asomo se queda con la evidencia y
// la escalera se va. El asomo llega antes, hace el trabajo de anunciar que la
// página sigue, y desarrollar las mismas seis cifras dos veces le quitaba a la
// primera aparición justamente lo que la hace funcionar.
//
// La versión oscura (`/prototype/protocol-combo/c`) conserva la escalera: su
// hero no trae cifras, y ahí es la única aparición de la evidencia antes del
// acto.
export default function SpectrumLightPair() {
  return <StairScale tone="light" proof={false} />;
}
