"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// H2 · Count — prueba DENTRO, con movimiento sobre las cifras.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// El titular ya está cuando la página abre; lo que llega son los números,
// contando. Es la variante que pone el movimiento sobre el ARGUMENTO en vez de
// sobre la decoración: en esta página el argumento son las seis cifras, y un
// número que sube retiene la mirada más que el mismo número quieto.
//
// La banda va a sangre en el borde inferior, con separadores verticales y sin
// reglas horizontales: un marcador, no una tabla. Es la lectura opuesta a la de
// H1 (registro en columna) sobre exactamente los mismos seis datos — comparar
// las dos es comparar dos maneras de decir "esto está probado".
//
// ── Por qué el count-up no es un cliché acá ────────────────────────────────
//
// Lo es cuando se aplica a cualquier número. Acá se aplica UNA vez, a los seis
// datos que la página existe para sostener, y con dos límites: dura menos de un
// segundo y medio, y con `prefers-reduced-motion` los números salen directamente
// en su valor final — no hay una versión "suave", hay valor final.
//
// El mecanismo vive en `../countUp.ts` y no acá: nació en este archivo y salió
// cuando las ocho franjas de `proof-labs/` lo necesitaron. Ahí está documentado
// por qué conserva el formato y por qué reserva el ancho antes de contar.
//
// `immediate: true` porque este contador está sobre la línea de flotación: con
// el trigger de viewport ya habría terminado antes de que el lector mire.
//
// ── La prop `surface` ───────────────────────────────────────────────────────
//
// Un hueco opcional detrás del contenido, para montarle un fondo sin duplicar el
// hero. Sin la prop —que es como lo usa `/prototype/protocol-heroes/h2`— no
// cambia absolutamente nada: no hay nodo, no hay capa, no hay costo.
//
// Existe porque `/prototype/protocol-combo/h2` le pone la superficie de
// resharding (`combo-labs/ShardSurface`) y la alternativa era copiar el hero
// entero. Dos copias del mismo hero divergen en el primer ajuste, y justo
// mientras se lo está comparando — que es el peor momento posible.
//
// El contenido va en `z-10` y la superficie en `z-0` dentro de un `isolate`: sin
// el contexto de apilamiento propio, un `z-index` de acá compite con el del
// header fijo y el del footer.
//
// ── La prop `proof`: dos maneras de mostrar el marcador ────────────────────
//
//   · `"marker"` (por defecto) — la banda a sangre con separadores verticales y
//     regla superior, entera dentro de la primera pantalla. Es lo que ve
//     `/prototype/protocol-heroes/h2` y no cambió.
//   · `"peek"` — el hero mide un poco MÁS que la pantalla, así que las seis
//     cifras quedan cortadas por el borde inferior: se ve su mitad superior y
//     nada más. Sin regla, sin separadores y a opacidad baja. Al scrollear, cada
//     una sube a opacidad plena de a una, y recién ahí aparece su rótulo.
//
// El asomo recupera lo que se perdió cuando el hero pasó a altura completa: la
// primera pantalla vuelve a anunciar que hay más, sin gastar una flecha ni un
// «scroll» en versalitas. Es el mecanismo de H4 · Cut, que se borró con el resto
// del laboratorio — sólo que acá lo que asoma son las cifras del propio hero y
// no la sección siguiente.
//
// ── Por qué el asomo es una altura y no un padding ────────────────────────
//
// El pedido natural es «ponele padding abajo al contenido». No alcanza: con el
// section a `min-h-svh` el marcador termina EXACTAMENTE en el borde de la
// pantalla, así que se ve entero por definición y cualquier padding sólo lo
// aprieta contra el fondo.
//
// Para que el borde del viewport CORTE los números, el section tiene que medir
// más de una pantalla: `100svh + PEEK`, con el marcador al final del flujo. Lo
// que queda por debajo del fold es exactamente `PEEK`.
//
// De ahí sale el número: PEEK es el alto del marcador MENOS la mitad de la
// cifra. Con un marcador de ~9rem y cifras de ~3rem, 7.5rem deja asomando 1.5rem
// — la mitad de arriba del número. Es un valor calibrado contra el contenido, no
// una constante universal: si cambia el cuerpo de la cifra o el rótulo, se
// recalibra acá y en ningún otro lado.

// Cuánto del marcador queda por debajo del fold en modo `peek`. Ver la nota de
// arriba sobre por qué es una altura de section y no un padding.
const PEEK = "7.5rem";

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

