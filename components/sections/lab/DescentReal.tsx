"use client";

import Container from "@/components/primitives/Container";
import HeroVideo from "@/components/sections/home-v2/HeroVideo";
import QuantumBars from "@/components/sections/home-v2/QuantumBars";
import DescentDebug, { useDescentReadout } from "./DescentDebug";

// La referencia FIEL: el hero y la escalera de producción, sin una sola
// modificación, con el panel de medición encima.
//
// ── Por qué hace falta, además de la maqueta ─────────────────────────────────
// `DescentStage` reproduce la geometría, que es donde estaban los dos bugs, pero
// deja fuera cuatro movimientos que son buena parte de lo que se siente al
// scrollear el hero:
//
//   1. el velo superior que sube con el scroll y cierra la imagen contra el crema
//   2. el parallax de la copy, que sale ~20% más rápido que la página
//   3. el vídeo scrubbeado — 193 frames conducidos por el scroll, con su lazo
//      amortiguado, su snap a frame y su contrapresión de seeks
//   4. la intro del titular con SplitText
//
// Juzgar un approach contra una maqueta estática y después trasladarlo al hero real
// es exactamente el salto que puede fallar: lo que en la maqueta se lee como "lento
// y con peso" puede leerse como "el vídeo se atrasó" cuando hay 193 frames de
// cámara compitiendo por la atención.
//
// Esta ruta es el antes. Los approaches se comparan contra ESTO, no contra la
// maqueta.
//
// ── Lo que NO hay que hacer acá ──────────────────────────────────────────────
// Nada. Este archivo importa los componentes de producción y no los modifica ni los
// envuelve en nada que cambie su comportamiento. Si alguna vez hace falta tocarlos
// para probar algo, se toca una COPIA en `sections/lab/`, no esto — el valor de esta
// ruta es que no se distingue de `/prototype/homepage-v2` en lo que respecta al hero.

export default function DescentReal({ debug = false }: { debug?: boolean }) {
  const readout = useDescentReadout(debug);

  return (
    <>
      {debug && (
        <DescentDebug
          approach="original · sin descenso, tal cual producción"
          curve="—"
          readout={readout}
        />
      )}

      <HeroVideo />
      <QuantumBars />

      {/* Igual que en la maqueta: algo después de la escalera, para ver si el marco
          invade la sección siguiente o deja un hueco contra ella. */}
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
