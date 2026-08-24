import StageSection from "@/components/sections/shells/stage/Section";
import MarkCell from "@/components/sections/ecosystem/MarkCell";
import { DIRECTORY, ECOSYSTEM_MARKS } from "@/components/sections/ecosystem/ecosystemContent";

// El directorio, agrupado.
//
// ── Por qué agrupado y no una grilla de doce ──────────────────────────────
//
// Doce logos en una grilla pareja dicen «hay doce» y nada más. Agrupados dicen
// qué se puede HACER acá, que es lo que alguien viene a averiguar a una página
// de ecosistema — y de paso convierten una lista en un mapa. El costo es que la
// clasificación es una afirmación, así que va declarada como propuesta en el
// módulo de copy y repetida bajo el titular, donde el lector la ve.
//
// Los grupos tienen tamaños desparejos (4 · 3 · 5) y la retícula no los empareja
// a propósito: forzarlos a cuatro y cuatro y cuatro habría significado mover un
// proyecto a la categoría equivocada para que la fila cerrara, que es
// exactamente el error que el aviso de arriba pide evitar.

const BY_ID = new Map(ECOSYSTEM_MARKS.map((m) => [m.id, m]));

export default function EcosystemDirectory() {
  return (
    <StageSection
      eyebrow={DIRECTORY.eyebrow}
      title={DIRECTORY.headline}
      intro={DIRECTORY.note}
      tone="tint"
    >
      <div className="flex flex-col gap-20">
        {DIRECTORY.groups.map((group) => (
          <div key={group.id} className="grid-ds gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <h3 className="mt-6 max-w-[16ch] text-h3-serif italic text-pretty">
                {group.title}
              </h3>
              <p className="mt-4 max-w-[34ch] text-body-sm text-ink-soft text-pretty">
                {group.body}
              </p>
            </div>

            <ul className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-8 lg:col-start-5 lg:grid-cols-3">
              {group.members.map((id) => {
                const mark = BY_ID.get(id);
                if (!mark) return null;
                return (
                  <li key={id}>
                    <MarkCell name={mark.name} src={"src" in mark ? mark.src : undefined} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </StageSection>
  );
}
