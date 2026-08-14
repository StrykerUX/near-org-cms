// Nombres de las cookies del modo revisión, y NADA más.
//
// Están en su propio módulo porque los necesita `ReviewWidget.tsx`, que es
// `"use client"`. Si los importara de `lib/review-access.ts` se arrastrarían al
// bundle de cliente `node:crypto` y `next/headers`, y el build reventaría con
// un error que no menciona ninguno de los dos archivos. Mismo criterio que la
// regla de `page.meta.ts` documentada en CLAUDE.md.

/** Token firmado, httpOnly. Es el único que autoriza. */
export const REVIEW_COOKIE_NAME = "near_review";

/**
 * Espejo legible por JS, sin valor secreto: solo le dice al cliente que monte
 * el widget, para que el layout no tenga que leer cookies y perder el ISR.
 * Falsificarla a mano muestra la UI y devuelve 403 en el primer request.
 */
export const REVIEW_UI_COOKIE_NAME = "near_review_ui";
