"use client";

import { ArrowUp } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import StatCallout from "@/components/primitives/StatCallout";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// Stepper de 5 pasos. La sección se queda pegada mientras el scroll avanza por
// los steps; en cada uno se resalta una palabra de la columna derecha, la
// lista se desplaza para que la activa caiga en el carril del botón verde, y
// las columnas izquierda y central hacen cross-fade PURO al contenido nuevo
// (sin desplazamiento — es un cambio de contenido, no un scroll interno).
//
// ── Por qué `position: sticky` y NO `pin: true` de ScrollTrigger ───────────
// Un pin de GSAP inserta un pin-spacer en el documento, lo que arrastra tres
// problemas que PrototypeMotionProvider tiene que contener a mano: refresh()
// mueve el scroll y congela Lenis, el spacer cambia scrollHeight y realimenta
// el ResizeObserver del provider, y en StrictMode queda un spacer fantasma
// (ver el comentario de useGsapContext.ts). Nada de eso hace falta: el sticky
// lo hace el navegador de forma nativa, y ScrollTrigger queda reducido a LEER
// el progreso — sin pin, sin scrub, sin tocar el scroll. Como efecto lateral,
// sin JS la sección sigue siendo legible.
const STEPS = [
  {
    word: "1+ Million",
    eyebrow: "Built on Scale",
    value: "1M+",
    label: "daily wallets",
    body: "Real people moving real value every day — not bots inflating a chart.",
  },
  {
    word: "$20+",
    eyebrow: "Built on Volume",
    value: "$20B",
    label: "settled",
    body: "Cross-chain volume cleared on-chain, with finality in under a second.",
  },
  {
    word: "100%",
    eyebrow: "Built on Proof",
    value: "100%",
    label: "uptime",
    body: "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
  },
  {
    word: "Quantum",
    eyebrow: "Built on Math",
    value: "0",
    label: "quantum exposure",
    body: "Post-quantum signatures from day one, so nothing you sign today expires tomorrow.",
  },
  {
    word: "Confidential",
    eyebrow: "Built on Privacy",
    value: "TEE",
    label: "on every node",
    body: "Confidential compute by default: your data stays yours, even from the validators.",
  },
] as const;

// Cuánto scroll ocupa cada step. La altura total del recorrido sale de dos CSS
// vars multiplicadas en la clase, así agregar o quitar un step no obliga a
// recalcular el número a mano.
const STEP_VH = "65svh";

const DIM_WORD = 0.06; // opacidad de las palabras inactivas

// La columna derecha se lee como una cinta infinita SIN ser un loop: se
// renderizan las mismas 5 palabras tres veces (relleno arriba · las reales ·
// relleno abajo) y se sigue desplazando exactamente igual que antes. La
// posición sigue siendo determinista y finita — 5 destinos fijos atados al
// step, cero módulos, cero reciclado de nodos. Lo único que cambia es que
// nunca se ve un extremo de la lista.
//
// Solo el bloque del medio lleva `data-word`, así que toda la lógica de `go()`
// (offsetTop, resaltado) sigue viendo exactamente 5 elementos y no necesita
// saber que el relleno existe. Las copias se quedan con la opacidad tenue de
// su clase: nunca se resaltan.
//
// Las copias están a 5 slots de distancia y el carril muestra ~3.7, así que
// nunca se ve la misma palabra dos veces. Si se agranda `data-rail` más allá
// de 5 slots de alto, eso deja de ser cierto.
const RAIL_COPIES = [-1, 0, 1];

