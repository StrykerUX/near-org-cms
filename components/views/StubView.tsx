import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

// La view de una página que existe pero todavía no tiene contenido.
//
// ── Por qué una sola compartida y no una por página ─────────────────────────
//
// El contrato de `components/views/` es "la composición de cada página real":
// una view por página, con sus secciones y su copy. Esto lo rompe a propósito y
// de forma temporal — 19 archivos idénticos salvo el título no son 19
// composiciones, son 19 copias de la misma.
//
// **En cuanto una página reciba contenido real se le hace su view propia** y
// deja de pasar por acá. Cuando no quede ninguna usándola, este archivo se borra.
// Que el `title` llegue por prop y no por contexto es justamente para que esa
// migración sea cambiar una línea en el `page.tsx`.
//
// Las páginas que usan esto llevan `sitemap: false` y `robots: "noindex"` en su
// meta: una página vacía no tiene por qué estar en el sitemap ni en Google.
export type StubViewProps = {
  /** El mismo título del `page.meta.ts`, para que no haya dos fuentes. */
  title: string;
};

export default function StubView({ title }: StubViewProps) {
  return (
    // El `pt` despeja el header flotante igual que el resto de las páginas de
    // `(site)` — ver `--site-header-block` en app/globals.css.
    <main className="flex flex-1 flex-col bg-cream pt-[calc(var(--site-header-block)+3rem)] pb-24">
      <Container className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <Eyebrow className="text-gray-intermediate">Próximamente</Eyebrow>
        <h1 className="text-h2 text-pretty">{title}</h1>
        <p className="max-w-md text-body text-gray-intermediate text-pretty">
          Esta página existe para que el menú del sitio tenga a dónde apuntar.
          Todavía no tiene contenido.
        </p>
      </Container>
    </main>
  );
}
