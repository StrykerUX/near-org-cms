// Una marca de trazo por solución.
//
// Íconos inline y sin dependencias, en el mismo lenguaje de hairline que ya
// usan la convergencia de `chain/CompletePicture`, el abanico de
// `chain/BuildersCta` y el `ActorMark` de `ForwardTurn` — de donde sale la
// construcción de este archivo. Un set de íconos RELLENOS acá metería una
// textura que ninguna página del sitio tiene.
//
// Cada marca dice lo que dice su bloque, y no es decoración intercambiable:
//
//   payments         dos flechas cruzadas — entra un activo, sale otro
//   agentic          dos nodos-máquina con el pulso entre ellos
//   defi             tres rutas compitiendo hacia un mismo destino (la carrera
//                    de solvers, la misma figura que `chainDiagram`)
//   treasury         una cuenta al centro con flechas de rebalanceo
//   confidential-ai  la caja sellada: el enclave con su candado
//
// `strokeWidth="1.5"` y `viewBox` de 48 en todas: son el mismo objeto a
// distintos contenidos, y cualquier desparejo se ve al estar apiladas en el
// índice.

import type { Solution } from "@/components/sections/solutions/solutionsContent";

const PATHS: Record<Solution["id"], React.ReactNode> = {
  payments: (
    <>
      <path d="M6 18h27l-6-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 30H15l6 6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  agentic: (
    <>
      <rect x="4" y="16" width="16" height="16" rx="4" />
      <rect x="28" y="16" width="16" height="16" rx="4" />
      <path d="M20 24h8" strokeLinecap="round" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  defi: (
    <>
      <path d="M6 12c12 0 18 12 34 12" strokeLinecap="round" />
      <path d="M6 24h34" strokeLinecap="round" />
      <path d="M6 36c12 0 18-12 34-12" strokeLinecap="round" />
      <circle cx="42" cy="24" r="3.5" fill="currentColor" stroke="none" />
    </>
  ),
  treasury: (
    <>
      <circle cx="24" cy="24" r="7" />
      {/* Cuatro brazos a 90°, con la punta abierta hacia afuera: el capital
          sale y vuelve por el mismo camino, que es lo que "rebalancear"
          significa. */}
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 24 24)`}>
          <path d="M24 17V6" strokeLinecap="round" />
          <path d="M20.5 9.5 24 6l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </>
  ),
  "confidential-ai": (
    <>
      <rect x="8" y="20" width="32" height="22" rx="4" />
      <path d="M17 20v-5a7 7 0 0 1 14 0v5" strokeLinecap="round" />
      <circle cx="24" cy="30" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function SolutionMark({
  id,
  className = "h-11 w-11",
}: {
  id: Solution["id"];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {PATHS[id]}
    </svg>
  );
}
