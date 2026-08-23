"use client";

import { getLenis } from "@/components/site/providers/lenisInstance";

// El reloj compartido entre el hero y el statement, y quién lo arranca.
//
// ── El problema que resuelve ─────────────────────────────────────────────────
//
// La salida del hero y la entrada del statement son UN gesto contado por dos
// componentes: el borde del hero se cierra, y por el hueco aparece el icono que
// después viaja hasta el texto. Antes eso lo sincronizaba el scroll —los dos
// leían la misma posición y llegaban al mismo lado solos—, pero la secuencia ya
// no la maneja el lector: la dispara con un gesto y corre con reloj propio. Sin
// el scroll de árbitro, dos timelines independientes empiezan cuando cada
// componente monta, que no es el mismo instante.
//
// Así que el arranque es un evento y los tiempos son constantes de este módulo.
// Nadie mide contra el otro: los dos miden contra esto.
//
// Un módulo con un evento de `window` y no un contexto de React, por el mismo
// motivo que `lenisInstance`: los consumidores son efectos de GSAP, no render.

/** Los tiempos de la secuencia, en segundos. */
export const BEATS = {
  /** El borde inferior del hero comiéndose el hero. */
  clip: 0.9,
  /** Cuándo arranca el viaje del icono, contado desde el inicio de todo. */
  iconAt: 0.45,
  /** Cuánto dura el viaje del icono. */
  icon: 1.1,
  /** Cuándo empieza a entrar el texto del statement. */
  copyAt: 1.15,
  /** Cuánto dura la entrada de cada línea. */
  copy: 0.7,
  /** Separación entre líneas. */
  copyStagger: 0.07,
} as const;

/**
 * Cuánto dura la secuencia completa. Es lo que se congela el scroll, así que se
 * calcula y no se escribe a mano: un número suelto acá deja el scroll trabado
 * de más (la página se siente rota) o de menos (la animación termina fuera de
 * cuadro), y las dos fallas aparecen recién al mover un beat.
 *
 * Las seis líneas del statement son el último en terminar, y su stagger corre
 * DESPUÉS del inicio de la última: por eso el `* 5` y no `* 6`.
 */
export const SEQUENCE_DURATION =
  BEATS.copyAt + BEATS.copyStagger * 5 + BEATS.copy;

const EVENT_PLAY = "homepage-e:sequence-play";
const EVENT_REWIND = "homepage-e:sequence-rewind";

/** Arranca la secuencia en todos los que la escuchen. */
export function playSequence() {
  window.dispatchEvent(new Event(EVENT_PLAY));
}

/** La devuelve al principio. Se usa al volver arriba de todo. */
export function rewindSequence() {
  window.dispatchEvent(new Event(EVENT_REWIND));
}

/**
 * Se suscribe a los dos. Devuelve la baja, para el cleanup del `gsap.context`.
 */
export function onSequence(handlers: { play: () => void; rewind: () => void }) {
  window.addEventListener(EVENT_PLAY, handlers.play);
  window.addEventListener(EVENT_REWIND, handlers.rewind);
  return () => {
    window.removeEventListener(EVENT_PLAY, handlers.play);
    window.removeEventListener(EVENT_REWIND, handlers.rewind);
  };
}

/**
 * Congela el scroll mientras la secuencia corre, y lo devuelve al terminar.
 *
 * Es un scroll-jack, y conviene decirlo con todas las letras: durante ~2s el
 * gesto del lector no mueve la página. Se hace igual porque es lo que el efecto
 * PIDE — el pedido es que el primer scroll reproduzca la animación completa y la
 * deje terminada, y sin congelar, el lector que sigue bajando ve el statement
 * animarse mientras se va de pantalla.
 *
 * Pasa por `lenis.stop()` y no por `overflow: hidden` en el body: Lenis es el
 * dueño de la posición de scroll y escribe `scrollTop` en cada frame; taparle el
 * overflow por debajo lo deja escribiendo contra un contenedor que ya no
 * scrollea y el resultado es un salto al soltar. `stop()` es su propia puerta.
 *
 * Sin Lenis —reduced-motion, o una ruta sin smooth scroll— no hay nada que
 * congelar y la función no hace nada. Es correcto: en ese caso tampoco hay
 * secuencia que proteger.
 */
export function freezeScroll(seconds: number) {
  const lenis = getLenis();
  if (!lenis) return () => {};

  lenis.stop();
  const id = window.setTimeout(() => lenis.start(), seconds * 1000);

  // El cleanup devuelve el scroll SIEMPRE, aunque el componente se desmonte a
  // mitad de la secuencia. Sin esto, navegar durante esos dos segundos deja la
  // página siguiente con el scroll trabado y ningún indicio de por qué.
  return () => {
    window.clearTimeout(id);
    lenis.start();
  };
}
