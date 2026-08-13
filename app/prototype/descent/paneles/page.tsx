import type { Metadata } from "next";
import DescentPaneles from "@/components/sections/lab/DescentPaneles";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Paneles grises escalados por encima del hero, en vez del recorte de la imagen por debajo
// del gris que hace `/prototype/descent/talla`. Ver el docblock de `LabBarsPanels`.
//
// La ruta lleva DOS relojes, y `?flow=` los alterna. Las perillas de cada uno son
// distintas y no se pisan.
//
// ── Comunes a los dos ────────────────────────────────────────────────────────
//
//   `?flow=`      `cascade` (defecto) o `carve`. Cuál calcula la `y` de cada anillo.
//   `?drop=`      cuánto cuelga el panel central por debajo de la juntura al arrancar.
//                 Defecto 0.5. Es lo único que sigue costando reencuadre del vídeo.
//   `?line=`      dónde aterrizan los anillos, en fracción del alto de la ventana.
//                 Defecto 0 = el borde.
//   `?ease=`      curva GLOBAL sobre el progreso. En `carve` es la CustomEase de
//                 velocidades 3.4 / 0.7 / 1.0; en `cascade` el defecto es la identidad,
//                 porque ahí la forma vive en las curvas por anillo. Solo eases sin
//                 sobrepaso.
//   `?depth=`     profundidad de la figura en unidades de `--u`. En `carve` manda en el
//                 reloj; en los dos fija el recorrido del ScrollTrigger y el reposo.
//
// ── Solo `flow=carve` (el reloj original, para el A/B) ───────────────────────
//
//   `?stagger=`   tamaño del escalón, escalando el desfase entre arranques. Defecto 1.
//   `?converge=0` apaga el cierre: la escalera queda formada y solo traslada.
//
// ── Solo `flow=cascade` ──────────────────────────────────────────────────────
//
//   `?soft=`      radio del amortiguador de llegada, en `--u`. Defecto 0.25. Con 0 el
//                 final vuelve a ser el frenazo seco, que es la comparación que dice si
//                 el amortiguador está haciendo algo.
//   `?spread=`    desfase entre arranques, en progreso. Defecto 0.11. Es la perilla de
//                 "cuánta escalera": con 0 los cuatro salen juntos.
//   `?fast=`      velocidad de entrada del anillo EXTERIOR, en múltiplos de la del
//                 scroll. Defecto 2.9.
//   `?slow=`      ídem del CENTRAL. Defecto 1.35. Que `fast > slow` es la cascada.
//   `?settle=`    velocidad de llegada, común a los cuatro. Defecto 0.25; más bajo es
//                 más ease-out.
//   `?land=`      progreso en el que aterriza el último anillo. Defecto 0.92, o sea que
//                 el 8% final del recorrido es cola ya asentada.
//   `?lag=`       cuánto se adelanta el aterrizaje de cada anillo hacia afuera. Defecto
//                 0.02; con 0 los cuatro llegan exactamente juntos.

/**
 * Un número de la query dentro de un rango, o `undefined` para que gane el defecto del
 * componente.
 *
 * Los rangos son inclusivos a propósito: en casi todas estas perillas el CERO es
 * justamente la comparación que uno viene a hacer —`soft=0` es el frenazo seco, `spread=0`
 * la salida simultánea, `lag=0` el aterrizaje a la par—, y un `> 0` las dejaría caer al
 * defecto en silencio, que es la peor forma de fallar en un laboratorio: la URL dice una
 * cosa y la pantalla muestra otra.
 *
 * Ausente da `Number(undefined) = NaN`, que no pasa el `isFinite`.
 */
const num = (raw: string | undefined, min: number, max: number) => {
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max ? value : undefined;
};

/** La perilla, o nada, para poder esparcirla sin pisar el defecto del componente. */
const opt = <K extends string>(key: K, value: number | undefined): Partial<Record<K, number>> =>
  value === undefined ? {} : ({ [key]: value } as Record<K, number>);

export default async function DescentPanelesPage({
  searchParams,
}: {
  searchParams: Promise<{
    debug?: string;
    flow?: string;
    drop?: string;
    depth?: string;
    ease?: string;
    stagger?: string;
    converge?: string;
    line?: string;
    soft?: string;
    spread?: string;
    land?: string;
    lag?: string;
    fast?: string;
    slow?: string;
    settle?: string;
  }>;
}) {
  const params = await searchParams;
  const { debug, flow, ease, converge } = params;

  const knobs = {
    // Las tres del reloj original, con los mismos rangos de antes.
    ...opt("drop", num(params.drop, 0, Number.MAX_SAFE_INTEGER)),
    ...opt("depth", num(params.depth, Number.MIN_VALUE, Number.MAX_SAFE_INTEGER)),
    ...opt("stagger", num(params.stagger, 0, Number.MAX_SAFE_INTEGER)),
    // `line` acepta el 0, que además es el defecto: es el valor que hace aterrizar a los
    // anillos en el BORDE de la ventana, así que tiene que poder escribirse explícito.
    ...opt("line", num(params.line, 0, 0.999)),

    // Las de la cascada.
    ...opt("soft", num(params.soft, 0, 1)),
    ...opt("spread", num(params.spread, 0, 0.25)),
    // Por debajo de `land = 0.5` el aterrizaje cae en la primera mitad del recorrido y el
    // resto queda sin nada que mirar: eso no es un experimento, es una URL rota.
    ...opt("land", num(params.land, 0.5, 1)),
    ...opt("lag", num(params.lag, 0, 0.08)),
    // El piso de `fast`/`slow` es 1 y no 0: un anillo a menos de 1× la velocidad del
    // scroll BAJA en pantalla mientras uno scrollea hacia abajo, y eso se lee como que el
    // gris se desprende de la juntura, no como que va lento.
    ...opt("fast", num(params.fast, 1, 6)),
    ...opt("slow", num(params.slow, 1, 6)),
    ...opt("settle", num(params.settle, 0, 1)),
  };

  return (
    <DescentPaneles
      debug={debug !== undefined}
      flow={flow === "carve" ? "carve" : "cascade"}
      {...(ease ? { carveEase: ease } : {})}
      {...(converge !== undefined ? { converge: converge !== "0" } : {})}
      {...knobs}
    />
  );
}
