"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useReducedMotion } from "./useReducedMotion";

// Las 27 variantes de hover del CTA del header, para la demo de /prototype/hover-lab.
//
// NO son componentes del sistema: el botón real vive en
// `components/site/SiteHeader.tsx` y usa `[data-q-cta-sweep]` de globals.css.
// Acá cada variante es lo más chica posible — un botón, un gesto — para que la
// comparación sea entre gestos y no entre implementaciones.
//
// El reparto de tecnología es el punto de la demo:
//
//   CSS       — el hover entero cabe en una regla. Si el gesto se puede hacer
//               así, se hace así: cero JS, cero riesgo de quedar pegado, y
//               `prefers-reduced-motion` se atiende con una media query.
//   CSS + JS  — el CSS anima, el JS sólo dice DÓNDE está el puntero (custom
//               properties). Sigue sin haber un rAF corriendo.
//   JS        — hace falta un loop o tocar el contenido (imán, ripple,
//               scramble). Web Animations API o rAF, sin librería.
//   GSAP      — hace falta una curva, un stagger o una timeline reversible que
//               CSS no puede expresar. Es el escalón más caro; entra sólo
//               cuando el gesto lo justifica.

export type Tech = "CSS" | "CSS + JS" | "JS" | "GSAP";

export type CtaVariant = {
  id: string;
  name: string;
  tech: Tech;
  /** Qué hace y, sobre todo, cuándo elegirlo. */
  note: string;
  Comp: () => ReactNode;
};

const LABEL = "Get started";

/** El botón de las variantes que no necesitan más marcado que su label. */
function Cta({ v, children }: { v: string; children?: ReactNode }) {
  return (
    <button type="button" className="hv-cta" data-v={v}>
      <span className="hv-t">{children ?? LABEL}</span>
    </button>
  );
}

/* ── CSS puro ──────────────────────────────────────────────────────────── */

/** El label en dos capas: la de abajo clara, la de arriba negra y recortada al
 *  ritmo del relleno. Es lo que hace que el texto cambie de color POR DONDE ya
 *  pasó el verde, en vez de saltar entero a mitad de camino. */
function CtaWipe() {
  return (
    <button type="button" className="hv-cta" data-v="wipe">
      <span className="hv-t">{LABEL}</span>
      <span className="hv-t-top" aria-hidden="true">
        {LABEL}
      </span>
    </button>
  );
}

function CtaRoll() {
  return (
    <button type="button" className="hv-cta" data-v="roll">
      <span className="hv-t">
        <span className="hv-roll">
          <span>{LABEL}</span>
          {/* La copia es decorativa: para un lector de pantalla el botón dice
              su label una sola vez. */}
          <span aria-hidden="true">{LABEL}</span>
        </span>
      </span>
    </button>
  );
}

