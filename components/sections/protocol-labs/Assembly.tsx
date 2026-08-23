"use client";

import Container from "@/components/primitives/Container";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import MachineArt from "@/components/sections/protocol-labs/machineArt";
import {
  CAPABILITIES,
  PROOF_BY_ID,
} from "@/components/sections/protocol-labs/protocolContent";

// Alternativa B · secciones 4 a 9 — el acto entero de la página.
//
// ── Qué se está probando ───────────────────────────────────────────────────
//
// Que las seis capacidades no son seis features sino seis vistas del mismo
// objeto. El panel pegado sostiene esa pieza durante todo el tramo y la columna
// de texto la va interrogando; lo que cambia entre beats es su ESTADO, no la
// pieza.
//
// Contra la alternativa A: A gana en comparación y en búsqueda —las seis
// abiertas, escaneables, con Cmd+F— y pierde el momento. B gana el momento y
// paga con el resto: para volver a la tercera hay que recorrer el tramo otra
// vez, y quien vino por una sola de las seis pasa por las otras cinco.
//
// ── La telemetría no es decoración ────────────────────────────────────────
//
// El doc trae la franja de prueba como sección aparte. Acá las seis cifras se
// reparten entre los seis beats y aparecen junto al texto de cada uno: la que
// corresponde a lo que se está mostrando. Es lo que convierte a la franja de un
// cartel de números en la lectura de un instrumento. El emparejamiento
// capacidad→cifra vive en `protocolContent`, no acá: es un dato del contenido,
// no una decisión de este archivo.
//
// ── Sticky de CSS, nunca `pin: true` ──────────────────────────────────────
//
// El recorrido lo declara el alto de los seis bloques de texto y el panel se
// pega con `position: sticky`. ScrollTrigger solo LEE cuál de los seis cruza la
// línea de lectura. La razón larga está en `components/sections/README.md`; la
// corta es que un pin-spacer pelea con Lenis y deja spacers fantasma en
// StrictMode.
//
// ── Dos layouts, no un layout degradado ───────────────────────────────────
//
// La escena existe en desktop y con movimiento permitido. Fuera de ahí —móvil,
// `prefers-reduced-motion`, JS que no llegó— el atributo `data-scene` no se
// escribe nunca y la sección es seis entradas en flujo normal, cada una con su
// figura ya resuelta en el estado que le toca.
//
// En móvil es una decisión de layout, no una renuncia: en una sola columna el
// panel tendría que abarcar el alto de los seis bloques para poder pegarse, y
// eso o lo tapa el texto o lo deja pegado dentro de su propia celda de 40svh,
// que es la versión rota del mismo gesto.

// ── La intro: la caja negra que se abre ───────────────────────────────────
//
// El acto no empieza a sangre. Llega dentro de una caja negra con esquinas
// blandas, con la pieza sola adentro, y se abre a pantalla completa mientras la
// sección sube a plantarse. Recién entonces aparecen los seis bloques y arranca
// el recorrido pegado de siempre.
//
// Es el gesto del hero leído al revés: allá la pantalla se guarda en una
// tarjeta, acá la tarjeta se abre a pantalla. Por eso comparte sus constantes y
// su curva.
//
// ── El tramo cae FUERA del recorrido de las seis paradas ──────────────────
//
// Todo ocurre mientras la sección sube y todavía no está pegada: arranca cuando
// cubre el 40% de la pantalla y termina cuando cubre el 80%, o sea bastante
// antes de plantarse. Si la apertura gastara parte del rango del track, las seis
// paradas se apretarían y la pieza pasaría de largo. Cuando la escena se planta,
// la caja ya está abierta y no queda nada animándose.
//
// El tramo es corto a propósito —40% de pantalla de recorrido, no una pantalla
// entera— y por eso la curva importa: en un rango así, una rampa lineal se lee
// como un salto.
//
// ── Por qué el eje vertical va en PÍXELES y el horizontal en % ────────────
//
// Ésta es la diferencia con `homepage-e/StackAnchors`, que hace este mismo gesto
// y puede escribir `inset(11% 6%)` a secas. Allá la escena ES una pantalla
// pegada, así que la caja del elemento recortado mide un viewport y ese 11% son
// 11% de pantalla.
//
// Acá no: los seis bloques están en FLUJO y la sección mide seis pantallas. Un
// `inset(11%)` recortaría el 11% de seis pantallas —más de media— y la caja
// entraría con el contenido decapitado.
//
// El eje horizontal sí puede ir en %, porque el ancho del elemento es el ancho
// de la pantalla. El vertical va en píxeles calculados sobre `innerHeight`, por
// función, para que `invalidateOnRefresh` los rehaga en cada resize.
//
// El borde INFERIOR no se recorta nunca (queda en `0px`): está a seis pantallas
// de distancia y no hay ojo que lo vea. Recortarlo sólo serviría para que la
// interpolación tuviera un valor más que mover.
//
// ── Y los textos entran al final ──────────────────────────────────────────
//
// La caja llega con la pieza sola. Si los seis bloques ya estuvieran ahí, la
// apertura sería un encuadre agrandándose sobre algo que ya se veía entero, y el
// gesto no aportaría nada. Con la pieza sola la caja llega ANUNCIANDO, y lo que
// anuncia aparece cuando termina de abrirse.
//
// Cuelgan del MISMO scrub que el clip, así que el orden —caja abierta, después
// texto— no se puede romper por mucho que se scrollee de golpe.

