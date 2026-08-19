"use client";

import Container from "@/components/primitives/Container";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { EX2_HERO } from "@/components/sections/ex2/ex2Content";

// ── EX2 · Hero ───────────────────────────────────────────────────────────────
//
// DRAFT. Lo que se está resolviendo acá es la ESTRUCTURA y el mecanismo de la
// transición, no el acabado: la sección de destino es un placeholder y ni el
// texto ni el botón son definitivos.
//
// Titular de cartel alineado a la izquierda sobre el vídeo, con el CTA al
// costado, y una transición en la que la contraforma de la «O» de WORLD crece
// hasta convertirse en la ventana por la que entra la sección siguiente.
//
// ── El mecanismo, en dos movimientos que comparten un punto ─────────────────
//
// 1. El titular ESCALA con `transform-origin` en el centro de la O. Ese origen
//    es lo que hace que la O se quede clavada en el mismo punto de la pantalla
//    mientras todo lo demás se va hacia afuera: no es que la cámara viaje, es
//    que el cartel crece alrededor de un punto fijo.
// 2. La sección de destino, en una capa por encima, se recorta con
//    `clip-path: circle(r at ese mismo punto)` y su `r` crece EN PROPORCIÓN a
//    la escala del titular. Como el centro es el mismo y el factor es el mismo,
//    el círculo revelado coincide con la O mientras las dos cosas crecen.
//
// El texto de destino NO escala con la máscara — sube un poco y ya. Escalarlo
// dentro de su propio agujero lo convertiría en un zoom sobre una foto, y lo
// que se quiere es una ventana que se abre sobre algo que ya estaba ahí.
//
// ── El círculo no calza EXACTAMENTE con la O, y es por Kepler ───────────────
//
// La O de WORLD va en Kepler itálica: su contraforma es una elipse INCLINADA,
// no un círculo. Un `clip-path: circle()` nunca va a coincidir con ella pixel a
// pixel en el primer frame.
//
// Se eligió el círculo igualmente, y el desajuste se resuelve por velocidad: el
// radio arranca en el ~86% del semieje menor —dentro de la contraforma, nunca
// desbordándola— y en los primeros ~200ms ya es tres veces mayor, con lo que el
// borde deja de compararse con la letra. La alternativa (`ellipse()` rotada) no
// existe en CSS: `clip-path: ellipse()` no admite rotación propia, y rotar el
// elemento entero rotaría también la sección revelada.
//
// Si al mirarlo el arranque se nota, la respuesta NO es afinar el radio: es
// pasar WORLD a Montreal, cuya O sí es prácticamente circular.
//
// ── Medido, nunca estimado ──────────────────────────────────────────────────
//
// El centro y el radio salen de `getBoundingClientRect()` sobre el `<span>` que
// envuelve la O, y se vuelven a medir en cada `refreshInit` de ScrollTrigger.
// Es obligatorio: la O se mueve con el ancho de la ventana (el titular es
// fluido) y otra vez cuando Kepler termina de cargar — con `display: swap`, el
// primer layout es el de la fuente de sistema y la O está en otro sitio.

// Cuánto scroll dura la apertura. Lo bastante para que el gesto se lea sin que
// el lector sienta que la página se atascó.
const TRAVEL = "180svh";

// Radio inicial del círculo, en fracción del semieje menor de la CAJA de la O.
//
// 0.34 y no 0.86, y la diferencia es la que separa "la O tiene el agujero
// encendido" de "la O es un disco blanco": la caja del glifo incluye el trazo,
// así que la contraforma real ronda la mitad de esa caja. A 0.86 el círculo
// desbordaba el hueco y rellenaba la letra entera; a 0.34 vive holgado dentro,
// y en reposo se lee como lo que es — un punto de luz en el ojo de la O.
const START_R = 0.34;

// Margen sobre la distancia a la esquina más lejana: el círculo tiene que
// pasarse de largo, no terminar justo al tocarla.
const COVER = 1.08;

