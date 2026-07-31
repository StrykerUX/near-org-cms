import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-eyebrow uppercase text-muted-foreground">
        Draft
      </p>
      <h1 className="text-h3 font-medium">Design system in progress</h1>
      <Link
        href="/brand"
        className="text-body-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        View the typography guide →
      </Link>
    </main>
  );
}
