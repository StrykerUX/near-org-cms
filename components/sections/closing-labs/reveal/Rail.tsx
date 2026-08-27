import type { ReactNode } from "react";

// La plica numerada de la dirección `reveal`, sacada de alura.framer.website.
//
// ── Por qué el número está permitido acá ─────────────────────────────────────
//
// Numerar bloques que no son una secuencia es la decoración más barata que hay:
// `01 / 02 / 03` promete un orden que el contenido no tiene, y el lector busca
// una progresión que no existe.
//
// Acá el número dice algo verdadero, y es lo único que dice: **cuántas hay**.
// Esta dirección no tiene cards ni filetes ni cajas —es texto sobre papel— así
// que sin la plica no hay forma de saber, mirando una prueba, si es la primera
// de cuatro o la última de seis. En las otras cuatro direcciones sí la hay (la
// celda, la card, el panel), y por eso ninguna numera.
//
// ── El asterisco va en `green-ink` y no en `near-green` ──────────────────────
//
// El verde de marca (#00dc8d) sobre crema tiene un contraste de 1.4:1 — a
// tamaño de asterisco desaparece, y lo único que quedaría es un hueco. La
// versión tinta (#00dc8d) es el mismo verde bajado a un valor que aguanta el
// papel, que es lo que el DS ya tenía previsto para este caso.
export default function Rail({
  index,
  label,
  children,
}: {
  /** Su posición en la serie, empezando en 1. Se rellena a dos dígitos acá. */
  index: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
      <p className="flex items-baseline gap-3 lg:sticky lg:top-[calc(var(--site-header-block)+2rem)] lg:h-fit">
        <span aria-hidden="true" className="text-caption text-green-ink">
          ✦
        </span>
        <span className="text-caption-mono text-ink/45">
          {String(index).padStart(2, "0")}
        </span>
        <span className="text-caption-mono uppercase text-ink/70">{label}</span>
      </p>

      <div>{children}</div>
    </div>
  );
}
