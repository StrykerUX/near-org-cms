import type { ComponentType } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import type { MuralVariantSpec } from "@/components/sections/mural-labs/muralContent";

// La galería que comparten las dos rutas de variantes: ficha, aire, bloque.
//
// Una sola porque las dos páginas son la MISMA página con distinto reparto —
// y si cada una escribiera su encabezado y su espaciado, las diferencias de
// presentación se leerían como diferencias entre las familias, que es
// exactamente lo que el lab compara.

export default function MuralGallery({
  specs,
  blocks,
}: {
  specs: MuralVariantSpec[];
  /** Un componente por spec, en el mismo orden. */
  blocks: ComponentType[];
}) {
  return (
    <>
      {specs.map((spec, i) => {
        const Block = blocks[i];
        if (!Block) return null;

        return (
          <section key={spec.id} id={spec.id} className="flex flex-col">
            <Container className="border-t border-rule py-12">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <Eyebrow className="text-gray-intermediate">
                  {spec.index} · {spec.technique}
                </Eyebrow>
                <h2 className="text-h3">{spec.title}</h2>
                {spec.gl && (
                  <span className="text-caption rounded-full border border-rule px-3 py-1 uppercase text-gray-intermediate">
                    WebGL
                  </span>
                )}
              </div>
              <div className="mt-6 grid max-w-[110ch] gap-8 sm:grid-cols-2">
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

            {/* Un viewport de aire antes de cada bloque. No es encuadre: las
                variantes de timeline se disparan al entrar en pantalla, y
                pegadas una a otra la anterior seguiría corriendo cuando la
                siguiente aparece — se verían dos escenas a la vez y ninguna
                se podría juzgar. */}
            <div aria-hidden="true" className="h-[60svh]" />
            <Block />
            <div aria-hidden="true" className="h-[40svh]" />
          </section>
        );
      })}
    </>
  );
}
