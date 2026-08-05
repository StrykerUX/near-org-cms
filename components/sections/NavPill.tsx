import { ChevronDown } from "lucide-react";
import Button from "@/components/primitives/Button";

// Pill negra flotante — extraída y mejorada de la que vivía hardcodeada en
// components/views/PrototypeLandingView.tsx:34 (misma estructura de fondo/
// padding). Los 3 links con chevron son decorativos en este draft: no hay
// panel de dropdown real, solo la rotación del chevron al hover.
const LINKS = [
  { label: "For Founders" },
  { label: "For Developers" },
  { label: "Tech Stack" },
];

export default function NavPill() {
  return (
    // w-fit + mx-auto: la pill se ajusta a su contenido y se centra dentro
    // del Container que la envuelve — nunca debe estirarse a todo el ancho
    // (bug visual encontrado comparando contra la captura de referencia).
    <nav className="group/nav mx-auto flex w-fit items-center gap-10 rounded-full bg-secondary px-2 py-2 pl-6 text-secondary-foreground">
      <span className="font-sans text-h4 font-medium lowercase">near</span>

      <div className="hidden items-center gap-8 md:flex">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href="#"
            className="group/link flex items-center gap-1 text-eyebrow uppercase text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
          >
            {link.label}
            <ChevronDown className="size-3.5 transition-transform duration-300 group-hover/link:rotate-180" />
          </a>
        ))}
      </div>

      <Button href="#" variant="brand">
        Get started
      </Button>
    </nav>
  );
}
