"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { HERO_SURFACE_FRAG } from "@/components/sections/protocol-labs/gl/layerflow";
import { hexToRgb } from "@/components/sections/protocol-labs/gl/color";
import GlSurface from "@/components/sections/protocol-labs/GlSurface";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// Sección 1 — el hero de la página.
//
// ── De dónde sale ─────────────────────────────────────────────────────────
//
// De `/prototype/protocol-combo/layerflow`, que ganó la comparación de combos.
// Copiado y no importado, por la regla del laboratorio: desde acá deja de
// moverse con él, y el lab queda como registro de dónde estaba el diseño.
//
// Reemplaza a la versión anterior —H4 · Cut, crema plano, sin superficie— que
// está en el historial de git. Lo que cambia no es sólo el fondo: el hero pasa a
// tener el layout de Spectrum (titular abajo a la izquierda, cuerpo y salida a
// la derecha, la mitad superior entera para la superficie) y las seis cifras
// vuelven a asomar por el borde inferior.
//
// ── El hero se recoge al scrollear ────────────────────────────────────────
//
// El mismo gesto que `/prototype/homepage-k` (`homepage-tuck/HeroTuck`): de
// ocupar la pantalla entera a quedar guardado en una tarjeta con esquinas
// blandas, y de ahí la página sigue. No desaparece nada ni se transforma nada —
// lo único que se mueve es el ENCUADRE.
//
// Se copian sus tres constantes y su curva para que sea literalmente el mismo
// gesto y no una versión parecida; el razonamiento largo está en aquel archivo.
// Lo que importa acá:
//
// **Es `clip-path` y no un `transform`.** Un `scale` encogería el CONTENIDO: la
// superficie se vería alejada, como si la cámara retrocediera. Lo que se busca
// es lo contrario — que la ventana se cierre mientras lo que hay dentro sigue a
// su tamaño. `inset()` hace eso, es interpolable de punta a punta (incluido su
// `round`) y **no toca el layout**, que acá importa el doble: el canvas de
// `GlSurface` no re-mide ni recompila su shader, cosa que un cambio de tamaño
// real dispararía en cada frame del scroll.
//
// **El `overflow-hidden` va en el hijo pegado, nunca en la sección.** Un
// ancestro con overflow distinto de `visible` se vuelve el contenedor de scroll
// del sticky y éste deja de pegarse, en silencio.
//
// **Con `prefers-reduced-motion` se aplica el estado FINAL**, la tarjeta ya
// recogida. Un hero a sangre que promete un gesto que nunca llega es peor que
// uno que no lo promete.
//
// ── La copy sube con el borde, o se corta ─────────────────────────────────
//
// Ésta es la diferencia real con `homepage-k`, y no es un detalle: allá el
// titular está CENTRADO en el encuadre, así que un recorte del 11% arriba y
// abajo no lo toca nunca. Acá la copy está anclada al BORDE INFERIOR, a `pb-16`
// de él — y el recorte se come justamente ese 11% de abajo, o sea bastante más
// que los 4rem del padding. El titular quedaba partido por la mitad.
//
// La copy sube exactamente lo que sube el borde: `TUCK.y` por ciento del alto
// del viewport. Así la distancia entre el texto y el filo de la tarjeta es la
// misma al principio y al final, y el bloque nunca entra en la zona recortada.
//
// Va como `y` en píxeles calculados y no como una clase con `svh`: es un
// `transform`, o sea que no dispara layout en ningún frame del scrub. Se
// resuelve por función para que `invalidateOnRefresh` lo recalcule en cada
// resize en lugar de dejar clavado el alto del primer render.
//
// Lo que NO se compensa es el recorte lateral (`TUCK.x`, 6% por lado). El
// `Container` ya centra con un ancho máximo, así que en desktop sus márgenes son
// mayores que ese 6% y no hay nada que cortar; el `scale` de la copy ayuda con
// el resto. En pantallas angostas conviene mirarlo — si ahí muerde, la salida es
// bajar `TUCK.x`, no meterle padding lateral a la copy.

