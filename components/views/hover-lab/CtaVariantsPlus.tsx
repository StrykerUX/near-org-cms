"use client";

import { useRef } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import type { CtaVariant } from "./CtaVariants";
import { getSharedGL, textTexture } from "./gl/sharedGL";
import { useGlHover } from "./gl/useGlHover";

// Segunda tanda del CTA: doce variantes que COMBINAN capas. Las 27 primeras
// eran cada una de una sola familia (o CSS, o JS, o GSAP); éstas empiezan
// donde una sola no alcanza.
//
// ── Lo que cambia al combinar ─────────────────────────────────────────────
//
// El reparto no es estético, es de responsabilidades, y siempre el mismo:
//
//   CSS    dibuja el REPOSO y todo lo que sea un cambio de estado binario.
//   JS     aporta lo que sólo se sabe en runtime: dónde está el puntero, a qué
//          velocidad va, cuánto mide la caja.
//   GSAP   pone la CURVA. Es lo que separa "seguir al cursor" de "tener masa".
//   WebGL  pinta por píxel lo que el DOM no puede: ruido, distorsión, luz.
//
// Cuando una variante usa las cuatro, cada una hace exactamente una de esas
// cosas. Si dos capas se pelean por la misma propiedad (el caso clásico: una
// transition de CSS sobre algo que GSAP también anima), el efecto se rompe de
// formas que después nadie encuentra.
//
// ── El costo de WebGL, en concreto ────────────────────────────────────────
//
// Las seis con shader comparten UN contexto (ver `gl/sharedGL.ts`): los
// navegadores permiten 8 por origen, y diez canvases propios harían que el
// navegador matara contextos al azar según por dónde hubieras scrolleado. El
// canvas se reparenta al botón hovereado y vuelve a salir; en reposo no hay ni
// canvas en el DOM ni callback en el ticker.

const LABEL = "Get started";

/* ══════════════════════════════════════════════════════════════════════════
   Defs SVG compartidos. Van UNA vez en la página (los monta HoverLabView):
   un filtro y un gradiente por instancia serían 24 nodos idénticos, y los
   filtros SVG se referencian por id — duplicarlos es pedir el bug de que dos
   variantes compartan el mismo id sin saberlo.
   ══════════════════════════════════════════════════════════════════════════ */
export function HoverLabDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {/* El filtro gooey clásico: el blur funde las formas vecinas en una
            sola mancha y el feColorMatrix vuelve a endurecer el alpha
            (multiplicar por 19 y restar 9 convierte el degradado del blur en
            un borde otra vez). Sin el segundo paso queda una nube; sin el
            primero, formas sueltas. */}
        {/* La REGIÓN del filtro es lo que casi siempre falta: por defecto es el
            bounding box más un 10%, o sea ~4px arriba y abajo en un botón de
            40px de alto. Las gotas viajan 30px, así que sin ampliarla salen
            recortadas — y el síntoma (gotas que se cortan en seco) no parece
            un problema del filtro. */}
        <filter id="hv-goo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          {/* `atop` recorta la mancha contra el original: sin esto, el blur
              deja un halo fuera de la silueta. */}
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>

        <linearGradient id="hv-ramp" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="var(--cta-lime)" />
          <stop offset="45%" stopColor="var(--cta-mint)" />
          <stop offset="100%" stopColor="var(--cta-deep)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CSS + GSAP
   ══════════════════════════════════════════════════════════════════════════ */

/** 28 · gooey. Cuatro gotas salen de la píldora y vuelven; el filtro SVG las
 *  funde con ella mientras están cerca, así que se ven salir del metal en vez
 *  de aparecer encima.
 *
 *  El label vive FUERA de la capa filtrada — un feGaussianBlur sobre texto de
 *  14px lo convierte en una mancha, y ése es el error que hace que este efecto
 *  se vea mal hecho en la mayoría de los ejemplos que andan dando vuelta. */
const BLOBS = 4;

