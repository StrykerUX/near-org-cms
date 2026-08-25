"use client";

import type { ReactNode } from "react";

// El armazón de la dirección `grid`, sacado de armory.framer.ai.
//
// ── Qué se copió, exactamente ────────────────────────────────────────────────
//
// No el color ni la tipografía: la RETÍCULA VISIBLE. Armory dibuja cuatro
// columnas a sangre con filetes de 1px que atraviesan la página entera, y todas
// sus secciones se acomodan adentro. Es lo contrario de una página de cards:
// nada flota, todo ocupa celdas, y los filetes no separan bloques —los bloques
// SON los huecos que dejan los filetes.
//
// Por eso esta dirección no usa `Container`. El `Container` del sitio centra un
// bloque de 1780px con gutters de 60; acá la retícula tiene que llegar al borde
// del viewport o deja de leerse como estructura y pasa a leerse como una tabla
// centrada. El aire lo pone el padding de cada celda, no el gutter.
//
// ── Los filetes van como `border-l` de la celda, no como líneas absolutas ────
//
// Una capa de tres líneas posicionadas al 25/50/75% se desalinea en cuanto una
// fila cambia de cantidad de columnas —y acá pasa: en móvil son dos, o una—.
// Con el borde en la celda la retícula la dibuja el mismo grid que acomoda el
// contenido, así que no hay nada que mantener sincronizado.

export type RuleGridProps = {
  children: ReactNode;
  /** `dark` invierte fondo y filetes. La dirección alterna sección a sección. */
  tone?: "dark" | "light";
  className?: string;
};

/** Las clases de filete de cada tono, en un mapa literal (Tailwind v4 no ve strings armados). */
export const RULE = {
  dark: "border-cream/15",
  light: "border-ink/15",
} as const;

const TONE = {
  dark: "bg-ink text-cream",
  light: "bg-cream text-ink",
} as const;

export default function RuleGrid({
  children,
  tone = "dark",
  className = "",
}: RuleGridProps) {
  return (
    <section className={`${TONE[tone]} ${className}`}>{children}</section>
  );
}

/**
 * Una banda de la retícula: cuatro columnas en desktop, con filete arriba.
 *
 * `-mt-px` sobre la banda siguiente no hace falta porque el filete es SOLO
 * arriba: dos bandas seguidas comparten una línea, no dibujan dos.
 */
export function Band({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={`grid border-t sm:grid-cols-2 lg:grid-cols-4 ${RULE[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * La marca de esquina de armory: media escuadra en la esquina superior derecha
 * de la celda.
 *
 * Es medio marco y no un marco entero, y ahí está el truco: un rectángulo
 * completo encajona el contenido y compite con el filete de la retícula; dos
 * trazos en una esquina alcanzan para decir «esto es una celda» sin dibujar una
 * segunda caja encima de la que ya hay.
 */
export function Tick({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`size-3 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0 0h12M12 0v12" />
    </svg>
  );
}
