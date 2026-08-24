"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, MQ } from "@/components/primitives/motion/motionTokens";
import HeroFoliage from "@/components/sections/homepage-shared/HeroFoliage";

// El hero que se recoge: de ocupar la pantalla entera a quedar guardado en una
// tarjeta, y de ahí la página sigue.
//
// ── En qué se diferencia del pliegue ────────────────────────────────────────
//
// `HeroFold` (rutas f–i) comprime el paisaje hasta meterlo dentro de la
// tipografía: el hero DESAPARECE y deja un objeto en su lugar. Acá no
// desaparece nada. El hero se encoge, le salen bordes y esquinas blandas, y se
// queda ahí como una pieza de la página — sin iconos, sin palabras que se
// transformen, sin nada que reemplace a nada.
//
// Es un gesto más callado y más común, y esa es justamente la comparación que
// esta ruta viene a hacer: si el pliegue resulta demasiado, esto es lo que
// queda cuando se le saca el truco y solo se conserva el cambio de escala.
//
// ── Por qué `clip-path` y no un `transform` ─────────────────────────────────
//
// Un `scale` encogería el CONTENIDO: el paisaje se vería alejado, como si la
// cámara retrocediera, y el titular se haría chico con él. Lo que se quiere es
// lo contrario — que el encuadre se cierre pero lo que hay dentro siga a su
// tamaño, como una ventana que se achica sobre una vista que no se mueve.
//
// `clip-path: inset()` hace exactamente eso, y encima es interpolable de punta
// a punta (incluido su `round`) y no toca el layout: el canvas de `HeroFoliage`
// nunca re-mide ni re-renderiza a otra resolución.
//
// El titular sí se achica un poco, pero con su propio tween y bastante menos
// que la caja: acompaña el gesto sin quedar minúsculo.

/** Cuánto scroll cuesta el recogido. */
const TRAVEL = "80svh";

/** Cuánto margen le queda a la tarjeta, en % del viewport. */
const TUCK = { y: 11, x: 6 } as const;

/** El radio de la tarjeta, en px. Constante: acá nada se escala. */
const RADIUS = 34;

export default function HeroTuck() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    const shut = `inset(${TUCK.y}% ${TUCK.x}% round ${RADIUS}px)`;

    // Sin motion: la tarjeta, ya recogida. El estado final y no el inicial —
    // un hero a sangre que promete un gesto que nunca llega es peor que uno
    // que no lo promete.
    mm.add(MQ.reduce, () => {
      const frame = q("[data-tuck-frame]")[0];
      const copy = q("[data-tuck-copy]")[0];
      if (!frame) return;

      gsap.set(frame, { clipPath: shut });
      if (copy) gsap.set(copy, { scale: 0.9 });

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
          // `bottom bottom` es el último frame en que la escena está pegada.
          // Con `bottom top` el recogido terminaría un viewport más tarde, o
          // sea con la tarjeta ya fuera de cuadro.
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
        { clipPath: `inset(0% 0% round 0px)` },
        { clipPath: shut, ease: "power2.inOut", duration: 0.72 },
        0
      );

      // El titular acompaña, pero mucho menos que la caja: la tarjeta pierde
      // ~22% de alto y él solo un 10%. Encogiéndolo a la par se leería como un
      // zoom-out de todo el conjunto, que es justo la lectura que el
      // `clip-path` viene a evitar.
      if (copy) {
        tl.fromTo(copy, { scale: 1 }, { scale: 0.9, ease: "power2.inOut", duration: 0.72 }, 0);
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
    <section
      ref={rootRef}
      style={{ "--tuck-travel": TRAVEL } as React.CSSProperties}
      className="relative h-[calc(var(--tuck-travel)+100svh)] bg-cream text-foreground"
    >
      {/* `overflow-hidden` sobre el hijo pegado y nunca sobre la sección: un
          ancestro con overflow distinto de `visible` se vuelve el contenedor de
          scroll del sticky y este deja de pegarse, en silencio. */}
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* La ventana. Todo lo que se ve del hero vive acá dentro y se recorta
            con ella — el paisaje y el titular a la vez, que es lo que hace que
            se lean como una sola pieza guardándose. */}
        <div data-tuck-frame className="absolute inset-0 flex flex-col">
          <HeroFoliage className="pointer-events-none absolute inset-0 h-full w-full" />

          {/* Reserva del nav, que es `fixed` y no ocupa flujo. */}
          <div aria-hidden="true" className="h-[5.5rem] shrink-0" />

          <Container
            data-tuck-copy
            className="relative z-[1] flex flex-1 flex-col items-center justify-center pb-28 pt-14 text-center text-display"
          >
            <h1 className="text-[1.08em] text-pretty">
              Own your <Accent display>world.</Accent>
            </h1>
          </Container>
        </div>
      </div>
    </section>
  );
}
