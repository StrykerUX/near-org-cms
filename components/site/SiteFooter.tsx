"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { getLenis } from "@/components/site/providers/lenisInstance";

// El footer del sitio. UNO solo, montado por los tres layouts del frontend —
// `app/(site)`, `app/(motion)` y `app/prototype` — y por ninguna view.
//
// ── De dónde viene ──────────────────────────────────────────────────────────
//
// Es el `FooterV2` del takeover, que había nacido en `/prototype/homepage-v2` y
// llegó a existir en cuatro copias divergentes (`sections/FooterV2`,
// `home-v2/FooterV2`, `home-v4/FooterV4`, `sections/PrototypeFooter`) más el
// footer gris que montaba `(site)`. Este archivo las reemplaza a las cinco.
//
// Vive en `components/site/` y no en `components/sections/` a propósito: el
// contrato de `sections/` (ver su README) prohíbe importar `@/lib/*` y describe
// una sección como algo que una view compone con sus props. Esto no es
// composición — es chrome, igual que `SiteHeader`, y se monta desde el layout.
//
// ── Qué hace ────────────────────────────────────────────────────────────────
//
// En desktop el footer EN FLUJO es solo el wordmark, sentado justo debajo de la
// última sección de la página. A ~100px del fondo del documento, un tirón lleva
// el scroll hasta el borde y un wipe negro de un viewport de alto sube TAPANDO
// la sección anterior; sobre ese negro aparecen el headline y las columnas de
// links — el footer "toma" la pantalla. Volver hacia arriba lo revierte.
//
// En mobile (y con reduced-motion en desktop, donde no hay takeover pero el
// panel absoluto quedaría inaccesible) el footer completo se renderiza estático
// en cream: por eso headline+links existen DOS veces abajo — una versión en
// flujo `lg:hidden` y el panel absoluto `hidden lg:block`.
//
// En una pantalla baja el takeover no entra completo en el viewport, y lo que
// cede es el pie del logo y no el headline: ver "Pantallas bajas" más abajo.

// Los grupos transcritos del tab Footer de "near.org - sitemap" (Google Doc) —
// cuatro de ahí más "Terms and Policies", que el doc no tiene como columna.
// Sin las descripciones por link, que el doc lista solo bajo Navigation.
// Resources y About conservan sus sub-grupos (Build / Learn / Connect,
// Fundamentals / Ecosystem), y por eso una columna es una lista de SECCIONES y
// no una lista plana de links.
//
// ── Por qué el href va acá y no sale del manifiesto de rutas ────────────────
//
// `lib/routes.ts` da una lista PLANA de páginas; esta jerarquía de cuatro
// columnas con sub-labels no es expresable en `PageMeta`. Mismo caso que
// `SiteHeader`, que ya lleva su propia copy por la misma razón — el comentario
// de `lib/routes.ts` lo documenta.
//
// `href: null` = la página todavía no existe. Se renderiza como link inerte a
// "#" en vez de inventarle un destino: un link equivocado es peor que un
// placeholder evidente. Al crear la página, esto es una línea.
type FooterLink = { label: string; href: string | null };