export default function ProofStats() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    // El stepper solo corre en desktop y con movimiento permitido. Por debajo
    // de eso la sección no se pega, no mide 325svh y los 5 steps se leen
    // apilados en flujo normal — de eso se encarga el CSS, que cuelga del
    // atributo data-stepper que este efecto enciende.
    mm.add({ motionOk: MQ.motion, isDesktop: MQ.desktop }, (mctx) => {
      const { motionOk, isDesktop } = mctx.conditions as {
        motionOk: boolean;
        isDesktop: boolean;
      };

      // El float idle del botón corre siempre que haya movimiento permitido,
      // stepper o no.
      const arrow = q("[data-arrow]")[0];
      if (motionOk && arrow) {
        pauseOffscreen(
          gsap.to(arrow, {
            y: -6,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
          scope
        );
      }

      if (!motionOk || !isDesktop) return;

      const panels = q("[data-panel]");
      const words = q("[data-word]");
      const list = q("[data-list]")[0];
      const rail = q("[data-rail]")[0];
      const cursor = q("[data-cursor]")[0];
      if (panels.length === 0 || words.length !== panels.length || !list || !rail) return;

      const N = panels.length;

      // Enciende el layout superpuesto. Va por atributo y no por breakpoint a
      // secas: con reduced-motion en desktop los 5 paneles quedarían
      // encimados e ilegibles si el CSS decidiera solo.
      const host = scope as HTMLElement;
      host.dataset.stepper = "on";

      let active = -1;

      // mctx.add() y no una función suelta: los tweens de `go` se crean DENTRO
      // del onUpdate, o sea después de que el context terminó de capturar. Sin
      // esto no quedan en el scope, ctx.revert() no los revierte, y un
      // desmontaje a mitad de un fade deja opacity inline pegada para siempre.
      mctx.add("go", (i: number) => {
        const prev = active;
        active = i;

        if (prev >= 0 && panels[prev]) {
          gsap.to(panels[prev], {
            autoAlpha: 0,
            duration: 0.25,
            ease: "power1.out",
            overwrite: "auto",
          });
        }
        // autoAlpha y no opacity: agrega visibility:hidden al llegar a 0, así
        // los paneles inactivos no quedan focuseables ni los lee un screen
        // reader.
        gsap.to(panels[i], {
          autoAlpha: 1,
          duration: 0.4,
          ease: "power1.out",
          delay: prev >= 0 ? 0.08 : 0,
          overwrite: "auto",
        });

        // La lista se desplaza para centrar la palabra activa en el carril —
        // que es exactamente donde está el botón verde. Se LEE DEL DOM en cada
        // paso, así que un resize o un cambio de tamaño de fuente no lo
        // desalinea, y no hace falta invalidateOnRefresh (el mismo que rompió
        // el reveal de QuantumRevealHeading).
        const w = words[i];
        const y = rail.clientHeight / 2 - (w.offsetTop + w.offsetHeight / 2);

        // El cursor se recuesta contra el borde izquierdo del título activo,
        // casi tocándolo. Se mide con rects en vez de offsetLeft porque `list`
        // está alineado a la derecha y su ancho es el del título más largo, no
        // el del activo; el tween vertical en curso no afecta esta medición.
        //
        // El ancho del botón se LEE (no se hardcodea): su tamaño está en `em`
        // del display fluido, así que cambia con el viewport. El aire es una
        // fracción de ese ancho, así el conjunto escala parejo.
        const cursorW = cursor?.offsetWidth ?? 0;
        // Clamp en 0: un título más ancho que el carril tiene el borde
        // izquierdo fuera de cuadro.
        const cursorX = cursor
          ? Math.max(
              0,
              w.getBoundingClientRect().left -
                rail.getBoundingClientRect().left -
                cursorW * 1.16
            )
          : 0;

        if (prev < 0) {
          // Primer posicionamiento: instantáneo. El bloque real arranca debajo
          // de un bloque entero de relleno, así que animar hasta acá sería un
          // desplazamiento de ~700px bien visible al cargar la página.
          gsap.set(list, { y });
          if (cursor) gsap.set(cursor, { x: cursorX });
        } else {
          gsap.to(list, { y, duration: 0.6, ease: "power3.out", overwrite: "auto" });
          if (cursor) {
            gsap.to(cursor, {
              x: cursorX,
              duration: 0.6,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        }

        // Todas comparten text-foreground, así que el resaltado es puro tween
        // de opacidad — no hay que animar `color`.
        gsap.to(words, { opacity: DIM_WORD, duration: 0.4, overwrite: "auto" });
        gsap.to(w, { opacity: 1, duration: 0.4, overwrite: "auto" });
      });

      // Estado inicial: los paneles arrancan invisibles (clase invisible +
      // opacity-0 con el stepper encendido) y este primer go pone el 1º en su
      // lugar sin delay.
      mctx.go(0);

      // ScrollTrigger de SOLO LECTURA: ni pin ni scrub. start/end calzan
      // exactamente con el tramo en que el hijo sticky está pegado, así que
      // progress 0→1 es el recorrido completo del stepper.
      ScrollTrigger.create({
        trigger: scope,
        start: "top top",
        end: "bottom bottom",
        markers: DEBUG_MARKERS,
        onUpdate: (self) => {
          // Umbrales uniformes: cada step ocupa 1/N del recorrido. El clamp es
          // por progress === 1, que daría N.
          const i = Math.min(N - 1, Math.floor(self.progress * N));
          if (i !== active) mctx.go(i);
        },
      });

      return () => {
        delete host.dataset.stepper;
        // Red de seguridad por si algún tween de `go` quedó fuera del scope:
        // sin esto un desmontaje a mitad de un fade deja opacity/visibility
        // inline pegadas.
        const all = [...panels, ...words, list, ...(cursor ? [cursor] : [])];
        gsap.killTweensOf(all);
        gsap.set(all, { clearProps: "opacity,visibility,transform" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-stepper="off"
      style={
        { "--steps": STEPS.length, "--step-vh": STEP_VH } as React.CSSProperties
      }
      // OJO: nada de `overflow-hidden` acá. Un ancestro con overflow distinto
      // de visible se vuelve el contenedor de scroll del sticky de abajo, y el
      // sticky deja de pegarse al viewport — silenciosamente. El recorte de
      // las palabras lo hace el propio [data-rail], que no es ancestro.
      className="group/proof relative bg-background text-foreground data-[stepper=on]:h-[calc(var(--steps)*var(--step-vh))]"
    >
      {/* Solo se pega cuando el stepper está realmente corriendo. `relative`
          siempre: es el ancestro del carril, que va fuera de Container. */}
      <div className="relative group-data-[stepper=on]/proof:sticky group-data-[stepper=on]/proof:top-0 group-data-[stepper=on]/proof:flex group-data-[stepper=on]/proof:h-svh group-data-[stepper=on]/proof:items-center">
        <Container className="grid grid-cols-1 items-center gap-12 py-24 lg:py-0">
          {/* Los 5 paneles viven todos en el DOM y solo cambia su opacidad —
              nada de reescribir textContent (provoca layout shift y rompe la
              accesibilidad). Se superponen en la misma celda de grid SOLO con
              el stepper encendido; sin JS, en mobile o con reduced-motion
              quedan en flujo normal y los 5 steps se leen apilados. */}
          <div className="grid gap-16">
            {STEPS.map((step) => (
              <div
                key={step.word}
                data-panel
                // El gap-x grande entre el eyebrow y el stat es lo que empuja
                // el bloque central hacia el medio de la página, en vez de
                // dejarlo amontonado contra el borde izquierdo.
                className="grid grid-cols-1 items-start gap-6 group-data-[stepper=on]/proof:invisible group-data-[stepper=on]/proof:opacity-0 group-data-[stepper=on]/proof:[grid-area:1/1] lg:grid-cols-[15rem_minmax(0,28rem)] lg:gap-x-24 lg:gap-y-10"
              >
                <Eyebrow className="text-foreground">{step.eyebrow}</Eyebrow>
                <div className="flex flex-col gap-5">
                  <StatCallout value={step.value} label={step.label} />
                  <p className="max-w-xs text-body-sm text-muted-foreground text-pretty">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </Container>

        {/* El carril va FUERA de Container y absoluto contra el borde del
            viewport. Compensar el px-[60px] con un margen negativo no
            alcanzaba: Container es `max-w-[1780px] mx-auto`, así que en
            pantallas más anchas queda un margen muerto y los títulos nunca
            llegarían al borde real.

            `-right-4` los empuja 16px MÁS ALLÁ del borde para que se corten un
            poco, como pediste — ese es el número a tocar si querés más o menos
            corte. El `overflow-hidden` produce los tres cortes (arriba, abajo
            y derecha) y tiene que vivir acá, no en la sección: en la sección
            rompería el sticky.

            `inset-y-0` en vez de una altura fija: el carril mide lo que el
            viewport, así el título activo queda centrado en pantalla y los
            demás se cortan contra el borde superior e inferior.

            Decoración pura — sin `aria-hidden` un lector de pantalla leería
            las 5 palabras tres veces, una por copia del relleno. */}
        <div
          data-rail
          aria-hidden="true"
          className="absolute -right-4 inset-y-0 hidden w-1/2 overflow-hidden lg:block"
        >
          {/* El botón marca el carril: vertical fijo (la lista se mueve para
              que la palabra activa caiga acá), horizontal siguiendo el borde
              izquierdo del título activo — con los títulos alineados a la
              derecha sus anchos difieren mucho, y un botón clavado a la
              izquierda quedaría descolgado.

              `text-display` no pinta texto: fija el font-size fluido para que
              el `em` del tamaño del botón escale con los títulos.

              Dos elementos anidados y NINGÚN transform de Tailwind acá: el
              centrado vertical se hace con `top: calc(50% - la mitad del
              botón)` y no con `-translate-y-1/2`, porque GSAP anima transforms
              en los dos (x en el wrapper, y en el botón) y le sobreescribiría
              la clase — que es justo el bug que tenía el float idle. */}
          <div
            data-cursor
            className="absolute left-0 top-[calc(50%-0.19em)] z-10 text-display"
          >
            <span
              data-arrow
              className="flex size-[0.38em] items-center justify-center rounded-[0.075em] bg-near-green"
            >
              <ArrowUp className="size-1/2 text-white" strokeWidth={1.75} />
            </span>
          </div>

          {/* `right-0` + `items-end`: los títulos terminan pegados al borde. */}
          <div
            data-list
            className="absolute right-0 top-0 flex flex-col items-end gap-2 will-change-transform"
          >
            {RAIL_COPIES.map((copy) =>
              STEPS.map((step) => (
                <span
                  key={`${copy}:${step.word}`}
                  // Solo el bloque del medio es "real": es el que `go()` mide
                  // y resalta. Las copias son relleno visual.
                  {...(copy === 0 ? { "data-word": "" } : {})}
                  className="text-display font-medium leading-none whitespace-nowrap opacity-[0.06]"
                >
                  {step.word}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
