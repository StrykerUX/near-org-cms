"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

// El elemento animado de una card del spine: un Lottie provisto por diseño, en
// lugar del diagrama generado de `spineDiagrams`.
//
// Nació como `SpeedLottie`, atado a una sola card y con su JSON importado
// adentro. Ahora las SEIS paradas tienen su animación, así que la que cambia es
// la única cosa que cambiaba: el `data`. Todo lo demás —el renderer, el loop y
// sobre todo cómo se gobierna— es igual para las seis y vive acá una vez.
//
// ── Cómo se gobierna ──────────────────────────────────────────────────────
//
// SOLO con el `data-open` de su card, vía MutationObserver: la card abre → play
// desde el frame 0 en loop; cierra → parado en el frame 0. Así el contrato de
// timelines del accordion no se toca: para una card con Lottie el build es un
// timeline vacío (ver `ProtocolSpine`) y el estado vive acá, autocontenido.
//
// En el fallback apilado —móvil y `prefers-reduced-motion`— las cards nacen con
// `data-open="true"`, así que el sync inicial las deja corriendo. ⚠️ Eso incluye
// reduced-motion, y es una decisión heredada: la animación ES el contenido de la
// card, no un adorno de entrada, y sin ella la card queda con un hueco.
/**
 * El fondo del lienzo, apagado.
 *
 * Los seis JSON traen una capa sólida `#353535` del tamaño del comp —el lienzo
 * sobre el que se compuso la animación—, y dentro de la card se ve como un
 * rectángulo gris más claro que el panel: un parche con borde recto en medio de
 * una caja redondeada.
 *
 * Se apaga ACÁ y no recortando los JSON a propósito. Los archivos son entregas
 * de diseño: el día que llegue un `_v007`, alguien lo copia encima y el recorte
 * se pierde en silencio. Filtrando en el runtime, cualquier versión futura entra
 * ya sin fondo.
 *
 * `hd: true` —la bandera de «capa oculta» que lottie-web respeta— y no borrar la
 * capa del array: los `parent` de las demás referencian su `ind`, y quitar un
 * elemento renumera lo que otro pudiera estar mirando. Acá ninguna capa cuelga
 * del sólido, pero la bandera es correcta pase lo que pase.
 *
 * El filtro exige que el sólido CUBRA el lienzo entero. Un sólido más chico es
 * un elemento de la animación —una placa, un panel— y ése no se toca.
 */
function withoutBackdrop(data: unknown) {
  const doc = data as {
    w?: number;
    h?: number;
    layers?: { ty?: number; sw?: number; sh?: number; hd?: boolean }[];
  };
  if (!Array.isArray(doc.layers)) return data;

  return {
    ...doc,
    layers: doc.layers.map((layer) =>
      layer.ty === 1 &&
      (layer.sw ?? 0) >= (doc.w ?? 0) &&
      (layer.sh ?? 0) >= (doc.h ?? 0)
        ? { ...layer, hd: true }
        : layer
    ),
  };
}

export default function SpineLottie({ data }: { data: unknown }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let anim: AnimationItem;
    try {
      anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData: withoutBackdrop(data) as object,
      });
    } catch {
      // Un JSON que lottie-web no puede parsear deja la card con su hueco, que
      // es feo; una excepción sin capturar deja la SECCIÓN ENTERA sin montar,
      // que es peor. Seis animaciones sobre el mismo componente son seis
      // oportunidades de que una llegue mal.
      return;
    }

    const card = el.closest("[data-card]") as HTMLElement | null;
    const sync = () => {
      if (card?.dataset.open === "true") {
        anim.goToAndPlay(0, true);
      } else {
        anim.goToAndStop(0, true);
      }
    };
    sync();

    let mo: MutationObserver | undefined;
    if (card) {
      mo = new MutationObserver(sync);
      mo.observe(card, { attributes: true, attributeFilter: ["data-open"] });
    }

    return () => {
      mo?.disconnect();
      anim.destroy();
    };
    // `data` es un módulo JSON importado: la referencia es estable entre
    // renders, así que no hace falta en las deps y ponerlo solo invitaría a que
    // alguien pase un objeto literal y remonte la animación en cada render.
  }, [data]);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
