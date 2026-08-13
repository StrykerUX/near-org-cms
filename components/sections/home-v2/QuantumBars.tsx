"use client";

import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "@/components/sections/home-v2/heroGeometry";
import {
  CASCADE,
  SCROLL_DEPTH,
  STAIR_COLUMNS,
  STAIR_SPAN,
  cascadeEdges,
  ringOf,
  stairOffsets,
  u,
} from "@/components/sections/home-v2/stairGeometry";
import { BARS_STATEMENT as STATEMENT } from "@/components/sections/home-v2/homeV2Content";

// ── La escalera sube en cascada y tapa el hero ───────────────────────────────
//
// Siete paneles grises, uno por columna, que suben con `scaleY` y origen abajo. La forma
// y el reloj viven en `stairGeometry.ts`; acá está el pintado y el statement.
//
// Esto reemplaza un mecanismo anterior que dibujaba cada columna con TRES piezas —un
// escalón arriba, un bloque uniforme y su espejo abajo— y las animaba por separado. Vale
// dejar escrito por qué se fue, porque la forma de la figura no cambió y el diff parece
// gratuito:
//
//   · El bloque uniforme abarcaba las siete columnas, así que mientras crecía la silueta
//     era un RECTÁNGULO DE ANCHO COMPLETO. Y crecía primero (los siete a la vez, en el
//     primer 12% del recorrido), o sea que lo primero que se veía al scrollear era una
//     barra gris plana en lugar de una escalera. Como `offset + height` sumaba siempre
//     1.5, las tres piezas eran la misma figura que una sola — eran una descomposición
//     para poder animarlas, y esa descomposición ERA el defecto. `stairOffsets()` las
//     fusiona, y de paso se van las dos costuras de `+1px` que necesitaban entre sí.
//   · Los cuatro anillos subían a la misma velocidad con `ease: "none"` y arranques
//     escalonados, así que cada uno frenaba en seco al terminar su tween: cuatro paradas
//     secas seguidas. Ahora entran a velocidades graduadas, los interiores aceleran para
//     alcanzar a los laterales y los cuatro aterrizan amortiguados.
//
// El laboratorio donde se probó esto y los siete approaches que fallaron antes están en
// `components/sections/lab/README.md`. Conviene mirarlo antes de proponer otro ritmo.
//
// ── Coste por frame ──────────────────────────────────────────────────────────
// Siete `scaleY` por `quickSetter`, que van al compositor, contra los 19 tweens que
// GSAP tenía que actualizar antes. El barrido del statement no cambió.

// Desfase entre carácter y carácter del barrido, en unidades de la timeline. Es
// lo que decide el ANCHO del frente de luz: más chico, el brillo cruza como una
// línea fina; más grande, media frase se ilumina a la vez. Lo comparten la capa
// base y la de brillo — si se separan, el brillo deja de coincidir con la letra
// que enciende.
const CHAR_STEP = 0.03;

