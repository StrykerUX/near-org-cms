import type { ReactNode } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

// El envoltorio de sección del armazón «escenario». Es el hermano claro de
// `instrument/Section`, y comparte con él la retícula del encabezado a
// propósito: las dos variantes de una misma página tienen que leerse como dos
// tratamientos del mismo material, no como dos sitios.
//
// Lo que cambia es todo lo demás: fondo claro, más aire, y un `tone` que decide
// sobre qué superficie se apoya la sección. Los tres tonos NO son
// intercambiables — `cream` es el default de la página, `tint` marca un bloque
// que agrupa cards (sobre blanco puro las cards desaparecen; ver la nota de
// `--cream` en globals.css), y `white` es el respiro, que una página debería
// gastar una sola vez.

const TONE = {
  cream: "bg-cream text-ink",
  tint: "bg-card-tint/50 text-ink",
  white: "bg-background text-ink",
} as const;

export type StageSectionProps = {
  children: ReactNode;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  tone?: keyof typeof TONE;
  /** Espacio de más, para la sección que abre o cierra la página. */
  wide?: boolean;
  id?: string;
  className?: string;
};

export default function StageSection({
  children,
  eyebrow,
  title,
  intro,
  tone = "cream",
  wide = false,
  id,
  className = "",
}: StageSectionProps) {
  return (
    <section
      id={id}
      className={`${TONE[tone]} ${wide ? "py-[18svh]" : "py-[12svh]"} ${
        id ? "scroll-mt-[var(--site-header-block)]" : ""
      } ${className}`}
    >
      <Container>
        {eyebrow || title || intro ? (
          <div className="grid-ds items-end gap-y-6">
            <div className="col-span-12 lg:col-span-7">
              {eyebrow ? <Eyebrow className="text-gray-intermediate">{eyebrow}</Eyebrow> : null}
              {title ? (
                <h2 className="mt-6 max-w-[16ch] text-h1 text-balance">{title}</h2>
              ) : null}
            </div>
            {intro ? (
              <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                <p className="max-w-[42ch] text-body text-ink-soft text-pretty">{intro}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={eyebrow || title || intro ? "mt-16 lg:mt-20" : ""}>{children}</div>
      </Container>
    </section>
  );
}
