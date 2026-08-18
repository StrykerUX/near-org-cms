"use client";

import Container from "@/components/primitives/Container";
import { SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import FlowCanvas from "@/components/sections/hero-alt/FlowCanvas";
import { STATEMENT } from "@/components/sections/hero-alt/heroAltContent";

// ── 02 · Flow · segunda sección ──────────────────────────────────────────────
//
// Las barras no son barras dibujadas: son el MISMO campo del hero muestreado a
// siete columnas. En el shader eso es un `if` de cuatro líneas —se lee el
// centro de cada columna en vez de cada píxel— y en pantalla es la diferencia
// entre "otra sección con un fondo parecido" y "la misma cosa, vista de lejos".
//
// Siete y no otro número: es el mismo divisor que `heroGeometry.HERO_UNIT` usa
// en la homepage (`100vw / 7`). Nada acá lo importa —serían dos secciones
// acopladas por una constante, que es el problema que ese módulo documenta—
// pero el ancho de columna coincide, y el ojo lo nota cuando las dos páginas se
// miran seguidas.
//
// El statement entra por líneas enmascaradas sobre las columnas quietas, no
// sobre el campo vivo: acá la energía baja sola porque el track ya no scrollea
// tan rápido, y esa caída es parte del gesto — la página se calma para que se
// pueda leer.

const COLUMNS = 7;

const PALETTE = ["#101010", "#00b96f", "#8bf29c", "#ecfdb0"] as const;

// Más alto que el del hero: con las columnas, el mismo `floor` deja siete
// bloques casi llenos y el texto no tiene dónde apoyarse.
const FLOOR = 0.46;

const FALLBACK =
  "linear-gradient(90deg, #101010 0%, #0a3d2a 14%, #101010 28%, #00b96f 42%, #101010 57%, #0a3d2a 71%, #101010 100%)";

export default function FlowBars() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const copy = q("[data-fl2-copy]")[0];
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "fl");
    const tl = trackTimeline(scope, { scrub: 0.35 });

    // `onSplit` solo repara las máscaras y no devuelve un tween: uno acá
    // correría al montar y pelearía con el scrub por el mismo `yPercent`.
    const split = SplitText.create(copy, {
      type: "lines",
      mask: "lines",
      onSplit: (self) => {
        allowDescenders(self.lines);
      },
    });

    tl.from(
      split.lines,
      { yPercent: 115, ease: "power2.out", duration: 0.45, stagger: 0.09 },
      0.1
    );

    // El bloque entero se va antes de que el track termine, para que la sección
    // no se quede pegada con el texto ya leído — el error más común de una
    // escena sticky larga.
    tl.to(copy, { autoAlpha: 0, y: -50, ease: "none", duration: 0.2 }, 0.8);

    return () => {
      split.revert();
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      className="relative overflow-x-clip bg-ink text-cream data-[fl=on]:h-[240svh]"
    >
      {/* El `overflow-hidden` va sobre el elemento PEGADO y nunca sobre un
          ancestro suyo: ahí convertiría a la sección en contenedor de scroll y
          el sticky dejaría de pegarse, en silencio y sin error. */}
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <FlowCanvas
          cols={COLUMNS}
          floor={FLOOR}
          palette={PALETTE}
          fallback={FALLBACK}
        />

        {/* Franja oscura solo detrás del texto: las columnas del campo son
            verticales, así que un velo radial —como el del hero— dejaría
            columnas enteras a media luz y otras enteras brillando. Una banda
            horizontal corta las siete por igual. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] h-[46svh] -translate-y-1/2"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(16,16,16,0) 0%, rgba(16,16,16,0.82) 22%, rgba(16,16,16,0.82) 78%, rgba(16,16,16,0) 100%)",
          }}
        />

        <Container className="relative z-[2]">
          <p
            data-fl2-copy
            className="mx-auto max-w-[22ch] text-center text-statement text-pretty"
          >
            {STATEMENT}
          </p>
        </Container>
      </div>
    </section>
  );
}
