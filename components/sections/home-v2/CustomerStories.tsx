"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

const STORIES = [
  {
    company: "Abound",
    logo: { src: "/logos/abound.png", width: 111, height: 24 },
    image: "/prototype/v2/stories/abound.png",
    title: "Abound Is Bringing Agentic Payments to Cross-Border Finance With NEAR AI",
    href: "https://near.ai/blog/near-ai-and-the-times-of-india-groups-abound-are-bringing-agentic-payments-to-cross-border-finance",
  },
  {
    company: "Venice",
    logo: { src: "/logos/venice.png", width: 89, height: 40 },
    image: "/prototype/v2/stories/venice.png",
    title: "Venice Is Now Verifiably Private With NEAR AI",
    href: "https://near.ai/blog/venice-is-now-verifiably-private-with-near-ai",
  },
  {
    company: "Brave",
    logo: { src: "/logos/brave.png", width: 86, height: 24 },
    image: "/prototype/v2/stories/brave.png",
    title: "A New Frontier for Brave AI Privacy With NEAR AI",
    href: "https://brave.com/blog/browser-ai-tee/",
  },
  {
    company: "ZODL",
    logo: { src: "/logos/zodl.png", width: 133, height: 27 },
    image: "/prototype/v2/stories/zodl.png",
    title: "Privacy-first Zcash Wallet ZODL Uses NEAR Intents to Give Users Cross-Chain Access",
    href: "https://intents.near.org/case-studies",
  },
  {
    company: "Ledger",
    logo: { src: "/logos/ledger.png", width: 117, height: 39 },
    image: "/prototype/v2/stories/ledger.png",
    title: "Ledger Wallet Integrates NEAR Intents to Power Seamless Cross-Chain Swaps",
    href: "https://www.ledger.com/blog-near-intents-joins-ledger-wallet-via-swapkit",
  },
  {
    // Único sin logotipo en el set original: se escribe con el nombre.
    company: "Gov. of Bermuda",
    logo: null,
    image: "/prototype/v2/stories/bermuda.png",
    title: "Government of Bermuda and NEAR AI Partner to Deploy AI-Powered Public Services",
    href: "https://near.ai/blog/government-of-bermuda-and-near-ai-partner-to-deploy-ai-powered-public-services",
  },
] as const;

export default function CustomerStories() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-14 py-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Eyebrow>Customer stories</Eyebrow>
            <h2 className="text-h2 text-pretty">
              What the world is building
              <br />
              <Accent>on NEAR</Accent>
            </h2>

            {/* Los 6 títulos apilados en la MISMA celda de grid. Así el bloque
                mide siempre lo que el título más largo y no salta al cambiar de
                historia — el original resolvía eso con un ResizeObserver que
                escribía minHeight, acá lo hace el layout solo. */}
            <div className="mt-4 grid">
              {STORIES.map((story, i) => (
                <div
                  key={story.company}
                  data-active={i === active}
                  // invisible (no solo opacity-0) para que los títulos ocultos
                  // no queden focuseables ni los lea un lector de pantalla.
                  className="invisible flex translate-y-2.5 flex-col gap-6 opacity-0 transition-[opacity,transform] duration-[450ms] ease-out [grid-area:1/1] data-[active=true]:visible data-[active=true]:translate-y-0 data-[active=true]:opacity-100"
                >
                  <h3 className="text-h3 text-pretty">{story.title}</h3>
                  <a
                    href={story.href}
                    target="_blank"
                    rel="noopener"
                    className="group/cta flex w-fit items-center gap-3 text-label"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-near-green-accent text-black transition-transform duration-200 group-hover/cta:translate-x-0.5">
                      <ArrowRight className="size-4" />
                    </span>
                    Read the full story
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[8/5] w-full overflow-hidden rounded-md border border-border bg-muted">
            {STORIES.map((story, i) => (
              <Image
                key={story.company}
                src={story.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                data-active={i === active}
                className="object-cover opacity-0 transition-opacity duration-500 data-[active=true]:opacity-100"
              />
            ))}
          </div>
        </div>

        {/* Los logos son la navegación real, no decoración: van como <button>
            con el nombre accesible, no como <img> clickeable. */}
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
          {STORIES.map((story, i) => (
            <button
              key={story.company}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              data-active={i === active}
              className="flex items-center opacity-35 transition-opacity duration-300 data-[active=true]:opacity-100"
            >
              {story.logo ? (
                <Image
                  src={story.logo.src}
                  alt={story.company}
                  width={story.logo.width}
                  height={story.logo.height}
                  // grayscale → brightness-0: el activo pasa a negro sólido, el
                  // resto queda desaturado. Los PNG de marca no comparten tono,
                  // así que sin normalizar la fila se ve descoordinada.
                  className={`h-6 w-auto ${i === active ? "brightness-0" : "grayscale"}`}
                />
              ) : (
                <span className="text-eyebrow uppercase">{story.company}</span>
              )}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
