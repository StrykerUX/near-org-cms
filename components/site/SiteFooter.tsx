"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

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

// Los cuatro grupos transcritos del tab Footer de "near.org - sitemap" (Google
// Doc). Sin las descripciones por link, que el doc lista solo bajo Navigation.
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
];

const LEGAL: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Cookie Policy", href: "/cookie-policy" },
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

// Los grupos de links, una sola vez: los renderizan la versión estática de
// mobile (cream) y el panel del takeover (sobre negro) con paletas distintas.
function LinkColumns({ dark }: { dark: boolean }) {
  const linkClass = `text-body-sm transition-colors ${
    dark ? "text-cream/70 hover:text-cream" : "text-muted-foreground hover:text-foreground"
  }`;

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
      ))}
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
      const parts = q("[data-footer-bounce]");
      if (!wipe || !panel || parts.length === 0) return;

      // Sin motion o en mobile no hay takeover: queda la versión estática.
      if (!motionOk || !isDesktop) return;

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

      return () => {
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

      {/* Mobile / reduced-motion: el footer completo, estático en cream. En lg
          desaparece — ahí el contenido vive en el panel. */}
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
          el overshoot de las letras redondas (ver WORDMARK_CROP_PCT). */}
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
              <li key={item.label}>
                <Link
                  href={item.href ?? "#"}
                  className="text-body-sm transition-opacity hover:opacity-70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
