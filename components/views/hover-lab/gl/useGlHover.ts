"use client";

import { type RefObject } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { getSharedGL, type GLState } from "./sharedGL";
import { type ShaderId } from "./shaders";

/**
 * El puente entre un elemento del DOM y el contexto WebGL compartido.
 *
 * Las diez variantes con shader hacen todas lo mismo alrededor del efecto:
 * al entrar el puntero traen el canvas, animan `uHover` con GSAP, siguen la
 * posición del cursor, y al salir lo devuelven cuando la animación terminó
 * (no antes: soltarlo en el `pointerleave` cortaría el fundido en seco).
 * Eso es este hook; lo único propio de cada variante es el shader y qué
 * escribe en `aux`.
 *
 * ── Lo que hay que saber al leer las variantes ────────────────────────────
 *
 * `gl.state` es un objeto COMPARTIDO, y eso es deliberado: GSAP lo anima
 * directo y el render lo lee una vez por frame. Cuando el puntero salta de una
 * variante a otra, el tween de salida de la primera y el de entrada de la
 * segunda apuntan al mismo objeto — por eso todos van con `overwrite: true`,
 * así el último gesto gana y el efecto nuevo arranca desde el valor que dejó
 * el anterior en vez de saltar a cero. El `detach` de la que quedó atrás es un
 * no-op: el runtime comprueba que siga siendo el host activo.
 */
export type GlHoverConfig = {
  shader: ShaderId;
  /** `screen` para las luces (el negro no suma nada sobre lo de abajo). */
  blend?: "normal" | "screen" | "difference";
  /** Radio del canvas en CSS px. También llega al shader como `uAux.x`. */
  radius?: number;
  /** z-index del canvas dentro del host. */
  z?: number;
  /** Tween de entrada sobre `gl.state`. Por defecto, hover y prog a 1. */
  inVars?: gsap.TweenVars;
  /** Tween de salida. Por defecto, los dos a 0. */
  outVars?: gsap.TweenVars;
  /** Corre antes del attach: el momento de subir una textura o calcular `aux`. */
  onEnter?: (state: GLState, host: HTMLElement) => void;
  /** Corre en cada pointermove, después de actualizar `mx`/`my`. */
  onMove?: (state: GLState, host: HTMLElement, e: PointerEvent) => void;
  /** Corre cuando el fundido de salida terminó y el canvas ya se soltó. */
  onLeave?: (state: GLState, host: HTMLElement) => void;
};

export function useGlHover<T extends HTMLElement>(cfg: GlHoverConfig): RefObject<T | null> {
  return useGsapContext<T>((_self, host) => {
    const gl = getSharedGL();
    // Sin WebGL no hay nada que montar: la variante se queda en su reposo CSS,
    // que por eso tiene que valerse solo. No es un fallback de compromiso —
    // es el estado que el 100% de los usuarios ve el 99% del tiempo.
    if (!gl) return;

    const mm = gsap.matchMedia();

    mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (mmCtx) => {
      const { reduce } = mmCtx.conditions as { motion: boolean; reduce: boolean };
      // Con reduced-motion el efecto igual aparece — lo que desaparece es el
      // recorrido. El shader además congela `uTime` por su cuenta.
      const inDur = reduce ? 0 : 0.5;
      const outDur = reduce ? 0 : 0.32;

      // El rect se cachea al entrar: dentro de un hover el botón no cambia de
      // sitio, y medirlo en cada pointermove sería un reflow forzado por
      // evento a cambio de nada.
      let rect: DOMRect | null = null;

      const enter = (e: PointerEvent) => {
        rect = host.getBoundingClientRect();
        gl.state.mx = e.clientX - rect.left;
        gl.state.my = e.clientY - rect.top;
        cfg.onEnter?.(gl.state, host);
        gl.attach(host, cfg.shader, { blend: cfg.blend, radius: cfg.radius, z: cfg.z });
        gsap.to(gl.state, {
          hover: 1,
          prog: 1,
          duration: inDur,
          ease: "power2.out",
          overwrite: true,
          ...cfg.inVars,
        });
      };

      const move = (e: PointerEvent) => {
        if (!rect) rect = host.getBoundingClientRect();
        gl.state.mx = e.clientX - rect.left;
        gl.state.my = e.clientY - rect.top;
        cfg.onMove?.(gl.state, host, e);
      };

      const leave = () => {
        rect = null;
        gsap.to(gl.state, {
          hover: 0,
          prog: 0,
          duration: outDur,
          ease: "power2.in",
          overwrite: true,
          ...cfg.outVars,
          onComplete: () => {
            gl.detach(host);
            cfg.onLeave?.(gl.state, host);
          },
        });
      };

      host.addEventListener("pointerenter", enter);
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);

      return () => {
        host.removeEventListener("pointerenter", enter);
        host.removeEventListener("pointermove", move);
        host.removeEventListener("pointerleave", leave);
        // Desmontar con el puntero encima (navegar, o cambiar el filtro de la
        // demo) tiene que devolver el canvas igual, o queda pegado a un nodo
        // que ya no está en el documento.
        gl.detach(host);
      };
    });

    return () => mm.revert();
  }, []);
}
