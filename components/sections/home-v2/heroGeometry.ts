// La unidad de la que cuelga la juntura hero ↔ barras.
//
// Módulo puro: cero imports, cero DOM, sin `"use client"`. Vivía exportada desde
// `HeroVideo.tsx`, que es un componente cliente, y `QuantumBars` la importaba de
// ahí — así que dos secciones quedaban acopladas a nivel de módulo por una
// constante, y tocar el hero significaba tocar el archivo del que la otra sección
// depende. Acá no hay ese vínculo: las dos importan de un tercero que no sabe
// nada de ninguna.
//
// `--u` es el ancho de una columna de la escalera. De esa unidad salen el alto del
// hero (`100svh − u·1.75`), el alto del video (`100% + u·1.5`) y el `margin-top`
// negativo de `QuantumBars`. El efecto neto es que el top de las barras queda
// SIEMPRE a `100svh − u·1.75` del documento, que es exactamente donde termina el
// video: los escalones nacen del borde inferior de la imagen.
//
// Las dos secciones la declaran como custom property con el MISMO valor. No se
// hereda de un ancestro común porque no lo hay: son secciones hermanas y
// `QuantumBars` monta sobre el hero con un margen negativo.
export const HERO_UNIT = "calc(100vw / 7)";
