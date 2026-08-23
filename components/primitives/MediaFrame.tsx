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
// leerse igual de deliberado sobre los dos.
//
// ── Las marcas son más oscuras que un filete, y eso no es un capricho ──────
//
// La primera versión las pintaba con `--rule`, el mismo valor que los filetes de
// la casa. En pantalla el resultado fue exactamente lo que este componente
// existe para evitar: sobre una caja de 550×730 cuatro escuadras de 16px al
// color de un filete no se ven, y lo que queda es un rectángulo gris — el
// placeholder averiado, otra vez.
//
// Un filete de 1px cruza cientos de píxeles y por eso se lee con poquísimo
// contraste. Una marca de esquina son 32px de trazo en las cuatro puntas de un
// área grande: para pesar lo mismo necesita bastante más valor. De ahí que el
// trazo salga de `--ink` con alfa y no de `--rule`, y que midan 24 y no 16.
const TONE = {
  light: {
    mark: "text-ink/35",
    rule: "bg-rule",
    label: "text-gray-intermediate",
    field: "bg-ink/[0.03]",
  },
  dark: {
    mark: "text-white/40",
    rule: "bg-white/15",
    label: "text-white/50",
    field: "bg-white/[0.04]",
  },
} as const;

export type MediaFrameProps = {
  /**
   * Qué recurso va acá. Es el encargo, no un título decorativo.
   *
   * **En inglés**, como todo lo que este componente imprime: se ve en la página
   * hasta que llegue el asset. «Lisbon meetup — room shot», no «Foto».
   */
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
      viewBox="0 0 24 24"
      className={`absolute size-6 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M0 0 H24 M0 0 V24" />
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
    //
    // El texto va en INGLÉS igual que el resto de lo que se renderiza: el sitio
    // está en inglés, y un anuncio en español en medio de una página en inglés
    // es exactamente el mismo error que un pie de figura en español. Los
    // comentarios de este archivo son otra cosa — se leen en el editor, no en la
    // página.
    <div
      role="img"
      aria-label={`${label} — asset pending`}
      className={`relative w-full ${RATIO[ratio]} ${t.field} ${className}`}
    >
      <div className={t.mark} aria-hidden="true">
        <Corner className="left-0 top-0" />
        <Corner className="right-0 top-0 rotate-90" />
        <Corner className="bottom-0 right-0 rotate-180" />
        <Corner className="bottom-0 left-0 -rotate-90" />
      </div>

      {/* El encargo, abajo y en mono: se lee como el pie de un plano, no como el
          contenido de la caja.

          El filete que lo separa hace dos cosas: le da estructura al borde
          inferior —sin él la caja no tiene ningún trazo que la cruce y flota— y
          pone al encargo del lado de afuera del área de imagen, que es donde
          va. El día que llegue el asset, el filete se va con el resto.

          `flex-wrap` porque en una celda angosta la especificación tiene que
          caer a su propio renglón antes que recortarse: un encargo cortado a la
          mitad no es un encargo. */}
      <div className="absolute inset-x-0 bottom-0">
        <div className={`h-px w-full ${t.rule}`} aria-hidden="true" />
        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-3 text-micro-mono uppercase ${t.label}`}
        >
          <span>{label}</span>
          <span>{spec ?? ratio}</span>
        </div>
      </div>
    </div>
  );
}
