"use client";

import { CustomEase, gsap } from "@/components/primitives/motion/gsapClient";

// Laboratorio: las curvas candidatas para el ritmo de salida del hero.
//
// Vive en `sections/lab/` y no en `home-v2/` a propósito. Es un sandbox — mismo
// criterio que `views/FlowCompareView`: si esto y la implementación final divergen,
// no rompe nada de producción. Cuando gane un approach, lo que se lleve a
// `home-v2/` es la curva ganadora, no este archivo.
//
// ── El problema que estas curvas resuelven ───────────────────────────────────
// Hoy la salida del hero es lineal: `scrub: true` mapea scroll → progreso 1:1 y los
// tweens llevan `ease: "none"`. El hero sale a la velocidad del gesto de principio
// a fin. Lo que se busca es partirlo en dos actos — se resiste al principio, se
// suelta en un punto y acelera — para que el movimiento tenga peso.
//
// ── Cómo una curva se convierte en "resistencia" ─────────────────────────────
// Sin tocar el layout. Con un scroll de `s` píxeles el hero está naturalmente en
// `-s`; si queremos que su posición aparente sea `-f(s)` con `f` más lenta al
// principio, se le aplica un transform de compensación:
//
//     y = SPAN · (p − ease(p))
//
// Dos propiedades lo hacen seguro, y conviene tenerlas presentes porque son las que
// descartan toda una clase de bugs:
//
//  · `ease(0) = 0` y `ease(1) = 1`, así que `y` vale 0 en los dos extremos: la
//    composición arranca y termina exactamente donde el layout la puso.
//  · `ease(p) ≥ 0` implica `y ≤ SPAN·p`: el desplazamiento nunca supera el scroll
//    acumulado, así que el borde superior del hero no puede volver a entrar al
//    viewport.
//
// Lo que estas propiedades NO garantizan —y es lo que rompió el primer intento— es
// nada sobre lo que pasa DEBAJO del hero. Ver la nota de `CORE_IS_A_LID`.

// ── Las candidatas ───────────────────────────────────────────────────────────
// Medidas con node sobre un recorrido de 900px (≈100svh en una laptop), no elegidas
// a ojo:
//
//   curva                  a 90px   retención máx   quiebre   vel.final  vel.inicial
//   A suave                        194px (22%)     p=0.44     1.50×       0.01×
//   B media                  7px   247px (27%)     p=0.51     1.96×       0.01×
//   C marcada                      305px (34%)     p=0.57     2.58×       0.00×
//   D muy marcada                  378px (42%)     p=0.64     3.56×       0.00×
//   E arranque visible      26px   199px (22%)     p=0.53     1.95×       0.25×
//   F arranque claro        39px   190px (21%)     p=0.59     2.21×       0.41×
//
// · "retención máxima" = cuánto se queda atrás el hero respecto al scroll lineal.
// · "quiebre" = dónde deja de frenar y empieza a acelerar (donde ease'(p) = 1).
// · "a 90px" = cuánto se movió tras el primer décimo de scroll. Es el número que
//   decide si el arranque se lee como LENTO o como TRABADO.
//
// Cualquier bezier con el primer control point en y=0 arranca con velocidad CERO:
// de ahí el 0.01× de A a D. E y F suben la pendiente de salida sin tocar el resto
// del perfil.
export const CURVES = {
  a: { label: "A suave", cp: "0.40, 0, 0.70, 0.55" },
  b: { label: "B media", cp: "0.45, 0, 0.72, 0.45" },
  c: { label: "C marcada", cp: "0.50, 0, 0.75, 0.35" },
  d: { label: "D muy marcada", cp: "0.60, 0, 0.80, 0.28" },
  e: { label: "E arranque visible", cp: "0.42, 0.10, 0.72, 0.45" },
  f: { label: "F arranque claro", cp: "0.40, 0.16, 0.74, 0.42" },
} as const;

export type CurveKey = keyof typeof CURVES;

/** La que se usa por defecto en las tres rutas de approach. */
export const DEFAULT_CURVE: CurveKey = "b";

// Se registran las seis al cargar el módulo: son baratas y así el laboratorio puede
// cambiar de curva sin reconstruir nada.
for (const [key, { cp }] of Object.entries(CURVES)) {
  CustomEase.create(`descent-${key}`, cp);
}

export function descentEaseName(key: CurveKey): string {
  return `descent-${key}`;
}

/**
 * La curva como función. Se resuelve con `gsap.parseEase` en vez de reimplementar la
 * bezier: es la MISMA función que GSAP usa para los tweens que llevan ese `ease`, así
 * que lo que se mueve con aritmética y lo que se mueve con tweens no puede
 * desincronizarse por una diferencia de implementación.
 */
export function descentFn(key: CurveKey): (p: number) => number {
  return gsap.parseEase(descentEaseName(key)) as (p: number) => number;
}

/** El desplazamiento de compensación en píxeles. `hold` en la jerga de este módulo. */
export function descentHold(
  progress: number,
  spanPx: number,
  ease: (p: number) => number,
  intensity = 1
): number {
  return spanPx * (progress - ease(progress)) * intensity;
}

/**
 * ── La lección del intento fallido, para no repetirla ────────────────────────
 *
 * El primer intento aplicó la curva al reloj de TODA la escalera, incluido el
 * bloque gris uniforme (`core`). Eso abrió una franja de página en la juntura, y el
 * motivo es sutil:
 *
 * El core no es parte de la figura de la escalera — es la TAPA que cubre el hueco
 * entre el fondo del vídeo y el gris. Con `scrub` lineal alcanzaba `scaleY: 1` al
 * 12% del recorrido, o sea casi instantáneamente, y por eso nunca se veía nada.
 * Pasado por la curva, ese 12% del timeline cae en `p ≈ 0.36`: tarda tres veces más
 * en crecer, y mientras no cubre se ve el fondo de la página entre las dos capas.
 *
 * `QuantumBars.tsx` ya lo decía —"el bloque uniforme nunca debió participar de
 * ella"— y se leyó sin entenderlo.
 *
 * Regla: **la curva es para la FIGURA (los escalones), no para la TAPA (el core).**
 * El core crece lineal y rápido, siempre.
 */
export const CORE_IS_A_LID = true;
