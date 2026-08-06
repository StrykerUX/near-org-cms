"use client";

import { ArrowRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

const PILLS = ["Confidential", "Cross-Chain", "Permissionless", "Earn", "Perps", "RWA"];

// Los siguientes items del stack, colapsados. Solo el 01 está expandido; estos
// se leen como "hay más abajo".
const COLLAPSED = [{ n: "02", name: "AI" }];

// ── Isométrico ──────────────────────────────────────────────────────────────
// Cinco cubos en cruz sobre un grid isométrico 2:1, aproximación de
// public/near-stack.svg (monocromo en el original) recoloreado en gradiente
// verde/teal — no existe un asset de marca a color todavía.
//
// Un cubo tiene la cara superior de 80 de ancho por 40 de alto, así que moverse
// una celda del grid son (±40, ±20) en pantalla: eso es lo que hace que los
// cubos queden ADYACENTES (compartiendo aristas) en vez de flotando separados
// como estaban antes.
const CELL = { x: 40, y: 20 };

// El orden del array ES el orden de pintado, y en isometría eso es el z-order:
// cuanto mayor (col + row), más adelante va. Reordenar esto rompe el apilado.
const CUBES = [
  { col: 0, row: -1, solid: false }, // fondo derecha
  { col: -1, row: 0, solid: false }, // fondo izquierda
  { col: 0, row: 0, solid: true }, // centro
  { col: 1, row: 0, solid: true }, // frente derecha
  { col: 0, row: 1, solid: true }, // frente izquierda
];

function IsoCube({ col, row, solid }: { col: number; row: number; solid: boolean }) {
  const x = (col - row) * CELL.x;
  const y = (col + row) * CELL.y;

  // Las tres caras comparten el mismo gradiente y se diferencian por
  // fill-opacity: sobre fondo casi negro, menos opacidad = cara más oscura.
  // Es el sombreado de un cubo con una sola definición de color.
  const fill = solid ? "url(#isoGradient)" : "none";

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* superior */}
      <path
        d="M 0,-40 L 40,-20 L 0,0 L -40,-20 Z"
        fill={fill}
        fillOpacity={solid ? 1 : 0}
        stroke="white"
        strokeOpacity={solid ? 0.35 : 0.22}
      />
      {/* izquierda */}
      <path
        d="M -40,-20 L 0,0 L 0,40 L -40,20 Z"
        fill={fill}
        fillOpacity={solid ? 0.62 : 0}
        stroke="white"
        strokeOpacity={solid ? 0.25 : 0.14}
      />
      {/* derecha */}
      <path
        d="M 40,-20 L 0,0 L 0,40 L 40,20 Z"
        fill={fill}
        fillOpacity={solid ? 0.82 : 0}
        stroke="white"
        strokeOpacity={solid ? 0.25 : 0.14}
      />
    </g>
  );
}

function IsoGraphic() {
  const svgRef = useGsapContext<SVGSVGElement>((_self, scope) => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const tween = gsap.to(scope, {
        y: -10,
        rotateZ: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center",
      });
      pauseOffscreen(tween, scope);
    });
    return () => mm.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="-95 -75 190 150"
      className="mx-auto w-52 sm:w-64"
      data-reveal="iso"
    >
      <defs>
        <linearGradient id="isoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8df3c0" />
          <stop offset="50%" stopColor="var(--near-green)" />
          <stop offset="100%" stopColor="var(--near-teal)" />
        </linearGradient>
      </defs>
      {CUBES.map((cube) => (
        <IsoCube key={`${cube.col}:${cube.row}`} {...cube} />
      ))}
    </svg>
  );
}

