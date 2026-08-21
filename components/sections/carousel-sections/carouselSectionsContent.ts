// Copy y datos de los dos carruseles — portados 1:1 del prototipo de
// referencia (carruseles-ambas-secciones.html), solo cambian los assets de
// stories (ver abajo). Módulo puro: sin JSX ni funciones, mismo contrato que
// components/sections/README.md pide para *Content.ts.

// Los tres tonos ORIGINALES de PressCarousel (gradiente verde / gris / negro),
// con los hex exactos que pidió el usuario — no los de TestimonialMarquee
// (blanco/#101010). Ver TONE_CARD en PressCarousel.tsx.
export type PressTone = "green" | "gray" | "dark";

// Contenido: los 5 testimonios de TestimonialMarquee
// (components/sections/TestimonialMarquee.tsx), no importados —mismo
// criterio que CUSTOMER_STORIES abajo. Tono intercalado en ciclo de a tres
// (green, gray, dark, green, gray…) — no el light/dark de la fuente. Sin
// bandas de fondo: eso era decoración de TestimonialMarquee, no se pidió acá.
export const PRESS_ITEMS = [
  {
    tone: "green",
    logo: { src: "/logos/venice.png", width: 89, height: 40 },
    body: "Near still feels like the most underrated team in crypto to me. New feature releases basically every other week on an actually scalable chain.",
    name: "Mert Mumtaz",
    role: "CEO of Helius",
  },
  {
    tone: "gray",
    logo: { src: "/logos/abound.png", width: 111, height: 24 },
    body: "We shipped confidential payouts in a week. The part that surprised us was not needing a separate trust story to sell it.",
    name: "Dana Ferris",
    role: "CTO of Abound",
  },
  {
    tone: "dark",
    logo: { src: "/logos/brave.png", width: 86, height: 24 },
    body: "Privacy that has to be explained is privacy nobody uses. Here it is the default, and that changed how we onboard.",
    name: "Iris Kowalski",
    role: "Head of Product, Brave",
  },
  {
    tone: "green",
    logo: { src: "/logos/zodl.png", width: 133, height: 27 },
    body: "Cross-chain used to mean three integrations and a bridge we did not control. Now it is one account and it settles.",
    name: "Tomás Rivera",
    role: "Founder of ZODL",
  },
  {
    tone: "gray",
    logo: { src: "/logos/ledger.png", width: 117, height: 39 },
    body: "Self custody stopped being the hard sell. Our users keep their keys and still get the experience they expected.",
    name: "Amara Osei",
    role: "VP Engineering, Ledger",
  },
] as const;

// Assets reales de components/sections/home-ab7/homeAb7Content.ts (logo +
// foto) por ruta pública — no se importa ese archivo ni ningún componente de
// esa carpeta, un archivo en public/ no es código compartido. La copy
// (title/eyebrow) es la del prototipo aprobado, no la de home-ab7.
export const CUSTOMER_STORIES = [
  {
    company: "abound",
    logo: { src: "/logos/abound.png", width: 111, height: 24 },
    image: "/prototype/v2/stories/abound.png",
    title: "Rebuilding consumer finance on NEAR",
    href: "#",
  },
  {
    company: "brave",
    logo: { src: "/logos/brave.png", width: 86, height: 24 },
    image: "/prototype/v2/stories/brave.png",
    title: "A new frontier for Brave AI Privacy with NEAR AI",
    href: "#",
  },
  {
    company: "ZODL",
    logo: { src: "/logos/zodl.png", width: 133, height: 27 },
    image: "/prototype/v2/stories/zodl.png",
    title: "Self-custody at scale, without the friction",
    href: "#",
  },
  {
    company: "LEDGER",
    logo: { src: "/logos/ledger.png", width: 117, height: 39 },
    image: "/prototype/v2/stories/ledger.png",
    title: "Hardware-grade security meets post-quantum signing",
    href: "#",
  },
] as const;
