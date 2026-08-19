"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import type { FooterLink } from "./footerLabContent";

// Los dos hovers de `/prototype/hover-lab` que el lab de footers adoptó,
// portados acá.
//
// ── Por qué portados y no importados ───────────────────────────────────────
//
// Los originales viven en `components/views/hover-lab/`, y una sección no puede
// importar de una view: el contrato de `components/sections/README.md` lista los
// imports permitidos y `@/components/views/*` no está entre ellos. Tampoco
// serviría: allá cada variante es un componente de DEMO que trae su propia
// lista de cuatro links de ejemplo y su marcado, no una pieza reutilizable.
//
// Además el CSS de los originales vive en `hoverLab.css`, un archivo que
// importa la view del lab de hover. Acá el equivalente está en utilidades
// Tailwind, así que estos links no dependen de que nadie más cargue una
// hoja de estilos.
//
// ── Los dos, y de dónde vienen ─────────────────────────────────────────────
//
//   chars     (15 · Char stagger)      GSAP + SplitText. Sube en `power3`,
//                                      vuelve en `elastic` — la ida y la
//                                      vuelta con curvas distintas es lo que
//                                      CSS no puede dar.
//   inertial  (18 · Inertial indicator) GSAP. Un chip que persigue al link y se
//                                      ESTIRA proporcionalmente al salto.
//
// Se probaron cuatro. Los otros dos —`05 · Brand ramp`, que barría el verde de
// marca por el texto, y `21 · Eased scramble`, que revolvía las letras— se
// quitaron: los cuatro juntos hacían que el bloque de links pareciera un
// muestrario y no un footer. Están en `/prototype/hover-lab`, que es donde
// viven las alternativas.
//
// ── La adaptación del 18 ───────────────────────────────────────────────────
//
// En el hover-lab el indicador inercial recorre una columna VERTICAL de links y
// solo se mueve en Y. Acá los links de una sub-sección corren en LÍNEA, así que
// el chip persigue en X y en Y, y el estiramiento se aplica sobre el eje del
// salto: `scaleX` cuando salta de link a link dentro de una fila, `scaleY`
// cuando cambia de fila. Sin eso, el estiramiento se veía perpendicular al
// movimiento — que es exactamente al revés de lo que la inercia hace.

export type HoverEffect = "chars" | "inertial";

/**
 * El reparto por defecto, en el orden de `GROUPS`: Products, Stack, Resources,
 * About, Terms and Policies.
 *
 * Alternados, no repartidos por tipo de grupo. Con cinco grupos y dos efectos,
 * alternar deja a cada uno con un vecino del otro tipo arriba y al lado, que es
 * lo que permite comparar los dos sin ir y volver entre columnas.
 */
export const DEFAULT_EFFECTS: HoverEffect[] = [
  "chars",
  "inertial",
  "chars",
  "inertial",
  "chars",
];

function linkTone(dark: boolean) {
  return dark ? "text-cream/70 hover:text-cream" : "text-muted-foreground hover:text-foreground";
}

/** `href: null` = la página no existe todavía: link inerte a "#" en vez de un
 *  destino inventado. Un link equivocado es peor que un placeholder evidente. */
function hrefOf(link: FooterLink) {
  return link.href ?? "#";
}

/* ── 15 · Char stagger ────────────────────────────────────────────────────
   SplitText por caracteres. Lo que hace este efecto y no un `translateY` en CSS
   es que la ida y la vuelta llevan curvas DISTINTAS: sube con `power3.out` y
   vuelve con un `elastic`, que es una asimetría que una transición no puede
   expresar.

   `yPercent` y no `y`: el desplazamiento se mide contra el propio alto del
   carácter, así que no hay que recalcularlo si cambia el tamaño de la fuente. */
