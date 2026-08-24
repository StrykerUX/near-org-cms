"use client";

import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";

// El mecanismo del ACTO, sin layout: la escena pegada con sus seis paradas, y la
// caja que se despliega al entrar.
//
// ── Por qué es un hook y no está copiado tres veces ───────────────────────
//
// Hay tres versiones del acto —`Assembly`, `AssemblyOrbit` y `AssemblyBand`—
// montadas en `/prototype/protocol-a`, `-b` y `-c`, y lo que se compara entre
// ellas es el LAYOUT: dónde vive el texto, cómo se reparte contra el arte, qué
// jerarquía tiene. Eso es lo que cada una decide por su cuenta.
//
// Esto no es eso. Es geometría y plomería —medir el contenedor, componer el
// clip contra una posición que cambia cada cuadro, encender el beat correcto—
// y ya costó encontrar sus tres trampas una vez. Copiarlo tres veces no da tres
// versiones para elegir: da tres sitios donde el mismo error puede volver.
//
// El mismo criterio que `homepage-a/stackAssembly.tsx` aplica a su ensamble.
//
// ── El contrato ───────────────────────────────────────────────────────────
//
// La sección que lo use tiene que traer estos marcadores:
//
//   `data-track`       el grupo que lleva `data-beat`; las capas del SVG lo leen
//   `data-beat-block`  cada bloque de texto, en orden — definen las seis paradas
//   `data-act-frame`   la caja que se recorta al entrar
//   `data-act-container` un `Container` cualquiera, para medir el ancho
//   `data-act-stick`   el contenedor pegado del arte
//   `data-act-art`     el envoltorio del arte — se le aplica un transform
//   `data-act-copy`    lo que aparece cuando la caja termina de abrirse
//
// Todo es opcional salvo `data-track`: una variante que no tenga arte pegado
// simplemente no marca `data-act-stick`, y el hook se salta esa parte.

// ── Las medidas de la caja cerrada ────────────────────────────────────────
//
// El ancho es el de DOS cards de «Built for AI scale», la sección de arriba: la
// caja llega del tamaño de lo que el lector acaba de mirar y desde ahí se
// despliega. Es lo que ata las dos secciones — sin esa coincidencia, la caja es
// un tamaño arbitrario que crece.
//
// No se escribe como un número: se MIDE. Aquella sección reparte su `Container`
// en cuatro columnas con `gap-6`, así que dos cards y el gap que las separa son
// `W/2 − g/2`, con W el ancho de CONTENIDO del contenedor. Un porcentaje copiado
// se desincroniza en silencio el día que alguien toque el `max-width` del
// contenedor o el gap de aquel grid, y nadie relaciona las dos cosas.
const CARD_GAP = 24; // `gap-6`, en px

/** El radio de la caja, en px. Constante: acá nada se escala. */
const INTRO_RADIUS = 34;

