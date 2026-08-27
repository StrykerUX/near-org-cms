import type { ReactNode } from "react";
import Container from "@/components/primitives/Container";

// Extraído de los 3 heroes oscuros casi idénticos de app/(site)/blog/{page,
// category/[slug],tag/[tag]}.tsx. Decisiones de variante documentadas en
// docs/fase0-divergencias-blog.md — no re-derivar aquí.
const SIZE = {
  lg: { minH: "min-h-[420px]", pb: "pb-16 lg:pb-24" },
  md: { minH: "min-h-[360px]", pb: "pb-16 lg:pb-20" },
} as const;

export type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  // Subcopy de la landing del blog (index) — estilo de párrafo, ver
  // docs/fase0-divergencias-blog.md #3.
  description?: ReactNode;
  // Conteo "{total} post(s)" de category/tag. Estilo distinto y más discreto
  // que `description` — son dos cosas distintas en el original, no una
  // misma prop reutilizada. Ver docs/fase0-divergencias-blog.md #3.
  stat?: ReactNode;
  size?: keyof typeof SIZE;
};

// `data-nav-dark` no es decorativo: el header del sitio es una barra flotante
// casi negra (#0a0a0a) y este hero es #101010, así que sin el atributo la barra
// desaparece sobre él. El atributo la pasa a `--q-nav-bg-over-dark` mientras lo
// cruza — el mismo mecanismo que usan las secciones oscuras de /prototype.
//
// La prop `nav` que esta sección tenía desapareció: el header ya no lo compone
// cada página, lo monta `app/(site)/layout.tsx` una sola vez. Como es `fixed`,
// el hero tiene que despejarlo él mismo con `--site-header-block`, que antes le
// daba el propio nav al estar en flujo.
export default function PageHero({
  eyebrow,
  title,
  description,
  stat,
  size = "md",
}: PageHeroProps) {
  return (
    <section
      data-nav-dark
      className={`relative bg-[#101010] ${SIZE[size].minH} flex flex-col pt-[var(--site-header-block)]`}
    >
      <Container width="wide" className="relative z-10 flex flex-col flex-1">
        <div className={`flex flex-col flex-1 justify-end ${SIZE[size].pb}`}>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50 mb-4">
            {eyebrow}
          </span>
          <h1
            className="text-white font-medium leading-[1.05] tracking-tight"
            style={{ fontSize: "var(--font-size-h1)" }}
          >
            {title}
          </h1>
          {description && (
            <p
              className="mt-4 text-white/60 font-mono max-w-[520px] leading-relaxed"
              style={{ fontSize: "var(--font-size-body)" }}
            >
              {description}
            </p>
          )}
          {stat && <p className="mt-3 font-mono text-white/50 text-[0.75rem]">{stat}</p>}
        </div>
      </Container>
    </section>
  );
}
