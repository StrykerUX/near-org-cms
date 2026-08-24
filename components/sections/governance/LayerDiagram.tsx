// Las dos capas, dibujadas.
//
// ── Qué muestra, y por qué no es un organigrama ───────────────────────────
//
// Un organigrama dibuja quién está arriba de quién, y acá eso sería falso: la
// Foundation no está arriba de la gobernanza onchain ni al revés. Lo que la
// página tiene que mostrar es OTRA cosa — que las dos capas son distintas en
// naturaleza, no en rango. Una es un mecanismo que ejecuta lo que se vota; la
// otra es una organización que se está retirando.
//
// De ahí las dos formas: la capa onchain es una losa CERRADA con sus propuestas
// cruzando un umbral (la misma gramática que el glifo de gobernanza de
// economics, crecida a volumen), y la Foundation es una losa cuyo borde derecho
// está PUNTEADO y cuyas funciones salen del cuadro. La que decide tiene contorno
// completo; la que se devuelve, no.
//
// El lazo interno de la Foundation —empowers hacia abajo, reports to hacia
// arriba— se dibuja adentro de su losa, porque es una relación interna y
// ponerla al mismo nivel que la separación entre capas diría que son
// comparables.
//
// Proyección dimétrica plana, ~18°, igual que el resto de los aparatos de esta
// dirección: a 30° cualquier losa se lee como el campo de cubos de protocol.

const W = 720;
const H = 300;

// La proyección. Constantes de módulo y no números sueltos en el JSX: el trazo
// del lazo y las esquinas de las losas tienen que salir de la misma matriz o no
// se apoyan en el mismo plano.
const DX = 0.94;
const DY = 0.32;
const iso = (x: number, y: number, z: number): [number, number] => [
  W / 2 + (x - y) * DX,
  H / 2 + (x + y) * DY - z,
];

/** Una losa: cara superior, y dos caras laterales para darle espesor. */
function Slab({
  z,
  half,
  dashed,
  fill,
}: {
  z: number;
  half: number;
  dashed?: boolean;
  fill: string;
}) {
  const t = 14;
  const a = iso(-half, -half, z);
  const b = iso(half, -half, z);
  const c = iso(half, half, z);
  const d = iso(-half, half, z);
  const bd = iso(-half, half, z - t);
  const cd = iso(half, half, z - t);
  const dd = iso(half, -half, z - t);

  const top = `M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]} L${d[0]} ${d[1]} Z`;
  const left = `M${d[0]} ${d[1]} L${c[0]} ${c[1]} L${cd[0]} ${cd[1]} L${bd[0]} ${bd[1]} Z`;
  const right = `M${c[0]} ${c[1]} L${b[0]} ${b[1]} L${dd[0]} ${dd[1]} L${cd[0]} ${cd[1]} Z`;

  return (
    <g>
      <path d={left} fill={fill} opacity="0.5" />
      <path d={right} fill={fill} opacity="0.32" />
      <path
        d={top}
        fill={fill}
        opacity="0.16"
        stroke="currentColor"
        strokeWidth="1"
        // El borde punteado es la única diferencia de trazo entre las dos losas,
        // y carga toda la afirmación: una tiene contorno cerrado y la otra no.
        strokeDasharray={dashed ? "5 5" : undefined}
      />
    </g>
  );
}

export default function LayerDiagram() {
  const green = "#00dc8d";
  const pale = "#f5f4f1";

  // Cuatro propuestas cruzando el umbral de la losa onchain.
  const threshold = 10;
  const proposals = [-28, -10, 8, 26];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" fill="none" aria-hidden="true">
      {/* ── la Foundation, arriba y devolviéndose ────────────────────────── */}
      <Slab z={96} half={52} dashed fill={pale} />

      {/* el lazo interno: empowers hacia abajo, reports to hacia arriba */}
      {(() => {
        const p = iso(-22, -22, 96);
        const q = iso(22, 22, 96);
        return (
          <g stroke="currentColor" strokeWidth="1" opacity="0.55">
            <path d={`M${p[0]} ${p[1]} L${q[0]} ${q[1]}`} />
            <circle cx={p[0]} cy={p[1]} r="2.6" fill="currentColor" />
            <circle cx={q[0]} cy={q[1]} r="2.6" fill="currentColor" />
          </g>
        );
      })()}

      {/* las funciones que salen del cuadro y no vuelven */}
      {[0, 1, 2].map((i) => {
        const from = iso(52, -34 + i * 34, 96);
        return (
          <path
            key={i}
            d={`M${from[0]} ${from[1]} L${W + 16} ${from[1] - 12 - i * 4}`}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 5"
            opacity="0.4"
          />
        );
      })}

      {/* ── la capa onchain, abajo y cerrada ─────────────────────────────── */}
      <Slab z={0} half={64} fill={green} />

      {/* las propuestas cruzando el umbral */}
      <g>
        {proposals.map((y, i) => {
          const start = iso(-64, y, 0);
          const cross = iso(threshold, y, 0);
          const end = iso(64, y, 0);
          return (
            <g key={i}>
              <path
                d={`M${start[0]} ${start[1]} L${cross[0]} ${cross[1]}`}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.45"
              />
              <path
                d={`M${cross[0]} ${cross[1]} L${end[0]} ${end[1]}`}
                stroke={green}
                strokeWidth="1.5"
              />
              <circle cx={end[0]} cy={end[1]} r="3" fill={green} />
            </g>
          );
        })}
        {/* el umbral */}
        <path
          d={`M${iso(threshold, -64, 0)[0]} ${iso(threshold, -64, 0)[1]} L${iso(threshold, 64, 0)[0]} ${iso(threshold, 64, 0)[1]}`}
          stroke={green}
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
