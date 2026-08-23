import Image from "next/image";

// El hueco declarado de un recurso gráfico que todavía no existe.
//
// ── Por qué un primitivo y no un `<div>` gris en cada sección ───────────────
//
// Estas páginas se escribieron sin un solo asset real: no hay fotos de eventos,
// ni la grilla de logos de dApps, ni retratos del Council, ni capturas de
// producto. La salida fácil es dejar el sitio sin ese material y que cada
// sección quede resuelta solo con tipografía — que es exactamente lo que pasó, y
// lo que hace que doce layouts se lean todos al mismo ritmo.
//
// La otra salida fácil es peor: un rectángulo gris con un icono de montaña. Eso
// no reserva el espacio, lo AVERÍA — quien mira la página no puede distinguir
// entre «acá va una foto» y «acá se rompió una foto», y quien tiene que
// producirla no se entera de qué le están pidiendo.
//
// Este componente hace las dos cosas a la vez: ocupa el lugar con una figura
// deliberada —marcas de registro en las esquinas, el vocabulario de un plano, no
// de un error— y ADEMÁS lleva escrito su propio encargo: qué asset va, en qué
// proporción y con qué especificación. El día que el asset llegue se le pasa
// `src` y el mismo componente lo sirve, sin tocar el layout que ya está
// calibrado a su caja.
//
// ── Las marcas de registro, y no un borde punteado ─────────────────────────
//
// Un borde punteado dice «sin terminar». Cuatro escuadras de 1px en las esquinas
// dicen «área reservada», que es lo que efectivamente es, y encima está en el
// mismo idioma que el resto de estas páginas: filete de 1px, mono en versalitas,
// nada de relleno.

// Mapa literal — nunca construir la clase con un template string, Tailwind v4 no
// detecta clases generadas dinámicamente (mismo criterio que Container.tsx).
const RATIO = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "21/9": "aspect-[21/9]",
  "5/2": "aspect-[5/2]",
} as const;

// Dos juegos de color, porque estas páginas alternan fondo y el hueco tiene que
// leerse igual de deliberado sobre los dos. No son opacidades del mismo valor:
// sobre tinta, un filete al 12% de blanco pesa lo mismo que `--rule` sobre crema.
const TONE = {
  light: {
    mark: "text-rule",
    label: "text-gray-intermediate",
    field: "bg-card-tint/40",
  },
  dark: {
    mark: "text-white/25",
    label: "text-white/45",
    field: "bg-white/[0.03]",
  },
} as const;

export type MediaFrameProps = {
  /** Qué recurso va acá. Es el encargo, no un título: «Foto del meetup de Lisboa». */
  label: string;
  /** Especificación técnica opcional: «1600×900 · JPG», «SVG monocromo». */
  spec?: string;
  ratio?: keyof typeof RATIO;
  tone?: keyof typeof TONE;
  /** Cuando el asset exista. Con `src`, el hueco desaparece y queda la imagen. */
  src?: string;
  alt?: string;
  className?: string;
};

/** Una escuadra de 1px. Se rota por esquina desde el llamador. */
function Corner({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`absolute size-4 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M0 0 H16 M0 0 V16" />
    </svg>
  );
}

export default function MediaFrame({
  label,
  spec,
  ratio = "16/9",
  tone = "light",
  src,
  alt,
  className = "",
}: MediaFrameProps) {
  const t = TONE[tone];

  if (src) {
    return (
      <div className={`relative w-full overflow-hidden ${RATIO[ratio]} ${className}`}>
        {/* `alt` cae al label: un asset sin texto alternativo es peor que uno
            con el encargo por descripción. */}
        <Image src={src} alt={alt ?? label} fill className="object-cover" />
      </div>
    );
  }

  return (
    // `role="img"` + `aria-label`: para un lector de pantalla esto ES la imagen
    // que todavía no está, y anunciar su encargo es más útil que el silencio de
    // un div decorativo.
    <div
      role="img"
      aria-label={`${label} — recurso pendiente`}
      className={`relative w-full ${RATIO[ratio]} ${t.field} ${className}`}
    >
      <div className={t.mark} aria-hidden="true">
        <Corner className="left-0 top-0" />
        <Corner className="right-0 top-0 rotate-90" />
        <Corner className="bottom-0 right-0 rotate-180" />
        <Corner className="bottom-0 left-0 -rotate-90" />
      </div>

      {/* El encargo, abajo y en mono: se lee como el pie de un plano, no como el
          contenido de la caja. Va con `gap` y `flex-wrap` porque en una celda
          angosta la especificación tiene que caer a su propio renglón antes que
          recortarse. */}
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-3 text-micro-mono uppercase ${t.label}`}
      >
        <span>{label}</span>
        <span>{spec ?? ratio}</span>
      </div>
    </div>
  );
}
