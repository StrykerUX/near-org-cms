import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import { CLOSING } from "@/components/sections/governance/governanceContent";

// El cierre: tres salidas, y las tres a páginas que existen.
//
// Una página compuesta a partir de otras dos tiene una obligación que una página
// propia no tiene — devolver al lector a las fuentes. De ahí que el cierre sean
// links y no un CTA: lo que sigue no es una acción, es el resto del argumento.
export default function GovernanceClose() {
  return (
    <InstrumentSection>
      <h2 className="text-h2 text-cream">{CLOSING.headline}</h2>
      <ul className="mt-12 flex flex-col">
        {CLOSING.links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              className="group flex items-center justify-between gap-6 border-t border-white/12 py-7 transition-colors hover:text-near-green-accent"
            >
              <span className="text-h3 text-pretty">{link.label}</span>
              <ArrowUpRight
                className="size-6 shrink-0 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </InstrumentSection>
  );
}
