"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { FooterHeadline, FooterLegal, FooterLinks, FooterWordmark } from "./FooterParts";
import FooterStaticFallback from "./FooterStaticFallback";

// 06 · Stack — el footer con recorrido propio.
//
// ── La idea ────────────────────────────────────────────────────────────────
//
// No tapa la página: se la gana. El footer declara su propio tramo de scroll y
// se queda pegado al viewport mientras se arma en tres tiempos — el titular
// llega solo y a tamaño de portada, se encoge a su sitio mientras entran las
// columnas, y el wordmark asienta al final.
//
// ── La coreografía corre SOLA, no con el scroll ────────────────────────────
//
// Ésta es la diferencia que define la versión, y es un cambio deliberado sobre
// cómo estaba antes. Con `scrub`, los tres tiempos eran una función de cuánto
// scrolleaba el lector: rápido, la escena pasaba en un borrón; lento, el
// titular se quedaba a medio encoger indefinidamente. El ritmo no era del
// diseño, era del gesto de cada uno.
//
// Acá el scroll solo decide CUÁNDO empieza (`once: true`, al pegarse el
// bloque); a partir de ahí la timeline corre con sus propias duraciones y sus
// propias curvas, siempre igual. El `position: sticky` deja de ser el motor y
// pasa a ser lo que le da tiempo a la escena para completarse antes de que el
// footer salga de vista.
//
// Por eso el track bajó de 250svh a 150svh: ya no tiene que dar recorrido para
// una animación scrubbeada, solo tiene que mantener el bloque quieto los ~2s
// que la escena dura.
//
// ── Sección pegada: `position: sticky`, nunca `pin: true` ──────────────────
//
// Patrón de la casa, con su razonamiento largo en `motion/stickyScene.ts` y en
// `components/sections/README.md`: el recorrido se declara en CSS y el
// ScrollTrigger solo LEE progreso. Un `pin` insertaría un pin-spacer que pelea
// con Lenis y deja spacers fantasma bajo StrictMode.
//
// El interruptor es el atributo `data-scene`, y lo escribe SOLO `enableScene`
// —nunca el JSX—: declararlo en los dos lados da dos fuentes para un mismo
// estado y el primer re-render de React desarma el layout sticky en silencio.
// Sin el atributo (mobile, reduced-motion, sin JS) el track mide lo que mide su
// contenido y no hay nada pegado: el footer se lee apilado, en flujo normal.
//
// ── Lo que NO puede tener ningún ancestro ──────────────────────────────────
//
// `overflow` distinto de `visible`. Un ancestro con overflow se convierte en el
// contenedor de scroll del hijo pegado y el sticky deja de pegarse, sin error y
// sin warning. El `overflow-hidden` va sobre el hijo pegado, que sí puede
// tenerlo — y acá lo necesita, porque el titular a escala 1.9 se sale de caja.

