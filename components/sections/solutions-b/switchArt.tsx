// Los diagramas del conmutador: cinco parcheos de un mismo panel.
//
// ── Por qué un panel de conexión y no cinco dibujos sueltos ───────────────
//
// La propuesta B sostiene que un hub es una INTERFAZ: el lector elige y la
// página responde. El diagrama tiene que decir lo mismo. Un panel con jacks
// arriba y abajo, siempre el mismo, y cables distintos según la solución activa
// — la figura no cambia de tema al cambiar de pestaña, cambia de conexión. Eso
// es lo que hace que las cinco se lean como cinco usos de un mismo sistema y no
// como cinco productos con su ilustración.
//
// La alternativa era la obvia —cinco dibujos distintos, uno por solución: un
// abanico para pagos, una carrera de solvers para DeFi, un enclave sellado para
// confidencial— y se descartó justamente por eso. Cinco mecanismos distintos
// dicen «cinco productos»; un tablero con cinco parcheos dice «un sistema,
// cinco usos», que es lo que el copy afirma y lo que esta propuesta sostiene.
//
// ── El marco es idéntico en las cinco ─────────────────────────────────────
//
// Mismo `viewBox`, mismos jacks, mismas posiciones. Lo único que cambia son los
// cables. Si alguna variante mueve un jack, el efecto se cae: el ojo deja de
// reconocer el panel entre pestaña y pestaña y las cinco vuelven a ser cinco
// dibujos.
//
// Sin `"use client"` y sin animación: es geometría pura, como `isoKit` en
// protocol-labs. Quien lo monta decide si lo anima.

import type { Solution } from "@/components/sections/solutions/solutionsContent";

const W = 420;
const H = 240;

// Los jacks. Ocho arriba y ocho abajo, repartidos con el mismo inset por lado
// para que las columnas queden alineadas verticalmente entre sí.
const JACKS = 8;
const INSET = 34;
const TOP_Y = 40;
const BOT_Y = H - 40;
const jackX = (i: number) => INSET + (i / (JACKS - 1)) * (W - INSET * 2);

/** El verde vivo. Literal y no `var(--token)`: si alguna vez se anima, GSAP interpola colores, no declaraciones. */
const LIVE = "#00dc8d";

// Un cable: de un jack de arriba a uno de abajo, con las dos manijas tiradas en
// VERTICAL. Es lo que hace que salga y llegue perpendicular al panel, como un
// cable real enchufado — una recta diagonal se leería como una flecha, que es
// otra cosa.
const cable = (from: number, to: number) =>
  `M ${jackX(from)} ${TOP_Y} C ${jackX(from)} ${TOP_Y + 74} ${jackX(to)} ${BOT_Y - 74} ${jackX(to)} ${BOT_Y}`;

type Patch = { from: number; to: number; live?: boolean; dashed?: boolean };

// El parcheo de cada solución. Cada uno dice lo que su bloque afirma:
//
//   payments   cuatro entradas distintas que salen por cuatro salidas
//              distintas — cualquier activo entra, la moneda elegida sale.
//   agentic    dos cables cortos entre jacks vecinos, en trazo interrumpido:
//              tráfico continuo y de grano fino, no una transacción.
//   defi       tres cables al MISMO jack de abajo, uno vivo: la carrera de
//              solvers, tres rutas y una que llena.
//   treasury   un solo jack arriba abierto en cuatro abajo, y de vuelta:
//              una cuenta, muchas cadenas, el capital sin salir del panel.
//   confidential-ai  los cables cruzan la caja del enclave; lo que entra y sale
//              es visible, lo del medio no.
const PATCHES: Record<Solution["id"], Patch[]> = {
  payments: [
    { from: 0, to: 5 },
    { from: 2, to: 1, live: true },
    { from: 4, to: 7 },
    { from: 6, to: 3 },
  ],
  agentic: [
    { from: 2, to: 3, live: true, dashed: true },
    { from: 3, to: 2, dashed: true },
    { from: 5, to: 4, dashed: true },
  ],
  defi: [
    { from: 1, to: 6 },
    { from: 3, to: 6, live: true },
    { from: 5, to: 6 },
  ],
  treasury: [
    { from: 3, to: 0 },
    { from: 3, to: 2, live: true },
    { from: 3, to: 5 },
    { from: 3, to: 7 },
  ],
  "confidential-ai": [
    { from: 1, to: 2, live: true },
    { from: 4, to: 5 },
    { from: 6, to: 6 },
  ],
};

export type SwitchArtProps = {
  id: Solution["id"];
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"svg">, "className" | "viewBox" | "id">;

export default function SwitchArt({ id, className = "", ...rest }: SwitchArtProps) {
  const patches = PATCHES[id];
  const enclave = id === "confidential-ai";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full ${className}`} aria-hidden="true" {...rest}>
      {/* El marco del panel. */}
      <rect
        x="1"
        y="1"
        width={W - 2}
        height={H - 2}
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.16"
      />

      {/* El enclave: la única variante que agrega una pieza al marco, y la
          agrega porque su bloque afirma justamente eso — que hay un tramo del
          recorrido al que nadie de afuera entra. Va DEBAJO de los cables, así
          que los cables se ven pasar por dentro. */}
      {enclave && (
        <rect
          x={W / 2 - 96}
          y={H / 2 - 42}
          width="192"
          height="84"
          rx="10"
          fill="currentColor"
          fillOpacity="0.05"
          stroke={LIVE}
          strokeOpacity="0.45"
          strokeDasharray="5 5"
        />
      )}

      {/* Los cables. */}
      {patches.map((p, i) => (
        <path
          key={i}
          data-cable
          d={cable(p.from, p.to)}
          fill="none"
          stroke={p.live ? LIVE : "currentColor"}
          strokeOpacity={p.live ? 1 : 0.26}
          strokeWidth={p.live ? 1.75 : 1.25}
          strokeLinecap="round"
          {...(p.dashed ? { strokeDasharray: "2 7" } : {})}
          // `pathLength` 100 y no 1: GSAP redondea valores en píxeles por defecto
          // (`autoRound`) y `stroke-dashoffset` es una propiedad en píxeles, así
          // que normalizada a 1 el trazo saltaría de no dibujado a dibujado sin
          // nada en el medio.
          pathLength={100}
        />
      ))}

      {/* Los jacks, encima de los cables para que se lean como bocas y no como
          puntos sueltos. Los que están parcheados se rellenan; el resto queda en
          contorno — es lo que hace visible CUÁLES se usan en cada solución. */}
      {[TOP_Y, BOT_Y].map((y) =>
        Array.from({ length: JACKS }, (_, i) => {
          const used = patches.some((p) => (y === TOP_Y ? p.from : p.to) === i);
          const live = patches.some(
            (p) => p.live && (y === TOP_Y ? p.from : p.to) === i
          );
          return (
            <circle
              key={`${y}-${i}`}
              cx={jackX(i)}
              cy={y}
              r="4.5"
              fill={live ? LIVE : used ? "currentColor" : "none"}
              fillOpacity={live ? 1 : used ? 0.55 : 0}
              stroke="currentColor"
              strokeOpacity={used ? 0 : 0.22}
            />
          );
        })
      )}
    </svg>
  );
}
