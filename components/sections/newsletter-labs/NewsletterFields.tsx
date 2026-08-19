"use client";

import { useState } from "react";

// Las formas de campo que el `ShineField` de producción no cubre.
//
// ── Por qué existen ─────────────────────────────────────────────────────────
//
// `primitives/ShineField` es una píldora con un brillo WebGL recortado a la
// silueta de los glifos, y para conseguirlo necesita una estructura muy
// concreta: el `<input>` con el texto TRANSPARENTE y un overlay de un `<span>`
// por carácter, que es lo que el shader mascara. Esa estructura es la píldora.
//
// Tres de las ocho variantes del lab piden otra forma —una línea de escritura,
// un bloque con el botón adosado, un campo metido dentro de una frase— y
// ninguna puede llevar el shine sin reescribirlo. Así que **lo pierden**, y eso
// es parte de lo que hay que sopesar: el brillo es de lo poco que hoy hace
// memorable a esta banda.
//
// Las variantes que sí llevan píldora montan el `ShineField` real, no una copia.
//
// ── Sin backend ─────────────────────────────────────────────────────────────
//
// `onSubmit` con `preventDefault`, igual que el componente de producción: esto
// es un draft y no hay a dónde mandar el correo.

type FieldProps = {
  placeholder: string;
  label: string;
  buttonLabel: string;
  className?: string;
};

/**
 * 02 · Rule — la línea de escritura.
 *
 * El campo es una regla y el texto se escribe encima, como en un formulario de
 * papel. El botón es texto, no un bloque: en esta forma un botón sólido
 * volvería a partir el conjunto en dos objetos, que es justo lo que la línea
 * evita.
 *
 * La regla cambia de color con el foco y no solo de grosor: engordarla mueve el
 * texto de arriba un píxel, y ese salto se ve.
 */
export function RuleField({ placeholder, label, buttonLabel, className = "" }: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <form onSubmit={(e) => e.preventDefault()} className={`flex w-full items-end gap-6 ${className}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label htmlFor="rule-email" className="text-caption-mono uppercase text-ink/45">
          {label}
        </label>
        <input
          id="rule-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full border-b bg-transparent pb-2 text-h3 text-ink transition-colors duration-200 placeholder:text-ink/25 focus:outline-none ${
            focused ? "border-green-ink" : "border-ink/25"
          }`}
        />
      </div>
      <button
        type="submit"
        className="shrink-0 border-b border-ink pb-2 text-h4 text-ink transition-colors duration-200 hover:border-green-ink hover:text-green-ink"
      >
        {buttonLabel} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

/**
 * 06 · Grain — el bloque.
 *
 * Rectángulo sin radio, con el botón adosado y compartiendo borde. Es la forma
 * más dura de las tres: sirve a una banda con textura, donde una píldora
 * redondeada se vería como un widget pegado encima.
 */
export function SlabField({ placeholder, label, buttonLabel, className = "" }: FieldProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className={`flex w-full ${className}`}>
      <label htmlFor="slab-email" className="sr-only">
        {label}
      </label>
      <input
        id="slab-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder={placeholder}
        className="min-w-0 flex-1 border border-ink bg-transparent px-5 py-4 text-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ink"
      />
      {/* `-ml-px` para que los dos bordes se solapen y quede UNA línea entre el
          campo y el botón, no dos pegadas. */}
      <button
        type="submit"
        className="-ml-px shrink-0 border border-ink bg-ink px-7 py-4 text-label text-cream transition-colors duration-200 hover:bg-ink-soft"
      >
        {buttonLabel}
      </button>
    </form>
  );
}

/**
 * 04 · Inline — el campo dentro de la frase.
 *
 * Hereda el tamaño del titular que lo contiene (`text-[1em]`… en realidad
 * `font-size: inherit`, que es lo que hace `text-inherit` más el reset del
 * input), así que crece y encoge con la escala fluida del heading sin que nadie
 * lo sincronice.
 *
 * El ancho es del CONTENIDO y no fijo: `size` da la medida base en caracteres y
 * el campo no puede empujar la línea más allá de lo que el titular tolera.
 */
export function InlineField({ placeholder, label, buttonLabel }: FieldProps) {
  const [value, setValue] = useState("");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="contents">
      <label htmlFor="inline-email" className="sr-only">
        {label}
      </label>
      <input
        id="inline-email"
        name="email"
        type="email"
        autoComplete="email"
        size={14}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mx-2 max-w-full border-b-2 border-green-ink bg-transparent pb-1 text-center font-[inherit] text-[length:inherit] text-green-ink placeholder:text-ink/30 focus:outline-none"
      />
      {/* El botón mide en `em` del titular, así que la flecha de adentro
          también: es un glifo dentro de un círculo, no texto de la escala. */}
      <button
        type="submit"
        aria-label={buttonLabel}
        /* ds-exempt: la flecha es un glifo centrado en un botón circular de tamaño relativo; un line-height de la escala lo descentra. */
        className="ml-3 inline-flex size-[0.7em] items-center justify-center rounded-full bg-green-ink align-middle text-[0.42em] leading-none text-cream transition-colors duration-200 hover:bg-ink"
      >
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
