"use client";

import { type ReactNode } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import type { LinkVariant } from "./FooterLinkVariants";
import type { GLState } from "./gl/sharedGL";
import { useGlHover } from "./gl/useGlHover";

// Segunda tanda del footer: doce variantes que combinan capas.
//
// ── El cambio de escala respecto de las 16 primeras ───────────────────────
//
// Casi todas éstas son del GRUPO, no del link. No es una casualidad ni una
// preferencia estética: es lo que pasa cuando el efecto deja de caber en una
// regla de CSS. Un subrayado se puede declarar nueve veces sin pensarlo; una
// luz que sigue al cursor, un indicador que viaja entre filas o un shader
// tienen que existir UNA vez y saber sobre qué link están.
//
// Eso vuelve al contenedor el dueño del estado, y de paso resuelve mejor el
// problema real de un footer —elegir entre nueve destinos iguales— que
// cualquier cosa que le pase a un link por separado.
//
// Las cuatro con shader comparten el mismo contexto WebGL que las del CTA
// (`gl/sharedGL.ts`), y cada una monta UN canvas por COLUMNA: cuatro links con
// un canvas cada uno serían cuatro contextos para dibujar una sola luz.

const ITEMS = ["Research", "Blog", "Analytics", "Chain Abstraction"];

function noNav(e: React.MouseEvent) {
  e.preventDefault();
}

