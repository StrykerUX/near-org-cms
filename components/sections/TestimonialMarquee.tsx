"use client";

import Image from "next/image";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Copy de draft, en el tono de la referencia — sin testimonios reales.
const TESTIMONIALS = [
  {
    logo: { name: "Venice", src: "/logos/venice.png", width: 89, height: 40 },
    quote:
      "Near still feels like the most underrated team in crypto to me. New feature releases basically every other week on an actually scalable chain.",
    name: "Mert Mumtaz",
    role: "CEO of Helius",
    tone: "light",
  },
  {
    logo: { name: "Abound", src: "/logos/abound.png", width: 111, height: 24 },
    quote:
      "We shipped confidential payouts in a week. The part that surprised us was not needing a separate trust story to sell it.",
    name: "Dana Ferris",
    role: "CTO of Abound",
    tone: "dark",
  },
  {
    logo: { name: "Brave", src: "/logos/brave.png", width: 86, height: 24 },
    quote:
      "Privacy that has to be explained is privacy nobody uses. Here it is the default, and that changed how we onboard.",
    name: "Iris Kowalski",
    role: "Head of Product, Brave",
    tone: "light",
  },
  {
    logo: { name: "ZODL", src: "/logos/zodl.png", width: 133, height: 27 },
    quote:
      "Cross-chain used to mean three integrations and a bridge we did not control. Now it is one account and it settles.",
    name: "Tomás Rivera",
    role: "Founder of ZODL",
    tone: "light",
  },
  {
    logo: { name: "Ledger", src: "/logos/ledger.png", width: 117, height: 39 },
    quote:
      "Self custody stopped being the hard sell. Our users keep their keys and still get the experience they expected.",
    name: "Amara Osei",
    role: "VP Engineering, Ledger",
    tone: "dark",
  },
] as const;

// Duración de una vuelta completa. Un set mide ~5 × 27rem ≈ 2160px, así que
// esto da ~48px/s: lento como para leer un quote entero al pasar.
const LOOP_SECONDS = 45;

// Las dos props son OPCIONALES y sus defaults son lo que la sección ya hacía,
// así que la homepage de ab7 no cambia. Existen para que los drafts EX puedan
// variar el mismo carrusel sin forkearlo.
export type TestimonialMarqueeProps = {
  /** Hacia dónde corre la cinta. */
  direction?: "left" | "right";
  /** Segundos de una vuelta completa. Más = más lento. */
  loopSeconds?: number;
};

export default function TestimonialMarquee({
  direction = "left",
  loopSeconds = LOOP_SECONDS,
}: TestimonialMarqueeProps = {}) {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const track = q("[data-marquee]")[0];
      if (!track) return;

      // El track tiene dos copias idénticas pegadas, así que su ancho es
      // exactamente 2× un set y -50% es un set exacto — el loop cierra sin
      // salto, independiente del ancho de card. Por eso la separación entre
      // cards va como MARGEN DE CADA CARD y no como `gap` del track: un gap
      // agrega n-1 espacios y rompe justo esa exactitud.
      // El sentido se invierte cambiando el ORIGEN, no el destino: partiendo de
      // −50% y yendo a 0, la cinta corre hacia la derecha y el bucle sigue
      // siendo exacto, porque el track son dos sets idénticos y el salto de
      // −50% a 0 cae siempre en el mismo fotograma.
      const from = direction === "right" ? -50 : 0;
      const to = direction === "right" ? 0 : -50;
      const tween = gsap.fromTo(
        track,
        { xPercent: from },
        { xPercent: to, duration: loopSeconds, ease: "none", repeat: -1, force3D: true }
      );
      pauseOffscreen(tween, scope);

      // Frena al pasar el mouse: son testimonios, hay que poder leerlos. Se
      // hace con `timeScale` y NO con play/pause a propósito — pauseOffscreen
      // ya usa play/pause, y las dos cosas peleando por el mismo control
      // dejarían el marquee corriendo fuera de pantalla si el puntero sale del
      // elemento mientras la sección se va del viewport.
      const slow = (to: number) => gsap.to(tween, { timeScale: to, duration: 0.4 });
      const onEnter = () => slow(0);
      const onLeave = () => slow(1);
      scope.addEventListener("pointerenter", onEnter);
      scope.addEventListener("pointerleave", onLeave);

      return () => {
        scope.removeEventListener("pointerenter", onEnter);
        scope.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => mm.revert();
  }, []);

  // El set duplicado: la segunda mitad es puramente visual.
  const cards = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section ref={rootRef} className="bg-cream py-20 text-foreground md:py-28">
      {/* `overflow-hidden` para que el track sangre a los bordes del viewport
          en vez de quedar dentro de Container. Con reduced-motion el marquee no
          corre, así que ahí el overflow pasa a scroll manual: si no, los
          testimonios que no entran en pantalla serían inalcanzables. */}
      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        {/* Sin `will-change` fijo: lo administra `pauseOffscreen`, que lo pone al
            entrar en viewport y lo suelta al salir. Declararlo acá dejaría la
            banda promovida a capa durante toda la sesión. */}
        <div data-marquee className="flex w-max">
          {cards.map((t, i) => {
            const isClone = i >= TESTIMONIALS.length;
            const dark = t.tone === "dark";

            return (
              <article
                key={i}
                // La copia no debe existir para un lector de pantalla: si no,
                // lee los cinco testimonios dos veces.
                aria-hidden={isClone || undefined}
                className={`relative mr-6 flex w-[27rem] shrink-0 flex-col gap-5 overflow-hidden rounded-3xl p-8 ${
                  dark ? "bg-[#101010] text-white" : "bg-white text-foreground"
                }`}
              >
                {/* Bandas verticales muy tenues, el mismo material que los
                    covers de LatestUpdates. Solo en las oscuras: sobre blanco
                    no se leen. */}
                {dark && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 3%, rgba(0,0,0,0) 3% 6%)",
                    }}
                  />
                )}

                {/* La comilla decorativa, sólida y no tenue: en la referencia es
                    un elemento gráfico con peso, no una marca de agua. En
                    aria-hidden porque un lector la anunciaría como "comilla
                    derecha". */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-7 top-5 select-none text-h1"
                >
                  &rdquo;
                </span>

                {/* `self-start` es obligatorio: en un flex column los hijos se
                    estiran a lo ancho por defecto, así que `w-auto` se resolvía
                    al ancho de la card y el logo salía estirado al doble.
                    brightness-0 lo normaliza a negro puro e `invert` lo pasa a
                    blanco en las oscuras — los PNG son de marca y no todos
                    vienen del mismo tono. */}
                <Image
                  src={t.logo.src}
                  alt={t.logo.name}
                  width={t.logo.width}
                  height={t.logo.height}
                  className={`h-6 w-auto self-start ${
                    dark ? "brightness-0 invert" : "brightness-0"
                  }`}
                />

                <p className="relative max-w-[34ch] text-body-sm text-pretty">
                  {t.quote}
                </p>

                {/* mt-auto ancla la atribución al fondo, así todas las cards la
                    alinean aunque los quotes midan distinto. El nombre usa
                    `text-label` (body-sm en weight medio, el token del DS) para
                    despegarse del rol sin cambiar de tamaño. */}
                <div className="relative mt-auto">
                  <p className="text-label">{t.name}</p>
                  <p className={`text-body-sm ${dark ? "text-white/50" : "text-muted-foreground"}`}>
                    {t.role}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
