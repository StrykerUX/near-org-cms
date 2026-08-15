"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Button from "@/components/primitives/Button";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { NAV_LINKS as LINKS } from "@/components/sections/home-v2/homeV2Content";

// Aire extra bajo la pill al retraerse, para que no quede un borde asomando.
const HIDE_MARGIN = 12;

export default function NavPillV2() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      // quickSetter y no gsap.to(): esto corre en cada update de scroll, y
      // crear un tween por update sería instanciar cientos de objetos por
      // segundo para escribir una sola propiedad.
      const setY = gsap.quickSetter(scope, "y", "px") as (v: number) => void;

      // Hoisteado fuera del handler. Leer `offsetHeight` ahí dentro forzaba un
      // layout en cada evento de scroll —y justo después de escribir un
      // transform, que es el read-after-write que lo vuelve un reflow síncrono
      // forzado— para obtener un valor que solo cambia cuando cambia el
      // viewport. Se mide en el refresh de ScrollTrigger, que dispara en resize.
      let hidden = 0;
      const measureHeight = () => {
        hidden = -(scope.offsetHeight + HIDE_MARGIN);
      };
      measureHeight();
      ScrollTrigger.addEventListener("refresh", measureHeight);

      let last = 0;
      let offset = 0;

      // Tracking 1:1 y no un hide/show con umbral: la pill acompaña el gesto
      // en los dos sentidos, así que un scroll corto hacia arriba la asoma
      // parcialmente en vez de dispararla entera. Es el comportamiento del
      // original y se siente más directo que un toggle.
      //
      // Un ScrollTrigger sobre el documento entero en vez de un listener de
      // scroll crudo: ya viene batcheado en el ticker compartido —así que esta
      // escritura cae en la misma ranura del frame que el resto de las de GSAP
      // en lugar de intercalarse con ellas— y ya sabe la posición de scroll sin
      // preguntarle al layout. Misma decisión que en `site/SiteHeader`.
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          const delta = y - last;
          last = y;

          offset = Math.min(0, Math.max(hidden, offset - delta));
          // Arriba del todo siempre visible: sin esto, un rebote de scroll
          // negativo en iOS puede dejarla escondida en el tope de la página.
          if (y <= 2) offset = 0;

          setY(offset);
        },
      });
      last = st.scroll();

      return () => {
        ScrollTrigger.removeEventListener("refresh", measureHeight);
        setY(0);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    // pointer-events-none en el wrapper y auto en la pill: el wrapper cubre
    // todo el ancho del viewport y sin esto capturaría los clics de lo que
    // haya debajo (el hero ocupa esa misma franja).
    <div
      ref={rootRef}
      // `will-change` acá SÍ va permanente, al contrario que en el resto de la
      // página: la pill se transforma en cada update de scroll, o sea que está
      // animándose prácticamente siempre. Hacerlo condicional la promovería y
      // despromovería sin parar, que es peor que dejar la capa reservada.
      className="pointer-events-none fixed inset-x-0 top-0 z-50 will-change-transform"
    >
      <Container className="pt-6">
        <nav className="pointer-events-auto mx-auto flex w-fit items-center gap-10 rounded-full bg-ink py-2 pl-6 pr-2 text-white">
          {/* El wordmark es un SVG negro: brightness-0 invert lo pasa a blanco
              sin necesidad de una segunda copia del asset. La altura fluida va
              inline — es una imagen, no texto, así que no le corresponde un rol
              de la escala tipográfica. */}
          <Link href="/prototype/homepage-v2" className="flex items-center">
            <Image
              src="/prototype/v2/near-wordmark.svg"
              alt="NEAR"
              width={80}
              height={21}
              className="block w-auto brightness-0 invert"
              style={{ height: "clamp(1rem, 0.92rem + 0.35vw, 1.3rem)" }}
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href="#"
                className="group/link flex items-center gap-1 text-eyebrow uppercase text-white/70 transition-colors hover:text-white"
              >
                {link.label}
                <ChevronDown className="size-3.5 transition-transform duration-300 group-hover/link:rotate-180" />
              </a>
            ))}
          </div>

          <Button href="#" variant="brand">
            Get started
          </Button>
        </nav>
      </Container>
    </div>
  );
}