export default function Ex2Hero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop, self }) => {
    const stage = q("[data-stage]")[0];
    const headline = q("[data-headline]")[0];
    const hole = q("[data-hole]")[0];
    const reveal = q("[data-reveal]")[0];
    const revealInner = q("[data-reveal-inner]")[0];
    const fade = q("[data-fade]");
    if (!stage || !headline || !hole || !reveal) return;

    // Sin escena: el hero se lee como una portada normal y la sección de
    // destino queda debajo, en flujo. Es la degradación correcta — el mecanismo
    // es un lujo, el contenido no.
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "ex2");

    // Geometría de la O. Se recalcula en cada refresh porque depende del ancho
    // de la ventana y del swap de fuentes.
    let cx = 0;
    let cy = 0;
    let r0 = 1;
    let rEnd = 1;

    self.add("measure", () => {
      const box = hole.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      const headBox = headline.getBoundingClientRect();

      // ── Dos sistemas de coordenadas, y confundirlos rompe el gesto ────────
      //
      // El CLIP vive en la capa que cubre el viewport pegado, así que su centro
      // se mide contra esa capa.
      cx = box.left + box.width / 2 - stageBox.left;
      cy = box.top + box.height / 2 - stageBox.top;

      // El TRANSFORM-ORIGIN, en cambio, es relativo a la caja del PROPIO
      // elemento que escala. Pasarle las coordenadas de viewport pone el origen
      // fuera del titular: al escalar, el texto sale disparado en diagonal y
      // desaparece de pantalla en vez de crecer alrededor de la O. Costó un
      // rato encontrarlo porque el síntoma parece "la escala no se aplica".
      const ox = box.left + box.width / 2 - headBox.left;
      const oy = box.top + box.height / 2 - headBox.top;

      r0 = (Math.min(box.width, box.height) / 2) * START_R;

      // La esquina más lejana desde el centro de la O. `cx`/`cy` ya son
      // relativos al stage, y el stage mide exactamente el viewport pegado, así
      // que comparar contra `innerWidth/innerHeight` es correcto.
      const w = window.innerWidth;
      const h = window.innerHeight;
      rEnd =
        Math.max(
          Math.hypot(cx, cy),
          Math.hypot(w - cx, cy),
          Math.hypot(cx, h - cy),
          Math.hypot(w - cx, h - cy)
        ) * COVER;

      gsap.set(headline, { transformOrigin: `${ox}px ${oy}px` });
      reveal.style.clipPath = `circle(${r0}px at ${cx}px ${cy}px)`;
    });

    self.measure();
    ScrollTrigger.addEventListener("refreshInit", self.measure);

    // `quickSetter` es para valores NUMÉRICOS. Con `clipPath` —cuyo valor es una
    // cadena entera, `circle(120px at 300px 400px)`— no escribe nada y no avisa:
    // el recorte simplemente no se aplica, y lo que se ve es la sección de
    // destino entera encima del hero. Por eso el clip va por `style` directo,
    // que además es la escritura más barata posible.
    const setScale = gsap.quickSetter(headline, "scale");
    const setInnerY = gsap.quickSetter(revealInner, "y", "px");
    const setInnerAlpha = gsap.quickSetter(revealInner, "opacity");
    const setClip = (r: number) => {
      reveal.style.clipPath = `circle(${r}px at ${cx}px ${cy}px)`;
    };

    const st = ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      markers: DEBUG_MARKERS,
      // `will-change` solo mientras el recorrido está activo: fijo en el
      // className, el titular quedaría promovido a su propia capa toda la
      // sesión.
      onToggle: (t) => {
        headline.style.willChange = t.isActive ? "transform" : "auto";
        reveal.style.willChange = t.isActive ? "clip-path" : "auto";
      },
      onUpdate: (t) => {
        const p = t.progress;

        // La escala va con el radio: el círculo revelado y la O crecen a la par
        // porque comparten centro y factor. `1 + (k−1)·p` y no `k^p` — lineal es
        // lo que mantiene la coincidencia entre los dos, cualquier ease los
        // desincroniza.
        const k = rEnd / r0;
        const scale = 1 + (k - 1) * p;
        setScale(scale);
        setClip(r0 * scale);

        // El contenido de destino sube un poco mientras se descubre: sin eso, la
        // ventana se abre sobre algo perfectamente quieto y el conjunto se lee
        // como un recorte, no como una llegada.
        //
        // Y entra con opacidad en el primer cuarto del recorrido. Sin esto, el
        // círculo de reposo —por pequeño que sea— ya deja ver un trozo de
        // párrafo dentro del ojo de la O: dos palabras sueltas flotando en la
        // letra antes de que nadie haya scrolleado.
        if (revealInner) {
          setInnerY((1 - p) * 40);
          setInnerAlpha(Math.min(1, p / 0.25));
        }

        // Lo demás del hero se retira: compite con el agujero justo cuando el
        // agujero es lo único que importa.
        gsap.set(fade, { autoAlpha: 1 - Math.min(1, p * 2.2) });
      },
    });

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", self.measure);
      st.kill();
      headline.style.willChange = "auto";
      reveal.style.willChange = "auto";
      gsap.set([headline, reveal, ...fade, ...(revealInner ? [revealInner] : [])], {
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
        {/* El vídeo: loop, no scrubbeado. Todo el scroll de esta sección se lo
            lleva la apertura de la O — con el descenso avanzando a la vez,
            serían dos animaciones peleándose por la misma rueda.
            `poster` para que el primer paint no sea negro, y `playsInline` sin
            el cual iOS lo abre a pantalla completa. */}
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

        {/* Un velo sobre el vídeo: el titular es cream sobre un clip que tiene
            zonas claras, y sin esto pierde el contraste justo donde el vídeo se
            aclara. */}
        <div
          data-fade
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,16,16,0.55)_0%,rgba(16,16,16,0.25)_45%,rgba(16,16,16,0.75)_100%)]"
        />

        <Container className="relative flex h-full flex-col justify-end pb-[10svh] pt-[var(--site-header-block)]">
          {/* `w-fit` y no el ancho del Container: el `transform-origin` se
              calcula en píxeles de viewport, pero el elemento que escala tiene
              que ser exactamente el titular — con una caja más ancha, el
              crecimiento arrastra aire vacío a los lados. */}
          <h1
            data-headline
            className="w-fit origin-top-left text-cream"
          >
            <span className="block text-kicker-xl uppercase">{EX2_HERO.lead}</span>
            {/* La O va en su propio span para poder medirla. Es la única razón
                del envoltorio: sin él no hay forma de saber dónde está la
                contraforma, y el centro tendría que estimarse. */}
            <span className="block serif-poster italic">
              W<span data-hole className="inline-block">O</span>RLD
            </span>
          </h1>

          {/* El CTA, al costado del titular como en la referencia. En el draft
              es un botón muerto: adónde lleva es una decisión de contenido que
              todavía no está tomada. */}
          <div data-fade className="mt-10 flex items-center gap-6">
            <a
              href={EX2_HERO.cta.href}
              className="rounded-2xl border border-cream/40 px-7 py-4 text-label-lg text-cream transition-colors duration-200 hover:bg-cream hover:text-ink"
            >
              {EX2_HERO.cta.label}
            </a>
            <p className="max-w-[38ch] text-body-sm text-cream/60 text-pretty">
              {EX2_HERO.sub}
            </p>
          </div>
        </Container>

        {/* La capa de destino: vive DENTRO del sticky, encima de todo, y se
            recorta con el círculo. Va acá y no en la sección siguiente porque el
            clip tiene que compartir sistema de coordenadas con la O — en otra
            sección, el centro habría que recalcularlo contra el scroll en cada
            frame. */}
        <div
          data-reveal
          className="absolute inset-0 z-10 flex items-center bg-cream text-ink [clip-path:circle(0px_at_50%_50%)]"
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