/** Cuánto scroll cuesta el recogido. */
const TRAVEL = "80svh";

/** Cuánto margen le queda a la tarjeta, en % del viewport. */
const TUCK = { y: 11, x: 6 } as const;

/** El radio de la tarjeta, en px. Constante: acá nada se escala. */
const RADIUS = 34;

// ── El hero no lleva cifras ───────────────────────────────────────────────
//
// Las tuvo, asomando cortadas por el borde inferior: el hero medía
// `100svh + 7.5rem` y la fila entraba a opacidad baja, subiendo de a una al
// scrollear. Ahora son una sección propia (`ProofRow`), sin adornos y con su
// padding.
//
// El hero vuelve a medir exactamente una pantalla, y eso deja una consecuencia
// anotada: la primera pantalla no anuncia lo que sigue. Era lo que hacía el
// asomo —y antes que él, el corte a 78svh de H4— sin gastar una flecha ni un
// «scroll» en versalitas. Si el arranque se siente cerrado, es esto.
//
// El preset de la superficie. Arranca del que el hero de la home tiene horneado
// y se separa en tres puntos:
//
//   · **La paleta es clara.** La de la home va de un crema verdoso a un verde
//     casi negro; ésta recorre el mismo camino y se detiene mucho antes, porque
//     debajo hay un titular en tinta y seis cifras asomando. El tono más
//     profundo aparece sólo en la esquina superior derecha. Ni el primero es
//     blanco ni el último negro: esos dos topes son buena parte de por qué la
//     referencia se lee como película y no como degradé sintético.
//   · **La luz viene de abajo a la izquierda.** En la home entra por arriba; acá
//     el titular ocupa el tercio inferior izquierdo y necesita el papel más
//     limpio de la pantalla justo ahí.
//   · **El estirado es menor** (2.6 contra 3.4). La home disuelve las estrías en
//     un degradé casi liso en el lado lejano; acá hay que ver las CAPAS, y una
//     capa cuya textura se fundió deja de distinguirse de su vecina.
const SURFACE = {
  // Fuera del canvas a la derecha y algo por encima del centro: las estrías
  // apuntan hacia allá y barren la pantalla en diagonal.
  u_focus: [1.24, 0.62],
  u_scale: 3.1,
  u_curl: 1.25,
  u_curlScale: 1.05,
  u_blur: 2.6,
  u_detail: 0.68,
  u_detailFall: 1.35,
  u_contrast: 1.3,
  u_lift: 0.0,
  // ~35°: la sombra cierra arriba a la derecha, junto al foco, y la luz queda
  // abajo a la izquierda — debajo del titular.
  u_gradAngle: 0.62,
  u_gradSpread: 1.1,
  // Mayor que 1: aprieta la zona oscura contra su esquina y deja el grueso del
  // cuadro en los tonos claros.
  u_gradGamma: 1.55,
  u_gradMix: 0.36,
  u_grain: 0.032,
  // Lento. Es todo el movimiento que tiene la pantalla.
  u_drift: 0.035,

  // Nueve capas a lo ancho del campo. Menos y se leen como tres franjas
  // decorativas; más y el ancho de cada una baja del de sus propias estrías, con
  // lo que la estructura desaparece y vuelve a ser un solo campo.
  u_layers: 9.0,
  u_seam: 0.16,
  u_seamLift: 0.2,

  // Un nivel de 8 bits medido sobre el ÍNDICE de la rampa, no sobre el color:
  // el índice recorre 0..1 en cuatro tramos y cada tramo cubre la distancia
  // entre dos paradas, así que un nivel son ~0.006 y no 1/256.
  u_dither: 0.007,

  u_c0: hexToRgb("#f7f7ef"),
  u_c1: hexToRgb("#e6ecd2"),
  u_c2: hexToRgb("#c2d8b4"),
  u_c3: hexToRgb("#8fb894"),
  u_c4: hexToRgb("#4a7a63"),
};

