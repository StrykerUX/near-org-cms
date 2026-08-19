"use client";

import { useId } from "react";
import Container from "@/components/primitives/Container";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { EX_COPY } from "@/components/sections/ex/exContent";
import {
  WORLD_EYE,
  WORLD_EYE_CENTER,
  WORLD_LETTERS,
  WORLD_O_INDEX,
  WORLD_VIEWBOX,
} from "@/components/sections/ex/worldMark";

// ── EX · el hero, compartido por los tres drafts ─────────────────────────────
//
// Las tres páginas (`/prototype/ex1`, `/ex2`, `/ex3`) montan ESTE componente y
// solo cambian dos cosas: qué hay de fondo y cómo se compone el texto. El
// mecanismo de la «o» es idéntico en las tres, y por eso vive acá y no copiado
// tres veces: es geometría medida contra un asset de marca, no una decisión de
// diseño que cada variante deba poder tomar por su cuenta.
//
// ── El mecanismo ────────────────────────────────────────────────────────────
//
// La contraforma de la «o» de World crece hasta ser la ventana por la que entra
// la sección siguiente. Dos movimientos que comparten un punto:
//
// 1. Crece SOLO la «o» —contorno y contraforma en un `<g>` propio—, escalada
//    desde el centro del ojo. El resto del cartel se queda quieto y se apaga:
//    es la referencia fija contra la que se mide el crecimiento. Escalando todo
//    a la vez, el gesto se lee como un zoom de cámara.
// 2. La capa de destino se recorta con un `<clipPath>` que contiene ESE MISMO
//    subpath, escalado desde el mismo punto y con el mismo factor.
//
// ── El factor crece exponencialmente ────────────────────────────────────────
//
// `kEnd^p` y no `1 + (kEnd−1)·p`. Un zoom no se percibe por la DIFERENCIA de
// tamaño sino por la RAZÓN entre un instante y el siguiente: con un factor
// lineal que va de 1 a ~90, la primera décima de scroll ya multiplica por 10 y
// el gesto se come en el primer 15% del recorrido. Con la exponencial, cada
// tramo igual de scroll multiplica el tamaño por el mismo factor.
//
// Que la curva no sea lineal no desincroniza nada: letra y agujero consumen el
// mismo `k`.
//
// ── Trampas de esta escena, todas silenciosas ───────────────────────────────
//
// · Un `<g>` dentro de `<clipPath>` se IGNORA (solo valen formas, `<text>` y
//   `<use>`): el transform va en el propio `<path>`.
// · El `<svg>` de las `<defs>` necesita `overflow-visible`, o su viewport de
//   tamaño cero recorta el trazado y el clip sale vacío.
// · `getBBox()` y no leer los números del atributo `d`: un trazado de curvas
//   lleva puntos de control fuera de la forma.
// · Nada de clases `translate-*` sobre lo que anima GSAP — en Tailwind v4 eso
//   compila a la propiedad `translate`, que se SUMA al transform.

const TRAVEL = "180svh";

// Margen sobre la distancia a la esquina más lejana: el agujero tiene que
// pasarse de largo, no terminar justo al tocarla.
const COVER = 1.25;

// A qué altura del gesto el agujero YA tapó la pantalla. Antes esto era 1: la
// «o» terminaba de cubrir exactamente en el último píxel de scroll, así que
// durante todo el tramo final quedaba una cuña de negro en una esquina y el
// lector veía el borde del truco. Cubriendo al 82% queda un remate de gesto
// sobre la sección 2 ya limpia.
const COVER_AT = 0.82;

// El ojo no es un círculo: es un óvalo INCLINADO. La mitad del ancho de su CAJA
// no es su eje corto — al estar torcido, el óvalo es más angosto que la caja que
// lo contiene, y el escalado es uniforme, así que quien decide si el agujero
// llegó a cubrir la pantalla es el eje corto de verdad. Midiendo sobre la caja,
// la «o» deja una cuña de negro en la esquina justo cuando el gesto termina.
// 0.72 sale de la inclinación del glifo de Kepler; errar por lo bajo solo hace
// que la «o» se pase de grande, que es el lado seguro.
const EYE_TILT = 0.72;

