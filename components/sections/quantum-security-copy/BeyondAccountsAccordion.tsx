"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { BEYOND_ACCOUNTS_CARDS as CARDS } from "@/components/sections/quantum-security-copy/quantumContent";

// Acordeón horizontal de BeyondAccounts — mismo contenido (BEYOND_ACCOUNTS_CARDS,
// sin tocar), layout nuevo: en vez de una grilla de 3 columnas iguales, las tres
// cards viven en una sola fila de altura fija y compiten por el ancho. Una
// siempre está activa (más ancha, con texto visible); las otras dos, comprimidas
// (angostas, solo la imagen).
//
// No usa useMotionScope/gsap a propósito: no hay ningún tween, el único motion
// es `transition-[flex-grow]` de CSS. Lo único que necesita del motion toolkit
// es el breakpoint de `prefers-reduced-motion`, así que alcanza con un
// matchMedia liso — traer el context de gsap acá sería indirección sin uso.
//
// ── El bug que NO hay que repetir ──────────────────────────────────────────
// La caja de imagen tiene el MISMO `shrink` (flex-shrink:1) en los dos estados,
// nunca 0. Un `flex-shrink` que cambia de 0 a 1 (o viceversa) según el estado
// es un salto discreto a mitad de la transición de ancho — el navegador no
// puede animar ENTRE dos comportamientos de shrink, así que la imagen pega un
// tirón visible. Acá no hace falta ninguna regla especial para la activa: con
// `shrink` fijo y un `basis` preferido, la imagen simplemente vuelve sola a su
// ancho preferido en cuanto sobra espacio.
//
// Misma regla para CUALQUIER propiedad que cambie entre los dos estados, no
// solo el shrink de la imagen: tiene que estar en `transition-property` y
// cambiar de VALOR, nunca aparecer/desaparecer por clase condicional. Hubo
// una segunda vuelta de este bug con `min-width` (un piso en px que solo se
// aplicaba comprimida, sin transición — la card pegaba contra la pared a
// mitad de camino) y una tercera, más chica, con el padding de la caja de
// texto (cambiaba de golpe mientras su `flex-grow` sí animaba). Las dos se
// resolvieron con el mismo criterio: `flex-basis` de la card anima entre `0`
// y un clamp (reemplaza al `min-width` condicional) y el `padding` de la
// caja de texto entró al `transition-property` junto con su `flex-grow`.
const AUTOPLAY_MS = 6000;
// La comprimida va en 0: con `flex-grow` puesto en las dos (como estaba
// antes del segundo bug) y un `flex-basis` grande en la comprimida, el
// espacio libre se reparte ENTRE las dos y a container normal terminan
// empatadas con la activa — el número no cierra. En 0, la comprimida no
// reclama nada del sobrante: su ancho final es su propio `flex-basis`, y
// la activa (única con grow>0) se queda con TODO lo que sobra después de
// las dos reservas — la que de verdad garantiza que quede claramente más
// ancha.
const ACTIVE_GROW = 1;
const COMPRESSED_GROW = 0;
// El `flex-basis` de la comprimida: reemplaza al `min-width` condicional
// del fix anterior. Mismo número (clamp cerca de la altura de fila, sin
// llegar a sumar overflow entre las dos), pero ahora es una propiedad que
// SÍ está en `transition-property` en los dos estados — nunca aparece ni
// desaparece de golpe, solo cambia de valor 0 ↔ este clamp, animado.
const COMPRESSED_BASIS = "clamp(180px,26vw,320px)";

// Timing compartido por la card, la caja de imagen y la caja de texto —
// las tres tienen que animar con el mismo reloj o se desincronizan. Cada
// una declara su PROPIA lista de `transition-property` (varía qué cambia
// en cada una), pero la duración/easing es una sola.
const TRANSITION_TIMING = "duration-[650ms] ease-[cubic-bezier(.22,.61,.36,1)] motion-reduce:transition-none";

