"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// Las seis cifras ASOMANDO por el borde inferior del hero.
//
// ── Qué hace ───────────────────────────────────────────────────────────────
//
// El hero mide un poco más que la pantalla, así que esta fila queda cortada por
// el borde: se ve la mitad de arriba de los números y nada más. Sin regla, sin
// separadores y a opacidad baja. Al scrollear, cada cifra sube a opacidad plena
// de a una y recién entonces aparece su rótulo.
//
// Recupera lo que se perdió cuando los heroes pasaron a altura completa: la
// primera pantalla vuelve a anunciar que hay más, sin gastar una flecha ni un
// «scroll» en versalitas. Es el mecanismo de H4 · Cut, que se borró con el resto
// del laboratorio de heroes.
//
// ── Por qué el asomo es una altura y no un padding ────────────────────────
//
// El pedido natural es «ponele padding abajo al contenido del hero». No alcanza:
// con el hero a `min-h-svh` esta fila termina EXACTAMENTE en el borde de la
// pantalla, así que se ve entera por definición y cualquier padding sólo la
// aprieta contra el fondo.
//
// Para que el borde del viewport CORTE los números, el hero tiene que medir
// `100svh + PEEK` con la fila al final del flujo. Lo que queda por debajo del
// fold es exactamente `PEEK`, y de ahí sale el valor: el alto de esta fila menos
// la mitad de la cifra. Es un número calibrado contra este contenido, no una
// constante universal — si cambia el cuerpo de la cifra o del rótulo, se
// recalibra acá.
//
// Por eso se exporta: el hero que la monta necesita el mismo valor para su
// altura, y dos copias del número divergen en el primer ajuste.
export const PROOF_PEEK = "7.5rem";

// La opacidad de las cifras mientras están asomando. No es cero: tienen que
// verse lo bastante para que el lector sepa que hay algo, y lo bastante poco
// para que no le compitan al titular. Es todo el calibre del efecto.
//
// La aplica GSAP y NO un `style` inline, aunque el inline evitaría el frame de
// más en que las cifras se ven enteras. El motivo es `prefers-reduced-motion`:
// con la preferencia activa el timeline no se crea, y un inline al 26% dejaría
// las seis cifras atenuadas para siempre, sin nada que las suba nunca. Un frame
// de sobra es mejor que una banda de datos permanentemente a un cuarto de tinta.
const PEEK_ALPHA = 0.26;

const TONE = {
  light: { value: "text-foreground", label: "text-gray-intermediate" },
  dark: { value: "text-cream", label: "text-cream/50" },
} as const;

// ── Relación con el modo `peek` de H2Count ────────────────────────────────
//
// H2Count tiene el mismo asomo, pero adentro: su marcador ya existía como banda
// a sangre y el asomo es uno de sus dos modos (`marker` | `peek`), sobre el mismo
// DOM. Éste es lo contrario: un añadido para un hero que NO tiene marcador
// propio, montado por un slot.
//
// Son dos piezas y no una duplicada porque resuelven casos distintos, pero
// comparten calibración: si `PEEK`, `PEEK_ALPHA` o el tramo del scrub cambian en
// uno, el otro tiene que seguirlo o los dos heroes dejan de asomar igual.
export default function ProofPeek({ tone = "light" }: { tone?: keyof typeof TONE } = {}) {
  const cfg = TONE[tone];

  // El contador NO corre al montar: las cifras están medio tapadas por el borde
  // de la pantalla, así que contarían para nadie. Espera al scroll, que es el
  // mismo momento en que se revelan.
  const countRef = useCountUp<HTMLDListElement>({ start: "top 78%" });

  const rootRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    // ── El revelado ─────────────────────────────────────────────────────────
    //
    // Atado al scroll con `scrub` y no disparado una vez: lo que el lector hace
    // es descubrir la fila tirando de la página, y con un `once` la secuencia
    // correría sola aunque él se hubiera quedado quieto — que es justamente lo
    // contrario de lo que el gesto propone.
    //
    // El `stagger` es lo que hace que suban «de a una». Con scrub, el escalonado
    // no es tiempo sino RECORRIDO: las seis se reparten el tramo de scroll, así
    // que la primera está entera cuando la última todavía no empezó.
    //
    // Dos animaciones y no una sola sobre la celda entera: la cifra sube de
    // `PEEK_ALPHA` a 1 —ya estaba visible, sólo gana peso— y el rótulo entra
    // desde cero con desplazamiento. Animar el bloque completo obligaría a las
    // dos a compartir curva y punto de partida, y el rótulo aparecería a un
    // cuarto de opacidad desde el principio, que es exactamente el ruido que el
    // asomo quiere evitar.
    mm.add(MQ.motion, () => {
      const cells = q("[data-proof-cell]");
      const texts = q("[data-proof-text]");
      if (cells.length === 0) return;

      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: "top 45%",
          scrub: 0.6,
          markers: DEBUG_MARKERS,
        },
      });

      tl.fromTo(cells, { autoAlpha: PEEK_ALPHA }, { autoAlpha: 1, duration: 1, stagger: 0.35 }, 0);
      tl.from(texts, { autoAlpha: 0, y: 10, duration: 0.9, stagger: 0.12 }, 0.35);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        // Sin `clearProps` las celdas quedan con la opacidad inline del último
        // frame, y en dev eso pasa en cada montaje por StrictMode — no sólo al
        // navegar.
        gsap.set([...cells, ...texts], { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // Ni regla ni filetes. Lo único que se ve asomando son las cifras, y una
    // regla cruzando el borde inferior de la pantalla se leería como el final del
    // hero — o sea, exactamente lo contrario de lo que el asomo tiene que decir.
    // Lo que agrupa a las seis acá es que estén cortadas por la misma línea.
    <div ref={rootRef} className="relative z-20">
      <Container>
        <dl
          ref={countRef}
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
        >
          {PROOF.map((stat) => (
            <div key={stat.id} data-proof-cell className="flex flex-col gap-1 pt-7">
              {/* El valor de partida es el FINAL, escrito en el HTML: sin JS o
                  con reduced-motion la cifra ya está bien. El contador lo pisa en
                  el primer frame si va a correr. */}
              <dd data-count={stat.value} className={`text-h2 tabular-nums ${cfg.value}`}>
                {stat.value}
              </dd>
              <dt data-proof-text className={`uppercase text-micro-mono ${cfg.label}`}>
                {stat.label}
              </dt>
              {stat.note && (
                <dd data-proof-text className={`text-micro-mono ${cfg.label}`}>
                  {stat.note}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
