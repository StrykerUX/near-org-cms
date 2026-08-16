"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { MQ } from "@/components/primitives/motion/motionTokens";
import type { Layer } from "./CtaVariants";

// Las 16 variantes de hover para los links del footer.
//
// Otro problema que el del CTA, aunque se parezca: un CTA es UN objeto que
// tiene que llamar la atención; una columna de footer son nueve destinos
// iguales entre los que hay que poder elegir sin cansarse. Por eso acá pesan
// dos criterios que allá no existían:
//
//   · El gesto se repite nueve veces en la misma columna. Todo lo que mueva la
//     caja (padding, tracking, escala) hace temblar la lista entera cuando el
//     puntero la recorre en diagonal.
//   · Algunas variantes no son del LINK sino del GRUPO (dim, focus, rail,
//     torch): usan el hover de un elemento para cambiar a sus hermanos. Son
//     las que mejor resuelven "elegir entre nueve", y las únicas que no se
//     pueden juzgar mirando un link solo.
//
// Igual que las del CTA: esto es demo. El footer real
// (`components/site/SiteFooter.tsx`) sigue con su `hover:text-cream`.

export type LinkVariant = {
  id: string;
  name: string;
  stack: Layer[];
  note: string;
  Comp: () => ReactNode;
};

// Links reales del footer (columna Resources), para juzgar con los largos de
// palabra que la columna tiene de verdad y no con lorem.
const ITEMS = ["Research", "Blog", "Analytics", "Chain Abstraction"];

/** Un link inerte: la demo no navega a ningún lado, pero tiene que seguir
 *  siendo un `<a>` — la mitad de estas variantes dependen de estados que sólo
 *  un link tiene (`:hover` con foco, subrayado, cursor). */
function noNav(e: React.MouseEvent) {
  e.preventDefault();
}

function List({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={`flex flex-col gap-2.5 ${className ?? ""}`}>{children}</ul>;
}

/** La lista genérica: sirve para toda variante cuyo marcado es sólo el link. */
function LinkList({ v }: { v: string }) {
  return (
    <List>
      {ITEMS.map((label) => (
        <li key={label}>
          <a href="#" onClick={noNav} className="hv-link" data-v={v} data-text={label}>
            {label}
          </a>
        </li>
      ))}
    </List>
  );
}

/* ── CSS puro ──────────────────────────────────────────────────────────── */

/** F03 · roll. Dos líneas apiladas dentro de una caja de alto fijo. */
function LinksRoll() {
  return (
    <List>
      {ITEMS.map((label) => (
        <li key={label}>
          <a href="#" onClick={noNav} className="hv-link" data-v="roll">
            <span>{label}</span>
            <span aria-hidden="true">{label}</span>
          </a>
        </li>
      ))}
    </List>
  );
}

/** F06 · chars. El único dato que CSS no puede sacar solo es el índice de cada
 *  letra, así que lo pone el JSX en `--i` y el retardo lo calcula el CSS.
 *  Partir el texto en spans tiene un costo real de accesibilidad: un lector de
 *  pantalla puede deletrear en vez de leer, de ahí el `aria-label` en el link
 *  y el `aria-hidden` en los pedazos. */
function LinksChars() {
  return (
    <List>
      {ITEMS.map((label) => (
        <li key={label}>
          <a href="#" onClick={noNav} className="hv-link" data-v="chars" aria-label={label}>
            <span aria-hidden="true">
              {label.split("").map((ch, i) => (
                <span
                  key={`${ch}-${i}`}
                  className="hv-char"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>
          </a>
        </li>
      ))}
    </List>
  );
}

/** F07 · dim y F12 · focus: el gesto vive en el CONTENEDOR. Mismo marcado,
 *  distinto host. */
function LinksGroup({ host, v }: { host: string; v: string }) {
  return (
    <div className={host}>
      <LinkList v={v} />
    </div>
  );
}

/* ── CSS + JS ──────────────────────────────────────────────────────────── */

/** F13 · rail. Un indicador compartido que se desliza de un link al otro. El
 *  JS sólo mide (offsetTop / offsetHeight) y escribe dos custom properties; el
 *  desplazamiento es una transition de CSS.
 *
 *  Se mide en el `pointerover` y no una vez al montar: la fuente puede swapear
 *  después del primer paint y correr todas las filas unos píxeles. */
function LinksRail() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const onOver = (e: PointerEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLElement>(".hv-link");
      if (!link) return;
      host.style.setProperty("--y", `${link.offsetTop}px`);
      host.style.setProperty("--h", `${link.offsetHeight}px`);
      host.dataset.active = "1";
    };
    // `pointerleave` y no `pointerout`: el segundo dispara también al pasar de
    // un link al siguiente, y el rail parpadearía en cada salto.
    const onLeave = () => {
      host.dataset.active = "0";
    };

    host.addEventListener("pointerover", onOver);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointerover", onOver);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="hv-rail-host" data-active="0">
      <span className="hv-rail" aria-hidden="true" />
      <LinkList v="rail" />
    </div>
  );
}

/** F14 · torch. Dos copias de la lista: la de abajo apagada y la de arriba
 *  encendida, recortada por una máscara radial centrada en el puntero. El
 *  texto no cambia de color — se revela otro texto.
 *
 *  Es la más cara de las 16: la capa iluminada es una máscara que el navegador
 *  re-rasteriza en cada pointermove. Sobre cuatro links no se nota; sobre las
 *  cuatro columnas completas del footer hay que medirlo antes. */
function LinksTorch() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      host.style.setProperty("--mx", `${e.clientX - r.left}px`);
      host.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    // Fuera del host la máscara se va a una coordenada imposible en vez de
    // desmontarse: así no hay que animar una opacidad para que no corte seco.
    const onLeave = () => {
      host.style.setProperty("--mx", "-999px");
      host.style.setProperty("--my", "-999px");
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="hv-torch-host">
      <LinkList v="torch" />
      {/* `inert` además de `aria-hidden`: la copia tiene sus propios `<a>`, y
          sin esto quedarían en el orden de tabulación apuntando a un texto que
          el lector de pantalla no anuncia. */}
      <div className="hv-torch-layer" aria-hidden="true" inert>
        <LinkList v="torch" />
      </div>
    </div>
  );
}

/* ── GSAP ──────────────────────────────────────────────────────────────── */

/** F15 · chars con SplitText. Mismo gesto que F06, con dos cosas que CSS no
 *  da: la curva puede ser distinta a la ida que a la vuelta, y el stagger se
 *  interrumpe limpio si el puntero se va a mitad de camino. */
function LinksGsapChars() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const links = gsap.utils.toArray<HTMLElement>(".hv-link", root);
      const cleanups = links.map((link) => {
        const split = new SplitText(link, { type: "chars" });

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

        link.addEventListener("pointerenter", over);
        link.addEventListener("pointerleave", out);
        return () => {
          link.removeEventListener("pointerenter", over);
          link.removeEventListener("pointerleave", out);
          split.revert();
        };
      });

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <LinkList v="gsap-chars" />
    </div>
  );
}

