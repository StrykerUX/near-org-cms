"use client";

import { useState } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── 02 · Ticker ──────────────────────────────────────────────────────────────
//
// Las seis cifras en una cinta horizontal sin principio ni fin. Cero recorrido
// propio: la sección mide 100svh y no tiene track.
//
// ── Lo que la mueve es el scroll, no el reloj ───────────────────────────────
//
// Un marquee de velocidad fija es decoración: pasa igual estés donde estés, y a
// los diez segundos deja de mirarse. Acá la cinta tiene una velocidad de
// reposo muy baja —lo justo para que se lea como viva— y el scroll le INYECTA
// velocidad: cuanto más rápido empuja el lector, más rápido pasan las cifras, y
// al soltar la cinta desacelera sola.
//
// La energía sube rápido y baja despacio (attack ≫ release, el mismo par que
// usa `hero-alt/FlowCanvas`) porque es lo que la vuelve inercia en vez de
// interruptor. Con release alto la cinta se para en seco al soltar la rueda y
// se siente rota.
//
// El desplazamiento integra el VALOR ABSOLUTO del scroll: la cinta avanza
// scrollees para donde scrollees. Con signo, subir desandaría el recorrido y la
// sección se sentiría como un scrubber de video, que es justo lo que la versión
// 05 hace a propósito y esta no.
//
// ── El hover para todo ──────────────────────────────────────────────────────
//
// Con la cinta en movimiento un cuerpo de texto no se puede leer. Por eso
// apuntar una cifra frena la cinta a cero y abre SU cuerpo debajo: la sección
// tiene dos modos, uno de vistazo y uno de lectura, y el puntero es el que
// cambia de uno al otro.

// Velocidad de reposo, en px por segundo.
const IDLE_SPEED = 22;
// Cuánta velocidad extra aporta el scroll, como múltiplo de px/frame scrolleados.
const SCROLL_GAIN = 34;
// Techo: sin él, un scroll con trackpad de inercia manda la cinta a un borrón.
const MAX_SPEED = 900;

const ENERGY_ATTACK = 0.2;
const ENERGY_RELEASE = 0.03;
// px por frame de scroll que se consideran energía máxima.
const ENERGY_FULL = 60;

