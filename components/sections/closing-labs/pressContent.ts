// Las tres notas de prensa del cierre de la home, fuera del componente.
//
// Hoy viven hardcodeadas dentro de `homepage-shared/UpdatesList.tsx`, que es
// donde nacieron. Acá se copian —no se importan— por la regla de laboratorios
// del README de `components/sections/`: un lab no le crea dependencias a la
// línea viva, porque el día que el lab se borre no puede llevarse nada puesto.
//
// ⚠️ Las tres filas del artboard repiten LA MISMA frase con tres fechas
// distintas: es relleno de maqueta, no copy. El `blurb` sí es nuevo — lo pide
// la variante `night`, que despliega la fila— y está marcado `TODO(copy)`
// entero. Nada de esto sale de /prototype sin titulares reales.

export type PressItem = {
  id: string;
  /** El titular de la nota. */
  title: string;
  /** Ya formateada: las secciones nunca reciben `Date` (ver `../types.ts`). */
  dateLabel: string;
  /** Solo el año, para las variantes que lo usan como columna aparte. */
  year: string;
  /** Quién la publicó. Va en las variantes con columna de medio. */
  outlet: string;
  /** El arranque de la nota. Solo lo despliega `night/Press`. */
  blurb: string;
};

export const PRESS_ITEMS: readonly PressItem[] = [
  {
    id: "defi",
    // TODO(copy): del artboard, repetido tres veces. Falta el titular real.
    title:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
    dateLabel: "August 02, 2026",
    year: "2026",
    outlet: "CoinDesk",
    // TODO(copy): escrito para la maqueta.
    blurb:
      "One account reaches thirty chains without a bridge, and the swap clears in about a second.",
  },
  {
    id: "intents",
    // TODO(copy)
    title:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
    dateLabel: "July 24, 2026",
    year: "2026",
    outlet: "The Block",
    // TODO(copy)
    blurb:
      "Intents settle over twenty-four billion dollars of cross-chain volume for less than a cent a trade.",
  },
  {
    id: "quantum",
    // TODO(copy)
    title:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
    dateLabel: "June 15, 2026",
    year: "2026",
    outlet: "Decrypt",
    // TODO(copy)
    blurb:
      "A NIST-approved post-quantum signature scheme ships to mainnet without a single minute of downtime.",
  },
];

export const PRESS_EYEBROW = "Media";
export const PRESS_TITLE = "NEAR in the news";
