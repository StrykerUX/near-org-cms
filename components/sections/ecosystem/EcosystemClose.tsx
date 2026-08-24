import Link from "next/link";
import StageSection from "@/components/sections/shells/stage/Section";
import { CLOSING } from "@/components/sections/ecosystem/ecosystemContent";

// El cierre, sobre el único blanco de la página.
//
// Sin figura, y es una decisión: el directorio de arriba ya es toda la evidencia
// que esta página tiene, y un dibujo acá competiría con el remate en vez de
// apoyarlo. Un cierre corto respira.
export default function EcosystemClose() {
  return (
    <StageSection tone="white" wide>
      <div className="grid-ds items-end gap-y-10">
        <h2 className="col-span-12 max-w-[12ch] text-h1 text-balance lg:col-span-6">
          {CLOSING.headline}
        </h2>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <p className="max-w-[40ch] text-body-lg text-ink-soft text-pretty">{CLOSING.body}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={CLOSING.primary.href}
              className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-label-lg text-cream transition-colors hover:bg-ink-soft"
            >
              {CLOSING.primary.label}
            </a>
            <Link
              href={CLOSING.secondary.href}
              className="inline-flex items-center rounded-full border border-rule px-6 py-3 text-label-lg text-ink transition-colors hover:bg-card-tint"
            >
              {CLOSING.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </StageSection>
  );
}
