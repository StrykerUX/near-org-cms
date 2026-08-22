"use client";

import Image from "next/image";

import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { BEATS, onSequence } from "@/components/sections/homepage-update/heroSequence";
import { AGENT_ECONOMY as COPY } from "@/components/sections/homepage-update/homepageUpdateContent";

// El statement, revelado por el recorte del hero.
//
// Ocupa el lugar que en ab7 tenía `QuantumBars` —justo después del hero— y dice
// la misma frase que decía el card negro que estuvo acá hasta el 2026-08-22.
// No es ese card repintado: aquel era una caja `rounded-[32px]` flotando sobre
// el crema, con su campo de glifos detrás y el texto centrado. Lo único que
// sobrevivió es la frase.
//
// ── Cómo se engancha con el hero ─────────────────────────────────────────────
//
// Las dos secciones EMPIEZAN EN EL MISMO PUNTO del documento: el hero lleva un
// `margin-bottom` de -100svh —su alto exacto— así que no cuesta scroll propio y
// este track arranca solapado con él, debajo. Todo el scroll de la escena lo
// aporta este track.
//
// Ese solape es la condición del efecto, no una optimización. El stage está en
// `sticky top-0`, y un sticky solo se pega cuando su contenedor llega al tope
// del viewport: si el track empezara más abajo, el icono estaría entrando en
// cuadro mientras el hero se abre, en vez de esperarlo ya centrado.
//
//   antes del gesto    hero completo tapando la pantalla. El stage YA está
//                      pegado detrás, con el icono centrado y quieto. No se ve
//                      nada de él, y no hace falta scrollear para eso.
//   primer scroll      el hero congela la página y arranca la secuencia. Su
//                      borde inferior se come el hero y por el hueco aparece
//                      este icono, en su sitio desde el primer frame.
//   BEATS.iconAt       el icono arranca su viaje, montado sobre el final del
//                      recorte: sale a buscar su lugar mientras el hero termina
//                      de cerrarse.
//   BEATS.copyAt       el texto entra detrás, línea por línea.
//   fin                el scroll se devuelve, con el statement ya terminado en
//                      cuadro. El `HOLD` es lo que le queda de recorrido pegado.
//
// ── Esta sección NO decide cuándo ────────────────────────────────────────────
//
// El disparo vive en el hero, que es el dueño del gesto, y llega acá por el
// evento de `heroSequence`. Los tiempos también son de ahí. Nada en este archivo
// mide contra el scroll ni contra el hero: los dos miden contra el mismo reloj.
//
// Eso es lo que reemplazó al scrub. Con scroll, los dos componentes leían la
// misma posición y llegaban al mismo lado solos; sin él, dos timelines
// independientes empiezan cuando cada componente monta, que no es el mismo
// instante.
//
// Por eso el hero lleva `z-10` y esta sección no: el solape la deja debajo del
// hero en el flujo, y sin esa capa el orden de pintado la pondría encima —
// taparía el hero en vez de asomar por el recorte.
//
// ── Por qué el verde es literal ──────────────────────────────────────────────
//
// No sale de los tokens del DS porque no existe ahí: `--near-green` (#00ec97)
// es turquesa y sobre crema se lava hasta perder el filo. Este es hoja, tomado
// del medio del gradiente del icono para que el acento y el glifo se lean como
// la misma tinta.
const PALETTE = {
  "--statement-accent": "#5cb946",
  // El tamaño del icono en su momento grande, y por qué vive en CSS y no en JS.
  //
  // El icono se PINTA a este tamaño siempre, y la animación lo escala hacia
  // ABAJO hasta calzar en el texto. Al revés —pintarlo chico y escalarlo hacia
  // arriba— se ve pixelado por más que la fuente sea un SVG: `transform: scale()`
  // rasteriza el elemento a su tamaño de LAYOUT y después estira ese bitmap. Con
  // `will-change: transform` la capa queda cacheada al tamaño chico y ni siquiera
  // se re-rasteriza. Escalando hacia abajo, la textura ya existe a tamaño grande
  // y solo se submuestrea: nítido en todo el recorrido.
  //
  // Ese orden es lo que obliga a que el tamaño sea CSS: tiene que estar aplicado
  // antes del primer paint, no calculado por GSAP después.
  //
  // `min()` de las dos unidades porque el stage mide 100svh de alto por el ancho
  // del viewport: en apaisado manda la altura, en vertical el ancho. Es el lado
  // corto, que es contra lo que el icono tiene que respirar. 42% y no más: pasado
  // cierto tamaño el squircle deja de leerse como un objeto en cuadro y pasa a
  // ser un fondo verde con una N.
  "--icon-big": "min(42svh, 42vw)",
} as React.CSSProperties;