// NOTA (2026-08-23): estas tres rutas apuntaban a `/prototype/homepage-update/`,
// carpeta que dejó de existir cuando `homepage-update` pasó a llamarse
// `homepage-a` (commit c76db74). Las imágenes quedaron rotas en main; se
// corrigen acá porque `/prototype/quantum-security-h3` monta este acordeón.
//
// Imágenes propias de este acordeón, no las de BEYOND_ACCOUNTS_CARDS — el
// título/body sí vienen de ahí sin tocar, pero el `src` de cada card se pisa
// acá, en el mismo orden (Wallets/Cross-chain/Ownership research). Son los
// íconos de OwnYourOwn en homepage-update (381×401, fondo crema y esquinas ya
// redondeadas en el propio webp) — por eso el plate de atrás pasa de bg-ink a
// bg-cream: con esas imágenes bg-ink dejaba un cuadro crema visible contra el
// plate negro, igual que ya pasaba con iso-22 (Wallets) antes de este cambio.
const IMAGE_OVERRIDES = [
  "/prototype/homepage-a/icon-assets.webp",
  "/prototype/homepage-a/icon-data.webp",
  "/prototype/homepage-a/icon-intelligence.webp",
] as const;

export default function BeyondAccountsAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Vivo, no un check de una sola vez: si el usuario cambia la preferencia en
  // caliente (algunos OS lo permiten sin recargar), el acordeón tiene que
  // reaccionar, no quedarse animando.
  useEffect(() => {
    const mql = window.matchMedia(MQ.reduce);
    setReduceMotion(mql.matches);
    const onChange = () => setReduceMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Autoplay péndulo (0→1→2→1→0→1…), con las cuatro pausas de siempre: hover,
  // foco de teclado, fuera de viewport, y `prefers-reduced-motion`. Un solo
  // efecto que arma y desarma todo — mismo criterio que useLoopCarousel.ts de
  // carousel-sections: nada de esto es render, es orquestación imperativa de
  // un timer + un IntersectionObserver.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (reduceMotion) return; // degradación: las tres quedan expandidas, sin timer.

    const dirRef = { current: 1 as 1 | -1 };
    const hoverRef = { current: false };
    const focusRef = { current: false };
    const inViewRef = { current: true };
    let timer: ReturnType<typeof setTimeout> | null = null;

    function pause() {
      if (timer) clearTimeout(timer);
      timer = null;
    }

    function advance() {
      setActiveIndex((prev) => {
        let next = prev + dirRef.current;
        if (next > CARDS.length - 1) {
          dirRef.current = -1;
          next = CARDS.length - 2;
        } else if (next < 0) {
          dirRef.current = 1;
          next = 1;
        }
        return next;
      });
    }

    function scheduleNext() {
      pause();
      if (hoverRef.current || focusRef.current || !inViewRef.current) return;
      timer = setTimeout(() => {
        advance();
        scheduleNext();
      }, AUTOPLAY_MS);
    }

    const onPointerEnter = () => {
      hoverRef.current = true;
      pause();
    };
    const onPointerLeave = () => {
      hoverRef.current = false;
      scheduleNext();
    };
    // focusin/focusout (no focus/blur): son los que burbujean de verdad, así
    // que un solo listener en la sección alcanza para las tres cards — igual
    // que useLoopCarousel.ts.
    const onFocusIn = () => {
      focusRef.current = true;
      pause();
    };
    const onFocusOut = () => {
      focusRef.current = false;
      scheduleNext();
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current = entry.isIntersecting;
          if (entry.isIntersecting) scheduleNext();
          else pause();
        },
        { threshold: 0.15 }
      );
      io.observe(section);
    }

    section.addEventListener("pointerenter", onPointerEnter);
    section.addEventListener("pointerleave", onPointerLeave);
    section.addEventListener("focusin", onFocusIn);
    section.addEventListener("focusout", onFocusOut);

    scheduleNext();

    return () => {
      pause();
      io?.disconnect();
      section.removeEventListener("pointerenter", onPointerEnter);
      section.removeEventListener("pointerleave", onPointerLeave);
      section.removeEventListener("focusin", onFocusIn);
      section.removeEventListener("focusout", onFocusOut);
    };
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} className="bg-cream text-foreground">
      <Container className="flex flex-col gap-[72px] py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-ink-soft">Beyond accounts</Eyebrow>
            <h2 className="text-h2 text-pretty">
              Wallets, cross-chain,
              <br />
              <Accent>and research</Accent>
            </h2>
          </div>
          <p className="text-body-lg text-ink-soft text-pretty lg:pt-10">
            Account-level protection is the first step. NEAR is also extending quantum
            safety across the surfaces that hold and move assets.
          </p>
        </div>

        {/* Altura fija de la fila — clamp de layout, no de tipografía (los
            tokens de texto de abajo, text-h4/text-body, son los mismos que
            usaba la grilla original). Solo el ANCHO de cada card se anima. */}
        <div className="flex h-[clamp(280px,32vw,420px)] gap-6">
          {CARDS.map((card, i) => {
            // Con reduced motion las tres quedan "activas" a la vez: mismo
            // flex-grow, texto siempre visible — nunca una card atascada
            // comprimida sin poder leerse.
            const active = reduceMotion || i === activeIndex;

            return (
              <button
                key={card.title}
                type="button"
                aria-expanded={active}
                aria-label={card.title}
                onClick={() => setActiveIndex(i)}
                data-active={active}
                className={`group flex h-full items-stretch overflow-hidden rounded-3xl bg-white p-2.5 text-left outline-none transition-[flex-grow,flex-basis] focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${TRANSITION_TIMING}`}
                style={{
                  flexGrow: active ? ACTIVE_GROW : COMPRESSED_GROW,
                  flexShrink: 1,
                  flexBasis: active ? 0 : COMPRESSED_BASIS,
                }}
              >
                {/* La caja de imagen: shrink fijo (nunca 0, ver nota de arriba)
                    y un `grow` que SÍ alterna — 0 mientras el texto está
                    activo y se queda con el resto, 1 en comprimida para que
                    reclame el 100% del ancho que el texto deja libre. Con
                    basis+shrink nomás (sin grow) el hueco que sobraba al
                    achicar el texto no iba a ningún lado — quedaba como
                    espacio vacío después de los dos hijos, no como más
                    imagen. Este es el fix del bug de la captura. */}
                <div
                  className={`relative h-full min-w-[44px] shrink basis-[38%] overflow-hidden rounded-[1.15rem] bg-cream transition-[flex-grow] group-data-[active=true]:grow-0 group-data-[active=false]:grow-1 ${TRANSITION_TIMING}`}
                >
                  <Image
                    src={IMAGE_OVERRIDES[i]}
                    alt=""
                    fill
                    sizes={
                      active
                        ? "(min-width: 1024px) 55vw, 88vw"
                        : "(min-width: 1024px) 14vw, 26vw"
                    }
                    className="object-contain"
                  />
                </div>

                {/* La caja de texto: basis-0 siempre, pero el `grow` alterna
                    igual que el de la imagen (al revés) — 1 activa, 0
                    comprimida. Con grow-0 no reclama nada del espacio
                    sobrante, así que su ancho real cae a lo que basis-0 le
                    da: nada. overflow-hidden + la opacidad de abajo tapan
                    cualquier resto de subpíxel. */}
                <div
                  className={`flex min-w-0 shrink basis-0 flex-col justify-center gap-3 overflow-hidden transition-[flex-grow,padding-left,padding-right] group-data-[active=true]:grow-1 group-data-[active=true]:pl-4.5 group-data-[active=true]:pr-2 group-data-[active=false]:grow-0 group-data-[active=false]:pl-0 group-data-[active=false]:pr-0 ${TRANSITION_TIMING}`}
                >
                  <div
                    aria-hidden={!active}
                    className={`flex flex-col gap-3 transition-opacity motion-reduce:transition-none motion-reduce:delay-0 ${
                      active ? "opacity-100 duration-300 delay-150" : "opacity-0 duration-150"
                    }`}
                  >
                    <h3 className="text-h4 text-pretty">{card.title}</h3>
                    <p className="max-w-[38ch] text-body text-pretty text-foreground/75">{card.body}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