function CtaArrow() {
  return (
    <button type="button" className="hv-cta" data-v="arrow">
      <span className="hv-t">{LABEL}</span>
      <span className="hv-arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

/* ── CSS + JS ──────────────────────────────────────────────────────────── */

/** 17 · spotlight. El pointermove escribe dos custom properties y nada más:
 *  el halo, su opacidad y su curva son CSS. */
function CtaSpotlight() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      // `offsetX/Y` y no un getBoundingClientRect por evento: el botón no se
      // mueve en esta variante, así que el offset relativo al target ya es la
      // respuesta y no cuesta un reflow.
      el.style.setProperty("--mx", `${e.offsetX}px`);
      el.style.setProperty("--my", `${e.offsetY}px`);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <button ref={ref} type="button" className="hv-cta" data-v="spotlight">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/** El borde por el que el puntero cruzó la caja. Con el punto normalizado a
 *  (−0.5, 0.5) en los dos ejes, el eje dominante es el del cruce. */
function edgeOf(e: PointerEvent, el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  if (Math.abs(x) > Math.abs(y)) return x > 0 ? "right" : "left";
  return y > 0 ? "bottom" : "top";
}

const EDGE_OFFSET = {
  left: ["-100%", "0%"],
  right: ["100%", "0%"],
  top: ["0%", "-100%"],
  bottom: ["0%", "100%"],
} as const;

/** 18 · direction. El relleno entra y SALE por donde pasó el puntero. */
function CtaDirection() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const place = (e: PointerEvent) => {
      const [sx, sy] = EDGE_OFFSET[edgeOf(e, el)];
      // Reposicionar la capa SIN transición, o el navegador interpolaría desde
      // el lado anterior a la vez que el `:hover` la trae al centro — y el
      // relleno entraría en diagonal desde un punto que no tocó nadie.
      el.dataset.nt = "1";
      el.style.setProperty("--sx", sx);
      el.style.setProperty("--sy", sy);
      void el.offsetWidth; // fuerza el reflow que confirma el salto
      delete el.dataset.nt;
    };

    el.addEventListener("pointerenter", place);
    el.addEventListener("pointerleave", place);
    return () => {
      el.removeEventListener("pointerenter", place);
      el.removeEventListener("pointerleave", place);
    };
  }, []);

  return (
    <button ref={ref} type="button" className="hv-cta" data-v="direction">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/** 19 · tilt. Máximo 7° — más que eso y en un botón de 40px de alto el texto
 *  empieza a verse borroso por el escorzo. */
const TILT_MAX = 7;

function CtaTilt() {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      // Signo invertido en X: el borde que se acerca al puntero es el que baja.
      el.style.setProperty("--rx", `${-py * TILT_MAX * 2}deg`);
      el.style.setProperty("--ry", `${px * TILT_MAX * 2}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <span className="hv-tilt-host">
      <button ref={ref} type="button" className="hv-cta" data-v="tilt">
        <span className="hv-t">{LABEL}</span>
      </button>
    </span>
  );
}

/* ── JS puro ───────────────────────────────────────────────────────────── */

/** 20 · magnetic, a mano. Un lerp en rAF que se apaga solo al llegar: mientras
 *  el botón está quieto no hay frame agendado, que es la diferencia entre esto
 *  y un rAF infinito escuchando por las dudas.
 *
 *  El rect se mide sobre el WRAPPER, que nunca se transforma. Midiendo el
 *  propio botón, cada frame leería una posición ya desplazada y el imán se
 *  perseguiría a sí mismo hasta el borde de la pantalla. */
const MAGNET_PULL = 0.34;
const MAGNET_EASE = 0.16;

function CtaMagnetic() {
  const hostRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const el = btnRef.current;
    if (!host || !el || reduced) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const tick = () => {
      cx += (tx - cx) * MAGNET_EASE;
      cy += (ty - cy) * MAGNET_EASE;
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        el.style.transform = `translate(${tx}px, ${ty}px)`;
        raf = 0;
      }
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * MAGNET_PULL;
      ty = (e.clientY - (r.top + r.height / 2)) * MAGNET_PULL;
      wake();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      wake();
    };

    // El listener va en el HOST y no en el botón: con un área de captura del
    // tamaño exacto del botón, el imán sólo puede tirar hacia adentro y el
    // gesto no se siente. El host tiene padding, así que atrae desde afuera.
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
    };
  }, [reduced]);

  return (
    <span ref={hostRef} className="hv-magnet-host">
      <button ref={btnRef} type="button" className="hv-cta" data-v="magnetic">
        <span className="hv-t">{LABEL}</span>
      </button>
    </span>
  );
}

/** 21 · ripple con Web Animations API. Nace en el punto de entrada y crece
 *  hasta cubrir la esquina más lejana; al salir se desvanece en su sitio en
 *  vez de contraerse, que es lo que se ve natural cuando el puntero ya se
 *  fue. */
function CtaRipple() {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let node: HTMLSpanElement | null = null;

    const onEnter = (e: PointerEvent) => {
      node?.remove();
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // El radio que cubre la esquina más lejana desde el punto de entrada.
      const radius = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));

      node = document.createElement("span");
      node.className = "hv-ripple";
      node.style.left = `${x - radius}px`;
      node.style.top = `${y - radius}px`;
      node.style.width = node.style.height = `${radius * 2}px`;
      el.appendChild(node);

      node.animate(
        [{ transform: "scale(0)" }, { transform: "scale(1)" }],
        { duration: reduced ? 0 : 420, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
      );
    };

    const onLeave = () => {
      const dying = node;
      node = null;
      if (!dying) return;
      const a = dying.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: reduced ? 0 : 260,
        easing: "ease-out",
        fill: "forwards",
      });
      a.onfinish = () => dying.remove();
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      node?.remove();
    };
  }, [reduced]);

  return (
    <button ref={ref} type="button" className="hv-cta" data-v="ripple">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/** 22 · scramble. Los caracteres se resuelven de izquierda a derecha; los que
 *  faltan rotan sobre un charset. Dos cuidados que separan un scramble bueno
 *  de uno barato: los ESPACIOS nunca se scramblean (el ojo pierde la forma de
 *  la palabra) y el ancho está fijado por `tabular-nums` en el CSS. */
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*";
const SCRAMBLE_STEP = 38; // ms por frame — a 16ms parece ruido, no texto

function CtaScramble() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let raf = 0;
    let t0 = 0;
    const total = LABEL.length;

    const frame = (now: number) => {
      if (!t0) t0 = now;
      // Cuántas letras ya están resueltas, y una tirada nueva para el resto.
      const settled = Math.floor((now - t0) / SCRAMBLE_STEP);
      if (settled >= total) {
        el.textContent = LABEL;
        raf = 0;
        return;
      }
      el.textContent = LABEL.split("")
        .map((ch, i) =>
          i < settled || ch === " " ? ch : CHARSET[(Math.random() * CHARSET.length) | 0]
        )
        .join("");
      raf = requestAnimationFrame(frame);
    };

    const onEnter = () => {
      cancelAnimationFrame(raf);
      t0 = 0;
      raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      el.textContent = LABEL;
    };

    const btn = el.closest("button")!;
    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
      el.textContent = LABEL;
    };
  }, [reduced]);

  return (
    <button type="button" className="hv-cta" data-v="scramble">
      {/* El label accesible es el `aria-label`: mientras el scramble corre, el
          textContent es basura y un lector de pantalla la leería. */}
      <span className="hv-t" ref={ref} aria-hidden="true">
        {LABEL}
      </span>
      <span className="sr-only">{LABEL}</span>
    </button>
  );
}

/* ── GSAP ──────────────────────────────────────────────────────────────── */

/** 23 · el mismo imán, con `quickTo`. Dos diferencias con la versión a mano:
 *  la interpolación es una curva de duración fija (no un lerp, que nunca
 *  llega del todo) y el LABEL se mueve a la mitad de la velocidad del botón,
 *  que es el paralaje que hace que se sienta un objeto con masa. */
function CtaGsapMagnet() {
  const hostRef = useGsapContext<HTMLSpanElement>((_self, host) => {
    const btn = host.querySelector<HTMLElement>(".hv-cta");
    const label = host.querySelector<HTMLElement>(".hv-t");
    if (!btn || !label) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, (mmCtx) => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      const lxTo = gsap.quickTo(label, "x", { duration: 0.6, ease: "power3.out" });
      const lyTo = gsap.quickTo(label, "y", { duration: 0.6, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        // Los `quickTo` ya se crearon dentro del contexto, así que sus tweens
        // se revierten con él aunque los dispare un evento de después.
        xTo(dx * 0.34);
        yTo(dy * 0.34);
        lxTo(dx * 0.16);
        lyTo(dy * 0.16);
      };

      // El de la vuelta sí crea un tween nuevo por evento, así que se registra
      // EN el contexto (`ctx.add(nombre, fn)`) — el equivalente tipado del
      // `contextSafe` de @gsap/react. Sin esto, el rebote disparado por el
      // último pointerleave antes de desmontar sobrevive al componente.
      const onLeave = mmCtx.add("onLeave", () => {
        // `elastic` sólo en la vuelta: el retorno es el momento en que el botón
        // "se suelta", y ahí un rebote corto lee como material, no como truco.
        gsap.to([btn, label], { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
      }) as () => void;

      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      return () => {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <span ref={hostRef} className="hv-magnet-host">
      <button type="button" className="hv-cta" data-v="gsap-magnet">
        <span className="hv-t">{LABEL}</span>
      </button>
    </span>
  );
}

/** 24 · SplitText por caracteres: la línea vieja sale hacia arriba mientras la
 *  nueva entra desde abajo, letra por letra con solape. Es el gesto que MÁS
 *  gana con GSAP: los mismos 11 caracteres en CSS serían 11 `transition-delay`
 *  a mano y no habría forma de revertirlos a media animación.
 *
 *  La timeline se crea PAUSADA una vez y el hover sólo hace play/reverse — así
 *  entrar y salir rápido no encola animaciones, retoma la misma desde donde
 *  estaba. */
function CtaGsapChars() {
  const rootRef = useGsapContext<HTMLButtonElement>((_self, btn) => {
    const a = btn.querySelector<HTMLElement>(".hv-t");
    const b = btn.querySelector<HTMLElement>(".hv-t-clone");
    if (!a || !b) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const splitA = new SplitText(a, { type: "chars" });
      const splitB = new SplitText(b, { type: "chars" });

      gsap.set(splitB.chars, { yPercent: 100 });

      const tl = gsap
        .timeline({ paused: true, defaults: { ease: "power3.inOut", duration: 0.42 } })
        .to(splitA.chars, { yPercent: -100, stagger: 0.022 }, 0)
        .to(splitB.chars, { yPercent: 0, stagger: 0.022 }, 0.04);

      const play = () => tl.play();
      const back = () => tl.reverse();
      btn.addEventListener("pointerenter", play);
      btn.addEventListener("pointerleave", back);

      return () => {
        btn.removeEventListener("pointerenter", play);
        btn.removeEventListener("pointerleave", back);
        // `revert()` de SplitText devuelve el texto a un solo nodo. Sin esto,
        // en dev (StrictMode monta dos veces) el segundo split partiría spans
        // ya partidos.
        splitA.revert();
        splitB.revert();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <button ref={rootRef} type="button" className="hv-cta" data-v="gsap-chars">
      {/* La caja que recorta es la de la LÍNEA, no la del botón — ver la regla
          de `.hv-rollbox` en hoverLab.css. */}
      <span className="hv-rollbox">
        <span className="hv-t">{LABEL}</span>
        <span className="hv-t hv-t-clone" aria-hidden="true">
          {LABEL}
        </span>
      </span>
    </button>
  );
}

/** 25 · squash & stretch. El principio de animación más viejo que hay: al
 *  entrar se estira en el eje del movimiento y se comprime en el otro, y al
 *  volver rebota. El volumen se mantiene (1.06 × 0.94 ≈ 1), que es lo que
 *  evita que se lea como un simple `scale`. */
function CtaGsapSquash() {
  const rootRef = useGsapContext<HTMLButtonElement>((_self, btn) => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const tl = gsap
        .timeline({ paused: true })
        .to(btn, { scaleX: 1.06, scaleY: 0.94, duration: 0.16, ease: "power2.out" })
        .to(btn, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.42)" })
        // La luz viaja en paralelo al squash, no después: son un mismo evento.
        .to(btn, { backgroundPosition: "0% center", duration: 0.5, ease: "power2.out" }, 0);

      const play = () => tl.play();
      const back = () => tl.reverse();
      btn.addEventListener("pointerenter", play);
      btn.addEventListener("pointerleave", back);
      return () => {
        btn.removeEventListener("pointerenter", play);
        btn.removeEventListener("pointerleave", back);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <button ref={rootRef} type="button" className="hv-cta" data-v="gsap-squash">
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/** 26 · chispas. Ocho partículas que salen del centro en abanico. Es el
 *  extremo celebratorio del rango — sirve para un "Claim" o un "Mint", casi
 *  seguro NO para el CTA permanente de un header, y está acá justamente para
 *  poder decir eso mirándolo. */
const SPARKS = 8;

function CtaGsapSparks() {
  const rootRef = useGsapContext<HTMLButtonElement>((_self, btn) => {
    const dots = gsap.utils.toArray<HTMLElement>(".hv-spark", btn);
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, (mmCtx) => {
      const burst = mmCtx.add("burst", () => {
        dots.forEach((dot, i) => {
          // Abanico hacia arriba, con la aleatoriedad justa para que dos
          // hovers seguidos no se vean calcados.
          const angle = (-160 + (i / (SPARKS - 1)) * 140 + gsap.utils.random(-8, 8)) * (Math.PI / 180);
          const dist = gsap.utils.random(26, 46);
          gsap.fromTo(
            dot,
            { x: 0, y: 0, opacity: 1, scale: gsap.utils.random(0.6, 1.2) },
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0,
              duration: gsap.utils.random(0.5, 0.8),
              ease: "power2.out",
              overwrite: true,
            }
          );
        });
      }) as () => void;

      btn.addEventListener("pointerenter", burst);
      return () => btn.removeEventListener("pointerenter", burst);
    });

    return () => mm.revert();
  }, []);

  return (
    <button ref={rootRef} type="button" className="hv-cta" data-v="gsap-sparks">
      <span className="hv-t">{LABEL}</span>
      {Array.from({ length: SPARKS }, (_, i) => (
        <span key={i} className="hv-spark" aria-hidden="true" />
      ))}
    </button>
  );
}

/** 27 · el contorno se dibuja. Un rect SVG con `stroke-dasharray` igual a su
 *  perímetro y el offset animado a 0. El largo se MIDE con getTotalLength() en
 *  vez de calcularlo: el perímetro de un rect redondeado no es 2(w+h), hay que
 *  descontar las esquinas, y el navegador ya sabe la respuesta. */
function CtaGsapDraw() {
  const rootRef = useGsapContext<HTMLButtonElement>((_self, btn) => {
    const rect = btn.querySelector<SVGRectElement>("rect");
    if (!rect) return;

    const len = rect.getTotalLength();
    gsap.set(rect, { strokeDasharray: len, strokeDashoffset: len });

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const tl = gsap
        .timeline({ paused: true })
        .to(rect, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" });

      const play = () => tl.play();
      const back = () => tl.reverse();
      btn.addEventListener("pointerenter", play);
      btn.addEventListener("pointerleave", back);
      return () => {
        btn.removeEventListener("pointerenter", play);
        btn.removeEventListener("pointerleave", back);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <button ref={rootRef} type="button" className="hv-cta" data-v="gsap-draw">
      <svg className="hv-draw" aria-hidden="true">
        <defs>
          <linearGradient id="hv-draw-ramp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--cta-lime)" />
            <stop offset="50%" stopColor="var(--cta-mint)" />
            <stop offset="100%" stopColor="var(--cta-deep)" />
          </linearGradient>
        </defs>
        {/* Porcentajes y no `calc()`: como ATRIBUTO, `width` sólo acepta un
            <length> de SVG, así que un calc quedaría ignorado en silencio. El
            trazo va centrado sobre el borde (0.75px hacia afuera) y por eso el
            SVG lleva `overflow: visible` — sobre la barra negra no se nota. */}
        <rect x="0" y="0" width="100%" height="100%" rx="14" />
      </svg>
      <span className="hv-t">{LABEL}</span>
    </button>
  );
}

/* ── El catálogo ───────────────────────────────────────────────────────── */

export const CTA_VARIANTS: CtaVariant[] = [
  {
    id: "sweep",
    name: "Sweep",
    tech: "CSS",
    note: "Lo que hay hoy en producción. Gradiente desde el reposo; el hover mueve la luz en vez de revelar algo. Línea de base para comparar todo lo demás.",
    Comp: () => <Cta v="sweep" />,
  },
  {
    id: "wipe",
    name: "Wipe",
    tech: "CSS",
    note: "El relleno entra desde la izquierda y el label cambia de color al mismo ritmo (dos capas clipeadas). El gesto del CTA de las secciones, a escala de nav.",
    Comp: CtaWipe,
  },
  {
    id: "diagonal",
    name: "Diagonal",
    tech: "CSS",
    note: "Mismo wipe con el corte inclinado 18°. Más rápido de leer que el recto porque el ojo sigue la punta de la diagonal.",
    Comp: () => <Cta v="diagonal" />,
  },
  {
    id: "iris",
    name: "Iris",
    tech: "CSS",
    note: "Crece desde el centro, donde estaría el click. El más 'botón' de todos, y el más lento en llegar a las esquinas.",
    Comp: () => <Cta v="iris" />,
  },
  {
    id: "roll",
    name: "Label roll",
    tech: "CSS",
    note: "El texto rueda y entra su copia. Sin color de por medio: sirve cuando el verde ya se usa en otro lado de la barra.",
    Comp: CtaRoll,
  },
  {
    id: "conic",
    name: "Conic ring",
    tech: "CSS",
    note: "Un anillo de gradiente que gira. Necesita @property para poder interpolar el ángulo; sin eso sería un salto.",
    Comp: () => <Cta v="conic" />,
  },
  {
    id: "glow",
    name: "Lift + glow",
    tech: "CSS",
    note: "1.5px de elevación y un halo. La opción conservadora: no compite con los cuatro tabs, la hamburguesa y el wordmark que ya viven en la barra.",
    Comp: () => <Cta v="glow" />,
  },
  {
    id: "press",
    name: "Press",
    tech: "CSS",
    note: "Hover mínimo, :active protagonista. La única de la tanda que dice algo en pantallas táctiles, donde :hover no existe.",
    Comp: () => <Cta v="press" />,
  },
  {
    id: "shine",
    name: "Shine",
    tech: "CSS",
    note: "Banda especular que cruza una vez. En loop sería un anuncio; disparada por el hover es una respuesta.",
    Comp: () => <Cta v="shine" />,
  },
  {
    id: "stripes",
    name: "Stripes",
    tech: "CSS",
    note: "Barras de la rampa que barren el botón. La única con textura — aguanta porque la barra es negra y lisa.",
    Comp: () => <Cta v="stripes" />,
  },
  {
    id: "shutter",
    name: "Shutter",
    tech: "CSS",
    note: "Dos mitades que cierran sobre el centro. Lectura mecánica, del mismo vocabulario que el arte isométrico de la home.",
    Comp: () => <Cta v="shutter" />,
  },
  {
    id: "rise",
    name: "Underline rise",
    tech: "CSS",
    note: "Una regla de 2px que crece hasta ser el botón entero. Un link disfrazado de botón: reposo discreto, hover explícito.",
    Comp: () => <Cta v="rise" />,
  },
  {
    id: "corner",
    name: "Corner + tracking",
    tech: "CSS",
    note: "Reacciona la caja, no el color: el radio se cierra y el tracking se abre. El padding compensa para que el nav no se reacomode.",
    Comp: () => <Cta v="corner" />,
  },
  {
    id: "arrow",
    name: "Arrow reveal",
    tech: "CSS",
    note: "El único que agrega información (hacia dónde lleva) en vez de sólo confirmar que hay un botón. El hueco de la flecha ya está reservado.",
    Comp: CtaArrow,
  },
  {
    id: "dots",
    name: "Dither dots",
    tech: "CSS",
    note: "El relleno aparece tramado y se cierra. Máscara de puntos con el radio animado vía @property.",
    Comp: () => <Cta v="dots" />,
  },
  {
    id: "inset",
    name: "Inset close",
    tech: "CSS",
    note: "Entra por los cuatro bordes a la vez, con un solo clip-path animado. Simétrico, y por eso más quieto de lo que parece.",
    Comp: () => <Cta v="inset" />,
  },
  {
    id: "spotlight",
    name: "Spotlight",
    tech: "CSS + JS",
    note: "Un halo que sigue al cursor. El JS escribe --mx/--my y nada más; el resto es CSS. Cero rAF.",
    Comp: CtaSpotlight,
  },
  {
    id: "direction",
    name: "Directional fill",
    tech: "CSS + JS",
    note: "El relleno entra y sale POR DONDE pasó el puntero. La que mejor respeta la trayectoria del gesto; cuesta 12 líneas de JS.",
    Comp: CtaDirection,
  },
  {
    id: "tilt",
    name: "3D tilt",
    tech: "CSS + JS",
    note: "Perspectiva real con brillo contrario a la inclinación. Máximo 7°: más que eso y el texto de 14px se ve borroso.",
    Comp: CtaTilt,
  },
  {
    id: "magnetic",
    name: "Magnetic (rAF)",
    tech: "JS",
    note: "Lerp a mano que se apaga solo al llegar. Mide sobre el wrapper, no sobre el botón, o el imán se persigue a sí mismo.",
    Comp: CtaMagnetic,
  },
  {
    id: "ripple",
    name: "Ripple (WAAPI)",
    tech: "JS",
    note: "Material Design, pero disparado por el hover y no por el click. El radio se calcula hasta la esquina más lejana del punto de entrada.",
    Comp: CtaRipple,
  },
  {
    id: "scramble",
    name: "Scramble",
    tech: "JS",
    note: "El label se resuelve de izquierda a derecha. Ancho fijo y espacios intactos: sin eso es el efecto que peor envejece.",
    Comp: CtaScramble,
  },
  {
    id: "gsap-magnet",
    name: "Magnetic + parallax",
    tech: "GSAP",
    note: "quickTo para el botón y para el label a media velocidad, con vuelta elástica. El paralaje es lo que le da masa.",
    Comp: CtaGsapMagnet,
  },
  {
    id: "gsap-chars",
    name: "Char roll",
    tech: "GSAP",
    note: "SplitText: la línea sale letra por letra mientras la nueva entra. Timeline pausada con play/reverse — entrar y salir rápido no encola nada.",
    Comp: CtaGsapChars,
  },
  {
    id: "gsap-squash",
    name: "Squash & stretch",
    tech: "GSAP",
    note: "1.06 × 0.94: el volumen se conserva, que es lo que lo separa de un scale. El elastic sólo en la vuelta.",
    Comp: CtaGsapSquash,
  },
  {
    id: "gsap-sparks",
    name: "Sparks",
    tech: "GSAP",
    note: "El extremo celebratorio del rango. Sirve para un Claim o un Mint; casi seguro no para el CTA permanente de un header.",
    Comp: CtaGsapSparks,
  },
  {
    id: "gsap-draw",
    name: "Outline draw",
    tech: "GSAP",
    note: "El contorno se dibuja con stroke-dasharray sobre un rect SVG. El largo se mide con getTotalLength(): un rect redondeado no es 2(w+h).",
    Comp: CtaGsapDraw,
  },
];