export default function StackShowcase() {
  const rootRef = useScrollReveal<HTMLDivElement>({
    build: ({ tl, q }) => {
      tl.from(q("[data-reveal='eyebrow']"), { autoAlpha: 0, y: 12, duration: 0.6 })
        .from(q("[data-reveal='heading']"), { autoAlpha: 0, y: 32 }, "-=0.35")
        .from(q("[data-reveal='body']"), { autoAlpha: 0, y: 24 }, "-=0.6")
        .from(q("[data-reveal='pill']"), { autoAlpha: 0, y: 16, scale: 0.96, stagger: 0.06 }, "-=0.5")
        // Sin rotateZ acá: el SVG ya tiene su propio loop idle de y/rotateZ
        // (ver IsoGraphic) — animar la misma propiedad desde dos tweens
        // distintos a la vez los hace pelear por el valor cada frame.
        .from(q("[data-reveal='iso']"), { autoAlpha: 0, scale: 0.92, duration: 1.2 }, 0.1);
    },
  });

  return (
    // Sin ZigguratDivider: en la referencia los bordes de esta sección son
    // rectos. El de arriba lo aportaba VideoStory y también se quitó.
    <section className="bg-[#101010] text-white">
      <Container className="py-28 md:py-36">
        {/* El contenido se acota bastante por debajo del ancho de Container
            (max-w-[1780px]): a ancho completo las tres columnas se separan
            tanto que el conjunto deja de leerse como un bloque, y el párrafo
            de la card se estira a líneas larguísimas. */}
        <div className="mx-auto flex max-w-[1120px] flex-col gap-20">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-h1 font-medium text-pretty">The NEAR Stack</h2>
            {/* max-w chico a propósito: el subtítulo tiene que quebrar en dos
                líneas, con los glifos repartidos entre ambas. */}
            <p className="max-w-[22ch] text-h3 font-normal text-white/70 text-balance">
              Open infrastructure{" "}
              <span className="inline-block size-[0.78em] translate-y-[0.06em] rounded-full bg-gradient-to-br from-near-teal via-near-green to-near-teal" />{" "}
              powering the{" "}
              <span className="inline-block size-[0.72em] translate-y-[0.04em] rotate-45 rounded-[0.12em] bg-near-green" />{" "}
              agent economy
            </p>
          </div>

          <div
            ref={rootRef}
            className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_auto_1.15fr] lg:gap-10"
          >
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <div data-reveal="eyebrow">
                <Eyebrow className="text-white/40">The NEAR Stack</Eyebrow>
              </div>
              {/* Serif en las DOS líneas (la referencia no mezcla sans y
                  serif acá), con la segunda en italic. Por eso no se usa
                  <Accent>, que además sube el tamaño a 1.18em. */}
              <h3
                data-reveal="heading"
                className="font-serif text-h2 font-normal leading-[1.06] tracking-normal text-pretty"
              >
                Sovereignty,
                <br />
                <span className="italic">end to end.</span>
              </h3>
            </div>

            <IsoGraphic />

            <div className="flex flex-col gap-4">
              <h4 data-reveal="body" className="text-h4 font-medium">
                {/* El número va inline como superíndice, no en su propia
                    línea. */}
                <sup className="mr-1.5 align-super text-[0.5em] font-normal text-white/35">
                  01
                </sup>
                near.com
              </h4>
              {/* max-w chico: en la referencia el párrafo son cinco líneas
                  cortas, y es lo que además fuerza a los pills a dos filas. */}
              <p
                data-reveal="body"
                className="max-w-[34ch] text-body-sm leading-relaxed text-white/55 text-pretty"
              >
                The only onchain account you need. Fully confidential swaps,
                transfers, deposits, and withdrawals. Trade perps, earn yield,
                and hold RWAs across 30+ chains, all from one account, your
                assets in your control. The way crypto should work.
              </p>
              <div className="flex max-w-[30ch] flex-wrap gap-2">
                {PILLS.map((pill) => (
                  <span
                    key={pill}
                    data-reveal="pill"
                    className="rounded-full border border-white/15 px-3 py-1 text-caption text-white/70"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <a
                href="#"
                className="mt-2 flex w-fit items-center gap-2 text-body-sm font-medium hover:text-near-green"
              >
                Visit near.com
                <ArrowRight className="size-4" />
              </a>

              {/* Los siguientes items del stack, colapsados y tenues. */}
              <div className="mt-20 flex flex-col gap-6">
                {COLLAPSED.map((item) => (
                  <h4 key={item.n} className="text-h4 font-medium text-white/25">
                    <sup className="mr-1.5 align-super text-[0.5em] font-normal">
                      {item.n}
                    </sup>
                    {item.name}
                  </h4>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
