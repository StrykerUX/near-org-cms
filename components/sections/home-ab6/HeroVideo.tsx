"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { createVideoScrub } from "@/components/primitives/motion/videoScrub";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "@/components/sections/home-ab6/heroGeometry";

// ── Geometría: la unidad `--u` ───────────────────────────────────────────────
// El encastre entre el hero y QuantumBars sale de una sola unidad: el ancho de
// una de las 7 columnas de la escalera.
//
//   alto del hero  = 100svh              (el hero llena la pantalla)
//   alto del video = 100%                (el video llena el hero)
//   top de QuantumBars = −u·1.5 − 2px    (monta sobre el final del hero)
//
// De ahí, el bloque sólido de las barras arranca en `100svh − 2px`: el margen
// negativo sube la sección u·1.5 y el bloque vive a `top: u·1.5` dentro de ella,
// así que los dos bordes coinciden justo en la juntura y la imagen muere por
// debajo de la escalera sin dejar franja visible. En cualquier ventana, sin medir
// nada. Los 2px son costura antisubpíxel, no un solape de diseño.
//
// ── Por qué NO se replica la fórmula del original ────────────────────────────
// El HTML de referencia usa `100vh − u·1.75` con un piso de 760px, y el video a
// `100% + u·1.5`. Eso hace que el hero NO llene la pantalla: en cuanto el
// viewport es más alto que el hero (a 1650px de ancho, cualquier ventana de más
// de ~1045px de alto) queda una franja entre el final del video y las barras
// —que a scroll 0 están en `scaleY: 0`— y se ve el crema de la página. El
// original arrastra ese mismo bug; acá el hero llena el viewport y el problema
// desaparece en origen en vez de parchearse con un `max()`.

// ── Ajustes del scrub ────────────────────────────────────────────────────────
//
// Fracción del clip que se recorre en un scroll completo del hero (el
// `data-hero-scrub` del original, que venía en 0.5).
//
// Va en 1.0 = el clip entero, y eso es lo que más aporta a la fluidez. El hero
// dura ~760px de scroll: con 0.5 se repartían ~96 frames sobre esa distancia
// (uno cada ~7.9px) y el descenso se leía a pasos. Con el clip completo son 193
// frames, uno cada ~3.9px. No cuesta un byte —el mp4 ya está descargado entero—
// y el clip es un descenso continuo, así que no había ninguna razón de contenido
// para usar solo la mitad.
const SCRUB_RATE = 1;

// fps del asset. NO hay forma de leerlo desde el navegador: ningún API de
// <video> lo expone. Está medido con `ffprobe` sobre
// public/prototype/v2/hero-descent.mp4 (24/1, 193 frames en 8.04s) y hay que
// actualizarlo a mano si el archivo se re-encodea. Qué hace con esto el lazo de
// scrub está documentado en `primitives/motion/videoScrub`.
const FPS = 24;

// Factor del lazo de persecución. Más alto = el video sigue al scroll más de
// cerca, pero con saltos más secos entre frame y frame; más bajo = más suave y
// más retrasado. Este amortiguado es justamente lo que disimula el escalonado,
// así que subirlo de más lo devuelve.
//
// Van explícitos aunque coincidan con los defaults de `createVideoScrub`: están
// calibrados contra ESTE clip (un descenso continuo de 8s) y no son un valor
// genérico que convenga heredar sin mirar.
const CHASE = 0.14;
// Cerca del final se persigue más despacio, para que el último tramo "atraque"
// en vez de frenar de golpe.
const CHASE_DOCKING = 0.09;

