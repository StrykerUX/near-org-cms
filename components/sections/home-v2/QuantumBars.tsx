"use client";

import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "./HeroVideo";

const STATEMENT =
  "NEAR is open infrastructure powering the agent economy. Quantum-resistant and confidential by design, NEAR empowers you to trade anything anywhere and own your intelligence.";

// Los escalones de cada columna, en múltiplos de `--u`. `offset` es dónde
// empieza el escalón desde el borde y `height` cuánto mide; los dos suman
// siempre 1.5, así que las siete barras terminan a la misma altura y forman una
// escalera limpia. La central no lleva escalones: es el valle.
const COLUMNS: ({ offset: number; height: number } | null)[] = [
  { offset: 0, height: 1.5 },
  { offset: 0.5, height: 1 },
  { offset: 1, height: 0.5 },
  null,
  { offset: 1, height: 0.5 },
  { offset: 0.5, height: 1 },
  { offset: 0, height: 1.5 },
];

const u = (n: number) => `calc(var(--u) * ${n})`;

// Desfase entre carácter y carácter del barrido, en unidades de la timeline. Es
// lo que decide el ANCHO del frente de luz: más chico, el brillo cruza como una
// línea fina; más grande, media frase se ilumina a la vez. Lo comparten la capa
// base y la de brillo — si se separan, el brillo deja de coincidir con la letra
// que enciende.
const CHAR_STEP = 0.03;

