"use client";

import { ArrowRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

// Sin datos reales (fuera de alcance de este draft — ver plan): los covers son
// gradientes CSS en vez de imágenes, copy fijo. Si esta sección se conecta al
// CMS más adelante, migra a PostCard/PostGrid (components/sections/types.ts) en
// vez de duplicar esta lista.
//
// El cover imita un mesh gradient con bandas verticales: el
// `repeating-linear-gradient` de arriba son las bandas (va PRIMERO porque en
// CSS la primera capa es la de encima), y debajo van dos radiales para las
// manchas de color más un lineal diagonal de base.
const BANDS =
  "repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 2.6%, rgba(0,0,0,0.055) 2.6% 5.2%)";

const POSTS = [
  {
    title: "Sharding the world computer",
    byline: "with Alexander Skidanov",
    cta: "Read the full story",
    cover: `${BANDS},
      radial-gradient(130% 100% at 12% 100%, #8fe9b6 0%, transparent 58%),
      radial-gradient(110% 90% at 92% 6%, #b4bcc0 0%, transparent 62%),
      linear-gradient(118deg, #79dfa2 0%, #d9e78d 20%, #94dcaa 42%, #b2c4b4 66%, #8e9aa0 100%)`,
  },
  {
    title: "Lorem Ipsum Dolar Enet",
    byline: "with Alexander Skidanov",
    cta: "View the interview",
    cover: `${BANDS},
      radial-gradient(130% 100% at 10% 40%, #74c9f7 0%, transparent 60%),
      radial-gradient(110% 90% at 95% 90%, #d2d5de 0%, transparent 62%),
      linear-gradient(118deg, #5fc0f5 0%, #a5dcf9 26%, #86d2f2 46%, #c4cadb 72%, #cdd0da 100%)`,
  },
  {
    title: "Sharding the world computer",
    byline: "with Alexander Skidanov",
    cta: "Read the full story",
    cover: `${BANDS},
      radial-gradient(130% 100% at 18% 92%, #86e5b0 0%, transparent 56%),
      radial-gradient(110% 90% at 88% 10%, #bcc3c6 0%, transparent 60%),
      linear-gradient(118deg, #7ee0a6 0%, #dbe790 22%, #8fdaa6 44%, #aec0b2 68%, #8d99a0 100%)`,
  },
];

export default function LatestUpdates() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-20 py-28 md:gap-24 md:py-36">
        <h2 className="text-center text-h1 text-pretty">
          The latest from NEAR
        </h2>

        <div className="flex flex-col gap-7">
          <div className="flex items-center justify-between gap-4">
            <span className="text-body-sm">Latest News</span>
            {/* near-green-dark y no near-green: el verde puro (#00ec97) con
                texto blanco queda en ~1.5:1 de contraste. Este es además el
                tono del botón de la referencia. */}
            <a
              href="#"
              className="rounded-full bg-near-green-dark px-6 py-2.5 text-eyebrow uppercase text-white transition-opacity hover:opacity-90"
            >
              All posts
            </a>
          </div>

          <div ref={rootRef} className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {POSTS.map((post, i) => (
              <article
                key={i}
                data-reveal
                className="group relative aspect-[7/6] overflow-hidden rounded-[1.75rem] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              >
                {/* El cover llena la card entera; lo que lo convierte en una
                    "L" es el bloque blanco de texto que se le monta encima en
                    la esquina superior izquierda. */}
                <div
                  className="absolute inset-2.5 rounded-[1.4rem] transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: post.cover }}
                />

                {/* Los radios están al revés de lo que parece: `tl` sigue la
                    curva de la card, y `br` es la esquina que muerde el cover
                    — sin ese radio el recorte se ve como un rectángulo pegado
                    encima de la imagen. */}
                <div className="absolute left-2.5 top-2.5 flex w-[60%] flex-col gap-1 rounded-tl-[1.4rem] rounded-br-[1.4rem] bg-white p-4 pb-5 pr-7">
                  <h3 className="text-h4 text-pretty">
                    {post.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground">{post.byline}</p>

                  <a
                    href="#"
                    className="mt-10 flex items-center gap-2.5 text-body-sm"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-near-green-dark text-white transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="size-3.5" strokeWidth={2} />
                    </span>
                    {post.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
