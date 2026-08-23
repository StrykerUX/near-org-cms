import ScaleClaim from "@/components/sections/protocol-labs/a/ScaleClaim";
import H2Count from "@/components/sections/protocol-labs/hero-labs/H2Count";

// El hero H2 · Count, EN CONTEXTO — /prototype/protocol-heroes/h2
//
// ── Por qué se ve con lo que va abajo y no solo ────────────────────────────
//
// Un hero no se juzga aislado; se juzga por lo que pasa cuando termina — si la
// evidencia llega a tiempo, si el corte al contenido se siente, si el fondo
// siguiente pelea con el suyo. Por eso debajo va `ScaleClaim`, la sección real
// que lo sigue en `/prototype/protocol-a`, y no un placeholder.
//
// Su `proof` es `false`: H2 lleva las seis cifras DENTRO del hero, en el
// marcador a sangre del borde inferior, y repetirlas acá abajo rompería la
// lectura que la variante propone.
//
// ── Qué había acá antes ────────────────────────────────────────────────────
//
// Ocho variantes (H1…H8) y un `STAGE` que mapeaba cada una a dónde vivían sus
// cifras: dentro del hero, en una `ProofBand` propia, o abriendo `ScaleClaim`.
// De las ocho sobrevivieron dos y por caminos distintos: **H4 · Cut** se copió a
// `protocol-labs/a/Hero.tsx` al elegirse para la página —desde entonces vive
// ahí y el lab dejó de tener una copia— y **H2 · Count** se conservó como la
// alternativa viva. Las otras seis, la `ProofBand` y el mapa se borraron.
//
// Con un solo hero, la view dejó de recibir `id`: el `Record` de ocho entradas
// era un despachador de una sola línea, y un parámetro que solo admite un valor
// no despacha nada. La ruta la monta sin props.
//
// Lo borrado está completo en el historial de git, antes de esta limpieza.

export default function ProtocolHeroLabView() {
  return (
    <main>
      <H2Count />
      <ScaleClaim proof={false} />
    </main>
  );
}
