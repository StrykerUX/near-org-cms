"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// Copia divergente de components/sections/PrototypeFooter.tsx, según la regla
// de home-v4/README.md.
//
// En desktop el footer EN FLUJO es solo el wordmark, sentado justo debajo de
// Latest Updates. A ~100px del fondo de la página, un tirón lleva el scroll
// hasta el borde y un wipe negro de un viewport de alto sube TAPANDO la
// sección anterior; sobre ese negro aparecen el headline y las columnas de
// links — el footer "toma" la pantalla. Volver hacia arriba lo revierte.
//
// En mobile (y con reduced-motion en desktop no hay takeover pero el panel
// absoluto quedaría inaccesible) el footer completo se renderiza estático en
// cream, como el original: por eso headline+links existen DOS veces abajo —
// una versión en flujo `lg:hidden` y el panel absoluto `hidden lg:block`.
const GROUPS = [
  {
    title: "Products",
    sections: [{ label: "", links: ["near.com", "Intents", "NEAR AI"] }],
  },
  {
    title: "Stack",
    sections: [
      { label: "", links: ["Protocol", "Chain Abstraction", "Quantum Security"] },
    ],
  },
  {
    title: "Resources",
    sections: [
      { label: "Build", links: ["Docs", "Solutions"] },
      { label: "Learn", links: ["Research", "Blog", "Analytics"] },
      { label: "Connect", links: ["Brand", "Contact", "Careers"] },
    ],
  },
  {
    title: "About",
    sections: [
      { label: "Fundamentals", links: ["History", "Roadmap", "Economics"] },
      { label: "Ecosystem", links: ["NEAR Foundation", "Community", "Governance"] },
    ],
  },
];

const LEGAL = ["Privacy", "Terms of Use", "Cookie Policy"];

// Ver el comentario largo en PrototypeFooter.tsx: el crop asienta el wordmark
// sobre su baseline plana en vez del overshoot de las letras redondas.
const WORDMARK_W = 981;
const WORDMARK_H = 255;
const WORDMARK_FLAT_BASELINE = 404.43;
const WORDMARK_VIEWBOX_BOTTOM = 411;
const WORDMARK_CROP_PCT =
  ((WORDMARK_VIEWBOX_BOTTOM - WORDMARK_FLAT_BASELINE) / WORDMARK_W) * 100; // ≈0.67%

