import type { Metadata } from "next";
import DescentTalla from "@/components/sections/lab/DescentTalla";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Approach B · el que puede eliminar la banda del todo. El gris no crece: la reja está
// completa desde el primer frame y el hero, apilado encima, va retirando su imagen con
// un recorte escalonado. Ver el docblock de `LabHeroCarve`.
//
// Seis perillas, y conviene saber cuál mover — las dos primeras son las que cambian el
// efecto, el resto afina:
//
//   `?depth=` — la profundidad de la FIGURA, en unidades de `--u`: cuánto mide cada
//               salto. Defecto 3 (saltos de una unidad `--u` = 268px, cascada a 45°);
//               producción es 1.5 (134px). Es la palanca real del escalonado y no cuesta
//               reencuadre, pero agranda la sección y hace que la escalera muerda más del
//               hero. Pasado ~3.2 el statement del hero queda sobre gris.
//   `?ease=`  — cómo se reparte el tallado. Defecto: una CustomEase de velocidades
//               3.4 / 0.7 / 1.0 —semirápida, lenta, semilenta—. `power2.out` y
//               `power3.inOut` sirven para comparar. Solo eases sin sobrepaso (ver la
//               nota de CARVE_EASE en LabHeroCarve).
//   `?stagger=` — el TAMAÑO DEL ESCALÓN. Escala el desfase entre arranques, y como la
//               velocidad es común, `salto = desfase × velocidad`. Defecto 1 = salto de
//               `depth/3`, o sea una unidad `--u`: la cascada a 45°. 1.5 da ~394px. 0
//               arranca todo junto y no hay escalera.
//   `?line=`  — DÓNDE se cierra la escalera, en fracción del alto de la ventana desde
//               arriba. Defecto 0.3. Es una línea de pantalla, no del documento: por eso
//               el encogimiento se ve. Más bajo le da margen a la formación y aprieta el
//               cierre contra el borde; más alto, al revés.
//   `?converge=0` — apaga el CIERRE del final: la escalera queda formada y solo traslada,
//               en vez de cerrarse en la línea.
//   `?drop=`  — cuánto cuelga la columna central, en unidades de `--u`. Defecto 0.5, y
//               es la CARA: reencuadra el hero, porque el vídeo tiene que crecer igual.
export default async function DescentTallaPage({
  searchParams,
}: {
  searchParams: Promise<{
    debug?: string;
    drop?: string;
    depth?: string;
    ease?: string;
    stagger?: string;
    converge?: string;
    line?: string;
  }>;
}) {
  const { debug, drop, depth, ease, stagger, converge, line } = await searchParams;
  // `>= 0` y no `> 0` en `drop` y `stagger`: `?drop=0` y `?stagger=0` son experimentos
  // válidos —el primero quita el excedente de vídeo, el segundo el relevo— y con `> 0` se
  // caían al defecto en silencio. Ausentes dan `Number(undefined) = NaN`, que no pasa el
  // `isFinite`, así que el defecto del componente sigue ganando cuando no vienen.
  const dropUnits = Number(drop);
  const depthUnits = Number(depth);
  const staggerValue = Number(stagger);
  const lineValue = Number(line);
  return (
    <DescentTalla
      debug={debug !== undefined}
      {...(Number.isFinite(dropUnits) && dropUnits >= 0 ? { drop: dropUnits } : {})}
      {...(Number.isFinite(depthUnits) && depthUnits > 0 ? { depth: depthUnits } : {})}
      {...(ease ? { carveEase: ease } : {})}
      {...(Number.isFinite(staggerValue) && staggerValue >= 0
        ? { stagger: staggerValue }
        : {})}
      {...(converge !== undefined ? { converge: converge !== "0" } : {})}
      {...(Number.isFinite(lineValue) && lineValue >= 0 && lineValue < 1
        ? { line: lineValue }
        : {})}
    />
  );
}
