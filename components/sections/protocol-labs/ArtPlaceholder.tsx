// Hueco declarado para una imagen o un render que todavía no existe.
//
// Existe porque en un prototipo hay dos clases de vacío y conviene no
// confundirlas: la sección que aún no se diseñó, y la que SÍ está diseñada y
// espera un asset. Un `<div>` gris no distingue una de la otra; esto dice qué
// va a ir ahí, en qué proporción y con qué tratamiento, así que la composición
// se puede juzgar completa aunque la imagen no esté.
//
// Deliberadamente NO se parece a una imagen: hairline, etiqueta en mono y una
// diagonal. Un placeholder que imita una foto (gris con un ícono al centro) se
// lee como una imagen fea y contamina el juicio sobre el layout.

export default function ArtPlaceholder({
  label,
  note,
  ratio = "16 / 9",
  tone = "light",
  className = "",
}: {
  /** Qué va acá, en dos o tres palabras: "Hero loop", "Isometric still". */
  label: string;
  /** La dirección de arte, si ya está decidida. */
  note?: string;
  /** `aspect-ratio` de CSS. Va como string y no como clase de Tailwind porque
      cada hueco tiene la suya y no hay una escala de proporciones en el DS. */
  ratio?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      aria-hidden="true"
      style={{ aspectRatio: ratio }}
      className={`relative flex w-full flex-col justify-end overflow-hidden rounded-2xl border p-5 ${
        dark ? "border-cream/20 bg-cream/[0.03]" : "border-ink/15 bg-ink/[0.02]"
      } ${className}`}
    >
      {/* La diagonal es la convención de plano para "acá va una imagen". Se
          dibuja con un SVG y no con un gradiente para que no engorde en cajas
          muy anchas. */}
      <svg
        className={`absolute inset-0 h-full w-full ${dark ? "text-cream/12" : "text-ink/10"}`}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M0 0 L100 100 M100 0 L0 100" stroke="currentColor" strokeWidth="0.35" />
      </svg>

      <div className="relative flex flex-col gap-1">
        <span
          className={`uppercase text-caption-mono ${dark ? "text-cream/70" : "text-gray-intermediate"}`}
        >
          {label}
        </span>
        {note && (
          <span
            className={`max-w-[36ch] text-micro-mono ${dark ? "text-cream/45" : "text-gray-intermediate"}`}
          >
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
