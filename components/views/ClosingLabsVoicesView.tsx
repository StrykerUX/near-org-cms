import LabDivider from "@/components/sections/closing-labs/LabDivider";
import GridVoices from "@/components/sections/closing-labs/grid/Voices";
import RevealVoices from "@/components/sections/closing-labs/reveal/Voices";
import CardVoices from "@/components/sections/closing-labs/card/Voices";
import NightVoices from "@/components/sections/closing-labs/night/Voices";
import SlabVoices from "@/components/sections/closing-labs/slab/Voices";
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
export default function ClosingLabsVoicesView() {
  return (
    <main className="bg-cream">
      <header className="mx-auto flex w-full max-w-[1780px] flex-col gap-4 px-[60px] pb-16 pt-[calc(var(--site-header-block)+4rem)]">
        <p className="text-caption-mono uppercase text-ink/50">Closing labs</p>
        <h1 className="text-h1 max-w-[18ch] text-balance text-ink">Lo que otros dicen</h1>
        <p className="text-body max-w-[62ch] text-ink/70 text-pretty">
          Las cuatro citas. Hoy es `homepage-tuck/TestimonialDeck`: un mazo en perspectiva donde la card de adelante y la cita grande de la izquierda son la misma persona.
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
      <GridVoices />

      <LabDivider
        index={2}
        name={DIRECTIONS[1].name}
        source={DIRECTIONS[1].source}
        note={DIRECTIONS[1].note}
      />
      <RevealVoices />

      <LabDivider
        index={3}
        name={DIRECTIONS[2].name}
        source={DIRECTIONS[2].source}
        note={DIRECTIONS[2].note}
      />
      <CardVoices />

      <LabDivider
        index={4}
        name={DIRECTIONS[3].name}
        source={DIRECTIONS[3].source}
        note={DIRECTIONS[3].note}
      />
      <NightVoices />

      <LabDivider
        index={5}
        name={DIRECTIONS[4].name}
        source={DIRECTIONS[4].source}
        note={DIRECTIONS[4].note}
      />
      <SlabVoices />
    </main>
  );
}
