// Copy PROPUESTA para el laboratorio de transiciones.
//
// ⚠️ No está aprobada y por eso no vive en `../protocolContent.ts`, que es la
// transcripción del doc de sitemap y no lleva una palabra que el doc no diga.
// Acá hay texto escrito para probar hipótesis de diseño: dos de las doce
// variantes son retóricas —hacen el puente con lenguaje y no con gráfica— y sin
// una frase no existen.
//
// Si alguna gana, su copy pasa por revisión editorial antes de entrar al módulo
// de contenido.

/**
 * T4 · Handoff — la línea que continúa la frase del hero y presenta lo que sigue.
 *
 * El hero termina en "Proven on mainnet for five years." Esta frase toma esa
 * afirmación y la convierte en la pregunta que la sección siguiente responde, sin
 * repetir ninguna de las dos.
 */
export const HANDOFF = {
  lead: "Five years of that record, at these numbers.",
  tail: "Here is what it takes to hold them.",
} as const;

/**
 * T7 · Bridge — la pregunta que separa la afirmación de la explicación.
 *
 * Está escrita para que sólo tenga sentido DESPUÉS del hero y ANTES de las tres
 * propiedades: es el único momento de la página donde el lector ya sabe qué
 * afirma NEAR y todavía no sabe cómo.
 */
export const BRIDGE = {
  question: "What does a machine-speed economy actually demand?",
  answer: "Three properties at once. These six numbers are what having them looks like.",
} as const;

/**
 * T11 · Mural — la palabra a escala de cartel.
 *
 * Una sola, y del doc: `PROVEN` es la palabra que el hero ya usa ("Proven on
 * mainnet") y la que las seis cifras sostienen. No se inventó nada; se aisló.
 */
export const MURAL_WORD = "Proven";