export function useActScene() {
  return useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const track = q("[data-track]")[0];
    if (!track) return;

    const off = enableScene(track, "scene");

    // Un trigger por bloque, y no uno solo repartiendo el progreso del track:
    // los seis no miden lo mismo —el de Chain Signatures lleva tres líneas más
    // que el de Speed— y con un reparto uniforme el beat cambiaría antes o
    // después de que su texto llegue a la línea de lectura.
    const triggers = q("[data-beat-block]").map((block, i) =>
      ScrollTrigger.create({
        trigger: block,
        // 55% y no el centro exacto: el bloque que cruza la mitad de la
        // pantalla ya está saliendo cuando el ojo todavía lo está leyendo.
        start: "top 55%",
        end: "bottom 55%",
        markers: DEBUG_MARKERS,
        onToggle: (self) => {
          if (self.isActive) track.dataset.beat = String(i);
        },
      })
    );

    // ── La intro ──────────────────────────────────────────────────────────
    //
    // ⚠️ El recorte se mide contra el FRAME, y el frame mide seis pantallas.
    //
    // Ése era el error de las versiones anteriores, y no se veía leyendo el
    // código: `inset(top …)` cuenta desde el borde superior del elemento, no
    // desde el borde de la pantalla. Con la caja fijada en "del 30% al 70% del
    // viewport" lo que quedaba visible era en realidad "del 30% al 70% de la
    // primera pantalla DE LA SECCIÓN" — una franja anclada al documento, que
    // mientras la sección sube está fuera de cuadro por abajo y sólo asoma
    // cuando ya casi se plantó. Para entonces el gesto ya había corrido.
    //
    // La caja tiene que quedarse quieta EN PANTALLA mientras la sección se
    // desplaza por debajo, así que sus bordes se recalculan en cada cuadro
    // contra la posición real del frame. Eso descarta animar la propiedad con un
    // tween: lo que se interpola es un progreso, y el clip se compone a partir
    // de él y de una medida fresca.
    const frame = q("[data-act-frame]")[0];
    const container = q("[data-act-container]")[0];
    const stick = q("[data-act-stick]")[0];
    const art = q("[data-act-art]")[0];
    const copy = q("[data-act-copy]");

    // Cuánto de la pantalla cubre la sección cuando el gesto arranca, y cuánto
    // dura. De un tercio a dos tercios: el tramo entero ocupa 33svh de scroll,
    // que con el suavizado de abajo alcanza de sobra.
    const START_COVER = 1 / 3;
    const COVER_RANGE = 1 / 3;

    /** Los cuatro bordes del recorte para un progreso dado, medidos AHORA. */
    const clipAt = (p: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = frame.getBoundingClientRect();

      // El ancho de CONTENIDO del contenedor, no su caja: `Container` lleva su
      // propio padding lateral y el grid de cards vive dentro de él. Midiendo la
      // caja entera, la nuestra saldría ~120px más ancha que dos cards.
      let cw = vw;
      if (container) {
        const cs = getComputedStyle(container);
        cw =
          container.getBoundingClientRect().width -
          parseFloat(cs.paddingLeft) -
          parseFloat(cs.paddingRight);
      }
      // Dos cards de un grid de cuatro columnas, más el gap que las separa.
      const box = cw / 2 - CARD_GAP / 2;

      // Cerrada: la ventana ocupa la PRIMERA PANTALLA DE LA SECCIÓN entera de
      // alto, y sólo se estrecha de lado.
      //
      // Hubo una versión que también la recortaba arriba y abajo, a 40svh. Se
      // veía mejor de entrada y traía un problema que no se arregla moviendo
      // números: la pieza mide 62svh, así que no entraba, y para meterla había
      // que escalarla, y para centrarla en un cuadro que no coincidía con su
      // panel había que moverla — tres correcciones encadenadas, cada una
      // arreglando el efecto secundario de la anterior.
      //
      // Sin recorte vertical, la caja tiene el alto de la pantalla y la pieza
      // entra sola: su panel es `h-svh` y ya la centra ahí. Queda una sola
      // corrección, la horizontal, y el gesto se lee más limpio — un panel que
      // se despliega a lo ancho en vez de un cuadro que crece en todas las
      // direcciones a la vez.
      const shutTop = 0;
      const shutBottom = Math.max(0, r.height - vh);
      const shutSide = (vw - box) / 2;

      const lerp = (a: number, b: number) => a + (b - a) * p;
      const top = Math.max(0, lerp(shutTop, 0));
      const bottom = Math.max(0, lerp(shutBottom, 0));
      const side = Math.max(0, lerp(shutSide, 0));
      const radius = lerp(INTRO_RADIUS, 0);

      return `inset(${top}px ${side}px ${bottom}px ${side}px round ${radius}px)`;
    };

    // El progreso objetivo según dónde está la sección, y el que se dibuja.
    // Están separados porque el segundo PERSIGUE al primero: es el equivalente
    // de `scrub: 1`, y es lo que evita que un gesto de rueda con inercia se
    // coma el tramo en dos cuadros. Acá va a mano porque el clip no lo maneja un
    // tween.
    let target = 0;
    let current = 0;

    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

    const measure = () => {
      const vh = window.innerHeight;
      const covered = (vh - frame.getBoundingClientRect().top) / vh;
      target = Math.min(1, Math.max(0, (covered - START_COVER) / COVER_RANGE));
    };

    // La pieza sólo necesita una corrección: centrarla en X.
    //
    // Su panel ocupa la COLUMNA IZQUIERDA de un grid de dos, así que su centro
    // está a un cuarto de la pantalla y no a la mitad. La caja sí está centrada,
    // de modo que sin esto la pieza aparece pegada al borde izquierdo de una
    // caja que la dobla en ancho.
    //
    // En Y no hay nada que corregir, y en escala tampoco: al no recortar la caja
    // por arriba ni por abajo, la pieza cabe entera y su panel —`h-svh`, que
    // centra su contenido— ya la deja donde tiene que estar. Ésas eran las dos
    // correcciones que existían para compensar un cuadro de 40svh, y se fueron
    // con él.
    //
    // Se desvanece con el progreso: al abrirse del todo el transform es la
    // identidad y el sticky retoma su trabajo sin un salto.

    const placeArt = (p: number) => {
      if (!stick || !art) return;
      const r = stick.getBoundingClientRect();
      const vw = window.innerWidth;

      const x = vw / 2 - (r.left + r.width / 2);
      art.style.transform = `translate3d(${x * (1 - p)}px, 0, 0)`;
    };

    const render = () => {
      // Se deja de dibujar cuando los dos están en 1: el estado final no depende
      // de ninguna medida, así que seguir componiendo el string en cada cuadro
      // durante las seis pantallas del acto sería trabajo puro.
      if (current === 1 && target === 1) return;
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.001) current = target;
      const p = ease(current);
      frame.style.clipPath = clipAt(p);
      placeArt(p);
    };

    if (frame) {
      measure();
      current = target;
      frame.style.clipPath = clipAt(ease(current));
      placeArt(ease(current));
      gsap.ticker.add(render);
      ScrollTrigger.addEventListener("refresh", measure);
    }

    const onScroll = () => measure();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Los textos sí van con un tween normal: no dependen de ninguna medida
    // contra el viewport, así que un scrub corriente los resuelve.
    const copyTl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: "top 50%",
        end: "+=60%",
        scrub: 1,
        markers: DEBUG_MARKERS,
      },
    });
    if (copy.length > 0) {
      gsap.set(copy, { autoAlpha: 0 });
      copyTl.to(copy, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0);
      gsap.set(copy, { y: 28 });
    }

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.ticker.remove(render);
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("scroll", onScroll);
      copyTl.scrollTrigger?.kill();
      copyTl.kill();
      if (frame) frame.style.clipPath = "";
      if (art) art.style.transform = "";
      gsap.set(copy, { clearProps: "all" });
      delete track.dataset.beat;
      off();
    };
  });
}
