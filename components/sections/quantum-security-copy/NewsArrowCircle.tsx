// Copia local de components/sections/quantum/ArrowCircle.tsx, con un solo
// cambio: el disco es del color de fondo del sitio (--cream), no
// near-green-accent — pedido puntual para las cards de InTheNews acá, sin
// tocar el ArrowCircle compartido (lo usan protocol/chain y el InTheNews
// real). Mismo mecanismo de hover, mismo `[data-q-arrow]` en app/globals.css.

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

export default function NewsArrowCircle({ className = "" }: { className?: string }) {
  return (
    <span
      data-q-arrow
      aria-hidden="true"
      className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream text-ink ${className}`}
    >
      <Arrow slot="out" />
      <Arrow slot="in" />
    </span>
  );
}
