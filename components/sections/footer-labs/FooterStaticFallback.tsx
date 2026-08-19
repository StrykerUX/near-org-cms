import Container from "@/components/primitives/Container";
import { FooterHeadline, FooterLegal, FooterLinks, FooterWordmark } from "./FooterParts";

/**
 * El contenido de footer que ven mobile y `prefers-reduced-motion`, igual en las seis
 * versiones.
 *
 * El lab se decidió **desktop primero**: las seis resuelven su idea en ≥1024px
 * con motion habilitado, y por debajo de eso caen todas acá. Compartirlo es
 * deliberado — seis fallbacks distintos serían seis diseños más que revisar sin
 * que ninguno responda la pregunta que el lab hace.
 *
 * ── Las clases de visibilidad ──────────────────────────────────────────────
 *
 * Devuelve un `<div>` y no un `<footer>`: va DENTRO del `<footer>` de cada
 * versión, que es el único landmark de la página. Dos `footer` en el DOM —uno
 * oculto por CSS— siguen siendo dos landmarks para un lector de pantalla.
 *
 * `lg:motion-safe:hidden` = visible por debajo de 1024px SIEMPRE, y visible en
 * desktop cuando el usuario pidió reducir movimiento. Su complemento exacto,
 * `hidden lg:motion-safe:block`, es el que lleva cada versión animada.
 *
 * Que sean dos árboles y no uno con estado es lo que permite que el swap lo
 * haga CSS: cambiar la preferencia de movimiento en vivo no necesita re-render,
 * y sin JS queda el estático — que es la degradación correcta.
 */
export default function FooterStaticFallback() {
  return (
    <div className="bg-cream text-foreground lg:motion-safe:hidden">
      <Container className="grid gap-16 pb-16 pt-24">
        <FooterHeadline />
        <FooterLinks />
        <FooterLegal />
      </Container>
      <FooterWordmark className="px-[60px] pb-6" />
    </div>
  );
}