function List({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col gap-2.5">{children}</ul>;
}

/** La lista base. Igual que en la primera tanda: los labels son los reales del
 *  footer, para juzgar con los largos de palabra que la columna tiene. */
function LinkList({ v }: { v: string }) {
  return (
    <List>
      {ITEMS.map((label) => (
        <li key={label}>
          <a href="#" onClick={noNav} className="hv-link" data-v={v}>
            {label}
          </a>
        </li>
      ))}
    </List>
  );
}

/**
 * La geometría del link que está bajo el puntero, relativa al host.
 *
 * Cuatro de las variantes de acá la necesitan y ninguna puede usar
 * `getBoundingClientRect` del link directamente: el shader razona en
 * coordenadas del canvas (que es el host) y con el eje Y al revés que el DOM.
 * Tener la conversión en un solo lugar es lo que evita que una variante quede
 * con la mancha 20px más abajo que las otras.
 */
function probe(host: HTMLElement, e: PointerEvent) {
  const link = (e.target as HTMLElement).closest<HTMLElement>(".hv-link");
  if (!link || !host.contains(link)) return null;
  const h = host.getBoundingClientRect();
  const r = link.getBoundingClientRect();
  return {
    link,
    /** Centro del link en px del host, origen arriba-izquierda (como el DOM). */
    cx: r.left - h.left + r.width / 2,
    cy: r.top - h.top + r.height / 2,
    /** El mismo centro con el eje Y invertido, que es lo que espera el shader. */
    glY: h.height - (r.top - h.top + r.height / 2),
    w: r.width,
    h: r.height,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   JS + GSAP
   ══════════════════════════════════════════════════════════════════════════ */

/** F17 · dock. Los vecinos se apartan del link activo, con la fuerza cayendo
 *  por distancia — el gesto del dock de macOS aplicado a una lista.
 *
 *  Lo interesante en UX es que el desplazamiento CREA el espacio que hace
 *  fácil apuntar: el link activo termina con más aire alrededor justo mientras
 *  el cursor va hacia él. Lo caro es que mueve nueve cajas a la vez, así que
 *  todo el movimiento va por transform (nunca margin) para que no haya layout
 *  en ningún frame. */
const DOCK_PUSH = 7;

function LinksDock() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const links = gsap.utils.toArray<HTMLElement>(".hv-link", root);
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const settle = () =>
        gsap.to(links, { y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.6)", overwrite: true });

      const over = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>(".hv-link");
        if (!target) return;
        const i = links.indexOf(target);
        if (i < 0) return;

        links.forEach((l, j) => {
          const d = j - i;
          // 1/(1+|d|²) cae rápido: sólo los dos vecinos inmediatos se mueven de
          // forma perceptible. Una caída lineal empuja la columna entera y se
          // lee como que la lista se desarmó.
          const push = d === 0 ? 0 : Math.sign(d) * (DOCK_PUSH / (1 + d * d));
          gsap.to(l, {
            y: push,
            scale: d === 0 ? 1.06 : 1,
            duration: 0.45,
            ease: "power3.out",
            overwrite: true,
          });
        });
      };

      root.addEventListener("pointerover", over);
      root.addEventListener("pointerleave", settle);
      return () => {
        root.removeEventListener("pointerover", over);
        root.removeEventListener("pointerleave", settle);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="hv-dock-host">
      <LinkList v="dock" />
    </div>
  );
}

/** F18 · indicador con inercia. Es el rail de la variante 13 (CSS + JS) con
 *  GSAP encima, y la comparación directa es el punto: el rail llega con una
 *  `transition` y éste llega deformándose. Se ESTIRA mientras viaja y recupera
 *  su alto al frenar — la deformación en el eje del movimiento es lo que hace
 *  leer velocidad, y es exactamente lo que una transition de CSS no puede
 *  expresar porque no sabe cuánta distancia va a recorrer. */
function LinksSticky() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const chip = root.querySelector<HTMLElement>(".hv-sticky-chip");
    if (!chip) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      let lastY: number | null = null;

      const over = (e: PointerEvent) => {
        const p = probe(root, e);
        if (!p) return;

        const travel = lastY === null ? 0 : Math.abs(p.cy - lastY);
        lastY = p.cy;

        gsap.killTweensOf(chip);
        gsap.set(chip, { autoAlpha: 1 });
        gsap
          .timeline()
          .to(
            chip,
            {
              y: p.cy - p.h / 2,
              height: p.h,
              width: p.w + 16,
              duration: 0.45,
              ease: "power3.out",
            },
            0
          )
          // El estiramiento es proporcional al salto y se cancela solo: un
          // valor fijo se ve igual saltando una fila que cinco.
          .to(chip, { scaleY: 1 + Math.min(travel / 160, 0.5), duration: 0.14, ease: "power2.out" }, 0)
          .to(chip, { scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, 0.14);
      };

      const leave = () => {
        lastY = null;
        gsap.to(chip, { autoAlpha: 0, duration: 0.2, overwrite: true });
      };

      root.addEventListener("pointerover", over);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointerover", over);
        root.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="hv-sticky-host">
      <span className="hv-sticky-chip" aria-hidden="true" />
      <LinkList v="sticky" />
    </div>
  );
}

/** F21 · scramble conducido por GSAP. El mismo efecto que la variante 22 del
 *  CTA, con una diferencia que se nota: allá el avance era lineal (un rAF con
 *  un contador), acá lo lleva un `power2.out`, así que las primeras letras se
 *  resuelven rápido y las últimas se demoran. Leer se vuelve más fácil, porque
 *  el principio de la palabra se estabiliza casi al instante. */
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*";

function LinksScramble() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const links = gsap.utils.toArray<HTMLElement>(".hv-link", root);
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const cleanups = links.map((link) => {
        const target = link.querySelector<HTMLElement>(".hv-scramble-text");
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

        link.addEventListener("pointerenter", enter);
        link.addEventListener("pointerleave", leave);
        return () => {
          gsap.killTweensOf(state);
          link.removeEventListener("pointerenter", enter);
          link.removeEventListener("pointerleave", leave);
          target.textContent = text;
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
            {/* El texto accesible no es el que se scramblea: mientras corre, el
                textContent es basura. */}
            <a href="#" onClick={noNav} className="hv-link" data-v="scramble" aria-label={label}>
              <span className="hv-scramble-text" aria-hidden="true">
                {label}
              </span>
            </a>
          </li>
        ))}
      </List>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CSS + GSAP
   ══════════════════════════════════════════════════════════════════════════ */

/** F19 · subrayado a mano alzada. Un path SVG con una curva irregular —no una
 *  recta— que se dibuja con `stroke-dasharray`. Rompe la rigidez de una
 *  columna de links sin agregar color ni movimiento de caja, y es de las pocas
 *  cosas de esta lista que se sostienen en una marca editorial. */
function LinksSketch() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const links = gsap.utils.toArray<HTMLElement>(".hv-link", root);
      const cleanups = links.map((link) => {
        const path = link.querySelector<SVGPathElement>("path");
        if (!path) return () => {};

        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

        const enter = () =>
          gsap.to(path, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out", overwrite: true });
        // Se BORRA por el otro extremo (offset negativo) en vez de deshacerse:
        // el trazo sale por donde terminó, como al levantar el lápiz.
        const leave = () =>
          gsap.to(path, { strokeDashoffset: -len, duration: 0.4, ease: "power2.in", overwrite: true });

        link.addEventListener("pointerenter", enter);
        link.addEventListener("pointerleave", leave);
        return () => {
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
            <a href="#" onClick={noNav} className="hv-link" data-v="sketch">
              {label}
              {/* preserveAspectRatio="none" para que el trazo se estire al ancho
                  real del link sin que haya que medirlo en JS. */}
              <svg className="hv-sketch" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M1 4.2 C 18 2.1, 34 5.4, 52 3.3 S 84 1.6, 99 3.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </a>
          </li>
        ))}
      </List>
    </div>
  );
}

