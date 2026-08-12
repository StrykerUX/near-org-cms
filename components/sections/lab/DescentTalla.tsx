"use client";

import Container from "@/components/primitives/Container";
import LabHeroCarve from "./LabHeroCarve";
import LabBarsStatic from "./LabBarsStatic";
import DescentDebug, { useDescentReadout } from "./DescentDebug";

// Approach B. Las dos mitades tienen que ir juntas y en este orden: el hero se apila en
// `z-[3]` y tapa a las barras, que están completas y quietas debajo en `z-[2]`.
//
// Qué mirar, además de `stair` contra `flat`:
//
//   · Que en el primer gesto de scroll aparezcan los escalones LATERALES y no una
//     banda. `flat` debería quedarse en un dígito o dos durante los primeros ~150px.
//   · Que no asome crema por los cantos del recorte en ningún punto. Es imposible por
//     construcción (el borde de la imagen nunca sube por encima de donde empieza el
//     gris de esa columna), pero es la primera cosa a desmentir si algo se ve raro.
//   · La FLUIDEZ. Es lo único que este approach puede empeorar: un `clip-path` animado
//     no va al compositor. Si el scroll se siente más pesado que en `/real`, es esto.
export default function DescentTalla({
  debug = false,
  drop,
  carveEase,
  lag,
}: {
  debug?: boolean;
  drop?: number;
  carveEase?: string;
  lag?: number;
}) {
  const readout = useDescentReadout(debug);

  return (
    <>
      {debug && (
        <DescentDebug
          approach={`B · tallado${drop ? ` · drop ${drop}` : ""}${lag ? ` · lag ${lag}` : ""}`}
          curve={carveEase ?? "power4.out"}
          readout={readout}
        />
      )}

      <LabHeroCarve
        debug={debug}
        {...(drop ? { drop } : {})}
        {...(carveEase ? { carveEase } : {})}
        {...(lag ? { lag } : {})}
      />
      <LabBarsStatic />

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
