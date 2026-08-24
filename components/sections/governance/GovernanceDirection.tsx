import InstrumentSection from "@/components/sections/shells/instrument/Section";
import { DIRECTION } from "@/components/sections/governance/governanceContent";

// El remate: una de las dos capas planea desaparecer.
//
// Sin panel y sin figura, a propósito. La página entera estuvo dentro de
// aparatos, y esta sección es la única afirmación que no es un mecanismo sino
// una intención — sacarla del marco es lo que la distingue. Es el mismo recurso
// que usa la variante B de foundation con su bloque sin raíl: en una página que
// encuadra todo, lo que sale del encuadre pesa.
export default function GovernanceDirection() {
  return (
    <InstrumentSection eyebrow={DIRECTION.eyebrow} wide>
      <div className="grid-ds gap-y-12">
        <h2 className="col-span-12 max-w-[14ch] text-statement text-balance lg:col-span-7">
          {DIRECTION.headline}
        </h2>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <p className="max-w-[42ch] text-body text-white/60 text-pretty">{DIRECTION.body}</p>
          <p className="mt-6 text-micro-mono text-white/30">{DIRECTION.source}</p>
        </div>
        <p className="col-span-12 max-w-[24ch] text-h2-serif italic text-cream text-balance lg:col-span-8">
          {DIRECTION.kicker}
        </p>
      </div>
    </InstrumentSection>
  );
}
