import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
      <p className="font-mono text-eyebrow uppercase text-muted-foreground">
        Error · 404
      </p>
      <h1 className="text-h3 font-medium">Page not found</h1>
      <Link
        href="/"
        className="rounded-full border border-border px-6 py-2 text-sm hover:bg-accent transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
