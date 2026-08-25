// El rótulo que separa una dirección de la siguiente en las páginas de
// comparación.
//
// NO es una sección de marketing: no sale nunca de `/prototype`, y por eso se
// permite lo que el catálogo no —numerar por numerar, nombrar la carpeta del
// código, escribir en dos idiomas—. Es un letrero de sala, no una pieza.
//
// Va con `sticky` en el borde superior: recorriendo cinco versiones de la misma
// sección, lo que se pierde a los diez segundos es CUÁL se está mirando. Pegado
// arriba, el nombre de la dirección viaja con la vista.
export default function LabDivider({
  index,
  name,
  source,
  note,
}: {
  index: number;
  /** El nombre de la dirección — el mismo que la carpeta. */
  name: string;
  /** De qué referencia salió. */
  source: string;
  /** Una línea sobre qué está probando. */
  note: string;
}) {
  return (
    <div className="sticky top-0 z-30 border-y border-ink/15 bg-sweep text-ink">
      <div className="mx-auto flex w-full max-w-[1780px] flex-col gap-2 px-[60px] py-4 lg:flex-row lg:items-baseline lg:gap-8">
        <p className="text-caption-mono flex shrink-0 items-baseline gap-3 uppercase">
          <span>{String(index).padStart(2, "0")}</span>
          <span>{name}</span>
        </p>
        <p className="text-micro-mono uppercase opacity-60">{source}</p>
        <p className="text-caption text-pretty opacity-80">{note}</p>
      </div>
    </div>
  );
}
