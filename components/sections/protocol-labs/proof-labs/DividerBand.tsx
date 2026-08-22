import type { ReactNode } from "react";
import Container from "@/components/primitives/Container";

// El marco común de las ocho variantes cuando la franja es un DIVIDER.
//
// ── Por qué existe este archivo ────────────────────────────────────────────
//
// Las ocho nacieron como sección: cada una elegía su alto, su fondo y sus
// bordes. Como juntura entre el hero y el contenido, esas tres cosas dejan de
// ser decisiones de la variante y pasan a ser propiedades del ROL — un divider
// que mide el doble que otro no se está comparando, se está haciendo notar.
//
// Acá quedan fijas, y lo que cada variante decide es lo único que las distingue:
// qué hace con las seis cifras adentro.
//
// ── Lo que el rol impone ───────────────────────────────────────────────────
//
// **Alto.** `py-8` (`py-10` en desktop) y nada de `min-h`. Un divider mide lo
// que mide su contenido; en cuanto pide una fracción del viewport deja de ser
// una juntura y vuelve a ser una sección.
//
// **Bordes arriba y abajo.** Son lo que lo convierte en juntura: el de arriba
// cierra el hero, el de abajo abre lo que sigue. Sin ellos la banda flota entre
// dos bloques y se lee como una tercera sección corta.
//
// **Fondo.** Por defecto el blanco de la página, que contra el crema del hero da
// el escalón. `tone="ink"` es para la única variante que apuesta a un corte
// fuerte; `tone="cream"` continúa el hero y deja que trabajen sólo las reglas.
//
// **Sin titular.** Ninguna variante lleva encabezado. Un divider con título es
// una sección.

const TONE = {
  page: "bg-background text-foreground border-rule",
  cream: "bg-cream text-foreground border-ink/20",
  ink: "bg-ink text-cream border-cream/20",
} as const;

export default function DividerBand({
  tone = "page",
  bleed = false,
  children,
}: {
  tone?: keyof typeof TONE;
  /** Sin `Container`: para la variante que necesita tocar los dos bordes. */
  bleed?: boolean;
  children: ReactNode;
}) {
  const inner = <div className="py-8 lg:py-10">{children}</div>;

  return (
    <section
      {...(tone === "ink" ? { "data-nav-dark": "" } : {})}
      className={`border-y ${TONE[tone]}`}
    >
      {bleed ? inner : <Container>{inner}</Container>}
    </section>
  );
}
