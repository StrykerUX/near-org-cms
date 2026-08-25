// Lo que las cuatro alternativas necesitan y `testimonialDeckContent.ts` no
// tiene: la EMPRESA como dato suelto, y qué card lleva color.
//
// ── Por qué es un módulo aparte y no un campo más allá ──────────────────────
//
// Las citas viven en `homepage-tuck/testimonialDeckContent.ts` y de ahí las
// leen las cuatro variantes de acá, las cinco de `closing-labs/` y la sección
// viva. Es una sola fuente para las palabras, y así tiene que seguir: es lo
// único que hace honesta cualquier comparación entre versiones.
//
// Lo de acá NO son palabras: es qué empresa firma cada voz y de qué color va su
// card. Son dos datos que la sección viva no usa —el mazo no muestra logos y no
// tiene cards de color— así que agregárselos allá sería que la línea viva
// cargue campos que nadie lee, para un laboratorio que puede borrarse mañana.
//
// El acople es por `id`, y el `Record` está tipado contra los ids reales: si
// alguien renombra una persona allá, esto no compila. Un `Record<string, …>`
// dejaría la entrada huérfana en silencio y la card saldría sin empresa.
//
// ── ⚠️ Ninguna de las cuatro empresas tiene logo en el repo ─────────────────
//
// `public/logos/` tiene abound, brave, ledger, venice y zodl — que son las
// empresas de `CUSTOMER_STORIES`, no las de estas cuatro personas. Así que el
// «logo» de estas cards es la empresa COMPUESTA EN TIPOGRAFÍA, en la serif del
// sitio, que es lo que hace la referencia con «Venice» y «abound».
//
// Es un marcador de posición honesto y no una solución: un wordmark tipográfico
// dice el nombre correcto pero no es la marca de nadie. TODO(asset): pedir los
// logotipos de DoubleZero, Bitwise y Helius antes de sacar esto de /prototype.

import type { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";

type TestimonialId = (typeof TESTIMONIALS)[number]["id"];

/**
 * El tratamiento de color de la card.
 *
 * Va como DATO y no como `index % 3`, y la diferencia importa: cuál de las
 * cuatro voces se lleva el verde es una decisión editorial —es la que la
 * sección quiere que se lea primero— y la aritmética sobre el índice se la
 * reasigna sola a otra persona el día que alguien reordene la lista o agregue
 * una quinta cita. Sin error, sin aviso, y con la card de color en la voz
 * equivocada.
 */
export type VoiceAccent = "plain" | "ramp" | "ink";

export type VoiceMark = {
  /**
   * La empresa, para componer como wordmark.
   *
   * `null` cuando no se sabe: el artboard de Swihart dice literalmente
   * «Company xxx». Es `null` y no una cadena vacía porque la ausencia es un
   * dato que las cuatro variantes tienen que poder mirar y resolver —hoy
   * cayendo al nombre de la persona— y `""` se lee como «hay empresa, se llama
   * nada».
   */
  company: string | null;
  accent: VoiceAccent;
};

export const VOICE_MARKS: Record<TestimonialId, VoiceMark> = {
  federa: { company: "DoubleZero", accent: "ink" },
  // TODO(copy): el artboard dice "Company xxx" — falta la empresa real.
  swihart: { company: null, accent: "plain" },
  horsley: { company: "Bitwise", accent: "ramp" },
  mumtaz: { company: "Helius", accent: "plain" },
};

/**
 * El verde de la card destacada, en diagonal.
 *
 * No es una de las tres rampas de `GetIntoNear`: aquellas son horizontales, de
 * quince bandas, y existen para diferenciar TRES puertas entre sí. Acá hay una
 * sola card de color y lo que tiene que hacer es iluminarse de una esquina a la
 * otra, como en la referencia — un degradé a 135° de tres paradas, muestreado
 * del artboard: claro arriba a la izquierda, saturado abajo a la derecha.
 *
 * Los tres colores son aproximaciones muestreadas de la captura, no valores de
 * marca. TODO(design): confirmarlos contra el archivo original.
 */
export const VOICE_RAMP =
  "linear-gradient(135deg, #A9E272 0%, #7FD05F 42%, #2FAF34 100%)";

export const VOICES_EYEBROW = "On the record";
