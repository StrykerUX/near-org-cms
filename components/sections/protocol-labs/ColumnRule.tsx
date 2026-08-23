// La retícula, dibujada.
//
// Es el fondo de la alternativa A y su declaración de intenciones: la página es
// un documento técnico y su estructura está a la vista, igual que en un plano.
// Doce filetes hairline en las mismas columnas que `grid-ds`, así que ninguna
// pieza tiene que calcular nada para caer sobre ellos — se dibujan CON el grid,
// no encima de una estimación suya.
//
// `Container` + `grid-ds` y no un `repeating-linear-gradient`: el gradiente
// dibuja franjas de ancho constante y el grid tiene gutter, así que las dos
// retículas se despegan en cuanto cambia el ancho de la ventana. Este es el
// mismo mecanismo que usa `GridOverlay` para el ruler de dev.
import Container from "@/components/primitives/Container";

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
