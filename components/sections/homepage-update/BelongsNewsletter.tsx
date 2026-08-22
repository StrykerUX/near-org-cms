import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";

// "NEAR belongs to you." — banda stone, a corte recto.
//
// ── Qué cambió respecto de ab7 ───────────────────────────────────────────────
//
// En ab7 la banda venía encerrada entre dos `StairTransition`: una escalera de
// entrada que subía del blanco del stepper al gris, y una de salida que lo
// devolvía al crema. Las dos se fueron acá, junto con la escalera de
// `QuantumBars` — ab10 es la versión sin ese recurso.
//
// Lo que queda es un cambio de color duro contra las dos vecinas: arriba el
// `--background` del stepper, abajo el crema de `CustomerStories`. Es a
// propósito, no un pendiente.
//
// El primitivo NO se tocó: `components/primitives/StairTransition.tsx` sigue
// donde estaba y lo siguen montando ab6, ab7, home-v4 y los newsletter-labs.
// Acá solo dejó de usarse.
//
// El original calcula las alturas de las 14 barras en JS (`initBelongsGeometry`)
// para que las exteriores toquen el borde del frame con la sección centrada, y
// además sube la sección -256px para anidarla sobre el carril del stepper. Nada
// de eso aplica ya: sin escaleras no hay silueta que calzar.
export default function BelongsNewsletter() {
  return (
    <section className="text-foreground">
      <div className="bg-stone">
        {/* El aire crece con el ancho: en desktop la banda gris es una franja
            muy larga, y con `py-16` el bloque queda pegado a los dos bordes. */}
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
    </section>
  );
}
