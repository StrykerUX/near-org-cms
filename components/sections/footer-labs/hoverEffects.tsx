"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import type { FooterLink } from "./footerLabContent";

// Los cuatro hovers de `/prototype/hover-lab` que el lab de footers adoptó,
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
// ── Los cuatro, y de dónde vienen ──────────────────────────────────────────
//
//   ramp      (05 · Brand ramp)        CSS. El verde de marca barre el texto
//                                      con `background-clip: text`.
//   chars     (15 · Char stagger)      GSAP + SplitText. Sube en `power3`,
//                                      vuelve en `elastic` — la ida y la
//                                      vuelta con curvas distintas es lo que
//                                      CSS no puede dar.
//   inertial  (18 · Inertial indicator) GSAP. Un chip que persigue al link y se
//                                      ESTIRA proporcionalmente al salto.
//   scramble  (21 · Eased scramble)    GSAP. El texto se revuelve y se resuelve
//                                      con el progreso en `power2.out`.
//
// ── La adaptación del 18 ───────────────────────────────────────────────────
//
// En el hover-lab el indicador inercial recorre una columna VERTICAL de links y
// solo se mueve en Y. Acá los links de una sub-sección corren en LÍNEA, así que
// el chip persigue en X y en Y, y el estiramiento se aplica sobre el eje del
// salto: `scaleX` cuando salta de link a link dentro de una fila, `scaleY`
// cuando cambia de fila. Sin eso, el estiramiento se veía perpendicular al
// movimiento — que es exactamente al revés de lo que la inercia hace.

export type HoverEffect = "ramp" | "chars" | "inertial" | "scramble";

/**
 * El reparto por defecto, en el orden de `GROUPS`: Products, Stack, Resources,
 * About, Terms and Policies.
 *
 * Intercalados a propósito y no agrupados por costo: puestos en fila, los dos
 * de GSAP quedarían juntos y el footer tendría una mitad "cara" y otra
 * "barata", que es justo lo que no se quiere comparar. Así cada uno tiene un
 * vecino distinto arriba y al lado.
 */
export const DEFAULT_EFFECTS: HoverEffect[] = [
  "ramp",
  "chars",
  "inertial",
  "scramble",
  "ramp",
];

function linkTone(dark: boolean) {
  return dark ? "text-cream/70 hover:text-cream" : "text-muted-foreground hover:text-foreground";
}

/** `href: null` = la página no existe todavía: link inerte a "#" en vez de un
 *  destino inventado. Un link equivocado es peor que un placeholder evidente. */
function hrefOf(link: FooterLink) {
  return link.href ?? "#";
}

/* ── 05 · Brand ramp ──────────────────────────────────────────────────────
   El gradiente de marca vive en el propio texto (`background-clip: text`) y lo
   que se anima es su POSICIÓN, no su color: por eso el barrido tiene dirección
   y no es un fade. Mismo mecanismo que el sheen del hero, así que footer y hero
   hablarían un mismo idioma.

   El tramo neutro del gradiente ocupa la mitad derecha y es el color de reposo:
   con `background-size: 220%` y la posición en 100%, lo que se ve al principio
   es solo esa parte. */
function RampLink({ link, dark }: { link: FooterLink; dark: boolean }) {
  const rest = dark ? "rgb(245 244 241 / 0.7)" : "rgb(108 116 119)";
  return (
    <Link
      href={hrefOf(link)}
      className="text-body-sm bg-clip-text text-transparent transition-[background-position] duration-500 ease-[cubic-bezier(0.33,0,0.67,1)] hover:bg-[position:0%_0]"
      style={{
        backgroundImage: `linear-gradient(100deg, var(--cta-lime) 0%, var(--cta-mint) 35%, ${rest} 50%, ${rest} 100%)`,
        backgroundSize: "220% 100%",
        backgroundPosition: "100% 0",
      }}
    >
      {link.label}
    </Link>
  );
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

/* ── 21 · Eased scramble ──────────────────────────────────────────────────
   El texto se revuelve y se resuelve de izquierda a derecha. Lo que lo hace
   legible mientras corre es que el progreso va en `power2.out`: las primeras
   letras se asientan casi al instante, así que el principio de la palabra —que
   es por donde se lee— se estabiliza antes que el final.

   El texto que se revuelve NO es el accesible: mientras la animación corre, el
   `textContent` es basura, así que el label real va en `aria-label` y el span
   animado queda `aria-hidden`. Y el ancho se reserva con una copia invisible
   del texto: sin eso, los caracteres del charset —más anchos que los de la
   palabra— empujarían a los links vecinos en cada hover. */
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*";

function ScrambleRow({ links, dark }: { links: FooterLink[]; dark: boolean }) {
  const rootRef = useGsapContext<HTMLSpanElement>((_self, root) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-hv]", root);
      const cleanups = items.map((el) => {
        const target = el.querySelector<HTMLElement>("[data-scramble]");
        const text = target?.textContent ?? "";
        if (!target) return () => {};

        const state = { p: 0 };
        const render = () => {
          const settled = state.p * text.length;
          target.textContent = text
            .split("")
            .map((ch, i) =>
              i < settled || ch === " " ? ch : CHARSET[(Math.random() * CHARSET.length) | 0]
            )
            .join("");
        };

        const enter = () =>
          gsap.fromTo(
            state,
            { p: 0 },
            { p: 1, duration: 0.7, ease: "power2.out", onUpdate: render, overwrite: true }
          );
        const leave = () => {
          gsap.killTweensOf(state);
          state.p = 1;
          target.textContent = text;
        };

        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        return () => {
          gsap.killTweensOf(state);
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
          target.textContent = text;
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
          aria-label={link.label}
          className={`text-body-sm relative inline-grid transition-colors ${linkTone(dark)}`}
        >
          {/* La copia invisible reserva el ancho de la palabra real; las dos
              ocupan la misma celda del grid, así que el link no cambia de
              tamaño aunque el charset sea más ancho. */}
          <span aria-hidden="true" className="invisible col-start-1 row-start-1">
            {link.label}
          </span>
          <span data-scramble aria-hidden="true" className="col-start-1 row-start-1">
            {link.label}
          </span>
        </Link>
      ))}
    </span>
  );
}

/* ── El despachador ───────────────────────────────────────────────────────
   Tres de los cuatro efectos son del LINK y podrían renderizarse uno por uno;
   el inercial es del GRUPO —su chip viaja entre links— así que necesita
   envolver la fila entera. Por eso la unidad de esta API es la FILA y no el
   link: es la única forma de que los cuatro se puedan intercambiar en el mismo
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
      {effect === "chars" && <CharsRow links={links} dark={dark} />}
      {effect === "scramble" && <ScrambleRow links={links} dark={dark} />}
      {effect === "ramp" &&
        links.map((link) => <RampLink key={link.label} link={link} dark={dark} />)}
    </p>
  );
}
