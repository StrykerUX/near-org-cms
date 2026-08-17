"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "./speedLottie.json";

// El elemento animado de la card "Speed. Scale. Access." del spine: un Lottie
// provisto por Lawrence (data.lottie → JSON plano en speedLottie.json), en
// lugar del diagrama generado de spineDiagrams.
//
// Se gobierna SOLO con el data-open de su card (MutationObserver): la card
// abre → play desde el frame 0 en loop; cierra → parado en el frame 0. Así el
// contrato de timelines del accordion no se toca — para "speed" el build es
// un timeline vacío (ver ProtocolSpine) y el estado vive acá, autocontenido.
// En el fallback apilado (mobile/reduced-motion) las cards nacen con
// data-open="true", así que el sync inicial lo deja corriendo.
export default function SpeedLottie() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: false,
      animationData,
    });
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
  }, []);

  return <div ref={ref} aria-hidden="true" className="h-full w-full" />;
}