function CharsRow({ links, dark }: { links: FooterLink[]; dark: boolean }) {
  const rootRef = useGsapContext<HTMLSpanElement>((_self, root) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-hv]", root);
      const cleanups = items.map((el) => {
        const split = SplitText.create(el, { type: "chars" });

        const over = () =>
          gsap.to(split.chars, {
            yPercent: -18,
            duration: 0.34,
            ease: "power3.out",
            stagger: { each: 0.025, from: "start" },
            overwrite: true,
          });
        const out = () =>
          gsap.to(split.chars, {
            yPercent: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.6)",
            stagger: { each: 0.015, from: "start" },
            overwrite: true,
          });

        el.addEventListener("pointerenter", over);
        el.addEventListener("pointerleave", out);
        return () => {
          el.removeEventListener("pointerenter", over);
          el.removeEventListener("pointerleave", out);
          split.revert();
        };
      });

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return (
    <span ref={rootRef} className="contents">
      {links.map((link) => (
        <Link
          key={link.label}
          href={hrefOf(link)}
          data-hv
          className={`text-body-sm transition-colors ${linkTone(dark)}`}
        >
          {link.label}
        </Link>
      ))}
    </span>
  );
}

/* ── 18 · Inertial indicator ──────────────────────────────────────────────
   Un chip que persigue al link bajo el puntero. Lo que lo distingue de una
   transición CSS es el estiramiento: una transición no sabe cuánto va a
   viajar, así que no puede deformarse en proporción al salto.

   El chip es UNO por sub-sección y vive en el contenedor, no en cada link: eso
   es lo que le permite viajar de un link a otro en vez de aparecer y
   desaparecer. */
function InertialRow({ links, dark }: { links: FooterLink[]; dark: boolean }) {
  const chipRef = useRef<HTMLSpanElement>(null);

  const rootRef = useGsapContext<HTMLSpanElement>((_self, root) => {
    const chip = chipRef.current;
    if (!chip) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      let last: { x: number; y: number } | null = null;

      const over = (e: PointerEvent) => {
        const link = (e.target as HTMLElement).closest<HTMLElement>("[data-hv]");
        if (!link || !root.contains(link)) return;

        const h = root.getBoundingClientRect();
        const r = link.getBoundingClientRect();
        const x = r.left - h.left;
        const y = r.top - h.top;

        // El eje del salto decide en cuál se estira. Dentro de una fila los
        // saltos son casi puro X; al cambiar de renglón, casi puro Y.
        const dx = last ? Math.abs(x - last.x) : 0;
        const dy = last ? Math.abs(y - last.y) : 0;
        last = { x, y };
        const along = dx >= dy ? "scaleX" : "scaleY";
        const stretch = 1 + Math.min(Math.max(dx, dy) / 220, 0.45);

        gsap.killTweensOf(chip);
        gsap.set(chip, { autoAlpha: 1 });
        gsap
          .timeline()
          .to(
            chip,
            {
              x: x - 8,
              y,
              width: r.width + 16,
              height: r.height,
              duration: 0.42,
              ease: "power3.out",
            },
            0
          )
          .to(chip, { [along]: stretch, duration: 0.14, ease: "power2.out" }, 0)
          .to(chip, { [along]: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, 0.14);
      };

      const leave = () => {
        last = null;
        gsap.to(chip, { autoAlpha: 0, duration: 0.2, overwrite: true });
      };

      root.addEventListener("pointerover", over);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointerover", over);
        root.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(chip);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <span ref={rootRef} className="relative flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span
        ref={chipRef}
        aria-hidden="true"
        className={`pointer-events-none invisible absolute left-0 top-0 h-0 w-0 rounded-md ${
          dark ? "bg-cream/[0.13]" : "bg-foreground/[0.08]"
        }`}
      />
      {links.map((link) => (
        <Link
          key={link.label}
          href={hrefOf(link)}
          data-hv
          className={`text-body-sm relative transition-colors ${linkTone(dark)}`}
        >
          {link.label}
        </Link>
      ))}
    </span>
  );
}

/* ── El despachador ───────────────────────────────────────────────────────
   `chars` es un efecto del LINK y podría renderizarse link por link; el
   inercial es del GRUPO —su chip viaja de un link a otro— así que necesita
   envolver la fila entera. Por eso la unidad de esta API es la FILA y no el
   link: es la única forma de que los dos se puedan intercambiar en el mismo
   sitio sin que quien llama tenga que saber cuál es cuál. */
export function HoverLinkRow({
  links,
  dark,
  effect,
  className = "",
}: {
  links: FooterLink[];
  dark: boolean;
  effect: HoverEffect;
  className?: string;
}) {
  if (effect === "inertial") {
    return (
      <span className={className}>
        <InertialRow links={links} dark={dark} />
      </span>
    );
  }

  return (
    <p className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${className}`}>
      <CharsRow links={links} dark={dark} />
    </p>
  );
}
