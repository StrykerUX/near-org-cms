"use client";

import { useId } from "react";
import Container from "@/components/primitives/Container";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { EX2_HERO } from "@/components/sections/ex2/ex2Content";
import {
  WORLD_EYE,
  WORLD_EYE_CENTER,
  WORLD_LETTERS,
  WORLD_VIEWBOX,
} from "@/components/sections/ex2/worldMark";

// ── EX2 · Hero ───────────────────────────────────────────────────────────────
//
// DRAFT. Lo que se resuelve acá es la ESTRUCTURA y el mecanismo de la
// transición: la sección de destino es un placeholder y ni el texto ni el botón
// son definitivos.
//
// Titular de cartel sobre el vídeo, y una transición en la que la contraforma
// de la «o» de World se abre hasta ser la ventana por la que entra la sección
// siguiente.
//
// ── La máscara ES la letra ──────────────────────────────────────────────────
//
// «World» se pinta desde los trazados de marca (`worldMark.ts`), no como texto,
// y el agujero de la transición es el subpath interior real del glifo. Eso
// cambia dos cosas respecto de la primera pasada, que aproximaba con un
// `clip-path: circle()`:
//
//   · calza EXACTO con la letra en el primer frame, incluida la inclinación de
//     la itálica — antes el desajuste había que disimularlo con velocidad;
//   · no depende de ninguna métrica de fuente, así que no hay que re-medir
//     cuando Kepler termina de cargar.
//
// El precio —el titular deja de ser texto— y cómo se paga están escritos en
// `worldMark.ts`.
//
// ── Los dos movimientos comparten un punto ──────────────────────────────────
//
// 1. El cartel ESCALA con `transform-origin` en el centro de la contraforma.
//    Ese origen es lo que deja el ojo de la «o» clavado en el mismo punto de la
//    pantalla mientras todo lo demás se va hacia afuera.
// 2. La capa de destino se recorta con un `<clipPath>` que contiene ese mismo
//    subpath, escalado desde ese mismo punto y con el mismo factor. Como
//    comparten centro y factor, el agujero y la letra son la misma forma
//    durante todo el recorrido.
//
// ── Por qué un `<clipPath>` de SVG y no `clip-path: path()` ─────────────────
//
// `path()` en CSS toma coordenadas de píxel del elemento recortado y no admite
// escalarse: habría que reescribir el trazado entero en cada frame. Un
// `<clipPath>` acepta un `transform` propio, así que el trazado se declara UNA
// vez en unidades del viewBox y lo que se anima es la matriz.

const TRAVEL = "180svh";

// Margen sobre la distancia a la esquina más lejana: el agujero tiene que
// pasarse de largo, no terminar justo al tocarla.
const COVER = 1.08;

