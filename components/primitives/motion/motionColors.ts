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
// precio de poder animarlo.

/**
 * La rampa del CTA: verde profundo → verde claro → lima. Es el gradiente de
 * marca de la página, y la usan tres escenas — la frase que se escribe en
 * `ThreatSequence`, los gradientes SVG de `NearStack` y el color de reposo de
 * las letras encendidas del word field.
 *
 * Interpolar un punto intermedio es `gsap.utils.interpolate(CTA_RAMP, t)`, que
 * devuelve `"rgb(r,g,b)"`. No hace falta escribir el mezclador a mano.
 */
export const CTA_RAMP = ["#00dc8d", "#8bf29c", "#ecfdb0"] as const;

/** El extremo más brillante de la rampa — el flash con el que nace cada letra. */
export const CTA_RAMP_HEAD = CTA_RAMP[CTA_RAMP.length - 1];

/** Espeja `--near-teal` de app/globals.css, que en la paleta actual resuelve al
 *  verde de marca — es un tono suelto y no una parada de un degradé, así que no
 *  hay gradiente que se pierda al colapsarlo. */
export const NEAR_TEAL = "#00dc8d";