export default function FooterStack() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const track = q("[data-track]")[0];
    const head = q("[data-head]")[0];
    const cols = q("[data-col]");
    const tail = q("[data-tail]")[0];
    if (!track || !head || !tail) return;

    const off = enableScene(scope, "scene");

    // Los estados iniciales se declaran con `gsap.set` y los tweens son todos
    // `.to()`. No es estilo: la primera versión usaba `fromTo` dentro de la
    // timeline y el estado inicial de las cuatro columnas salía mal — con la
    // escena a mitad de recorrido aparecían las tres últimas y faltaba la
    // primera, o sea el stagger al revés.
    //
    // La causa es el `immediateRender` de `fromTo`: aplica su "from" en el
    // frame en que se crea, no en el punto de la timeline donde está colocado,
    // y con varios `fromTo` escalonados sobre targets que además se re-miden en
    // el refresh del provider, quién pisa a quién depende del orden de
    // creación. `set` + `to` no tiene esa ambigüedad: el estado inicial es una
    // sola escritura explícita y cada tween sabe exactamente de dónde sale.
    gsap.set(head, { yPercent: 42, scale: 1.9, autoAlpha: 0 });
    gsap.set(cols, { autoAlpha: 0, y: 40 });
    gsap.set(tail, { yPercent: 100 });

    // El trigger dispara y se retira: `once: true`, sin `scrub`. El start es el
    // momento en que el bloque se pega al viewport, que es cuando el footer
    // pasa a ocupar la pantalla entera y la escena tiene sentido — no antes.
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: track,
        start: "top top",
        once: true,
        invalidateOnRefresh: true,
        markers: DEBUG_MARKERS,
      },
    });

    // Tiempo 1 — el titular llega solo, a tamaño de portada.
    // `transformOrigin` arriba a la izquierda: el titular tiene que encogerse
    // HACIA su posición final, no hacia su propio centro, o el segundo tiempo
    // se lee como un zoom-out en vez de como un asentamiento.
    tl.to(head, { yPercent: 0, autoAlpha: 1, duration: 0.75 }, 0);

    // Tiempo 2 — se encoge a su sitio y entran las columnas por debajo.
    // El solape (las columnas empiezan en 0.95, el titular termina de encoger
    // en 1.5) es lo que hace que los dos tiempos se lean como un movimiento y
    // no como dos.
    tl.to(head, { scale: 1, duration: 0.9, ease: "power4.inOut" }, 0.6);
    tl.to(cols, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 }, 0.95);

    // Tiempo 3 — el wordmark y el legal suben desde el borde y asientan.
    tl.to(tail, { yPercent: 0, duration: 0.9, ease: "power4.out" }, 1.5);

    return () => {
      off();
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([head, tail, ...cols], { clearProps: "transform,opacity,visibility" });
    };
  });

  return (
    <footer ref={rootRef} className="group relative z-30 bg-ink text-cream">
      <div className="lg:motion-safe:hidden">
        <FooterStaticFallback />
      </div>

      {/* El track. Su ALTO es el recorrido de la escena, y solo existe con la
          escena encendida: `group-data-[scene=on]` lee el atributo del footer,
          que escribe `enableScene`. Apagado, el track mide su contenido. */}
      <div
        data-track
        className="relative hidden lg:motion-safe:block lg:motion-safe:group-data-[scene=on]:h-[150svh]"
      >
        <div className="flex h-[100svh] flex-col justify-between overflow-hidden lg:group-data-[scene=on]:sticky lg:group-data-[scene=on]:top-0">
          {/* Titular y columnas en una FILA, con el reparto declarado.
              `minmax(0,1fr)_minmax(0,var(--links))` en vez de `1fr_auto`: con
              `auto`, el bloque de links pedía todo el ancho que sus líneas
              podían usar y el titular se quedaba con lo que sobrara — que en la
              escala 1.9 del primer tiempo lo partía en cuatro renglones
              ("Where / money / actually / moves."). Fijando el ancho de los
              links, lo que sobra es del titular, que es al revés y es lo
              correcto: el titular llega primero y es lo único en pantalla
              cuando llega. */}
          <Container
            className="grid gap-16 pt-[10vh] lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--links))] lg:gap-24"
            style={{ "--links": "48rem" } as React.CSSProperties}
          >
            {/* El wrapper del titular es el que se transforma; el `p` de
                adentro queda intacto para que el token tipográfico siga
                mandando sobre el tamaño real. */}
            <div data-head className="origin-top-left will-change-transform">
              <FooterHeadline dark className="text-h2" />
            </div>

            <FooterLinks dark itemAttr="data-col" />
          </Container>

          {/* El copyright va SOBRE el wordmark, en la esquina inferior derecha
              — dentro del hueco que deja la "r", que es el único blanco grande
              del bloque. Es la única línea del footer que no es un destino, así
              que puede vivir encima del logo sin competir con nada.

              `mix-blend-difference` resuelve que caiga sobre negro o sobre el
              trazo blanco de la "r" sin saber cuál de los dos le toca según el
              ancho de la pantalla. */}
          <div data-tail className="relative">
            <FooterWordmark invert alt="NEAR" />
            <div className="pointer-events-none absolute inset-x-0 bottom-4 mix-blend-difference">
              <Container>
                <FooterLegal tone="blend" />
              </Container>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
