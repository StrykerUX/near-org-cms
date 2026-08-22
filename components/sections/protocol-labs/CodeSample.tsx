// El bloque de código de la sección 10, una sola vez para las tres
// alternativas. Cada una lo enmarca distinto (A lo pone dentro de una celda de
// la tabla, B contra el fondo oscuro del acto, C como figura con pie), y eso lo
// resuelve `frame`; lo que NO cambia entre ellas es el código ni su
// tokenización.
//
// Tokenizado a mano, igual que en `sections/protocol/DeveloperBlock`, y por el
// mismo motivo: un resaltador real (Shiki) es una dependencia de build para
// doce líneas y merece su propio cambio. El markup es un span por token, así
// que cuando entre es un reemplazo y no una reescritura.

// ds-exempt: el código fuente no es prosa — la escala del DS no lo gobierna
const CODE: Array<Array<[string, string]>> = [
  [["import", "kw"], [" { NearBindgen, view } ", "t"], ["from", "kw"], [" 'near-sdk-js'", "s"], [";", "t"]],
  [],
  [["@NearBindgen", "at"], ["({})", "t"]],
  [["class", "kw"], [" SmartContract", "ty"], [" {", "t"]],
  [["  greeting", "p"], [": ", "t"], ["String", "ty"], [" = ", "t"], ['"Hello NEAR"', "s"], [";", "t"]],
  [],
  [["  @view", "at"], ["({})", "t"]],
  [["  get_greeting", "fn"], ["(): ", "t"], ["String", "ty"], [" {", "t"]],
  [["    return", "kw"], [" this", "p"], [".greeting;", "t"]],
  [["  }", "t"]],
  [["}", "t"]],
];

const TOKEN: Record<string, string> = {
  kw: "text-[color:var(--cta-mint)]",
  s: "text-[color:var(--cta-lime)]",
  ty: "text-cream",
  at: "text-[color:var(--near-green-accent)]",
  fn: "text-cream",
  p: "text-cream/80",
  t: "text-cream/55",
};

// Los tres encuadres que las alternativas necesitan. Mapa literal de clases:
// Tailwind v4 no ve las clases construidas en tiempo de ejecución.
const FRAME = {
  // Card oscura con sombra, sobre una sección clara: una superficie DISTINTA,
  // algo a lo que se mira hacia adentro.
  card: "rounded-3xl bg-ink-slate p-7 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.45)]",
  // Sin card: el código apoyado directamente sobre un fondo que ya es oscuro.
  // Con la card encima de `--ink` quedarían dos negros casi iguales y el borde
  // del rectángulo se leería como un error de recorte.
  bare: "p-0",
  // Rectángulo de hairline sobre fondo claro: la "figura" del ensayo. El fondo
  // se queda oscuro porque el resaltado de sintaxis está calibrado para él.
  figure: "rounded-2xl border border-ink/15 bg-ink p-6",
} as const;

export default function CodeSample({
  frame = "card",
  chrome = false,
  className = "",
}: {
  frame?: keyof typeof FRAME;
  /** Los tres puntos de una ventana de editor. Solo tiene sentido con `card`. */
  chrome?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${FRAME[frame]} ${className}`}>
      {chrome && (
        <div className="mb-5 flex gap-2" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-cream/20" />
          <span className="size-2.5 rounded-full bg-cream/20" />
          <span className="size-2.5 rounded-full bg-[color:var(--near-green-accent)]/70" />
        </div>
      )}
      {/* ds-exempt: código, con su propio ritmo monoespaciado */}
      <pre className="overflow-x-auto text-caption-mono leading-[1.85]">
        <code>
          {CODE.map((line, i) => (
            <span key={i} className="block">
              {line.length === 0
                ? " "
                : line.map(([text, kind], j) => (
                    <span key={j} className={TOKEN[kind]}>
                      {text}
                    </span>
                  ))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
