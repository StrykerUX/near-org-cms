"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import GlSurface from "@/components/primitives/GlSurface";
import { HERO_SURFACE_FRAG } from "@/components/primitives/gl/layerflow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import CtaPill from "@/components/sections/quantum/CtaPill";
import {
  HERO_X,
  type HeroXPage,
} from "@/components/sections/hero-x/heroXContent";
import {
  heroXFallback,
  heroXSurface,
  heroXVeil,
} from "@/components/sections/hero-x/heroXPresets";

// La apertura común de las nueve páginas del sitio.
//
// ── De dónde sale ──────────────────────────────────────────────────────────
//
// De `protocol-labs/heroes/HeroLayerflow`, el hero de `/prototype/protocol-a`.
// Está COPIADO y no importado, por la regla de laboratorios del README del
// catálogo: desde acá deja de moverse con él, y el lab queda como registro de
// dónde estaba el diseño.
//
// Lo que se copió es la pieza entera —el shader, el layout y el gesto— y lo
// único que se agregó es el parámetro: la página. De ahí salen su copy
// (`heroXContent`) y su preset de superficie (`heroXPresets`).
//
// ── Una sola pieza, nueve temperaturas ─────────────────────────────────────
//
// El layout y la animación son IDÉNTICOS en las nueve. Lo que cambia es la
// rampa de color, el ángulo de la luz, cuántas capas cruzan el campo y cuánto
// se funden sus estrías — cuatro cosas, elegidas porque se leen de lejos sin
// que la pieza deje de reconocerse. El porqué de cada una está en
// `heroXPresets`.
//
// Eso es lo que esta sección viene a probar: si nueve páginas que abren igual
// se leen como un sitio, o como nueve veces la misma página.
//
// ── El hero se recoge al scrollear ─────────────────────────────────────────
//
// De ocupar la pantalla entera a quedar guardado en una tarjeta de esquinas
// blandas, y de ahí la página sigue. No desaparece nada ni se transforma nada:
// lo único que se mueve es el ENCUADRE.
//
// **Es `clip-path` y no un `transform`.** Un `scale` encogería el CONTENIDO: la
// superficie se vería alejada, como si la cámara retrocediera. `inset()` cierra
// la ventana mientras lo de adentro sigue a su tamaño, es interpolable de punta
// a punta (incluido su `round`) y **no toca el layout** — que acá importa el
// doble, porque un cambio de tamaño real haría que `GlSurface` re-mida y
// recompile su shader en cada frame del scroll.
//
// **El `overflow-hidden` va en el hijo pegado, nunca en la sección.** Un
// ancestro con `overflow` distinto de `visible` se vuelve el contenedor de
// scroll del sticky y éste deja de pegarse, en silencio y sin error.
//
// **Con `prefers-reduced-motion` se aplica el estado FINAL**, la tarjeta ya
// recogida. Un hero a sangre que promete un gesto que nunca llega es peor que
// uno que no lo promete.
//
// ── La copy sube con el borde, o se corta ──────────────────────────────────
//
// La copy está anclada al BORDE INFERIOR, a `pb-16` de él, y el recogido se
// come justamente un 11% de abajo — bastante más que esos 4rem. Sin compensar,
// el titular queda partido por la mitad.
//
// Sube exactamente lo que sube el borde: `TUCK.y` por ciento del alto del
// viewport. Así la distancia entre el texto y el filo de la tarjeta es la misma
// al principio y al final. Va como `y` en píxeles calculados y no como una
// clase con `svh` porque es un `transform`, o sea que no dispara layout en
// ningún frame del scrub; y se resuelve por función para que
// `invalidateOnRefresh` lo recalcule en cada resize en vez de dejar clavado el
// alto del primer render.
//
// Lo que NO se compensa es el recorte lateral (`TUCK.x`, 6% por lado): el
// `Container` ya centra con un ancho máximo, así que en desktop sus márgenes
// son mayores que ese 6%. En pantallas angostas conviene mirarlo — si ahí
// muerde, la salida es bajar `TUCK.x`, no meterle padding lateral a la copy.

/** Cuánto scroll cuesta el recogido. */
const TRAVEL = "80svh";

/** Cuánto margen le queda a la tarjeta, en % del viewport. */
const TUCK = { y: 11, x: 6 } as const;

/** El radio de la tarjeta, en px. Constante: acá nada se escala. */
const RADIUS = 34;

export type HeroXProps = {
  /** Qué página es. De acá salen su copy y su preset de superficie. */
  page: HeroXPage;
};

