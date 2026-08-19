import type { ReactNode } from "react";
import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import LabFiller from "@/components/sections/footer-labs/LabFiller";
import type { FooterLabSpec } from "@/components/sections/footer-labs/footerLabContent";

// El armazón que comparten las seis rutas del lab: ficha + relleno + footer.
//
// ── Por qué una ruta por footer y no las seis apiladas ─────────────────────
//
// `/prototype/hero-alt` apila sus seis versiones en una sola página, y ahí es
// lo correcto: un hero se compara mejor con el anterior a la vista. Un footer
// no. Cinco de los seis mecanismos se disparan contra **el fondo del
// documento** —tres tapan el viewport, uno vive en `position: fixed` detrás de
// la página— y solo puede haber un fondo del documento. Apilados, el primero se
// comería a los otros cinco y ninguno se vería como se ve en producción.
//
// Una ruta por versión también le devuelve a cada una la condición real: se
// llega al footer después de scrollear una página entera, una sola vez.
//
// El header queda arriba porque estas páginas cargan por su URL directa y sin
// la ficha no hay forma de saber cuál se está mirando. Es lo mismo que hace
// `AltDivider` en el lab de heroes, movido al principio.

export default function FooterLabShell({
  spec,
  children,
}: {
  spec: FooterLabSpec;
  children: ReactNode;
}) {
  return (
    <main className="flex flex-col bg-cream">
      {/* ── La "hoja" ────────────────────────────────────────────────────────
          Todo lo que va encima del footer vive en un bloque posicionado con
          fondo propio. No es decoración: es lo que permite que una versión
          monte su footer en `position: fixed` DETRÁS de la página y se
          descubra al scrollear (04 · Reveal). Sin un contenedor con fondo y
          z-index, un footer fijo se pintaría por encima del texto en flujo.

          `z-10` deja sitio a las dos familias: las versiones que TAPAN la
          página se montan por encima (`z-30`, igual que `SiteFooter`), y la
          que se descubre por debajo se monta en `z-0`. */}
      <div className="relative z-10 bg-cream">
      <Container as="header" className="pt-[calc(var(--site-header-block)+3rem)] pb-16">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <Link href="/prototype/footer-labs" className="text-label underline underline-offset-4">
            ← Footer lab
          </Link>
          <Eyebrow className="text-gray-intermediate">
            {spec.index} · {spec.takeover ? "Takeover" : "No takeover"} · {spec.technique}
          </Eyebrow>
        </div>

        <h1 className="text-h1 mt-6">{spec.title}</h1>

        <div className="mt-8 grid max-w-[110ch] gap-8 sm:grid-cols-2">
          <div>
            <p className="text-caption uppercase text-gray-intermediate">La apuesta</p>
            <p className="text-body mt-2 text-muted-foreground">{spec.bet}</p>
          </div>
          <div>
            <p className="text-caption uppercase text-gray-intermediate">Qué mirar</p>
            <p className="text-body mt-2 text-muted-foreground">{spec.watch}</p>
          </div>
        </div>
      </Container>

      <LabFiller />
      </div>

      {children}
    </main>
  );
}