export type ExHeroLayout =
  /** Cartel a sangre abajo a la izquierda, como la referencia original. */
  | "poster"
  /** Titular centrado con subtítulo y dos acciones al pie. */
  | "center";

export type ExHeroProps = {
  /** El fondo: se pinta detrás de todo y recibe `data-fade` para retirarse. */
  background: React.ReactNode;
  layout?: ExHeroLayout;
  /** Color del cartel y del texto. Los fondos claros piden tinta; los oscuros, cream. */
  tone?: "ink" | "cream";
};

export default function ExHero({ background, layout = "poster", tone = "ink" }: ExHeroProps) {
  // Único en el documento: con dos instancias, dos `<clipPath id="eye">` harían
  // que la segunda capa usara la máscara de la primera.
  const clipId = `ex-eye-${useId().replace(/:/g, "")}`;
  const dark = tone === "cream";

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop, self }) => {
    const stage = q("[data-stage]")[0];
    const headline = q("[data-headline]")[0];
    const mark = q<SVGSVGElement>("[data-mark]")[0];
    const oGroup = q<SVGGElement>("[data-o]")[0];
    const rest = q("[data-rest]");
    const clipShape = q<SVGPathElement>("[data-clip-shape]")[0];
    const reveal = q("[data-reveal]")[0];
    const revealInner = q("[data-reveal-inner]")[0];
    const fade = q("[data-fade]");
    if (!stage || !headline || !mark || !oGroup || !clipShape || !reveal) return;

    // Sin escena: el hero se lee como una portada normal y la sección de destino
    // queda debajo, en flujo. El mecanismo es un lujo; el contenido no.
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "ex");

    let cx = 0;
    let cy = 0;
    let base = "";
    let kEnd = 1;

    // Distancia del centro del ojo al centro del escenario. El bloque revelado
    // arranca ahí y no en el centro de la pantalla: el agujero al abrirse es
    // chico y NO está centrado —el ojo de la «o» cae a la izquierda del renglón
    // y más arriba—, así que un bloque centrado en el viewport se lee cortado
    // por el borde del propio agujero durante toda la primera mitad del gesto.
    let eyeDx = 0;
    let eyeDy = 0;

    // Escala `k` alrededor del centro del ojo y después el mapeo del viewBox a
    // pantalla. El orden importa: al revés, la escala iría en unidades del
    // viewBox y el centro se movería.
    const applyClip = (k: number) => {
      clipShape.setAttribute(
        "transform",
        `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy}) ${base}`
      );
    };

    // La «o» escala en unidades del viewBox: el mismo `k` vale para la letra y
    // para el clip porque los dos giran alrededor del mismo punto del glifo.
    const applyO = (k: number) => {
      const { x, y } = WORLD_EYE_CENTER;
      oGroup.setAttribute("transform", `translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`);
    };

    self.add("measure", () => {
      // Medir sin la escala puesta: `getBoundingClientRect` devuelve la caja ya
      // transformada.
      oGroup.removeAttribute("transform");

      const markBox = mark.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      const s = markBox.width / WORLD_VIEWBOX.w;

      cx = markBox.left + WORLD_EYE_CENTER.x * s - stageBox.left;
      cy = markBox.top + WORLD_EYE_CENTER.y * s - stageBox.top;
      base = `translate(${markBox.left - stageBox.left} ${markBox.top - stageBox.top}) scale(${s})`;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const far = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(w - cx, cy),
        Math.hypot(cx, h - cy),
        Math.hypot(w - cx, h - cy)
      );
      // El radio se mide, no se hardcodea: `getBBox` da la caja del trazado en
      // unidades del viewBox (el path va sin transform en este punto) y
      // `EYE_TILT` la corrige al ancho real del óvalo.
      const eyeBox = clipShape.getBBox();
      const rEye = (Math.min(eyeBox.width, eyeBox.height) / 2) * EYE_TILT;

      kEnd = (far * COVER) / (rEye * s);

      eyeDx = cx - stageBox.width / 2;
      eyeDy = cy - stageBox.height / 2;

      applyClip(1);
      applyO(1);
    });

    self.measure();
    ScrollTrigger.addEventListener("refreshInit", self.measure);

    // Estado de reposo a mano: `onUpdate` no corre hasta que el lector scrollea,
    // y sin esto se ven dos palabras del contenido de destino DENTRO del ojo
    // desde el primer paint.
    if (revealInner) gsap.set(revealInner, { y: 40, opacity: 0 });

    const setInnerX = gsap.quickSetter(revealInner, "x", "px");
    const setInnerY = gsap.quickSetter(revealInner, "y", "px");
    const setInnerAlpha = gsap.quickSetter(revealInner, "opacity");

    const st = ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      markers: DEBUG_MARKERS,
      onToggle: (t) => {
        oGroup.style.willChange = t.isActive ? "transform" : "auto";
      },
      onUpdate: (t) => {
        const p = t.progress;
        const k = Math.pow(kEnd, Math.min(1, p / COVER_AT));
        applyO(k);
        applyClip(k);

        if (revealInner) {
          // Del ojo al centro de la pantalla. Se resuelve a 55% del gesto, que
          // es cuando el agujero ya es más grande que el bloque: a partir de
          // ahí seguir colgado del ojo solo dejaría el texto descentrado.
          const anchor = 1 - Math.min(1, p / 0.55);
          setInnerX(eyeDx * anchor);
          setInnerY(eyeDy * anchor + (1 - p) * 40);
          setInnerAlpha(Math.min(1, p / 0.25));
        }

        // Las vecinas se apagan sin moverse, y con ellas el fondo: los dos
        // compiten con el agujero justo cuando el agujero es lo único que
        // importa.
        gsap.set(rest, { autoAlpha: 1 - Math.min(1, p * 1.8) });
        gsap.set(fade, { autoAlpha: 1 - Math.min(1, p * 2.2) });
      },
    });

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", self.measure);
      st.kill();
      oGroup.style.willChange = "auto";
      oGroup.removeAttribute("transform");
      clipShape.removeAttribute("transform");
      gsap.set([headline, ...rest, ...fade, ...(revealInner ? [revealInner] : [])], {
        clearProps: "all",
      });
      off();
    };
  });

  const centered = layout === "center";

  // El cartel. En `center` es más contenido: comparte pantalla con el subtítulo
  // y las acciones, así que no puede ir a sangre.
  const markClass = centered
    ? "block w-[52vw] max-w-[46rem] overflow-visible"
    : "block w-[76vw] max-w-[68rem] overflow-visible";

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className={`group/ex relative data-[ex=on]:h-[calc(var(--travel)+100svh)] ${
        dark ? "bg-ink text-cream" : "bg-background text-ink"
      }`}
    >
      <div
        data-stage
        className="relative overflow-hidden group-data-[ex=on]/ex:sticky group-data-[ex=on]/ex:top-0 group-data-[ex=on]/ex:h-svh"
      >
        {background}

        <Container
          className={`relative flex h-full flex-col pt-[var(--site-header-block)] ${
            centered
              ? "items-center justify-center gap-8 pb-[8svh] text-center"
              : "justify-end pb-[10svh]"
          }`}
        >
          {/* El titular accesible: el cartel es `aria-hidden`, así que esta es la
              única fuente del titular para un lector de pantalla. */}
          <h1 className="sr-only">
            {EX_COPY.lead} {EX_COPY.word}
          </h1>

          <div
            data-headline
            aria-hidden="true"
            className={centered ? "flex flex-col items-center" : "w-fit"}
          >
            <span
              data-rest
              className={`block text-kicker-xl uppercase ${centered ? "text-center" : ""}`}
            >
              {EX_COPY.lead}
            </span>

            {/* `overflow-visible`: la «o» crece mucho más allá del viewBox, y un
                `<svg>` recorta a su viewport por defecto. */}
            <svg
              data-mark
              viewBox={`0 0 ${WORLD_VIEWBOX.w} ${WORLD_VIEWBOX.h}`}
              className={markClass}
              fill="currentColor"
            >
              {WORLD_LETTERS.map((d, i) =>
                i === WORLD_O_INDEX ? null : <path key={i} data-rest d={d} />
              )}
              {/* Contorno y ojo en UN path con `evenodd`: el hueco tiene que ser
                  un agujero de verdad para que se vea el fondo a través. */}
              <g data-o>
                <path d={`${WORLD_LETTERS[WORLD_O_INDEX]} ${WORLD_EYE}`} fillRule="evenodd" />
              </g>
            </svg>
          </div>

          {centered ? (
            <>
              <p
                data-rest
                className={`max-w-[46ch] text-body-lg text-pretty ${
                  dark ? "text-cream/70" : "text-ink/70"
                }`}
              >
                {EX_COPY.sub}
              </p>

              {/* Las dos acciones, con su punto de color: la primaria en verde,
                  la otra en gris. Es el patrón del prototipo de referencia. */}
              <div data-rest className="mt-auto flex items-center gap-6">
                {EX_COPY.actions.map((a, i) => (
                  <div key={a.label} className="flex items-center gap-6">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className={`h-6 w-px ${dark ? "bg-cream/25" : "bg-ink/20"}`}
                      />
                    )}
                    <a href={a.href} className="flex items-center gap-2.5 text-label-lg">
                      <span
                        aria-hidden="true"
                        className={`size-2.5 rounded-full ${
                          a.primary ? "bg-near-green" : dark ? "bg-cream/35" : "bg-ink/25"
                        }`}
                      />
                      {a.label}
                    </a>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div data-rest className="mt-10 flex items-center gap-6">
              <a
                href={EX_COPY.actions[0].href}
                className={`rounded-2xl border px-7 py-4 text-label-lg transition-colors duration-200 ${
                  dark
                    ? "border-cream/40 text-cream hover:bg-cream hover:text-ink"
                    : "border-ink/40 text-ink hover:bg-ink hover:text-cream"
                }`}
              >
                {EX_COPY.actions[0].label}
              </a>
              <p
                className={`max-w-[38ch] text-body-sm text-pretty ${
                  dark ? "text-cream/70" : "text-ink/70"
                }`}
              >
                {EX_COPY.sub}
              </p>
            </div>
          )}
        </Container>

        {/* El `<clipPath>` vive en un svg de tamaño cero: solo aporta la
            definición. `overflow-visible` o su viewport recorta el trazado. */}
        <svg aria-hidden="true" className="absolute size-0 overflow-visible">
          <defs>
            <clipPath id={clipId}>
              <path data-clip-shape d={WORLD_EYE} />
            </clipPath>
          </defs>
        </svg>

        <div
          data-reveal
          style={{ clipPath: `url(#${clipId})` }}
          className="absolute inset-0 z-10 flex items-center bg-cream text-ink"
        >
          {/* Centrado y estrecho, no alineado a la izquierda como el resto del
              sitio: el marco de este bloque no es la pantalla, es el AGUJERO, y
              el agujero es un óvalo. Un renglón que salga de su ancho útil se
              lee cortado por el borde de la «o» durante media transición. */}
          <Container data-reveal-inner className="flex flex-col items-center gap-6 text-center">
            <p className="text-caption-mono uppercase text-gray-intermediate">
              {EX_COPY.next.kicker}
            </p>
            <h2 className="max-w-[14ch] text-h1 text-pretty">{EX_COPY.next.title}</h2>
            <p className="max-w-[42ch] text-body-lg text-gray-intermediate text-pretty">
              {EX_COPY.next.body}
            </p>
          </Container>
        </div>
      </div>
    </section>
  );
}
