import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import ZigguratDivider from "@/components/primitives/ZigguratDivider";

// "NEAR belongs to you." — banda stone encerrada entre dos escaleras.
//
// El original calcula las alturas de las 14 barras en JS (`initBelongsGeometry`)
// para que las exteriores toquen el borde del frame con la sección centrada, y
// además sube la sección -256px para anidarla sobre el carril del stepper. Acá
// las dos escaleras son ZigguratDivider, que resuelve lo mismo con porcentajes
// en CSS: sin medición, sin ResizeObserver, y sin depender de `sec.children[i]`
// por índice (que era el punto más frágil del original).
//
// El divider de abajo va `invert`: la escalera de arriba baja hacia el centro y
// la de abajo sube, así las dos se leen como espejo. Sin eso ambas "bajan" y la
// banda parece inclinada en vez de simétrica.
export default function BelongsNewsletter() {
  return (
    <section className="text-foreground">
      {/* Arriba queda el fondo blanco del stepper, así que ese es el `from`. */}
      <ZigguratDivider from="var(--background)" to="var(--stone)" />

      <div className="bg-stone">
        <Container className="py-16 text-center">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="text-h2 text-pretty">
              {/* El wordmark ES la primera línea del titular, no un logo suelto:
                  por eso vive dentro del <h2> y su alt aporta la palabra que
                  falta para que la frase se lea entera ("NEAR belongs to you").
                  La altura fluida va inline — es una imagen, no texto, así que
                  no le toca un rol de la escala tipográfica. */}
              <Image
                src="/prototype/v2/near-wordmark.svg"
                alt="NEAR"
                width={160}
                height={40}
                className="mx-auto mb-2.5 block w-auto"
                style={{ height: "clamp(1.6rem, 1.3rem + 1.26vw, 2.8rem)" }}
              />
              <Accent>belongs to you.</Accent>
            </h2>

            <p className="max-w-lg text-body-lg text-pretty">
              Get the latest product launches, protocol milestones, and ecosystem
              updates straight to your inbox.
            </p>

            <div className="mt-4 flex w-full justify-center">
              <ShineField
                placeholder="email address"
                label="Email address"
                buttonLabel="sign up"
              />
            </div>
          </div>
        </Container>
      </div>

      <ZigguratDivider from="var(--stone)" to="var(--cream)" invert />
    </section>
  );
}
