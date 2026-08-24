// El riel de actos: en qué paso está la escena, y cuántos faltan.
//
// Es la pieza que convierte una escena pegada en algo que se puede SEGUIR. Sin
// ella, un panel que cambia mientras el lector scrollea no dice cuántas veces va
// a cambiar, y el lector no sabe si le conviene esperar o seguir de largo. Con
// ella, la escena declara su duración por adelantado — que es lo que hace que
// nadie la abandone a la mitad.
//
// ── Es presentacional a propósito ─────────────────────────────────────────
//
// No lee el scroll ni trae ScrollTrigger: recibe `active` de quien conduce la
// escena. Así el riel es un server component y el único cliente es la sección
// que ya iba a serlo. Además hay UNA fuente del paso en curso — la timeline— en
// vez de dos que se pueden desincronizar.
//
// ── El tramo recorrido no se borra ────────────────────────────────────────
//
// Los actos ya pasados quedan con su filete tenue en vez de desaparecer: la
// barra completa es la duración, y una barra que se acorta a medida que avanza
// mide otra cosa. Solo el activo va en verde y a ancho completo.

export type Act = {
  id: string;
  label: string;
};

export type ActRailProps = {
  acts: readonly Act[];
  /** Índice del acto en curso. Fuera de rango = ninguno encendido. */
  active: number;
};

export default function ActRail({ acts, active }: ActRailProps) {
  return (
    // `role="list"` explícito: los `<li>` de un `<ol>` con `list-none` pierden
    // su semántica de lista en VoiceOver.
    <ol role="list" className="flex w-full items-center gap-3 lg:gap-6">
      {acts.map((act, i) => {
        const isActive = i === active;
        const isPast = i < active;
        return (
          <li key={act.id} className="flex min-w-0 flex-1 items-baseline gap-2 lg:gap-3">
            <span
              className={`text-micro-mono ${isActive ? "text-near-green-accent" : "text-white/35"}`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`hidden min-w-0 truncate text-micro-mono uppercase lg:inline ${
                isActive ? "text-cream" : "text-white/35"
              }`}
            >
              {act.label}
            </span>
            {/* El filete toma el resto de la celda, así que su largo es el
                mismo para los cuatro actos y la barra mide parejo. */}
            <span
              aria-hidden="true"
              className={`h-px min-w-4 flex-1 ${
                isActive
                  ? "bg-near-green-accent"
                  : isPast
                    ? "bg-white/30"
                    : "bg-white/12"
              }`}
            />
          </li>
        );
      })}
    </ol>
  );
}
