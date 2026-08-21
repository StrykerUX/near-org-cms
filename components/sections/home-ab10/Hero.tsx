"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import HeroFoliage from "@/components/sections/home-ab10/HeroFoliage";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// ── Geometría: el hero llena la pantalla ─────────────────────────────────────
//
//   alto del hero  = 100svh              (el hero llena la pantalla)
//   alto del video = 100%                (el video llena el hero)
//
// En ab7 el hero declaraba además una unidad `--u` (un séptimo del viewport, el
// ancho de una columna de la escalera de `QuantumBars`) de la que colgaba la
// juntura con esa sección. ab10 no monta QuantumBars, así que la unidad se fue
// con ella: nadie la consumía en este archivo, solo la declaraba para la vecina.
//
// ── Por qué NO se replica la fórmula del original ────────────────────────────
// El HTML de referencia usa `100vh − u·1.75` con un piso de 760px, y el video a
// `100% + u·1.5`. Eso hace que el hero NO llene la pantalla: en cuanto el
// viewport es más alto que el hero queda una franja entre el final del video y
// lo que siga, y se ve el crema de la página. El original arrastra ese mismo
// bug; acá el hero llena el viewport y el problema desaparece en origen en vez
// de parchearse con un `max()`.

// ── El fondo ────────────────────────────────────────────────────────────────
//
// Era un <video> de 19MB (`hero-descent-v2.mp4`, 1440p all-intra) scrubbeado
// por scroll, con todo lo que eso arrastraba: snap a frame, tope por buffer
// descargado, contrapresión de seeks y un lazo de persecución para disimular el
// escalonado. Ahora es un shader — `HeroFoliage`, unos 8KB de GLSL— y nada de
// eso hace falta: no hay frames que buscar ni red que esperar.
//
// Lo que se PIERDE con el cambio, y conviene tener presente: el fondo ya no
// responde al scroll. El clip era un descenso continuo y el scrub lo ataba al
// dedo del lector; el shader tiene una deriva lenta propia y nada más. Atarlo
// al scroll es un uniforme más (la fase entra donde hoy entra `u_time`), pero
// es una decisión de diseño que no se tomó todavía.