// Los grupos de links, una sola vez: los renderizan la versión estática de
// mobile (cream) y el panel del takeover (sobre negro) con paletas distintas.
function LinkColumns({ dark }: { dark: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4 lg:gap-x-16">
      {GROUPS.map((group) => (
        <nav key={group.title} aria-label={group.title}>
          <h2 className={`text-label ${dark ? "text-cream" : ""}`}>{group.title}</h2>
          <div className="mt-3 flex flex-col gap-5">
            {group.sections.map((section, i) => (
              <div key={section.label || i} className="flex flex-col gap-1.5">
                {section.label && (
                  <p
                    className={`text-caption uppercase ${
                      dark ? "text-cream/50" : "text-gray-intermediate"
                    }`}
                  >
                    {section.label}
                  </p>
                )}
                <ul className="flex flex-col gap-1.5">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className={`text-body-sm transition-colors ${
                          dark
                            ? "text-cream/70 hover:text-cream"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      ))}
    </div>
  );
}

export default function FooterV4() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk, isDesktop }) => {
    const wipe = q("[data-footer-wipe]")[0];
    const panel = q("[data-footer-panel]")[0];
    const parts = q("[data-footer-bounce]");
    if (!wipe || !panel || parts.length === 0) return;

    // Sin motion o en mobile no hay takeover: queda la versión estática.
    if (!motionOk || !isDesktop) return;

    // El disparador es una distancia AL FONDO DE LA PÁGINA: a PULL_PX del
    // máximo scroll arranca el wipe y un tirón lleva la página sola hasta el
    // borde. Números absolutos contra maxScroll (un string tipo
    // "bottom bottom" no puede expresar esto), re-evaluados en cada refresh.
    const PULL_PX = 100;
    const scroller = document.scrollingElement ?? document.documentElement;

    // El timeline (panel + bote) vive SEPARADO de su trigger, y el trigger
    // se crea al final: sus callbacks referencian `tl`, y si el trigger
    // naciera dentro del constructor del timeline podría disparar onEnter en
    // el mismo frame (página ya en el fondo al montar) con `tl` sin asignar.
    //
    // El wipe NO está en el timeline: entrada y salida son tweens propios
    // con velocidades distintas — la salida es más rápida y sin curva. Se
    // anima la ALTURA y no scaleY: adentro del wipe vive la copia blanca del
    // wordmark, y un scale la deformaría; la altura solo mueve el borde del
    // recorte. Un solo elemento absoluto adentro — el reflow es trivial.
    const tl = gsap.timeline({ paused: true });

    const takeover = (on: boolean) => {
      if (on) {
        tl.play();
        gsap.to(wipe, {
          height: window.innerHeight,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
        // El tirón: los últimos ~100px los recorre la página sola.
        // `scrollTop` es una propiedad numérica normal — no hace falta
        // ScrollToPlugin. `overwrite` mata un tirón anterior si el umbral
        // se cruza dos veces seguidas.
        gsap.to(scroller, {
          scrollTop: ScrollTrigger.maxScroll(window),
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        // El tirón pierde SIEMPRE contra el usuario escapando hacia arriba:
        // sin el kill seguiría arrastrándolo al fondo.
        gsap.killTweensOf(scroller);
        tl.reverse();
        // El primer gesto de scroll inverso DISPARA la salida y de ahí corre
        // sola: rápida y lineal, sin quedar atada al ritmo del scroll.
        gsap.to(wipe, { height: 0, duration: 0.25, ease: "none", overwrite: "auto" });
      }
    };

    // Panel y bote. El panel entra apenas después del negro; el wordmark da
    // un salto corto y cae con `bounce.out` — el "golpe" de llegar al fondo.
    tl.fromTo(
      panel,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" },
      0.12
    )
      .fromTo(parts, { y: 0 }, { y: -9, duration: 0.16, ease: "power2.out" }, 0)
      .to(parts, { y: 0, duration: 0.7, ease: "bounce.out" }, 0.16);

    // El trigger se crea al FINAL: si la página ya está en el fondo al
    // montar, onEnter dispara acá mismo — con `tl` y sus tweens completos.
    ScrollTrigger.create({
      start: () => ScrollTrigger.maxScroll(window) - PULL_PX,
      end: () => ScrollTrigger.maxScroll(window),
      markers: DEBUG_MARKERS,
      onEnter: () => takeover(true),
      onLeaveBack: () => takeover(false),
      // Dentro de la banda el que manda es el SENTIDO del scroll, no la
      // posición: el primer píxel hacia arriba deshace el takeover (sin
      // esperar a salir de la banda), y volver a bajar lo rearma.
      onUpdate: (self) => {
        if (self.direction === -1 && !tl.reversed()) takeover(false);
        else if (self.direction === 1 && tl.reversed()) takeover(true);
      },
    });

    return () => {
      gsap.killTweensOf([scroller, wipe, panel, ...parts]);
      gsap.set(parts, { clearProps: "transform" });
      gsap.set(wipe, { clearProps: "height" });
      gsap.set(panel, { clearProps: "transform,opacity,visibility" });
    };
  });

  return (
    // Sin overflow-hidden en el root, a propósito: tanto el wipe (100svh)
    // como el panel (bottom-full) viven por ENCIMA del borde superior del
    // footer — recortarlos mataría el takeover en silencio.
    <footer ref={rootRef} className="relative isolate bg-cream text-foreground lg:pt-40">
      {/* El wipe: una caja negra anclada al FONDO del footer que crece en
          ALTURA (no scaleY: el contenido de adentro no se puede deformar) y
          recorta con overflow-hidden. Como el fondo del footer es el fondo
          de la página y el takeover ocurre con la página tirada al borde, a
          altura completa (100svh) cubre el viewport exacto.

          Adentro va la copia BLANCA del wordmark, anclada al mismo fondo que
          la real: el borde superior del negro la recorta al píxel, así que
          congelado a mitad de camino el logo queda partido en dos colores —
          blanco bajo el negro, negro sobre el cream — en vez de fundirse. */}
      <div
        aria-hidden="true"
        data-footer-wipe
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-0 overflow-hidden bg-ink"
      >
        <div data-footer-bounce className="absolute inset-x-0 bottom-0">
          <Image
            src="/prototype/v2/near-wordmark.svg"
            alt=""
            width={WORDMARK_W}
            height={WORDMARK_H}
            unoptimized
            className="block h-auto w-full invert"
            style={{ marginBottom: `-${WORDMARK_CROP_PCT}%` }}
          />
        </div>
      </div>

      {/* Mobile / reduced-motion: el footer original completo, estático en
          cream. En lg desaparece — ahí el contenido vive en el panel. */}
      <Container className="grid gap-16 pb-24 pt-24 lg:hidden">
        <p className="text-h2 text-pretty">
          Where money
          <br />
          <Accent>actually moves.</Accent>
        </p>
        <LinkColumns dark={false} />
      </Container>

      {/* El panel del takeover: headline + columnas, posicionado con su
          borde inferior en el TOP del footer — o sea, justo encima del
          wordmark, flotando sobre la sección anterior sin ocupar layout.
          Invisible hasta que el timeline lo trae (autoAlpha). */}
      {/* `bottom` descuenta el pt-40 del root: el ancla del panel es el TOP
          del wordmark, no el top del footer — si no, el aire de la sección
          cream se colaría también dentro del takeover negro. */}
      <div
        data-footer-panel
        className="invisible absolute inset-x-0 bottom-[calc(100%-10rem)] z-[3] hidden lg:block"
      >
        <Container className="grid gap-16 pb-20 lg:grid-cols-[1fr_auto] lg:gap-24">
          <p className="text-h2 text-cream text-pretty">
            Where money
            <br />
            <Accent>actually moves.</Accent>
          </p>
          <LinkColumns dark />
        </Container>
      </div>

      {/* Lo único visible por defecto en desktop: el wordmark negro, DEBAJO
          del wipe — cuando el negro sube, la copia blanca de adentro del wipe
          lo va reemplazando con un corte duro. `overflow-hidden` recorta solo
          el overshoot de las letras redondas (ver PrototypeFooter). */}
      <div data-footer-bounce className="relative z-[1] overflow-hidden">
        <Image
          src="/prototype/v2/near-wordmark.svg"
          alt="NEAR"
          width={WORDMARK_W}
          height={WORDMARK_H}
          unoptimized
          className="block h-auto w-full"
          style={{ marginBottom: `-${WORDMARK_CROP_PCT}%` }}
        />
      </div>

      {/* El legal, por ENCIMA del wipe para no quedar sepultado por el negro.
          `mix-blend-difference` con source gris funciona sobre los DOS
          estados: sobre cream cae oscuro, sobre el negro del wipe queda
          claro. No necesita variante dark. */}
      <div className="absolute inset-x-0 bottom-6 z-[3] mix-blend-difference">
        <Container className="flex flex-wrap items-center justify-end gap-x-8 gap-y-2 text-neutral-400">
          <p className="text-body-sm">© 2026 NEAR. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {LEGAL.map((item) => (
              <li key={item}>
                <a href="#" className="text-body-sm transition-opacity hover:opacity-70">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
