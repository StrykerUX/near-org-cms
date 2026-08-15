import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import StairTransition from "@/components/primitives/StairTransition";

// "NEAR belongs to you." — banda stone encerrada entre dos escaleras.
//
// El original calcula las alturas de las 14 barras en JS (`initBelongsGeometry`)
// para que las exteriores toquen el borde del frame con la sección centrada, y
// además sube la sección -256px para anidarla sobre el carril del stepper. Acá
// las dos escaleras son `StairTransition`, que resuelve la silueta con
// porcentajes en CSS: sin medición, sin ResizeObserver, y sin depender de
// `sec.children[i]` por índice (que era el punto más frágil del original).
//
// Los dos `peak` son OPUESTOS: el de arriba baja hacia el centro y el de abajo
// sube, así se leen como espejo. Con el mismo valor las dos "bajan" y la banda
// parece inclinada en vez de simétrica.
//
// `depth` y `lead` van explícitos aunque coincidan con el default: son las dos
// perillas del efecto y se tunean desde acá, sin abrir el primitivo.
export default function BelongsNewsletter() {
  return (
    <section className="text-foreground">
      {/* Arriba queda el fondo blanco del stepper, así que ese es el `from`. */}
      <StairTransition
        from="var(--background)"
        to="var(--stone)"
        peak="edges"
        depth={1}
        lead={1}
        height="tall"
      />

      <div className="bg-stone">
        {/* El aire crece con el ancho: en desktop la banda gris es una franja muy
            larga y con `py-16` el bloque quedaba pegado a las dos escaleras. */}
        <Container className="py-16 text-center md:py-24 lg:py-32">
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

      {/* La de salida está construida al revés que la de entrada, y las tres
          diferencias van juntas o la juntura no cierra:

          · `from` es el CREMA —la sección que viene— porque al terminar el
            recorrido la banda tiene que quedar del color de abajo;
          · los escalones son el GRIS, que es el color que se retira;
          · `grow="down"` los cuelga del borde superior, que es donde está el
            gris. Con `up` quedarían apoyados contra el crema de abajo y la
            silueta saldría dada vuelta.

          `peak="edges"` con esa inversión reproduce exactamente la silueta que
          antes daba `peak="center"` sobre los colores al derecho. */}
      <StairTransition
        from="var(--cream)"
        to="var(--stone)"
        mode="exit"
        grow="down"
        peak="edges"
        depth={1}
        lead={1}
        height="tall"
      />
    </section>
  );
}
