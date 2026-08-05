import Link from "next/link";
import type { PaginationData } from "@/components/sections/types";

// Extraído de los 3 bloques Previous/Next casi idénticos. A propósito recibe
// `basePath` + `params` en vez de una prop-función `hrefFor`: una función no
// es serializable si esta sección algún día pasa a ser client component, y
// construir el href acá adentro elimina el bug de encoding triplicado que
// tenían las 3 páginas originales (`encodeURIComponent(q)` aplicado en unos
// sitios y no en otros).
export type PaginationProps = PaginationData;

function hrefFor(page: number, { basePath, params }: PaginationData) {
  const query = new URLSearchParams(params);
  query.set("page", String(page));
  return `${basePath}?${query.toString()}`;
}

export default function Pagination(props: PaginationProps) {
  const { page, totalPages } = props;
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-16">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1, props)}
          className="px-5 py-2 border border-[#CAC8C8] rounded-xl font-mono text-sm text-[#5A5A5A] hover:bg-[#ECECEC] transition"
        >
          ← Previous
        </Link>
      )}
      <span className="font-mono text-sm text-[#5A5A5A]">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={hrefFor(page + 1, props)}
          className="px-5 py-2 border border-[#CAC8C8] rounded-xl font-mono text-sm text-[#5A5A5A] hover:bg-[#ECECEC] transition"
        >
          Next →
        </Link>
      )}
    </div>
  );
}
