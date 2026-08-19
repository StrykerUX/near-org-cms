import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import NewsletterLabFrame from "@/components/sections/newsletter-labs/NewsletterLabFrame";
import { NEWSLETTER_VARIANTS } from "@/components/sections/newsletter-labs/newsletterLabContent";

import Belongs01Marquee from "@/components/sections/newsletter-labs/Belongs01Marquee";
import Belongs02Rule from "@/components/sections/newsletter-labs/Belongs02Rule";
import Belongs03Split from "@/components/sections/newsletter-labs/Belongs03Split";
import Belongs04Inline from "@/components/sections/newsletter-labs/Belongs04Inline";
import Belongs05Halo from "@/components/sections/newsletter-labs/Belongs05Halo";
import Belongs06Grain from "@/components/sections/newsletter-labs/Belongs06Grain";
import Belongs07Column from "@/components/sections/newsletter-labs/Belongs07Column";
import Belongs08Field from "@/components/sections/newsletter-labs/Belongs08Field";

// Ocho versiones de la banda "NEAR belongs to you", cada una con sus dos vecinas
// de la homepage alrededor.
//
// ── Las ocho en UNA ruta, al revés que el lab del stack ────────────────────
//
// `stack-labs` reparte sus cinco variantes en cinco rutas porque cada una monta
// ~287KB de paths y un track sticky. Acá no hay nada de eso: la sección más
// pesada es la que anima un radial, y solo cinco de las ocho montan el
// `ShineField` (que sí abre un contexto WebGL2 por instancia — cinco está
// holgadamente por debajo del límite del navegador).
//
// Y hay una razón positiva, no solo la ausencia de un impedimento: estas ocho se
// diferencian sobre todo por el FONDO, y el fondo se juzga comparando. Cambiar
// de página entre una y otra obliga a recordar el color en vez de verlo.
//
// ── Los ocho están escritos a mano y no salen de un .map() ────────────────
//
// Mismo criterio que `HeroAltView` y `ProofAltView`: la correspondencia entre
// cada ficha y su variante tiene que leerse de un tirón.
export default function NewsletterLabView() {
  return (
    <main className="flex flex-col bg-cream">
      <Container as="header" className="py-20 md:py-28">
        <Eyebrow className="opacity-50">Newsletter lab · 8 variantes</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[22ch]">Ocho maneras de pedir un correo</h1>
        <p className="text-body-lg mt-6 max-w-[62ch] opacity-70">
          La banda «NEAR belongs to you», ocho veces, con la misma copy: el
          wordmark, el claim, el párrafo y el campo. Lo que cambia es la
          composición, el fondo y la forma del campo.
        </p>
        <p className="text-body-sm mt-5 max-w-[62ch] opacity-60">
          Las escaleras que hoy abren y cierran la sección quedaron FUERA de las
          ocho: todas resuelven la juntura de otra manera, o con un corte recto.
          Cada variante va con sus dos vecinas de la homepage —el blanco de las
          pruebas encima, el crema de customer stories debajo— para que el corte
          se vea.
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {NEWSLETTER_VARIANTS.map((v) => (
            <a
              key={v.id}
              href={`#${v.id}`}
              className="text-label underline underline-offset-4"
            >
              {v.index} {v.title}
            </a>
          ))}
        </nav>
      </Container>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[0]}>
        <Belongs01Marquee />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[1]}>
        <Belongs02Rule />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[2]}>
        <Belongs03Split />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[3]}>
        <Belongs04Inline />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[4]}>
        <Belongs05Halo />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[5]}>
        <Belongs06Grain />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[6]}>
        <Belongs07Column />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[7]}>
        <Belongs08Field />
      </NewsletterLabFrame>
    </main>
  );
}
