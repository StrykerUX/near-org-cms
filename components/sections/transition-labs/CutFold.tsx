"use client";

import { useCallback, useRef } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";
import SectionCut, { clamp01 } from "@/components/sections/transition-labs/SectionCut";

// ── G · Fold ─────────────────────────────────────────────────────────────────
//
// El bloque de arriba se PLIEGA hacia atrás sobre su borde inferior y detrás
// aparece el negro, que estaba ahí todo el tiempo. El corte deja de ser plano:
// la página tiene grosor y las secciones están apiladas como hojas.
//
// ── La hoja es un panel propio, no la sección de verdad ─────────────────────
//
// Una sección no puede rotar a su vecina, así que la hoja es un panel del color
// de la de arriba que entra por opacidad en el primer 12% y a partir de ahí es
// la que se pliega. Como el fondo real detrás es del mismo cream, el cambio no
// se ve: lo que el lector percibe es que se pliega LA PÁGINA.
//
// ── La sombra es lo que hace que se lea como pliegue ────────────────────────
//
// Sin ella, un rectángulo rotando en perspectiva se lee como un rectángulo
// achicándose. La cara se oscurece a medida que se aleja de la vertical —igual
// que una hoja real girando fuera de la luz— y ese degradado es la mitad del
// efecto.
//
// El `perspective` va en el contenedor y no en la hoja: puesto en el elemento
// que rota, la fuga se calcula desde SU centro y el pliegue se siente plano.
// En el padre, el punto de fuga es el de la pantalla, que es lo que el ojo
// espera.
//
// 900px y no 1400: con la fuga lejana el escorzo es tan suave que la hoja
// parece bajar de brillo en vez de girar. Corta, el borde superior se estrecha
// de forma evidente y ahí es donde se ve el pliegue.

export default function CutFold() {
  const leafRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  const draw = useCallback((p: number) => {
    const leaf = leafRef.current;
    const shade = shadeRef.current;
    if (!leaf || !shade) return;

    // La hoja aparece antes de empezar a girar: si entrara girando ya, el
    // primer frame sería un rectángulo torcido saliendo de la nada.
    const inn = clamp01(p / 0.12);
    const turn = clamp01((p - 0.12) / 0.76);

    gsap.set(leaf, { autoAlpha: inn, rotateX: -88 * turn });
    // La cara se apaga con el coseno del giro, no linealmente: es la ley con la
    // que una superficie recibe menos luz al inclinarse, y por eso se ve como
    // una hoja y no como un fundido a negro.
    // Topada en 0.62: con la ley pura, a mitad de giro la hoja ya es un
    // rectángulo gris que ocupa toda la pantalla y no se distingue de un
    // fundido. Lo que tiene que leerse es la PERSPECTIVA, no la sombra.
    gsap.set(shade, { opacity: (1 - Math.cos((turn * 88 * Math.PI) / 180)) * 0.62 });
  }, []);

  return (
    <SectionCut travel="170svh" settle={0.85} draw={draw}>
      {/* El negro está DEBAJO desde el principio: no llega, se descubre. */}
      <div aria-hidden="true" className="absolute inset-0 bg-ink" />

      <div
        aria-hidden="true"
        style={{ perspective: "900px" }}
        className="absolute inset-0"
      >
        <div
          ref={leafRef}
          className="absolute inset-0 origin-bottom bg-cream"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div ref={shadeRef} className="absolute inset-0 bg-ink opacity-0" />
        </div>
      </div>
    </SectionCut>
  );
}
