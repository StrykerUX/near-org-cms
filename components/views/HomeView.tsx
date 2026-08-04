import Link from "next/link";

export type HomeViewProps = {
  pages: { href: string; label: string }[];
};

export default function HomeView({ pages }: HomeViewProps) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-eyebrow uppercase text-muted-foreground">Draft</p>
      <h1 className="text-h3 font-medium">Design system in progress</h1>
      <ul className="flex flex-col gap-2">
        {pages.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="text-body-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {page.label} →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