// ── El retiro del borde inferior ─────────────────────────────────────────────
//
// Mismas perillas que la entrada salvo una: `drop = 0` hace que los cuatro anillos
// arranquen en la MISMA línea —el fondo de la sección— en vez de escalonados. Eso es lo
// que permite que la escalera se abra hacia afuera al salir, con los laterales primero,
// que es el espejo exacto de lo que pasa arriba.
//
// Con la escalera de partida sí escalonada (que es lo que pone el layout) el orden se
// invierte y no hay forma de arreglarlo con velocidades: el anillo central arranca 1.5·u
// más arriba que el exterior —446px a 2080 de ancho— y los dos terminan en el mismo tope,
// así que el exterior a lo sumo lo empata. Para adelantarlo tendría que pasar de largo, y
// ahí está el borde superior.
const EXIT = { ...CASCADE, drop: 0 } as const;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function QuantumBars() {
  const bottomOffsets = stairOffsets(STAIR_SPAN);

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const panels = q("[data-qbar-col]");
      const stage = q("[data-quantum='stage']")[0];
      if (panels.length !== STAIR_COLUMNS || !stage) return;

      // ── 1. Los paneles suben en cascada, y al salir se retiran igual ──────
      //
      // Los DOS bordes se animan, así que hacen falta dos grados de libertad. Con
      // `transformOrigin: top`, `y` coloca el borde superior y `scaleY` fija la distancia
      // hasta el inferior. Las dos van al compositor y GSAP las compone en una sola
      // matriz: son 14 escrituras por frame en vez de 7, sin tocar layout ni paint.
      //
      // La alternativa era `clip-path`, y está descartada por lo mismo que descartó al
      // approach del tallado: no va al compositor, paga repintado por frame.
      //
      // `scaleY` puede pasar de 1 y no pasa nada: escalar un rectángulo de color plano no
      // lo distorsiona. Hace falta que pueda, porque la caja de layout de cada panel
      // termina en su peldaño (`bottom: u(offset)`) y el borde inferior arranca MÁS ABAJO
      // que eso, en una línea recta al fondo de la sección.
      gsap.set(panels, { transformOrigin: "top", y: 0, scaleY: 0 });
      const setY = panels.map((panel) => gsap.quickSetter(panel, "y", "px") as (v: number) => void);
      const setScale = panels.map(
        (panel) => gsap.quickSetter(panel, "scaleY") as (v: number) => void
      );

      // Medidas que solo cambian al redimensionar. `offsetHeight` es un valor de LAYOUT:
      // no lo contamina el `scaleY` que estamos escribiendo, a diferencia de
      // `getBoundingClientRect`, que devolvería el alto ya escalado y realimentaría el
      // cálculo.
      let unitPx = window.innerWidth / STAIR_COLUMNS;
      let viewportH = window.innerHeight;
      let seamDoc = 0;
      let sectionTopDoc = 0;
      let sectionBottomDoc = 0;
      /** Recorrido de la ENTRADA: dónde arranca y cuánto scroll dura. */
      let inStart = 0;
      let inSpan = 1;
      /** Recorrido de la SALIDA, el retiro del borde inferior. */
      let outStart = 0;
      let outSpan = 1;
      /** Fondo del statement. El borde inferior no puede subir por encima de acá. */
      let textBottomDoc = 0;
      /** Alto natural de cada panel. Difiere por columna: su caja termina en su peldaño. */
      let natural: number[] = [];

      const measure = () => {
        unitPx = window.innerWidth / STAIR_COLUMNS;
        viewportH = window.innerHeight;
        // La juntura está a `-marginTop` del top de la sección: el margen es exactamente
        // `-(100svh + 2px)`, así que de ahí sale el alto del hero sin buscarlo en el DOM.
        const seamOffset = -parseFloat(getComputedStyle(scope).marginTop || "0");
        const box = scope.getBoundingClientRect();
        sectionTopDoc = box.top + window.scrollY;
        sectionBottomDoc = sectionTopDoc + box.height;
        seamDoc = sectionTopDoc + seamOffset;

        // ENTRADA. Arranca con el top de la sección en el top del viewport, y dura el
        // alto del hero menos media escalera: cuando la mitad de la figura salió por el
        // techo, el recorrido terminó.
        inStart = sectionTopDoc;
        inSpan = Math.max(1, seamOffset - (unitPx * SCROLL_DEPTH) / 2);

        // SALIDA. Los dos extremos son hitos reales, no números calibrados:
        //
        //   · arranca cuando el fondo de la sección ENTRA en pantalla, o sea en el primer
        //     frame en que el gesto puede verse;
        //   · termina con ese fondo a un cuarto de viewport del techo, para que se
        //     complete a la vista y no fuera de cuadro.
        //
        // El arranque estuvo un tiempo atado a "el statement ya salió por arriba", que era
        // prudente de más: en ese momento el fondo de la sección ya está a media pantalla,
        // así que el gesto empezaba por la mitad y se perdía su primer tramo. El texto no
        // necesitaba tanto — lo protege el guard de `apply`, no el reloj.
        outStart = sectionBottomDoc - viewportH;
        // Nunca antes de que termine la entrada: con un viewport muy alto los dos extremos
        // de la sección caben a la vez, y solapar los dos gestos vuelve la figura ilegible.
        if (outStart < inStart + inSpan) outStart = inStart + inSpan;
        outSpan = Math.max(1, sectionBottomDoc - 0.25 * viewportH - outStart);

        textBottomDoc = stage.getBoundingClientRect().bottom + window.scrollY;
        natural = panels.map((panel) => panel.offsetHeight);
      };

      const apply = (scroll: number) => {
        const sectionTopY = sectionTopDoc - scroll;

        // El borde SUPERIOR: sube desde la juntura y tapa el hero.
        const top = cascadeEdges({
          eased: clamp01((scroll - inStart) / inSpan),
          seamY: seamDoc - scroll,
          seamY0: seamDoc - inStart,
          span: inSpan,
          viewportH,
          unitPx,
          ...CASCADE,
        });

        // El borde INFERIOR: quieto en el fondo de la sección hasta que arranca la salida,
        // y ahí sube con la misma cascada. Antes de `outStart` el progreso es 0 y los
        // cuatro anillos devuelven el fondo — o sea una línea recta, que es como se ve
        // mientras la sección está en pantalla.
        const bottom = cascadeEdges({
          eased: clamp01((scroll - outStart) / outSpan),
          seamY: sectionBottomDoc - scroll,
          seamY0: sectionBottomDoc - outStart,
          span: outSpan,
          viewportH,
          unitPx,
          ...EXIT,
        });

        // El fondo del statement, mientras siga en pantalla. El borde inferior no puede
        // subir por encima de esta línea: si lo hiciera, el texto se quedaría sin marco
        // gris por debajo y quedaría medio sobre gris y medio sobre crema.
        //
        // Con los valores de hoy el guard NUNCA se activa —hay `u·1.5` de aire y el anillo
        // exterior solo se retira 436px de los 446 disponibles—, y esa holgura de 10px es
        // justamente el problema: es una calibración, no una garantía. Bajar el
        // `paddingBottom` del Container sin tocar nada más rompería el marco en silencio y
        // solo en algunos viewports, que es el modo de fallo que este archivo ya sufrió
        // con la juntura de arriba. Con el guard puesto, el aire de abajo vuelve a ser una
        // decisión de composición libre.
        const textFloor = textBottomDoc - scroll;

        for (let i = 0; i < panels.length; i++) {
          const ring = ringOf(i);
          const t = top[ring];
          let b = bottom[ring];
          if (textFloor > 0 && b < textFloor) b = textFloor;
          // Los dos bordes no pueden cruzarse. Pasa al final del recorrido, cuando el de
          // abajo alcanza al de arriba: a partir de ahí el panel mide 0, no negativo.
          if (b < t) b = t;
          setY[i](t - sectionTopY);
          setScale[i]((b - t) / natural[i]);
        }
      };

      const st = ScrollTrigger.create({
        trigger: scope,
        // El top de la sección ES el top del hero (por el `marginTop` de abajo), así que
        // `top top` da progreso 0 en scroll 0. El mecanismo anterior necesitaba una
        // función de anclaje acá porque su sección empezaba u·1.5 antes del final del
        // hero y su top ya estaba sobre el fold al cargar.
        start: "top top",
        // UN solo trigger que cubre la entrada Y la salida, y `apply` deriva de `scroll`
        // el progreso de cada tramo por su cuenta. Con dos triggers, el que estuviera
        // fuera de rango dejaría de actualizar y su borde se quedaría clavado en el
        // último valor escrito; así los dos bordes se recalculan en cada frame desde una
        // sola fuente.
        end: () => {
          const box = scope.getBoundingClientRect();
          const bottomDoc = box.top + window.scrollY + box.height;
          return `+=${Math.max(1, bottomDoc - 0.25 * window.innerHeight - (box.top + window.scrollY))}`;
        },
        scrub: true,
        invalidateOnRefresh: true,
        markers: DEBUG_MARKERS,
        onRefresh: (self) => {
          measure();
          apply(self.scroll());
        },
        onUpdate: (self) => apply(self.scroll()),
      });
      measure();
      apply(st.scroll());

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

    // ── El caso reduced-motion, que NO es "no hacer nada" ────────────────────
    //
    // Con el bloque de arriba sin correr, los paneles se quedan en su estado de layout:
    // grises desde el top de la sección, que ahora es el top del HERO. Eso taparía el
    // hero entero — la peor composición posible, y justamente la que un fallo del bundle
    // también produciría.
    //
    // Así que este branch los deja en la figura de REPOSO: la escalera formada, con cada
    // columna detenida donde le corresponde, que es la composición que enmarca el
    // statement y se sostiene sola sin animación que la explique.
    mm.add(MQ.reduce, () => {
      const panels = q("[data-qbar-col]");
      const unitPx = window.innerWidth / STAIR_COLUMNS;
      const seamOffset = -parseFloat(getComputedStyle(scope).marginTop || "0");
      panels.forEach((panel, i) => {
        const natural = panel.offsetHeight;
        // Cuánto sube el borde de esta columna por encima de la juntura en la figura
        // formada: `STAIR_SPAN·(3−anillo)/3` unidades, que es la escalera de siempre.
        const above = ((STAIR_SPAN * (3 - ringOf(i))) / 3) * unitPx;
        const top = seamOffset - above;
        // El borde inferior se queda en su peldaño del layout, o sea `scaleY` cubre lo
        // que va del borde superior al fondo de la caja. Sin salida que animar, la figura
        // de reposo es la de siempre: escalera arriba, escalera espejada abajo.
        gsap.set(panel, {
          transformOrigin: "top",
          y: top,
          scaleY: Math.max(0, (natural - top) / natural),
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    // z-[2] y margin-top negativo: esta sección MONTA sobre el hero, que mide 100svh.
    //
    // ── Por qué el margen es 100svh y no u·1.5 ──────────────────────────────
    // El mecanismo anterior subía la sección solo u·1.5 —lo justo para que su bloque
    // gris, que vivía a `top: u·1.5`, cayera en la juntura—. Los paneles de ahora nacen
    // en el TOP de la sección y crecen hacia arriba con `scaleY`, así que la sección
    // tiene que empezar en el top del hero: de otro modo un panel a `scaleY: 1` no
    // llegaría más arriba que u·1.5 sobre la juntura y no podría tapar el hero.
    //
    // El alto TOTAL de la sección crece 100svh, pero lo que se VE no: esos 100svh extra
    // quedan detrás del hero. El aire entre la juntura y el statement lo fija el
    // `paddingTop` del Container, no el margen.
    //
    // Los 2px son costura antisubpíxel, no un solape de diseño.
    <section
      ref={rootRef}
      style={
        {
          "--u": HERO_UNIT,
          marginTop: "calc(-100svh - 2px)",
        } as React.CSSProperties
      }
      className="relative z-[2] text-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex">
          {bottomOffsets.map((offset, i) => (
            <div key={i} className="relative flex-1">
              <div
                data-qbar-col
                // La columna central lleva el marcador que el HUD de `/prototype/descent`
                // busca para no abortar la lectura.
                {...(i === 3 ? { "data-qbar-core": "" } : {})}
                className="absolute inset-x-0 top-0 bg-bar"
                // El borde inferior es la escalera espejada y no se anima. El superior lo
                // mueve `scaleY` con origen abajo.
                style={{ bottom: u(offset) }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* El aire vertical se mide en `--u`: escala con el ancho de columna, así la caja
          de texto queda siempre a la misma distancia proporcional de los escalones — que
          es lo que la mantiene centrada dentro del marco de barras a cualquier ancho.
          El `paddingTop` incluye los 100svh del margen negativo, así que la primera línea
          sigue cayendo a `u·0.5` por debajo de la juntura, igual que antes.

          El de abajo es `u·1.5` y no `u·2` porque era el bloque vacío más grande de la
          sección: con `u·2` había ~990px de scroll —casi un viewport— en los que la figura
          no se movía y la pantalla era gris liso. No baja de ahí por composición, no por
          límite técnico: el guard de `apply` protege al texto solo, así que este número
          se puede mover mirando la página. */}
      <Container
        className="relative"
        style={{
          paddingTop: "calc(100svh + var(--u) * 0.5)",
          paddingBottom: "calc(var(--u) * 1.5)",
        }}
      >
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