const GROUPS: {
  title: string;
  sections: { label: string; links: FooterLink[] }[];
}[] = [
  {
    title: "Products",
    sections: [
      {
        label: "",
        links: [
          { label: "near.com", href: "/nearcom" },
          { label: "Intents", href: "/intents" },
          { label: "NEAR AI", href: "/near-ai" },
        ],
      },
    ],
  },
  {
    title: "Stack",
    sections: [
      {
        label: "",
        links: [
          // "Protocol" es el label del sitemap doc; la ruta se llama
          // /blockchain. Acá apuntaba a /prototype/protocol, que ya no existe.
          { label: "Protocol", href: "/blockchain" },
          { label: "Chain Abstraction", href: "/chain-abstraction" },
          { label: "Quantum Security", href: "/quantum-security" },
        ],
      },
    ],
  },
  {
    title: "Resources",
    sections: [
      {
        label: "Build",
        links: [
          { label: "Docs", href: null },
          { label: "Solutions", href: "/solutions" },
        ],
      },
      {
        label: "Learn",
        links: [
          { label: "Research", href: "/research" },
          { label: "Blog", href: "/blog" },
          { label: "Analytics", href: "/analytics" },
        ],
      },
      {
        label: "Connect",
        links: [
          { label: "Brand", href: "/brand" },
          { label: "Contact", href: "/contact-us" },
          { label: "Careers", href: null },
        ],
      },
    ],
  },
  {
    title: "About",
    sections: [
      {
        label: "Fundamentals",
        links: [
          { label: "History", href: null },
          { label: "Roadmap", href: null },
          { label: "Economics", href: "/economics" },
        ],
      },
      {
        label: "Ecosystem",
        links: [
          { label: "NEAR Foundation", href: "/near-foundation" },
          { label: "Community", href: "/community" },
          { label: "Governance", href: null },
        ],
      },
    ],
  },
  // La quinta columna no está en el tab Footer del sitemap doc: ahí lo legal
  // vive como una fila al pie. Se sube a columna a pedido, y entonces la fila
  // de abajo se queda solo con el copyright — los mismos tres links dos veces
  // en la misma pantalla no son dos caminos, son ruido.
  {
    title: "Terms and Policies",
    sections: [
      {
        label: "",
        links: [
          { label: "Terms of Use", href: "/terms-of-use" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Cookie Policy", href: "/cookie-policy" },
          { label: "Official Rules", href: "/official-rules" },
        ],
      },
    ],
  },
];

// El wordmark es el SVG y no el PNG de 1440px: se muestra al 100% del ancho del
// viewport, así que en cualquier pantalla más ancha que 1440 CSS px el raster se
// escalaba hacia arriba. Vector no tiene ese techo.
//
// El crop de abajo es la única parte sutil del archivo. El tipo está
// ópticamente corregido: los astiles planos de la "n" y la "r" terminan en
// y = 404.43 en unidades del SVG, mientras la "e" y la "a" redondas sobrepasan
// hasta 410.24 para que el ojo las lea todas sobre una misma línea. Alinear la
// caja al extremo real de los glifos deja entonces una franja visible de página
// bajo las dos letras planas. Recortar a la baseline PLANA —cortando el
// overshoot de las redondas, que el ojo ya descuenta— es lo que hace que el
// wordmark se vea sentado.
//
// Medido con getBBox() sobre el asset, no estimado. Re-medir si se redibuja.
const WORDMARK_W = 981; // ancho del viewBox
const WORDMARK_H = 255; // alto del viewBox
const WORDMARK_FLAT_BASELINE = 404.43;
const WORDMARK_VIEWBOX_BOTTOM = 411;

// Expresado como porcentaje del ANCHO a propósito: un margen porcentual resuelve
// contra el ancho del bloque contenedor, así que este único valor recorta la
// misma proporción en cualquier viewport sin medir nada en runtime.
const WORDMARK_CROP_PCT =
  ((WORDMARK_VIEWBOX_BOTTOM - WORDMARK_FLAT_BASELINE) / WORDMARK_W) * 100; // ≈0.67%

// ── Pantallas bajas ─────────────────────────────────────────────────────────
//
// El wordmark va a sangre, así que su ALTO sale del ANCHO del viewport: ~25% de
// él (255/981 menos el crop). En 1920×800 son 486px de logo contra 800 de
// pantalla, y el panel del takeover —headline + cuatro columnas, ~460px— ya no
// entra entre el borde de arriba y el logo. Lo que sobraba se iba por ARRIBA:
// el headline cortado contra el borde superior, que es justo lo que no se
// puede perder — el logo se sigue leyendo a medias, el headline no.
//
// El reparto se invierte: el panel manda y lo que cede es, en orden,
//   1) el aire entre el panel y el logo (de 72px a 40px);
//   2) el logo, cuya caja se acorta y lo recorta por ABAJO. Ya vivía dentro de
//      un overflow-hidden y sus astiles altos son lo que lo hace reconocible.
//
// Debajo de WORDMARK_MIN_H el logo deja de encogerse: recortado a una franja
// no se lee, y a esa altura tampoco queda nada que repartir.
//
// Los dos mínimos son ALTOS a propósito: son el peor caso, o sea lo que se ve
// en la pantalla más baja, y ahí es donde un footer se siente apretado. El
// precio lo paga el logo, que es lo que se puede leer a medias.
// El aire se mide contra el borde de la ventana y no se le reserva nada al
// header: es `fixed` pero se esconde al scrollear hacia abajo, y al takeover
// sólo se llega bajando — cuando el panel aparece, el header ya no está.
const TAKEOVER_TOP_MIN = 72; // aire mínimo sobre el headline
const TAKEOVER_GAP_MAX = 72; // el aire entre los links y el logo, cuando hay lugar
const TAKEOVER_GAP_MIN = 40;
const WORDMARK_MIN_H = 96;

// El wordmark deja de ser a sangre pasados los 2080px: más ancho que eso, el
// alto que reclama (25% del ancho) le come la pantalla al panel sin que el
// logo se lea mejor. Centrado, con el aire repartido a los dos lados.
const WORDMARK_MAX_W = "mx-auto w-full max-w-[2080px]";

// ── El indicador con inercia ────────────────────────────────────────────────
//
// Es la F18 del hover-lab (`components/views/hover-lab/FooterLinkVariantsPlus`,
// ahí "Inertial indicator"): un chip que viaja hasta el link bajo el cursor y
// se ESTIRA mientras viaja, proporcionalmente al salto. La deformación en el
// eje del movimiento es lo que hace leer velocidad — y es exactamente lo que
// una `transition` de CSS no puede expresar, porque no sabe cuánta distancia
// va a recorrer.
//
// UNO POR COLUMNA y no uno para toda la grilla: el gesto es vertical, y un
// chip cruzando de "Products" a "Terms and Policies" se leería como otra cosa.
// Cada `<nav>` es su propio host, así que también funciona en las columnas con
// sub-grupos, donde el chip salta por encima de los rótulos LEARN/CONNECT.
//
// El código no se copió del lab tal cual: allá el host es una lista plana y el
// chip se posiciona solo en Y (todos los links arrancan en x=0). Acá se anima
// también X contra el borde del link, que es lo que lo hace inmune a cualquier
// sangría dentro de la columna.
const CHIP_PAD_X = 14; // el aire a cada lado del texto, dentro del chip
const CHIP_PAD_Y = 5; // idem arriba y abajo. Los renglones están a 6px, así que
// dos chips vecinos casi se tocan — no importa: nunca hay dos a la vez.
const CHIP_STRETCH_MAX = 0.5; // tope del estiramiento, en fracción del alto
const CHIP_STRETCH_PX = 160; // el salto (en px) que llega a ese tope

function FooterColumn({
  group,
  dark,
  linkClass,
  className = "",
}: {
  group: (typeof GROUPS)[number];
  dark: boolean;
  linkClass: string;
  className?: string;
}) {
  const rootRef = useGsapContext<HTMLElement>((_self, root) => {
    const chip = root.querySelector<HTMLElement>("[data-footer-chip]");
    if (!chip) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      // La última posición, para saber CUÁNTO saltó: un estiramiento fijo se
      // ve igual saltando una fila que cinco, y ahí el efecto no dice nada.
      let lastY: number | null = null;

      const over = (e: PointerEvent) => {
        const link = (e.target as HTMLElement).closest("a");
        if (!link || !root.contains(link)) return;

        const host = root.getBoundingClientRect();
        const box = link.getBoundingClientRect();
        const y = box.top - host.top;
        const travel = lastY === null ? 0 : Math.abs(y - lastY);
        lastY = y;

        gsap.killTweensOf(chip);
        gsap.set(chip, { autoAlpha: 1 });
        gsap
          .timeline()
          .to(
            chip,
            {
              x: box.left - host.left - CHIP_PAD_X,
              y: y - CHIP_PAD_Y,
              width: box.width + CHIP_PAD_X * 2,
              height: box.height + CHIP_PAD_Y * 2,
              duration: 0.45,
              ease: "power3.out",
            },
            0
          )
          .to(
            chip,
            {
              scaleY: 1 + Math.min(travel / CHIP_STRETCH_PX, CHIP_STRETCH_MAX),
              duration: 0.14,
              ease: "power2.out",
            },
            0
          )
          .to(chip, { scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, 0.14);
      };

      const leave = () => {
        lastY = null;
        gsap.to(chip, { autoAlpha: 0, duration: 0.2, overwrite: true });
      };

      root.addEventListener("pointerover", over);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointerover", over);
        root.removeEventListener("pointerleave", leave);
        // Los tweens nacen en los handlers, o sea fuera del scope que
        // matchMedia captura: hay que matarlos a mano o el chip queda con
        // transform inline pegada tras un remount (StrictMode los hace de a
        // dos en dev).
        gsap.killTweensOf(chip);
        gsap.set(chip, { clearProps: "transform,width,height,opacity,visibility" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <nav ref={rootRef} aria-label={group.title} className={`relative ${className}`}>
      {/* Nace sin alto ni ancho: los recibe de GSAP junto con la posición.
          `invisible` lo mantiene fuera del árbol de accesibilidad hasta el
          primer hover, y sin motion no se enciende nunca. */}
      <span
        data-footer-chip
        aria-hidden="true"
        // Sin `will-change`: son cinco chips por columna y diez en la página
        // (la versión estática y el panel), invisibles casi todo el tiempo.
        // Promoverlos a capa propia de forma permanente es memoria de GPU
        // reservada para algo que no se está moviendo; GSAP ya promueve el que
        // anima mientras dura el tween.
        className={`pointer-events-none invisible absolute left-0 top-0 h-0 w-0 rounded-lg opacity-0 ${
          dark ? "bg-cream/15" : "bg-foreground/8"
        }`}
      />
      <h2 className={`relative text-label ${dark ? "text-cream" : ""}`}>{group.title}</h2>
      <div className="mt-3 flex flex-col gap-5">
        {group.sections.map((section, i) => (
          <div key={section.label || i} className="flex flex-col gap-1.5">
            {section.label && (
              <p
                className={`relative text-caption uppercase ${
                  dark ? "text-cream/50" : "text-gray-intermediate"
                }`}
              >
                {section.label}
              </p>
            )}
            <ul className="flex flex-col gap-1.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href="#" className={linkClass}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

// Los grupos de links, una sola vez: los renderizan la versión estática de
// mobile (cream) y el panel del takeover (sobre negro) con paletas distintas.
function LinkColumns({ dark, columns = "auto" }: { dark: boolean; columns?: "auto" | "two" }) {
  // `relative` para que el texto quede POR ENCIMA del chip, que es absoluto y
  // si no lo taparía a medias.
  const linkClass = `relative text-body-sm transition-colors ${
    dark ? "text-cream/70 hover:text-cream" : "text-muted-foreground hover:text-foreground"
  }`;

  // Mapas literales de clases: Tailwind v4 no detecta las que se arman con un
  // template string.
  // En la versión sin takeover la grilla NO se estira de borde a borde: se le
  // pone un techo y el flex del padre la centra. Estirada, las columnas
  // quedaban separadas por medio ancho de pantalla y la tercera se iba sola
  // contra el borde derecho.
  const grid =
    columns === "two"
      ? "w-full max-w-[26rem] grid-cols-2 sm:max-w-[44rem] sm:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";

  // A partir de sm —y hasta lg, que es donde esta versión deja de existir— la
  // quinta columna se emplaza SOLA en la tercera, y las otras cuatro quedan de
  // a dos en las dos primeras. Con el flujo automático caían 3 + 2 y "Terms
  // and Policies" terminaba de vecina de "About" en la segunda fila; acá es un
  // grupo aparte —lo legal, no navegación— y se lee mejor en su propia
  // columna. Debajo de sm no aplica ninguna: ahí manda el flujo, en 2 columnas.
  const PLACE = columns === "two"
    ? [
        "sm:col-start-1 sm:row-start-1",
        "sm:col-start-2 sm:row-start-1",
        "sm:col-start-1 sm:row-start-2",
        "sm:col-start-2 sm:row-start-2",
        "sm:col-start-3 sm:row-start-1",
      ]
    : [];

  return (
    <div className={`grid gap-x-12 gap-y-10 lg:gap-x-16 ${grid}`}>
      {GROUPS.map((group, i) => (
        <FooterColumn
          key={group.title}
          group={group}
          dark={dark}
          linkClass={linkClass}
          className={PLACE[i] ?? ""}
        />
      ))}
    </div>
  );
}

// ── La versión sin takeover ─────────────────────────────────────────────────
//
// Bajo lg (y en desktop con reduced-motion) no hay takeover: el footer es una
// pieza en flujo. En vez de dejarla como la copia pálida del desktop, INVIERTE
// la paleta — fondo ink, links en cream, wordmark en blanco. El negro es el
// estado en el que el footer se ve en desktop; que en mobile fuera claro era
// una consecuencia de cómo está armado el takeover, no una decisión.
//
// La entrada es REPETIBLE a propósito: `toggleActions` con reverse, y no el
// `once: true` de useScrollReveal. En mobile el footer es corto y se entra y
// se sale de él todo el tiempo; una entrada de una sola vez deja el resto de
// la sesión con un footer que ya no hace nada.
function StaticFooter() {
  const rootRef = useGsapContext<HTMLDivElement>((_self, root) => {
    const mm = gsap.matchMedia();

    // Mobile Y motion: en desktop manda el takeover, y con reduced-motion no
    // hay entrada — el `.from()` ni siquiera llega a esconder nada.
    mm.add(`${MQ.mobile} and ${MQ.motion}`, () => {
      const headline = root.querySelector("[data-footer-headline]");
      const columns = gsap.utils.toArray<HTMLElement>("nav", root);
      // El wordmark vive fuera de este bloque —lo comparte con el takeover—
      // así que se busca desde el footer, no desde el scope.
      const wordmark = root.closest("footer")?.querySelector("[data-footer-wordmark]");
      if (!headline || columns.length === 0) return;

      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          // Termina antes del final del bloque: el wordmark es alto y si el
          // `end` cayera en su base, la entrada recién se completaría con el
          // footer ya scrolleado fuera de la pantalla.
          end: "bottom 40%",
          toggleActions: "play none none reverse",
          markers: DEBUG_MARKERS,
        },
      });

      tl.from(headline, { autoAlpha: 0, y: 32, duration: 0.8 })
        .from(columns, { autoAlpha: 0, y: 22, duration: 0.6, stagger: 0.07 }, 0.15);
      if (wordmark) tl.from(wordmark, { autoAlpha: 0, y: 56, duration: 0.9 }, 0.1);
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="lg:hidden">
      {/* Un div y no `<Container>`, por lo mismo que `SiteHeader`: su escala
          `site` es `px-[60px]` FIJO en todos los breakpoints, y en un teléfono
          de 390px eso es casi un tercio del ancho de gutter. Misma escala que
          el header, para que los links del footer arranquen en la misma
          vertical que el logo de arriba. */}
      <div className="flex flex-col items-center gap-16 px-6 pb-24 pt-24 sm:px-10">
        <p data-footer-headline className="text-h2 text-center text-cream text-pretty">
          Where money
          <br />
          <Accent>actually moves.</Accent>
        </p>
        <LinkColumns dark columns="two" />
      </div>
    </div>
  );
}

export default function SiteFooter() {
  // El footer ya no se remonta con cada página: vive en el layout, que
  // sobrevive a la navegación de cliente. Sin esta dependencia el
  // ScrollTrigger se quedaría midiendo contra el `maxScroll` de la página
  // ANTERIOR — el umbral del takeover caería en cualquier lado.
  const pathname = usePathname();

  const rootRef = useMotionScope<HTMLElement>(
    ({ q, scope, motionOk, isDesktop }) => {
      const wipe = q("[data-footer-wipe]")[0];
      const panel = q("[data-footer-panel]")[0];
      const wordmark = q("[data-footer-wordmark]")[0];
      const legal = q("[data-footer-legal]")[0];
      const parts = q("[data-footer-bounce]");
      if (!wipe || !panel || !wordmark || parts.length === 0) return;

      // Sin motion o en mobile no hay takeover: queda la versión estática.
      if (!motionOk || !isDesktop) return;

      // ── El reparto vertical (ver los TAKEOVER_* de arriba) ────────────────
      //
      // Va en JS y no en CSS a propósito: el alto del panel depende de cómo
      // envuelvan headline y columnas a cada ancho, y eso no es una constante
      // que se pueda escribir en un clamp(). Sale por dos custom properties
      // que el markup ya consume, así que el estado por defecto —sin JS, en
      // mobile, con reduced-motion— es el de siempre.
      const panelBox = panel.firstElementChild as HTMLElement | null;
      const fit = () => {
        if (!panelBox) return;

        // Se mide SIN recortar: si no, cada medición partiría del recorte que
        // dejó la anterior y el logo se iría achicando solo.
        scope.style.setProperty("--footer-wordmark-h", "auto");
        scope.style.setProperty("--footer-takeover-gap", `${TAKEOVER_GAP_MAX}px`);

        const natural = wordmark.getBoundingClientRect().height;
        const content = panelBox.getBoundingClientRect().height - TAKEOVER_GAP_MAX;
        // La fila del copyright vive DEBAJO del logo, así que es alto que el
        // reparto no tiene para dar.
        const legalH = legal ? legal.getBoundingClientRect().height : 0;
        const room = window.innerHeight - TAKEOVER_TOP_MIN - content - legalH;

        const gap = Math.min(TAKEOVER_GAP_MAX, Math.max(TAKEOVER_GAP_MIN, room - natural));
        const h = Math.max(WORDMARK_MIN_H, Math.min(natural, room - gap));

        scope.style.setProperty("--footer-takeover-gap", `${Math.round(gap)}px`);
        scope.style.setProperty(
          "--footer-wordmark-h",
          h < natural - 0.5 ? `${Math.round(h)}px` : "auto"
        );
      };

      // Antes del trigger: el recorte cambia el alto del documento, y
      // `start`/`end` se miden contra `maxScroll`.
      fit();

      // El disparador es una distancia AL FONDO DEL DOCUMENTO: a PULL_PX del
      // máximo scroll arranca el wipe y un tirón lleva la página sola hasta el
      // borde. Números absolutos contra maxScroll (un string tipo
      // "bottom bottom" no puede expresar esto), re-evaluados en cada refresh.
      const PULL_PX = 100;
      const scroller = document.scrollingElement ?? document.documentElement;

      // Las dos condiciones que el takeover da por sentadas. Mientras el footer
      // vivió solo en homepage-v2 y en protocol ninguna podía fallar; como
      // footer de TODO el sitio, las dos fallan en páginas que ya existen.
      //
      // Se evalúan en cada llamada y no una vez al montar, porque el documento
      // se sigue moviendo después del primer paint.
      const canTakeover = () => {
        // 1) La página tiene que dar para al menos un viewport de scroll. Si no,
        //    `start` nace negativo, el trigger arranca ya adentro del rango y el
        //    takeover dispara SOLO al montar — tapando la página entera con el
        //    wipe sin que nadie haya scrolleado. Pasa en los stubs y en un blog
        //    filtrado sin resultados.
        if (ScrollTrigger.maxScroll(window) < window.innerHeight) return false;

        // 2) El footer tiene que ser lo ÚLTIMO del documento. El wipe se ancla a
        //    su borde inferior y crece 100svh para cubrir el viewport exacto, lo
        //    que solo cierra si ese borde ES el fondo de la página. En `(site)`
        //    puede no serlo: `BannerHost slot="bottom"` se monta DESPUÉS del
        //    footer y un banner en modo push ocupa flujo, así que el umbral
        //    (medido contra maxScroll) caería recién con el footer ya scrolleado
        //    fuera de vista. Con un banner así activo queda la versión estática.
        const doc = document.documentElement;
        const scrolled = window.scrollY || doc.scrollTop;
        const footerBottom = scope.getBoundingClientRect().bottom + scrolled;
        return doc.scrollHeight - footerBottom < 4;
      };

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

      // ── El tirón ──────────────────────────────────────────────────────────
      //
      // Los últimos ~100px los recorre la página sola. Va POR LENIS cuando hay
      // smooth scroll: Lenis escribe `scrollTop` en cada frame desde su propia
      // posición interpolada, así que un `gsap.to(scroller, { scrollTop })` se
      // le pisa de a un frame por vez — los dos escribiendo la misma propiedad
      // en el mismo frame. Eso era el tironeo al llegar al footer.
      //
      // Sin Lenis (reduced-motion, /blog) el scroll nativo no tiene dueño y el
      // tween sirve igual: `scrollTop` es una propiedad numérica normal, no
      // hace falta ScrollToPlugin.
      const pull = () => {
        const target = ScrollTrigger.maxScroll(window);
        // Ya está abajo: sin esto, cruzar el umbral dos veces seguidas
        // re-dispara un tirón de cero px que igual emite eventos de scroll.
        if (Math.abs(scroller.scrollTop - target) < 2) return;

        const lenis = getLenis();
        if (lenis) {
          // `lock: true` durante los 450ms del tirón. No es por autoridad: sin
          // lock, la inercia que el usuario todavía trae cancela el `scrollTo`
          // a mitad de camino y el takeover queda abierto con la página SIN
          // llegar al fondo — o sea con una franja de la sección anterior
          // asomando debajo del negro. Y el forcejeo entre los dos hace que la
          // dirección del scroll oscile, que es lo que re-dispara el trigger
          // en loop.
          lenis.scrollTo(target, { duration: 0.45, lock: true, force: true });
          return;
        }
        gsap.to(scroller, {
          scrollTop: target,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      // El tirón pierde SIEMPRE contra el usuario escapando hacia arriba —
      // pero sólo hay algo que matar en el camino sin Lenis: el `scrollTo`
      // bloqueado dura 450ms y termina solo, y cancelarlo moviendo el scroll a
      // mano es justamente lo que lo desincroniza.
      const releasePull = () => {
        if (!getLenis()) gsap.killTweensOf(scroller);
      };

      const takeover = (on: boolean) => {
        if (on) {
          if (!canTakeover()) return;
          tl.play();
          gsap.to(wipe, {
            height: window.innerHeight,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
          pull();
        } else {
          releasePull();
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
      const st = ScrollTrigger.create({
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

      // `start`/`end` son funciones, así que solo se re-evalúan en un refresh.
      // En `app/(motion)` y `/prototype` lo dispara `PrototypeMotionProvider`;
      // en `app/(site)` NO hay refresh coordinado —`LenisProvider` lo omite a
      // propósito— y la altura igual se sigue moviendo: la fuente swapea, las
      // portadas del blog decodifican tarde. Sin esto el umbral se queda
      // clavado en el maxScroll del primer paint.
      //
      // Es `st.refresh()`, el de la INSTANCIA, no `ScrollTrigger.refresh()`.
      // El global mueve window.scrollY para re-medir y eso desincroniza a
      // Lenis hasta congelarlo en páginas largas — el motivo exacto por el que
      // LenisProvider lo evita. El de la instancia solo recalcula este
      // start/end y no toca el scroll.
      let refreshTimer: ReturnType<typeof setTimeout>;
      let lastHeight = document.documentElement.scrollHeight;
      const ro = new ResizeObserver(() => {
        const h = document.documentElement.scrollHeight;
        // El umbral de 4px evita realimentarse con su propio reflow.
        if (Math.abs(h - lastHeight) < 4) return;
        lastHeight = h;
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => st.refresh(), 150);
      });
      ro.observe(document.documentElement);

      // El reparto depende del alto Y del ancho del viewport (el logo mide un
      // 25% del ancho), así que se recalcula en cualquier resize —no alcanza
      // con el ResizeObserver de arriba, que mira el alto del DOCUMENTO— y una
      // vez más cuando la fuente termina de cargar, porque el swap cambia el
      // alto del panel.
      let fitTimer: ReturnType<typeof setTimeout>;
      const refit = () => {
        clearTimeout(fitTimer);
        fitTimer = setTimeout(() => {
          fit();
          st.refresh();
        }, 150);
      };
      window.addEventListener("resize", refit);
      document.fonts?.ready.then(refit);

      return () => {
        window.removeEventListener("resize", refit);
        clearTimeout(fitTimer);
        scope.style.removeProperty("--footer-wordmark-h");
        scope.style.removeProperty("--footer-takeover-gap");
        ro.disconnect();
        clearTimeout(refreshTimer);
        st.kill();
        gsap.killTweensOf([scroller, wipe, panel, ...parts]);
        gsap.set(parts, { clearProps: "transform" });
        gsap.set(wipe, { clearProps: "height" });
        gsap.set(panel, { clearProps: "transform,opacity,visibility" });
      };
    },
    [pathname]
  );

  return (
    // Sin overflow-hidden en el root, a propósito: tanto el wipe (100svh)
    // como el panel (bottom-full) viven por ENCIMA del borde superior del
    // footer — recortarlos mataría el takeover en silencio.
    //
    // `z-30` NO es decorativo: sin él el takeover se dibuja DEBAJO de la última
    // sección de la página. Estar después en el DOM no alcanza. Una sección
    // `relative` sin z-index propio no crea stacking context, así que sus hijos
    // con z positivo (en `ClosingCta`: el scrim `z-10` y el copy `z-20`) se
    // promueven al contexto RAÍZ — y ahí se pintan en el paso de "z-index
    // positivo", que va después del de "posicionados sin z-index", donde caía
    // este footer con su `z-index: auto`. Resultado: el scrim atenuaba el panel
    // y el headline le quedaba encima.
    //
    // 30 y no más: `SiteHeader` es `fixed z-50` y tiene que seguir por encima,
    // igual que el nav de los prototipos. Las secciones no pasan de `z-20`.
    // `isolate` se queda para que el wipe/panel/legal de adentro (z-1..3) no se
    // filtren a su vez hacia afuera.
    <footer
      ref={rootRef}
      className="relative isolate z-30 bg-ink text-cream lg:bg-cream lg:pt-40 lg:text-foreground"
    >
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
        {/* Misma caja que el wordmark real —mismo alto, mismo overflow— para
            que el recorte de pantallas bajas caiga en la MISMA línea en los
            dos: si acá quedara anclada al fondo, el corte duro entre el blanco
            y el negro se partiría en dos alturas distintas. */}
        <div
          data-footer-bounce
          className={`absolute inset-x-0 bottom-0 overflow-hidden ${WORDMARK_MAX_W}`}
          style={{ height: "var(--footer-wordmark-h, auto)" }}
        >
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

      <StaticFooter />

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
        {/* El aire hasta el wordmark es lo PRIMERO que cede en una pantalla
            baja (de 4.5rem a 2.5rem) antes de tocar el logo. */}
        <Container
          className="grid gap-16 lg:grid-cols-[1fr_auto] lg:gap-24"
          style={{ paddingBottom: "var(--footer-takeover-gap, 4.5rem)" }}
        >
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
          lo va reemplazando con un corte duro. `overflow-hidden` recorta el
          overshoot de las letras redondas (ver WORDMARK_CROP_PCT) y, en
          pantallas bajas, también el pie del logo (ver TAKEOVER_*). */}
      <div
        data-footer-bounce
        data-footer-wordmark
        className={`relative z-[1] overflow-hidden ${WORDMARK_MAX_W}`}
        style={{ height: "var(--footer-wordmark-h, auto)" }}
      >
        <Image
          src="/prototype/v2/near-wordmark.svg"
          alt="NEAR"
          width={WORDMARK_W}
          height={WORDMARK_H}
          unoptimized
          className="block h-auto w-full max-lg:invert"
          style={{ marginBottom: `-${WORDMARK_CROP_PCT}%` }}
        />
      </div>

      {/* El copyright, en FLUJO debajo del wordmark y alineado con el borde
          derecho del logo —o sea, bajo el remate de la "r"— y no contra el
          gutter del Container, que en pantallas anchas lo dejaba lejos del
          logo. Antes era absoluto contra el fondo del footer y en pantallas
          bajas caía ENCIMA de las letras.

          Sigue por encima del wipe para no quedar sepultado por el negro;
          `mix-blend-difference` con source gris funciona sobre los DOS
          estados: sobre cream cae oscuro, sobre el negro del wipe queda
          claro. No necesita variante dark.

          Los links legales ya no están acá: subieron a su propia columna. */}
      <div
        data-footer-legal
        className={`relative z-[3] flex justify-center px-6 pb-5 pt-3 mix-blend-difference sm:px-10 lg:justify-end lg:px-5 ${WORDMARK_MAX_W}`}
      >
        <p className="text-body-sm text-neutral-400">© 2026 NEAR. All rights reserved.</p>
      </div>
    </footer>
  );
}
