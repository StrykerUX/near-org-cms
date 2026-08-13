"use client";

import Container from "@/components/primitives/Container";
import HeroVideo from "@/components/sections/home-v2/HeroVideo";
import LabBarsProportional from "./LabBarsProportional";
import DescentDebug, { useDescentReadout } from "./DescentDebug";

// Approach C. El hero es el de PRODUCCIÓN sin tocar —este approach no lo necesita— y
// lo único distinto es el reloj de la escalera. Comparar contra `/prototype/descent/real`
// aísla exactamente ese cambio: dos líneas de timeline, nada más.
//
// Qué mirar en el HUD: `stair` contra `flat` en los primeros ~150px de scroll. En
// producción `flat` gana desde el primer píxel (a 110px de scroll hay 110px de barra y
// 0 de escalera). Acá debería ganar `stair` con holgura.
export default function DescentZocalo({
  debug = false,
  stepSpan,
}: {
  debug?: boolean;
  stepSpan?: number;
}) {
  const readout = useDescentReadout(debug);

  return (
    <>
      {debug && (
        <DescentDebug
          approach={`C · zócalo${stepSpan ? ` · span ${stepSpan}` : ""}`}
          curve="power2.out"
          readout={readout}
        />
      )}

      <HeroVideo />
      <LabBarsProportional {...(stepSpan ? { stepSpan } : {})} />

      <section className="bg-background py-40">
        <Container>
          <p className="text-body-lg text-muted-foreground">
            Sección siguiente. En la página real acá va OwnYourOwn, que pasa por encima
            de las barras.
          </p>
        </Container>
      </section>
    </>
  );
}
