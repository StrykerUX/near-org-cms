"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, Observer, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DUR, EASE } from "@/components/sections/homepage-e/motion";
import HeroFoliage from "@/components/sections/homepage-e/HeroFoliage";
import { MQ } from "@/components/primitives/motion/motionTokens";
import {
  BEATS,
  SEQUENCE_DURATION,
  freezeScroll,
  playSequence,
  rewindSequence,
} from "@/components/sections/homepage-e/heroSequence";

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

// ── El hero no cuesta scroll ────────────────────────────────────────────────
//
// Un `margin-bottom` de -100svh —su alto exacto— lo saca del cómputo y deja a
// `AgentEconomy` empezando en el mismo punto del documento que él, solapados.
// El hero se pinta encima (`z-10`) y el scroll de los dos lo aporta el track de
// la sección de abajo.
//
// Eso no es un truco de layout, es lo que el efecto necesita: la sección de
// abajo tiene su stage en `sticky top-0`, y un sticky solo se pega cuando su
// contenedor llega al tope del viewport. Si el hero costara su alto, el track
// arrancaría una pantalla más abajo y el icono que se revela detrás del recorte
// llegaría al centro RECIÉN cuando el hero ya cerró — subiendo mientras el hero
// se abre, que es lo contrario del gesto. Solapados, el stage está pegado desde
// el primer píxel y el icono ya está centrado y quieto cuando el borde lo
// empieza a descubrir.
//
// Y desde que la secuencia dejó de scrubbearse hay un segundo motivo, más duro:
// durante la animación el scroll está CONGELADO. Si el hero costara scroll, ese
// scroll no se podría gastar mientras corre la secuencia y la página quedaría
// trabada con el hero todavía ocupando su lugar.
//
// El margen NO va en el JSX: lo pone `gsap.set` dentro del `matchMedia`, así
// que existe solo cuando la secuencia existe. Con `prefers-reduced-motion` no
// hay secuencia, el hero se ve entero, y un margen negativo ahí lo solaparía con
// la sección siguiente sin nada que los separe.

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

      // Va PRIMERO, antes de crear cualquier ScrollTrigger: cambia la altura
      // del documento, y un trigger creado antes mediría contra el layout viejo.
      // -100svh es el alto del propio hero: lo saca entero del flujo.
      //
      // `style.setProperty` y no `gsap.set`: la unidad es `svh`, la misma que el
      // `height` del hero, y tiene que serlo —en móvil `vh` mide contra el
      // viewport con la barra de URL colapsada y el margen dejaría de cancelar
      // el alto exacto—. GSAP normaliza unidades al escribir y `svh` no está
      // entre las que conoce; escribir el estilo directo no deja lugar a dudas.
      // El cleanup lo saca a mano por lo mismo: `mm.revert()` solo deshace lo
      // que GSAP escribió.
      scope.style.setProperty("margin-bottom", "-100svh");
      cleanups.push(() => scope.style.removeProperty("margin-bottom"));

      const wrap = q("[data-hero-wrap]")[0];
      const fade = q("[data-hero-topfade]")[0];

      // ── 1. La salida del hero, como UN timeline ───────────────────────────
      //
      // Los cuatro movimientos de la salida —el fundido superior, el descuelgue
      // de la copy, su crecida y el recorte del borde inferior— viven en un solo
      // timeline en pausa. Antes eran cuatro ScrollTriggers con `scrub`, cada
      // uno leyendo la misma posición de scroll.
      //
      // Lo que cambió no es el gesto sino de quién es: el lector lo DISPARA con
      // el primer scroll y después no lo maneja. Un scrub le entrega la
      // velocidad al dedo, y la velocidad del dedo depende del dispositivo —el
      // mismo cierre salía a tirones en un trackpad y de golpe en una rueda con
      // detentes. Con reloj propio, sale igual siempre.
      //
      // El otro motivo es que el statement de abajo tiene que engancharse a
      // ESTO. Sincronizarlos por scroll funcionaba porque los dos leían la misma
      // posición; sin esa referencia común, los tiempos tienen que ser
      // explícitos y compartidos. Viven en `heroSequence.ts`.
      const exit = gsap.timeline({ paused: true });

      // El fundido superior tapa con crema desde arriba mientras el borde come
      // desde abajo. Es la otra mitad del cierre — aquel corta, este tapa.
      if (fade) {
        exit.fromTo(fade, { opacity: 0 }, { opacity: 1, duration: BEATS.clip, ease: "power1.out" }, 0);
      }

      // La copy se descuelga y CRECE. Van juntos en el mismo tween porque son
      // dos props del mismo transform; separarlos no aporta nada ahora que
      // comparten timing.
      //
      // Hubo una versión con contra-movimiento —el texto bajando un 25% y el
      // fondo subiendo un 15%— y era demasiado: con el fondo desplazándose, el
      // hero entero se leía como si se despegara de la página. Acá el fondo está
      // QUIETO.
      if (wrap) {
        exit.fromTo(
          wrap,
          { y: 0, scale: 1 },
          {
            y: () => 0.06 * scope.getBoundingClientRect().height,
            scale: 1.35,
            duration: BEATS.clip,
            ease: "power1.in",
          },
          0
        );
      }

      // El borde inferior recorta el hero.
      //
      // Arranca en `0%` —el recorte responde desde el primer frame—. Hubo una
      // versión que arrancaba en `-25%` (un rectángulo que excede el border box
      // y por lo tanto no recorta) para proteger el sobrante del fondo. Ese
      // sobrante ya no existe: era del `<video>` que sobresalía por abajo, y
      // `HeroFoliage` va `inset-0`, encerrado en el hero.
      //
      // Los cuatro lados van en `%` y no mezclados con px: GSAP interpola
      // `inset()` lado a lado, y una unidad distinta por lado le deja pares que
      // no puede promediar.
      //
      // `power2.out` sale disparado y desacelera contra el final: suave sin
      // hacerse esperar. Un `in` arrancaría plano y ese tramo muerto se lee como
      // retardo aunque el timeline haya empezado.
      exit.fromTo(
        scope,
        { clipPath: "inset(0% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 100% 0%)", duration: BEATS.clip, ease: "power2.out" },
        0
      );

      // ── 2. Quién aprieta el botón ─────────────────────────────────────────
      //
      // `Observer` y no un ScrollTrigger: lo que dispara la secuencia es el
      // GESTO, no una posición. Con el scroll congelado durante la secuencia la
      // página no se mueve, así que no hay posición que cruzar — un
      // ScrollTrigger no llegaría a dispararse nunca.
      //
      // `onDown` cubre rueda, trackpad y swipe táctil bajo la misma firma.
      //
      // El guard de `scrollY` es para las recargas a media página: el navegador
      // restaura la posición, el lector cae en cualquier lado y su primer scroll
      // no tiene por qué reproducir una intro que ya se perdió. Por debajo de una
      // pantalla el hero todavía manda; por encima, no.
      let played = false;
      let thawing: (() => void) | null = null;

      const play = () => {
        if (played) return;
        played = true;
        // El scroll se congela por la secuencia COMPLETA, no por la salida del
        // hero: lo que tiene que quedar terminado en cuadro es el statement, que
        // sigue después.
        thawing = freezeScroll(SEQUENCE_DURATION);
        exit.play();
        playSequence();
      };

      const rewind = () => {
        if (!played) return;
        played = false;
        thawing?.();
        thawing = null;
        exit.reverse();
        rewindSequence();
      };

      const observer = Observer.create({
        type: "wheel,touch",
        onDown: () => {
          if (window.scrollY > window.innerHeight) return;
          play();
        },
        // La vuelta también es un GESTO, y tiene que poder interrumpir.
        //
        // Esto faltaba y el síntoma era exacto: "puedo volver al hero, pero
        // después de un delay". El delay eran los ~2.2s de scroll congelado. El
        // lector subía, Lenis estaba parado, la página no se movía, y recién
        // cuando el `setTimeout` soltaba el freno el gesto empezaba a contar.
        // Un `ScrollTrigger` sobre la posición no podía cubrirlo: la posición no
        // cambia mientras el scroll está congelado.
        //
        // `Observer` sí ve el evento nativo aunque Lenis esté parado, así que el
        // gesto hacia arriba rebobina en el acto — incluso a mitad de la
        // secuencia, que es cuando más se nota que no responde.
        //
        // El guard es `scrollY <= 1` y no `=== 0` por el redondeo subpíxel de
        // Lenis: al terminar la secuencia el scroll quedó en cero, y "cero" para
        // un scroll interpolado es cualquier cosa por debajo de un píxel.
        onUp: () => {
          if (window.scrollY > 1) return;
          rewind();
        },
      });
      cleanups.push(() => observer.kill());

      // El otro camino de vuelta: el lector que bajó varias pantallas y sube de
      // corrido hasta el tope. Ahí el gesto de arriba no alcanza —el `onUp` se
      // ignora mientras `scrollY` sea grande— y lo que cuenta es cruzar la
      // posición.
      //
      // `1` es una posición de scroll absoluta y acá eso es literalmente lo que
      // se quiere: un píxel, o sea "volvió al tope". Es el único punto donde
      // rebobinar tiene sentido — a media página el hero ya no está y rearmarlo
      // sería un salto.
      //
      // `rewind()` se autoignora si ya corrió, así que los dos caminos pueden
      // dispararse juntos sin pisarse.
      const top = ScrollTrigger.create({
        trigger: scope,
        start: 1,
        onLeaveBack: rewind,
      });
      cleanups.push(() => top.kill());

      // Si el componente se desmonta a mitad, el scroll se devuelve igual.
      cleanups.push(() => thawing?.());

      // ── 5. La intro: la niebla se retira ─────────────────────────────────
      //
      // El titular NO se anima. Está ahí desde el primer frame, con su
      // gradiente puesto; lo que se mueve es el velo de crema que lo tapa.
      //
      // Antes esto era un SplitText por palabras: "Own your" entraba escalonado
      // y "world." un beat después. Se fue por dos motivos. El de fondo es que
      // tres cosas moviéndose a destiempo en el primer segundo de la página se
      // leen como una animación de plantilla, no como una apertura; una sola
      // cosa moviéndose, y que sea el AMBIENTE en vez del texto, dice lo mismo
      // con menos voz. El otro es que arrastraba un problema estructural
      // documentado largo acá abajo: `background-clip: text` y SplitText no
      // pueden convivir —al partir el texto, cada palabra queda en un wrapper
      // con transform propio y el fondo del <h1> deja de alcanzarla—, así que el
      // gradiente tenía que esperar detrás de un `data-intro="done"` y encenderse
      // recién al terminar. Sin split, ese acoplamiento desaparece: el gradiente
      // es del <h1> y punto.
      //
      // El velo es el MISMO degradé permanente que hace que el fondo emerja del
      // crema en vez de estar pegado encima (ver su comentario en el JSX). La
      // intro no agrega una capa: agranda esa. Escalado desde su borde superior
      // cubre el hero entero y el titular queda casi tapado; al volver a 1, la
      // niebla se retira hacia arriba y lo destapa de abajo hacia arriba.
      //
      // `scaleY` y no `height`: el degradé se estira con la caja —que es lo que
      // se quiere, un velo más difuso mientras es más alto— y el navegador lo
      // resuelve en el compositor, sin recalcular layout en cada frame.
      const veil = q("[data-hero-veil]")[0];
      if (veil) {
        const intro = gsap.fromTo(
          veil,
          { scaleY: 1.9 },
          {
            scaleY: 1,
            duration: DUR.slow * 1.6,
            ease: EASE.out,
            transformOrigin: "top center",
          }
        );
        cleanups.push(() => {
          intro.kill();
          gsap.set(veil, { clearProps: "transform" });
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
      // `overflow-hidden`, y hasta agosto de 2026 NO lo tenía: el `<video>` del
      // hero sobresalía por abajo a propósito, para que la imagen no muriera en
      // un corte recto contra el crema de la sección siguiente. Ese video ya no
      // existe —`HeroFoliage` va `inset-0`, encerrado— y el corte lo hace ahora
      // el `clip-path` de la salida.
      //
      // Volvió porque hacía falta: la copy se escala a 1.35 al salir, y un
      // `Container` de 1780px escalado desborda el ancho del viewport. Sin
      // recorte eso es scroll LATERAL en toda la página — el síntoma aparece a
      // mitad de la animación y no se parece en nada a su causa.
      // `z-10`: el `margin-bottom` negativo mete la sección siguiente DEBAJO del
      // hero en el flujo, y sin z el orden de pintado la dejaría encima —
      // taparía el hero en vez de asomar por el recorte. El hero va arriba y lo
      // que se ve en la zona recortada es lo que hay atrás.
      className="relative z-10 flex flex-col overflow-hidden bg-cream text-foreground"
    >
      {/* El fondo. Llena el hero exacto y no se mueve.

          Tuvo un wrapper sobredimensionado (`-inset-y-[20%]`) cuando el fondo
          hacía parallax: al subirlo, sin ese margen el borde inferior se
          despegaba del final del hero y dejaba asomando el crema de la página.
          Sin movimiento, ese margen solo pintaba píxeles que nadie ve. */}
      <HeroFoliage className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      {/* Velo permanente: tapa con crema el 20% superior del video y lo suelta
          hacia abajo. Es lo que hace que la imagen "emerja" del fondo de la
          página en vez de estar pegada encima. */}
      <div
        data-hero-veil
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] h-[82%] w-full will-change-transform"
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

      {/* El padding es asimétrico —más abajo que arriba— y eso es lo que sube
          el titular: el bloque está centrado con `justify-center`, así que no se
          lo puede mover con un `translate` sin pelearse con GSAP, que anima la
          `y` de ESTE mismo elemento en el parallax. Un transform de Tailwind acá
          lo pisa el tween y el titular vuelve solo a su sitio en el primer
          frame. El padding, en cambio, mueve la caja de centrado y el tween
          sigue midiendo desde donde quedó.

          `text-display` vive acá y no en el `<h1>` para que el `em` de abajo
          tenga contra qué medir: el token es el 1em del titular, y el `1.08em`
          lo escala DESDE la escala en vez de reemplazarla. Puesto en el mismo
          elemento, el `em` resolvería contra el body y el token quedaría
          anulado. `line-height` (unitless) y `letter-spacing` (en em) heredan y
          se recomputan contra el tamaño nuevo — que es exactamente lo que se
          quiere: el titular crece sin desarmar su interlineado ni su tracking. */}
      <Container
        data-hero-wrap
        className="relative z-[2] flex flex-1 flex-col items-center justify-center pb-28 pt-14 text-center text-display"
      >
        {/* Fondo Y clip van siempre juntos: el fondo sin el clip pinta un
            rectángulo negro detrás de un texto negro. Desde que la intro no
            parte el texto, los dos pueden vivir acá sin condición — el
            acoplamiento con SplitText que los tenía detrás de un `data-intro`
            está explicado en el bloque de motion. */}
        <h1
          data-hero="heading"
          className="bg-clip-text text-[1.08em] text-transparent text-pretty [background-image:linear-gradient(135deg,#000_0%,#000_55%,var(--ink-deep)_100%)]"
        >
          Own your <Accent display>world.</Accent>
        </h1>
      </Container>
    </section>
  );
}