export default function QuantumBars() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const cols = q("[data-qbar-col]");
      const stage = q("[data-quantum='stage']")[0];
      if (cols.length !== COLUMNS.length || !stage) return;

      // ── 1. Las barras crecen de afuera hacia adentro ──────────────────────
      //
      // El `start` es una función y no una constante porque tiene que anclar el
      // progreso a la posición DOCUMENTAL de las barras: esta sección se solapa
      // con el hero, así que su top ya está por encima del fondo del viewport
      // cuando la página carga. Sin este ajuste el scrub arrancaría con
      // progress > 0 y las barras aparecerían ya medio crecidas.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: () => {
            const top = scope.getBoundingClientRect().top + window.scrollY;
            return `top+=${Math.max(0, window.innerHeight - top)} bottom`;
          },
          endTrigger: stage,
          end: "center center",
          scrub: true,
          invalidateOnRefresh: true,
          markers: DEBUG_MARKERS,
        },
      });

      cols.forEach((col, i) => {
        const core = col.querySelector<HTMLElement>("[data-qbar-core]");
        const top = col.querySelector<HTMLElement>("[data-qbar-top]");
        const bottom = col.querySelector<HTMLElement>("[data-qbar-bottom]");

        // `top` y NO `center` (que es lo que usa el original) en el bloque
        // sólido. El origen no es un detalle estético acá: es lo que garantiza
        // que no se abra una franja entre el video del hero y el gris.
        //
        // El borde superior del bloque vive en `u·1.5`, o sea 59px (u·0.25) POR
        // ENCIMA de donde termina el video. Con origen `top` ese borde se queda
        // clavado ahí sea cual sea el `scaleY`, así que el solape existe desde el
        // primer frame. Con origen `center` el bloque se expande hacia los dos
        // lados: al principio su borde superior está MÁS ABAJO que el fondo del
        // video —medido: 944 contra 862 a 40px de scroll— y en esa ventana
        // (~20-75px de scroll, justo el primer gesto) se ve el crema de la
        // página entre los dos.
        //
        // Visualmente: el gris baja como una persiana desde debajo de la imagen
        // en vez de abrirse desde el centro. La escalera, que es el efecto real,
        // la siguen dibujando los escalones de aquí abajo.
        gsap.set(core, { scaleY: 0, transformOrigin: "top" });
        if (top) gsap.set(top, { scaleY: 0, transformOrigin: "bottom" });
        if (bottom) gsap.set(bottom, { scaleY: 0, transformOrigin: "top" });

        // 0 para el par exterior … 3 para la central. Los extremos arrancan
        // primero, y la escalera se cierra hacia el centro.
        const ring = Math.min(i, cols.length - 1 - i);
        tl.to(core, { scaleY: 1, duration: 0.12, ease: "none" }, 0);

        const at = 0.15 + ring * 0.2;
        if (top) tl.to(top, { scaleY: 1, duration: 0.4, ease: "none" }, at);
        if (bottom) tl.to(bottom, { scaleY: 1, duration: 0.4, ease: "none" }, at);
      });

      // ── 2. Barrido luminoso sobre el párrafo ──────────────────────────────
      //
      // Dos capas de texto idéntico superpuestas: la real (que se enciende de
      // gris a negro) y una copia decorativa encima que va tomando color y
      // apagándose, carácter por carácter. El brillo tiene que compartir la
      // rasterización EXACTA de los glifos, o se ve como un halo desalineado.
      //
      // El original clonaba el nodo con cloneNode(), lo posicionaba absoluto y
      // mantenía left/top/width en sincronía con un ResizeObserver, mapeando
      // char↔char por índice de querySelectorAll('*'). Acá las dos capas están
      // en la MISMA celda de grid con el mismo texto: comparten layout por
      // construcción, sin medir nada, y los dos arrays de chars se corresponden
      // 1:1 porque salen del mismo string.
      const line = q("[data-quantum='line']")[0];
      const shineLine = q("[data-quantum='shine']")[0];

      let splits: SplitText[] = [];
      if (line && shineLine) {
        const base = SplitText.create(line, { type: "chars", smartWrap: true, aria: "auto" });
        const shine = SplitText.create(shineLine, { type: "chars", smartWrap: true });
        splits = [base, shine];

        gsap.set(base.chars, { opacity: 0.25 });
        // La capa de brillo se enciende acá (arranca en opacity-0 por CSS) y
        // sus caracteres quedan invisibles hasta que el barrido los toca.
        gsap.set(shineLine, { opacity: 1 });
        gsap.set(shine.chars, { opacity: 0 });

        const sweep = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top 80%",
            end: "bottom 45%",
            scrub: 0.5,
            markers: DEBUG_MARKERS,
          },
        });

        sweep.to(base.chars, {
          opacity: 1,
          duration: 0.16,
          ease: "none",
          stagger: { each: CHAR_STEP },
        }, 0);

        // UN tween con keyframes + stagger, no uno por carácter.
        //
        // Esto era un `forEach` que creaba un tween por char con su posición
        // absoluta en `i * CHAR_STEP`: ~170 objetos de tween que GSAP tenía que
        // actualizar en cada frame del scrub, para un efecto que es el mismo para
        // todos los chars salvo el desfase. `keyframes` y `stagger` se combinan
        // —cada target recorre la secuencia con su propio retardo—, así que
        // `stagger: { each: CHAR_STEP }` en la posición 0 da exactamente las
        // mismas posiciones que la aritmética a mano. Cero diferencia visual.
        //
        // El `color` va solo en el segundo keyframe: en los otros dos era el mismo
        // valor repetido, o sea trabajo por frame para reescribir lo ya escrito.
        //
        // Y sigue siendo `var(--near-teal)` a propósito, aunque el resto del
        // toolkit use literales: GSAP no resuelve custom properties, así que no
        // interpola desde el color heredado — le asigna la cadena y el navegador
        // la resuelve. El resultado es un CORTE a teal al empezar este keyframe,
        // que es el efecto que tiene hoy. Con un literal GSAP interpolaría el
        // color durante 0.2s, que se ve distinto.
        sweep.to(shine.chars, {
          keyframes: [
            { opacity: 1, duration: 0.12, ease: "none" },
            { color: "var(--near-teal)", opacity: 0.85, duration: 0.2, ease: "none" },
            { opacity: 0.5, duration: 0.22, ease: "none" },
            { opacity: 0, duration: 0.4, ease: "none" },
          ],
          stagger: { each: CHAR_STEP },
        }, 0);
      }

      // ── Sin parallax, a propósito ─────────────────────────────────────────
      //
      // El original desplaza esta sección ~130px hacia abajo mientras el barrido
      // corre y la devuelve después (`0.2 * (alto del stage + 0.35 * vh)`). Acá
      // NO existe, y no es un olvido: el efecto es incompatible con el resto de
      // la sección, se mire por donde se mire.
      //
      //   · Moviendo la SECCIÓN se van también las barras, que están calzadas
      //     con el borde inferior del video del hero (para eso existe toda la
      //     geometría `--u`). Al despegarse, entre las dos asoma el crema de la
      //     página, y ningún alto de video lo tapa: lo que se va es la escalera.
      //
      //   · Moviendo solo el CONTENIDO las barras se quedan quietas, pero
      //     entonces el texto se descentra del marco que lo enmarca — que es
      //     justamente la composición de la sección.
      //
      // Con el marco anclado al hero, el texto no puede moverse sin descentrarse.
      // El efecto real de esta sección es el barrido luminoso carácter a
      // carácter; el desplazamiento del bloque no aportaba nada que el patrón de
      // barras —uniforme y sin detalle— dejara percibir.

      return () => {
        splits.forEach((s) => s.revert());
        if (shineLine) gsap.set(shineLine, { clearProps: "opacity" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // z-[2] y margin-top negativo: esta sección MONTA sobre el final del hero,
    // que mide 100svh.
    //
    // ── El número es u·1.5, y tiene que ser EXACTAMENTE ese ─────────────────
    // El bloque sólido gris arranca a u·1.5 del top de esta sección, así que
    // subirla u·1.5 lo deja empezando justo en `100svh`: el píxel donde termina
    // el video. Los dos bordes coinciden, y de ahí salen las dos garantías:
    //
    //   · no sobra gris → el bloque no invade el hero con una línea recta
    //     cruzando el video (lo que pasaba con u·1.75: 59px de solape);
    //   · no falta gris → no queda franja de crema entre el video y la barra.
    //
    // Lo que SÍ debe invadir el hero son los escalones, que ocupan su franja de
    // u·1.5 por encima y se recortan sobre la imagen. Esa es la figura; el
    // bloque uniforme nunca debió participar de ella.
    //
    // Los 2px son costura antisubpíxel, no un solape de diseño.
    //
    // El original escribe el margen como
    //   calc(100vh − max(100vh − u*1.75, 760px) − u*1.75)
    // y usa u·1.75 porque su video termina en `100vh − u·0.25`, no en 100vh.
    // Con el hero y el video a 100svh, el número que hace coincidir los bordes
    // es u·1.5. Ver la nota de geometría en HeroVideo.tsx.
    <section
      ref={rootRef}
      style={
        {
          "--u": HERO_UNIT,
          marginTop: "calc(-1 * var(--u) * 1.5 - 2px)",
        } as React.CSSProperties
      }
      className="relative z-[2] text-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex">
          {COLUMNS.map((cap, i) => (
            <div key={i} data-qbar-col className="relative flex-1">
              {/* El bloque sólido: idéntico en las 7 columnas, es la caja limpia
                  alrededor del párrafo. */}
              <div
                data-qbar-core
                className="absolute inset-x-0 bg-bar"
                style={{ top: u(1.5), bottom: u(1.5) }}
              />
              {/* Los escalones. El +1px cierra la costura de subpíxel contra el
                  core cuando el ancho de columna no cae en un píxel entero. */}
              {cap && (
                <>
                  <div
                    data-qbar-top
                    className="absolute inset-x-0 bg-bar"
                    style={{ top: u(cap.offset), height: `calc(${u(cap.height)} + 1px)` }}
                  />
                  <div
                    data-qbar-bottom
                    className="absolute inset-x-0 bg-bar"
                    style={{ bottom: u(cap.offset), height: `calc(${u(cap.height)} + 1px)` }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* El aire vertical también se mide en `--u`: escala con el ancho de
          columna, así la caja de texto queda siempre a la misma distancia
          proporcional de los escalones — que es lo que la mantiene centrada
          dentro del marco de barras a cualquier ancho de ventana. */}
      <Container className="relative py-[calc(var(--u)*2)]">
        {/* `isolate` acota el apilado de las dos capas de texto. Las dos ocupan
            la misma celda de grid: mismo string, mismo ancho, mismos quiebres
            de línea — es lo que garantiza que el brillo caiga sobre el glifo. */}
        <div
          data-quantum="stage"
          className="relative isolate mx-auto grid max-w-[64rem] px-10 text-center"
        >
          <h2 data-quantum="line" className="text-h2 text-pretty [grid-area:1/1]">
            {STATEMENT}
          </h2>
          {/* `opacity-0` en la clase, y el JS lo enciende. Es la excepción a la
              regla de no preesconder por CSS: esta capa no es contenido —el
              contenido es el <h2> de arriba, que se ve entero sin JS— sino un
              brillo decorativo. Sin este 0, un fallo del bundle o
              reduced-motion dejarían el párrafo AMARILLO pegado encima del
              negro, ilegible. */}
          <p
            data-quantum="shine"
            aria-hidden="true"
            className="pointer-events-none text-h2 text-sweep opacity-0 text-pretty [grid-area:1/1]"
          >
            {STATEMENT}
          </p>
        </div>
      </Container>
    </section>
  );
}
