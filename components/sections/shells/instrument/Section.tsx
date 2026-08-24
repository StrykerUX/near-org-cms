import type { ReactNode } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

// El envoltorio de sección del armazón «instrumento»: fondo oscuro, encabezado
// en dos columnas, y el ritmo vertical que comparten las cuatro variantes B.
//
// ── Por qué el encabezado va en dos columnas y no centrado ─────────────────
//
// Un titular centrado sobre un panel ancho obliga al ojo a volver al centro
// entre bloque y bloque. En dos columnas —titular a la izquierda, intro a la
// derecha— la lectura arranca siempre en el mismo borde, que es el mismo borde
// donde arranca el panel de abajo. La página gana una línea vertical de entrada
// que un encabezado centrado rompe en cada sección.
//
// ── `title` es ReactNode y no string ──────────────────────────────────────
//
// Los titulares de este sitio llevan `<Accent>` y `<br />`, así que pasarlos como
// texto obligaría a elegir un esquema para «texto con un tramo acentuado» — una
// decisión del modelo de contenido, no de un armazón. Es un slot, no un dato.

export type InstrumentSectionProps = {
  children: ReactNode;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  /** Espacio de más arriba y abajo, para la sección que abre o cierra la página. */
  wide?: boolean;
  id?: string;
  className?: string;
};

export default function InstrumentSection({
  children,
  eyebrow,
  title,
  intro,
  wide = false,
  id,
  className = "",
}: InstrumentSectionProps) {
  return (
    <section
      id={id}
      // `scroll-mt` y no `scroll-margin` a mano: el header del sitio es `fixed`,
      // así que un ancla sin despeje deja el titular debajo de la barra.
      className={`bg-ink text-cream ${wide ? "py-[18svh]" : "py-[12svh]"} ${
        id ? "scroll-mt-[var(--site-header-block)]" : ""
      } ${className}`}
    >
      <Container>
        {eyebrow || title || intro ? (
          <div className="grid-ds items-end gap-y-6">
            <div className="col-span-12 lg:col-span-7">
              {eyebrow ? <Eyebrow className="text-white/40">{eyebrow}</Eyebrow> : null}
              {title ? (
                <h2 className="mt-6 max-w-[16ch] text-h1 text-balance">{title}</h2>
              ) : null}
            </div>
            {intro ? (
              <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                <p className="max-w-[42ch] text-body text-white/60 text-pretty">{intro}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={eyebrow || title || intro ? "mt-16 lg:mt-20" : ""}>{children}</div>
      </Container>
    </section>
  );
}
