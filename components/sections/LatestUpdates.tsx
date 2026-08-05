"use client";

import { ArrowRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

// Sin datos reales (fuera de alcance de este draft — ver plan): covers en
// gradiente CSS en vez de imágenes, copy fijo. Si esta sección se conecta al
// CMS más adelante, migra a PostCard/PostGrid (components/sections/types.ts)
// en vez de duplicar esta lista.
const POSTS = [
  {
    title: "Sharding the world computer",
    eyebrow: "Latest news",
    gradient: "radial-gradient(circle at 30% 30%, #00ec97, transparent 60%), radial-gradient(circle at 70% 70%, #2dd4bf, transparent 60%), #101010",
  },
  {
    title: "Dollar Ever",
    eyebrow: "With Alessandro Bessarion",
    gradient: "radial-gradient(circle at 40% 60%, #a3b565, transparent 60%), radial-gradient(circle at 70% 20%, #00c97f, transparent 55%), #d8d6d0",
  },
  {
    title: "Sharding the world computer",
    eyebrow: "Latest news",
    gradient: "radial-gradient(circle at 60% 40%, #2dd4bf, transparent 60%), radial-gradient(circle at 20% 80%, #00ec97, transparent 55%), #101010",
  },
];

const UPDATES = [
  { title: "Move cross-chain, trade perps, hold RWAs, access all of DeFi.", date: "Aug 03, 2026" },
  { title: "Move cross-chain, trade perps, hold RWAs, access all of DeFi.", date: "Jul 24, 2026" },
  { title: "Move cross-chain, trade perps, hold RWAs, access all of DeFi.", date: "Jun 15, 2026" },
];

export default function LatestUpdates() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-14 py-20">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-h2 font-medium text-pretty">The latest from NEAR</h2>
            <span className="rounded-full bg-near-green px-3 py-1 text-caption font-medium text-black">
              Latest news
            </span>
          </div>

          <div ref={rootRef} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {POSTS.map((post, i) => (
              <article key={i} data-reveal className="group flex flex-col gap-3">
                <div
                  className="aspect-[4/3] w-full rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ backgroundImage: post.gradient }}
                />
                <span className="text-caption uppercase tracking-[0.15em] text-muted-foreground">
                  {post.eyebrow}
                </span>
                <h3 className="text-h4 font-medium text-pretty">{post.title}</h3>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <Eyebrow>Latest updates</Eyebrow>
          </div>
          {UPDATES.map((update, i) => (
            <a
              key={i}
              href="#"
              className="group flex items-center justify-between gap-6 border-b border-border py-5 transition-colors hover:border-foreground/30"
            >
              <p className="text-body-sm text-pretty">{update.title}</p>
              <div className="flex shrink-0 items-center gap-4">
                <span className="text-caption text-muted-foreground">{update.date}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
