"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";

/** El `gsap.Context` que useGSAP crea. Derivado del hook y no importado del
 *  namespace de gsap: así este módulo no necesita importar gsap como valor. */
export type GsapContext = ReturnType<typeof useGSAP>["context"];

type Setup<T extends Element> = (self: GsapContext, scope: T) => void | (() => void);

/**
 * Capa de bajo nivel: agrupa todo lo que `setup` cree (tweens, timelines,
 * ScrollTrigger, SplitText, gsap.matchMedia) en un `gsap.context()` scopeado
 * al elemento devuelto, y lo revierte completo al desmontar.
 *
 * Es una capa fina sobre `useGSAP` de @gsap/react — el hook oficial hace
 * exactamente esto. Mantenemos el wrapper y no llamamos a `useGSAP` directo por
 * dos razones: la firma de acá devuelve el ref (así una sección es
 * `const ref = useGsapContext(...)` y no dos statements), y `setup` recibe el
 * `scope` ya desreferenciado y tipado, así que nadie escribe `ref.current!`.
 *
 * Por qué `ctx.revert()` y no `tween.kill()`: next.config.ts tiene
 * `reactStrictMode: true`, así que en dev cada efecto monta → limpia →
 * monta. `kill()` para un tween suelto (como el marquee de CompanyGrid)
 * alcanza porque el propio tween se re-setea solo. Acá no alcanza en varios
 * casos: un reveal matado a mitad deja `opacity` inline pegada para
 * siempre (revert() restaura el DOM al estado previo a GSAP, kill() no
 * toca estilos); un ScrollTrigger con pin:true deja un pin-spacer fantasma
 * en el documento si no se revierte (la página crece el doble en dev);
 * SplitText no es un tween, es cirugía de DOM — sin revert() un segundo
 * mount lo vuelve a splittear sobre spans ya splitteados.
 *
 * Dos cosas que se ganan al delegar en `useGSAP` y conviene conocer:
 *
 * 1. Corre en `useLayoutEffect`, no en `useEffect`: la animación queda armada
 *    antes del primer paint, así que un `.from()` no alcanza a mostrar el estado
 *    final por un frame. El orden respecto a `PrototypeMotionProvider` no cambia
 *    — los layout effects de los hijos siguen corriendo antes que el `useEffect`
 *    del padre, que es lo que su `settle()` necesita.
 *
 * 2. Cualquier handler de evento que cree tweens FUERA del setup (un
 *    `pointermove`, un `onClick`) tiene que envolverse para que sus tweens
 *    entren al contexto y se reviertan con él. El `self` que recibe `setup` es
 *    el contexto, así que eso es `self.add(null, fn)` — el mismo mecanismo que
 *    `contextSafe` de `useGSAP`:
 *
 *      const onMove = self.add(null, (e: PointerEvent) => { gsap.to(...) });
 *      el.addEventListener("pointermove", onMove, { passive: true });
 */
export function useGsapContext<T extends Element = HTMLDivElement>(
  setup: Setup<T>,
  deps: unknown[] = []
): RefObject<T | null> {
  const scopeRef = useRef<T>(null);

  // `setup` se pasa directo, sin la ref-de-callback que había acá antes: useGSAP
  // guarda el callback del render en curso y lo ejecuta en el layout effect que
  // `deps` dispara, así que ya recibe la closure fresca. La ref existía para
  // evitar que la identidad de la closure inline re-corriera el efecto — pero de
  // eso se encarga el array de dependencias, no el callback.
  useGSAP(
    (self) => {
      const scope = scopeRef.current;
      if (!scope) return;
      return setup(self, scope);
    },
    { dependencies: deps, scope: scopeRef }
  );

  return scopeRef;
}