/** F16 · imán + subrayado elástico. Por separado ninguno de los dos alcanza:
 *  el imán solo se siente flojo en un texto chico, y el subrayado elástico
 *  solo se siente decorativo. Juntos el link parece agarrarse al cursor. */
function LinksGsapMagnet() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, (mmCtx) => {
      const links = gsap.utils.toArray<HTMLElement>(".hv-link", root);

      const cleanups = links.map((link, i) => {
        const line = link.querySelector<HTMLElement>(".hv-underline");
        const xTo = gsap.quickTo(link, "x", { duration: 0.45, ease: "power3.out" });

        // `quickTo` ya está dentro del contexto; los dos handlers que crean
        // tweens nuevos por evento se registran con `ctx.add(nombre, fn)` para
        // que también lo estén. El índice va en el nombre porque el contexto
        // los guarda por clave y son uno por link.
        const move = (e: PointerEvent) => {
          const r = link.getBoundingClientRect();
          // Sólo en X: un imán vertical dentro de una lista de filas apretadas
          // hace que el link invada la fila de arriba.
          xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
        };

        const enter = mmCtx.add(`enter${i}`, () => {
          if (line) gsap.to(line, { scaleX: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" });
        }) as () => void;

        const leave = mmCtx.add(`leave${i}`, () => {
          gsap.to(link, { x: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
          if (line) gsap.to(line, { scaleX: 0, duration: 0.25, ease: "power2.in" });
        }) as () => void;

        link.addEventListener("pointermove", move);
        link.addEventListener("pointerenter", enter);
        link.addEventListener("pointerleave", leave);
        return () => {
          link.removeEventListener("pointermove", move);
          link.removeEventListener("pointerenter", enter);
          link.removeEventListener("pointerleave", leave);
        };
      });

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <List>
        {ITEMS.map((label) => (
          <li key={label}>
            <a href="#" onClick={noNav} className="hv-link" data-v="gsap-magnet">
              {label}
              <span className="hv-underline" aria-hidden="true" />
            </a>
          </li>
        ))}
      </List>
    </div>
  );
}

/* ── El catálogo ───────────────────────────────────────────────────────── */

export const LINK_VARIANTS: LinkVariant[] = [
  {
    id: "underline",
    name: "Underline",
    stack: ["CSS"],
    note: "The rule grows from the left. The correct default: nobody has to learn it, and it works in both footer palettes.",
    Comp: () => <LinkList v="underline" />,
  },
  {
    id: "pass",
    name: "Underline pass",
    stack: ["CSS"],
    note: "The rule enters from the left and exits to the right instead of retracting. Costs 260ms more, and in exchange the link feels travelled rather than just marked.",
    Comp: () => <LinkList v="pass" />,
  },
  {
    id: "roll",
    name: "Line roll",
    stack: ["CSS"],
    note: "The line rolls out and its copy rolls in. The most editorial of the set; it forces a fixed line-height, so the column grows a little.",
    Comp: LinksRoll,
  },
  {
    id: "arrow",
    name: "Arrow push",
    stack: ["CSS"],
    note: "The arrow enters and pushes the label 18px. Careful: it moves the box, and in a column of nine that shows when the pointer cuts across diagonally.",
    Comp: () => <LinkList v="arrow" />,
  },
  {
    id: "ramp",
    name: "Brand ramp",
    stack: ["CSS"],
    note: "The brand green sweeps through the text itself with background-clip. Same mechanism as the hero sheen, so footer and hero would speak one language.",
    Comp: () => <LinkList v="ramp" />,
  },
  {
    id: "chars",
    name: "Char lift",
    stack: ["CSS"],
    note: "Each letter lifts on an 18ms delay. The index comes from JSX in --i; the animation itself is still pure CSS.",
    Comp: LinksChars,
  },
  {
    id: "dim",
    name: "Dim siblings",
    stack: ["CSS"],
    note: "It doesn't light the link — it dims its siblings. The fastest way to steer the eye down a long column, and it's a single rule.",
    Comp: () => <LinksGroup host="hv-dim-host" v="dim" />,
  },
  {
    id: "bracket",
    name: "Brackets",
    stack: ["CSS"],
    note: "Brackets sliding in from outside. A technical vocabulary, fitting for a protocol site; the width never changes because they're absolute.",
    Comp: () => <LinkList v="bracket" />,
  },
  {
    id: "pill",
    name: "Pill",
    stack: ["CSS"],
    note: "A chip grows behind the text. The only one that gives an obvious click target, at the cost of a visually heavier column.",
    Comp: () => <LinkList v="pill" />,
  },
  {
    id: "strike",
    name: "Strike to underline",
    stack: ["CSS"],
    note: "The line is born striking the text through and drops into an underline. More memorable than a clean underline; also slower (440ms of travel).",
    Comp: () => <LinkList v="strike" />,
  },
  {
    id: "glitch",
    name: "RGB glitch",
    stack: ["CSS"],
    note: "Two copies in cyan and magenta with steps(). The loud end of the range — it's here to mark the limit, not for the real footer.",
    Comp: () => <LinkList v="glitch" />,
  },
  {
    id: "focus",
    name: "Blur focus",
    stack: ["CSS"],
    note: "Like dim, but with blur. More cinematic and more expensive: one filter per sibling, each rasterised on its own.",
    Comp: () => <LinksGroup host="hv-focus-host" v="focus" />,
  },
  {
    id: "rail",
    name: "Shared rail",
    stack: ["CSS", "JS"],
    note: "A single indicator sliding between links. The one that best says the column is a group and not nine unrelated things.",
    Comp: LinksRail,
  },
  {
    id: "torch",
    name: "Torch",
    stack: ["CSS", "JS"],
    note: "A halo lighting whatever passes underneath, with a masked copy of the list. Spectacular, and the most expensive of the 16.",
    Comp: LinksTorch,
  },
  {
    id: "gsap-chars",
    name: "Char stagger",
    stack: ["GSAP"],
    note: "SplitText: up on power3, back on elastic. The way in and the way out can carry different curves, which is exactly what CSS can't give you.",
    Comp: LinksGsapChars,
  },
  {
    id: "gsap-magnet",
    name: "Magnet + elastic rule",
    stack: ["GSAP"],
    note: "The label magnetises on X and the rule draws itself with an elastic. X only: on Y the link would invade the row above.",
    Comp: LinksGsapMagnet,
  },
];