export default function H2Count({
  surface,
  proof = "marker",
}: { surface?: React.ReactNode; proof?: "marker" | "peek" } = {}) {
  // En `peek` el contador NO corre al montar: las cifras están medio tapadas por
  // el borde de la pantalla, así que contarían para nadie. Espera al scroll, que
  // es el mismo momento en que se revelan.
  const countRef = useCountUp<HTMLDListElement>(
    proof === "peek" ? { start: "top 78%" } : { immediate: true }
  );

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      tl.from(q("[data-hero-item]"), { autoAlpha: 0, y: 22, duration: 0.9, stagger: 0.1 }, 0);
      return () => tl.kill();
    });

    // ── El revelado del asomo ───────────────────────────────────────────────
    //
    // Atado al scroll con `scrub` y no disparado una vez: lo que el lector hace
    // es descubrir el marcador tirando de la página, y con un `once` la
    // secuencia correría sola aunque él se hubiera quedado quieto — que es
    // justamente lo contrario de lo que el gesto propone.
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
    if (proof === "peek") {
      mm.add(MQ.motion, () => {
        const cells = q("[data-proof-cell]");
        const texts = q("[data-proof-text]");
        if (cells.length === 0) return;

        const tl = gsap.timeline({
          defaults: { ease: EASE_OUT },
          scrollTrigger: {
            trigger: cells[0],
            start: "top bottom",
            end: "top 45%",
            scrub: 0.6,
            markers: DEBUG_MARKERS,
          },
        });

        tl.fromTo(
          cells,
          { autoAlpha: PEEK_ALPHA },
          { autoAlpha: 1, duration: 1, stagger: 0.35 },
          0
        );
        tl.from(texts, { autoAlpha: 0, y: 10, duration: 0.9, stagger: 0.12 }, 0.35);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          // `clearProps` sobre las celdas: sin esto quedan con la opacidad
          // inline del último frame, y en dev eso pasa en cada montaje por
          // StrictMode — no sólo al navegar.
          gsap.set([...cells, ...texts], { clearProps: "all" });
        };
      });
    }

    return () => mm.revert();
  }, [proof]);

  const peeking = proof === "peek";

  return (
    <section
      ref={rootRef}
      style={peeking ? { minHeight: `calc(100svh + ${PEEK})` } : undefined}
      className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden bg-cream pt-[var(--site-header-block)] text-foreground"
    >
      {surface}

      <Container className="relative z-10 flex flex-1 flex-col justify-center gap-8 py-16">
        <p data-hero-item className="uppercase text-eyebrow-mono text-gray-intermediate">
          {HERO.eyebrow}
        </p>
        <h1 data-hero-item className="max-w-[16ch] text-display text-balance">
          {HERO.lead} <Accent display>{HERO.accent}</Accent>
        </h1>
        <div data-hero-item className="flex flex-col gap-7">
          <p className="max-w-[44ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>

      {/* El marcador.
          
          En `marker`: separadores verticales y una sola regla superior. Lo que
          agrupa a las seis es la línea de arriba y lo que las separa entre sí es
          el filete; seis cajas con borde completo serían seis cards.
          
          En `peek`: ni regla ni filetes. Lo único que se ve asomando son las
          cifras, y una regla cruzando el borde inferior de la pantalla se leería
          como el final del hero — o sea, exactamente lo contrario de lo que el
          asomo tiene que decir. Lo que agrupa a las seis ahí es que estén
          cortadas por la misma línea. */}
      <div className={`relative z-10 ${peeking ? "" : "border-t border-ink"}`}>
        <Container>
          <dl
            ref={countRef}
            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 ${
              peeking ? "gap-x-6 gap-y-10" : ""
            }`}
          >
            {PROOF.map((stat) => (
              <div
                key={stat.id}
                data-proof-cell
                className={
                  peeking
                    ? "flex flex-col gap-1 pt-7"
                    : "flex flex-col gap-1 border-l border-rule py-7 pl-5 first:border-l-0 first:pl-0"
                }
              >
                {/* El valor de partida es el FINAL, escrito en el HTML: sin JS o
                    con reduced-motion la cifra ya está bien. El contador lo pisa
                    en el primer frame si va a correr. */}
                <dd data-count={stat.value} className="text-h2 tabular-nums">
                  {stat.value}
                </dd>
                {/* El rótulo va marcado sólo en `peek`, que es el único modo que
                    lo revela aparte. En `marker` el atributo sobraría y sería una
                    pista falsa para el próximo que lea el archivo buscando qué
                    anima qué. */}
                <dt
                  data-proof-text={peeking || undefined}
                  className="uppercase text-micro-mono text-gray-intermediate"
                >
                  {stat.label}
                </dt>
                {stat.note && (
                  <dd
                    data-proof-text={peeking || undefined}
                    className="text-micro-mono text-gray-intermediate"
                  >
                    {stat.note}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
