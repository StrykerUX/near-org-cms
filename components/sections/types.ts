// View-models de la zona diseñadores. Deliberadamente propios y desacoplados
// de Prisma — nunca `Prisma.PostGetPayload<...>` ni `Date` (ver Fase 3 del
// plan: la conversión vive en lib/queries/*, este archivo no importa nada).

export type PostCardData = {
  id: string;
  slug: string;
  title: string;
  href: string; // ya construido: `/blog/${slug}`
  coverImage: string; // ya con fallback aplicado
  excerpt: string | null;
  dateLabel: string; // ya formateado, nunca un Date crudo
  eyebrow: string | null; // nombre de categoría, o null
};

export type PillItem = {
  id: string;
  label: string;
  href: string;
  active: boolean;
};

export type PaginationData = {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string>;
};