export default function HeroX({ page }: HeroXProps) {
  const content = HERO_X[page];

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    const shut = `inset(${TUCK.y}% ${TUCK.x}% round ${RADIUS}px)`;

    mm.add(MQ.reduce, () => {
      const frame = q("[data-tuck-frame]")[0];
      const copy = q("[data-tuck-copy]")[0];
      if (!frame) return;

      gsap.set(frame, { clipPath: shut });
      if (copy)
        gsap.set(copy, { scale: 0.9, y: -window.innerHeight * (TUCK.y / 100) });

      return () =>
        gsap.set([frame, ...(copy ? [copy] : [])], { clearProps: "all" });
    });

    mm.add(MQ.motion, () => {
      const frame = q("[data-tuck-frame]")[0];
      const copy = q("[data-tuck-copy]")[0];
      if (!frame) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          // `bottom bottom` es el último frame en que la escena está pegada. Con
          // `bottom top` el recogido terminaría un viewport más tarde, o sea con
          // la tarjeta ya fuera de cuadro.
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      // El encuadre se cierra. `power2.inOut`: los primeros píxeles de scroll
      // son exploratorios y un hero que salta al primer roce se siente frágil;
      // el final frena, que es como se apoya algo que tiene peso.
      tl.fromTo(
        frame,
        { clipPath: "inset(0% 0% round 0px)" },
        { clipPath: shut, ease: "power2.inOut", duration: 0.72 },
        0,
      );

      // La copy hace dos cosas a la vez, y sólo una es estética.
      //
      // El `scale` acompaña, pero mucho menos que la caja: la tarjeta pierde
      // ~22% de alto y ella sólo un 10%. Encogiéndola a la par se leería como
      // un zoom-out del conjunto, que es justo la lectura que el `clip-path`
      // viene a evitar.
      //
      // El `y` es obligatorio: sube lo mismo que sube el borde inferior del
      // encuadre, o el texto queda partido por el recorte.
      if (copy) {
        tl.fromTo(
          copy,
          { scale: 1, y: 0 },
          {
            scale: 0.9,
            y: () => -window.innerHeight * (TUCK.y / 100),
            ease: "power2.inOut",
            duration: 0.72,
          },
          0,
        );
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([frame, ...(copy ? [copy] : [])], { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, [page]);

  return (
    // La sección mide el recorrido MÁS una pantalla. No lleva `overflow` —va en
    // el hijo pegado— pero sí conserva el `isolate`: es lo que impide que los
    // z-index de adentro compitan con el header fijo.
    <section
      ref={rootRef}
      style={{ "--tuck-travel": TRAVEL } as React.CSSProperties}
      className="relative isolate h-[calc(var(--tuck-travel)+100svh)] bg-cream text-foreground"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* La ventana. Todo lo que se ve del hero vive acá dentro y se recorta
            con ella —la superficie, el velo y la copy a la vez—, que es lo que
            hace que se lean como una sola pieza guardándose. */}
        <div
          data-tuck-frame
          className="absolute inset-0 flex flex-col justify-end pt-[var(--site-header-block)] text-foreground"
        >
          <GlSurface
            fragment={HERO_SURFACE_FRAG}
            uniforms={heroXSurface(page)}
            // El tag identifica el contexto WebGL. Va por página y no fijo:
            // dos superficies con el mismo tag comparten caché de programa, y
            // los nueve presets son del mismo shader pero con uniformes
            // distintos.
            tag={`hero-x-${page}`}
            fallback={heroXFallback(page)}
            // Buffer a resolución plena, contra el 0.6 que trae `GlSurface`.
            // Aquel valor está calibrado para superficies SIN bordes, y ésta
            // tiene estructura: capas con su juntura y estrías finas. A 0.6
            // cada borde diagonal muestra escalones y el grano se cuantiza en
            // bloques de dos píxeles, con lo que deja de hacer de dither y el
            // degradé bandea.
            renderScale={1}
            // 1:1 con la pantalla. El tope de 1.75 obliga a un reescalado
            // FRACCIONARIO en cualquier display a dpr 2, y ahí el suavizado
            // deja de ser uniforme.
            maxDpr={2}
            className="absolute inset-0 z-0 h-full w-full"
          />

          {/* Velo de LEGIBILIDAD, plano y sólo al pie: el bloque de cuerpo y
              salida cae sobre la zona donde las estrías todavía tienen
              contraste. Va en el tono claro de SU página — ver `heroXVeil`. No
              llega al borde inferior con el color de la sección siguiente: eso
              sería un degradé de transición, y acá el corte entre secciones se
              ve. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{ background: heroXVeil(page) }}
          />

          <Container
            data-tuck-copy
            className="relative z-20 grid-ds items-end gap-y-8 pb-16"
          >
            <div className="col-span-full flex flex-col gap-6 lg:col-span-7">
              <p className="text-eyebrow-mono uppercase text-gray-intermediate">
                {content.eyebrow}
              </p>
              <h1 className="text-h1 text-balance">
                {content.lead}
                <br />
                <Accent display>{content.accent}</Accent>
              </h1>
            </div>

            <div className="col-span-full flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
              <p className="max-w-[36ch] text-body-lg text-ink-soft text-pretty">
                {content.body}
              </p>
              {/* Cuatro de las nueve páginas no tienen salida en su hero y no
                  se les inventa una: un botón que lleva a ningún lado es peor
                  que la ausencia de botón. El bloque se recompone solo. */}
              {content.cta ? (
                <CtaPill
                  href={content.cta.href}
                  tone="filled"
                  external={content.cta.external}
                >
                  {content.cta.label}
                </CtaPill>
              ) : null}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