export default function Hero() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    const shut = `inset(${TUCK.y}% ${TUCK.x}% round ${RADIUS}px)`;

    mm.add(MQ.reduce, () => {
      const frame = q("[data-tuck-frame]")[0];
      const copy = q("[data-tuck-copy]")[0];
      if (!frame) return;

      gsap.set(frame, { clipPath: shut });
      if (copy) gsap.set(copy, { scale: 0.9, y: -window.innerHeight * (TUCK.y / 100) });

      return () => gsap.set([frame, ...(copy ? [copy] : [])], { clearProps: "all" });
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

      // El encuadre se cierra. `power2.inOut`: los primeros píxeles de scroll son
      // exploratorios y un hero que salta al primer roce se siente frágil; el
      // final frena, que es como se apoya algo que tiene peso.
      tl.fromTo(
        frame,
        { clipPath: "inset(0% 0% round 0px)" },
        { clipPath: shut, ease: "power2.inOut", duration: 0.72 },
        0
      );

      // La copy hace dos cosas a la vez, y sólo una es estética.
      //
      // El `scale` acompaña, pero mucho menos que la caja: la tarjeta pierde
      // ~22% de alto y ella sólo un 10%. Encogiéndola a la par se leería como un
      // zoom-out del conjunto, que es justo la lectura que el `clip-path` viene
      // a evitar.
      //
      // El `y` es obligatorio: sube lo mismo que sube el borde inferior del
      // encuadre, o el texto queda partido por el recorte. Ver la nota de
      // arriba.
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
          0
        );
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([frame, ...(copy ? [copy] : [])], { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // La sección mide el recorrido MÁS una pantalla. No lleva `overflow` —va en
    // el hijo pegado—, pero sí conserva el `isolate`: es lo que impide que los
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
            uniforms={SURFACE}
            tag="protocol-hero"
            fallback="#eef0e4"
            // Buffer a resolución plena, contra el 0.6 que trae `GlSurface`. Aquel
            // valor está calibrado para superficies SIN bordes —el follaje de la
            // home es blur puro y lo que se pierde al escalar no se ve— y ésta tiene
            // estructura: nueve capas con su juntura y estrías finas. A 0.6 cada
            // borde diagonal muestra escalones, y el grano se cuantiza en bloques de
            // dos píxeles, con lo que deja de hacer de dither y el degradé bandea.
            renderScale={1}
            // 1:1 con la pantalla. El tope de 1.75 obliga a un reescalado
            // FRACCIONARIO en cualquier display a dpr 2: la interpolación reparte
            // cada píxel del buffer entre uno y dos de pantalla según dónde caiga,
            // así que el suavizado no es uniforme y los bordes diagonales quedan
            // escalonados de forma irregular.
            maxDpr={2}
            className="absolute inset-0 z-0 h-full w-full"
          />

          {/* Velo de LEGIBILIDAD, plano y sólo al pie. El bloque de cuerpo y salida
              cae sobre la zona donde las estrías todavía tienen contraste. No llega
              al borde inferior con el color de la sección siguiente — eso sería un
              degradé de transición, y acá el corte entre secciones se ve. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, transparent 46%, rgba(247,247,239,0.55) 74%, rgba(247,247,239,0.72) 100%)",
            }}
          />

          <Container data-tuck-copy className="relative z-20 grid-ds items-end gap-y-8 pb-16">
            <div className="col-span-full flex flex-col gap-6 lg:col-span-7">
              <p className="uppercase text-eyebrow-mono text-gray-intermediate">{HERO.eyebrow}</p>
              <h1 className="text-h1 text-balance">
                {HERO.lead}
                <br />
                <Accent display>{HERO.accent}</Accent>
              </h1>
            </div>
            <div className="col-span-full flex flex-col gap-6 lg:col-start-9 lg:col-span-4">
              <p className="max-w-[36ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
              <CtaPill href={HERO.cta.href} tone="filled" external>
                {HERO.cta.label}
              </CtaPill>
            </div>
          </Container>

        </div>
      </div>
    </section>
  );
}