function CtaGooey() {
  const rootRef = useGsapContext<HTMLSpanElement>((_self, root) => {
    const blobs = gsap.utils.toArray<HTMLElement>(".hv-goo-blob", root);
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ paused: true });
      blobs.forEach((b, i) => {
        // En abanico hacia arriba y a los lados, nunca hacia abajo: abajo está
        // el resto de la barra y la gota se leería como un error de layout.
        const angle = (-150 + i * (120 / (BLOBS - 1))) * (Math.PI / 180);
        const dist = 22 + (i % 2) * 8;
        tl.fromTo(
          b,
          { x: 0, y: 0, scale: 0.2 },
          {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            scale: 1,
            duration: 0.5,
            ease: "back.out(2)",
          },
          i * 0.04
        );
      });

      const play = () => tl.play();
      const back = () => tl.reverse();
      root.addEventListener("pointerenter", play);
      root.addEventListener("pointerleave", back);
      return () => {
        root.removeEventListener("pointerenter", play);
        root.removeEventListener("pointerleave", back);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <span ref={rootRef} className="hv-goo-host">
      <span className="hv-goo-layer" aria-hidden="true">
        <span className="hv-goo-base" />
        {Array.from({ length: BLOBS }, (_, i) => (
          <span key={i} className="hv-goo-blob" />
        ))}
      </span>
      <button type="button" className="hv-cta" data-v="gooey">
        <span className="hv-t">{LABEL}</span>
      </button>
    </span>
  );
}

/** 32 · flip. Dos caras y un giro en X. La cara de atrás dice otra cosa —
 *  usarlo para MOSTRAR ALGO NUEVO ("Launch app") y no para repetir el mismo
 *  label es lo que justifica los 400ms que cuesta.
 *
 *  El eje X y no el Y: el botón es cuatro veces más ancho que alto, y girando
 *  sobre el eje vertical la perspectiva lo deforma muchísimo más. */