export default function TickerTape() {
  // El índice bajo el puntero. Es estado de React —y no un `data-*` escrito
  // desde GSAP— porque lo que cambia es CONTENIDO (el párrafo de abajo), no
  // una propiedad animable.
  const [active, setActive] = useState<number | null>(null);

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, self }) => {
    const lane = q("[data-lane]")[0];
    const copies = q("[data-copy]");
    if (!lane || copies.length === 0) return;

    if (!motionOk) {
      // Con reduced-motion la cinta se queda quieta en su posición inicial. Se
      // ve el primer tramo de cifras y el hover sigue abriendo los cuerpos: la
      // sección conserva TODO su contenido, solo pierde el movimiento.
      gsap.set(lane, { x: 0 });
      return;
    }

    let offset = 0;
    let energy = 0;
    let lastY = window.scrollY;
    // Ancho de UNA copia. Se mide en cada frame de arranque y tras un resize;
    // hasta que la fuente real llega puede valer otra cosa, y por eso se relee
    // en vez de hornearse en una constante.
    let unit = copies[0].offsetWidth;

    // El freno del hover: no es un booleano que corta la velocidad de golpe —
    // eso se ve como un choque. Es un factor 0..1 que GSAP interpola.
    const brake = { k: 1 };

    const tick = (_time: number, delta: number) => {
      const y = window.scrollY;
      const moved = Math.abs(y - lastY);
      lastY = y;

      const target = Math.min(1, moved / ENERGY_FULL);
      const k = target > energy ? ENERGY_ATTACK : ENERGY_RELEASE;
      energy += (target - energy) * k;

      const speed = Math.min(MAX_SPEED, IDLE_SPEED + energy * SCROLL_GAIN * ENERGY_FULL);
      offset += (speed * brake.k * delta) / 1000;

      // El módulo va sobre el offset acumulado, no sobre la `x`: con tres
      // copias en fila, restar un ancho de copia deja la cinta en un estado
      // visualmente idéntico, así que el salto no se ve.
      if (unit > 0) offset %= unit;
      gsap.set(lane, { x: -offset });
    };

    gsap.ticker.add(tick);

    // El freno se expone al JSX vía el contexto: `self.add` hace context-safe el
    // tween que crean los handlers de React, que se registran FUERA del setup.
    self.add("brakeTo", (value: number) => {
      gsap.to(brake, { k: value, duration: value === 0 ? 0.45 : 0.8, ease: "power2.out" });
    });

    const ro = new ResizeObserver(() => {
      unit = copies[0].offsetWidth;
    });
    ro.observe(copies[0]);

    // La cinta se re-mide cuando llega la fuente real: medida contra la fuente
    // de sistema, `unit` es el ancho de OTRA tipografía y el salto del bucle
    // quedaría visible como un tirón cada vuelta.
    document.fonts.ready.then(() => {
      unit = copies[0].offsetWidth;
    });

    // El freno se lee del atributo que escribe React. Un efecto no puede
    // suscribirse al estado sin volver a correr —y volver a correr acá
    // significaría reconstruir el bucle—, así que el puente es un MutationObserver
    // sobre el propio scope, que es barato y no reconstruye nada.
    const mo = new MutationObserver(() => {
      self.brakeTo(scope.dataset.hold === "on" ? 0 : 1);
    });
    mo.observe(scope, { attributes: true, attributeFilter: ["data-hold"] });

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      mo.disconnect();
      gsap.killTweensOf(brake);
    };
  });

  const stat = active === null ? null : PROOF_STATS[active];

  return (
    <section
      ref={rootRef}
      // `data-hold` es el puente al efecto: React lo escribe, el
      // MutationObserver del efecto lo lee y frena la cinta. No es un atributo
      // de escena de los de `enableScene` — ese contrato es para el interruptor
      // que enciende un layout sticky, y acá no hay ninguno.
      data-hold={active === null ? "off" : "on"}
      className="flex min-h-svh flex-col justify-center gap-14 overflow-hidden bg-ink py-20 text-cream"
    >
      <Container className="flex items-baseline justify-between gap-8">
        <Eyebrow className="text-cream/40">Built on</Eyebrow>
        <p className="text-caption-mono text-cream/40">
          scroll para acelerar · apuntá una cifra para leerla
        </p>
      </Container>

      {/* La cinta desborda el Container a propósito: cortada contra el borde del
          viewport se lee como algo que sigue más allá de la pantalla, que es lo
          que un ticker es. Dentro del Container tendría dos extremos visibles y
          se leería como una lista centrada. */}
      <div className="overflow-hidden">
        <div data-lane className="flex w-max">
          {/* Tres copias y no dos: con dos, en un monitor ancho el bucle es más
              corto que el viewport y el corte queda a la vista. */}
          {[0, 1, 2].map((copy) => (
            <div key={copy} data-copy className="flex shrink-0" aria-hidden={copy > 0}>
              {PROOF_STATS.map((s, i) => (
                <button
                  key={`${copy}:${s.id}`}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive((v) => (v === i ? null : v))}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive((v) => (v === i ? null : v))}
                  // `tabIndex -1` en las copias de relleno: sin eso, tabular por
                  // la sección recorre dieciocho botones que dicen seis cosas.
                  tabIndex={copy === 0 ? 0 : -1}
                  className="group flex shrink-0 items-baseline gap-6 px-8 text-left"
                >
                  <span className="text-h1-serif italic opacity-60 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {s.value}
                    <span className="text-near-green-accent">{s.accent}</span>
                  </span>
                  <span aria-hidden="true" className="text-h3 text-cream/25">
                    /
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* La caja del cuerpo reserva su alto SIEMPRE, con o sin dato: si
          apareciera y desapareciera, la cinta se movería verticalmente cada vez
          que el puntero entra o sale, y perseguir una cifra que se escapa es
          exactamente lo que no se quiere. */}
      <Container>
        <div className="min-h-[6.5rem] max-w-[62ch]">
          {stat && (
            <div className="flex flex-col gap-2">
              <p className="text-caption-mono text-near-green-accent">{stat.eyebrow}</p>
              <p className="text-body-lg text-cream/70 text-pretty">{stat.body}</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
