// The green disc whose arrow hands off: hovering the ancestor marked
// `data-q-arrow-host` sends the visible arrow out to the right while a second
// one enters from the left. Both are the same glyph — the effect is continuity,
// not an icon swap.
//
// The trigger is a data-attribute on the ANCESTOR rather than the disc's own
// :hover because the gesture belongs to the whole row or link, not to the
// circle: moving the mouse over the words "Read the coverage" has to move it
// too.
//
// The rule lives in `[data-q-arrow]` in app/globals.css. Server component.
//
// ── Por qué `tone` y no una clase por `className` ──────────────────────────
//
// El disco va verde en casi todo el sitio y crema en las cards de InTheNews de
// `/quantum-security`. Eso vivió como un ARCHIVO COPIADO —`NewsArrowCircle`—
// que difería en una sola línea, y la copia existía por una razón real: pasarle
// `bg-cream` por `className` no funciona. Las dos clases declaran la misma
// propiedad y cuál gana lo decide el orden en que Tailwind las EMITE, no el
// orden en el atributo. El resultado es un disco que a veces sale verde y a
// veces crema según qué más se haya compilado.
//
// Un mapa literal de tonos elige una sola clase, así que no hay competencia
// posible. Es el mismo patrón que `CtaPill` ya usaba al lado.

function Arrow({ slot }: { slot: "in" | "out" }) {
  return (
    <svg
      {...(slot === "in" ? { "data-q-arrow-in": "" } : { "data-q-arrow-out": "" })}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const TONE = {
  green: "bg-near-green-accent text-black",
  cream: "bg-cream text-ink",
} as const;

export type ArrowCircleProps = {
  /** El relleno del disco. `cream` es el de las cards de prensa sobre tinta. */
  tone?: keyof typeof TONE;
  className?: string;
};

export default function ArrowCircle({
  tone = "green",
  className = "",
}: ArrowCircleProps = {}) {
  return (
    // overflow-hidden IS wanted here: it is what crops the arrows against the
    // edge of the disc as they cross it.
    <span
      data-q-arrow
      aria-hidden="true"
      className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full ${TONE[tone]} ${className}`}
    >
      <Arrow slot="out" />
      <Arrow slot="in" />
    </span>
  );
}
