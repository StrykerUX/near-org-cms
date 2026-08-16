"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { MQ } from "@/components/primitives/motion/motionTokens";
import type { Tech } from "./CtaVariants";

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
  tech: Tech;
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
    tech: "CSS",
    note: "La regla crece desde la izquierda. El default correcto: nadie tiene que aprenderlo y funciona en las dos paletas del footer.",
    Comp: () => <LinkList v="underline" />,
  },
  {
    id: "pass",
    name: "Underline pass",
    tech: "CSS",
    note: "La regla sale por la derecha y vuelve a entrar por la izquierda. Cuesta 240ms más y a cambio el link se siente recorrido, no sólo marcado.",
    Comp: () => <LinkList v="pass" />,
  },
  {
    id: "roll",
    name: "Line roll",
    tech: "CSS",
    note: "La línea rueda y entra su copia. El más editorial de la tanda; obliga a un line-height fijo, así que la columna crece un poco.",
    Comp: LinksRoll,
  },
  {
    id: "arrow",
    name: "Arrow push",
    tech: "CSS",
    note: "La flecha entra y empuja al label 18px. Ojo: es de los que mueven la caja, y en una columna de nueve se nota al recorrerla en diagonal.",
    Comp: () => <LinkList v="arrow" />,
  },
  {
    id: "ramp",
    name: "Brand ramp",
    tech: "CSS",
    note: "El verde de marca barre el propio texto con background-clip. Mismo mecanismo que el sheen del hero: footer y hero hablarían el mismo idioma.",
    Comp: () => <LinkList v="ramp" />,
  },
  {
    id: "chars",
    name: "Char lift",
    tech: "CSS",
    note: "Cada letra sube con 18ms de retardo. El índice lo pone el JSX en --i; la animación sigue siendo CSS puro.",
    Comp: LinksChars,
  },
  {
    id: "dim",
    name: "Dim siblings",
    tech: "CSS",
    note: "No ilumina el link: apaga a los hermanos. Lo que más rápido dirige la mirada en una columna larga, y es una sola regla.",
    Comp: () => <LinksGroup host="hv-dim-host" v="dim" />,
  },
  {
    id: "bracket",
    name: "Brackets",
    tech: "CSS",
    note: "Corchetes que entran desde afuera. Vocabulario técnico, coherente con un sitio de protocolo; el ancho no cambia porque son absolutos.",
    Comp: () => <LinkList v="bracket" />,
  },
  {
    id: "pill",
    name: "Pill",
    tech: "CSS",
    note: "Un chip crece detrás del texto. El único que da un área de click evidente, a costa de hacer la columna visualmente más pesada.",
    Comp: () => <LinkList v="pill" />,
  },
  {
    id: "strike",
    name: "Strike to underline",
    tech: "CSS",
    note: "La línea nace tachando el texto y baja a subrayado. Más memorable que un subrayado limpio; también más lento (440ms de recorrido).",
    Comp: () => <LinkList v="strike" />,
  },
  {
    id: "glitch",
    name: "RGB glitch",
    tech: "CSS",
    note: "Dos copias en cian y magenta con steps(). El extremo ruidoso del rango — está para marcar el límite, no para el footer real.",
    Comp: () => <LinkList v="glitch" />,
  },
  {
    id: "focus",
    name: "Blur focus",
    tech: "CSS",
    note: "Como dim, pero con desenfoque. Más cinematográfico y más caro: un filtro por hermano, cada uno rasterizado aparte.",
    Comp: () => <LinksGroup host="hv-focus-host" v="focus" />,
  },
  {
    id: "rail",
    name: "Shared rail",
    tech: "CSS + JS",
    note: "Un indicador único que se desliza entre los links. El que mejor comunica que la columna es un grupo y no nueve cosas sueltas.",
    Comp: LinksRail,
  },
  {
    id: "torch",
    name: "Torch",
    tech: "CSS + JS",
    note: "Un halo que ilumina lo que pasa por debajo, con una copia enmascarada de la lista. Espectacular y el más caro de los 16.",
    Comp: LinksTorch,
  },
  {
    id: "gsap-chars",
    name: "Char stagger",
    tech: "GSAP",
    note: "SplitText: sube con power3 y vuelve con elastic. La ida y la vuelta pueden tener curvas distintas, que es lo que CSS no da.",
    Comp: LinksGsapChars,
  },
  {
    id: "gsap-magnet",
    name: "Magnet + elastic rule",
    tech: "GSAP",
    note: "El label se imanta en X y el subrayado se dibuja con un elastic. Sólo en X: en Y el link invadiría la fila de arriba.",
    Comp: LinksGsapMagnet,
  },
];
