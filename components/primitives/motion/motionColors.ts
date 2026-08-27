// Los colores que GSAP necesita como LITERALES.
//
// No es un duplicado del sistema de color por gusto: GSAP interpola *colores*,
// no *declaraciones*. Un `var(--near-teal)` como valor destino de un tween nunca
// se resuelve — el tween recibe la cadena tal cual, no puede parsearla en canales
// y muere en silencio. Lo mismo al escribir en un contexto 2D: resolver una
// custom property ahí dentro obligaría a un recálculo de estilo por frame.
//
// Regla: acá van SOLO los colores que animan más de una escena. Un tono que usa
// una sola sección se queda declarado en esa sección — un módulo con veinte
// constantes de un solo consumidor es peor que la repetición que evita.
//
// Al cambiar un token en app/globals.css hay que espejarlo acá a mano. Es el
// precio de poder animarlo. Los valores de acá son los de la capa 0 del sistema
// de color — ver /design-system/color.

/**
 * La rampa del CTA. La usan tres escenas — la frase que se escribe en
 * `ThreatSequence`, los gradientes SVG de `NearStack` y el color de reposo de
 * las letras encendidas del word field.
 *
 * ⚠️ Es PLANA. Eran tres paradas —verde profundo → verde claro → lima— y la
 * paleta tiene un solo verde, así que las tres colapsaron en `--green-500`.
 * Interpolar entre ellas devuelve siempre el mismo color, y los gradientes que
 * la consumen se ven como un relleno sólido. Se conserva como tupla de tres
 * para no tocar a los consumidores, y para que el día que la paleta recupere
 * escalones de verde alcance con cambiar estos tres valores.
 *
 * Interpolar un punto intermedio sigue siendo `gsap.utils.interpolate(CTA_RAMP, t)`.
 */
export const CTA_RAMP = ["#00dc8d", "#00dc8d", "#00dc8d"] as const;

/** El extremo más brillante de la rampa — el flash con el que nace cada letra. */
export const CTA_RAMP_HEAD = CTA_RAMP[CTA_RAMP.length - 1];

/** Espeja `--near-teal`, que en la paleta actual ES el verde de marca. */
export const NEAR_TEAL = "#00dc8d";