export default function HeroVideo() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      // Un solo cleanup para todo lo que no es un tween (rAF, listeners del
      // <video>, el split): gsap.context revierte los tweens solo, pero de esto
      // no sabe nada.
      const cleanups: (() => void)[] = [];

      const video = q("[data-hero-bg]")[0] as HTMLVideoElement | undefined;
      const wrap = q("[data-hero-wrap]")[0];
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

      // ── 2. Parallax de la copy ────────────────────────────────────────────
      // El texto sale ~20% más rápido que la página.
      if (wrap) {
        gsap.fromTo(
          wrap,
          { y: -20 },
          {
            y: () => -20 - 0.2 * scope.getBoundingClientRect().height,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // ── 3. El video, scrubbeado por scroll ────────────────────────────────
      //
      // El scroll NO escribe `currentTime` directamente: solo mueve un objetivo,
      // y un lazo de rAF lo persigue. Eso deja el video un pelo por detrás del
      // scroll, que es justo lo que se lee como movimiento de cámara suave en
      // vez de como una diapositiva atada al dedo.
      //
      // Encima de ese lazo hay tres filtros —snap a frame, tope por buffer
      // descargado y contrapresión de seeks— y los tres viven en
      // `primitives/motion/videoScrub`, con el porqué de cada uno documentado ahí.
      //
      // El asset ya es all-intra (193 frames, 193 keyframes), así que el seek en
      // sí es barato: lo que sobraba era la cantidad de seeks, no su coste.
      //
      // El original además descargaba el mp4 entero a un Blob antes de
      // scrubbear, porque su servidor de preview no responde HTTP Range y sin
      // eso el <video> no es seekable. Next sirve public/ con Range en dev y en
      // producción, así que ese rodeo (y el mp4 completo en RAM) no hace falta.
      //
      // Este lazo nació inline acá, se extrajo cuando `quantum/FieldBreak`
      // necesitó lo mismo, y esta llamada cierra la migración: eran ~95 líneas de
      // lógica delicada duplicada, y la copia de acá arrastraba además una mezcla
      // de unidades en `target` (a veces fracción de progreso, a veces segundos).
      if (video) {
        const scrub = createVideoScrub(video, {
          fps: FPS,
          chase: CHASE,
          chaseDocking: CHASE_DOCKING,
        });

        ScrollTrigger.create({
          trigger: scope,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => scrub.setProgress(self.progress * SCRUB_RATE),
        });

        cleanups.push(scrub.destroy);
      }

      // ── 4. Intro del titular ──────────────────────────────────────────────
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
      style={{ "--u": HERO_UNIT, height: "100svh" } as React.CSSProperties}
      // Sin `overflow-hidden`: el video SOBRESALE del hero por abajo a
      // propósito, y recortarlo a la caja de la sección es justo lo que hace que
      // la imagen termine en un corte recto en vez de continuar bajo los
      // escalones de QuantumBars.
      className="relative flex flex-col bg-cream text-foreground"
    >
      {/* Sin `autoPlay`: es una textura conducida por el scroll.

          `preload="metadata"` y no `auto`: el asset son 12.7MB y con `auto` el
          navegador los baja ENTEROS antes de que el lector haya scrolleado un
          píxel, compitiendo con las fuentes y el resto del hero por ancho de
          banda. Con `metadata` baja la cabecera —suficiente para saber duración y
          dimensiones, que es lo que el scrub necesita para armarse— y el resto lo
          pide por rangos HTTP a medida que hace seek. Next sirve public/ con Range
          en dev y en producción, y `videoScrub` ya nunca pide más allá de lo
          descargado (su `bufferedUntil`), así que el peor caso es que los primeros
          seeks se queden en el último frame disponible en vez de bloquear el
          decoder.

          El `poster` es el primer frame del propio clip, extraído con ffmpeg
          (59KB). Dos cosas se arreglan con él: el hero ya no arranca vacío
          esperando que el video decodifique —el poster ES lo que se va a ver, así
          que el reemplazo es invisible—, y sobre todo el caso
          `prefers-reduced-motion`, donde el bloque de scrub no corre, `onMeta`
          nunca se ejecuta, nunca se pide un primer frame y el hero se quedaba en
          NEGRO. */}
      <video
        data-hero-bg
        src="/prototype/v2/hero-descent.mp4"
        poster="/prototype/v2/hero-descent-poster.jpg"
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 w-full object-cover object-bottom"
        // El video llena el hero, y punto. Como el hero mide 100svh y el bloque
        // sólido de las barras arranca en `100svh − u·0.25`, el video ya pasa de
        // largo ese punto y el gris lo tapa: no hay juntura que ajustar ni
        // franja que pueda asomar. Ver la nota de geometría arriba.
        style={{ height: "100%" }}
      />

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