export default function AgentEconomy() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const cleanups: (() => void)[] = [];

      // El `scope` ES el stage: la sección mide una pantalla, no tiene recorrido
      // propio y es el `offsetParent` de todo lo que se mide acá abajo.
      const stage = scope;
      const icon = q("[data-agent-icon]")[0];
      const slot = q("[data-agent-slot]")[0];
      const copy = q("[data-agent-copy]")[0];
      if (!icon || !slot || !copy) return;

      // ── Los DOS iconos, y por qué son dos ─────────────────────────────────
      //
      // `slot` es el icono del flujo: mide 1.07em, se apoya en la baseline del
      // texto y es lo único que existe sin JavaScript. `icon` es el que viaja:
      // vive fuera del flujo, se pinta a `--icon-big` y arranca en `opacity: 0`
      // desde el CSS.
      //
      // El intercambio se hace acá y no en el timeline: con
      // `prefers-reduced-motion` este bloque no corre, el grande sigue apagado
      // por su clase y el statement se ve como cualquier sección. Apagar el
      // chico desde el JSX lo dejaría invisible para siempre en ese caso.
      //
      // No hay swap a mitad de animación: el grande ATERRIZA exactamente encima
      // del chico, que está apagado abajo. Un cambio de nodo al final del viaje
      // parpadearía en el frame del corte.
      gsap.set(icon, { autoAlpha: 1 });
      gsap.set(slot, { autoAlpha: 0 });

      // ── De dónde sale y a dónde llega ─────────────────────────────────────
      //
      // Todo se mide en coordenadas del STAGE, que es el `offsetParent` de los
      // dos: la sección es `relative`, o sea positioned, y ni el `Container` ni
      // los wrappers intermedios lo son. Por eso el `slot` puede estar anidado
      // tres divs adentro y sus `offsetLeft/offsetTop` siguen siendo del stage.
      //
      // La medición usa `offset*` y NO `getBoundingClientRect()`, y esa es la
      // parte que importa: el rect incluye los transforms, así que en el segundo
      // refresh mediría el icono YA movido y la posición de partida se iría
      // corriendo sola en cada resize. Los `offset*` son layout puro y devuelven
      // siempre el mismo valor, esté el icono donde esté.
      //
      // Son funciones y no números porque `invalidateOnRefresh` las vuelve a
      // llamar en cada resize: el centro del stage, el tamaño del icono y la
      // posición del slot dependen del viewport, y un valor congelado al montar
      // desalinea el aterrizaje en cuanto alguien gira el teléfono.
      //
      // `transformOrigin: "0 0"` hace que las cuentas sean las de arriba y no un
      // sistema de compensaciones: con el origen en la esquina, `x`/`y` son
      // directamente la posición de esa esquina y `scale` no la mueve.
      gsap.set(icon, { transformOrigin: "0 0" });

      const centeredX = () => (stage.clientWidth - icon.offsetWidth) / 2;
      const centeredY = () => (stage.clientHeight - icon.offsetHeight) / 2;
      const restingScale = () => slot.offsetWidth / icon.offsetWidth;

      // ── El estado inicial NO espera a nada ────────────────────────────────
      //
      // El icono se planta centrado y el texto nace apagado en este mismo layout
      // effect, antes del primer paint. Esto estuvo mal una vez y el síntoma
      // valía la pena: el estado inicial vivía dentro del callback de
      // `document.fonts.ready`, así que entre el paint y la carga de las fuentes
      // el statement se veía TERMINADO —icono chico en su sitio, texto legible—
      // asomando por debajo del hero sin que nadie hubiera scrolleado. El
      // arranque de una coreografía no puede depender de una promesa; lo único
      // que necesita esperar a las fuentes es SplitText, que mide líneas.
      gsap.set(icon, { x: centeredX, y: centeredY, scale: 1 });
      gsap.set(copy, { autoAlpha: 0 });

      // El centrado es una posición ABSOLUTA en píxeles, no un `left: 50%`: si el
      // viewport cambia de tamaño, el icono se queda donde estaba y deja de estar
      // centrado. Un `ResizeObserver` lo vuelve a plantar.
      //
      // La condición es `progress() === 0` y no una bandera de "ya disparó":
      // el timeline va y viene, así que "antes de la animación" no es un momento
      // que pase una sola vez — es un ESTADO al que se vuelve cada vez que el
      // lector sube. Con una bandera, un resize después de haber vuelto al hero
      // dejaría el icono descentrado hasta el próximo viaje. Fuera del reposo no
      // se toca: esas coordenadas son el punto de partida de un viaje en curso y
      // reescribirlas lo mandaría de vuelta al centro a mitad de camino.
      // Declarado ANTES de todo lo que lo mira —`atRest()`, el
      // `ResizeObserver`, `build()`— y no junto al resto del estado más abajo:
      // el observer dispara su primer callback de forma asíncrona, así que hoy
      // llegaría tarde a la zona muerta del `let`, pero eso es una propiedad del
      // observer y no de este código. Arriba, no hay nada que razonar.
      let tl: gsap.core.Timeline | null = null;

      const atRest = () => !tl || tl.progress() === 0;
      const ro = new ResizeObserver(() => {
        if (!atRest()) return;
        gsap.set(icon, { x: centeredX(), y: centeredY(), scale: 1 });
        // El timeline cachea sus valores de partida al arrancar. Sin invalidar,
        // el próximo `play()` viajaría desde el centro VIEJO.
        tl?.invalidate();
      });
      ro.observe(stage);
      cleanups.push(() => ro.disconnect());

      let split: SplitText | null = null;
      let lines: Element[] = [];
      // `fonts.ready` es una promesa y el cleanup puede correr antes de que
      // resuelva: en dev pasa en cada mount por StrictMode. Sin este flag,
      // `prepare()` splitearía un nodo ya revertido — cirugía de DOM sobre un
      // árbol que nadie va a limpiar.
      let cancelled = false;

      // Partir el texto y apagarlo línea por línea. Separado del disparo a
      // propósito: esto tiene que pasar apenas las fuentes midan, mucho antes de
      // que el lector llegue, para que el momento del disparo no cargue con una
      // operación de layout.
      const prepare = () => {
        if (cancelled || split) return;
        // `type: "lines"` y no "words": el texto entra por líneas, que es la
        // unidad que el lector percibe en un statement de seis renglones. Por
        // palabras, seis líneas dan ~25 piezas y el stagger se vuelve ruido.
        //
        // `mask: "lines"` envuelve cada línea en un contenedor con overflow
        // hidden, así el `y` de entrada se lee como si la línea saliera de
        // debajo de la anterior y no como un bloque flotando.
        split = SplitText.create(copy, { type: "lines", mask: "lines" });
        lines = split.lines;

        // El `<h2>` se vuelve a encender y el apagado pasa a ser por línea. El
        // orden importa: al revés, hay un frame con las seis líneas visibles.
        gsap.set(lines, { autoAlpha: 0, yPercent: 110 });
        gsap.set(copy, { autoAlpha: 1 });
      };

      if (document.fonts?.ready) document.fonts.ready.then(prepare).catch(prepare);
      else prepare();

      // ── La coreografía, como UN timeline ──────────────────────────────────
      //
      // Un solo timeline en pausa, construido una vez y reutilizado. El trigger
      // no lo crea: lo reproduce. Esa distinción es lo que permite que ande para
      // los dos lados — un timeline nuevo por disparo no tiene a dónde volver.
      //
      // Se construye tarde (la primera vez que hace falta) y no al montar porque
      // necesita dos cosas que no existen todavía: las líneas del split, que
      // esperan a las fuentes, y la posición del icono del flujo, que es layout.
      const build = () => {
        if (tl) return tl;
        // Por si el lector llegó antes que las fuentes. Se autoignora si ya corrió.
        prepare();

        tl = gsap.timeline({ paused: true });

        // El viaje. Los destinos van como FUNCIONES y no como números: el
        // timeline sobrevive resizes y giros de pantalla, y `invalidate()` las
        // vuelve a llamar. Congelados al construir, el icono aterrizaría donde
        // el texto estaba antes de rotar el teléfono.
        //
        // `power3.inOut` y no un ease de scroll: sin el dedo empujando, la curva
        // es lo único que separa un objeto acomodándose de una caja
        // teletransportándose. Arranca y frena parejo, que es como se mueve algo
        // que tiene peso — y leído al revés sigue siendo simétrico, que es lo que
        // hace que la vuelta no parezca otra animación.
        //
        // Arranca en `BEATS.iconAt` y no en 0: el viaje se monta sobre el final
        // del recorte del hero, así que el icono sale a buscar su lugar mientras
        // el borde todavía está terminando de descubrirlo.
        tl.to(
          icon,
          {
            x: () => slot.offsetLeft,
            y: () => slot.offsetTop,
            scale: restingScale,
            duration: BEATS.icon,
            ease: "power3.inOut",
          },
          BEATS.iconAt
        );

        // El texto entra montado sobre el final del viaje, no después: esperar a
        // que el icono aterrice deja un hueco muerto en el medio. Al revertir,
        // esa misma superposición hace que el texto se vaya ANTES de que el
        // icono arranque de vuelta, que es el orden correcto para desarmar.
        if (lines.length) {
          tl.to(
            lines,
            {
              autoAlpha: 1,
              yPercent: 0,
              stagger: BEATS.copyStagger,
              duration: BEATS.copy,
              ease: "power2.out",
            },
            BEATS.copyAt
          );
        } else {
          // Sin split —fuentes que nunca resolvieron— el texto entra entero.
          // Peor gesto, pero el statement se lee, que es lo que no se negocia.
          tl.to(copy, { autoAlpha: 1, duration: BEATS.copy, ease: "power2.out" }, BEATS.copyAt);
        }

        return tl;
      };

      // ── El disparo no vive acá ────────────────────────────────────────────
      //
      // Esta sección no decide cuándo: se suscribe. El dueño del gesto es el
      // hero —es su salida la que el lector dispara— y desde ahí sale el evento.
      //
      // Un evento y no un ScrollTrigger propio, y el motivo es concreto: durante
      // la secuencia el scroll está CONGELADO. Un trigger de posición no llegaría
      // a dispararse nunca, porque la página no se mueve mientras la animación
      // corre.
      cleanups.push(
        onSequence({
          play: () => build().play(),
          rewind: () => build().reverse(),
        })
      );

      cleanups.push(() => {
        cancelled = true;
        split?.revert();
      });

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return (
    // Una pantalla exacta, sin recorrido propio. Fue `sticky` dentro de un track
    // más alto mientras la coreografía se scrubbeaba: el stage tenía que quedarse
    // quieto mientras el scroll la avanzaba. Desde que la secuencia corre con el
    // scroll CONGELADO, el sticky no aporta nada —nada se mueve durante la
    // animación— y lo único que quedaba era su recorrido: media pantalla de
    // scroll donde el statement no subía y la sección siguiente no llegaba.
    //
    // La sección arranca solapada con el hero (su `margin-bottom` de -100svh),
    // así que ya está a pantalla completa en el scroll 0 sin ayuda de nadie.
    //
    // `relative` para ser el `offsetParent` de la coreografía. `overflow-hidden`
    // porque el icono en grande se sale del ancho del `Container`, y sin recorte
    // eso es scroll lateral en toda la página.
    <section
      ref={rootRef}
      className="relative flex h-[100svh] items-center overflow-hidden bg-cream text-foreground"
      style={PALETTE}
    >
      <Container>
        {/* El `@container` es la mitad de un acuerdo con `--text-manifesto`,
            que mide su cuerpo en `cqw`: sin contenedor declarado resolvería
            contra el viewport y el texto seguiría creciendo cuando el
            `Container` ya topó en su `max-width`. */}
        <div className="@container">
          {/* `items-baseline`: el icono se apoya sobre la BASELINE de la
              primera línea. Una imagen en flexbox no tiene baseline
              tipográfica —la suya es su borde inferior—, que es exactamente el
              anclaje que hace falta. Alinearlo por el top exige un `margin`
              negativo calculado contra las métricas de Montreal, y eso se
              desalinea solo el día que cambie la fuente.

              `mx-auto w-fit` centra el CONJUNTO en el ancho del `Container`
              sin tocar la alineación interna. `justify-center` no serviría: el
              `<h2>` es un flex item que se estira hasta sus 17em aunque la
              línea más larga mida menos, así que centraría la caja y no el
              texto. */}
          <div className="mx-auto flex w-fit items-baseline gap-[0.52em] text-manifesto">
            {/* El icono del FLUJO. No se anima: reserva la caja, da el
                anclaje de baseline y es lo único que se ve sin JavaScript o
                con `prefers-reduced-motion`. Cuando la coreografía corre, GSAP
                lo apaga y el que viaja aterriza justo encima.

                `width`/`height` son 800 porque ese es el viewBox del archivo,
                no porque se pinte a ese tamaño: Next los usa para la relación
                de aspecto, y el tamaño real lo ponen las clases en `em`.
                Desalineados con el viewBox, el `<img>` reserva una caja de
                proporción equivocada durante el layout. `unoptimized` porque
                el optimizador de Next rasteriza, y servir el SVG tal cual es lo
                único que conserva el vector. */}
            <Image
              data-agent-slot
              src="/prototype/homepage-update/near-icon.svg"
              alt=""
              aria-hidden="true"
              width={800}
              height={800}
              unoptimized
              className="h-[1.07em] w-[1.07em] shrink-0"
            />

            {/* El `max-w` va en **em**, y esa unidad es el punto entero: en em
                la medida de línea escala con el font-size, así que el reparto
                en seis líneas —y sobre todo dónde cae el acento, que tiene que
                cerrar la última— es el mismo en cualquier viewport. Acá pesa
                doble: SplitText parte por LÍNEAS, así que el reparto no es solo
                estético, es cuántas piezas tiene el stagger. 17em son ~38
                caracteres, un poco más que la línea más larga
                ("Quantum-resistant and confidential"). */}
            <h2 data-agent-copy className="max-w-[17em]">
              {COPY.body}{" "}
              {/* El token `--text-manifesto` define un solo peso (500) para todo
                  el rol, y acá el acento pesa MÁS que el cuerpo dentro de la misma
                  frase. No es un rol tipográfico nuevo que merezca su token: es el
                  contraste interno del statement, y vive con él. */}
              {/* ds-exempt: acento más pesado que su propia frase */}
              <strong className="font-bold text-[color:var(--statement-accent)]">
                {COPY.accent}
              </strong>
            </h2>
          </div>
        </div>
      </Container>

      {/* El icono que VIAJA. Hijo directo de la sección y no del renglón: así su
          `offsetParent` es el stage y la animación mide todo en un solo sistema
          de coordenadas.

          Se pinta a `--icon-big` SIEMPRE —ese es el punto— y la animación lo
          escala hacia abajo hasta calzar sobre el del flujo. Ver la nota de
          `--icon-big` arriba: al revés se ve pixelado.

          `opacity-0` desde la clase y no desde GSAP: sin JavaScript, o con
          `prefers-reduced-motion`, este nodo no tiene que existir para el
          lector. Lo enciende el bloque de motion, que es el único que sabe
          ponerlo en su sitio. */}
      <Image
        data-agent-icon
        src="/prototype/homepage-update/near-icon.svg"
        alt=""
        aria-hidden="true"
        width={800}
        height={800}
        unoptimized
        className="pointer-events-none absolute left-0 top-0 h-[var(--icon-big)] w-[var(--icon-big)] opacity-0 will-change-transform"
      />
    </section>
  );
}