/** F20 · flip por link. Cada uno gira en X y muestra su copia en el color de
 *  acento. En una columna funciona mejor que en un botón: los links son cajas
 *  chicas y de una línea, así que el giro no distorsiona nada.
 *
 *  El límite es el ritmo — nueve giros de 400ms mientras el puntero baja por la
 *  lista es mucho movimiento junto. Por eso la duración acá es la mitad que en
 *  la del CTA. */
function LinksFlip() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const links = gsap.utils.toArray<HTMLElement>(".hv-flip-link", root);
      const cleanups = links.map((link) => {
        const inner = link.querySelector<HTMLElement>(".hv-flip-inner");
        if (!inner) return () => {};

        const enter = () =>
          gsap.to(inner, { rotateX: -180, duration: 0.3, ease: "power2.inOut", overwrite: true });
        const leave = () =>
          gsap.to(inner, { rotateX: 0, duration: 0.3, ease: "power2.inOut", overwrite: true });

        link.addEventListener("pointerenter", enter);
        link.addEventListener("pointerleave", leave);
        return () => {
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
            <a href="#" onClick={noNav} className="hv-link hv-flip-link" data-v="flip">
              <span className="hv-flip-inner">
                <span className="hv-flip-face">{label}</span>
                <span className="hv-flip-face hv-flip-back" aria-hidden="true">
                  {label}
                </span>
              </span>
            </a>
          </li>
        ))}
      </List>
    </div>
  );
}

/** F22 · gooey. El chip de fondo de la variante 09, pero fundido con una gota
 *  que lo sigue: al saltar de un link al siguiente, el chip se estira y se
 *  parte como una gota de mercurio.
 *
 *  El filtro es caro (un blur a resolución de pantalla sobre el bloque
 *  entero) y por eso el host es sólo la columna, no la tarjeta. */
