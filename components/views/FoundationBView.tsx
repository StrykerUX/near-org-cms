import Container from "@/components/primitives/Container";

// PLACEHOLDER — lo reemplaza la composición real de la variante B.
// Existe para que el dev server compile mientras la variante se escribe.
export default function FoundationBView() {
  return (
    <main className="flex min-h-svh flex-col justify-center bg-cream py-32">
      <Container>
        <p className="text-caption-mono text-gray-intermediate">Foundation · B</p>
        <h1 className="mt-4 text-h2">En construcción</h1>
      </Container>
    </main>
  );
}
