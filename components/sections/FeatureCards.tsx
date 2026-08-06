"use client";

import Image from "next/image";
import Eyebrow from "@/components/primitives/Eyebrow";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

// Las ilustraciones traen su propio fondo horneado en el PNG, y `cardBg` es
// siempre el COMPLEMENTO de ese fondo: el PNG de Assets es gris, así que su
// card es blanca y el gris se lee como un bloque interno con margen; el de
// Intelligence es blanco, así que su card es gris y pasa lo inverso. Si los dos
// coincidieran, la ilustración se fundiría con la card y el bloque
// desaparecería.
const FEATURES = [
  {
    title: "Assets",
    description: "You Can Now Pay for AI Usage by Staking NEAR",
    image: "/prototype/feature-assets.png",
    cardBg: "bg-white",
    // Cada card tiene su lugar en la diagonal. Va como dato y no suelto en el
    // JSX para que el escalonado se lea de un vistazo.
    place: "lg:col-start-2 lg:row-start-1",
  },
  {
    title: "Intelligence",
    description: "Who Owns the Rails AI Runs On",
    image: "/prototype/feature-intelligence.png",
    cardBg: "bg-black/[0.045]",
    place: "lg:col-start-9 lg:row-start-1 lg:mt-44",
  },
  {
    title: "Alpha",
    description: "Adding a New Execution Model to its Engine",
    image: "/prototype/feature-alpha.png",
    cardBg: "bg-white",
    place: "lg:col-start-3 lg:row-start-2 lg:mt-16",
  },
];

export default function FeatureCards() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-24 py-28 md:py-36">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-muted-foreground">
              The future of finance is yours
            </Eyebrow>
            <h2 className="text-h2 text-pretty">
              Next gen
              <br />
              <Accent>self custody</Accent>
            </h2>
          </div>
          <p className="text-body-lg text-muted-foreground text-pretty lg:pt-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* Las cards NO se apilan en una fila: van escalonadas en diagonal.
            Grid de 12 columnas con col-start/row-start explícitos + un margen
            superior por card. Por debajo de `lg` todo cae a una columna y los
            offsets desaparecen solos.

            El orden del DOM es Assets → Intelligence → Alpha → "Own Your Own",
            que es el orden de lectura correcto en mobile; en desktop la
            posición la dictan las clases, no el orden. */}
        {/* `items-start` es lo que evita que las cards se estiren a la altura
            de la fila: sin eso, la fila la define Intelligence con su mt-44 y
            a las demás les queda un bloque de fondo vacío colgando abajo. */}
        <div
          ref={rootRef}
          className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0"
        >
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              data-reveal
              className={`rounded-[1.5rem] p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-transform duration-300 hover:-translate-y-1 lg:col-span-3 ${feature.cardBg} ${feature.place}`}
            >
              {/* El radio propio es lo que lo separa de la card: la
                  ilustración es un bloque con margen, no un cover a sangre. */}
              <Image
                src={feature.image}
                alt=""
                width={290}
                height={267}
                className="h-auto w-full rounded-[1.15rem]"
              />
              <div className="flex flex-col gap-3 px-3 pb-7 pt-7">
                <h3 className="text-h4">{feature.title}</h3>
                <p className="text-body text-foreground/75 text-pretty">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}

          {/* `self-end` lo alinea al fondo de la fila 1, que la define
              Intelligence (la card más baja) — de ahí que quede a su altura sin
              ningún offset a mano. */}
          <div className="flex flex-col items-center gap-4 text-center sm:col-span-2 lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:self-end lg:pb-10">
            <h3 className="text-h2 text-pretty">Own Your Own</h3>
            <a
              href="#"
              className="rounded-full bg-near-green-dark px-4 py-1.5 text-body-sm text-white transition-opacity hover:opacity-90"
            >
              all posts
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