function LinksGooey() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const chip = root.querySelector<HTMLElement>(".hv-goo-chip");
    const drop = root.querySelector<HTMLElement>(".hv-goo-drop");
    if (!chip || !drop) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const over = (e: PointerEvent) => {
        const p = probe(root, e);
        if (!p) return;
        gsap.to([chip, drop], { autoAlpha: 1, duration: 0.15, overwrite: "auto" });
        gsap.to(chip, {
          y: p.cy - p.h / 2,
          width: p.w + 20,
          height: p.h + 4,
          duration: 0.4,
          ease: "power3.out",
          overwrite: true,
        });
        // La gota va más lenta: ese retraso es lo que crea el "cuello" que el
        // filtro convierte en una liga entre las dos formas.
        gsap.to(drop, {
          y: p.cy - 7,
          duration: 0.62,
          ease: "power2.out",
          overwrite: true,
        });
      };
      const leave = () => gsap.to([chip, drop], { autoAlpha: 0, duration: 0.2, overwrite: "auto" });

      root.addEventListener("pointerover", over);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointerover", over);
        root.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="hv-goo-list">
      <span className="hv-goo-fluid" aria-hidden="true">
        <span className="hv-goo-chip" />
        <span className="hv-goo-drop" />
      </span>
      <LinkList v="goo-list" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CSS + JS + GSAP
   ══════════════════════════════════════════════════════════════════════════ */

/** F27 · la columna se inclina hacia el cursor y el link activo se adelanta en
 *  Z. Es el efecto más sutil de los doce y el que mejor escala: no hay nada
 *  que dibujar, sólo una rotación de 4° sobre el contenedor.
 *
 *  4° y no 10: el texto en perspectiva pierde nitidez rápido, y una columna de
 *  links es texto y nada más. */
const TILT = 4;

