// La ficha de cada prueba del lab de footers.
//
// ── Qué cambió acá ──────────────────────────────────────────────────────────
//
// Antes esto era el catálogo de seis footers ALTERNATIVOS —cada uno con su
// propia sección, su propio mecanismo de entrada y su propia copia de los
// links— y el archivo llevaba también esa copia (`GROUPS`), para que las seis
// dijeran lo mismo y la comparación midiera el mecanismo y no el contenido.
//
// Las seis se borraron. Lo que queda es más chico y más útil: dos variantes
// del footer QUE YA ESTÁ EN PRODUCCIÓN. No hay secciones nuevas ni copia de
// los links, porque las dos rutas montan `components/site/SiteFooter.tsx`
// pasándole un `variant` — así una prueba no puede desincronizarse de lo que
// se está probando, que es exactamente lo que pasa con un footer copiado.
//
// Por eso ya no hay `GROUPS` en este archivo: los links salen del footer real.

export type FooterLabSpec = {
  id: string;
  slug: string;
  index: string;
  title: string;
  /** La variante de `SiteFooter` que monta la ruta. */
  variant: "veil" | "compact";
  technique: string;
  bet: string;
  watch: string;
};

export const LABS: FooterLabSpec[] = [
  {
    id: "veil",
    slug: "veil",
    index: "01",
    variant: "veil",
    title: "Veil",
    technique: "the logo sinks into the footer",
    bet: "A gradient the colour of the background falls over the wordmark from its top edge down, and the logo sits flush against the bottom of the page: it does not end there, it goes under. The copyright floats back over it as its own layer so nothing pushes the logo up.",
    watch: "Where the letters stop being readable. The veil is measured against the logo's own box, so it follows whatever height the vertical budget gives it — in a short viewport the logo is already cropped and the gradient lands on less of it.",
  },
  {
    id: "compact",
    slug: "compact",
    index: "02",
    variant: "compact",
    title: "Compact",
    technique: "no headline, two-up sub-groups",
    bet: "The headline goes, and the two groups that carry sub-groups —Resources and About— open into two columns instead of stacking. The panel gets shorter, and every pixel it gives back goes to the logo: the vertical budget hands the leftover to the wordmark on its own.",
    watch: "How much bigger the logo actually gets, and whether the column of links still reads as a column once it is two-up. This is the version that answers 'the footer is too tall' without touching the logo's size directly.",
  },
];