export default function Hero() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      // Un solo cleanup para todo lo que no es un tween (rAF, listeners del
      // <video>, el split): gsap.context revierte los tweens solo, pero de esto
      // no sabe nada.
      const cleanups: (() => void)[] = [];

      const wrap = q("[data-hero-wrap]")[0];
      const bg = q("[data-hero-bg]")[0];
      const fade = q("[data-hero-topfade]")[0];
      const heading = q("[data-hero='heading']")[0];
      const rest = q("[data-hero='sub']");

      // ── 1. Fundido superior ligado al scroll ──────────────────────────────
      // Empieza invisible y sube con el scroll, tapando el video contra el
      // crema. Con reduced-motion este tween no se crea y el gradiente queda
      // opaco (su valor CSS): la juntura sigue leyéndose, solo que sin
      // transición.
      if (fade) {
        gsap.fromTo(
          fade,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            immediateRender: true,
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "40% top",
              scrub: true,
              invalidateOnRefresh: true,
              markers: DEBUG_MARKERS,
            },
          }
        );
      }

      // ── 2. Parallax en CONTRA ─────────────────────────────────────────────
      //
      // El texto BAJA y el fondo SUBE. Los dos se mueven, en sentidos
      // opuestos, y esa es toda la diferencia con lo que había antes: la copy
      // subía un 20% de la altura del hero y el fondo estaba quieto, así que la
      // separación entre los dos era ese 20% y nada más.
      //
      // Ahora la separación es la SUMA de los dos recorridos (25% + 15% = 40%
      // de la altura del hero), o sea el doble, y encima repartida en dos
      // direcciones — que es lo que se lee como profundidad y no como "el texto
      // se despega". El texto yéndose hacia abajo mientras el fondo se va hacia
      // arriba deja además el titular más tiempo en pantalla al empezar a
      // scrollear, porque va A FAVOR de la dirección del scroll.
      //
      // `ease: "none"` en los dos: con scrub, la curva la pone el dedo del
      // lector. Cualquier easing acá se lee como que el scroll "resbala".
      const H = () => scope.getBoundingClientRect().height;
      const track = {
        trigger: scope,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      } as const;

      if (wrap) {
        gsap.fromTo(
          wrap,
          { y: 0 },
          { y: () => 0.25 * H(), ease: "none", immediateRender: false, scrollTrigger: track }
        );
      }

      // El fondo va a la mitad del recorrido del texto: si los dos se movieran
      // lo mismo, el contra-movimiento se leería como un corte, no como planos
      // a distinta profundidad. Lo que está más lejos se mueve menos.
      if (bg) {
        gsap.fromTo(
          bg,
          { y: 0 },
          { y: () => -0.15 * H(), ease: "none", immediateRender: false, scrollTrigger: track }
        );
      }

      // ── 3. Intro del titular ──────────────────────────────────────────────
      //
      // ⚠️ El gradiente del <h1> y SplitText NO PUEDEN convivir.
      //
      // El titular se pinta con `background-clip: text` + `color: transparent`:
      // el color sale del fondo del <h1>, recortado a la silueta de sus letras.
      // Cuando SplitText parte el texto, cada palabra queda dentro de un wrapper
      // con `overflow: hidden` y su propio transform, y el fondo del <h1> deja de
      // alcanzarlas. Las letras siguen siendo transparentes, pero ya no hay nada
      // detrás que las rellene: el titular se vuelve INVISIBLE, y encima justo al
      // terminar la animación (que es cuando parece que "debería" aparecer).
      //
      // Por eso el gradiente vive detrás de `data-intro="done"` —fondo Y clip
      // juntos, nunca uno sin el otro— y ese atributo se enciende recién después
      // de `split.revert()`, con el markup original ya restaurado. Durante la
      // animación el texto es negro sólido; el cambio no se nota porque el
      // gradiente TAMBIÉN es negro en su primer 55%.
      if (heading) {
        gsap.set(rest, { autoAlpha: 0, y: 16 });

        let split: SplitText | null = null;
        // `fonts.ready` es una promesa, y el cleanup de abajo puede correr antes
        // de que resuelva: en dev pasa en cada mount por StrictMode, y en
        // producción con cualquier navegación rápida. Sin este flag, `run()` hacía
        // SplitText sobre un nodo ya revertido y creaba una timeline fuera del
        // gsap.context que ya se cerró — o sea tweens que nadie va a limpiar,
        // escribiendo sobre un DOM desconectado.
        let cancelled = false;

        const run = () => {
          if (cancelled) return;
          // Nada de `autoSplit` ni de `onSplit`.
          //
          // `autoSplit` re-partiría el titular al cambiar los anchos,
          // deshaciendo el revert de abajo y devolviendo las letras al estado
          // transparente-sin-fondo. Y `onSplit` deja a SplitText como dueño del
          // timeline que devuelve, lo que vuelve REENTRANTE llamar a `revert()`
          // desde su `onComplete`: el revert se come los tweens que ese mismo
          // callback acababa de crear — así fue como el subtítulo se quedaba en
          // `opacity: 0` para siempre mientras el título sí terminaba bien.
          //
          // Partir una vez, animar, y revertir al final. Sin callbacks anidados.
          split = SplitText.create(heading, { type: "words", mask: "words" });
          const words = split.words;
          // "world." entra un beat después que el resto, no dentro del stagger:
          // es la palabra en cursiva y el remate de la frase.
          const lead = words.slice(0, -1);
          const last = words.slice(-1);

          // El timeline no espera al video. El original espera el evento
          // `playing`, pero en modo scrub el video está pausado a propósito y
          // ese evento no llega nunca: el titular aparecía por su temporizador
          // de rescate, 1.8s tarde. Cualquier variante del gate hereda eso.
          const tl = gsap.timeline();
          tl.from(lead, {
            yPercent: 110,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: "power3.out",
          }, 0);
          tl.from(last, {
            yPercent: 110,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
          }, 0.42);
          // El subtítulo entra montado sobre el final del titular, y va DENTRO
          // del timeline: como paso de la coreografía, no como efecto colateral
          // de un callback.
          tl.to(rest, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.45");
          tl.call(() => {
            // Recién acá, con todo terminado: primero devolver el markup, y
            // DESPUÉS encender el gradiente. Al revés, el clip caería sobre las
            // palabras todavía enmascaradas y el titular desaparecería.
            split?.revert();
            heading.dataset.intro = "done";
          });
        };

        // El split se hace cuando las fuentes ya midieron. Hasta entonces el
        // titular se ve NORMAL (negro sólido, sin animar): si `fonts.ready` no
        // resuelve nunca, el peor caso es que no haya intro — no que no haya
        // titular.
        if (document.fonts?.ready) document.fonts.ready.then(run).catch(run);
        else run();

        cleanups.push(() => {
          cancelled = true;
          split?.revert();
          delete heading.dataset.intro;
        });
      }

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      // svh y no vh: en móvil, `vh` mide contra el viewport CON la barra de URL
      // colapsada, así que el hero sobresale y salta al scrollear. Mismo criterio
      // que NearStack y ProofStepper.
      style={{ height: "100svh" } as React.CSSProperties}
      // Sin `overflow-hidden`: el video SOBRESALE del hero por abajo a
      // propósito. En ab7 eso hacía que la imagen continuara por debajo de los
      // escalones de QuantumBars en vez de morir en un corte recto; acá abajo no
      // hay escalera, pero el sobrante sigue evitando el borde duro contra el
      // crema de la sección siguiente.
      className="relative flex flex-col bg-cream text-foreground"
    >
      {/* El fondo, en un wrapper que es lo que se anima.

          `-inset-y-[20%]` lo hace un 40% más alto que el hero, y eso NO es
          decorativo: el parallax lo sube un 15% de esa altura, y sin margen el
          borde inferior del canvas se despegaría del final del hero y dejaría
          una franja del crema de la página asomando. Con 20% arriba y abajo
          sobra holgura para el recorrido.

          El wrapper existe además para no animar el <canvas> en sí: moverlo con
          transform no cuesta nada, pero cambiarle la caja obligaría a
          `HeroFoliage` a re-dimensionar su buffer en cada frame del scroll —
          su ResizeObserver mira el elemento, no el wrapper. */}
      <div
        data-hero-bg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -inset-y-[20%] z-0"
      >
        <HeroFoliage className="h-full w-full" />
      </div>

      {/* Velo permanente: tapa con crema el 20% superior del video y lo suelta
          hacia abajo. Es lo que hace que la imagen "emerja" del fondo de la
          página en vez de estar pegada encima. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] h-[82%] w-full"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--cream) 0%, var(--cream) 20%, transparent 100%)",
        }}
      />

      {/* Segundo velo, este ligado al scroll: cierra el hero contra el crema a
          medida que se sale de él. */}
      <div
        data-hero-topfade
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] h-[60%] w-full"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--cream) 0%, rgba(245,244,241,0.9) 30%, transparent 100%)",
        }}
      />

      {/* Reserva el alto del nav, que es fixed y no ocupa flujo. Sin esto el
          bloque de texto se centraría en el hero entero y quedaría más alto que
          en la referencia, donde el nav sí empuja. */}
      <div aria-hidden="true" className="h-[5.5rem] shrink-0" />

      <Container
        data-hero-wrap
        className="relative z-[2] flex flex-1 flex-col items-center justify-center gap-6 py-14 text-center"
      >
        {/* Fondo Y clip van SIEMPRE juntos, en la misma variante. El fondo sin
            el clip pinta un rectángulo negro detrás de un texto negro; el clip
            sin markup limpio deja las letras transparentes sobre nada. Los dos
            se encienden juntos al terminar la intro — ver el bloque de motion. */}
        <h1
          data-hero="heading"
          className="text-display text-pretty data-[intro=done]:bg-clip-text data-[intro=done]:text-transparent data-[intro=done]:[background-image:linear-gradient(135deg,#000_0%,#000_55%,var(--ink-deep)_100%)]"
        >
          Own your
          <br />
          <Accent display>world.</Accent>
        </h1>

        <p data-hero="sub" className="max-w-xl text-body-lg text-muted-foreground text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access
          all of DeFi from your own wallet.
        </p>
      </Container>
    </section>
  );
}