function LinksTiltColumn() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const plane = root.querySelector<HTMLElement>(".hv-tiltcol-plane");
    if (!plane) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const rxTo = gsap.quickTo(plane, "rotateX", { duration: 0.6, ease: "power3.out" });
      const ryTo = gsap.quickTo(plane, "rotateY", { duration: 0.6, ease: "power3.out" });
      let rect: DOMRect | null = null;

      const move = (e: PointerEvent) => {
        if (!rect) rect = root.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rxTo(-py * TILT * 2);
        ryTo(px * TILT * 2);

        const p = probe(root, e);
        // `z` y no `scale`: con la perspectiva ya puesta, empujar en Z acerca
        // el link de verdad — crece Y se corre según dónde esté en el plano,
        // que es lo que hace que se lea como profundidad.
        gsap.to(root.querySelectorAll(".hv-link"), { z: 0, duration: 0.4, overwrite: "auto" });
        if (p) gsap.to(p.link, { z: 34, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      };

      const leave = () => {
        rect = null;
        gsap.to(plane, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out", overwrite: true });
        gsap.to(root.querySelectorAll(".hv-link"), { z: 0, duration: 0.5, overwrite: "auto" });
      };

      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="hv-tiltcol-host">
      <div className="hv-tiltcol-plane">
        <LinkList v="tiltcol" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   WebGL
   ══════════════════════════════════════════════════════════════════════════ */

/** F23 · antorcha con shader. La misma idea que la variante 14 (que lo resuelve
 *  con una máscara CSS y una copia del texto) hecha con luz de verdad: el halo
 *  tiene ruido, respira, y se compone con `screen`, así que lo que pasa por
 *  debajo se ACLARA en vez de ser reemplazado por otra capa.
 *
 *  Un canvas por columna, no por link. Y el texto sigue siendo texto del DOM:
 *  seleccionable, buscable, accesible. */
function LinksGlTorch() {
  const ref = useGlHover<HTMLDivElement>({ shader: "glTorch", blend: "screen", z: 2 });
  return (
    <div ref={ref} className="hv-gl-host">
      <LinkList v="gl-torch" />
    </div>
  );
}

/** F24 · aurora. Bandas lentas DETRÁS de la columna, que suben de intensidad
 *  con el hover. Es el único de los cuatro con shader que no reacciona al link
 *  concreto: da ambiente, no feedback.
 *
 *  Deliberadamente tenue. Un fondo animado detrás de nueve destinos tiene que
 *  poder ignorarse mientras se lee, o compite con la única tarea que la
 *  columna tiene. */
function LinksGlAurora() {
  const ref = useGlHover<HTMLDivElement>({
    shader: "glAurora",
    z: 0,
    inVars: { duration: 0.9, ease: "power2.out" },
    outVars: { duration: 0.7, ease: "power2.inOut" },
  });
  return (
    <div ref={ref} className="hv-gl-host hv-gl-behind">
      <LinkList v="gl-aurora" />
    </div>
  );
}

/** F25 · tinta. Una mancha con el borde roto por ruido crece desde el link
 *  activo, como tinta absorbida por el papel. Cada cambio de link REINICIA el
 *  crecimiento, así que recorrer la columna deja una mancha nueva por fila en
 *  vez de una que se desliza. */
function LinksGlInk() {
  const setAux = (state: GLState, host: HTMLElement, e: PointerEvent) => {
    const p = probe(host, e);
    if (!p) return;
    // Cambiar de fila hace nacer una mancha nueva; moverse dentro de la misma
    // no reinicia nada, o el efecto parpadearía con cada pointermove.
    const moved = Math.abs(state.aux.y - p.glY) > 2;
    Object.assign(state.aux, { x: p.cx, y: p.glY, z: p.h, w: 0 });
    if (moved) {
      gsap.fromTo(
        state,
        { prog: 0 },
        { prog: 1, duration: 0.75, ease: "power3.out", overwrite: "auto" }
      );
    }
  };

  const ref = useGlHover<HTMLDivElement>({
    shader: "glInk",
    blend: "screen",
    z: 0,
    // El crecimiento lo dispara `setAux` por fila, así que el tween de entrada
    // sólo sube `hover` y deja `prog` en cero.
    inVars: { prog: 0, duration: 0.3 },
    onMove: setAux,
  });

  return (
    <div ref={ref} className="hv-gl-host hv-gl-behind">
      <LinkList v="gl-ink" />
    </div>
  );
}

/** F26 · el subrayado ES el shader: una franja de dos píxeles con plasma
 *  corriendo por dentro, que se mueve al link activo y se abre desde el centro.
 *
 *  Un canvas para toda la columna y no un subrayado por link — la misma
 *  decisión que el rail de la variante 13, un piso más arriba. Es también la
 *  respuesta a la pregunta obvia: no, no hace falta un contexto WebGL por
 *  link. */
function LinksGlUnderline() {
  const setAux = (state: GLState, host: HTMLElement, e: PointerEvent) => {
    const p = probe(host, e);
    if (!p) return;
    const first = state.aux.z === 0;
    // La línea se DESLIZA entre links (GSAP anima los canales de `aux`) pero la
    // primera vez aparece ya en su sitio: viajar desde la esquina de la columna
    // sería un movimiento que nadie pidió.
    const y = p.glY - p.h / 2 + 3;
    if (first) {
      Object.assign(state.aux, { x: p.cx, y, z: p.w, w: 0 });
      gsap.fromTo(state, { prog: 0 }, { prog: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
      return;
    }
    gsap.to(state.aux, {
      x: p.cx,
      y,
      z: p.w,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const ref = useGlHover<HTMLDivElement>({
    shader: "glUnderline",
    blend: "screen",
    z: 2,
    inVars: { prog: 0, duration: 0.25 },
    onMove: setAux,
  });

  return (
    <div ref={ref} className="hv-gl-host">
      <LinkList v="gl-underline" />
    </div>
  );
}

/** F28 · la misma luz de F23 con OTRO modo de fusión. `difference` en vez de
 *  `screen`: donde pega el halo, el texto y el fondo se invierten en vez de
 *  aclararse.
 *
 *  Está al lado de F23 a propósito. El shader es idéntico, el JS es idéntico,
 *  y la lectura cambia por completo: uno se siente una linterna sobre papel y
 *  el otro un negativo fotográfico. La decisión de diseño no siempre está en
 *  el efecto — a veces está en cómo se compone contra lo que ya había. */
function LinksGlWash() {
  const ref = useGlHover<HTMLDivElement>({ shader: "glTorch", blend: "difference", z: 2 });
  return (
    <div ref={ref} className="hv-gl-host">
      <LinkList v="gl-wash" />
    </div>
  );
}

/* ── El catálogo de la segunda tanda ─────────────────────────────────────── */

export const LINK_VARIANTS_PLUS: LinkVariant[] = [
  {
    id: "dock",
    name: "Dock push",
    stack: ["JS", "GSAP"],
    note: "Los vecinos se apartan con la fuerza cayendo por distancia. El desplazamiento CREA el espacio que hace fácil apuntar; todo por transform, cero layout.",
    Comp: LinksDock,
  },
  {
    id: "sticky",
    name: "Inertial indicator",
    stack: ["JS", "GSAP"],
    note: "El rail de la 13 con inercia: se estira mientras viaja, proporcional al salto. Es justo lo que una transition de CSS no puede — no sabe cuánto va a recorrer.",
    Comp: LinksSticky,
  },
  {
    id: "sketch",
    name: "Hand-drawn rule",
    stack: ["CSS", "GSAP"],
    note: "Un trazo irregular que se dibuja y se borra por el otro extremo, como al levantar el lápiz. Rompe la rigidez de la columna sin color ni movimiento de caja.",
    Comp: LinksSketch,
  },
  {
    id: "flip-link",
    name: "Per-link flip",
    stack: ["CSS", "GSAP"],
    note: "Cada link gira en X. Funciona mejor acá que en el botón (cajas chicas, una línea), pero la duración va a la mitad: nueve giros seguidos son mucho movimiento.",
    Comp: LinksFlip,
  },
  {
    id: "scramble-gsap",
    name: "Eased scramble",
    stack: ["JS", "GSAP"],
    note: "El scramble de la 22 con el avance en power2.out: las primeras letras se fijan casi al instante, así que la palabra se puede leer mientras todavía corre.",
    Comp: LinksScramble,
  },
  {
    id: "goo-list",
    name: "Gooey chip",
    stack: ["CSS", "GSAP"],
    note: "El chip se funde con una gota que va más lenta: al saltar de fila se estira y se parte como mercurio. El retraso de la gota ES el cuello que hace el efecto.",
    Comp: LinksGooey,
  },
  {
    id: "tiltcol",
    name: "Tilted column",
    stack: ["CSS", "JS", "GSAP"],
    note: "La columna se inclina 4° hacia el cursor y el link activo se adelanta en Z. El más sutil de los doce y el que mejor escala: no hay nada que dibujar.",
    Comp: LinksTiltColumn,
  },
  {
    id: "gl-torch",
    name: "Shader torch",
    stack: ["CSS", "WebGL"],
    note: "La variante 14 con luz de verdad: el halo tiene ruido y se compone con screen, así que aclara lo que pasa por debajo. Un canvas por columna, el texto sigue siendo DOM.",
    Comp: LinksGlTorch,
  },
  {
    id: "gl-aurora",
    name: "Aurora backdrop",
    stack: ["GSAP", "WebGL"],
    note: "Bandas lentas detrás de la columna. El único con shader que no reacciona al link: da ambiente, no feedback — y por eso está deliberadamente tenue.",
    Comp: LinksGlAurora,
  },
  {
    id: "gl-ink",
    name: "Ink bleed",
    stack: ["GSAP", "WebGL"],
    note: "Una mancha de borde roto crece desde el link activo. Cambiar de fila reinicia el crecimiento, así que la columna se recorre dejando manchas nuevas.",
    Comp: LinksGlInk,
  },
  {
    id: "gl-underline",
    name: "Plasma underline",
    stack: ["GSAP", "WebGL"],
    note: "El subrayado es el shader: se desliza al link activo con GSAP animando los uniforms. La respuesta a la pregunta obvia — no, no hace falta un contexto por link.",
    Comp: LinksGlUnderline,
  },
  {
    id: "gl-wash",
    name: "Difference wash",
    stack: ["CSS", "JS", "WebGL"],
    note: "El mismo shader que la torch, compuesto con difference: el texto se invierte en vez de aclararse. La decisión no está en el efecto sino en cómo se funde con lo de abajo.",
    Comp: LinksGlWash,
  },
];
