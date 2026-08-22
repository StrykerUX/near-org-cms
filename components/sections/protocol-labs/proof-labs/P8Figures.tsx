"use client";

import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import {
  GreenCube,
  IsoFrame,
  SolidCube,
  WireCube,
  isoAt,
  plane,
  planeGrid,
} from "@/components/sections/protocol-labs/isoKit";
import DividerBand from "@/components/sections/protocol-labs/proof-labs/DividerBand";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// P8 · Figures — cada cifra con su dibujo.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// La página entera está construida con cubos isométricos: el acto central los usa
// para las seis capacidades, las tres propiedades los usan como viñeta, el cierre
// los muestra completos. La franja de prueba es lo único que no habla ese idioma
// — son seis números en una retícula y podrían ser de cualquier sitio.
//
// Esta variante los liga, en el mismo eje y con las mismas dos piezas (alambre =
// capacidad, verde = activo). El efecto buscado no es "más lindo": es que cuando
// el lector llegue al acto, ya haya visto estos cubos.
//
// ── La regla al dibujarlas: la figura DICE la cifra ────────────────────────
//
// Ninguna es un ícono decorativo. Diez shards son diez cubos y uno de ellos
// opaco; el bloque de 600ms es una fila con tres puestos llenos y dos por venir;
// la finalidad es el momento en que el bloque se cierra. Un dibujo que no se pueda
// leer contra su número es peor que ningún dibujo: agrega ruido y sugiere un
// significado que no está.
//
// La más difícil es el fee, y se resolvió por escala: un cubo mínimo contra el
// plano entero. Es la única figura cualitativa de las seis y la primera a revisar
// si algo no cierra.
//
// ── Qué cambió al volverse divider, y cuál es su límite ──────────────────
//
// Las figuras pasaron de bloque apilado sobre la cifra a ir AL LADO de ella, y de
// 80×56 a 56×40. Eso permite que las seis entren en el alto del divider, pero es
// justo donde esta variante empieza a jugarse: **el detalle isométrico tiene un
// piso**, y a este tamaño un cubo de arista 3px es una mancha. Es lo primero a
// mirar en pantalla; si no se leen, la variante no se salva achicándolas más.
//
// Las figuras NO se animan. Estos mismos cubos sí se mueven en el acto, donde
// tienen una pantalla entera. Seis micro-animaciones más seis contadores en una
// banda es la receta para que no se lea ninguno de los doce.

const iso = isoAt(28, 22);

/** 100% uptime — el plano completo, sin un solo hueco. */
function UptimeMark() {
  return (
    <IsoFrame viewBox="0 0 56 40" className="h-8 w-14 shrink-0">
      <path d={plane(iso, 16, 0)} className="stroke-ink/35" />
      <path d={planeGrid(iso, 16, 0, 3)} className="stroke-ink/15" />
      <GreenCube iso={iso} s={4} />
    </IsoFrame>
  );
}

/** 1M+ TPS — la plancha densa: mucho, en paralelo. */
function TpsMark() {
  return (
    <IsoFrame viewBox="0 0 56 40" className="h-8 w-14 shrink-0">
      {[-11, 0, 11].map((x) =>
        [-5.5, 5.5].map((y) => <GreenCube key={`${x}:${y}`} iso={iso} x={x} y={y} s={2.8} />)
      )}
    </IsoFrame>
  );
}

/** 600ms — la cadencia: tres puestos llenos y dos por venir, sobre una línea. */
function BlockMark() {
  return (
    <IsoFrame viewBox="0 0 56 40" className="h-8 w-14 shrink-0">
      <path d={`M ${iso(-19, 0, 0)} L ${iso(19, 0, 0)}`} className="stroke-ink/25" />
      {[-15, -7.5, 0].map((x) => (
        <GreenCube key={x} iso={iso} x={x} y={0} s={3} />
      ))}
      {[7.5, 15].map((x) => (
        <WireCube key={x} iso={iso} x={x} y={0} s={3} className="stroke-ink/30" />
      ))}
    </IsoFrame>
  );
}

/** 1.2s finality — el bloque que se cierra: sellado, ya no se toca. */
function FinalityMark() {
  return (
    <IsoFrame viewBox="0 0 56 40" className="h-8 w-14 shrink-0">
      <path d={plane(iso, 15, -8)} className="stroke-ink/20" />
      <GreenCube iso={iso} s={7} />
      <path d={`M ${iso(-12, -12, 20)} L ${iso(12, 12, 20)}`} className="stroke-cta-deep" />
    </IsoFrame>
  );
}

/** 10 shards — diez piezas, y una que no se ve por dentro. */
function ShardsMark() {
  return (
    <IsoFrame viewBox="0 0 56 40" className="h-8 w-14 shrink-0">
      {[-15, -5, 5, 15].map((x) =>
        [-4.5, 4.5].map((y) => (
          <WireCube key={`${x}:${y}`} iso={iso} x={x} y={y} s={2.6} className="stroke-ink/35" />
        ))
      )}
      <SolidCube iso={iso} x={0} y={15} s={3.2} className="text-ink" />
    </IsoFrame>
  );
}

/** <$0.002 — el costo, dicho por escala: mínimo contra el plano entero. */
function FeeMark() {
  return (
    <IsoFrame viewBox="0 0 56 40" className="h-8 w-14 shrink-0">
      <path d={plane(iso, 17, 0)} className="stroke-ink/25" />
      <path d={planeGrid(iso, 17, 0, 5)} className="stroke-ink/10" />
      <GreenCube iso={iso} x={-3} y={-3} s={1.6} />
    </IsoFrame>
  );
}

// Emparejadas por el `id` del contenido y no por posición: reordenar las cifras
// no puede desalinear los dibujos.
const MARKS: Record<string, () => React.ReactElement> = {
  uptime: UptimeMark,
  tps: TpsMark,
  block: BlockMark,
  finality: FinalityMark,
  shards: ShardsMark,
  fee: FeeMark,
};

export default function P8Figures() {
  const ref = useCountUp<HTMLDListElement>();

  return (
    <DividerBand>
      <dl ref={ref} className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        {PROOF.map((stat) => {
          const Mark = MARKS[stat.id];
          return (
            <div key={stat.id} className="flex items-center gap-3">
              {Mark && <Mark />}
              <div className="flex min-w-0 flex-col">
                <dd data-count={stat.value} className="text-h4 tabular-nums">
                  {stat.value}
                </dd>
                <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
              </div>
            </div>
          );
        })}
      </dl>
    </DividerBand>
  );
}