export default function Ex2Hero() {
  // El id del clipPath tiene que ser único en el documento: con dos instancias
  // de la sección, dos `<clipPath id="eye">` harían que la segunda capa usara la
  // máscara de la primera.
  const clipId = `ex2-eye-${useId().replace(/:/g, "")}`;

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop, self }) => {
    const stage = q("[data-stage]")[0];
    const headline = q("[data-headline]")[0];
    const mark = q<SVGSVGElement>("[data-mark]")[0];
    const clipShape = q<SVGPathElement>("[data-clip-group]")[0];
    const reveal = q("[data-reveal]")[0];
    const revealInner = q("[data-reveal-inner]")[0];
    const fade = q("[data-fade]");
    if (!stage || !headline || !mark || !clipShape || !reveal) return;

    // Sin escena: el hero se lee como una portada normal y la sección de destino
    // queda debajo, en flujo. El mecanismo es un lujo; el contenido no.
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "ex2");

    // Geometría, recalculada en cada refresh: depende del ancho de la ventana.
    let cx = 0; // centro de la contraforma, en px del stage
    let cy = 0;
    let base = ""; // la matriz que lleva el trazado del viewBox a la pantalla
    let kEnd = 1;

    // La matriz del clip: escala `k` alrededor del centro de la contraforma y
    // después el mapeo del viewBox a pantalla. El orden importa — al revés, la
    // escala se aplicaría en unidades del viewBox y el centro se movería.
    const applyClip = (k: number) => {
      clipShape.setAttribute(
        "transform",
        `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy}) ${base}`
      );
    };

    self.add("measure", () => {
      // Medir SIN la escala puesta. `getBoundingClientRect` devuelve la caja ya
      // transformada, así que medir a mitad de recorrido daba un
      // `transform-origin` desplazado — y con el origen corrido, el agujero del
      // clip y la contraforma pintada dejan de solaparse: se ven dos formas
      // distintas en pantalla en vez de una.
      gsap.set(headline, { scale: 1 });

      const markBox = mark.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      const headBox = headline.getBoundingClientRect();

      // Cuánto mide en pantalla una unidad del viewBox.
      const s = markBox.width / WORLD_VIEWBOX.w;

      // El centro de la contraforma, primero en coordenadas del stage (para el
      // clip) y después relativo a la caja del cartel (para el
      // `transform-origin`, que SIEMPRE es relativo al propio elemento —
      // confundir los dos sistemas manda el titular fuera de pantalla al
      // escalar, y el síntoma parece "la escala no se aplica").
      const screenX = markBox.left + WORLD_EYE_CENTER.x * s;
      const screenY = markBox.top + WORLD_EYE_CENTER.y * s;
      cx = screenX - stageBox.left;
      cy = screenY - stageBox.top;

      gsap.set(headline, {
        transformOrigin: `${screenX - headBox.left}px ${screenY - headBox.top}px`,
      });

      base = `translate(${markBox.left - stageBox.left} ${markBox.top - stageBox.top}) scale(${s})`;

      // Cuánto tiene que crecer el agujero para tapar la esquina más lejana.
      const w = window.innerWidth;
      const h = window.innerHeight;
      const far = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(w - cx, cy),
        Math.hypot(cx, h - cy),
        Math.hypot(w - cx, h - cy)
      );
      kEnd = (far * COVER) / (WORLD_EYE_CENTER.r * s);

      applyClip(1);
    });

    self.measure();
    ScrollTrigger.addEventListener("refreshInit", self.measure);

    // `gsap.set` y no `quickSetter("scale")`: el segundo escribía el transform
    // sin la escala —`translate(0px, 0px)` y nada más— porque el titular ya
    // tenía un `transformOrigin` puesto por `gsap.set` en la medición y los dos
    // caminos no comparten caché. Un `set` por frame dentro de un scrub es lo
    // que ya hacen otras secciones del repo.
    const setScale = (k: number) => gsap.set(headline, { scale: k });
    const setInnerY = gsap.quickSetter(revealInner, "y", "px");
    const setInnerAlpha = gsap.quickSetter(revealInner, "opacity");

    const st = ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      markers: DEBUG_MARKERS,
      // `will-change` solo mientras el recorrido está activo: fijo en el
      // className, el cartel quedaría promovido a su propia capa toda la sesión.
      onToggle: (t) => {
        headline.style.willChange = t.isActive ? "transform" : "auto";
      },
      onUpdate: (t) => {
        const p = t.progress;

        // Lineal y no una ease: el cartel y el agujero tienen que crecer con el
        // MISMO factor en todo momento, y cualquier curva los desincroniza.
        const k = 1 + (kEnd - 1) * p;
        setScale(k);
        applyClip(k);

        // El contenido de destino sube un poco y entra con opacidad en el primer
        // cuarto. Sin lo segundo, el ojo de la «o» ya deja ver dos palabras
        // sueltas antes de que nadie haya scrolleado.
        if (revealInner) {
          setInnerY((1 - p) * 40);
          setInnerAlpha(Math.min(1, p / 0.25));
        }

        // El resto del hero se retira: compite con el agujero justo cuando el
        // agujero es lo único que importa.
        gsap.set(fade, { autoAlpha: 1 - Math.min(1, p * 2.2) });
      },
    });

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", self.measure);
      st.kill();
      headline.style.willChange = "auto";
      clipShape.removeAttribute("transform");
      gsap.set([headline, ...fade, ...(revealInner ? [revealInner] : [])], {
        clearProps: "all",
      });
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/ex2 relative bg-ink text-cream data-[ex2=on]:h-[calc(var(--travel)+100svh)]"
    >
      <div
        data-stage
        className="relative overflow-hidden group-data-[ex2=on]/ex2:sticky group-data-[ex2=on]/ex2:top-0 group-data-[ex2=on]/ex2:h-svh"
      >
        {/* El vídeo: loop, no scrubbeado. Todo el scroll de la sección se lo
            lleva la apertura del ojo — con el descenso avanzando a la vez,
            serían dos animaciones peleándose por la misma rueda. */}
        <video
          data-fade
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          src={EX2_HERO.video}
          poster={EX2_HERO.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        <div
          data-fade
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,16,16,0.55)_0%,rgba(16,16,16,0.25)_45%,rgba(16,16,16,0.75)_100%)]"
        />

        <Container className="relative flex h-full flex-col justify-end pb-[10svh] pt-[var(--site-header-block)]">
          {/* El titular accesible. El cartel de abajo es `aria-hidden`, así que
              esta es la única fuente del titular para un lector de pantalla. */}
          <h1 className="sr-only">
            {EX2_HERO.lead} {EX2_HERO.word}
          </h1>

          <div data-headline aria-hidden="true" className="w-fit text-cream">
            <span className="block text-kicker-xl uppercase">{EX2_HERO.lead}</span>

            {/* El cartel, desde los trazados de marca: el SVG manda el tamaño y
                no la métrica de una fuente. */}
            <svg
              data-mark
              viewBox={`0 0 ${WORLD_VIEWBOX.w} ${WORLD_VIEWBOX.h}`}
              className="block w-[76vw] max-w-[68rem]"
              fill="currentColor"
            >
              {WORLD_LETTERS.map((d, i) => (
                <path key={i} d={d} />
              ))}
              {/* La contraforma, pintada del color del FONDO: es lo que abre el
                  ojo de la «o» sobre la palabra maciza. Va como path aparte y no
                  como agujero del glifo para que el MISMO trazado pueda reusarse
                  de máscara sin duplicarlo. */}
              <path d={WORLD_EYE} className="fill-ink" />
            </svg>
          </div>

          <div data-fade className="mt-10 flex items-center gap-6">
            <a
              href={EX2_HERO.cta.href}
              className="rounded-2xl border border-cream/40 px-7 py-4 text-label-lg text-cream transition-colors duration-200 hover:bg-cream hover:text-ink"
            >
              {EX2_HERO.cta.label}
            </a>
            <p className="max-w-[38ch] text-body-sm text-cream/60 text-pretty">{EX2_HERO.sub}</p>
          </div>
        </Container>

        {/* El `<clipPath>` vive en un SVG de tamaño cero: solo aporta la
            definición, no pinta nada. */}
        {/* `overflow-visible` no es cosmético: un `<svg>` recorta a su viewport
            por defecto, y con `size-0` eso deja el trazado del `<clipPath>`
            fuera de la caja — el recorte resultante es vacío y la capa de
            destino no se ve NUNCA, sin ningún error de por medio. */}
        <svg aria-hidden="true" className="absolute size-0 overflow-visible">
          <defs>
            {/* El `transform` va en el PROPIO path y no en un `<g>` que lo
                envuelva: dentro de un `<clipPath>` solo son válidas las formas
                (`path`, `rect`, `circle`…), `<text>` y `<use>`. Un `<g>` se
                IGNORA por completo — con él, el recorte resultante es vacío y la
                capa de destino no aparece jamás, sin ningún error en consola. */}
            <clipPath id={clipId}>
              <path data-clip-group d={WORLD_EYE} />
            </clipPath>
          </defs>
        </svg>

        <div
          data-reveal
          style={{ clipPath: `url(#${clipId})` }}
          className="absolute inset-0 z-10 flex items-center bg-cream text-ink"
        >
          <Container data-reveal-inner className="flex flex-col gap-6">
            <p className="text-caption-mono uppercase text-gray-intermediate">
              {EX2_HERO.next.kicker}
            </p>
            <h2 className="max-w-[18ch] text-h1 text-pretty">{EX2_HERO.next.title}</h2>
            <p className="max-w-[54ch] text-body-lg text-gray-intermediate text-pretty">
              {EX2_HERO.next.body}
            </p>
          </Container>
        </div>
      </div>
    </section>
  );
}
