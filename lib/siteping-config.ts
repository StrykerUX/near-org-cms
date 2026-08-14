// Identificador del proyecto en SitePing.
//
// Tiene que ser EL MISMO en el widget que envía y en el inbox que lee: SitePing
// filtra todo por `projectName`, así que si divergen el inbox aparece vacío sin
// ningún error. Por eso vive en un módulo propio y no como literal en cada
// archivo.
//
// Módulo sin dependencias a propósito — lo importa `ReviewWidget.tsx`, que es
// `"use client"`.
export const SITEPING_PROJECT = "near-org-cms";
