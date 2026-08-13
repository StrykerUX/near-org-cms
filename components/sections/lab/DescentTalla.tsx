"use client";

import Container from "@/components/primitives/Container";
import LabHeroCarve from "./LabHeroCarve";
import LabBarsStatic from "./LabBarsStatic";
import { STAIR_DEPTH } from "./labStairGeometry";
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
//   · El RELEVO, que es el efecto: los escalones LATERALES se levantan primero y los
//     demás los alcanzan. A 40px de scroll el lateral mide 173px y no hay nada más; a
//     300px son 805 / 537 / 269 / 166.
//   · El CIERRE, que es el final: los anillos chocan con el borde de arriba ESCALONADOS
//     —lateral 213px, 2ª 303px, 3ª 405px, central 510px— y cada hueco se cierra cuando el
//     de adentro alcanza al de afuera, uno por vez y a la vista. A 180px la escalera está
//     completa con sus tres saltos iguales.
//     `?converge=0` lo desactiva: la escalera queda formada y solo traslada.
//   · Que el arranque semirápido no traiga la barra gris de vuelta. Está garantizado por
//     la cota `zócalo = max(0, scroll − drop·u)`: cero durante los primeros 134px, sea la
//     curva la que sea.
//   · Que el escalonado SIGA creciendo mientras scrolleás, en vez de sentirse terminado
//     enseguida. El recorrido del tallado es la ventana en que la mitad de la figura está
//     en pantalla (`100svh − depth·u/2`, unos 648px), no los 100svh completos: antes más
//     de la mitad del recorrido animaba algo que ya había salido por arriba.
//   · Que el statement del hero se siga leyendo. A depth 3 el corte de las columnas que
//     cruza el texto queda en 782px y el subtítulo termina cerca de 736px: son 46px de
//     aire. El texto ya no se puede CORTAR (vive fuera del recorte), pero sí puede
//     terminar sobre gris si se sube más `depth`.
//   · La FLUIDEZ. Es lo único que este approach puede empeorar: un `clip-path` animado
//     no va al compositor. Si el scroll se siente más pesado que en `/real`, es esto.
export default function DescentTalla({
  debug = false,
  drop,
  depth,
  carveEase,
  stagger,
  converge,
  line,
}: {
  debug?: boolean;
  drop?: number;
  depth?: number;
  carveEase?: string;
  stagger?: number;
  converge?: boolean;
  line?: number;
}) {
  const readout = useDescentReadout(debug);

  return (
    <>
      {debug && (
        <DescentDebug
          approach={`B · tallado · depth ${depth ?? STAIR_DEPTH}${drop ? ` · drop ${drop}` : ""}${stagger !== undefined ? ` · stagger ${stagger}` : ""}${converge === false ? " · sin cierre" : ` · techo ${line ? `${(line * 100).toFixed(0)}%` : "borde"}`}`}
          curve={carveEase ?? "power4.out"}
          readout={readout}
        />
      )}

      <LabHeroCarve
        debug={debug}
        {...(drop ? { drop } : {})}
        {...(depth ? { depth } : {})}
        {...(carveEase ? { carveEase } : {})}
        {...(stagger !== undefined ? { stagger } : {})}
        {...(converge !== undefined ? { converge } : {})}
        {...(line !== undefined ? { line } : {})}
      />
      {/* Sin parámetros: el gris cubre el hero entero y la figura la dibuja el recorte,
          así que las barras no comparten ningún número con el hero. */}
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