function CtaFlip() {
  const rootRef = useGsapContext<HTMLSpanElement>((_self, root) => {
    const inner = root.querySelector<HTMLElement>(".hv-flip-inner");
    if (!inner) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ paused: true }).to(inner, {
        rotateX: -180,
        duration: 0.55,
        ease: "power3.inOut",
      });
      const play = () => tl.play();
      const back = () => tl.reverse();
      root.addEventListener("pointerenter", play);
      root.addEventListener("pointerleave", back);
      return () => {
        root.removeEventListener("pointerenter", play);
        root.removeEventListener("pointerleave", back);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <span ref={rootRef} className="hv-flip-host">
      <span className="hv-flip-inner">
        <button type="button" className="hv-cta hv-flip-face" data-v="flip">
          <span className="hv-t">{LABEL}</span>
        </button>
        {/* La cara de atrás ya está en el DOM y rotada 180°: `backface-
            visibility` esconde la que mira para el otro lado. Para el lector
            de pantalla el botón es uno solo, el de adelante. */}
        <span className="hv-cta hv-flip-face hv-flip-back" aria-hidden="true" data-v="flip-back">
          <span className="hv-t">Launch app ↗</span>
        </span>
      </span>
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   JS + GSAP
   ══════════════════════════════════════════════════════════════════════════ */

/** El contorno como path, con los cuatro lados abombados hacia `(bx, by)`.
 *  Las esquinas quedan fijas y lo que se curva son los lados: abombar también
 *  las esquinas convierte la píldora en una gota y se pierde la lectura de
 *  "botón". */
function jellyPath(w: number, h: number, r: number, bx: number, by: number) {
  return [
    `M ${r} 0`,
    `Q ${w / 2} ${-by} ${w - r} 0`,
    `Q ${w} 0 ${w} ${r}`,
    `Q ${w + bx} ${h / 2} ${w} ${h - r}`,
    `Q ${w} ${h} ${w - r} ${h}`,
    `Q ${w / 2} ${h + by} ${r} ${h}`,
    `Q 0 ${h} 0 ${h - r}`,
    `Q ${-bx} ${h / 2} 0 ${r}`,
    `Q 0 0 ${r} 0`,
    "Z",
  ].join(" ");
}

/** 29 · jelly. El fondo no es una caja de CSS sino un path SVG que se reescribe
 *  en cada frame: el borde se estira hacia el cursor y vuelve con un rebote.
 *
 *  Por qué necesita las dos capas: sólo con JS el retorno sería un lerp que
 *  nunca termina de llegar; sólo con GSAP no habría nada que animar, porque el
 *  valor que hay que interpolar (el bulto) no es una propiedad de CSS sino un
 *  string que se recalcula. GSAP anima un objeto plano y el `onUpdate`
 *  reescribe el `d`. */
function CtaJelly() {
  const rootRef = useGsapContext<HTMLButtonElement>((_self, btn) => {
    const path = btn.querySelector<SVGPathElement>(".hv-jelly path");
    const svg = btn.querySelector<SVGSVGElement>(".hv-jelly");
    if (!path || !svg) return;

    let w = btn.offsetWidth;
    let h = btn.offsetHeight;
    const R = 14;
    const draw = (bx: number, by: number) => {
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      path.setAttribute("d", jellyPath(w, h, R, bx, by));
    };
    draw(0, 0);

    // El path se dibuja en unidades del viewBox, así que un resize del botón
    // (cambiar de columna la grilla, por ejemplo) obliga a rehacerlo.
    const ro = new ResizeObserver(() => {
      w = btn.offsetWidth;
      h = btn.offsetHeight;
      draw(bulge.x, bulge.y);
    });
    ro.observe(btn);

    const bulge = { x: 0, y: 0 };
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const render = () => draw(bulge.x, bulge.y);
      const xTo = gsap.quickTo(bulge, "x", { duration: 0.4, ease: "power3.out", onUpdate: render });
      const yTo = gsap.quickTo(bulge, "y", { duration: 0.4, ease: "power3.out", onUpdate: render });

      let rect: DOMRect | null = null;
      const move = (e: PointerEvent) => {
        if (!rect) rect = btn.getBoundingClientRect();
        xTo((e.clientX - (rect.left + rect.width / 2)) * 0.45);
        yTo((e.clientY - (rect.top + rect.height / 2)) * 0.9);
      };
      const leave = () => {
        rect = null;
        // El rebote es del BORDE, no del botón: la caja nunca se mueve, así
        // que nada de esto empuja a la hamburguesa de al lado.
        gsap.to(bulge, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.32)",
          onUpdate: render,
          overwrite: true,
        });
      };

      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerleave", leave);
      return () => {
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerleave", leave);
      };
    });

    return () => {
      ro.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <button ref={rootRef} type="button" className="hv-cta" data-v="jelly">
      <svg className="hv-jelly" aria-hidden="true" preserveAspectRatio="none">
        <path fill="url(#hv-ramp)" />
      </svg>
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/** 33 · inercia. El botón se deforma según la VELOCIDAD del puntero, no según
 *  su posición: entrar despacio casi no lo altera y cruzarlo de un golpe lo
 *  estira. Es la variante que más "material" se siente de las 39, y la que más
 *  fácil se pasa de rosca — el clamp a 9° y 1.06 de escala está puesto después
 *  de probar valores que se veían de dibujo animado.
 *
 *  JS mide (dx/dt entre dos pointermove), GSAP amortigua. Sin la amortiguación
 *  el skew copiaría el ruido del puntero y temblaría. */
const SKEW_MAX = 9;

function CtaInertia() {
  const rootRef = useGsapContext<HTMLButtonElement>((_self, btn) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const skewTo = gsap.quickTo(btn, "skewX", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
      const sxTo = gsap.quickTo(btn, "scaleX", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
      const syTo = gsap.quickTo(btn, "scaleY", { duration: 0.5, ease: "elastic.out(1, 0.5)" });

      let lastX = 0;
      let lastT = 0;

      const move = (e: PointerEvent) => {
        // `e.timeStamp` en vez de un reloj propio: es el instante real del
        // evento, no el momento en que el handler llegó a correr.
        const dt = Math.max(e.timeStamp - lastT, 1);
        const vx = (e.clientX - lastX) / dt; // px por ms
        lastX = e.clientX;
        lastT = e.timeStamp;

        const k = gsap.utils.clamp(-1, 1, vx / 2.2);
        skewTo(-k * SKEW_MAX);
        sxTo(1 + Math.abs(k) * 0.06);
        syTo(1 - Math.abs(k) * 0.06); // el volumen se conserva
      };

      const leave = () => {
        gsap.to(btn, {
          skewX: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.9,
          ease: "elastic.out(1, 0.4)",
          overwrite: true,
        });
      };

      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerleave", leave);
      return () => {
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <button ref={rootRef} type="button" className="hv-cta" data-v="inertia">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   CSS + JS + GSAP
   ══════════════════════════════════════════════════════════════════════════ */

/** 30 · iris dirigido. El relleno crece como un círculo desde el punto exacto
 *  donde entró el puntero, y se retira hacia donde salió.
 *
 *  Las tres capas, cada una en lo suyo: CSS declara el `clip-path: circle()` y
 *  las dos capas de label, JS aporta el punto de entrada, GSAP anima el radio
 *  con una curva que desacelera fuerte. El radio va en una custom property
 *  registrada con `@property`, que es lo que permite que GSAP la interpole
 *  como número en vez de como string. */
function CtaCursorIris() {
  const rootRef = useGsapContext<HTMLButtonElement>((_self, btn) => {
    const mm = gsap.matchMedia();

    mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (mmCtx) => {
      const { reduce } = mmCtx.conditions as { motion: boolean; reduce: boolean };

      const at = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        btn.style.setProperty("--cx", `${x}px`);
        btn.style.setProperty("--cy", `${y}px`);
        // El radio que cubre la esquina más lejana desde ese punto.
        return Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
      };

      const enter = (e: PointerEvent) => {
        const target = at(e);
        gsap.to(btn, {
          "--cr": `${target}px`,
          duration: reduce ? 0 : 0.55,
          ease: "power3.out",
          overwrite: true,
        });
      };
      const leave = (e: PointerEvent) => {
        at(e); // el círculo se cierra hacia el punto de salida, no hacia el centro
        gsap.to(btn, {
          "--cr": "0px",
          duration: reduce ? 0 : 0.4,
          ease: "power3.in",
          overwrite: true,
        });
      };

      btn.addEventListener("pointerenter", enter);
      btn.addEventListener("pointerleave", leave);
      return () => {
        btn.removeEventListener("pointerenter", enter);
        btn.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <button ref={rootRef} type="button" className="hv-cta" data-v="cursor-iris">
      <span className="hv-t">{LABEL}</span>
      <span className="hv-fill" aria-hidden="true" />
      <span className="hv-t-top" aria-hidden="true">
        {LABEL}
      </span>
    </button>
  );
}

/** 31 · blend. Una mancha lime persigue al cursor por dentro del botón y el
 *  label, en `mix-blend-mode: difference`, se INVIERTE donde la mancha pasa
 *  por debajo. Un solo label, sin capas duplicadas ni clips: el modo de fusión
 *  hace el trabajo que en la variante 02 hacían dos copias sincronizadas.
 *
 *  El precio es que difference obliga a que el fondo del botón sea un color
 *  plano y conocido — sobre un gradiente, el texto invertido cambia de tono a
 *  lo largo de la palabra. Por eso el reposo acá es gris y no la rampa. */
function CtaBlendBlob() {
  const rootRef = useGsapContext<HTMLButtonElement>((_self, btn) => {
    const blob = btn.querySelector<HTMLElement>(".hv-blob");
    if (!blob) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const xTo = gsap.quickTo(blob, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(blob, "y", { duration: 0.35, ease: "power3.out" });

      let rect: DOMRect | null = null;
      const enter = (e: PointerEvent) => {
        rect = btn.getBoundingClientRect();
        // Sin tween en la entrada: la mancha tiene que APARECER bajo el
        // cursor, no viajar desde donde quedó la última vez.
        gsap.set(blob, { x: e.clientX - rect.left, y: e.clientY - rect.top });
        gsap.to(blob, { scale: 1, duration: 0.4, ease: "back.out(1.6)", overwrite: true });
      };
      const move = (e: PointerEvent) => {
        if (!rect) rect = btn.getBoundingClientRect();
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
      };
      const leave = () => {
        rect = null;
        gsap.to(blob, { scale: 0, duration: 0.3, ease: "power2.in", overwrite: true });
      };

      btn.addEventListener("pointerenter", enter);
      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerleave", leave);
      return () => {
        btn.removeEventListener("pointerenter", enter);
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerleave", leave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <button ref={rootRef} type="button" className="hv-cta" data-v="blend">
      <span className="hv-blob" aria-hidden="true" />
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   WebGL
   ══════════════════════════════════════════════════════════════════════════ */

/** 34 · flujo. Ruido fbm coloreado con la rampa de marca, corriendo despacio.
 *  El hover no lo enciende: lo acelera y le sube el contraste. Es la variante
 *  con shader más defendible para un header real — el reposo CSS es el mismo
 *  gradiente, así que quien no tenga WebGL no se entera de nada. */
function CtaGlMesh() {
  const ref = useGlHover<HTMLButtonElement>({ shader: "glMesh", radius: 14 });
  return (
    <button ref={ref} type="button" className="hv-cta" data-v="gl-mesh">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/** 35 · ondas. El puntero deja ondas concéntricas que deforman la rampa y se
 *  amortiguan con la distancia. La amortiguación exponencial es todo: sin
 *  ella se ve una diana de tiro, con ella se ve un impacto en un líquido. */
function CtaGlRipple() {
  const ref = useGlHover<HTMLButtonElement>({ shader: "glRipple", radius: 14 });
  return (
    <button ref={ref} type="button" className="hv-cta" data-v="gl-ripple">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/** 36 · disolución. El botón se MATERIALIZA desde el ruido en vez de rellenarse:
 *  el umbral sube con el hover y la franja del frente se calienta al lime.
 *  Es el único con alpha real — en reposo el botón está vacío, y ese contraste
 *  es justamente lo que lo hace funcionar. */
function CtaGlDissolve() {
  const ref = useGlHover<HTMLButtonElement>({
    shader: "glDissolve",
    radius: 14,
    // Entrada lenta y salida rápida: materializarse cuesta, desvanecerse no.
    inVars: { duration: 0.7, ease: "power2.inOut" },
    outVars: { duration: 0.28, ease: "power2.in" },
  });
  return (
    <button ref={ref} type="button" className="hv-cta" data-v="gl-dissolve">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/** 37 · contorno vivo. El SDF del rectángulo redondeado dibuja la línea con el
 *  radio EXACTO del botón —14px, el mismo token que el CSS— y una banda la
 *  recorre. Comparar con la 27 (`gsap-draw`, el mismo gesto con
 *  stroke-dasharray) es el punto: el trazo SVG se dibuja una vez, éste vive. */
function CtaGlBorder() {
  const ref = useGlHover<HTMLButtonElement>({ shader: "glBorder", radius: 14, z: 1 });
  return (
    <button ref={ref} type="button" className="hv-cta" data-v="gl-border">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/** 38 · el label como líquido. El texto se rasteriza a una textura con la
 *  MISMA fuente que el DOM y el shader lo desplaza con ruido. Replicar la
 *  tipografía a mano es donde este efecto se delata siempre; acá la fuente sale
 *  de `getComputedStyle`, así que el cambio del texto real al del shader no se
 *  ve.
 *
 *  El label del DOM se oculta sólo si la textura se pudo generar — sin
 *  WebGL, o con la fuente todavía cargando, el botón se queda como estaba. */
function CtaGlText() {
  const labelRef = useRef<HTMLSpanElement>(null);

  const ref = useGlHover<HTMLButtonElement>({
    shader: "glText",
    radius: 14,
    inVars: { duration: 0.6, ease: "power2.out" },
    onEnter: (_state, host) => {
      const gl = getSharedGL();
      const label = labelRef.current;
      if (!gl || !label) return;
      const tex = textTexture(label, host.offsetWidth, host.offsetHeight);
      if (!tex) return;
      gl.setTexture(tex);
      gsap.to(label, { opacity: 0, duration: 0.14, overwrite: true });
    },
  });

  // El label se restaura en el `pointerleave` del propio elemento y NO en el
  // `onLeave` del hook, que corre al terminar el fundido. La diferencia importa
  // en un caso concreto y muy fácil de provocar en esta página: si el puntero
  // salta directo a otra variante con shader, el tween de salida se sobreescribe
  // y su `onComplete` no llega nunca — el label quedaría invisible para siempre.
  const restore = () => {
    const label = labelRef.current;
    if (label) gsap.to(label, { opacity: 1, duration: 0.14, overwrite: true });
  };

  return (
    <button ref={ref} type="button" className="hv-cta" data-v="gl-text" onPointerLeave={restore}>
      <span className="hv-t" ref={labelRef}>
        {LABEL}
      </span>
    </button>
  );
}

/** 39 · las cuatro capas a la vez, para tener el techo del rango a la vista:
 *  CSS pone el reposo, JS la posición del puntero, GSAP el imán y su rebote,
 *  WebGL una cáustica con foco que sigue al cursor.
 *
 *  Es defendible en la landing de una campaña. En el header permanente de un
 *  sitio de producto, casi seguro no: son cuatro sistemas que hay que mantener
 *  sincronizados para un botón que la gente ve doscientas veces por semana. La
 *  variante existe para poder decir eso con el mouse encima y no en abstracto. */
function CtaGlStack() {
  const glRef = useGlHover<HTMLButtonElement>({ shader: "glStack", radius: 14 });

  // El imán es un efecto aparte SOBRE el mismo nodo. Se puede: `useGlHover`
  // sólo escucha eventos y escribe uniforms, y esto sólo anima el transform.
  // Lo que no se puede es que dos capas animen la MISMA propiedad.
  const magnetRef = useGsapContext<HTMLButtonElement>((_self, btn) => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      let rect: DOMRect | null = null;

      const move = (e: PointerEvent) => {
        if (!rect) rect = btn.getBoundingClientRect();
        xTo((e.clientX - (rect.left + rect.width / 2)) * 0.18);
        yTo((e.clientY - (rect.top + rect.height / 2)) * 0.28);
      };
      const leave = () => {
        rect = null;
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.45)", overwrite: true });
      };

      btn.addEventListener("pointermove", move);
      btn.addEventListener("pointerleave", leave);
      return () => {
        btn.removeEventListener("pointermove", move);
        btn.removeEventListener("pointerleave", leave);
      };
    });
    return () => mm.revert();
  }, []);

  // Dos hooks, un nodo: el callback ref reparte la referencia a los dos.
  const setRefs = (el: HTMLButtonElement | null) => {
    glRef.current = el;
    magnetRef.current = el;
  };

  return (
    <button ref={setRefs} type="button" className="hv-cta" data-v="gl-stack">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/* ── El catálogo de la segunda tanda ──────────────────────────────────────
   Sigue la numeración de las 27 primeras: la 28 es la 28 en la página. */

export const CTA_VARIANTS_PLUS: CtaVariant[] = [
  {
    id: "gooey",
    name: "Gooey blobs",
    stack: ["CSS", "GSAP"],
    note: "Gotas que salen de la píldora y se funden con ella (filtro SVG). El label va fuera de la capa filtrada: un blur sobre texto de 14px lo destruye.",
    Comp: CtaGooey,
  },
  {
    id: "jelly",
    name: "Jelly path",
    stack: ["JS", "GSAP"],
    note: "El fondo es un path SVG que se reescribe por frame: el borde se estira hacia el cursor y rebota. La CAJA nunca se mueve, así que el nav no se reacomoda.",
    Comp: CtaJelly,
  },
  {
    id: "cursor-iris",
    name: "Cursor iris",
    stack: ["CSS", "JS", "GSAP"],
    note: "El relleno crece desde el punto exacto de entrada y se cierra hacia el de salida. CSS declara el clip, JS da el punto, GSAP el radio (vía @property).",
    Comp: CtaCursorIris,
  },
  {
    id: "blend",
    name: "Blend blob",
    stack: ["CSS", "JS", "GSAP"],
    note: "Una mancha persigue al cursor y el label se invierte por mix-blend-mode. Un solo label, sin capas duplicadas — a cambio el reposo tiene que ser color plano.",
    Comp: CtaBlendBlob,
  },
  {
    id: "flip",
    name: "3D flip",
    stack: ["CSS", "GSAP"],
    note: "Gira en X y muestra otra cosa detrás. Vale los 550ms sólo si la cara de atrás dice algo nuevo; repetir el mismo label sería puro adorno.",
    Comp: CtaFlip,
  },
  {
    id: "inertia",
    name: "Velocity inertia",
    stack: ["JS", "GSAP"],
    note: "Se deforma según la VELOCIDAD del puntero, no su posición: entrar despacio casi no lo altera. Lo más material de las 39, y lo más fácil de pasarse.",
    Comp: CtaInertia,
  },
  {
    id: "gl-mesh",
    name: "Shader flow",
    stack: ["GSAP", "WebGL"],
    note: "Ruido fbm con la rampa de marca. El hover acelera y contrasta lo que ya estaba pasando. La más defendible de las de shader: sin WebGL, el reposo CSS es idéntico.",
    Comp: CtaGlMesh,
  },
  {
    id: "gl-ripple",
    name: "Shader ripple",
    stack: ["GSAP", "WebGL"],
    note: "Ondas amortiguadas desde el puntero. La amortiguación exponencial es todo el efecto: sin ella se ve una diana, con ella un impacto en líquido.",
    Comp: CtaGlRipple,
  },
  {
    id: "gl-dissolve",
    name: "Shader dissolve",
    stack: ["GSAP", "WebGL"],
    note: "El botón se materializa desde el ruido con el frente caliente. Entrada lenta, salida rápida: materializarse cuesta, desvanecerse no.",
    Comp: CtaGlDissolve,
  },
  {
    id: "gl-border",
    name: "SDF border",
    stack: ["CSS", "WebGL"],
    note: "El contorno dibujado con la distancia con signo al rectángulo redondeado, con una banda que lo recorre. Comparar con la 27: aquel trazo se dibuja, éste vive.",
    Comp: CtaGlBorder,
  },
  {
    id: "gl-text",
    name: "Liquid label",
    stack: ["JS", "WebGL"],
    note: "El texto se rasteriza con la misma fuente del DOM y el shader lo distorsiona. La fuente sale de getComputedStyle: replicarla a mano es donde el efecto se delata.",
    Comp: CtaGlText,
  },
  {
    id: "gl-stack",
    name: "Full stack",
    stack: ["CSS", "JS", "GSAP", "WebGL"],
    note: "Las cuatro capas a la vez: reposo CSS, puntero en JS, imán y rebote en GSAP, cáustica con foco en el shader. El techo del rango — defendible en campaña, difícil en un header permanente.",
    Comp: CtaGlStack,
  },
];
