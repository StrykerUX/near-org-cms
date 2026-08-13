"use client";

import Container from "@/components/primitives/Container";
import LabHeroCarve from "./LabHeroCarve";
import LabBarsPanels from "./LabBarsPanels";
import DescentDebug, { useDescentReadout } from "./DescentDebug";
import { CASCADE } from "./labStairGeometry";

// El gris se mueve por encima del hero, en vez de que el hero se recorte por encima del
// gris como en `/prototype/descent/talla`. Ver el docblock de `LabBarsPanels` para los
// cuatro problemas que ese cambio de pintado retira.
//
// El hero es el MISMO componente que usa `/talla`, con `carve={false}`: no recorta nada y
// vuelve al apilado de producción. Lo único que conserva del tallado es el excedente de
// vídeo, que sigue haciendo falta para tener imagen por debajo de la juntura. Compartir el
// hero es a propósito: si fuera una copia, cualquier diferencia entre las dos rutas podría
// ser del hero y no del mecanismo que se está comparando.
//
// ── Qué mirar ────────────────────────────────────────────────────────────────
//
//   · LAS CAPAS. Cuando el gris llega a la altura de la copy del hero, tiene que TAPARLA,
//     como en producción. En `/talla` la copy queda montada encima del gris, y no es un bug
//     suelto: con el hero apilado por encima para que su recorte funcione, la copy solo
//     puede terminar cortada o montada.
//   · LA FLUIDEZ. Acá son siete `scaleY` por frame, que van al compositor. En `/talla` es
//     un `clip-path` animado, que paga repintado. Si el scroll se siente mejor, es esto.
//   · LA CASCADA. Con el reloj por defecto (`cascade`) los anillos no solo arrancan
//     escalonados: entran a velocidades distintas —2.9× la del scroll el lateral, 1.4× el
//     central—, así que la escalera se abre porque los de afuera VAN más rápido. A mitad
//     de camino los interiores aceleran hasta 3.4× para alcanzar a los laterales, que ya
//     frenaron a 1.6×, y los cuatro aterrizan amortiguados y casi a la par en el borde.
//   · EL FINAL. Es lo que separa este reloj del viejo: ningún borde se detiene de golpe.
//     Con `?flow=carve` se ve lo otro —los cuatro chocan con el borde a 2.5× y paran en un
//     frame, a 213/303/405/510px de scroll— y la diferencia es todo el punto.
export default function DescentPaneles({
  debug = false,
  flow = "cascade",
  drop,
  depth,
  carveEase,
  stagger,
  converge,
  line,
  soft,
  spread,
  land,
  lag,
  fast,
  slow,
  settle,
}: {
  debug?: boolean;
  flow?: "carve" | "cascade";
  drop?: number;
  depth?: number;
  carveEase?: string;
  stagger?: number;
  converge?: boolean;
  line?: number;
  soft?: number;
  spread?: number;
  land?: number;
  lag?: number;
  fast?: number;
  slow?: number;
  settle?: number;
}) {
  const readout = useDescentReadout(debug);
  const knobs = {
    flow,
    ...(drop !== undefined ? { drop } : {}),
    ...(depth !== undefined ? { depth } : {}),
    ...(carveEase ? { carveEase } : {}),
    ...(stagger !== undefined ? { stagger } : {}),
    ...(converge !== undefined ? { converge } : {}),
    ...(line !== undefined ? { line } : {}),
    ...(soft !== undefined ? { soft } : {}),
    ...(spread !== undefined ? { spread } : {}),
    ...(land !== undefined ? { land } : {}),
    ...(lag !== undefined ? { lag } : {}),
    ...(fast !== undefined ? { fast } : {}),
    ...(slow !== undefined ? { slow } : {}),
    ...(settle !== undefined ? { settle } : {}),
  };

  // Cada reloj se describe con SUS perillas: mostrar las siete de cascade cuando corre
  // carve (o al revés) haría leer el HUD como si el número que se está moviendo fuera el
  // que manda, que es exactamente el error que este panel existe para evitar.
  const label =
    flow === "cascade"
      ? `paneles · cascade · soft ${soft ?? CASCADE.soft}u · spread ${spread ?? CASCADE.spread} · v ${
          fast ?? CASCADE.fast
        }→${slow ?? CASCADE.slow}`
      : `paneles · carve · depth ${depth ?? 3}${
          converge === false
            ? " · sin cierre"
            : ` · techo ${line ? `${(line * 100).toFixed(0)}%` : "borde"}`
        }`;

  return (
    <>
      {debug && (
        <DescentDebug
          approach={label}
          curve={carveEase ?? (flow === "cascade" ? "none (por anillo)" : "labCarve")}
          readout={readout}
        />
      )}

      {/* `carve={false}`: el hero no recorta y no se apila por encima. El reveal es de las
          barras. `drop` sí se le pasa — el excedente de vídeo sigue haciendo falta. */}
      <LabHeroCarve carve={false} {...(drop !== undefined ? { drop } : {})} />
      <LabBarsPanels debug={debug} {...knobs} />

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
