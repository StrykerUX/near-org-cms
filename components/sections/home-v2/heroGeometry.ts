// La unidad de la que cuelga la juntura hero ↔ barras.
//
// Módulo puro: cero imports, cero DOM, sin `"use client"`. Vivía exportada desde
// `HeroVideo.tsx`, que es un componente cliente, y `QuantumBars` la importaba de
// ahí — así que dos secciones quedaban acopladas a nivel de módulo por una
// constante, y tocar el hero significaba tocar el archivo del que la otra sección
// depende. Acá no hay ese vínculo: las dos importan de un tercero que no sabe
// nada de ninguna.
//
// `--u` es el ancho de una columna de la escalera. De esa unidad sale el `margin-top`
// negativo de `QuantumBars` (`−u·1.5 − 2px`), que es lo que hace que su bloque gris
// —que vive a `top: u·1.5` DENTRO de la sección— caiga exactamente en `100svh`, donde
// termina el video: los escalones nacen del borde inferior de la imagen, en cualquier
// ventana y sin medir nada.
//
// Ojo con una confusión que ya estuvo escrita acá: `100svh − u·1.75` y el video a
// `100% + u·1.5` son del HTML DE REFERENCIA, no de esta implementación. Acá el hero
// llena la pantalla (`height: 100svh`) y el video lo llena a él (`height: 100%`). El
// porqué de esa divergencia —el original deja una franja de crema en ventanas altas—
// está en el docblock de `HeroVideo.tsx`.
//
// Las dos secciones la declaran como custom property con el MISMO valor. No se
// hereda de un ancestro común porque no lo hay: son secciones hermanas y
// `QuantumBars` monta sobre el hero con un margen negativo.
export const HERO_UNIT = "calc(100vw / 7)";