// ── La medida de la caja cerrada ──────────────────────────────────────────
//
// El ancho es el de DOS cards de «Built for AI scale», la sección de arriba: la
// caja llega del tamaño de lo que el lector acaba de mirar y desde ahí se abre.
// Es lo que ata las dos secciones — sin esa coincidencia, la caja es un tamaño
// arbitrario que crece.
//
// No se escribe como un número: se MIDE. Aquella sección reparte su `Container`
// en cuatro columnas con `gap-6`, así que dos cards y el gap que las separa son
//
//     2 · (W − 3g)/4 + g  =  W/2 − g/2
//
// con W el ancho del `Container` y g el gap. Se calcula en runtime desde el
// `Container` de esta misma sección —que es el mismo componente y por lo tanto
// el mismo ancho— en vez de copiar un porcentaje: un porcentaje se desincroniza
// en silencio el día que alguien toque el `max-width` del contenedor o el gap de
// aquel grid, y nadie relaciona las dos cosas.
const CARD_GAP = 24; // `gap-6`, en px

/** El radio de la caja, en px. Constante: acá nada se escala. */
const INTRO_RADIUS = 34;

export default function Assembly() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
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

  return (
    // El fondo NO va en la sección: va en el hijo, que es lo que se recorta.
    // Pintado acá se vería alrededor de la caja y no habría caja que ver. El
    // crema de la sección es el que asoma por los márgenes mientras entra.
    <section ref={rootRef} className="bg-cream">
      {/* La caja. Es lo que se recorta y lo único oscuro de la sección, así que
          también es lo que invierte el nav: con `data-nav-dark` en la sección,
          el header se pondría claro sobre el crema de los márgenes. */}
      <div data-act-frame data-nav-dark className="bg-ink text-cream">
        <div
          data-track
          // Los DOS grupos van en el mismo nodo, y no es comodidad: las capas del
          // SVG consultan `group-data-[beat=N]/machine`, que Tailwind compila a
          // `.group\/machine[data-beat="N"] &` — el atributo tiene que estar en el
          // MISMO elemento que lleva la clase del grupo, no en un ancestro suyo.
          // Como `data-beat` lo escribe el efecto sobre el track, el track es
          // también el grupo de la máquina.
          //
          // `data-beat="0"` SÍ se declara en el JSX, a diferencia de `data-scene`,
          // que solo escribe el efecto: es el estado de reposo del panel —el del
          // primer paint, y el que queda si el JS no llega—. Un panel sin ningún
          // beat encendido sería una plancha vacía.
          data-beat="0"
          className="group/track group/machine relative"
        >
          {/* `data-act-container` para medirlo: el ancho de la caja cerrada sale
            de acá, no de un porcentaje escrito a mano. Ver la nota de `CARD_GAP`. */}
        <Container data-act-container className="grid gap-x-16 lg:grid-cols-2">
            {/* El panel pegado. Solo existe cuando la escena está armada; su
                ausencia es lo que deja a los bloques mostrar su figura propia. */}
            <div className="hidden lg:col-start-1 lg:group-data-[scene=on]/track:block">
              <div data-act-stick className="sticky top-0 flex h-svh items-center">
                {/* El envoltorio existe para poder desplazar la pieza durante la
                    intro sin tocar el `sticky` de su padre: un `transform` sobre
                    el elemento pegado lo convierte en su propio contenedor de
                    posicionamiento y deja de pegarse. */}
                <div data-act-art className="w-full">
                  <MachineArt className="h-[62svh] w-full" />
                </div>
              </div>
            </div>

            {/* Los seis bloques de texto: son ellos los que definen el recorrido,
                porque el track mide lo que miden ellos. */}
            <div className="lg:col-start-2">
              {CAPABILITIES.map((cap, i) => {
                const stat = PROOF_BY_ID[cap.metric];
                return (
                  <article
                    key={cap.id}
                    // `id` para que se pueda enlazar una capacidad concreta desde
                    // fuera. `scroll-mt` es su complemento obligatorio: el nav es
                    // fijo, y sin ese margen el ancla deja el título tapado por la
                    // barra. Los dos juntos o ninguno.
                    id={cap.id}
                    data-beat-block
                    data-act-copy
                    className="flex scroll-mt-[var(--site-header-block)] flex-col justify-center gap-6 py-16 lg:py-24 lg:group-data-[scene=on]/track:min-h-svh"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="uppercase text-micro-mono text-cta-mint">{cap.index}</span>
                      <span aria-hidden="true" className="h-px flex-1 bg-cream/20" />
                      <span className="uppercase text-micro-mono text-cream/45">{cap.key}</span>
                    </div>

                    <h3 className="text-h2 text-pretty">{cap.name}</h3>
                    <p className="max-w-[38ch] text-body-lg text-cream/60 text-pretty">
                      {cap.subhead}
                    </p>
                    <p className="max-w-[52ch] text-body text-cream/80 text-pretty">{cap.body}</p>

                    {/* La misma pieza del panel, resuelta en el estado de ESTE
                        beat. Un solo archivo dibuja los dos modos, así que el
                        objeto no puede divergir entre desktop y móvil. */}
                    <div className="lg:group-data-[scene=on]/track:hidden">
                      <MachineArt beat={i} className="h-64 w-full" />
                    </div>

                    {stat && (
                      <p className="flex items-baseline gap-3 border-t border-cream/15 pt-4">
                        <span className="text-h3-serif italic text-cta-mint">{stat.value}</span>
                        <span className="uppercase text-micro-mono text-cream/50">{stat.label}</span>
                      </p>
                    )}

                    {cap.link && (
                      <a
                        href={cap.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-q-arrow-host
                        className="flex w-fit items-center gap-3 text-label text-cream"
                      >
                        <ArrowCircle />
                        {cap.link.label}
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
