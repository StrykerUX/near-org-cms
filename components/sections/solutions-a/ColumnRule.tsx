import Container from "@/components/primitives/Container";

// La retícula, dibujada.
//
// Es el fondo de esta propuesta y su declaración de intenciones: A sostiene que
// `/solutions` es un ÍNDICE, y un índice muestra su estructura. Es la única
// página del sitio cuyas doce columnas se ven.
//
// Doce filetes hairline sobre las mismas columnas que `grid-ds`, así que ninguna
// pieza tiene que calcular nada para caer encima — se dibujan CON el grid, no
// sobre una estimación suya.
//
// `Container` + `grid-ds` y no un `repeating-linear-gradient`: el gradiente
// dibuja franjas de ancho constante y el grid tiene gutter, así que las dos
// retículas se despegan en cuanto cambia el ancho de la ventana. Es el mismo
// mecanismo que usa `GridOverlay` para el ruler de dev.
//
// ── Por qué es una COPIA y no un import ────────────────────────────────────
//
// El original vive en `protocol-labs/ColumnRule.tsx`, y `protocol-labs/` es un
// laboratorio: la regla del README de sections dice que su contenido puede
// cambiar o borrarse sin aviso, y que lo que una página necesite se copia. Esta
// copia es idéntica salvo este comentario.
export default function ColumnRule({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <Container className="h-full">
        <div className="grid-ds h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className={`h-full border-l ${
                tone === "dark" ? "border-cream/[0.07]" : "border-ink/[0.07]"
              }`}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
