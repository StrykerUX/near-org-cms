import LabDivider from "@/components/sections/closing-labs/LabDivider";
import GridPress from "@/components/sections/closing-labs/grid/Press";
import RevealPress from "@/components/sections/closing-labs/reveal/Press";
import CardPress from "@/components/sections/closing-labs/card/Press";
import NightPress from "@/components/sections/closing-labs/night/Press";
import SlabPress from "@/components/sections/closing-labs/slab/Press";
import { DIRECTIONS } from "@/components/sections/closing-labs/directions";

// Página de comparación: las cinco direcciones de UNA sección, en el mismo
// orden que en las otras tres páginas del laboratorio.
//
// Es un laboratorio en el sentido del README de `components/sections/`: existe
// para elegir, ninguna página real lo importa, y cuando una dirección gane se
// COPIA a la carpeta que la reciba y la del lab se borra.
//
// La página no lleva header propio ni `pt-[var(--site-header-block)]`: el
// rótulo pegajoso de cada dirección hace de encabezado, y despejar arriba
// metería un hueco crema entre el rótulo y la primera sección.
export default function ClosingLabsPressView() {
  return (
    <main className="bg-cream">
      <header className="mx-auto flex w-full max-w-[1780px] flex-col gap-4 px-[60px] pb-16 pt-[calc(var(--site-header-block)+4rem)]">
        <p className="text-caption-mono uppercase text-ink/50">Closing labs</p>
        <h1 className="text-h1 max-w-[18ch] text-balance text-ink">NEAR in the news</h1>
        <p className="text-body max-w-[62ch] text-ink/70 text-pretty">
          Las tres notas de prensa. Hoy es `homepage-shared/UpdatesList`: titular, fecha alineada en columna y un `+` que no despliega nada — es un link.
        </p>
        <p className="text-caption max-w-[62ch] text-ink/50 text-pretty">
          Abajo, cinco versiones con la misma copy y distinta composición. Toda
          diferencia entre ellas es de layout, nunca de redacción.
        </p>
      </header>

      <LabDivider
        index={1}
        name={DIRECTIONS[0].name}
        source={DIRECTIONS[0].source}
        note={DIRECTIONS[0].note}
      />
      <GridPress />

      <LabDivider
        index={2}
        name={DIRECTIONS[1].name}
        source={DIRECTIONS[1].source}
        note={DIRECTIONS[1].note}
      />
      <RevealPress />

      <LabDivider
        index={3}
        name={DIRECTIONS[2].name}
        source={DIRECTIONS[2].source}
        note={DIRECTIONS[2].note}
      />
      <CardPress />

      <LabDivider
        index={4}
        name={DIRECTIONS[3].name}
        source={DIRECTIONS[3].source}
        note={DIRECTIONS[3].note}
      />
      <NightPress />

      <LabDivider
        index={5}
        name={DIRECTIONS[4].name}
        source={DIRECTIONS[4].source}
        note={DIRECTIONS[4].note}
      />
      <SlabPress />
    </main>
  );
}
